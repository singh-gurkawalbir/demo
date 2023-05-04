/* eslint-disable func-names */
import {
  put,
  select,
  call,
  takeEvery,
  take,
  fork,
  cancel,
} from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import { keys } from 'lodash';
import { selectors } from '../../../reducers';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { evaluateExternalProcessor } from '../../editor';
import processorLogic from '../../../reducers/session/editors/processorLogic';
import { getResource } from '../../resources';
import {
  requestSampleDataForExports,
  requestSampleDataForImports,
  updateStateForProcessorData,
  handleFlowDataStageErrors,
  getFlowResourceNode,
  getPreProcessedResponseMappingData,
  getFlowStageData,
  requestSampleDataForRouters,
} from '../utils/flowDataUtils';
import {
  updateFlowsDataForResource,
  updateFlowData,
  updateFlowOnResourceUpdate,
} from './flowUpdates';
import {
  getSampleDataStage,
  getCurrentSampleDataStageStatus,
  getPreviewStageData,
  getBlobResourceSampleData,
  isOneToManyResource,
  generatePostResponseMapData,
  getAllDependentSampleDataStages,
  getFormattedResourceForPreview,
} from '../../../utils/flowData';
import { exportPreview, pageProcessorPreview } from '../utils/previewCalls';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from '../sampleDataGenerator/fileAdaptorSampleData';
import mappingUtil from '../../../utils/mapping';
import { processOneToManySampleData } from '../../../utils/sampleData';
import {
  isNewId,
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isBlobTypeResource,
  isAS2Resource,
  isRestCsvMediaTypeExport,
} from '../../../utils/resource';
import { isIntegrationApp } from '../../../utils/flows';
import { emptyObject } from '../../../constants';
import { getConstructedResourceObj } from './utils';
import { getMockOutputFromResource } from '../../../utils/flowDebugger';
import customCloneDeep from '../../../utils/customCloneDeep';
import { loadFlowResourceUIFields } from '../../uiFields';

const VALID_RESOURCE_TYPES_FOR_FLOW_DATA = ['flows', 'exports', 'imports', 'connections'];

export function* _initFlowData({ flowId, resourceId, resourceType, refresh, formKey }) {
  const { merged: flow } = yield select(selectors.resourceData, 'flows', flowId);
  const clonedFlow = deepClone(flow || {});

  if (isNewId(flowId)) {
    clonedFlow._id = flowId;
  }

  if (isNewId(resourceId)) {
    // For a new export/lookup/import initiating flow with this new temp id
    const resource = (yield select(
      selectors.resourceData,
      resourceType,
      resourceId,
    ))?.merged || emptyObject;
    const isPageGenerator = resourceType === 'exports' && !resource.isLookup;
    const processorType = isPageGenerator ? 'pageGenerators' : 'pageProcessors';

    // creates a temp page processor / page generator on flow doc
    // Sample Lookup on Flow Doc: { _id: 456, pageGenerators: [], pageProcessors: [{type: 'export', _exportId: 123}]}
    clonedFlow[processorType] = [
      ...(clonedFlow[processorType] || []),
      {
        type: resourceType === 'exports' ? 'export' : 'import',
        [isPageGenerator || resource.isLookup
          ? '_exportId'
          : '_importId']: resourceId,
      },
    ];
  }
  clonedFlow.refresh = !!refresh;
  if (formKey) {
    clonedFlow.formKey = formKey;
  }
  yield put(actions.flowData.init(clonedFlow));
}

export function* requestSampleData({
  flowId,
  resourceId,
  resourceType,
  stage,
  editorId,
  refresh = false,
  formKey,
  routerId,
  isInitialized,
  onSagaEnd,
}) {
  if (!flowId || !resourceId || !VALID_RESOURCE_TYPES_FOR_FLOW_DATA.includes(resourceType)) return;

  // TODO: @Raghu: I dont know where the best place for this code is to go...
  // probably the only time we need sample data for a connection is
  // for the AS2 routing script. This script acts on incoming AS2
  // traffic (like a webhook) and the purpose of the script is to
  // determine what flow the data should be routed to. So sample data is
  // what the AS2 messages look like. Devesh will know the details of this.
  if (resourceType === 'connections') {
    return { as2: { sample: { data: 'coming soon' } } };
  }

  // isInitialized prop is passed explicitly from internal sagas calling this Saga
  if (!isInitialized) {
    yield call(_initFlowData, { flowId, resourceId, resourceType, refresh, formKey });
    // loads the UI fields for the resource if not already loaded
    yield call(loadFlowResourceUIFields, { flowId });
  }

  if (refresh) {
    const stagesToRefresh = getAllDependentSampleDataStages(stage, resourceType);

    // refresh prop updates dependent stages to refresh
    // and resets sample data before this resourceId in flow state to fetch again from the root
    // cases: NS/SF expects this refresh prop to fetch from NS/SF (refreshCache)
    // Used currently for Mapping refresh ( stage - importMapping )
    // TODO @Raghu: Figure out if this can be used else where to simplify the process
    yield put(actions.flowData.resetStages(flowId, resourceId, stagesToRefresh, 'refresh'));
  }

  // Updates preProcessedData for the processors
  const sampleDataStage = getSampleDataStage(stage, resourceType);

  // Updates sample data stage status as requested
  yield put(actions.flowData.requestStage(flowId, resourceId, sampleDataStage));

  try {
    if (resourceType === 'flows') {
      yield call(requestSampleDataForRouters, {
        flowId,
        routerId,
        editorId,
        hidden: true,
        sampleDataStage,
      });
    } else if (resourceType === 'imports') {
      yield call(requestSampleDataForImports, {
        flowId,
        resourceId,
        hidden: true,
        sampleDataStage,
      });
    } else {
      yield call(requestSampleDataForExports, {
        flowId,
        resourceId,
        sampleDataStage,
        hidden: true,
      });
    }

    if (!isInitialized && onSagaEnd) onSagaEnd();
  } catch (e) {
    yield call(handleFlowDataStageErrors, {
      flowId,
      resourceId,
      stage: sampleDataStage,
      error: e,
    });

    if (!isInitialized && onSagaEnd) onSagaEnd(true);

    // using isInitialized to handle base case not to throw error
    // Error is thrown from the root stage to the main stage for which sample data is requested
    // Ex: requestSampleDat(stage: 'outputFilter') and Error is at raw stage.
    // All raw, transform, hooks stages on which outputFilter depends are updated with error
    if (isInitialized) throw e;
  }
}

export function* fetchPageProcessorPreview({
  flowId,
  _pageProcessorId,
  routerId,
  previewType,
  editorId,
  hidden,
  refresh,
  resourceType = 'exports',
}) {
  if (!flowId || (!_pageProcessorId && !routerId)) return;
  const { formKey, refresh: flowDataRefresh } = (yield select(selectors.getFlowDataState, flowId)) || {};
  let resource = yield call(getConstructedResourceObj, {
    resourceId: _pageProcessorId,
    resourceType,
    formKey,
  });

  resource = getFormattedResourceForPreview(resource);
  const previewData = yield call(pageProcessorPreview, {
    flowId,
    _pageProcessorId,
    routerId,
    _pageProcessorDoc: formKey ? resource : undefined,
    previewType,
    resourceType,
    hidden,
    editorId,
    throwOnError: true,
    refresh: refresh || flowDataRefresh,
    runOffline: true,
  });

  const {data: existingPreviewData} = yield select(selectors.getSampleDataContext,
    { flowId, resourceId: _pageProcessorId, resourceType, stage: previewType });

  // in case on hard refresh and flow preview doesnt return data,
  // dont empty the state, rather use old preview data
  if (flowDataRefresh && existingPreviewData && !previewData) {
    return yield put(
      actions.flowData.setStatusReceived(
        flowId,
        _pageProcessorId,
        previewType
      )
    );
  }
  yield put(
    actions.flowData.receivedPreviewData(
      flowId,
      _pageProcessorId || routerId,
      previewData,
      previewType
    )
  );
}

export function* fetchPageGeneratorPreview({ flowId, _pageGeneratorId }) {
  if (!flowId || !_pageGeneratorId) return;
  const { formKey } = (yield select(selectors.getFlowDataState, flowId)) || {};

  const resource = yield call(getConstructedResourceObj, {
    resourceId: _pageGeneratorId,
    resourceType: 'exports',
    formKey,
  });
  const { merged: connection } = yield select(
    selectors.resourceData,
    'connections',
    resource._connectionId,
  );
  const { merged: flow = {} } = yield select(selectors.resourceData, 'flows', flowId);

  let previewData;

  const mockOutput = getMockOutputFromResource(resource);

  if (mockOutput) {
    previewData = mockOutput;
  } else if (isBlobTypeResource(resource)) {
    // Incase of Blob resource, sample data ( Blob type ) is uploaded to S3 in real time
    // So, its key (blobKey) is the sample data
    previewData = getBlobResourceSampleData();
  } else if (
    isFileAdaptor(resource) ||
    isAS2Resource(resource) ||
    isRestCsvMediaTypeExport(resource, connection)
  ) {
    // fetch data for file adaptors , AS2 and Rest CSV Media type resource and get parsed based on file type to JSON
    previewData = yield call(requestFileAdaptorSampleData, { resource, formKey });
  } else if (isRealTimeOrDistributedResource(resource)) {
    // fetch data from real time sample data
    previewData = yield call(requestRealTimeMetadata, { resource });
  } else if (isIntegrationApp(flow) && resource.sampleData) {
    // Incase of an existing connector flow with sampleData on export, we show the same when requested for preview data
    previewData = resource.sampleData;
  } else {
    previewData = yield call(exportPreview, {
      resourceId: _pageGeneratorId,
      runOffline: true,
      throwOnError: true,
      flowId,
      formKey,
    });
    previewData = getPreviewStageData(previewData, 'parse');
  }

  yield put(
    actions.flowData.receivedPreviewData(
      flowId,
      _pageGeneratorId,
      previewData,
      'raw'
    )
  );
}

export function* _processData({ flowId, resourceId, processorData, stage }) {
  const { wrapInArrayProcessedData, removeDataPropFromProcessedData, isFilterScript, sampleData } =
    processorData || {};
  const processedData = yield call(evaluateExternalProcessor, { processorData });

  yield call(updateStateForProcessorData, {
    flowId,
    resourceId,
    stage,
    processedData,
    wrapInArrayProcessedData,
    removeDataPropFromProcessedData,
    isFilterScript,
    sampleData,
  });
}

// Handles processing mappings against preProcessorData supplied
// @TODO Raghu:  merge this in processData
export function* _processMappingData({
  flowId,
  resourceId,
  mappings,
  stage,
  preProcessedData,
  options,
}) {
  const body = {
    rules: {
      rules: [mappings],
    },
    data: preProcessedData ? [preProcessedData] : [],
    options,
  };
  // call processor data specific to mapper as it is not part of editors saga
  const path = '/processors/mapperProcessor';
  const opts = {
    method: 'POST',
    body,
  };

  const processedMappingData = yield call(apiCallWithRetry, {
    path,
    opts,
    hidden: true,
  });

  const mappedObject = processedMappingData?.data?.[0]?.mappedObject;
  const processedData = {
    data: [mappedObject],
  };

  yield put(
    actions.flowData.receivedProcessorData(
      flowId,
      resourceId,
      stage,
      processedData
    )
  );
}

// response transform only works on _json part of mockResponse
// after transform is evaluated merge it into _json of mockResponse
export function* _processResponseTransformData({ flowId, resourceId, resource, processorData, stage, hasNoRulesToProcess }) {
  const { wrapInArrayProcessedData, removeDataPropFromProcessedData } =
    processorData || {};
  const {mockResponse} = resource || {};
  let processedData;

  if (!hasNoRulesToProcess) {
    const transformedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    processedData = mockResponse ? {
      data: [
        {
          ...mockResponse[0],
          _json: transformedData?.data[0] || transformedData?.data || transformedData,
        },
      ],
    } : transformedData;
  } else {
    processedData = { data: mockResponse };
  }

  yield call(updateStateForProcessorData, {
    flowId,
    resourceId,
    stage,
    processedData,
    wrapInArrayProcessedData,
    removeDataPropFromProcessedData,
  });
}

export function* _getContextSampleData({ data, editorType, resourceType, resourceId, flowId }) {
  const fieldPath = (editorType === 'inputFilter' && resourceType === 'exports') ? 'inputFilter' : 'filter';
  const flow = yield select(selectors.resource, 'flows', flowId);
  const resource = yield select(selectors.resource, resourceType, resourceId);
  const body = {
    sampleData: data,
    templateVersion: 2,
    flowId,
    integrationId: flow?._integrationId,
    fieldPath,
  };

  body[resourceType === 'imports' ? 'import' : 'export'] = { ...resource, oneToMany: false };

  try {
    const response = yield call(apiCallWithRetry, {
      path: '/processors/handleBar/getContext',
      opts: {
        method: 'POST',
        body,
      },
      hidden: true,
    });

    return response?.context;
  } catch (e) {
    return data;
  }
}

export function* requestProcessorData({
  flowId,
  resourceId,
  routerId,
  resourceType,
  processor,
  processorStage,
}) {
  // If provided processorStage is 'stage' else by default processor name becomes its stage
  const stage = processorStage || processor;
  let hasNoRulesToProcess = false;
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
  );
  const isPageGeneratorExport = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );

  let processorData;
  // The below data received is the wrapped form of sampleData which is needed as input for dependent stages
  const preProcessedData = yield call(getFlowStageData, {
    flowId,
    resourceId,
    routerId,
    resourceType,
    stage,
    isInitialized: true,
  });
  // The below data is plain raw sample data stored in state
  const {data: preProcessedSampleData} = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  if (stage === 'transform' || stage === 'responseTransform') {
    const transform = { ...resource[processor] };

    if (transform.type === 'expression') {
      const [rule] = transform.expression.rules || [];

      if (!(rule && rule.length)) {
        hasNoRulesToProcess = true;
      } else {
        // we use preProcessedSampleData instead of preProcessedData as transformation processor expects data without wrapper
        processorData = {
          data: preProcessedSampleData,
          rule,
          editorType: 'transform',
        };
      }
    } else if (transform.type === 'script') {
      const { _scriptId, function: entryFunction } = transform.script || {};

      if (_scriptId) {
        const script = !resource._connectorId ? (yield call(getResource, {
          resourceType: 'scripts',
          id: _scriptId,
        })) : {};

        processorData = {
          data: preProcessedData,
          rule: {
            code: script?.content,
            entryFunction,
            scriptId: _scriptId,
          },
          editorType: 'javascript',
          wrapInArrayProcessedData: true,
        };
      } else {
        hasNoRulesToProcess = true;
      }
    } else {
      hasNoRulesToProcess = true;
    }
    if (stage === 'responseTransform') {
      return yield call(_processResponseTransformData, {
        flowId,
        resource,
        resourceId,
        processorData,
        hasNoRulesToProcess,
        stage,
      });
    }
  } else if (['outputFilter', 'inputFilter'].includes(stage)) {
    let filterDoc;
    let editorType;

    if (stage === 'inputFilter') {
      editorType = 'inputFilter';
      filterDoc = resource[resourceType === 'exports' ? 'inputFilter' : 'filter'] || {};
    } else {
      editorType = isPageGeneratorExport ? 'exportFilter' : 'outputFilter';
      filterDoc = resource.filter || {};
    }
    // call getContext to get canonical sample data
    const sampleData = yield call(_getContextSampleData, {
      data: preProcessedSampleData,
      resourceId,
      resourceType,
      flowId,
      editorType,
    });

    // use buildData to get filter/js data
    const buildData = processorLogic.buildData(editorType);
    const { filter, javascript } = buildData(undefined, sampleData);

    if (filterDoc.type === 'expression') {
      if (filterDoc.expression?.rules?.length) {
        processorData = {
          data: filter,
          rule: filterDoc.expression.rules,
          editorType: 'filter',
        };
      } else {
        hasNoRulesToProcess = true;
      }
    } else if (filterDoc.type === 'script') {
      const { _scriptId, function: entryFunction } = filterDoc.script || {};

      if (_scriptId) {
        const script = !resource._connectorId ? (yield call(getResource, {
          resourceType: 'scripts',
          id: _scriptId,
        })) : {};

        processorData = {
          data: javascript,
          rule: {
            code: script?.content,
            entryFunction,
            scriptId: _scriptId,
          },
          editorType: 'javascript',
          isFilterScript: true,
          sampleData: preProcessedData,
        };
      } else {
        hasNoRulesToProcess = true;
      }
    } else {
      hasNoRulesToProcess = true;
    }
  } else if (
    // Below list are all Possible hook types
    [
      'preSavePage',
      'preMap',
      'postMap',
      'postSubmit',
      'postAggregate',
    ].includes(stage)
  ) {
    const { hooks = {} } = { ...resource };
    const hook = hooks[stage] || {};

    if (hook._scriptId) {
      const scriptId = hook._scriptId;
      // IAs don't give access to script content
      const script = !resource._connectorId ? (yield call(getResource, {
        resourceType: 'scripts',
        id: scriptId,
      })) : {};
      const context = yield select(selectors.getScriptContext, {
        flowId,
        contextType: 'hook',
      });
      const { content: code } = script;

      processorData = {
        data: preProcessedData,
        rule: {
          code,
          entryFunction: hook.function,
          scriptId,
        },
        context,
        removeDataPropFromProcessedData: stage === 'preMap',
        editorType: 'javascript',
      };
    } else {
      hasNoRulesToProcess = true;
    }
  } else if (stage === 'importMappingExtract') {
    // It does not have a processor, as it just copies its sampleData stage's data into its state, to enhance readability
    // So making hasNoRulesToProcess to true
    hasNoRulesToProcess = true;
  } else if (stage === 'importMapping') {
    // mapping fields are processed here against raw data
    let resourceMappings;
    const lookups = resource?.lookups || [];
    const options = {};

    if (resource?.mappings?.length) { // v2 mappings, if present, are applied during import
      resourceMappings = {mappings: customCloneDeep(resource.mappings), lookups};

      const connection = yield select(selectors.resource, 'connections', resource?._connectionId);
      const flow = yield select(selectors.resource, 'flows', flowId);

      options.connection = connection;
      options._flowId = flowId;
      options._integrationId = flow?._integrationId;
      options.import = resource;
    } else {
      resourceMappings = mappingUtil.getMappingFromResource({
        importResource: resource,
        isFieldMapping: true,
      });
      resourceMappings = {...resourceMappings, lookups};
      // Incase of no fields/lists inside mappings , no need to make a processor call
      if (!resourceMappings.fields.length && !resourceMappings.lists.length) {
        hasNoRulesToProcess = true;
      }
    }

    if (!hasNoRulesToProcess && preProcessedData && resourceMappings) {
      return yield call(_processMappingData, {
        flowId,
        resourceId,
        mappings: resourceMappings,
        stage,
        preProcessedData,
        options,
      });
    }
    hasNoRulesToProcess = true;
  } else if (stage === 'responseMappingExtract') {
    // It does not have a processor, as it just copies its sampleData stage's data into its state, to enhance readability
    // So making hasNoRulesToProcess to true
    hasNoRulesToProcess = true;
  } else if (stage === 'responseMapping') {
    const flowNode = yield call(getFlowResourceNode, {
      flowId,
      resourceId,
      resourceType,
    });
    const mappings = flowNode?.responseMapping;
    const preProcessedResponseMappingData = yield call(
      getPreProcessedResponseMappingData,
      { resourceType, preProcessedData, adaptorType: resource?.adaptorType}
    );

    if (mappings?.fields?.length || mappings?.lists?.length) {
      return yield call(_processMappingData, {
        flowId,
        resourceId,
        mappings,
        stage,
        preProcessedData: preProcessedResponseMappingData,
      });
    }

    // Incase of no mappings defined, data is not proceeded further for this resource
    // So this stage's state is left undefined. It is up to the next stages to handle this
    return;
  } else if (stage === 'postResponseMap') {
    // For this stage, we need both flowData and rawData to merge and generate actual data
    // Raw Data is supplied through preProcessedData, FlowData is fetched below
    const flowData = yield call(getFlowStageData, {
      flowId,
      resourceId,
      resourceType,
      stage: 'inputFilter',
      isInitialized: true,
      noWrap: true,
    });
    const postResponseMapData = generatePostResponseMapData(
      flowData,
      preProcessedData
    );

    // wrapping inside { data: [postResponseMapData]} as this action expects data to be in that format
    // TODO @Raghu Create a received action which accepts the plain data as it is once BE supports stages data
    yield put(
      actions.flowData.receivedProcessorData(flowId, resourceId, stage, {
        data: [postResponseMapData],
      })
    );

    return;
  } else if (stage === 'processedFlowInput') {
    // processes oneToMany on the received flowInput data
    const { formKey } = (yield select(selectors.getFlowDataState, flowId)) || {};

    const resource = yield call(getConstructedResourceObj, {
      resourceId,
      resourceType,
      formKey,
    });

    if (isOneToManyResource(resource)) {
      const processedFlowInput = processOneToManySampleData(deepClone(preProcessedSampleData), resource);

      yield put(
        actions.flowData.receivedProcessorData(flowId, resourceId, stage, {
          data: [processedFlowInput],
        })
      );

      return;
    }
    hasNoRulesToProcess = true;
  } else {
    hasNoRulesToProcess = true;
  }

  if (hasNoRulesToProcess) {
    // update processorStage with pre processed data if there are no rules to process
    return yield call(updateStateForProcessorData, {
      flowId,
      resourceId,
      processedData: { data: preProcessedSampleData ? [preProcessedSampleData] : [] },
      stage,
    });
  }

  yield call(_processData, {
    flowId,
    resourceId,
    processorData,
    stage,
  });
}

/*
 * Save current executing saga against resource ids with stage
 * when new action comes, compare both stages and if curr stage is > prev stage then cancel that and fork this
 * TODO: @Raghu Come up with an appropriate name
 */
const takeLatestSampleData = (patternOrChannel, saga, ...args) =>
  fork(function* () {
    const sampleDataSagaMap = {};

    while (true) {
      const action = yield take(patternOrChannel);
      const { resourceId, resourceType, stage: currStage } = action;
      const onSagaEnd = function () {
        // Delete completed/erred Sagas
        // TODO @Raghu: figure out if we need to handle incase of saga error
        sampleDataSagaMap[resourceId] &&
          delete sampleDataSagaMap[resourceId][currStage];
      };

      // If it is the first one straight away start executing this saga
      if (!sampleDataSagaMap[resourceId]) {
        sampleDataSagaMap[resourceId] = {
          [currStage]: {
            stage: currStage,
            resourceType,
            forkedSaga: yield fork(
              saga,
              ...args.concat({ ...action, onSagaEnd })
            ),
          },
        };
      } else {
        // get list of all existing stages
        const prevStagesList = keys(sampleDataSagaMap[resourceId]);
        const {
          currentStageStatus,
          prevStage,
        } = getCurrentSampleDataStageStatus(
          prevStagesList,
          currStage,
          resourceType
        );

        // Incase of same stage , cancel previous saga and execute current one
        if (currentStageStatus === 0) {
          yield cancel(sampleDataSagaMap[resourceId][currStage].forkedSaga);
          sampleDataSagaMap[resourceId][currStage].forkedSaga = yield fork(
            saga,
            ...args.concat({ ...action, onSagaEnd })
          );
        }

        if (currentStageStatus > 0) {
          // Incase of status as 1, cancel previous saga as current saga takes precedence
          // Also delete the same from the map
          if (currentStageStatus === 1) {
            yield cancel(sampleDataSagaMap[resourceId][prevStage].forkedSaga);
            delete sampleDataSagaMap[resourceId][prevStage];
          }

          // Incase of statuses 1, 2 execute current saga
          sampleDataSagaMap[resourceId][currStage] = {
            stage: currStage,
            resourceType,
            forkedSaga: yield fork(
              saga,
              ...args.concat({ ...action, onSagaEnd })
            ),
          };
        }
      }
    }
  });

export default [
  takeLatestSampleData(
    actionTypes.FLOW_DATA.SAMPLE_DATA_REQUEST,
    requestSampleData
  ),
  takeEvery(
    actionTypes.FLOW_DATA.FLOWS_FOR_RESOURCE_UPDATE,
    updateFlowsDataForResource
  ),
  takeEvery(actionTypes.FLOW_DATA.FLOW_UPDATE, updateFlowData),
  takeEvery(actionTypes.RESOURCE.UPDATED, updateFlowOnResourceUpdate),
];

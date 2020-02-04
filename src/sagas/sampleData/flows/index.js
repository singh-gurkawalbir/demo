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
import { isEmpty } from 'lodash';
import { resourceData, getSampleData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { evaluateExternalProcessor } from '../../../sagas/editor';
import { getResource } from '../../resources';
import {
  requestSampleDataForExports,
  requestSampleDataForImports,
  updateStateForProcessorData,
  handleFlowDataStageErrors,
  getFlowResourceNode,
  getPreProcessedResponseMappingData,
  getFlowStageData,
} from '../utils/flowDataUtils';
import {
  updateFlowsDataForResource,
  updateFlowData,
  updateFlowOnResourceUpdate,
} from './flowUpdates';
import {
  getSampleDataStage,
  compareSampleDataStage,
  getPreviewStageData,
  getContextInfo,
  getBlobResourceSampleData,
  isOneToManyResource,
  generatePostResponseMapData,
} from '../../../utils/flowData';
import { exportPreview, pageProcessorPreview } from '../utils/previewCalls';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from '../sampleDataGenerator/fileAdaptorSampleData';
import mappingUtil from '../../../utils/mapping';
import { processOneToManySampleData } from '../../../utils/sampleData';
import {
  adaptorTypeMap,
  isNewId,
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isBlobTypeResource,
  isAS2Resource,
  isRestCsvMediaTypeExport,
} from '../../../utils/resource';

function* initFlowData({ flowId, resourceId, resourceType }) {
  const { merged: flow } = yield select(resourceData, 'flows', flowId);
  const clonedFlow = deepClone(flow);

  if (isNewId(flowId)) {
    clonedFlow._id = flowId;
  }

  if (isNewId(resourceId)) {
    // For a new export/lookup/import initiating flow with this new temp id
    const { merged: resource } = yield select(
      resourceData,
      resourceType,
      resourceId,
      'value'
    );
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

  yield put(actions.flowData.init(clonedFlow));
}

export function* requestSampleData({
  flowId,
  resourceId,
  resourceType,
  stage,
  refresh = false,
  isInitialized,
  onSagaEnd,
}) {
  if (!flowId || !resourceId) return;

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
    yield call(initFlowData, { flowId, resourceId, resourceType });
  }

  if (refresh) {
    // refresh prop resets the entire state from this resourceId in flow state to fetch again
    yield put(actions.flowData.reset(flowId, resourceId));
  }

  // Updates preProcessedData for the processors
  const sampleDataStage = getSampleDataStage(stage, resourceType);

  // Updates sample data stage status as requested
  yield put(actions.flowData.requestStage(flowId, resourceId, sampleDataStage));

  try {
    if (resourceType === 'imports') {
      yield call(requestSampleDataForImports, {
        flowId,
        resourceId,
        resourceType,
        hidden: true,
        sampleDataStage,
      });
    } else {
      yield call(requestSampleDataForExports, {
        flowId,
        resourceId,
        sampleDataStage,
      });
    }

    if (!isInitialized) onSagaEnd();
  } catch (e) {
    yield call(handleFlowDataStageErrors, {
      flowId,
      resourceId,
      stage: sampleDataStage,
      error: e,
    });

    if (!isInitialized) onSagaEnd(true);

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
  previewType,
  hidden,
  resourceType = 'exports',
}) {
  if (!flowId || !_pageProcessorId) return;

  try {
    let previewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId,
      previewType,
      resourceType,
      hidden,
      throwOnError: true,
    });
    const { merged: resource = {} } = yield select(
      resourceData,
      resourceType,
      _pageProcessorId,
      'value'
    );

    if (isOneToManyResource(resource)) {
      previewData = processOneToManySampleData(previewData, resource);
    }

    yield put(
      actions.flowData.receivedPreviewData(
        flowId,
        _pageProcessorId,
        previewData,
        previewType
      )
    );
  } catch (e) {
    // Error handler
    throw e;
  }
}

export function* fetchPageGeneratorPreview({ flowId, _pageGeneratorId }) {
  if (!flowId || !_pageGeneratorId) return;
  const { merged: resource = {} } = yield select(
    resourceData,
    'exports',
    _pageGeneratorId
  );
  const { merged: connection } = yield select(
    resourceData,
    'connections',
    resource._connectionId
  );

  try {
    let previewData;

    if (isBlobTypeResource(resource)) {
      // Incase of Blob resource, sample data ( Blob type ) is uploaded to S3 in real time
      // So, its key (blobKey) is the sample data
      previewData = getBlobResourceSampleData();
    } else if (
      isFileAdaptor(resource) ||
      isAS2Resource(resource) ||
      isRestCsvMediaTypeExport(resource, connection)
    ) {
      // fetch data for file adaptors , AS2 and Rest CSV Media type resource and get parsed based on file type to JSON
      previewData = yield call(requestFileAdaptorSampleData, { resource });
    } else if (isRealTimeOrDistributedResource(resource)) {
      // fetch data from real time sample data
      previewData = yield call(requestRealTimeMetadata, { resource });
    } else {
      previewData = yield call(exportPreview, {
        resourceId: _pageGeneratorId,
        runOffline: true,
        throwOnError: true,
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
  } catch (e) {
    // Error handler
    throw e;
  }
}

function* processData({ flowId, resourceId, processorData, stage }) {
  try {
    const { wrapInArrayProcessedData } = processorData || {};
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    yield call(updateStateForProcessorData, {
      flowId,
      resourceId,
      stage,
      processedData,
      wrapInArrayProcessedData,
    });
  } catch (e) {
    // Handle errors
    throw e;
  }
}

// Handles processing mappings against preProcessorData supplied
// @TODO Raghu:  merge this in processData
function* processMappingData({
  flowId,
  resourceId,
  mappings,
  stage,
  preProcessedData,
}) {
  const body = {
    rules: {
      rules: [mappings],
    },
    data: [preProcessedData],
  };
  // call processor data specific to mapper as it is not part of editors saga
  const path = `/processors/mapperProcessor`;
  const opts = {
    method: 'POST',
    body,
  };

  try {
    const processedMappingData = yield call(apiCallWithRetry, {
      path,
      opts,
      hidden: true,
    });
    const mappedObject =
      processedMappingData &&
      processedMappingData.data &&
      processedMappingData.data[0] &&
      processedMappingData.data[0].mappedObject;
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
  } catch (e) {
    throw e;
  }
}

/*
 * This saga handles 2 sample data stages
 * 1. flowInputWithContext 2. transformWithContext
 * Above stages are replica of flowInput and transform stage with added Context Info specifically for Input and outputFilter stages
 */
export function* requestSampleDataWithContext({
  flowId,
  resourceId,
  resourceType,
  stage,
}) {
  let sampleData = yield select(getSampleData, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  if (!sampleData) {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
      isInitialized: true,
    });
    sampleData = yield select(getSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
  }

  const { merged: resource = {} } = yield select(
    resourceData,
    resourceType,
    resourceId
  );
  let sampleDataWithContextInfo;

  if (sampleData) {
    sampleDataWithContextInfo = Array.isArray(sampleData)
      ? [...sampleData]
      : { ...sampleData };
  }

  // For resources other than real time , context info is passed
  // Any other conditions to not show context Info can be added here
  if (
    !isEmpty(sampleDataWithContextInfo) &&
    !(
      isRealTimeOrDistributedResource(resource, resourceType) &&
      isBlobTypeResource(resource)
    )
  ) {
    if (Array.isArray(sampleDataWithContextInfo)) {
      // Incase of array add context to the first object
      const [firstObject, ...rest] = sampleDataWithContextInfo;

      sampleDataWithContextInfo = [
        ...[{ ...firstObject, ...getContextInfo() }],
        ...rest,
      ];
    } else {
      sampleDataWithContextInfo = {
        ...sampleDataWithContextInfo,
        ...getContextInfo(),
      };
    }
  }

  yield put(
    actions.flowData.receivedPreviewData(
      flowId,
      resourceId,
      sampleDataWithContextInfo,
      stage
    )
  );
}

export function* requestProcessorData({
  flowId,
  resourceId,
  resourceType,
  processor,
  processorStage,
}) {
  // If provided processorStage is 'stage' else by default processor name becomes its stage
  const stage = processorStage || processor;
  let hasNoRulesToProcess = false;
  const { merged: resource } = yield select(
    resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  try {
    let processorData;
    const preProcessedData = yield call(getFlowStageData, {
      flowId,
      resourceId,
      resourceType,
      stage,
      isInitialized: true,
    });

    if (stage === 'transform' || stage === 'responseTransform') {
      const transform = { ...resource[processor] };

      if (transform.type === 'expression') {
        const [rule] = transform.expression.rules || [];

        if (!(rule && rule.length)) {
          hasNoRulesToProcess = true;
        } else {
          processorData = {
            data: preProcessedData,
            rule,
            processor: 'transform',
          };
        }
      } else if (transform.type === 'script') {
        const { _scriptId, function: entryFunction } = transform.script || {};

        if (_scriptId) {
          const script = yield call(getResource, {
            resourceType: 'scripts',
            id: _scriptId,
          });

          processorData = {
            data: preProcessedData,
            code: script && script.content,
            entryFunction,
            processor: 'javascript',
            wrapInArrayProcessedData: true,
          };
        } else {
          hasNoRulesToProcess = true;
        }
      } else {
        hasNoRulesToProcess = true;
      }
    }
    // Below list are all Possible hook types
    else if (
      ['hooks', 'preMap', 'postMap', 'postSubmit', 'postAggregate'].includes(
        stage
      )
    ) {
      const { hooks = {} } = { ...resource };
      // Default hooks stage is preSavePage for Exports
      // Other stages are hook stages for Imports
      const hookType = stage === 'hooks' ? 'preSavePage' : stage;
      const hook = hooks[hookType] || {};

      if (hook._scriptId) {
        const scriptId = hook._scriptId;
        const data = { data: [preProcessedData], errors: [] };
        const script = yield call(getResource, {
          resourceType: 'scripts',
          id: scriptId,
        });
        const { content: code } = script;

        processorData = {
          data,
          code,
          entryFunction: hook.function,
          processor: 'javascript',
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
      const appType =
        resource.adaptorType && adaptorTypeMap[resource.adaptorType];
      const mappings = mappingUtil.getMappingFromResource(
        resource,
        appType,
        true
      );

      if (preProcessedData && mappings)
        return yield call(processMappingData, {
          flowId,
          resourceId,
          mappings,
          stage,
          preProcessedData,
        });
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
      const mappings = (flowNode && flowNode.responseMapping) || {};
      const preProcessedResponseMappingData = yield call(
        getPreProcessedResponseMappingData,
        { resourceType, preProcessedData }
      );

      if (mappings && (mappings.fields.length || mappings.lists.length)) {
        return yield call(processMappingData, {
          flowId,
          resourceId,
          mappings,
          stage,
          preProcessedData: preProcessedResponseMappingData,
        });
      }

      hasNoRulesToProcess = true;
    } else if (stage === 'postResponseMap') {
      // For this stage, we need both flowData and rawData to merge and generate actual data
      // Raw Data is supplied through preProcessedData, FlowData is fetched below
      const flowData = yield call(getFlowStageData, {
        flowId,
        resourceId,
        resourceType,
        stage: 'flowInput',
        isInitialized: true,
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
    }

    if (hasNoRulesToProcess) {
      // update processorStage with pre processed data if there are no rules to process
      return yield call(updateStateForProcessorData, {
        flowId,
        resourceId,
        processedData: { data: [preProcessedData] },
        stage,
      });
    }

    yield call(processData, {
      flowId,
      resourceId,
      processorData,
      stage,
    });
  } catch (e) {
    throw e;
  }
}

/*
 * Save current executing saga against resource ids with stage
 * when new action comes, compare both stages and if curr stage is > prev stage then cancel that and fork this
 * TODO: @Raghu Come up with an appropriate name
 */
const takeLatestSampleData = (patternOrChannel, saga, ...args) =>
  fork(function*() {
    const sampleDataSagaMap = {};

    while (true) {
      const action = yield take(patternOrChannel);
      const { resourceId, resourceType, stage: currStage } = action;
      const onSagaEnd = function() {
        // Delete completed/erred Sagas
        // TODO @Raghu: figure out if we need to handle incase of saga error
        delete sampleDataSagaMap[resourceId];
      };

      // If it is the first one straight away start executing this saga
      if (!sampleDataSagaMap[resourceId]) {
        sampleDataSagaMap[resourceId] = {
          stage: currStage,
          resourceType,
          forkedSaga: yield fork(
            saga,
            ...args.concat({ ...action, onSagaEnd })
          ),
        };
      } else {
        // compare currStage with prevStage and decide what to do
        const { stage: prevStage } = sampleDataSagaMap[resourceId];
        const currentStageStatus = compareSampleDataStage(
          prevStage,
          currStage,
          resourceType
        );

        // Incase of same stage , cancel previous saga and execute current one
        if (currentStageStatus === 0) {
          yield cancel(sampleDataSagaMap[resourceId].forkedSaga);
          sampleDataSagaMap[resourceId].forkedSaga = yield fork(
            saga,
            ...args.concat({ ...action, onSagaEnd })
          );
        }

        if (currentStageStatus > 0) {
          // Incase of status as 1, cancel previous saga as current saga takes precedence
          if (currentStageStatus === 1) {
            yield cancel(sampleDataSagaMap[resourceId].forkedSaga);
          }

          // Incase of statuses 1, 2 execute current saga
          sampleDataSagaMap[resourceId] = {
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
  takeEvery(
    actionTypes.FLOW_DATA.PREVIEW_DATA_REQUEST,
    fetchPageProcessorPreview
  ),
  takeEvery(actionTypes.FLOW_DATA.PROCESSOR_DATA_REQUEST, requestProcessorData),
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

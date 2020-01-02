import { put, select, call, takeEvery, takeLatest } from 'redux-saga/effects';
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
} from '../utils/flowDataUtils';
import {
  updateFlowsDataForResource,
  updateFlowData,
  updateFlowOnResourceUpdate,
} from './flowUpdates';
import {
  getSampleDataStage,
  getPreviewStageData,
  getContextInfo,
  getBlobResourceSampleData,
  isOneToManyResource,
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

function* requestSampleData({
  flowId,
  resourceId,
  resourceType,
  stage,
  refresh = false,
  isInitialized,
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

  // Updates flow state
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
        sampleDataStage,
      });
    } else {
      yield call(requestSampleDataForExports, {
        flowId,
        resourceId,
        sampleDataStage,
      });
    }
  } catch (e) {
    yield call(handleFlowDataStageErrors, {
      flowId,
      resourceId,
      stage: sampleDataStage,
      error: e,
    });

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
  resourceType = 'exports',
}) {
  if (!flowId || !_pageProcessorId) return;

  try {
    let previewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId,
      previewType,
      resourceType,
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

  try {
    let previewData;

    if (isBlobTypeResource(resource)) {
      // Incase of Blob resource, sample data ( Blob type ) is uploaded to S3 in real time
      // So, its key (blobKey) is the sample data
      previewData = getBlobResourceSampleData();
    } else if (isFileAdaptor(resource) || isAS2Resource(resource)) {
      // fetch data for file adaptors and AS2 resource and get parsed based on file type to JSON
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
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    yield call(updateStateForProcessorData, {
      flowId,
      resourceId,
      stage,
      processedData,
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
 * 1. flowInputWithContext 2. hooksWithContext
 * Above stages are replica of flowInput and hooks stage with added Context Info specifically for Input and outputFilter stages
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
  let preProcessedData = yield select(getSampleData, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  try {
    let processorData;

    if (!preProcessedData) {
      yield call(requestSampleData, {
        flowId,
        resourceId,
        resourceType,
        stage,
        isInitialized: true,
      });
      preProcessedData = yield select(getSampleData, {
        flowId,
        resourceId,
        resourceType,
        stage,
      });
    }

    if (stage === 'transform' || stage === 'responseTransform') {
      const transform = { ...resource[processor] };
      const [rule] = transform.rules || [];

      if (!(rule && rule.length)) {
        hasNoRulesToProcess = true;
      }

      processorData = { data: preProcessedData, rule, processor: 'transform' };
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

      if (
        preProcessedData &&
        mappings &&
        (mappings.fields.length || mappings.lists.length)
      )
        return yield call(processMappingData, {
          flowId,
          resourceId,
          mappings,
          stage,
          preProcessedData,
        });
      hasNoRulesToProcess = true;
    }

    if (hasNoRulesToProcess) {
      // update processorStage with preprocessed data if there are no rules to process
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

export default [
  takeEvery(
    actionTypes.FLOW_DATA.PREVIEW_DATA_REQUEST,
    fetchPageProcessorPreview
  ),
  takeEvery(actionTypes.FLOW_DATA.PROCESSOR_DATA_REQUEST, requestProcessorData),
  takeLatest(actionTypes.FLOW_DATA.SAMPLE_DATA_REQUEST, requestSampleData),
  takeEvery(
    actionTypes.FLOW_DATA.FLOWS_FOR_RESOURCE_UPDATE,
    updateFlowsDataForResource
  ),
  takeEvery(actionTypes.FLOW_DATA.FLOW_UPDATE, updateFlowData),
  takeEvery(actionTypes.RESOURCE.UPDATED, updateFlowOnResourceUpdate),
];

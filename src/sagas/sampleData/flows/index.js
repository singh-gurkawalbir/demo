import { put, select, call, takeEvery, takeLatest } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
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
} from './utils';
import {
  updateFlowsDataForResource,
  updateFlowData,
  updateFlowOnResourceUpdate,
} from './flowUpdates';
import {
  getSampleDataStage,
  getPreviewStageData,
} from '../../../utils/flowData';
import { exportPreview, pageProcessorPreview } from '../previewCalls';
import mappingUtil from '../../../utils/mapping';
import { adaptorTypeMap, isNewId } from '../../../utils/resource';

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
    // @TODO Raghu: Can we be sure that flow doc has pageGenerators: [] and pageProcessors: []? or need a fail safe condition
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
  isInitialized,
}) {
  // Updates flow state
  if (!isInitialized) {
    yield call(initFlowData, { flowId, resourceId, resourceType });
  }

  // Updates preProcessedData for the procesors
  const sampleDataStage = getSampleDataStage(stage, resourceType);

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
}

export function* fetchPageProcessorPreview({
  flowId,
  _pageProcessorId,
  previewType,
  resourceType = 'exports',
}) {
  if (!flowId || !_pageProcessorId) return;

  try {
    const previewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId,
      previewType,
      resourceType,
    });

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
  }
}

export function* fetchPageGeneratorPreview({ flowId, _pageGeneratorId }) {
  if (!flowId || !_pageGeneratorId) return;

  try {
    const previewData = yield call(exportPreview, {
      resourceId: _pageGeneratorId,
      runOffline: true,
    });
    const parseData = getPreviewStageData(previewData, 'parse');

    yield put(
      actions.flowData.receivedPreviewData(
        flowId,
        _pageGeneratorId,
        parseData,
        'raw',
        true
      )
    );
  } catch (e) {
    // Error handler
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
  }
}

// Handles processing mappings against preProcessorData supplied
// @TODO Raghu:  merge this in processData
function* processMappingData({
  flowId,
  resourceId,
  mappings,
  processor,
  preProcessedData,
}) {
  const body = {
    rules: {
      rules: [mappings],
    },
    data: [preProcessedData],
  };
  // call processor data specific to mapper as it is not part of editors saga
  const path = `/processors/${processor}`;
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
        'importMappingExtract',
        processedData
      )
    );
  } catch (e) {
    // Handle Errors
  }
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
        processor,
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

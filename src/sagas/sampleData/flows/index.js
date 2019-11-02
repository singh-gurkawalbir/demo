import { put, select, call, takeEvery } from 'redux-saga/effects';
import { resourceData, getSampleData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { evaluateExternalProcessor } from '../../../sagas/editor';
import { getResource } from '../../resources';
import {
  fetchFlowResources,
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
  getParseStageData,
  getLastExportDateTime,
} from '../../../utils/flowData';
import MappingUtil from '../../../utils/mapping';
import { adaptorTypeMap } from '../../../utils/resource';

function* requestSampleData({
  flowId,
  resourceId,
  resourceType,
  stage,
  isPageGenerator,
}) {
  // Updates preProcessedData for the procesors
  const sampleDataStage = getSampleDataStage(stage, resourceType);

  if (resourceType === 'imports') {
    yield call(requestSampleDataForImports, {
      flowId,
      resourceId,
      sampleDataStage,
    });
  } else {
    yield call(requestSampleDataForExports, {
      flowId,
      resourceId,
      sampleDataStage,
      isPageGenerator,
    });
  }
}

export function* fetchPageProcessorPreview({
  flowId,
  _pageProcessorId,
  previewType,
}) {
  if (!flowId || !_pageProcessorId) return;
  const { merged } = yield select(resourceData, 'flows', flowId, SCOPES.VALUE);
  const flow = { ...merged };

  if (
    !(flow.pageProcessors && flow.pageProcessors.length) ||
    !(flow.pageGenerators && flow.pageGenerators.length)
  )
    return;
  const pageGeneratorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageGenerators',
  });
  const pageProcessorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageProcessors',
    eliminateDataProcessors: true,
  });

  if (previewType === 'flowInput') {
    // make the _pageProcessor as import so that BE calculates flow data till that processor
    flow.pageProcessors = flow.pageProcessors.map(pageProcessor => {
      if (pageProcessor._exportId === _pageProcessorId) {
        pageProcessorMap[_pageProcessorId].options = {};

        return {
          ...pageProcessor,
          type: 'import',
          _importId: pageProcessor._exportId,
        };
      }

      return pageProcessor;
    });
  }

  const body = { flow, _pageProcessorId, pageGeneratorMap, pageProcessorMap };

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: '/pageProcessors/preview',
      opts: { method: 'POST', body },
      message: `Fetching flows Preview`,
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
  const { merged: resource } = yield select(
    resourceData,
    'exports',
    _pageGeneratorId
  );
  let body = { ...resource };

  if (body.type === 'delta') {
    body.postData = {
      lastExportDateTime: getLastExportDateTime(),
    };
  }

  if (body.rawData) {
    body = {
      ...body,
      verbose: true,
      runOfflineOptions: {
        runOffline: true,
        runOfflineSource: 'db',
      },
    };
  }

  const path = `/exports/preview`;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: `Fetching Exports Preview`,
    });
    const parseData = getParseStageData(previewData);

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

function* processData({
  flowId,
  resourceId,
  processorData,
  isPageGenerator,
  stage,
}) {
  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    yield call(updateStateForProcessorData, {
      flowId,
      resourceId,
      stage,
      processedData,
      isPageGenerator,
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
  isPageGenerator,
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
  let preProcessedData = yield select(
    getSampleData,
    flowId,
    resourceId,
    stage,
    { isPageGenerator, isImport: resourceType === 'imports' }
  );
  let processorData;

  if (!preProcessedData) {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
      isPageGenerator,
    });
    preProcessedData = yield select(getSampleData, flowId, resourceId, stage, {
      isPageGenerator,
      isImport: resourceType === 'imports',
    });
  }

  if (stage === 'transform' || stage === 'responseTransform') {
    const transform = { ...resource[processor] };
    const [rule] = transform.rules || [];

    if (!(rule && rule.length)) {
      hasNoRulesToProcess = true;
    }

    processorData = { data: preProcessedData, rule, processor: 'transform' };
  } else if (stage === 'hooks') {
    const { hooks = {} } = { ...resource };

    // @TODO: Raghu handle for other import hooks map
    if (hooks.preSavePage && hooks.preSavePage._scriptId) {
      const scriptId = hooks.preSavePage._scriptId;
      const data = { data: [preProcessedData], errors: [] };
      const script = yield call(getResource, {
        resourceType: 'scripts',
        id: scriptId,
      });
      const { content: code } = script;

      processorData = {
        data,
        code,
        entryFunction: hooks.preSavePage.function,
        processor: 'javascript',
      };
    } else {
      hasNoRulesToProcess = true;
    }
  } else if (stage === 'importMappingExtract') {
    // mapping fields are processed here against raw data
    const appType =
      resource.adaptorType && adaptorTypeMap[resource.adaptorType];
    const mappings = MappingUtil.getMappingFromResource(
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
      isPageGenerator,
      stage,
    });
  }

  yield call(processData, {
    flowId,
    resourceId,
    processorData,
    isPageGenerator,
    stage,
  });
}

export default [
  takeEvery(
    actionTypes.FLOW_DATA.PREVIEW_DATA_REQUEST,
    fetchPageProcessorPreview
  ),
  takeEvery(actionTypes.FLOW_DATA.PROCESSOR_DATA_REQUEST, requestProcessorData),
  takeEvery(actionTypes.FLOW_DATA.SAMPLE_DATA_REQUEST, requestSampleData),
  takeEvery(
    actionTypes.FLOW_DATA.FLOWS_FOR_RESOURCE_UPDATE,
    updateFlowsDataForResource
  ),
  takeEvery(actionTypes.FLOW_DATA.FLOW_UPDATE, updateFlowData),
  takeEvery(actionTypes.RESOURCE.UPDATED, updateFlowOnResourceUpdate),
];

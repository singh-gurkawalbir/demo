import { put, select, call, takeEvery } from 'redux-saga/effects';
import {
  resourceData,
  getSampleData,
  getFlowReferencesForResource,
} from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { evaluateExternalProcessor } from '../../../sagas/editor';
import { getResource } from '../../resources';
import {
  fetchFlowResources,
  refreshResourceData,
  requestSampleDataForExports,
  requestSampleDataForImports,
} from './utils';
import {
  getSampleDataStage,
  getParseStageData,
  getLastExportDateTime,
} from '../../../utils/flowData';

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

  if (!flow.pageProcessors || !flow.pageGenerators) return;
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
    const { processor } = processorData;

    yield put(
      actions.flowData.receivedProcessorData(
        flowId,
        resourceId,
        stage || processor,
        processedData,
        isPageGenerator
      )
    );
  } catch (e) {
    // Handle errors
  }
}

export function* requestProcessorData({
  flowId,
  resourceId,
  resourceType,
  processor,
  isPageGenerator,
}) {
  const { merged } = yield select(
    resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );
  let preProcessedData = yield select(
    getSampleData,
    flowId,
    resourceId,
    processor,
    { isPageGenerator, isImport: resourceType === 'imports' }
  );
  let processorData;

  if (!preProcessedData) {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage: processor,
      isPageGenerator,
    });
    preProcessedData = yield select(
      getSampleData,
      flowId,
      resourceId,
      processor,
      { isPageGenerator, isImport: resourceType === 'imports' }
    );
  }

  if (processor === 'transform' || processor === 'responseTransform') {
    const transform = { ...merged[processor] };
    const [rule] = transform.rules || [];

    processorData = { data: preProcessedData, rule, processor: 'transform' };
  } else if (processor === 'hooks') {
    const { hooks = {} } = { ...merged };

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
    }
  }

  if (processorData) {
    yield call(processData, {
      flowId,
      resourceId,
      processorData,
      isPageGenerator,
      stage: processor,
    });
  }
}

function* updateFlowsDataForResource({ resourceId, resourceType }) {
  // get flow ids using this resourceId
  const flowRefs = yield select(getFlowReferencesForResource, resourceId);
  // make a preview call for hooks so that the entire state of that processor updates if present
  let flowIndex = 0;

  while (flowIndex < flowRefs.length) {
    // fetch flow
    const flowId = flowRefs[flowIndex];

    // reset the state for that resourceId and subsequent state reset
    yield put(actions.flowData.reset(flowId, resourceId));
    // Fetch preview data for this resource in all used flows
    yield call(refreshResourceData, { flowId, resourceId, resourceType });

    flowIndex += 1;
  }
}

function* updateFlowData({ flowId }) {
  // Updates flow structure incase of Drag and change flow order
  const { merged: updatedFlow } = yield select(
    resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  );

  yield put(actions.flowData.resetFlowSequence(flowId, updatedFlow));
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
];

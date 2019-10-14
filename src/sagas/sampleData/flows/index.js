import moment from 'moment';
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

const dependencies = {
  inputFilter: 'flowInput',
  outputFilter: 'flowInput',
  transform: 'raw',
  hooks: 'transform',
  importMapping: 'flowInput',
};
let fetchSampleData;

function getParseStageData(previewData) {
  const stages = (previewData && previewData.stages) || [];
  const parseStage = stages.find(stage => stage.name === 'parse');

  return parseStage && parseStage.data && parseStage.data[0];
}

function* fetchFlowResources({ flow, type, eliminateDataProcessors }) {
  const resourceMap = {};
  const resourceList = flow[type];

  if (flow && resourceList && resourceList.length) {
    for (let index = 0; index < resourceList.length; index += 1) {
      const resourceInfo = resourceList[index];
      const resourceType =
        resourceInfo && resourceInfo.type === 'import' ? 'imports' : 'exports';
      const resourceId =
        resourceInfo[resourceType === 'exports' ? '_exportId' : '_importId'];
      const { merged: resource } = yield select(
        resourceData,
        resourceType,
        resourceId,
        SCOPES.VALUE
      );

      if (resource) {
        const { transform, filter, hooks, ...rest } = resource;

        if (eliminateDataProcessors) {
          resourceMap[resourceId] = { doc: rest };
        } else {
          resourceMap[resourceId] = { doc: resource };
        }

        resourceMap[resourceId].options = {};

        if (resourceType === 'exports' && resource.type === 'delta') {
          resourceMap[resourceId].options.postData = {
            // @TODO: Raghu add valid dateTime
            lastExportDateTime: moment()
              .add(-1, 'y')
              .toISOString(),
          };
        }

        if (resource && resource.sampleData) {
          resourceMap[resourceId].options.uiData = resource.sampleData;
        }
      }
    }
  }

  return resourceMap;
}

function* fetchPageProcessorPreview({ flowId, _pageProcessorId, previewType }) {
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

function* fetchPageGeneratorPreview({ flowId, _pageGeneratorId }) {
  const { merged: resource } = yield select(
    resourceData,
    'exports',
    _pageGeneratorId
  );

  if (resource.type === 'delta') {
    resource.postData = {
      lastExportDateTime: moment()
        .add(-1, 'y')
        .toISOString(),
    };
  }

  delete resource.sampleData;
  const path = `/exports/preview`;
  const previewData = yield call(apiCallWithRetry, {
    path,
    opts: { method: 'POST', body: resource },
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
}

function* processData({ flowId, resourceId, processorData, isPageGenerator }) {
  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });
    const { processor } = processorData;

    yield put(
      actions.flowData.receivedProcessorData(
        flowId,
        resourceId,
        processor,
        processedData,
        isPageGenerator
      )
    );
  } catch (e) {
    // Handle errors
  }
}

function* requestProcessorData({
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
    processor
  );
  let processorData;

  if (!preProcessedData) {
    yield call(fetchSampleData, {
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
      isPageGenerator
    );
  }

  if (processor === 'transform') {
    const transformLookup =
      resourceType === 'imports' ? 'responseTransform' : 'transform';
    const transform = { ...merged[transformLookup] };
    const [rule] = transform.rules || [];

    processorData = { data: preProcessedData, rule, processor };
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
    });
  }
}

/*
 * We have 4 stages for a processor - input , raw, transform, hooks.
 * Selectors should handle - input filter, output filter, input, transform, hooks.
 */
function* fetchInputData({
  flowId,
  resourceId,
  resourceType,
  stage,
  isPageGenerator,
}) {
  // Updates preProcessedData for the procesors
  const sampleDataStage = dependencies[stage];

  if (['flowInput', 'raw'].includes(sampleDataStage)) {
    if (isPageGenerator) {
      yield call(fetchPageGeneratorPreview, {
        flowId,
        _pageGeneratorId: resourceId,
      });
    } else {
      yield call(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId: resourceId,
        previewType: sampleDataStage,
      });
    }
  } else {
    yield call(requestProcessorData, {
      flowId,
      resourceId,
      resourceType,
      processor: sampleDataStage === 'hooks' ? 'javascript' : sampleDataStage,
      isPageGenerator,
    });
  }
}

fetchSampleData = fetchInputData;

export function* refreshResourceData({ flowId, resourceId, resourceType }) {
  const lastStage = 'hooks';
  let isPageGenerator = false;

  if (resourceType !== 'imports') {
    // find resource in pageGenerators list for the flow. If exists , then make isPageGenerator as true
    const { merged: flow } = yield select(resourceData, 'flows', flowId);
    const { pageGenerators = [] } = flow;
    const resource = pageGenerators.find(pg => pg._exportId === resourceId);

    if (resource) isPageGenerator = true;
  }

  yield put(
    actions.flowData.requestProcessorData(
      flowId,
      resourceId,
      resourceType,
      lastStage,
      isPageGenerator
    )
  );
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
    actionTypes.FLOW_DATA.REQUEST_PREVIEW_DATA,
    fetchPageProcessorPreview
  ),
  takeEvery(actionTypes.FLOW_DATA.REQUEST_PROCESSOR_DATA, requestProcessorData),
  takeEvery(actionTypes.FLOW_DATA.FETCH_SAMPLE_DATA, fetchSampleData),
  takeEvery(
    actionTypes.FLOW_DATA.UPDATE_FLOWS_FOR_RESOURCE,
    updateFlowsDataForResource
  ),
  takeEvery(actionTypes.FLOW_DATA.UPDATE_FLOW, updateFlowData),
];

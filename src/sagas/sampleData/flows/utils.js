import { put, select, call } from 'redux-saga/effects';
import { resourceData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actions from '../../../actions';
import { getLastExportDateTime } from '../../../utils/flowData';
import {
  fetchPageProcessorPreview,
  fetchPageGeneratorPreview,
  requestProcessorData,
} from './';

export function* fetchFlowResources({ flow, type, eliminateDataProcessors }) {
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
            lastExportDateTime: getLastExportDateTime(),
          };
        }
      }
    }
  }

  return resourceMap;
}

export function* refreshResourceData({ flowId, resourceId, resourceType }) {
  // Stage to update incase of node reset
  // Incase of exports, stage is transform so that it updates raw and transform stage
  // Incase of imports, we refresh raw data
  const stageToUpdate = resourceType === 'exports' ? 'transform' : 'raw';
  let isPageGenerator = false;

  if (resourceType !== 'imports') {
    // find resource in pageGenerators list for the flow. If exists , then make isPageGenerator as true
    const { merged: flow = {} } = yield select(resourceData, 'flows', flowId);
    const { pageGenerators = [] } = flow;
    const resource = pageGenerators.find(pg => pg._exportId === resourceId);

    if (resource) isPageGenerator = true;
  }

  yield put(
    actions.flowData.requestProcessorData(
      flowId,
      resourceId,
      resourceType,
      stageToUpdate,
      isPageGenerator
    )
  );
}

export function* requestSampleDataForImports({
  flowId,
  resourceId,
  resourceType,
  sampleDataStage,
}) {
  switch (sampleDataStage) {
    case 'raw':
    case 'flowInput': {
      yield call(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId: resourceId,
        resourceType,
        previewType: sampleDataStage,
      });
      break;
    }

    case 'sampleResponse': {
      const { merged: resource } = yield select(
        resourceData,
        'imports',
        resourceId,
        SCOPES.VALUE
      );

      yield put(
        actions.flowData.receivedPreviewData(
          flowId,
          resourceId,
          resource && resource.sampleResponseData,
          'sampleResponse'
        )
      );
      break;
    }

    case 'responseTransform': {
      yield call(requestProcessorData, {
        flowId,
        resourceId,
        resourceType: 'imports',
        processor: 'responseTransform',
      });
      break;
    }

    case 'importMappingExtract': {
      yield call(requestProcessorData, {
        flowId,
        resourceId,
        resourceType: 'imports',
        processor: 'mapperProcessor',
        processorStage: 'importMappingExtract',
      });
      break;
    }

    case 'preMap': {
      yield call(requestProcessorData, {
        flowId,
        resourceId,
        resourceType: 'imports',
        processor: 'javascript',
        processorStage: 'preMap',
      });
      break;
    }

    default:
  }
}

export function* requestSampleDataForExports({
  flowId,
  resourceId,
  sampleDataStage,
  isPageGenerator,
}) {
  const resourceType = 'exports';

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
      processor: sampleDataStage,
      isPageGenerator,
    });
  }
}

export function* updateStateForProcessorData({
  flowId,
  resourceId,
  stage,
  processedData,
  isPageGenerator,
}) {
  yield put(
    actions.flowData.receivedProcessorData(
      flowId,
      resourceId,
      stage,
      processedData,
      isPageGenerator
    )
  );
}

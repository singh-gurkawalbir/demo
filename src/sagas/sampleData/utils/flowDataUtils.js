import { put, select, call } from 'redux-saga/effects';
import { resourceData, isPageGenerator } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actions from '../../../actions';
import {
  fetchPageProcessorPreview,
  fetchPageGeneratorPreview,
  requestProcessorData,
  requestSampleDataWithContext,
} from '../flows';
import getPreviewOptionsForResource from '../flows/pageProcessorPreviewOptions';

/*
 * Returns PG/PP Document saved on Flow Doc.
 * Example Flow: Given flowId: 111 and resourceId: 123 with resourceType: 'exports', returns the below node from pageGenerators
 * {_id: 111,  pageGenerators: [{_exportId : 123, responseMapping: {}, hooks: {}}], pageProcessors: [{_importId : 453, responseMapping: {}, hooks: {}}]}
 */
export function* getFlowResourceNode({ flowId, resourceId, resourceType }) {
  // get flow on flowId base
  const { merged: flow = {} } = yield select(
    resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  );
  // check if resource is a pg/pp
  const isPageGeneratorExport = yield select(
    isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );
  const flowResourceList =
    flow[isPageGeneratorExport ? 'pageGenerators' : 'pageProcessors'] || [];

  // returns specific resource based on resource id match
  return flowResourceList.find(
    resource =>
      resource[resourceType === 'exports' ? '_exportId' : '_importId'] ===
      resourceId
  );
}

/*
 * Given a flow, filters out all the pending PGs and PPs without resourceId
 */
export function filterPendingResources({ flow = {} }) {
  const { pageGenerators: pgs = [], pageProcessors: pps = [], ...rest } = flow;
  const filteredPageGenerators = pgs.filter(pg => !!pg._exportId);
  const filteredPageProcessors = pps.filter(
    pp => !!pp[pp.type === 'import' ? '_importId' : '_exportId']
  );

  return {
    ...rest,
    pageGenerators: filteredPageGenerators,
    pageProcessors: filteredPageProcessors,
  };
}

/*
 * Handles fetching new resource's data to feed into payload of pageProcessorPreview
 * Any new missing prop on resource can be added here as it is a temporary resource
 */
export function* fetchResourceDataForNewFlowResource({
  resourceId,
  resourceType,
}) {
  const { merged: newResource = {} } = yield select(
    resourceData,
    resourceType,
    resourceId,
    'value'
  );

  // TODO @Raghu: Should handle in metadata to pass boolean instead of string
  // eslint-disable-next-line no-param-reassign
  if (newResource.oneToMany) {
    const oneToMany = newResource.oneToMany === 'true';

    return { ...newResource, oneToMany };
  }

  return newResource;
}

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

        if (resourceType === 'exports') {
          // Gets required uiData (for real time exports - FTP, NS, SF, Web hook) and postData to pass for Page processors
          resourceMap[resourceId].options = yield call(
            getPreviewOptionsForResource,
            { resource }
          );
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

  yield put(
    actions.flowData.requestProcessorData(
      flowId,
      resourceId,
      resourceType,
      stageToUpdate
    )
  );
}

export function* requestSampleDataForImports({
  flowId,
  resourceId,
  resourceType,
  sampleDataStage,
}) {
  try {
    switch (sampleDataStage) {
      case 'flowInput': {
        yield call(fetchPageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType,
          previewType: sampleDataStage,
        });
        break;
      }

      case 'flowInputWithContext': {
        // This stage is added explicitly to feed context info for input filter
        // TODO @Raghu: Find the better way for this case
        yield call(requestSampleDataWithContext, {
          flowId,
          resourceId,
          resourceType,
          stage: sampleDataStage,
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

        try {
          // @TODO Raghu: Handle sample response as a XML
          const sampleResponse = JSON.parse(
            resource && resource.sampleResponseData
          );

          yield put(
            actions.flowData.receivedPreviewData(
              flowId,
              resourceId,
              sampleResponse,
              'sampleResponse'
            )
          );
        } catch (e) {
          yield put(
            actions.flowData.receivedPreviewData(
              flowId,
              resourceId,
              {},
              'sampleResponse'
            )
          );
        }

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
          processorStage: 'importMappingExtract',
        });
        break;
      }

      case 'responseMappingExtract': {
        yield call(requestProcessorData, {
          flowId,
          resourceId,
          resourceType: 'imports',
          processorStage: 'responseMappingExtract',
        });
        break;
      }

      case 'responseMapping': {
        yield call(requestProcessorData, {
          flowId,
          resourceId,
          resourceType: 'imports',
          processorStage: 'responseMapping',
        });
        break;
      }

      case 'preMap': {
        yield call(requestProcessorData, {
          flowId,
          resourceId,
          resourceType: 'imports',
          processorStage: 'preMap',
        });
        break;
      }

      default:
    }
  } catch (e) {
    throw e;
  }
}

export function* requestSampleDataForExports({
  flowId,
  resourceId,
  sampleDataStage,
}) {
  const resourceType = 'exports';
  const isPageGeneratorExport = yield select(
    isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );

  try {
    if (['flowInput', 'raw'].includes(sampleDataStage)) {
      if (isPageGeneratorExport) {
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
    } else if (
      ['flowInputWithContext', 'hooksWithContext'].includes(sampleDataStage)
    ) {
      // These stages are added explicitly to feed context info for input/outputFilters
      // TODO @Raghu: Find the better way for this case
      yield call(requestSampleDataWithContext, {
        flowId,
        resourceId,
        resourceType,
        stage: sampleDataStage,
      });
    } else {
      yield call(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: sampleDataStage,
      });
    }
  } catch (e) {
    throw e;
  }
}

export function* updateStateForProcessorData({
  flowId,
  resourceId,
  stage,
  processedData,
}) {
  yield put(
    actions.flowData.receivedProcessorData(
      flowId,
      resourceId,
      stage,
      processedData
    )
  );
}

/*
 * Handles Errors in the entire flow sample data process
 * Updates stage passed in flowData state with received error
 */
export function* handleFlowDataStageErrors({
  flowId,
  resourceId,
  stage,
  error,
}) {
  if (error.status === 403 || error.status === 401) {
    return;
  }

  if (error.status >= 400 && error.status < 500) {
    const errorsJSON = JSON.parse(error.message);
    const { errors } = errorsJSON;

    yield put(
      actions.flowData.receivedError(
        flowId,
        resourceId,
        stage,
        errors[0].message
      )
    );
  }
}

import { put, select, call } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actions from '../../../actions';
import {
  fetchPageProcessorPreview,
  fetchPageGeneratorPreview,
  requestProcessorData,
  requestSampleData,
} from '../flows';
import getPreviewOptionsForResource from '../flows/pageProcessorPreviewOptions';
import {
  generateDefaultExtractsObject,
  getFormattedResourceForPreview,
} from '../../../utils/flowData';
import { isIntegrationApp } from '../../../utils/flows';
import { isJsonString } from '../../../utils/string';

/*
 * Returns PG/PP Document saved on Flow Doc.
 * Example Flow: Given flowId: 111 and resourceId: 123 with resourceType: 'exports', returns the below node from pageGenerators
 * {_id: 111,  pageGenerators: [{_exportId : 123, responseMapping: {}, hooks: {}}], pageProcessors: [{_importId : 453, responseMapping: {}, hooks: {}}]}
 */
export function* getFlowResourceNode({ flowId, resourceId, resourceType }) {
  // get flow on flowId base
  const { merged: flow = {} } = yield select(
    selectors.resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  );
  // check if resource is a pg/pp
  const isPageGeneratorExport = yield select(
    selectors.isPageGenerator,
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
    selectors.resourceData,
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

  return getFormattedResourceForPreview(newResource);
}

export function* fetchFlowResources({ flow, type, eliminateDataProcessors, refresh }) {
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
        selectors.resourceData,
        resourceType,
        resourceId,
        SCOPES.VALUE
      );

      if (resource) {
        const { transform, filter, hooks, ...rest } = resource;

        // getFormattedResourceForPreview util removes unnecessary props of resource that should not be sent in preview calls
        // Example: type: once should not be sent while previewing
        if (eliminateDataProcessors) {
          resourceMap[resourceId] = {
            doc: getFormattedResourceForPreview(rest, resourceType, type),
          };
        } else {
          // pgs have eliminateDataProcessors as false, but incase of connectors with sampledata on resource it should be true
          // As existing connector pg's sampledata represent data after these tx, filter, hooks actions are processed, so remove those from doc
          resourceMap[resourceId] = {
            doc: getFormattedResourceForPreview(
              isIntegrationApp(flow) && resource.sampleData ? rest : resource,
              resourceType,
              type
            ),
          };
        }

        resourceMap[resourceId].options = {};

        if (resourceType === 'exports') {
          // Gets required uiData (for real time exports - FTP, NS, SF, Web hook) and postData to pass for Page processors
          resourceMap[resourceId].options = yield call(
            getPreviewOptionsForResource,
            { resource, flow, refresh }
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
  hidden = true,
  sampleDataStage,
}) {
  switch (sampleDataStage) {
    case 'flowInput': {
      yield call(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId: resourceId,
        resourceType,
        hidden,
        previewType: sampleDataStage,
      });
      break;
    }

    case 'sampleResponse': {
      const { merged: resource } = yield select(
        selectors.resourceData,
        'imports',
        resourceId,
        SCOPES.VALUE
      );

      try {
        // @TODO Raghu: Handle sample response as a XML
        const { sampleResponseData = '' } = resource;
        const sampleResponse = isJsonString(sampleResponseData)
          ? JSON.parse(sampleResponseData)
          : sampleResponseData;

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

    case 'responseTransform':
    case 'importMappingExtract':
    case 'importMapping':
    case 'responseMappingExtract':
    case 'responseMapping':
    case 'postResponseMap':
    case 'preMap': {
      yield call(requestProcessorData, {
        flowId,
        resourceId,
        resourceType: 'imports',
        processor: sampleDataStage,
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
}) {
  const resourceType = 'exports';
  const isPageGeneratorExport = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );

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
  } else {
    yield call(requestProcessorData, {
      flowId,
      resourceId,
      resourceType,
      processor: sampleDataStage,
    });
  }
}

export function* updateStateForProcessorData({
  flowId,
  resourceId,
  stage,
  processedData,
  wrapInArrayProcessedData,
  removeDataPropFromProcessedData,
}) {
  // wrapInArrayProcessedData: Incase of Transform scripts , data is not inside an array as in other stages
  // So this prop wraps data to extract the same in the reducer
  if (wrapInArrayProcessedData && processedData && processedData.data) {
    // eslint-disable-next-line no-param-reassign
    processedData.data = [processedData.data];
  }

  // Incase of preMap u get sampleData wrapped against 'data' prop
  // This replaces [{data: {}}] to direct [{}], so that receivedProcessorData reducer extract the same
  if (
    removeDataPropFromProcessedData &&
    processedData &&
    processedData.data &&
    processedData.data[0] &&
    processedData.data[0].data
  ) {
    // eslint-disable-next-line no-param-reassign
    processedData.data[0] = processedData.data[0].data;
  }

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

export function getPreProcessedResponseMappingData({
  resourceType,
  preProcessedData,
  adaptorType,
}) {
  const extractsObj = generateDefaultExtractsObject(resourceType, adaptorType);

  // Incase of lookups , add preProcessedData as part of data if exists else no data from lookup is passed
  if (resourceType === 'exports') {
    if (preProcessedData) {
      extractsObj.data = [preProcessedData];
    } else delete extractsObj.data;

    return extractsObj;
  }

  // Incase of imports, send preProcessedData if present else default fields
  return isEmpty(preProcessedData) ? extractsObj : preProcessedData;
}

export function* getFlowStageData({
  flowId,
  resourceId,
  resourceType,
  stage,
  isInitialized,
}) {
  let flowStageData = yield select(selectors.sampleDataWrapper, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  // @BugFix 13750: Check for received status to make an api call or fetch from above
  // Used to be !flowStageData.status but there can be a case where status is requested, so safe to check for received status
  if (flowStageData.status !== 'received') {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
      isInitialized,
    });
    flowStageData = yield select(selectors.sampleDataWrapper, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
  }

  return flowStageData.data;
}

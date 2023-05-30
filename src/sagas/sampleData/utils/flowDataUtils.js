import { deepClone } from 'fast-json-patch';
import { put, select, call } from 'redux-saga/effects';
import { flattenDeep, isEmpty } from 'lodash';
import { selectors } from '../../../reducers';
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
import { getAllPageProcessors, isIntegrationApp } from '../../../utils/flows';
import { isJsonString } from '../../../utils/string';
import { emptyObject } from '../../../constants';
import { isFileAdaptor } from '../../../utils/resource';

/*
 * Returns PG/PP Document saved on Flow Doc.
 * Example Flow: Given flowId: 111 and resourceId: 123 with resourceType: 'exports', returns the below node from pageGenerators
 * {_id: 111,  pageGenerators: [{_exportId : 123, responseMapping: {}, hooks: {}}], pageProcessors: [{_importId : 453, responseMapping: {}, hooks: {}}]}
 */
export function* getFlowResourceNode({ flowId, resourceId, resourceType }) {
  // get flow on flowId base
  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId,
  ))?.merged || emptyObject;
  // check if resource is a pg/pp
  const isPageGeneratorExport = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );

  const flowResourceList = isPageGeneratorExport ? flow.pageGenerators : getAllPageProcessors(flow);

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
export function filterPendingResources({ flow }) {
  if (!flow) {
    return;
  }
  const { pageGenerators: pgs = [], pageProcessors: pps = [], routers, ...rest } = flow;
  const filteredPageGenerators = pgs.filter(pg => !!pg._exportId);
  const filteredPageProcessors = pps.length ? pps.filter(
    pp => !!pp[pp.type === 'import' ? '_importId' : '_exportId']
  ) : undefined;

  (routers || []).forEach(router => {
    router.branches.forEach(branch => {
      // eslint-disable-next-line no-param-reassign
      branch.pageProcessors = branch.pageProcessors?.filter(pp => !!pp[pp.type === 'import' ? '_importId' : '_exportId']);
    });
  });

  return {
    ...rest,
    pageGenerators: filteredPageGenerators,
    pageProcessors: filteredPageProcessors,
    ...(routers ? {routers} : {}),
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
  if (!resourceId) {
    return;
  }
  let newResource = (yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
  ))?.merged || emptyObject;

  // TODO @Raghu: Should handle in metadata to pass boolean instead of string
  // eslint-disable-next-line no-param-reassign
  if (newResource.oneToMany) {
    const oneToMany = newResource.oneToMany === 'true';

    newResource = { ...newResource, oneToMany };
  }

  return getFormattedResourceForPreview(newResource);
}

export function* fetchFlowResources({
  flow,
  type,
  refresh,
  runOffline,
  addMockData,
}) {
  const resourceMap = {};
  let resourceList = flow?.[type];

  if (flow?.routers?.length && type === 'pageProcessors') {
    resourceList = flattenDeep(
      flow.routers
        .map(router => (router.branches || [])
          .map(branch => branch.pageProcessors || [])
        )
    );
  }

  if (resourceList?.length) {
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
      );

      if (resource) {
        const { transform, filter, hooks, ...rest } = resource;
        const {sampleData, ...resourceWithoutSampleData} = resource;

        // getFormattedResourceForPreview util removes unnecessary props of resource that should not be sent in preview calls
        // Incase of connectors with sampledata on resource it should be true
        // As existing connector pg's sampledata represent data after these tx, filter, hooks actions are processed, so remove those from doc
        resourceMap[resourceId] = {
          doc: getFormattedResourceForPreview(
            (isIntegrationApp(flow) && resource.sampleData) ? rest : resourceWithoutSampleData,
            resourceType,
            type
          ),
        };

        resourceMap[resourceId].options = {};

        if (resourceType === 'exports') {
          // Gets required uiData (for real time exports - FTP, NS, SF, Web hook) and postData to pass for Page processors
          resourceMap[resourceId].options = yield call(
            getPreviewOptionsForResource,
            { resource,
              flow,
              refresh,
              runOffline,
              addMockData,
              resourceType,
            }
          );
        } else if (resourceType === 'imports') {
          resourceMap[resourceId].options = yield call(
            getPreviewOptionsForResource,
            { resource,
              flow,
              refresh,
              runOffline,
              addMockData,
            }
          );
        }
      }
    }
  }

  return resourceMap;
}

export function* requestSampleDataForRouters({
  flowId,
  routerId,
  editorId,
  hidden = true,
}) {
  yield call(fetchPageProcessorPreview, {
    flowId,
    routerId,
    hidden,
    editorId,
    previewType: 'router',
  });
}

export function* requestSampleDataForImports({
  flowId,
  resourceId,
  hidden = true,
  sampleDataStage,
}) {
  switch (sampleDataStage) {
    case 'flowInput': {
      yield call(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId: resourceId,
        resourceType: 'imports',
        hidden,
        previewType: 'flowInput',
      });
      break;
    }

    // TODO: Siddharth, once mockResponse is stable, replace sample data stage also to mockResponse
    case 'sampleResponse': {
      const mockResponse = (yield select(
        selectors.resourceData,
        'imports',
        resourceId,
      ))?.merged?.mockResponse || emptyObject;

      yield put(
        actions.flowData.receivedPreviewData(
          flowId,
          resourceId,
          mockResponse?.[0]?._json,
          'sampleResponse'
        )
      );

      break;
    }

    case 'inputFilter':
    case 'processedFlowInput':
    case 'responseTransform':
    case 'importMappingExtract':
    case 'importMapping':
    case 'responseMappingExtract':
    case 'responseMapping':
    case 'postResponseMap':
    case 'preMap':
    case 'postMap': {
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
  hidden = false,
}) {
  const resourceType = 'exports';
  const isPageGeneratorExport = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );

  if (['flowInput', 'raw'].includes(sampleDataStage)) {
    const resourceObj = yield select(selectors.resource, resourceType, resourceId);

    if (isPageGeneratorExport || isFileAdaptor(resourceObj)) {
      yield call(fetchPageGeneratorPreview, {
        flowId,
        _pageGeneratorId: resourceId,
      });
    } else {
      yield call(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId: resourceId,
        previewType: sampleDataStage,
        hidden,
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
  isFilterScript,
  sampleData,
}) {
  let resultantProcessedData = processedData && deepClone(processedData);

  // wrapInArrayProcessedData: Incase of Transform scripts , data is not inside an array as in other stages
  // So this prop wraps data to extract the same in the reducer
  if (wrapInArrayProcessedData && resultantProcessedData?.data) {
    resultantProcessedData.data = [resultantProcessedData.data];
  }

  // Incase of preMap u get sampleData wrapped against 'data' prop
  // This replaces [{data: {}}] to direct [{}], so that receivedProcessorData reducer extract the same
  if (
    removeDataPropFromProcessedData &&
    resultantProcessedData?.data?.[0]?.data
  ) {
    resultantProcessedData.data[0] = resultantProcessedData.data[0].data;
  }

  if (isFilterScript) {
    // Incase of filters, script response is either true/false
    // Incase of true, pass on the sampleData to the next stage
    if (processedData.data === true) {
      resultantProcessedData = { data: [sampleData] };
    } else {
      resultantProcessedData = undefined;
    }
  }

  yield put(
    actions.flowData.receivedProcessorData(
      flowId,
      resourceId,
      stage,
      resultantProcessedData
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
  error = {},
}) {
  if (error.status === 403 || error.status === 401) {
    return;
  }

  if (error.status >= 400 && error.status < 500 && isJsonString(error.message)) {
    const errorsJSON = JSON.parse(error.message);
    const { errors } = errorsJSON;

    yield put(
      actions.flowData.receivedError(
        flowId,
        resourceId,
        stage,
        errors?.[0]?.message
      )
    );
  }
}

export function getPreProcessedResponseMappingData({
  resourceType,
  preProcessedData,
  adaptorType,
}) {
  if (!['exports', 'imports'].includes(resourceType)) {
    return;
  }
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
  routerId,
  stage,
  isInitialized,
  noWrap,
}) {
  let selector = selectors.sampleDataWrapper;

  if (noWrap) {
    selector = selectors.getSampleDataContext;
  }
  let flowStageData = yield select(selector, {
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
      routerId,
      resourceType,
      stage,
      isInitialized,
    });
    flowStageData = yield select(selector, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
  }

  return flowStageData.data;
}

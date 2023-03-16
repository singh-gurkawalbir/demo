import { select, call } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import { selectors } from '../../../reducers';
import { getFlowUpdatePatchesForNewPGorPP } from '../../resourceForm';
import { apiCallWithRetry } from '../../index';
import {
  fetchFlowResources,
  fetchResourceDataForNewFlowResource,
  filterPendingResources,
} from './flowDataUtils';
import { getFormattedResourceForPreview, getPostDataForDeltaExport, isPostDataNeededInResource } from '../../../utils/flowData';
import { isNewId } from '../../../utils/resource';
import { EMPTY_RAW_DATA, STANDALONE_INTEGRATION } from '../../../constants';
import { getConstructedResourceObj } from '../flows/utils';
import getPreviewOptionsForResource from '../flows/pageProcessorPreviewOptions';
import { generateMongoDBId } from '../../../utils/string';
import customCloneDeep from '../../../utils/customCloneDeep';
import { getUnionObject } from '../../../utils/jsonPaths';

export function* pageProcessorPreview({
  flowId,
  _pageProcessorId,
  _pageProcessorDoc,
  routerId,
  previewType,
  editorId,
  resourceType = 'exports',
  hidden = false,
  throwOnError = false,
  refresh = false,
  includeStages = false,
  runOffline = false,
  addMockData,
  includeFilterProcessing = false,
}) {
  if (!flowId || (!_pageProcessorId && !routerId)) return;

  const scriptContext = yield select(selectors.getScriptContext, {flowId, contextType: 'hook'});
  const { merged } = yield select(selectors.resourceData, 'flows', flowId);
  const { prePatches } = yield select(selectors.editor, editorId);

  let flowClone = customCloneDeep(merged);

  if (prePatches?.length) {
    flowClone = jsonPatch.applyPatch(flowClone, jsonPatch.deepClone(prePatches)).newDocument;
  }

  let flow = yield call(filterPendingResources, { flow: flowClone });

  const isIntegrationApp = flow?._connectorId;

  const isPreviewPanelAvailable = yield select(selectors.isPreviewPanelAvailableForResource, _pageProcessorId, 'imports');

  // // Incase of no pgs, preview call is stopped here
  if (!isPreviewPanelAvailable && (!flow.pageGenerators || !flow.pageGenerators.length)) return;
  // Incase of first new pp, pageProcessors does not exist on flow doc. So add default [] for pps
  if (!flow.routers && !prePatches) { flow.pageProcessors = flow.pageProcessors || []; }
  const pageGeneratorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageGenerators',
    refresh,
    runOffline,
  });
  const pageProcessorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageProcessors',
    addMockData,
    // runOffline, Run offline is currently not supported for PPs
  });

  // Override the map with provided document for this _pageProcessorId
  if (_pageProcessorDoc) {
    pageProcessorMap[_pageProcessorId] = {
      doc: _pageProcessorDoc,
      options: pageProcessorMap[_pageProcessorId]?.options,
    };
  }

  let updatedPageProcessorId = _pageProcessorId;
  const uniqId = generateMongoDBId();

  // Incase of a new Lookup / Import add that doc to flow explicitly as it is not yet saved
  if (isNewId(_pageProcessorId)) {
    updatedPageProcessorId = uniqId;
    const newPatches = yield call(getFlowUpdatePatchesForNewPGorPP,
      resourceType,
      updatedPageProcessorId,
      flowId,
      true,
      resourceType === 'exports'
    );

    if (newPatches?.length) {
      flow = jsonPatch.applyPatch(flowClone, jsonPatch.deepClone(newPatches)).newDocument;
    }

    // If page processor Doc is supplied , no need of fetching it from the state
    if (!_pageProcessorDoc) {
      pageProcessorMap[_pageProcessorId] = {
        doc: yield call(fetchResourceDataForNewFlowResource, {
          resourceId: _pageProcessorId,
          resourceType,
        }),
      };
    }

    // in case of new imports/lookups, add mock input
    if (addMockData) {
      pageProcessorMap[_pageProcessorId].options = yield call(getPreviewOptionsForResource, {
        resource: {_id: _pageProcessorId},
        _pageProcessorId,
        addMockData,
      });
    }
    pageProcessorMap[updatedPageProcessorId] = pageProcessorMap[_pageProcessorId];
    delete pageProcessorMap[_pageProcessorId];
  }

  if (previewType === 'flowInput') {
    // make the _pageProcessor as import so that BE calculates flow data till that processor
    const updatePageProcessorToImport = pageProcessor => {
      if (pageProcessor._exportId === updatedPageProcessorId) {
        pageProcessorMap[updatedPageProcessorId].options = {};
        // for lookup, remove inputFilters & output filters configured while making preview call for flowInput
        if (!includeFilterProcessing) {
          delete pageProcessorMap[updatedPageProcessorId].doc?.inputFilter;
        }
        delete pageProcessorMap[updatedPageProcessorId].doc?.filter;

        return {
          ...pageProcessor,
          type: 'import',
          _importId: pageProcessor._exportId,
        };
      }
      if (pageProcessor._importId === updatedPageProcessorId && !includeFilterProcessing) {
        // for imports, remove inputFilters configured while making preview call for flowInput
        delete pageProcessorMap[updatedPageProcessorId].doc?.filter;
      }

      return pageProcessor;
    };

    if (flow.pageProcessors) {
      flow.pageProcessors = flow.pageProcessors.map(updatePageProcessorToImport);
    } else if (flow.routers) {
      flow.routers.forEach(router => {
        router.branches?.forEach(branch => {
          // eslint-disable-next-line no-param-reassign
          branch.pageProcessors = branch.pageProcessors?.map(updatePageProcessorToImport) || [];
        });
      });
    }
  } else if (resourceType === 'exports' && pageProcessorMap[updatedPageProcessorId]?.doc) {
    // remove tx,filters,hooks from PP Doc to get preview data for _pageProcessorId
    const { transform, filter, hooks, ...lookupDocWithoutProcessors } = pageProcessorMap[updatedPageProcessorId].doc;

    pageProcessorMap[updatedPageProcessorId].doc = lookupDocWithoutProcessors;
    // update options for the lookups if incase they were not added before ( incase of custom pp doc or new pp doc )
    if (
      isPostDataNeededInResource(lookupDocWithoutProcessors) &&
      !pageProcessorMap[updatedPageProcessorId].options
    ) {
      pageProcessorMap[updatedPageProcessorId].options = {
        postData: getPostDataForDeltaExport(lookupDocWithoutProcessors),
      };
    }
  }

  const body = {
    flow,
    _pageProcessorId: updatedPageProcessorId,
    ...(routerId && {_routerId: routerId}),
    ...(isIntegrationApp && {options: scriptContext}),
    pageGeneratorMap,
    pageProcessorMap,
    includeStages,
  };

  const isRunOfflineConfigured = runOffline && Object.values(pageGeneratorMap)
    .some(
      pgInfo => pgInfo?.options?.runOfflineOptions
    );

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: '/pageProcessors/preview',
      opts: { method: 'POST', body },
      message: 'Loading',
      hidden: isRunOfflineConfigured ? true : hidden,
    });

    if (flow.routers?.length && Array.isArray(previewData)) {
      return getUnionObject(previewData);
    }

    return previewData;
  } catch (e) {
    // When runOffline mode fails make preview call without offlineMode and move further
    if (isRunOfflineConfigured) {
      return yield call(pageProcessorPreview, {
        flowId,
        _pageProcessorId,
        routerId,
        _pageProcessorDoc,
        previewType,
        editorId,
        resourceType,
        hidden,
        throwOnError,
        refresh,
        includeStages,
        includeFilterProcessing,
      });
    }
    // Error handler
    if (throwOnError) {
      throw e;
    }
  }
}

export function* exportPreview({
  resourceId,
  hidden = false,
  runOffline = false,
  throwOnError = false,
  flowId,
  formKey,
}) {
  if (!resourceId) return;
  const resource = yield call(getConstructedResourceObj, {
    resourceId,
    resourceType: 'exports',
    formKey,
  });
  let body = customCloneDeep(resource);

  // getFormattedResourceForPreview util removes unnecessary props of resource that should not be sent in preview calls
  // Example: type: once should not be sent while previewing
  body = getFormattedResourceForPreview(body);

  const hasValidRawDataKey = body.rawData && body.rawData !== EMPTY_RAW_DATA;
  const isOfflineMode = runOffline && hasValidRawDataKey && !formKey;

  // offline mode works only incase of a valid rawDataKey
  // also incase of a saved resource ( without a formKey )
  if (isOfflineMode) {
    body = {
      ...body,
      verbose: true,
      runOfflineOptions: {
        runOffline: true,
        runOfflineSource: 'db',
      },
    };
  } else {
    delete body.rawData;
  }

  // BE need flowId and integrationId in the preview call
  // if in case integration settings were used in export
  const flow = yield select(selectors.resource, 'flows', flowId);

  let path;

  if (flow?._integrationId && flow?._integrationId !== STANDALONE_INTEGRATION.id && flow?._id) {
    path = `/integrations/${flow._integrationId}/flows/${flowId}/exports/preview`;
  } else if (flow?._integrationId && flow?._integrationId !== STANDALONE_INTEGRATION.id && !flow?._id) {
    path = `/integrations/${flow._integrationId}/exports/preview`;
  } else {
    path = '/exports/preview';
    body._flowId = flowId;
  }

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: 'Loading',
      hidden: isOfflineMode ? true : hidden,
    });

    return previewData;
  } catch (e) {
    // When runOffline mode fails make preview call without offlineMode and move further
    if (isOfflineMode) {
      return yield call(exportPreview, {
        resourceId,
        hidden,
        runOffline: false,
        throwOnError,
      });
    }

    // Error handler
    if (throwOnError) {
      throw e;
    }
  }
}

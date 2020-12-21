import { select, call } from 'redux-saga/effects';
import deepClone from 'lodash/cloneDeep';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { apiCallWithRetry } from '../../index';
import {
  fetchFlowResources,
  fetchResourceDataForNewFlowResource,
  filterPendingResources,
} from './flowDataUtils';
import { getFormattedResourceForPreview } from '../../../utils/flowData';
import { isNewId } from '../../../utils/resource';
import { EMPTY_RAW_DATA } from '../../../utils/constants';

export function* pageProcessorPreview({
  flowId,
  _pageProcessorId,
  _pageProcessorDoc,
  previewType,
  resourceType = 'exports',
  hidden = false,
  throwOnError = false,
  refresh = false,
  includeStages = false,
  runOffline = false,
}) {
  if (!flowId || !_pageProcessorId) return;
  const { merged } = yield select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE);
  const flow = yield call(filterPendingResources, { flow: deepClone(merged) });

  // Incase of no pgs, preview call is stopped here
  if (!flow.pageGenerators || !flow.pageGenerators.length) return;
  // Incase of first new pp, pageProcessors does not exist on flow doc. So add default [] for pps
  flow.pageProcessors = flow.pageProcessors || [];
  const pageGeneratorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageGenerators',
    refresh,
    runOffline,
  });
  const pageProcessorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageProcessors',
    // runOffline, Run offline is currently not supported for PPs
  });

  // Override the map with provided document for this _pageProcessorId
  if (_pageProcessorDoc) {
    pageProcessorMap[_pageProcessorId] = {
      doc: _pageProcessorDoc,
    };
  }

  // Incase of a new Lookup / Import add that doc to flow explicitly as it is not yet saved
  if (isNewId(_pageProcessorId)) {
    const newResourceDoc =
      resourceType === 'imports'
        ? { type: 'import', _importId: _pageProcessorId }
        : { type: 'export', _exportId: _pageProcessorId };

    flow.pageProcessors.push(newResourceDoc);

    // If page processor Doc is supplied , no need of fetching it from the state
    if (!_pageProcessorDoc) {
      pageProcessorMap[_pageProcessorId] = {
        doc: yield call(fetchResourceDataForNewFlowResource, {
          resourceId: _pageProcessorId,
          resourceType,
        }),
      };
    }
  }

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
  } else if (resourceType === 'exports' && pageProcessorMap[_pageProcessorId]?.doc) {
    // remove tx,filters,hooks from PP Doc to get preview data for _pageProcessorId
    const { transform, filter, hooks, ...rest } = pageProcessorMap[_pageProcessorId].doc;

    pageProcessorMap[_pageProcessorId].doc = rest;
  }

  const body = { flow, _pageProcessorId, pageGeneratorMap, pageProcessorMap, includeStages };

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

    return previewData;
  } catch (e) {
    // When runOffline mode fails make preview call without offlineMode and move further
    if (isRunOfflineConfigured) {
      return yield call(pageProcessorPreview, {
        flowId,
        _pageProcessorId,
        _pageProcessorDoc,
        previewType,
        resourceType,
        hidden,
        throwOnError,
        refresh,
        includeStages,
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
}) {
  if (!resourceId) return;
  const { merged: resource } = yield select(
    selectors.resourceData,
    'exports',
    resourceId,
    SCOPES.VALUE
  );
  let body = deepClone(resource);

  // getFormattedResourceForPreview util removes unnecessary props of resource that should not be sent in preview calls
  // Example: type: once should not be sent while previewing
  body = getFormattedResourceForPreview(body);

  const hasValidRawDataKey = body.rawData && body.rawData !== EMPTY_RAW_DATA;

  if (runOffline && hasValidRawDataKey) {
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

  const path = '/exports/preview';
  const isRunOfflineConfigured = runOffline && hasValidRawDataKey;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: 'Loading',
      hidden: isRunOfflineConfigured ? true : hidden,
    });

    return previewData;
  } catch (e) {
    // When runOffline mode fails make preview call without offlineMode and move further
    if (isRunOfflineConfigured) {
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

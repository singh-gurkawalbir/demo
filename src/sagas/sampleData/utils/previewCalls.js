import { select, call } from 'redux-saga/effects';
import deepClone from 'lodash/cloneDeep';
import { resourceData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { apiCallWithRetry } from '../../index';
import {
  fetchFlowResources,
  fetchResourceDataForNewFlowResource,
  filterPendingResources,
} from './flowDataUtils';
import { getLastExportDateTime } from '../../../utils/flowData';
import { isNewId, adaptorTypeMap } from '../../../utils/resource';

export function* pageProcessorPreview({
  flowId,
  _pageProcessorId,
  _pageProcessorDoc,
  previewType,
  resourceType = 'exports',
  hidden = false,
  throwOnError = false,
}) {
  if (!flowId || !_pageProcessorId) return;
  const { merged } = yield select(resourceData, 'flows', flowId, SCOPES.VALUE);
  const flow = yield call(filterPendingResources, { flow: deepClone(merged) });

  // Incase of no pgs, preview call is stopped here
  if (!flow.pageGenerators || !flow.pageGenerators.length) return;
  // Incase of first new pp, pageProcessors does not exist on flow doc. So add default [] for pps
  flow.pageProcessors = flow.pageProcessors || [];
  const pageGeneratorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageGenerators',
  });
  const pageProcessorMap = yield call(fetchFlowResources, {
    flow,
    type: 'pageProcessors',
    eliminateDataProcessors: true,
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
  }

  const body = { flow, _pageProcessorId, pageGeneratorMap, pageProcessorMap };

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: '/pageProcessors/preview',
      opts: { method: 'POST', body },
      message: `Fetching flows Preview`,
      hidden,
    });

    return previewData;
  } catch (e) {
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
  const { merged: resource } = yield select(
    resourceData,
    'exports',
    resourceId
  );
  let body = deepClone(resource);

  if (body.type === 'delta') {
    body.postData = {
      lastExportDateTime: getLastExportDateTime(),
    };
  }

  // type Once need not be passed in preview as it gets executed in preview call
  // so remove type once
  if (body.type === 'once') {
    delete body.type;
    const { adaptorType } = body;
    const appType = adaptorType && adaptorTypeMap[adaptorType];

    // Manually removing once doc incase of preview to restrict execution on once query - Bug fix IO-11988
    if (appType && body[appType] && body[appType].once) {
      delete body[appType].once;
    }
  }

  if (runOffline && body.rawData) {
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

  const path = `/exports/preview`;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: `Fetching Exports Preview`,
      hidden,
    });

    return previewData;
  } catch (e) {
    // Error handler
    if (throwOnError) {
      throw e;
    }
  }
}

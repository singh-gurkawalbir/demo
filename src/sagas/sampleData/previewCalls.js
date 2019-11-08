import { select, call } from 'redux-saga/effects';
import deepClone from 'lodash/cloneDeep';
import { resourceData } from '../../reducers';
import { SCOPES } from '../resourceForm';
import { apiCallWithRetry } from '../index';
import { fetchFlowResources } from './flows/utils';
import { getLastExportDateTime } from '../../utils/flowData';
import { isNewId } from '../../utils/resource';

export function* fetchPageProcessorPreview({
  flowId,
  _pageProcessorId,
  previewType,
  resourceType = 'exports',
  hidden = false,
}) {
  if (!flowId || !_pageProcessorId) return;
  const { merged } = yield select(resourceData, 'flows', flowId, SCOPES.VALUE);
  const flow = deepClone(merged);

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

  // Incase of a new Lookup / Import add that doc to flow explicitly as it is not yet saved
  if (isNewId(_pageProcessorId)) {
    const newResourceDoc =
      resourceType === 'imports'
        ? { type: 'import', _importId: _pageProcessorId }
        : { type: 'export', _exportId: _pageProcessorId };

    flow.pageProcessors.push(newResourceDoc);
    pageProcessorMap[_pageProcessorId] = { doc: {} };
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
  }
}

export function* fetchExportPreview({
  resourceId,
  hidden = false,
  runOffline = false,
}) {
  const { merged: resource } = yield select(
    resourceData,
    'exports',
    resourceId
  );
  let body = { ...resource };

  if (body.type === 'delta') {
    body.postData = {
      lastExportDateTime: getLastExportDateTime(),
    };
  }

  if (runOffline) {
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
  }
}

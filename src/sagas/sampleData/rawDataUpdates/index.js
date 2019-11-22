import { takeLatest, select, call } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { resource, resourceFormState } from '../../../reducers';
import {
  getAddedLookupInFlow,
  isRawDataPatchSet,
  getPreviewStageData,
} from '../../../utils/flowData';
import { isFileAdaptor } from '../../../utils/resource';
import { exportPreview, pageProcessorPreview } from '../previewCalls';
import { saveRawDataOnResource } from './utils';
import saveRawDataForFileAdaptors from './fileAdaptorUpdates';

function* fetchAndSaveRawDataForResource({
  type,
  resourceId,
  flowId,
  tempResourceId,
}) {
  const resourceObj = yield select(
    resource,
    type === 'imports' ? 'imports' : 'exports',
    resourceId
  );

  if (isFileAdaptor(resourceObj)) {
    return yield call(saveRawDataForFileAdaptors, {
      resourceId,
      tempResourceId,
      type,
    });
  }

  if (type === 'exports') {
    const exportPreviewData = yield call(exportPreview, {
      resourceId,
      hidden: true,
    });

    if (exportPreviewData) {
      const parseData = getPreviewStageData(exportPreviewData, 'raw');

      yield call(saveRawDataOnResource, {
        resourceId,
        rawData: parseData && JSON.stringify(parseData),
      });
    }
  } else {
    const pageProcessorPreviewData = yield call(pageProcessorPreview, {
      flowId,
      _pageProcessorId: resourceId,
      previewType: 'raw',
      hidden: true,
    });

    if (pageProcessorPreviewData) {
      yield call(saveRawDataOnResource, {
        resourceId,
        rawData:
          pageProcessorPreviewData && JSON.stringify(pageProcessorPreviewData),
      });
    }
  }
}

function* onResourceCreate({ id, resourceType, tempId }) {
  /*
   * Question: How to differentiate -- a lookup creation and an existing lookup add on flow
   */
  if (resourceType === 'exports') {
    const resourceObj = yield select(resource, resourceType, id);

    if (!resourceObj.isLookup) {
      // If export, get raw data calling preview and call save raw data with a patch on this id
      yield call(fetchAndSaveRawDataForResource, {
        type: 'exports',
        resourceId: id,
        tempResourceId: tempId,
      });
    }
  }

  if (resourceType === 'imports') {
    yield call(fetchAndSaveRawDataForResource, {
      type: 'imports',
      resourceId: id,
      tempResourceId: tempId,
    });
  }
}

function* onResourceUpdate({
  resourceType,
  resourceId,
  master = {},
  patch = [],
}) {
  // If it is a raw data patch set on need to update again
  if (resourceType === 'exports' && patch.length && !isRawDataPatchSet(patch)) {
    const { flowId } = yield select(
      resourceFormState,
      resourceType,
      resourceId
    );
    let { isLookup } = master;

    // Double check for lookup or export , as old lookups does not have isLookup property
    if (flowId && !isLookup) {
      const flow = yield select(resource, 'flows', flowId);
      const { pageProcessors = [] } = flow || {};

      isLookup = !!pageProcessors.find(pp => pp._exportId === resourceId);
    }

    if (isLookup) {
      yield call(fetchAndSaveRawDataForResource, {
        type: 'pageprocessors',
        flowId,
        resourceId,
      });
    } else {
      yield call(fetchAndSaveRawDataForResource, {
        type: 'exports',
        resourceId,
      });
    }
  }

  if (resourceType === 'flows') {
    const addedPageProcessorId = getAddedLookupInFlow(master, patch);

    if (addedPageProcessorId) {
      yield call(fetchAndSaveRawDataForResource, {
        type: 'pageprocessors',
        flowId: resourceId,
        resourceId: addedPageProcessorId,
      });
    }
  }

  // If it is a raw data patch set on need to update again
  if (resourceType === 'imports' && patch.length && !isRawDataPatchSet(patch)) {
    yield call(fetchAndSaveRawDataForResource, { type: 'imports', resourceId });
  }
}

export default [
  takeLatest(actionTypes.RESOURCE.CREATED, onResourceCreate),
  takeLatest(actionTypes.RESOURCE.UPDATED, onResourceUpdate),
];

import { takeLatest, put, select, call } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { resource, resourceFormState } from '../../reducers';
import {
  getAddedLookupInFlow,
  isRawDataPatchSet,
  getPreviewStageData,
} from '../../utils/flowData';
import { fetchExportPreview, fetchPageProcessorPreview } from './previewCalls';
import { uploadRawData } from '../uploadFile';

function* saveRawDataOnResource({
  resourceId,
  rawData,
  resourceType = 'exports',
}) {
  // patch req on resource
  if (!resourceId || !rawData) return;
  const rawDataKey = yield call(uploadRawData, {
    file: JSON.stringify(rawData),
  });
  const patchSet = [
    {
      op: 'add',
      path: '/rawData',
      value: rawDataKey,
    },
  ];

  // Save the resource
  yield put(actions.resource.patchStaged(resourceId, patchSet, 'value'));
  yield put(actions.resource.commitStaged(resourceType, resourceId, 'value'));
}

function* fetchRawDataForResource({ type, resourceId, flowId }) {
  if (type === 'exports') {
    const exportPreviewData = yield call(fetchExportPreview, {
      resourceId,
      hidden: true,
    });

    if (exportPreviewData) {
      const parseData = getPreviewStageData(exportPreviewData, 'raw');

      yield call(saveRawDataOnResource, { resourceId, rawData: parseData });
    }
  } else {
    const pageProcessorPreviewData = yield call(fetchPageProcessorPreview, {
      flowId,
      _pageProcessorId: resourceId,
      previewType: 'raw',
      hidden: true,
    });

    if (pageProcessorPreviewData) {
      yield call(saveRawDataOnResource, {
        resourceId,
        rawData: pageProcessorPreviewData,
      });
    }
  }
}

function* onResourceCreate({ id, resourceType }) {
  /*
   * Question: How to differentiate -- a lookup creation and an existing lookup add on flow
   * Question: How to handle Lookup edit outside flow context
   */
  if (resourceType === 'exports') {
    const resourceObj = yield select(resource, resourceType, id);

    if (!resourceObj.isLookup) {
      // If export, get raw data calling preview and call save raw data with a patch on this id
      yield call(fetchRawDataForResource, {
        type: 'export',
        options: { resourceId: id },
      });
    }
  }
}

function* onResourceUpdate({
  resourceType,
  resourceId,
  master = {},
  patch = [],
}) {
  if (resourceType === 'exports') {
    // check for raw data patch set , if yes stop it here
    if (isRawDataPatchSet(patch)) return;
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
      yield call(fetchRawDataForResource, {
        type: 'pageprocessors',
        flowId,
        resourceId,
      });
    } else {
      yield call(fetchRawDataForResource, { type: 'exports', resourceId });
    }
  }

  if (resourceType === 'flows') {
    const addedPageProcessorId = getAddedLookupInFlow(master, patch);

    if (addedPageProcessorId) {
      yield call(fetchRawDataForResource, {
        type: 'pageprocessors',
        flowId: resourceId,
        resourceId: addedPageProcessorId,
      });
    }
  }
}

export default [
  takeLatest(actionTypes.RESOURCE.CREATED, onResourceCreate),
  takeLatest(actionTypes.RESOURCE.UPDATED, onResourceUpdate),
];

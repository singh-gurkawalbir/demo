import { takeLatest, put, select, call } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import {
  resource,
  resourceFormState,
  getResourceSampleDataWithStatus,
} from '../../reducers';
import {
  getAddedLookupInFlow,
  isRawDataPatchSet,
  getPreviewStageData,
} from '../../utils/flowData';
import { isFileExport } from '../../utils/resource';
import { exportPreview, pageProcessorPreview } from './previewCalls';
import { uploadRawData } from '../uploadFile';

function* saveRawDataOnResource({
  resourceId,
  rawData,
  resourceType = 'exports',
}) {
  // patch req on resource
  if (!resourceId || !rawData) return;
  const rawDataKey = yield call(uploadRawData, {
    file: rawData,
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

// WIP Implementation
function* fetchRawDataForFTP({ resourceId, tempResourceId }) {
  const resourceObj = yield select(resource, 'exports', resourceId);
  const isFileTypeExport = isFileExport(resourceObj);

  if (!isFileTypeExport) return;
  // Incase of FTP, raw data to be saved in the data in Parse Stage ( JSON )
  // tempResourceId if passed used incase of newly created export
  // to fetch Sample data saved against temp id in state
  const { data: rawData } = yield select(
    getResourceSampleDataWithStatus,
    tempResourceId || resourceId,
    'raw'
  );

  return rawData;
}

function* fetchAndSaveRawDataForResource({
  type,
  resourceId,
  flowId,
  tempResourceId,
}) {
  if (type === 'exports') {
    const ftpRawData = yield call(fetchRawDataForFTP, {
      resourceId,
      tempResourceId,
    });

    if (ftpRawData && ftpRawData.body) {
      return yield call(saveRawDataOnResource, {
        resourceId,
        rawData: ftpRawData.body,
      });
    }

    const exportPreviewData = yield call(exportPreview, {
      resourceId,
      hidden: true,
    });

    if (exportPreviewData) {
      const parseData = getPreviewStageData(exportPreviewData, 'raw');

      yield call(saveRawDataOnResource, { resourceId, rawData: parseData });
    }
  } else {
    const ftpRawData = yield call(fetchRawDataForFTP, { resourceId });

    if (ftpRawData) {
      return yield call(saveRawDataOnResource, {
        resourceId,
        rawData: ftpRawData,
      });
    }

    const pageProcessorPreviewData = yield call(pageProcessorPreview, {
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
}

export default [
  takeLatest(actionTypes.RESOURCE.CREATED, onResourceCreate),
  takeLatest(actionTypes.RESOURCE.UPDATED, onResourceUpdate),
];

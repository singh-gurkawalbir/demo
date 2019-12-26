import { call, takeEvery, put } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';

export function* uploadFile({
  resourceType,
  resourceId,
  fileType,
  file,
  uploadPath,
}) {
  const path =
    uploadPath ||
    `/${resourceType}/${resourceId}/upload/signedURL?file_type=${fileType}`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      message: 'Getting signed URL for file upload',
    });

    yield fetch(response.signedURL, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
        'x-amz-server-side-encryption': 'AES256',
      },
      body: file,
    });

    return response.runKey;
  } catch (e) {
    return true;
  }
}

export function* uploadRawData({
  file,
  fileName = 'file.txt',
  fileType = 'application/text',
}) {
  const uploadPath = `/s3SignedURL?file_name=${fileName}&file_type=${fileType}`;

  try {
    const runKey = yield call(uploadFile, { file, fileType, uploadPath });

    return runKey;
  } catch (e) {
    // @TODO handle error
  }
}

export function* previewZip({ file, fileType = 'application/zip' }) {
  const uploadPath = `/s3SignedURL?file_name=${file.name}&file_type=${fileType}`;

  try {
    const runKey = yield call(uploadFile, { file, fileType, uploadPath });
    const previewPath = `/integrations/template/preview?runKey=${runKey}`;
    const components = yield call(apiCallWithRetry, {
      path: previewPath,
      message: 'Loading Components from zip file',
    });

    yield put(actions.template.receivedPreview(components, runKey, true));
  } catch (e) {
    // @TODO handle error
  }
}

export const uploadFileSagas = [
  takeEvery(actionTypes.FILE.UPLOAD, uploadFile),
  takeEvery(actionTypes.FILE.PREVIEW_ZIP, previewZip),
];

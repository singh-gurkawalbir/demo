import { call, takeEvery, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { userProfile } from '../../reducers';

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
  let response;

  try {
    response = yield call(apiCallWithRetry, {
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
    const profile = yield select(userProfile);

    return profile._id + runKey;
  } catch (e) {
    // @TODO handle error
  }
}

export const uploadFileSagas = [takeEvery(actionTypes.FILE.UPLOAD, uploadFile)];

import { call, takeEvery } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* uploadFile({ resourceType, resourceId, fileType, file }) {
  const path = `/${resourceType}/${resourceId}/upload/signedURL?file_type=${fileType}`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Getting signedURL for file upload',
    });

    fetch(response.signedURL, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
        'x-amz-server-side-encryption': 'AES256',
      },
      body: file,
    });
  } catch (e) {
    return true;
  }
}

export const uploadFileSagas = [takeEvery(actionTypes.FILE.UPLOAD, uploadFile)];

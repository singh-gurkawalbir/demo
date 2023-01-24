import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { uploadFile } from '../uploadFile';

export function* uploadCustomTemplate({
  integrationId,
  childId,
  file,
  fileName = 'file.xlsx',
  fileType = 'application/text',
}) {
  const uploadPath = `/integrations/${integrationId}/utilities/generateCategorySignedUrl`;
  const opts = {
    method: 'PUT',
    body: {
      integrationId,
      childId,
      fileName,
      fileType,
    },
  };

  try {
    return yield call(uploadFile, { file, fileType, fileName, uploadPath, opts });
  } catch (error) {
    return yield put(actions.integrationApp.utility.s3KeyError({integrationId, error}));
    // @TODO handle error
  }
}
export function* generateS3Key({ integrationId, childId, file, fileType, fileName }) {
  let runKey;

  try {
    runKey = yield call(uploadCustomTemplate, {
      integrationId,
      childId,
      file,
      fileType,
      fileName,
    });
    if (runKey) {
      yield put(actions.integrationApp.utility.receivedS3Key({integrationId, runKey}));
    }
  } catch (error) {
    return yield put(actions.integrationApp.utility.s3KeyError({integrationId, error}));
  }
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.UTILITY.REQUEST_S3_KEY,
    generateS3Key
  ),
];

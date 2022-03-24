import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { uploadFile } from '../uploadFile';

export function* uploadCustomTemplate({
  integrationId,
  file,
  fileName = 'file.xlsx',
  fileType = 'application/text',
}) {
  const uploadPath = `/integrations/${integrationId}/utilities/generateSignedUrl`;

  try {
    return yield call(uploadFile, { file, fileType, fileName, uploadPath });
  } catch (e) {
    return undefined;
    // @TODO handle error
  }
}
export function* generateS3Key({ integrationId, file, fileType, fileName }) {
  let runKey;

  try {
    runKey = yield call(uploadCustomTemplate, {
      integrationId,
      file,
      fileType,
      fileName,
    });
    if (runKey) {
      yield put(actions.integrationApp.utility.receivedS3Key(runKey));
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

import { call, put, takeLatest } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* generateS3Key({ integrationId }) {
  const path = 'utilities/generateSignedUrl';

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {
          integrationId,
        },
        method: 'PUT',
      },
      message: 'Reactivating...',
    }) || {};
  } catch (error) {
    return yield put(actionTypes.INTEGRATION_APPS.SETTINGS.S3_KEY_FAILED, error);
  }
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_S3_KEY,
    generateS3Key
  ),
];

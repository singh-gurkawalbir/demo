import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY } from '../../constants';
import { apiCallWithRetry } from '../index';

export function* requestAccountSettings() {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: '/accountSettings',
      opts: {
        method: 'GET',
      },
    });
  } catch (e) {
    return;
  }

  yield put(actions.accountSettings.received(response));
}

export function* updateAccountSettings({accountSettings}) {
  try {
    yield put(actions.asyncTask.start(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY));
    yield call(apiCallWithRetry, {
      path: '/accountSettings',
      opts: {
        body: accountSettings,
        method: 'PATCH',
      },
    });
    yield call(requestAccountSettings);

    yield put(actions.asyncTask.success(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY));
  } catch (error) {
    yield put(actions.asyncTask.failed(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY));
  }
}

export default [
  takeLatest(actionTypes.ACCOUNT_SETTINGS.REQUEST, requestAccountSettings),
  takeLatest(actionTypes.ACCOUNT_SETTINGS.UPDATE, updateAccountSettings),
];

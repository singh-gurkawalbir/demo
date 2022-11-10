import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY } from '../../constants';
import { apiCallWithRetry } from '../index';

export function* requestAccountSettings() {
  try {
    const response = yield call(apiCallWithRetry, {
      path: '/accountSettings',
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.accountSettings.received(response));
  } catch (error) {
    return undefined;
  }
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

    return undefined;
  }
}

export default [
  takeLatest(actionTypes.ACCOUNT_SETTINGS.REQUEST, requestAccountSettings),
  takeLatest(actionTypes.ACCOUNT_SETTINGS.UPDATE, updateAccountSettings),
];

import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '..';

export function* getPreference() {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: '/preferences',
      opts: {
        method: 'GET',
      },
    });
  } catch (e) {
    return;
  }
  // console.log(response);

  yield put(actions.dashboard.received(response?.defaultAShareId));
}

export function* patchPreference() {
  try {
    // yield put(
    //   actions.asyncTask.start(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY)
    // );
    yield call(apiCallWithRetry, {
      path: '/preferences',
      opts: {
        // body: dashboard,
        method: 'PATCH',
      },
    });
    yield call(getPreference);

    // yield put(
    //   actions.asyncTask.success(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY)
    // );
  } catch (error) {
    // yield put(
    //   actions.asyncTask.failed(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY)
    // );
  }
}

export default [
  takeLatest(actionTypes.DASHBOARD.REQUEST, getPreference),
  takeLatest(actionTypes.DASHBOARD.UPDATE, patchPreference),
];

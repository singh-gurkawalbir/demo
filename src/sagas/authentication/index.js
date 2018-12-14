import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { authParams, logoutParams } from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import { getResource } from '../resources';

export function* auth({ email, password }) {
  try {
    // replace credentials in the request body
    const credentialsBody = { email, password };
    const payload = { ...authParams.opts, body: credentialsBody };
    const apiAuthentications = yield call(
      apiCallWithRetry,
      authParams.path,
      payload,
      'Authenticating User'
    );

    yield put(actions.auth.complete());

    return apiAuthentications.succes;
  } catch (error) {
    yield put(actions.auth.failure('Authentication Failure'));
    yield put(actions.profile.delete());

    return undefined;
  }
}

export function* initializeApp() {
  try {
    const resp = yield call(
      getResource,
      actions.profile.request(),
      'Initializing application'
    );

    if (resp) {
      yield put(actions.auth.complete());
    } else {
      yield put(actions.auth.logout());
    }
  } catch (e) {
    yield put(actions.auth.logout());
  }
}

export function* invalidateSession() {
  try {
    yield call(
      apiCallWithRetry,
      logoutParams.path,
      logoutParams.opts,
      'Logging out user'
    );
    yield put(actions.auth.clearStore());
  } catch (e) {
    yield put(actions.auth.clearStore());
  }
}

export const authenticationSagas = [
  takeEvery(actionTypes.USER_LOGOUT, invalidateSession),
  takeEvery(actionTypes.INIT_SESSION, initializeApp),
  takeEvery(actionTypes.AUTH_REQUEST, auth),
];

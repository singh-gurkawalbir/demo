import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { authParams, logoutParams, getCSRFParams } from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import { getResource } from '../resources';
import {
  setCSRFToken,
  removeCSRFToken,
  getCSRFToken,
} from '../../utils/session';

export function* initializeAccount() {
  let ashares = yield call(
    apiCallWithRetry,
    '/ashares/',
    {},
    'Retrieving Account Ownership'
  );

  // if 'ashares' has a value then this is an account owner since only
  // account owners would have any account details returned...
  // conversely, if this returns 'no content', then this means that the
  // user belongs to at least one account and we need to make another
  // call to get the ashares for which this user belongs to...

  // console.log('Account Ownership Info:', ashares);

  if (!ashares) {
    ashares = yield call(
      apiCallWithRetry,
      '/shared/ashares',
      {},
      'Retrieving Account Membership'
    );
    // console.log('Account Membership Info:', ashares);
  }

  yield put(actions.ashares.receivedCollection(ashares));
}

export function* auth({ email, password }) {
  try {
    const csrfTokenResponse = yield call(
      apiCallWithRetry,
      getCSRFParams.path,
      null,
      'Requesting CSRF token'
    );
    const { _csrf } = csrfTokenResponse;
    // replace credentials in the request body
    const credentialsBody = { email, password, _csrf };
    const payload = { ...authParams.opts, body: credentialsBody };
    const apiAuthentications = yield call(
      apiCallWithRetry,
      authParams.path,
      payload,
      'Authenticating User'
    );

    yield call(setCSRFToken, apiAuthentications._csrf);
    yield put(actions.auth.complete());

    yield call(initializeAccount);

    return apiAuthentications.succes;
  } catch (error) {
    // console.log('auth error:', error);
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
      const csrfTokenResponse = yield call(
        apiCallWithRetry,
        getCSRFParams.path
      );

      yield call(setCSRFToken, csrfTokenResponse._csrf);

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
    logoutParams.opts.body._csrf = yield call(getCSRFToken);
    yield call(
      apiCallWithRetry,
      logoutParams.path,
      logoutParams.opts,
      'Logging out user'
    );
    yield call(removeCSRFToken);
    yield put(actions.auth.clearStore());
  } catch (e) {
    yield call(removeCSRFToken);
    yield put(actions.auth.clearStore());
  }
}

export const authenticationSagas = [
  takeEvery(actionTypes.USER_LOGOUT, invalidateSession),
  takeEvery(actionTypes.INIT_SESSION, initializeApp),
  takeEvery(actionTypes.AUTH_REQUEST, auth),
];

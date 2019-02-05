import { call, put, takeEvery, all, select } from 'redux-saga/effects';
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
import * as selectors from '../../reducers';
import { intializationResources } from '../../reducers/data';

export function* retrievingUserDetails() {
  yield all(
    intializationResources.map(resource =>
      put(actions.user[resource].request(`Retrieving user's ${resource}`))
    )
  );
}

export function* retrieveAppInitializationResources() {
  yield call(retrievingUserDetails);
  // retrieve user's accounts details
  yield put(actions.user.accounts.requestAshares(`Retrieving user's accounts`));

  const ashares = yield select(selectors.hasAccounts);

  if (!ashares) {
    yield put(
      actions.user.accounts.requestSharedAshares(
        'Retrieving Account Membership'
      )
    );
  }
}

export function* getCSRFTokenBackend() {
  const { _csrf } = yield call(apiCallWithRetry, {
    path: getCSRFParams.path,
    message: 'Requesting CSRF token',
  });

  return _csrf;
}

export function* auth({ email, password }) {
  try {
    // replace credentials in the request body
    const _csrf = yield call(getCSRFTokenBackend);
    const credentialsBody = { email, password, _csrf };
    const payload = { ...authParams.opts, body: credentialsBody };
    const apiAuthentications = yield call(apiCallWithRetry, {
      path: authParams.path,
      opts: payload,
      message: 'Authenticating User',
    });

    yield call(setCSRFToken, apiAuthentications._csrf);
    yield put(actions.auth.complete());

    yield call(retrieveAppInitializationResources);
  } catch (error) {
    yield put(actions.auth.failure('Authentication Failure'));
    yield put(actions.user.profile.delete());
  }
}

export function* initializeApp() {
  try {
    const resp = yield call(
      getResource,
      actions.user.profile.request('Initializing application')
    );

    if (resp) {
      const { _csrf } = yield call(getCSRFTokenBackend);

      yield call(setCSRFToken, _csrf);

      yield put(actions.auth.complete());
      yield call(retrieveAppInitializationResources);
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
    yield call(apiCallWithRetry, {
      path: logoutParams.path,
      opts: logoutParams.opts,
      message: 'Logging out user',
    });
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

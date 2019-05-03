import {
  call,
  put,
  takeEvery,
  takeLeading,
  all,
  select,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { authParams, logoutParams, getCSRFParams } from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import { getResource, getResourceCollection } from '../resources';
import {
  setCSRFToken,
  removeCSRFToken,
  getCSRFToken,
} from '../../utils/session';
import * as selectors from '../../reducers';
import { intializationResources } from '../../reducers/data';
import { ACCOUNT_IDS } from '../../utils/constants';

export function* retrievingOrgDetails() {
  yield all([
    call(
      getResourceCollection,
      actions.user.org.accounts.requestLicenses(`Retrieving licenses`)
    ),
    call(
      getResourceCollection,
      actions.user.org.users.requestCollection(`Retrieving org users`)
    ),
    call(
      getResourceCollection,
      actions.user.org.accounts.requestCollection(`Retrieving user's accounts`)
    ),
  ]);
}

export function* retrievingUserDetails() {
  yield all(
    intializationResources.map(resource =>
      call(
        getResource,
        actions.user[resource].request(`Retrieving user's ${resource}`)
      )
    )
  );
}

export function* validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid(
  defaultAShareId
) {
  const isValidSharedAccountId = yield select(
    selectors.isValidSharedAccountId,
    defaultAShareId
  );

  if (isValidSharedAccountId) {
    return defaultAShareId;
  }

  return yield select(selectors.getOneValidSharedAccountId);
}

export function* retrieveAppInitializationResources() {
  yield call(retrievingOrgDetails);
  yield call(retrievingUserDetails);
  const { defaultAShareId } = yield select(selectors.userPreferences);
  let calculatedDefaultAShareId = defaultAShareId;
  const hasAcceptedAccounts = yield select(selectors.hasAcceptedAccounts);

  if (hasAcceptedAccounts) {
    calculatedDefaultAShareId = yield call(
      validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
      defaultAShareId
    );
  } else {
    calculatedDefaultAShareId = ACCOUNT_IDS.OWN;
  }

  if (defaultAShareId !== calculatedDefaultAShareId) {
    yield put(
      actions.user.preferences.update({
        defaultAShareId: calculatedDefaultAShareId,
        environment: 'production',
      })
    );
  }

  yield put(actions.auth.defaultAccountSet());
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
    const isExpired = yield select(selectors.isSessionExpired);

    yield call(setCSRFToken, apiAuthentications._csrf);
    yield put(actions.auth.complete());

    yield call(retrieveAppInitializationResources);

    if (isExpired) {
      // remount the component
      yield put(actions.reloadApp());
    }
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
      const _csrf = yield call(getCSRFTokenBackend);

      yield call(setCSRFToken, _csrf);

      yield put(actions.auth.complete());
      yield call(retrieveAppInitializationResources);
    } else {
      // existing session is invalid
      yield put(actions.auth.logout({ isExistingSessionInvalid: true }));
    }
  } catch (e) {
    yield put(actions.auth.logout());
  }
}

export function* invalidateSession({ isExistingSessionInvalid = false } = {}) {
  // if existing session is valid lets
  // go ahead and make an api call to invalidate the session
  // otherwise skip it

  if (!isExistingSessionInvalid) {
    const _csrf = yield call(getCSRFToken);
    const logoutOpts = { ...logoutParams.opts, body: { _csrf } };

    try {
      yield call(apiCallWithRetry, {
        path: logoutParams.path,
        opts: logoutOpts,
        message: 'Logging out user',
      });
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  // Irrespective to what happens we will remove the csrf token and
  // clear the store
  yield call(removeCSRFToken);
  yield put(actions.auth.clearStore());
}

export const authenticationSagas = [
  takeLeading(actionTypes.USER_LOGOUT, invalidateSession),
  takeEvery(actionTypes.INIT_SESSION, initializeApp),
  takeEvery(actionTypes.AUTH_REQUEST, auth),
];

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
  getCSRFToken,
  removeCSRFToken,
} from '../../utils/session';
import * as selectors from '../../reducers';
import { initializationResources } from '../../reducers/data/resources';
import { ACCOUNT_IDS } from '../../utils/constants';

export function* retrievingOrgDetails() {
  yield all([
    call(
      getResourceCollection,
      actions.user.org.accounts.requestLicenses('Retrieving licenses')
    ),
    call(
      getResourceCollection,
      actions.user.org.users.requestCollection('Retrieving org users')
    ),
    call(
      getResourceCollection,
      actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
    ),
  ]);
}

export function* retrievingUserDetails() {
  yield all(
    initializationResources.map(resource =>
      call(
        getResource,
        actions.user[resource].request(`Retrieving user's ${resource}`)
      )
    )
  );
}

export function* retrievingAssistantDetails() {
  const collection = yield call(
    getResourceCollection,
    actions.resource.requestCollection('ui/assistants')
  );
  const assistantConnectors = [];
  const webhookAssistants = [
    'activecampaign',
    'dropbox',
    'github',
    'box',
    'hubspot',
    'intercom',
    'jira',
    'mailchimp',
    'parseur',
    'postmark',
    'recurly',
    'intercom',
    'segment',
    'shipwire',
    'shopify',
    'slack',
    'stripe',
    'travis',
  ];

  if (
    collection &&
    collection.http.applications &&
    collection.rest.applications
  ) {
    collection.http.applications.forEach(asst => {
      assistantConnectors.push({
        id: asst._id,
        name: asst.name,
        type: 'http',
        assistant: asst._id,
        export: asst.export,
        import: asst.import,
        useGenericAdaptor: asst.useGenericAdaptor,
        webhook: webhookAssistants.indexOf(asst._id) >= 0,
      });
    });
    collection.rest.applications.forEach(asst => {
      assistantConnectors.push({
        id: asst._id,
        name: asst.name,
        type: 'rest',
        assistant: asst._id,
        export: asst.export,
        import: asst.import,
        webhook: webhookAssistants.indexOf(asst._id) >= 0,
      });
    });
    assistantConnectors.push({
      id: 'financialforce',
      name: 'FinancialForce',
      type: 'salesforce',
      assistant: 'financialforce',
      export: true,
      import: true,
    });
  }

  localStorage.setItem('assistants', JSON.stringify(assistantConnectors));
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
  yield all([
    call(retrievingOrgDetails),
    call(retrievingUserDetails),
    call(retrievingAssistantDetails),
  ]);
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
      hidden: true,
    });
    const isExpired = yield select(selectors.isSessionExpired);

    yield call(setCSRFToken, apiAuthentications._csrf);
    yield put(actions.auth.complete());

    yield call(retrieveAppInitializationResources);

    if (isExpired) {
      // remount the component
      yield put(actions.app.reload());
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

export function* signInWithGoogle({ returnTo }) {
  const _csrf = yield call(getCSRFTokenBackend);
  const form = document.createElement('form');

  form.id = 'signinWithGoogle';
  form.method = 'POST';
  form.action = `/auth/google?returnTo=${returnTo || '/pg/'}`;

  form.innerHTML = `<input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export function* reSignInWithGoogle({ email }) {
  const _csrf = yield call(getCSRFTokenBackend);
  const form = document.createElement('form');

  form.id = 'reSigninWithGoogle';
  form.method = 'POST';
  form.action = '/reSigninWithGoogle';
  form.target = '_blank';

  form.innerHTML = `<input name="skipRedirect" value="false"><input name="login_hint" value="${email}"><input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export function* linkWithGoogle({ returnTo }) {
  const _csrf = yield call(getCSRFTokenBackend);
  const form = document.createElement('form');

  form.id = 'linkWithGoogle';
  form.method = 'POST';
  form.action = `/link/google?returnTo=${returnTo || '/pg/'}`;

  form.innerHTML = `<input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export const authenticationSagas = [
  takeLeading(actionTypes.USER_LOGOUT, invalidateSession),
  takeEvery(actionTypes.INIT_SESSION, initializeApp),
  takeEvery(actionTypes.AUTH_REQUEST, auth),
  takeEvery(actionTypes.AUTH_SIGNIN_WITH_GOOGLE, signInWithGoogle),
  takeEvery(actionTypes.AUTH_RE_SIGNIN_WITH_GOOGLE, reSignInWithGoogle),
  takeEvery(actionTypes.AUTH_LINK_WITH_GOOGLE, linkWithGoogle),
];

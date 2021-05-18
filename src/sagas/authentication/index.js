import {
  call,
  put,
  takeEvery,
  takeLeading,
  all,
  select,
} from 'redux-saga/effects';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
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
import { selectors } from '../../reducers';
import { initializationResources } from '../../reducers/data/resources';
import { ACCOUNT_IDS } from '../../utils/constants';
import getRoutePath from '../../utils/routePaths';
import { getDomain } from '../../utils/resource';

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
    'segment',
    'shipwire',
    'integratorio',
    'shopify',
    'slack',
    'stripe',
    'travis',
    'surveymonkey',
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
        helpURL: asst.helpURL,
        webhook: webhookAssistants.some(assistantId => assistantId === asst._id),
        group: asst.group,
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
        helpURL: asst.helpURL,
        webhook: webhookAssistants.some(assistantId => assistantId === asst._id),
        group: asst.group,
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

export function* fetchUIVersion() {
  let resp;

  try {
    resp = yield call(apiCallWithRetry, {
      path: '/ui/version?app=react',
    });
  // eslint-disable-next-line no-empty
  } catch (e) {
  }
  if (resp?.version) {
    yield put(actions.app.updateUIVersion(resp.version));
  }
}

export function* retrieveAppInitializationResources() {
  yield call(retrievingUserDetails);
  yield all([
    call(retrievingOrgDetails),
    call(retrievingAssistantDetails),
  ]);

  yield put(actions.app.fetchUiVersion());
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
const getLogrocketId = () =>
  // LOGROCKET_IDENTIFIER and LOGROCKET_IDENTIFIER_EU are defined by webpack
  // eslint-disable-next-line no-undef
  (getDomain() === 'eu.integrator.io' ? LOGROCKET_IDENTIFIER_EU : LOGROCKET_IDENTIFIER);

export function* identifyLogRocketSession() {
  const p = yield select(selectors.userProfile);

  // identify user with LogRocket
  if (p?._id) {
    LogRocket.identify(p._id, {
      name: p.name,
      email: p.email,
      company: p.company,
      developer: !!p.developer,
    });
  }
}
export function* initializeLogrocket() {
  LogRocket.init(getLogrocketId(), {
    // RELEASE_VERSION is defined by webpack
    // eslint-disable-next-line no-undef
    release: RELEASE_VERSION,
    console: {
      isEnabled: {
        debug: false,
        log: false,
      },
    },
    dom: {
    // Yang: this is an overkill
    // but it is the safest, we need to tag input/text tags with data-public attributes to allow them to be captured
    // however, it might not be easy to do for components coming from other packages
      inputSanitizer: true,
      textSanitizer: true,
    },
    network: {
      requestSanitizer: req => {
        if (req.url.search(/aptrinsic\.com/) > -1) return null;
        // Yang: this is likely too broad
        // we may want to track non-sensitive/error request data later
        // eslint-disable-next-line no-param-reassign
        req.body = null;

        return req;
      },
      responseSanitizer: response => {
        // Yang: this is likely too broad
        // we may want to track non-sensitive/error response data later
        response.body = null;

        return response;
      },
    },
  });
  setupLogRocketReact(LogRocket);

  yield call(identifyLogRocketSession);
}

let LOGROCKET_INITIALIZED = false;
export function* initializeApp(opts) {
  // Important: Do not start off any async saga actions(esp those making network calls)
  // before logrocket initialization
  if (!LOGROCKET_INITIALIZED && getLogrocketId()) {
    LOGROCKET_INITIALIZED = true;

    // stop sagas, init logrocket, and restart sagas
    // note the current saga `initializeApp` is killed as well
    // so that it needs to be called again after logrocket is initialized and sagas restarted
    // that happens in sagas/index.js
    return yield put(actions.auth.abortAllSagasAndInitLR(opts));
  }

  // delete data state when reloading app...
  // so that all components lazily fetches latest data
  if (opts?.reload) {
    yield put(actions.app.deleteDataState());
  }
  try {
    yield call(retrieveAppInitializationResources);
  } catch (e) {
    return yield put(actions.auth.logout());
  }
  // the following is moved from within auth*() to here to keep original impl
  if (opts?.reload) {
    // remount the component
    yield put(actions.app.reload());
  }

  if (getLogrocketId()) {
    yield call(identifyLogRocketSession);
  }
}

export function* getCSRFTokenBackend() {
  const { _csrf } = yield call(apiCallWithRetry, {
    path: getCSRFParams.path,
    message: 'Requesting CSRF token',
  });

  return _csrf;
}

export function* setLastLoggedInLocalStorage() {
  const profile = yield call(
    getResource,
    actions.user.profile.request('Retrieving user\'s Profile')
  );

  localStorage.setItem('latestUser', profile?._id);
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

    yield call(setLastLoggedInLocalStorage);
    yield put(actions.auth.complete());

    // Important: Do not start off any async saga actions(esp those making network calls)
    // before logrocket initialization
    yield call(initializeApp, { reload: isExpired });
    // Important: intializeApp should be the last thing to happen in this function
  } catch (error) {
    yield put(actions.auth.failure('Authentication Failure'));
    yield put(actions.user.profile.delete());
  }
}

export function* initializeSession() {
  try {
    const resp = yield call(
      getResource,
      actions.user.profile.request('Initializing application')
    );

    if (resp) {
      const _csrf = yield call(getCSRFTokenBackend);

      yield call(setCSRFToken, _csrf);
      yield call(setLastLoggedInLocalStorage);

      yield put(actions.auth.complete());

      // Important: Do not start off any async saga actions(esp those making network calls)
      // before logrocket initialization
      yield call(initializeApp);
    // Important: intializeApp should be the last thing to happen in this function
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
  yield put(actions.auth.abortAllSagasAndReset());
}

export function* signInWithGoogle({ returnTo }) {
  const _csrf = yield call(getCSRFTokenBackend);
  const form = document.createElement('form');

  form.id = 'signinWithGoogle';
  form.method = 'POST';
  form.action = `/auth/google?returnTo=${returnTo || getRoutePath('/')}`;

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
export function* reSignInWithSSO() {
  const _csrf = yield call(getCSRFTokenBackend);
  const ssoClientId = yield select(selectors.userLinkedSSOClientId);
  const form = document.createElement('form');

  form.id = 'reSigninWithSSO';
  form.method = 'POST';
  form.action = `/reSigninWithSSO/${ssoClientId}`;
  form.target = '_blank';

  form.innerHTML = `<input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export function* linkWithGoogle({ returnTo }) {
  const _csrf = yield call(getCSRFTokenBackend);

  const form = document.createElement('form');

  form.id = 'linkWithGoogle';
  form.method = 'POST';
  form.action = `/link/google?returnTo=${returnTo || getRoutePath('/')}`;

  form.innerHTML = `<input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  form.submit();

  document.body.removeChild(form);
}

export const authenticationSagas = [
  takeLeading(actionTypes.USER_LOGOUT, invalidateSession),
  takeEvery(actionTypes.INIT_SESSION, initializeSession),
  takeEvery(actionTypes.AUTH_REQUEST, auth),
  takeEvery(actionTypes.UI_VERSION_FETCH, fetchUIVersion),
  takeEvery(actionTypes.AUTH_SIGNIN_WITH_GOOGLE, signInWithGoogle),
  takeEvery(actionTypes.AUTH_RE_SIGNIN_WITH_GOOGLE, reSignInWithGoogle),
  takeEvery(actionTypes.AUTH_RE_SIGNIN_WITH_SSO, reSignInWithSSO),
  takeEvery(actionTypes.AUTH_LINK_WITH_GOOGLE, linkWithGoogle),
];

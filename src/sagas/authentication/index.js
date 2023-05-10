import {
  call,
  put,
  takeEvery,
  all,
  select,
} from 'redux-saga/effects';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { authParams, logoutParams, getCSRFParams, resetRequestParams, resetPasswordRequestParams, setPasswordRequestParams, setChangeEmailParams} from '../api/apiPaths';
import { apiCallWithRetry } from '../index';
import { getResource, getResourceCollection } from '../resources';
import {
  setCSRFToken,
  getCSRFToken,
  removeCSRFToken,
} from '../../utils/session';
import { safeParse } from '../../utils/string';
import { generateInnerHTMLForSignUp } from '../utils/index';
import { selectors } from '../../reducers';
import { initializationResources } from '../../reducers/data/resources/resourceUpdate';
import { ACCOUNT_IDS, AUTH_FAILURE_MESSAGE, SIGN_UP_SUCCESS } from '../../constants';
import { message } from '../../utils/messageStore';
import getRoutePath from '../../utils/routePaths';
import { getDomain } from '../../utils/resource';
import inferErrorMessages from '../../utils/inferErrorMessages';
import { updatePreferences } from '../users';

export function* retrievingOrgDetails() {
  yield all([
    call(
      getResourceCollection,
      actions.user.org.users.requestCollection('Retrieving org users')
    ),
    call(
      getResourceCollection,
      actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
    ),
  ]);
  const hasAcceptedAccounts = yield select(selectors.hasAcceptedAccounts);
  const defaultAShareId = yield select(selectors.defaultAShareId);

  if (!hasAcceptedAccounts && (!defaultAShareId || defaultAShareId === 'own')) {
    yield call(
      getResourceCollection,
      actions.license.requestLicenses('Retrieving licenses')
    );
  }
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
export function* retrievingHttpConnectorDetails() {
  const collection = yield call(
    getResourceCollection,
    actions.resource.requestCollection('httpconnectors')
  );

  localStorage.setItem('publishedHttpConnectors', JSON.stringify(collection));
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
    'pagerduty',
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
      // this is necessary because this route does not update the session
      shouldNotUpdateAuthTimestamp: true,
    });

  // eslint-disable-next-line no-empty
  } catch (e) {}
  if (resp?.version) {
    yield put(actions.app.updateUIVersion(resp.version));
  }
}

export function* checkAndUpdateDefaultSetId() {
  yield call(retrievingUserDetails);

  yield call(
    getResourceCollection,
    actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
  );
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
      }, true)
    );
    yield call(updatePreferences); // we have wait till preference get updated in the BE to proceed further.
  }
}

export function* retrieveAppInitializationResources() {
  // yield call(requestMFASessionInfo);
  const isMFASetupIncomplete = yield select(selectors.isMFASetupIncomplete);

  if (isMFASetupIncomplete) {
    // Incase the account user has not yet setup mfa and owner has enforced require mfa, then we only fetch ashare accounts
    // all other APIs are evaded
    return yield call(
      getResourceCollection,
      actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
    );
  }

  yield put(actions.app.fetchUiVersion());
  yield call(checkAndUpdateDefaultSetId);
  yield all([
    call(retrievingOrgDetails),
    call(retrievingAssistantDetails),
    call(retrievingHttpConnectorDetails),
  ]);

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
    mergeIframes: true,
    childDomains: ['*'],
    console: {
      isEnabled: {
        debug: false,
        log: false,
      },
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
  if (opts?.mfaVerifySuccess) {
    yield put(actions.auth.mfaVerify.success());
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
export function* validateAcceptInviteToken({ token }) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const apiResponse = yield call(apiCallWithRetry, {
      path: '/accept-invite-metadata',
      message: 'Validate accept invite token',
      opts: {
        method: 'POST',
        body: {
          token,
          _csrf,
        },
      },
      hidden: true,
    });

    yield put(actions.auth.acceptInvite.validateSuccess(apiResponse));
  } catch (e) {
    yield put(actions.auth.acceptInvite.validateError(e));
  }
}
export function* submitAcceptInvite({payload}) {
  try {
    const response = yield call(apiCallWithRetry, {
      path: '/accept-invite?no_redirect=true',
      opts: {
        body: payload,
        method: 'POST',
      },
      message: 'Accept invite',
      hidden: true,
    });

    if (response.success) {
      yield put(actions.auth.acceptInvite.success(response));
      yield put(actions.auth.signupStatus('done', response.message));
    }
  } catch (e) {
    const errJSON = safeParse(e);

    const errorMsg = errJSON?.errors?.[0]?.message;

    yield put(actions.auth.acceptInvite.failure({message: [errorMsg], type: 'error'}));
  }
}
export function* resetRequest({ email }) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const credentialsBody = { email, _csrf};
    const payload = { ...resetRequestParams.opts, body: credentialsBody };
    const apiResponse = yield call(apiCallWithRetry, {
      path: resetRequestParams.path,
      opts: payload,
      message: 'User Password Reset Request',
      hidden: true,
    });

    if (apiResponse?.success) {
      yield put(actions.auth.resetRequestSuccess({...apiResponse}));
    } else if (apiResponse?.errors) {
      const errObj = apiResponse?.errors;
      const authError = inferErrorMessages(errObj?.message)?.[0];

      yield put(actions.auth.resetRequestFailed(authError));
    }
  } catch (error) {
    const authError = inferErrorMessages(error?.message)?.[0];

    yield put(actions.auth.resetRequestFailed(authError));
  }
}
export function* setPasswordRequest({ password, token }) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const credentialsBody = { password, token, _csrf};
    const payload = { ...setPasswordRequestParams.opts, body: credentialsBody };
    const apiResponse = yield call(apiCallWithRetry, {
      path: setPasswordRequestParams.path,
      opts: payload,
      message: 'User Set Password Reset Request',
      hidden: true,
    });

    if (apiResponse?.success) {
      yield put(actions.auth.setPasswordRequestSuccess({...apiResponse}));
    }
  } catch (error) {
    const authError = inferErrorMessages(error?.message)?.[0];

    yield put(actions.auth.setPasswordRequestFailed(authError));
  }
}
export function* changeEmailRequest({ token }) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const credentialsBody = { token, _csrf};
    const payload = { ...resetRequestParams.opts, body: credentialsBody };
    const apiResponse = yield call(apiCallWithRetry, {
      path: setChangeEmailParams.path,
      opts: payload,
      message: 'User change email Request',
      hidden: true,
    });

    if (apiResponse?.success) {
      yield put(actions.auth.changeEmailSuccess({...apiResponse}));
    } else if (apiResponse?.errors) {
      const errObj = apiResponse?.errors;
      const authError = inferErrorMessages(errObj?.message)?.[0];

      yield put(actions.auth.changeEmailFailed(authError));
    }
  } catch (error) {
    const authError = inferErrorMessages(error?.message)?.[0];

    yield put(actions.auth.changeEmailFailed(authError));
  }
}
export function* resetPasswordRequest({ password, token }) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const credentialsBody = { password, token, _csrf};
    const payload = { ...resetPasswordRequestParams.opts, body: credentialsBody };
    const apiResponse = yield call(apiCallWithRetry, {
      path: resetPasswordRequestParams.path,
      opts: payload,
      message: 'User Password Reset Request',
      hidden: true,
    });

    if (apiResponse?.success) {
      yield put(actions.auth.resetPasswordSuccess({...apiResponse}));
    }
  } catch (error) {
    const authError = inferErrorMessages(error?.message)?.[0];

    yield put(actions.auth.resetPasswordFailed(authError));
  }
}
export function* setLastLoggedInLocalStorage() {
  const profile = yield call(
    getResource,
    actions.user.profile.request('Retrieving user\'s Profile')
  );

  localStorage.setItem('latestUser', profile?._id);
}
export function* validateSession() {
  const response = yield call(apiCallWithRetry, {
    path: '/validate-session',
    message: 'Authenticating User',
    hidden: true,
  });

  yield put(actions.mfa.receivedSessionInfo(response));

  return response;
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
    const resp = yield call(validateSession);

    if (apiAuthentications?.success && apiAuthentications.mfaRequired) {
      // Once login is success, incase of mfaRequired, user has to enter OTP to successfully authenticate
      // So , we redirect him to OTP (/mfa/verify) page
      yield call(setCSRFToken, apiAuthentications._csrf);
      if (apiAuthentications?.isAccountUser && resp.mfaSetupRequired) {
        // This request will fail in case of owner user
        yield call(
          getResourceCollection,
          actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
        );
      }

      return yield put(actions.auth.mfaRequired(apiAuthentications));
    }
    const isExpired = yield select(selectors.isSessionExpired);

    yield call(setCSRFToken, apiAuthentications._csrf);

    yield call(setLastLoggedInLocalStorage);
    yield put(actions.auth.complete());

    // Important: Do not start off any async saga actions(esp those making network calls)
    // before logrocket initialization
    yield call(initializeApp, { reload: isExpired });
    // Important: initializeApp should be the last thing to happen in this function
  } catch (error) {
    let authError = inferErrorMessages(error?.message)?.[0];

    if (typeof authError !== 'string') {
      authError = AUTH_FAILURE_MESSAGE;
    }
    yield put(actions.auth.failure(authError));
    yield put(actions.user.profile.delete());
  }
}

export function* signup({payloadBody}) {
  try {
    const _csrf = yield call(getCSRFTokenBackend);
    const credentialsBody = { ...payloadBody, _csrf };
    const payload = { ...authParams.opts, body: credentialsBody };
    const apiAuthentications = yield call(apiCallWithRetry, {
      path: '/signup?no_redirect=true',
      opts: payload,
      message: 'Authenticating User',
      hidden: true,
    });

    if (apiAuthentications.success) {
      yield put(actions.auth.signupStatus('success', apiAuthentications.message || SIGN_UP_SUCCESS));
    }
  } catch (error) {
    let authError = inferErrorMessages(error?.message)?.[0];

    if (typeof authError !== 'string') {
      authError = AUTH_FAILURE_MESSAGE;
    }
    yield put(actions.auth.signupStatus('failed', authError));
    yield put(actions.user.profile.delete());
  }
}

export function* validateAndInitSession() {
  const resp = yield call(validateSession);
  let isUserAuthenticated = resp.authenticated;

  if (resp.mfaRequired) {
    isUserAuthenticated = resp.mfaVerified;
  }

  if (isUserAuthenticated) {
    yield put(actions.auth.complete());
    yield call(initializeApp);
  }
}

export function* initializeSession({opts} = {}) {
  try {
    const resp = yield call(validateSession);
    let isUserAuthenticated = resp.authenticated;

    if (resp.mfaRequired) {
      isUserAuthenticated = resp.mfaVerified;
    }
    if (opts?.switchAcc) {
      yield put(actions.user.org.accounts.switchToComplete());
    }
    if (resp.authenticated) {
      const _csrf = yield call(getCSRFTokenBackend);

      yield call(setCSRFToken, _csrf);
    }
    if (isUserAuthenticated) {
      yield call(setLastLoggedInLocalStorage);

      yield put(actions.auth.complete());

      // Important: Do not start off any async saga actions(esp those making network calls)
      // before logrocket initialization
      yield call(initializeApp, opts);
    // Important: intializeApp should be the last thing to happen in this function
    } else {
      // existing session is invalid
      const isMFASetupIncomplete = yield select(selectors.isMFASetupIncomplete);

      if (opts?.switchAcc && resp.mfaRequired && !resp.mfaVerified) {
        yield put(actions.auth.mfaRequired({...resp, isAccountUser: true, dontAllowTrustedDevices: true}));
      } else if (!isMFASetupIncomplete) {
        yield put(actions.auth.logout(true));
      }
      if (isMFASetupIncomplete) {
        yield call(retrieveAppInitializationResources);
      }
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
    let _csrf = yield call(getCSRFToken);

    if (!_csrf) {
      _csrf = yield call(getCSRFTokenBackend);
    }
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

export function* signUpWithGoogle({ returnTo, utmParams = {}}) {
  const _csrf = yield call(getCSRFTokenBackend);
  const htmlForUtmParams = generateInnerHTMLForSignUp(utmParams);
  const form = document.createElement('form');

  form.id = 'signinWithGoogle';
  form.method = 'POST';
  form.action = `/auth/google?returnTo=${returnTo || getRoutePath('/')}`;
  form.innerHTML = `<input name="_csrf" value="${_csrf}">${htmlForUtmParams}`;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
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
  form.innerHTML = `<input name="skipRedirect" value="false"><input name="login_hint" value="${email}"><input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  // Open the form submission in a new window and set its opener to be the current window
  const newWindow = window.open('', 'newWindow');

  newWindow.opener = window;
  form.target = 'newWindow';
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
  form.innerHTML = `<input name="_csrf" value="${_csrf}">`;
  document.body.appendChild(form);
  // Open the form submission in a new window and set its opener to be the current window
  const newWindow = window.open('', 'newWindow');

  newWindow.opener = window;
  form.target = 'newWindow';
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

function* mfaVerify({ payload }) {
  const { code, trustDevice } = payload || {};
  const _csrf = yield call(getCSRFTokenBackend);
  const authFailedMsg = message.MFA.MFA_AUTH_FAILED;

  try {
    const status = yield call(apiCallWithRetry, {
      path: '/mfa/verify?no_redirect=true',
      opts: {
        method: 'POST',
        body: {code, trustDevice, _csrf},
      },
      hidden: true,
    });

    if (status?.success) {
      yield call(initializeSession, {opts: {mfaVerifySuccess: true}});

      return yield put(actions.auth.mfaVerify.success());
    }
    yield put(actions.auth.mfaVerify.failed(authFailedMsg));
  } catch (e) {
    const message = inferErrorMessages(e?.message)?.[0];

    yield put(actions.auth.mfaVerify.failed(message || authFailedMsg));
  }
}
export const authenticationSagas = [
  takeEvery(actionTypes.AUTH.ACCEPT_INVITE.VALIDATE, validateAcceptInviteToken),
  takeEvery(actionTypes.AUTH.ACCEPT_INVITE.SUBMIT, submitAcceptInvite),
  takeEvery(actionTypes.AUTH.INIT_SESSION, initializeSession),
  takeEvery(actionTypes.AUTH.VALIDATE_AND_INIT_SESSION, validateAndInitSession),
  takeEvery(actionTypes.AUTH.REQUEST, auth),
  takeEvery(actionTypes.AUTH.SIGNUP, signup),
  takeEvery(actionTypes.APP.UI_VERSION_FETCH, fetchUIVersion),
  takeEvery(actionTypes.AUTH.SIGNIN_WITH_GOOGLE, signInWithGoogle),
  takeEvery(actionTypes.AUTH.SIGNUP_WITH_GOOGLE, signUpWithGoogle),
  takeEvery(actionTypes.AUTH.RE_SIGNIN_WITH_GOOGLE, reSignInWithGoogle),
  takeEvery(actionTypes.AUTH.RE_SIGNIN_WITH_SSO, reSignInWithSSO),
  takeEvery(actionTypes.AUTH.LINK_WITH_GOOGLE, linkWithGoogle),
  takeEvery(actionTypes.AUTH.MFA_VERIFY.REQUEST, mfaVerify),
  takeEvery(actionTypes.AUTH.RESET_REQUEST, resetRequest),
  takeEvery(actionTypes.AUTH.RESET_PASSWORD_REQUEST, resetPasswordRequest),
  takeEvery(actionTypes.AUTH.SET_PASSWORD_REQUEST, setPasswordRequest),
  takeEvery(actionTypes.AUTH.CHANGE_EMAIL_REQUEST, changeEmailRequest),
  takeEvery(actionTypes.AUTH.VALIDATE_SESSION, validateSession),
];

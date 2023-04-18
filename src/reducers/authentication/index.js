import produce from 'immer';
import actionTypes from '../../actions/types';
import { emptyObject } from '../../constants';
import { COMM_STATES } from '../comms/networkComms/index';

const defaultState = { initialized: false, commStatus: COMM_STATES.LOADING };

// #region Reducers
export default function (state = defaultState, action) {
  const { auth = {} } = action;

  // Since the CLEAR_STORE action resets the state, it can not be placed in
  // the produce function since the draft object within the 'produce' fn context
  // should not be re-assigned. (only its properties)
  if (action.type === actionTypes.AUTH.CLEAR_STORE) {
    return {
      initialized: false,
      commStatus: COMM_STATES.LOADING,
      loggedOut: true, // why is this not in the defaultState?
      ...auth,
    };
  }
  const { type, showAuthError, mfaError, mfaAuthInfo, payload, response, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.AUTH.CHANGE_EMAIL_SUCCESSFUL:
        draft.changeEmailStatus = 'success';
        draft.changeEmailMessage = action.requestInfo.message;
        break;
      case actionTypes.AUTH.CHANGE_EMAIL_FAILED:
        draft.changeEmailStatus = 'failed';
        draft.changeEmailErrorMessage = action.error;
        delete draft.changeEmailMessage;
        break;
      case actionTypes.AUTH.RESET_REQUEST_SENT:
        draft.requestResetStatus = '';
        draft.resetRequestLoader = false;
        draft.requestResetEmail = '';
        draft.requestResetError = '';
        break;
      case actionTypes.AUTH.RESET_REQUEST:
        draft.resetRequestLoader = true;
        draft.requestResetStatus = 'requesting';
        draft.requestResetError = '';
        break;
      case actionTypes.AUTH.SET_PASSWORD_REQUEST:
        draft.requestSetPasswordStatus = 'loading';
        break;
      case actionTypes.AUTH.RESET_PASSWORD_REQUEST:
        draft.requestResetPasswordStatus = 'loading';
        break;
      case actionTypes.AUTH.SET_PASSWORD_REQUEST_FAILED:
        draft.requestSetPasswordStatus = 'failed';
        draft.requestSetPasswordError = action.error;
        break;
      case actionTypes.AUTH.RESET_PASSWORD_REQUEST_FAILED:
        draft.requestResetPasswordStatus = 'failed';
        draft.requestResetPasswordError = action.error;
        break;
      case actionTypes.AUTH.RESET_PASSWORD_REQUEST_SUCCESSFUL:
        draft.requestResetPasswordStatus = 'success';
        draft.requestResetPasswordMsg = action.resetPasswordRequestInfo.message;
        delete draft.requestResetPasswordError;
        break;
      case actionTypes.AUTH.RESET_REQUEST_FAILED:
        draft.resetRequestLoader = false;
        draft.requestResetStatus = 'failed';
        draft.requestResetError = action.error;
        break;
      case actionTypes.AUTH.RESET_REQUEST_SUCCESSFUL:
        draft.resetRequestLoader = false;
        draft.requestResetStatus = 'success';
        draft.requestResetError = '';
        draft.requestResetEmail = action.restRequestInfo.email;
        break;
      case actionTypes.AUTH.SET_PASSWORD_REQUEST_SUCCESSFUL:
        draft.requestSetPasswordStatus = 'success';
        if (!draft.signup) { draft.signup = {}; }
        draft.signup.status = 'done';
        draft.signup.message = action.setPasswordRequestInfo?.message;
        delete draft.requestSetPasswordError;
        break;
      case actionTypes.AUTH.INIT_SESSION:
        delete draft.showAuthError;
        draft.authenticated = false;
        draft.commStatus = COMM_STATES.LOADING;
        delete draft.loggedOut;
        break;

      case actionTypes.AUTH.REQUEST:
        if (showAuthError) { draft.showAuthError = true; }
        delete draft.failure;
        draft.authenticated = false;
        draft.commStatus = COMM_STATES.LOADING;
        delete draft.loggedOut;
        delete draft.userLoggedInDifferentTab;
        break;

      case actionTypes.AUTH.SUCCESSFUL:
        delete draft.showAuthError;
        draft.authenticated = true;
        draft.initialized = true;
        draft.commStatus = COMM_STATES.SUCCESS;
        delete draft.sessionExpired;
        delete draft.failure;
        break;

      case actionTypes.AUTH.MFA_REQUIRED:
        draft.mfaRequired = true;
        draft.mfaAuthInfo = mfaAuthInfo;
        delete draft.authTimestamp;
        delete draft.warning;
        draft.commStatus = COMM_STATES.SUCCESS;
        draft.initialized = true;
        draft.authenticated = false;
        break;

      case actionTypes.AUTH.FAILURE:
        draft.failure = action.message;
        draft.commStatus = COMM_STATES.ERROR;
        if (draft.authenticated) {
          draft.sessionExpired = true;
        }

        delete draft.authTimestamp;
        delete draft.warning;
        draft.initialized = true;
        draft.authenticated = false;
        break;

      case actionTypes.AUTH.DEFAULT_ACCOUNT_SET:
        draft.defaultAccountSet = true;
        break;
      case actionTypes.AUTH.USER_ALREADY_LOGGED_IN:
        draft.userLoggedInDifferentTab = true;
        break;
      case actionTypes.AUTH.TIMESTAMP:
        draft.authTimestamp = Date.now();
        delete draft.warning;
        break;

      case actionTypes.AUTH.WARNING:

        // if user is not authenticated there can not be a session timeout warning
        if (!draft.authenticated) { break; }

        draft.warning = true;

        break;

      case actionTypes.AUTH.SIGNUP_STATUS:
        if (!draft.signup) draft.signup = {};
        draft.signup.status = action.status;
        draft.signup.message = action.message;
        break;

      case actionTypes.AUTH.MFA_VERIFY.REQUEST:
        draft.mfaAuth = {};
        draft.mfaAuth.status = 'requested';
        break;

      case actionTypes.AUTH.MFA_VERIFY.FAILED:
        if (!draft.mfaAuth) break;
        draft.mfaAuth.status = 'failed';
        draft.mfaAuth.error = mfaError;
        break;

      case actionTypes.AUTH.MFA_VERIFY.SUCCESS:
        if (!draft.mfaAuth) break;
        delete draft.mfaRequired;
        delete draft.mfaAuthInfo;
        draft.mfaAuth = { status: 'success' };
        break;
      case actionTypes.AUTH.ACCEPT_INVITE.VALIDATE:
        draft.acceptInvite = {
          status: 'requested',
        };
        break;
      case actionTypes.AUTH.ACCEPT_INVITE.VALIDATE_SUCCESS:
        if (!draft.acceptInvite) draft.acceptInvite = {};
        draft.acceptInvite = {...payload, status: 'received'};
        break;
      case actionTypes.AUTH.ACCEPT_INVITE.FAILED:
        if (!draft.acceptInvite) draft.acceptInvite = {};
        draft.acceptInvite = {...error, status: 'errored'};
        break;
      case actionTypes.AUTH.ACCEPT_INVITE.VALIDATE_ERROR:
        if (!draft.acceptInvite) draft.acceptInvite = {};
        draft.acceptInvite = { status: 'errored'};
        break;
      case actionTypes.AUTH.ACCEPT_INVITE.SUCCESS:
        if (!draft.acceptInvite) draft.acceptInvite = {};
        draft.acceptInvite.redirectUrl = response.ssoRedirectURL || '/home';
        break;
      case actionTypes.AUTH.ACCEPT_INVITE.CLEAR:
        delete draft.acceptInvite;
        break;
      default:
    }
  });
}
// #endregion

// #region Selectors
export const selectors = {};

selectors.isAuthLoading = state => state?.commStatus === COMM_STATES.LOADING;
// when we logout we clear the state...the reducer defaults it to COMM_STATE loading and authentication property is deleted
// Hence we use state.authenticated undefined as an indication to ignore signin loading during logout
selectors.isAuthenticating = state => selectors.isAuthLoading(state) && state?.authenticated === false;
// show auth error when user is logged in
selectors.showAuthError = state => state?.showAuthError;
selectors.shouldRedirectToSignIn = state => state?.acceptInvite?.redirectUrl;
selectors.acceptInviteData = state => state?.acceptInvite;
selectors.showSessionStatus = state => {
  const { sessionExpired, warning } = state;

  // authenticated and session Expired are mutually exclusive
  if (warning) {
    return 'warning';
  }
  if (sessionExpired) {
    return 'expired';
  }
};

selectors.isMFAAuthRequired = state => !!state?.mfaRequired;
selectors.mfaAuthInfo = state => state?.mfaAuthInfo || emptyObject;
selectors.isMFAAuthRequested = state => {
  if (!state?.mfaAuth) return false;

  return state.mfaAuth.status === 'requested';
};
selectors.isMFAAuthFailed = state => {
  if (!state?.mfaAuth) return false;

  return state.mfaAuth.status === 'failed';
};
selectors.mfaError = state => state?.mfaAuth?.error;
selectors.requestResetEmail = state => state?.requestResetEmail;
selectors.signupStatus = state => state?.signup?.status;
selectors.signupMessage = state => state?.signup?.message;
selectors.setPasswordError = state => state?.setPasswordError;
selectors.requestResetError = state => state?.requestResetError;
selectors.resetRequestLoader = state => state?.resetRequestLoader || false;
selectors.requestResetStatus = state => state?.requestResetStatus || '';
selectors.changeEmailStatus = state => state?.changeEmailStatus || '';
selectors.changeEmailMessage = state => state?.changeEmailMessage || '';
selectors.changeEmailErrorMessage = state => state?.changeEmailErrorMessage || '';
selectors.requestResetPasswordError = state => state?.requestResetPasswordError;
selectors.requestResetPasswordStatus = state => state?.requestResetPasswordStatus || '';
selectors.requestResetPasswordMsg = state => state?.requestResetPasswordMsg || '';
selectors.requestSetPasswordError = state => state?.requestSetPasswordError;
selectors.requestSetPasswordStatus = state => state?.requestSetPasswordStatus || '';
selectors.isMFAAuthVerified = state => {
  if (!state?.mfaAuth) return false;

  return state.mfaAuth.status === 'success';
};
// #endregion Selectors

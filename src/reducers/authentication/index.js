import produce from 'immer';
import actionTypes from '../../actions/types';
import { emptyObject } from '../../constants';
import { COMM_STATES } from '../comms/networkComms/index';

const defaultState = { initialized: false, commStatus: COMM_STATES.LOADING };

// #region Reducers
export default function (state = defaultState, action) {
  // Since the CLEAR_STORE action resets the state, it can not be placed in
  // the produce function since the draft object within the 'produce' fn context
  // should not be re-assigned. (only its properties)
  if (action.type === actionTypes.AUTH.CLEAR_STORE) {
    return {
      initialized: false,
      commStatus: COMM_STATES.LOADING,
      loggedOut: true, // why is this not in the defaultState?
    };
  }

  const {type, showAuthError, mfaError, mfaAuthInfo} = action;

  return produce(state, draft => {
    switch (type) {
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
selectors.isMFAAuthVerified = state => {
  if (!state?.mfaAuth) return false;

  return state.mfaAuth.status === 'success';
};
// #endregion Selectors

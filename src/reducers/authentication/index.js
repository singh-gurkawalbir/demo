import produce from 'immer';
import actionTypes from '../../actions/types';
import { COMM_STATES } from '../comms/networkComms/index';

const defaultState = { initialized: false, commStatus: COMM_STATES.LOADING };

// #region Reducers
export default function (state = defaultState, action) {
  // Since the CLEAR_STORE action resets the state, it can not be placed in
  // the produce function since the draft object within the 'produce' fn context
  // should not be re-assigned. (only its properties)
  if (action.type === actionTypes.CLEAR_STORE) {
    return {
      initialized: false,
      commStatus: COMM_STATES.LOADING,
      loggedOut: true, // why is this not in the defaultState?
    };
  }

  const {type, showAuthError} = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.INIT_SESSION:

        delete draft.showAuthError;
        draft.authenticated = false;
        draft.commStatus = COMM_STATES.LOADING;
        delete draft.loggedOut;
        break;

      case actionTypes.AUTH_REQUEST:
        if (showAuthError) { draft.showAuthError = true; }
        delete draft.failure;
        draft.authenticated = false;
        draft.commStatus = COMM_STATES.LOADING;
        delete draft.loggedOut;
        delete draft.userLoggedInDifferentTab;
        break;

      case actionTypes.AUTH_SUCCESSFUL:
        delete draft.showAuthError;
        draft.authenticated = true;
        draft.initialized = true;
        draft.commStatus = COMM_STATES.SUCCESS;
        delete draft.sessionExpired;
        delete draft.failure;
        break;

      case actionTypes.AUTH_FAILURE:
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

      case actionTypes.DEFAULT_ACCOUNT_SET:
        draft.defaultAccountSet = true;
        break;
      case actionTypes.AUTH_USER_ALREADY_LOGGED_IN:
        draft.userLoggedInDifferentTab = true;
        break;
      case actionTypes.AUTH_TIMESTAMP:
        draft.authTimestamp = Date.now();
        delete draft.warning;
        break;

      case actionTypes.AUTH_WARNING:

        // if user is not authenticated there can not be a session timeout warning
        if (!draft.authenticated) { break; }

        draft.warning = true;

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
// #endregion Selectors

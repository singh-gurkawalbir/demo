import actionTypes from '../../actions/types';
import { COMM_STATES } from '../comms/index';

export default function(
  state = { initialized: false, commStatus: COMM_STATES.LOADING },
  action
) {
  let newState;

  switch (action.type) {
    case actionTypes.INIT_SESSION:
    case actionTypes.AUTH_REQUEST: {
      newState = { ...state, authenticated: false };
      newState.commStatus = COMM_STATES.LOADING;
      delete newState.loggedOut;

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = {
        ...state,
        authenticated: true,
        initialized: true,
      };

      newState.commStatus = COMM_STATES.SUCCESS;
      delete newState.sessionExpired;
      delete newState.failure;

      return newState;
    }

    case actionTypes.AUTH_FAILURE: {
      newState = { ...state, failure: action.message };

      newState.commStatus = COMM_STATES.ERROR;

      if (newState.authenticated) {
        newState.sessionExpired = true;
      }

      delete newState.authTimestamp;

      newState.initialized = true;

      newState.authenticated = false;

      return newState;
    }

    case actionTypes.DEFAULT_ACCOUNT_SET: {
      newState = {
        ...state,
        defaultAccountSet: true,
      };

      return newState;
    }

    case actionTypes.AUTH_TIMESTAMP: {
      return {
        ...state,
        authTimestamp: Date.now(),
      };
    }

    case actionTypes.CLEAR_STORE: {
      newState = {
        initialized: false,
        commStatus: COMM_STATES.LOADING,
        loggedOut: true,
      };

      return newState;
    }

    default: {
      return state;
    }
  }
}

1000;

export function showSessionStatus(state, date) {
  const { authenticated, authTimestamp, sessionExpired } = state;

  // authenticated and session Expired are mutually exclusive
  if (authenticated) {
    if (
      Number(process.env.SESSION_EXPIRATION_INTERVAL) + authTimestamp <
      date
    ) {
      return 'expired';
    }

    if (
      authTimestamp +
        Number(process.env.SESSION_EXPIRATION_INTERVAL) -
        Number(process.env.SESSION_WARNING_INTERVAL_PRIOR_TO_EXPIRATION) <
      date
    ) {
      return 'warning';
    }
  } else if (sessionExpired) return 'expired';
}

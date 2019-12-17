import actionTypes from '../../actions/types';
import { COMM_STATES } from '../comms/networkComms/index';

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
      delete newState.warning;
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
      newState = {
        ...state,
        authTimestamp: Date.now(),
      };

      delete newState.warning;

      return newState;
    }

    case actionTypes.AUTH_WARNING: {
      return {
        ...state,
        warning: true,
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

export function showSessionStatus(state) {
  const { sessionExpired, warning } = state;

  // authenticated and session Expired are mutually exclusive
  if (warning) {
    return 'warning';
  } else if (sessionExpired) return 'expired';
}

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

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = {
        ...state,
        authenticated: true,
        initialized: true,
      };

      newState.commStatus = COMM_STATES.SUCCESS;
      newState.loggedIn = true;
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

      newState.initialized = true;

      newState.authenticated = false;

      return newState;
    }
    // This is required by the shouldShowSelector in order
    // to show the signin page when the user logs out.
    // So some terminal auth state is given during logout.

    case actionTypes.CLEAR_STORE: {
      return {
        commStatus: COMM_STATES.LOADING,
      };
    }

    default: {
      return state;
    }
  }
}

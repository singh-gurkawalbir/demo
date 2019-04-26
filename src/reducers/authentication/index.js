import actionTypes from '../../actions/types';

export default function(state = { initialized: false }, action) {
  let newState;

  switch (action.type) {
    case actionTypes.AUTH_REQUEST: {
      newState = { ...state, loading: true, authenticated: false };

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = {
        ...state,
        loading: false,
        authenticated: true,
        initialized: true,
      };
      delete newState.sessionExpired;
      delete newState.failure;

      return newState;
    }

    case actionTypes.AUTH_FAILURE: {
      newState = { ...state, loading: false, failure: action.message };

      if (newState.authenticated) {
        newState.sessionExpired = true;
      }

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

    default: {
      return state;
    }
  }
}

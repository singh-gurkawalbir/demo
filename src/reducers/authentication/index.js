import actionTypes from '../../actions/types';

export default function(state = { initialized: true }, action) {
  let newState;

  switch (action.type) {
    case actionTypes.AUTH_REQUEST: {
      newState = { ...state, loading: true, authenticated: false };
      delete newState.failure;
      delete newState.initialized;

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = { ...state, loading: false, authenticated: true };
      delete newState.sessionExpired;
      delete newState.initialized;

      return newState;
    }

    case actionTypes.AUTH_FAILURE: {
      newState = { ...state, loading: false, failure: action.message };

      if (newState.authenticated) {
        newState.sessionExpired = true;
      }

      delete newState.initialized;

      newState.authenticated = false;

      return newState;
    }

    default: {
      return state;
    }
  }
}

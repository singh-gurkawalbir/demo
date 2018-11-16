import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  let newState;

  switch (action.type) {
    case actionTypes.AUTH_REQUEST: {
      newState = { ...state, loading: true, authenticated: false };
      delete newState.failure;

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = { ...state, loading: false, authenticated: true };
      delete newState.sessionExpired;

      return newState;
    }

    case actionTypes.AUTH_FAILURE: {
      newState = { ...state, loading: false, failure: action.message };

      if (newState.authenticated) {
        newState.sessionExpired = true;
      }

      newState.authenticated = false;

      return newState;
    }

    default:
      return state;
  }
};

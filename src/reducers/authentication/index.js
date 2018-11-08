//  import actionTypes from '../../actions/types';

import actionTypes from '../../actions/types';

export default (state = false, action) => {
  console.log(`In reducer ${JSON.stringify(action)}`);
  let newState;

  switch (action.type) {
    case actionTypes.AUTH_REQUEST: {
      newState = Object.assign({}, state) || {};
      newState.loading = true;
      newState.authenticated = false;
      delete newState.failure;

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = Object.assign({}, state) || {};
      newState.loading = false;
      newState.authenticated = true;
      delete newState.authDialog;

      return newState;
    }

    case actionTypes.AUTH_FAILURE: {
      newState = Object.assign({}, state) || {};
      newState.loading = false;

      if (newState.authenticated) {
        newState.authDialog = true;
      }

      newState.authenticated = false;
      newState.authenticated = false;
      newState.failure = action.message;

      return newState;
    }

    default:
      return state;
  }
};

export function isProfileLoading(state) {
  return state.loading && !state.authenticated;
}

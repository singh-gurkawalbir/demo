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

      return newState;
    }

    case actionTypes.AUTH_SUCCESSFUL: {
      newState = Object.assign({}, state) || {};
      newState.loading = false;
      newState.authenticated = true;

      return newState;
    }

    case actionTypes.AUTH_FAILURE: {
      newState = Object.assign({}, state) || {};
      newState.loading = false;
      newState.authenticated = false;
      newState.failure = action.payload;

      return newState;
    }

    default:
      return state;
  }
};

export function isProfileLoading(state) {
  return state.loading && !state.authenticated;
}

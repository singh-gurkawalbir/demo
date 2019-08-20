import actionTypes from '../../actions/types';

export default function(state = { count: 1 }, action) {
  switch (action.type) {
    case actionTypes.RELOAD_APP: {
      const { count } = state;
      const newCount = count + 1;

      return { count: newCount };
    }

    case actionTypes.APP_ERRORED: {
      return { ...state, appErrored: true };
    }

    case actionTypes.APP_CLEAR_ERROR: {
      const newState = { ...state };

      delete newState.appErrored;

      return newState;
    }

    default: {
      return state;
    }
  }
}

export function reloadCount(state) {
  return state && state.count;
}

export function appErrored(state) {
  if (!state) return null;

  return state && state.appErrored;
}

import actionTypes from '../../actions/types';

export default function(state = { drawerOpened: true, count: 1 }, action) {
  switch (action.type) {
    case actionTypes.APP_RELOAD: {
      const { count } = state;
      const newCount = count + 1;

      return { count: newCount };
    }

    case actionTypes.APP_TOGGLE_DRAWER: {
      return { ...state, drawerOpened: !state.drawerOpened };
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

// #region Selectors
export function drawerOpened(state) {
  return state && state.drawerOpened;
}

export function reloadCount(state) {
  return state && state.count;
}

export function appErrored(state) {
  if (!state) return null;

  return state && state.appErrored;
}
// #endregion

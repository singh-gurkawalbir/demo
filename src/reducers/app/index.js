import actionTypes from '../../actions/types';

export default function(
  state = {
    appErrored: false,
    drawerOpened: true,
    bannerOpened: true,
    count: 1,
  },
  action
) {
  switch (action.type) {
    case actionTypes.APP_RELOAD: {
      const { count } = state;
      const newCount = count + 1;

      return { count: newCount };
    }

    case actionTypes.APP_TOGGLE_BANNER: {
      return { ...state, bannerOpened: !state.bannerOpened };
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
export function bannerOpened(state) {
  if (!state) return true;

  return !!state.bannerOpened;
}

export function drawerOpened(state) {
  if (!state) return true;

  return !!state.drawerOpened;
}

export function reloadCount(state) {
  if (!state) return 0;

  return state.count;
}

export function appErrored(state) {
  if (!state) return null;

  return state.appErrored;
}
// #endregion

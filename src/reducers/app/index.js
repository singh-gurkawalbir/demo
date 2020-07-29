import produce from 'immer';
import actionTypes from '../../actions/types';

const defaultState = {
  appErrored: false,
  bannerOpened: true,
  count: 1,
};

// #region Reducers
export default function (state = defaultState, action) {
  const {version, type } = action;
  return produce(state, draft => {
    switch (type) {
      case actionTypes.APP_RELOAD:
        draft.count += 1;
        delete draft.bannerOpened;
        break;

      case actionTypes.APP_TOGGLE_BANNER:
        draft.bannerOpened = !draft.bannerOpened;
        break;

      case actionTypes.APP_ERRORED:
        draft.appErrored = true;
        break;

      case actionTypes.APP_CLEAR_ERROR:
        delete draft.appErrored;
        break;
      case actionTypes.UI_VERSION_UPDATE:
        if (!draft.initVersion) {
          draft.initVersion = version;
        }
        draft.version = version;
        break;

      default:
        break;
    }
  });
}
// #endregion Reducers

// #region Selectors
export function bannerOpened(state) {
  if (!state) return true;

  return !!state.bannerOpened;
}

export function reloadCount(state) {
  if (!state) return 0;

  return state.count;
}

export function appErrored(state) {
  if (!state) return null;

  return state.appErrored;
}

export function isUiVersionDifferent(state) {
  return state?.initVersion !== state?.version;
}
// #endregion

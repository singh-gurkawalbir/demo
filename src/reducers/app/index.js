import produce from 'immer';
import actionTypes from '../../actions/types';

const defaultState = {
  appErrored: false,
  bannerOpened: true,
  count: 1,
};

// #region Reducers
export default function (state = defaultState, action) {
  return produce(state, draft => {
    switch (action.type) {
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

      default:
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
// #endregion

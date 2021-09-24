import produce from 'immer';
import actionTypes from '../../actions/types';

export const defaultState = {
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
      case actionTypes.USER_ACCEPTED_ACCOUNT_TRANSFER:
        draft.userAcceptedAccountTransfer = true;
        break;
      default:
        break;
    }
  });
}
// #endregion Reducers

// #region Selectors
export const selectors = {};

selectors.bannerOpened = state => {
  if (!state) return true;

  return !!state.bannerOpened;
};

selectors.reloadCount = state => {
  if (!state) return 0;

  return state.count;
};

selectors.appErrored = state => {
  if (!state) return null;

  return state.appErrored;
};

selectors.initVersion = state => state?.initVersion;
selectors.version = state => state?.version;
selectors.isUiVersionDifferent = state => state?.initVersion !== state?.version;
selectors.isUserAcceptedAccountTransfer = state => !!state?.userAcceptedAccountTransfer;
// #endregion

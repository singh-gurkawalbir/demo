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
selectors.isUIVersionDifferent = state => state?.initVersion !== state?.version;
selectors.isUserAcceptedAccountTransfer = state => !!state?.userAcceptedAccountTransfer;
selectors.isUIVersionOld = state => {
  if (process?.env?.NODE_ENV) return false;
  const v1 = state.initVersion;
  const v2 = state.version;

  if (v1 === v2) return false;
  if (!v1 || !v2 || v1 === 'patch' || v2 === 'patch') return false;
  const init = v1.split('.');
  const cur = v2.split('.');

  const r = new RegExp('\\d+');

  for (let i = 0; i < Math.min(init.length, cur.length); i += 1) {
    const mi = init[i].match(r);
    const mc = cur[i].match(r);

    if (mi == null || mc == null) return true;
    const vi = +mi[0];
    const vc = +mc[0];

    if (vi < vc) return true;
  }

  return false;
};
// #endregion

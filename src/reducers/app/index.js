import produce from 'immer';
import actionTypes from '../../actions/types';
import { POLLING_STATUS } from '../../constants';

export const defaultState = {
  appErrored: false,
  count: 1,
};
// #region Reducers
export default function (state = defaultState, action) {
  const {version, type, isSwitchAccount = true } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.APP.RELOAD:
        draft.count += 1;
        break;
      case actionTypes.APP.POLLING.SLOW:
        draft.pollingStatus = POLLING_STATUS.SLOW;
        break;
      case actionTypes.APP.POLLING.RESUME:
        draft.pollingStatus = POLLING_STATUS.RESUME;
        break;
      case actionTypes.APP.POLLING.STOP:
        draft.pollingStatus = POLLING_STATUS.STOP;
        break;

      case actionTypes.APP.ERRORED:
        draft.appErrored = true;
        break;

      case actionTypes.APP.CLEAR_ERROR:
        delete draft.appErrored;
        break;
      case actionTypes.APP.UI_VERSION_UPDATE:
        if (!draft.initVersion) {
          draft.initVersion = version;
        }
        draft.version = version;
        break;
      case actionTypes.APP.USER_ACCEPTED_ACCOUNT_TRANSFER:
        draft.userAcceptedAccountTransfer = true;
        break;
      case actionTypes.USER.ACCOUNT.SWITCH:
      case actionTypes.USER.ACCOUNT.LEAVE_REQUEST:
      case actionTypes.USER.DELETE:
      case actionTypes.USER.DISABLE:
        if (isSwitchAccount) {
          draft.switchAccount = 'inProgress';
        }

        break;
      case actionTypes.USER.ACCOUNT.SWITCH_COMPLETE:
        draft.switchAccount = 'completed';

        break;
      default:
        break;
    }
  });
}
// #endregion Reducers

// #region Selectors
export const selectors = {};

selectors.reloadCount = state => {
  if (!state) return 0;

  return state.count;
};

selectors.appErrored = state => {
  if (!state) return null;

  return state.appErrored;
};

selectors.pollingStatus = state => state?.pollingStatus;
selectors.initVersion = state => state?.initVersion;
selectors.version = state => state?.version;
selectors.isUiVersionDifferent = state => state?.initVersion !== state?.version;
selectors.isUserAcceptedAccountTransfer = state => !!state?.userAcceptedAccountTransfer;
selectors.isAccountSwitchInProgress = state => state?.switchAccount === 'inProgress';
// #endregion

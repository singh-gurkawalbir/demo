import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, accountSettings } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ACCOUNT_SETTINGS.RECEIVED:
        draft.dataRetentionPeriod = accountSettings.dataRetentionPeriod;
        if (!draft.status) {
          draft.status = {};
        }
        draft.status.accountSettings = 'received';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.areUserAccountSettingsLoaded = state => state?.status?.accountSettings === 'received';
selectors.dataRetentionPeriod = state => state?.dataRetentionPeriod;
// #endregion

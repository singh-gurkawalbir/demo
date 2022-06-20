import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, userSettings, accountSettings } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MFA.USER_SETTINGS.RECEIVED:
        draft.userSettings = userSettings;
        if (!draft.status) {
          draft.status = {};
        }
        draft.status.userSettings = 'received';
        break;

      case actionTypes.MFA.ACCOUNT_SETTINGS.RECEIVED:
        draft.accountSettings = accountSettings;
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

selectors.areUserSettingsLoaded = state => state?.status?.userSettings === 'received';
selectors.areAccountSettingsLoaded = state => state?.status?.accountSettings === 'received';

selectors.isMFAConfigured = state => [true, false].includes(state?.userSettings?.enabled);
selectors.isMFAEnabled = state => !!state?.userSettings?.enabled;
selectors.mfaUserSettings = state => state?.userSettings;
selectors.selectedPrimaryAccount = state => state?.userSettings?._allowResetByUserId;
selectors.mfaAccountSettings = state => state?.accountSettings;
selectors.isSecretCodeGenerated = state => state?.userSettings?.secret;
selectors.trustedDevices = state => {
  const userSettings = selectors.mfaUserSettings(state);

  return userSettings?.trustedDevices;
};
// #endregion

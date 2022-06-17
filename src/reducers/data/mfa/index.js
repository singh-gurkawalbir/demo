import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, userSettings, accountSettings } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MFA.USER_SETTINGS.RECEIVED:
        draft.userSettings = userSettings;
        break;

      case actionTypes.MFA.ACCOUNT_SETTINGS.RECEIVED:
        draft.accountSettings = accountSettings;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.isMFAEnabled = state => !!state?.userSettings?.enabled;
selectors.mfaUserSettings = state => state?.userSettings;
selectors.mfaAccountSettings = state => state?.accountSettings;
selectors.isSecretCodeGenerated = state => state?.userSettings?.secret;
selectors.trustedDevices = state => {
  const userSettings = selectors.mfaUserSettings(state);

  return userSettings?.trustedDevices;
};
// #endregion

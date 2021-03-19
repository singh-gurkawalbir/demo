import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import { selectors as fromOrg } from './org';
import users from './org/users';
import accounts, { selectors as fromAccounts, remainingDays } from './org/accounts';
import preferences, { selectors as fromPreferences } from './preferences';
import notifications, { selectors as fromNotifications } from './notifications';
import profile, { selectors as fromProfile } from './profile';
import debug, { selectors as fromDebug } from './debug';
import { ACCOUNT_IDS, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../../utils/constants';
import { genSelectors } from '../util';

export const DEFAULT_EDITOR_THEME = 'tomorrow';
const emptyList = [];
const emptyObj = {};

export default combineReducers({
  preferences,
  profile,
  notifications,
  org: combineReducers({
    // licenses,
    users,
    accounts,
  }),
  debug,
});

// #region PUBLIC USER SELECTORS
export const selectors = {};
const subSelectors = {
  org: fromOrg,
  preferences: fromPreferences,
  notifications: fromNotifications,
  profile: fromProfile,
  debug: fromDebug,
};

genSelectors(selectors, subSelectors);

// #region DEBUG SELECTORS
// #region PREFERENCES
selectors.userPreferences = createSelector(
  state => fromPreferences.userOwnPreferences(state && state.preferences),
  state => state && state.org,
  (preferences, org) => {
    const { defaultAShareId, accounts = {} } = preferences;

    if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
      return preferences;
    }

    if (!org || !org.accounts || !org.accounts.length) {
      return preferences;
    }

    // eslint-disable-next-line max-len
    /* When the user belongs to an org, we need to return the ssConnectionIds from org owner preferences. */
    const { accounts: orgAccounts = {} } = org;
    const currentAccount = orgAccounts.find(
      a => a._id === preferences.defaultAShareId
    );
    let mergedPreferences = {
      ...preferences,
      ...accounts[defaultAShareId],
    };

    if (currentAccount && currentAccount.ownerUser) {
      mergedPreferences = {
        ...mergedPreferences,
        ssConnectionIds: currentAccount.ownerUser.ssConnectionIds,
      };
    }

    return mergedPreferences;
  }
);

selectors.ownerUserId = createSelector(
  state => fromPreferences.userOwnPreferences(state && state.preferences),
  state => state && state.org,
  state => state && state.profile,
  (preferences, org, profile) => {
    const { defaultAShareId } = preferences;

    if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
      return profile?._id;
    }

    if (!org || !org.accounts || !org.accounts.length) {
      return profile?._id;
    }

    const { accounts: orgAccounts = {} } = org;
    const currentAccount = orgAccounts.find(
      a => a._id === defaultAShareId
    );

    if (currentAccount && currentAccount.ownerUser) {
      return currentAccount.ownerUser._id;
    }

    return profile._id;
  }
);

selectors.isOwnerUserInErrMgtTwoDotZero = createSelector(
  state => fromPreferences.userOwnPreferences(state && state.preferences),
  state => state && state.org,
  state => state && state.profile,
  (preferences, org, profile) => {
    const { defaultAShareId } = preferences;

    if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
      return !!profile?.useErrMgtTwoDotZero;
    }

    if (!org || !org.accounts || !org.accounts.length) {
      return !!profile?.useErrMgtTwoDotZero;
    }

    /* When the user belongs to an org, we need to return the isErrMgtTwoDotZero from org owner profile. */
    const { accounts: orgAccounts = [] } = org;
    const currentAccount = orgAccounts.find(
      a => a._id === defaultAShareId
    );

    if (currentAccount && currentAccount.ownerUser) {
      return !!currentAccount.ownerUser.useErrMgtTwoDotZero;
    }

    return false;
  }
);

selectors.appTheme = createSelector(
  selectors.userPreferences,
  preferences => {
    const currentAccount = preferences.defaultAShareId;

    if (currentAccount) {
      const accountPrefs =
        preferences.accounts && preferences.accounts[currentAccount];

      if (accountPrefs) {
        return accountPrefs.themeName;
      }
    }

    return preferences.themeName;
  }
);

selectors.drawerOpened = (state = null) => {
  const preferences = selectors.userPreferences(state);

  return preferences && !!preferences.drawerOpened;
};

selectors.expandSelected = (state = null) => {
  const preferences = selectors.userPreferences(state);

  return preferences && preferences.expand;
};

selectors.editorTheme = createSelector(
  state => state,
  selectors.appTheme,
  (state, appTheme) => {
    if (!state) return DEFAULT_EDITOR_THEME;

    // props = ui theme, values = editor theme.
    const themeMap = {
      light: 'tomorrow',
      dark: 'monokai',
    };

    return themeMap[appTheme] || DEFAULT_EDITOR_THEME;
  }
);
// #endregion PREFERENCES

// #region ACCESS LEVEL
selectors.userAccessLevel = createSelector(
  selectors.userPreferences,
  state => state && state.org && state.org.accounts,
  (preferences, accounts) => {
    let accessLevel;

    if (preferences) {
      const { defaultAShareId } = preferences;

      accessLevel = fromAccounts.accessLevel(accounts, defaultAShareId);
    }

    return accessLevel;
  }
);
// #endregion ACCESS LEVEL
// #region ACCOUNT
selectors.accountSummary = createSelector(
  selectors.userAccessLevel,
  state =>
    fromAccounts.accountSummary(state && state.org && state.org.accounts),
  state => fromPreferences.userOwnPreferences(state && state.preferences),
  (userAccessLevel, summary, prefs) => {
    if (!userAccessLevel) {
      return emptyList;
    }

    if (!summary || summary.length === 0) {
      return summary;
    }

    const id = prefs.defaultAShareId || summary[0].id;
    const filteredAccount = summary.find(a => a.id === id);

    if (filteredAccount) {
      filteredAccount.selected = true;
    }

    return summary;
  }
);
// #endregion ACCOUNT

selectors.hasManageIntegrationAccess = (state, integrationId) => {
  const userPermissions = selectors.userPermissions(state);
  const isAccountOwner = [USER_ACCESS_LEVELS.ACCOUNT_OWNER, USER_ACCESS_LEVELS.ACCOUNT_ADMIN].includes(userPermissions.accessLevel);

  if (isAccountOwner) {
    return true;
  }
  const manageIntegrationAccessLevels = [
    INTEGRATION_ACCESS_LEVELS.OWNER,
    INTEGRATION_ACCESS_LEVELS.MANAGE,
  ];

  const integrationPermissions = userPermissions.integrations;

  if (manageIntegrationAccessLevels.includes(integrationPermissions.all?.accessLevel)) {
    return true;
  }

  return manageIntegrationAccessLevels.includes(integrationPermissions[integrationId]?.accessLevel);
};

selectors.accountOwner = createSelector(
  selectors.userAccessLevel,
  selectors.userPreferences,
  state => state && state.profile,
  state => state && state.org && state.org.accounts,
  (userAccessLevel, preferences, profile, accounts) => {
    if (userAccessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
      const { name, email, timezone } = profile || {};

      return { name, email, timezone };
    }

    if (preferences) {
      const { defaultAShareId } = preferences;

      if (defaultAShareId && defaultAShareId !== ACCOUNT_IDS.OWN) {
        const ownerUser = fromAccounts.owner(accounts, defaultAShareId);

        return ownerUser || emptyObj;
      }
    }
  }
);

selectors.userTimezone = createSelector(
  state => state && state.profile,
  selectors.accountOwner,
  (profile, accountOwner) => profile?.timezone || accountOwner.timezone
);

selectors.canUserPublish = createSelector(
  state => state && state.profile,
  selectors.userPreferences,
  selectors.accountOwner,
  selectors.userAccessLevel,
  (profile, preferences = emptyObj, accountOwner, accessLevel) => {
    const { defaultAShareId } = preferences;

    if (defaultAShareId === ACCOUNT_IDS.OWN) {
      return !!profile?.allowedToPublish;
    } if (accessLevel === USER_ACCESS_LEVELS.ACCOUNT_ADMIN) {
      return !!accountOwner?.allowedToPublish;
    }

    return false;
  }
);

selectors.licenses = createSelector(
  selectors.userPreferences,
  state => state && state.org && state.org.accounts,
  (preferences, accounts) => {
    const { defaultAShareId } = preferences;

    return fromAccounts.licenses(accounts, defaultAShareId);
  }
);

selectors.integrationLicenseExpirationInDays = createSelector(
  selectors.licenses,
  licenses => licenses?.map(license => ({
    integrationId: license._integrationId,
    remainingDays: remainingDays(license?.expires),
  })));

selectors.userPermissions = createSelector(
  state => selectors.userPreferences(state)?.defaultAShareId,
  selectors.canUserPublish,
  state => state?.org?.accounts,
  (defaultAShareId, allowedToPublish, accounts) => fromAccounts.permissions(accounts, defaultAShareId, { allowedToPublish })
);

// #endregion PUBLIC USER SELECTORS

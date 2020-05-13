import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import users, * as fromUsers from './org/users';
import accounts, * as fromAccounts from './org/accounts';
import preferences, * as fromPreferences from './preferences';
import notifications, * as fromNotifications from './notifications';
import profile, * as fromProfile from './profile';
import debug, * as fromDebug from './debug';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from '../../utils/constants';

export const DEFAULT_EDITOR_THEME = 'tomorrow';

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
// #region DEBUG SELECTORS
export function debugOn(state) {
  return fromDebug.debugOn(state && state.debug);
}
// #endregion DEBUG SELECTORS

// #region LICENSE
export function integratorLicense(state, accountId) {
  return fromAccounts.integratorLicense(
    state && state.org && state.org.accounts,
    accountId
  );
}

export function diyLicense(state, accountId) {
  return fromAccounts.diyLicense(
    state && state.org && state.org.accounts,
    accountId
  );
}

// #endregion LICENSE

// #region NOTIFICATIONS
export function userNotifications(state) {
  return fromNotifications.userNotifications(state && state.notifications);
}
// #endregion NOTIFICATIONS

// #region PREFERENCES
export function userPreferences(state) {
  const preferences = fromPreferences.userPreferences(
    state && state.preferences
  );
  const { defaultAShareId, accounts = {} } = preferences;

  if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
    return preferences;
  }

  if (
    !state ||
    !state.org ||
    !state.org.accounts ||
    !state.org.accounts.length
  ) {
    return preferences;
  }

  // eslint-disable-next-line max-len
  /* When the user belongs to an org, we need to return the ssConnectionIds from org owner preferences. */
  const { accounts: orgAccounts = {} } = state.org;
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

export function userOwnPreferences(state) {
  return fromPreferences.userPreferences(state && state.preferences);
}

export function appTheme(state) {
  const preferences = fromPreferences.userPreferences(
    state && state.preferences
  );
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

export function editorTheme(state) {
  if (!state) return DEFAULT_EDITOR_THEME;

  // props = ui theme, values = editor theme.
  const themeMap = {
    light: 'tomorrow',
    dark: 'monokai',
  };

  return themeMap[appTheme(state)] || DEFAULT_EDITOR_THEME;
}

export function accountShareHeader(state, path) {
  return fromPreferences.accountShareHeader(state && state.preferences, path);
}
// #endregion PREFERENCES

// #region PROFILE
export function avatarUrl(state) {
  return fromProfile.avatarUrl(state && state.profile);
}
// #endregion PROFILE

// #region ACCESS LEVEL
export function accessLevel(state) {
  let accessLevel;

  if (state && state.preferences) {
    const { defaultAShareId } = userPreferences(state);

    accessLevel = fromAccounts.accessLevel(state.org.accounts, defaultAShareId);
  }

  return accessLevel;
}

// #endregion ACCESS LEVEL
// #region ACCOUNT
export const accountSummary = createSelector(
  state => state,
  state => {
    const userAccessLevel = accessLevel(state);

    if (!userAccessLevel) {
      return [];
    }

    const summary = fromAccounts.accountSummary(
      state && state.org && state.org.accounts
    );

    if (!summary || summary.length === 0) {
      return summary;
    }

    const prefs = fromPreferences.userPreferences(state && state.preferences);
    const id = prefs.defaultAShareId || summary[0].id;
    const filteredAccount = summary.find(a => a.id === id);

    if (filteredAccount) {
      filteredAccount.selected = true;
    }

    return summary;
  }
);
// #endregion ACCOUNT

export function permissions(state) {
  const { defaultAShareId } = userPreferences(state);
  const allowedToPublish =
    state && state.profile && state.profile.allowedToPublish;
  const permissions = fromAccounts.permissions(
    state && state.org && state.org.accounts,
    defaultAShareId,
    { allowedToPublish }
  );

  return permissions;
}

export function usersList(state) {
  return fromUsers.list(state && state.org && state.org.users);
}

export function integrationUsers(state, integrationId) {
  return fromUsers.integrationUsers(
    state && state.org && state.org.users,
    integrationId
  );
}

export function accountOwner(state) {
  const userAccessLevel = accessLevel(state);

  if (userAccessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
    const { name, email } = state && state.profile;

    return { name, email };
  }

  if (state && state.preferences) {
    const { defaultAShareId } = userPreferences(state);

    if (defaultAShareId && defaultAShareId !== ACCOUNT_IDS.OWN) {
      const ownerUser = fromAccounts.owner(state.org.accounts, defaultAShareId);

      return ownerUser || {};
    }
  }
}

export function licenses(state) {
  const { defaultAShareId } = userPreferences(state);

  return fromAccounts.licenses(
    state && state.org && state.org.accounts,
    defaultAShareId
  );
}

// #endregion PUBLIC USER SELECTORS

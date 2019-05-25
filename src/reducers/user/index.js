import { combineReducers } from 'redux';
import users, * as fromUsers from './org/users';
import accounts, * as fromAccounts from './org/accounts';
import preferences, * as fromPreferences from './preferences';
import profile, * as fromProfile from './profile';
import { ACCOUNT_IDS, USER_ACCESS_LEVELS } from '../../utils/constants';

export default combineReducers({
  preferences,
  profile,
  org: combineReducers({
    // licenses,
    users,
    accounts,
  }),
});

// #region PUBLIC USER SELECTORS
// #region LICENSE
export function integratorLicense(state, accountId) {
  return fromAccounts.integratorLicense(
    state && state.org && state.org.accounts,
    accountId
  );
}

// #endregion LICENSE

// #region NOTIFICATIONS
export function notifications(state) {
  const summary = fromAccounts.notifications(
    state && state.org && state.org.accounts
  );

  return summary;
}
// #endregion NOTIFICATIONS

// #region PREFERENCES
export function userPreferences(state) {
  return fromPreferences.userPreferences(state && state.preferences);
}

export function appTheme(state) {
  return fromPreferences.appTheme(state && state.preferences);
}

export function editorTheme(state) {
  return fromPreferences.editorTheme(state && state.preferences);
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
export function accountSummary(state) {
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
  let environment = prefs.environment || summary[0].environment;
  const filteredAccount = summary.find(
    a => a.id === id && a.environment === environment
  );

  if (filteredAccount) {
    filteredAccount.selected = true;
  } else {
    [{ environment }] = summary;

    if (summary.find(a => a.id === id && a.environment === environment)) {
      summary.find(
        a => a.id === id && a.environment === environment
      ).selected = true;
    }
  }

  return summary;
}
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

// #endregion PUBLIC USER SELECTORS

import { combineReducers } from 'redux';
import users from './org/users';
import accounts, * as fromAccounts from './org/accounts';
import preferences, * as fromPreferences from './preferences';
import profile, * as fromProfile from './profile';

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
  let accessLevel = null;

  if (state && state.preferences) {
    const { defaultAShareId } = userPreferences(state);

    if (!defaultAShareId || defaultAShareId === 'own') {
      accessLevel = 'owner';
    } else {
      const { accounts } = state.org;
      const account = accounts.find(a => a._id === defaultAShareId);

      ({ accessLevel } = account);
    }
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
  const prefs = fromPreferences.userPreferences(state && state.preferences);

  if (!summary || summary.length === 0) {
    return summary;
  }

  const id = prefs.defaultAShareId || summary[0].id;
  let environment = prefs.environment || summary[0].environment;
  const filteredAccounts = summary.find(
    a => a.id === id && a.environment === environment
  );

  if (filteredAccounts.length) {
    filteredAccounts[0].selected = true;
  } else {
    [{ environment }] = summary;
    summary.find(
      a => a.id === id && a.environment === environment
    ).selected = true;
  }

  return summary;
}
// #endregion ACCOUNT

// #endregion PUBLIC USER SELECTORS

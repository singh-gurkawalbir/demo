import { combineReducers } from 'redux';
import accounts, * as fromAccounts from './accounts';
import preferences, * as fromPreferences from './preferences';
import profile, * as fromProfile from './profile';

export default combineReducers({
  accounts,
  preferences,
  profile,
});

// #region PUBLIC USER SELECTORS
// #region ACCOUNT
export function accountSummary(state) {
  const summary = fromAccounts.accountSummary(state && state.accounts);
  const prefs = fromPreferences.userPreferences(state && state.preferences);

  if (!summary || summary.length === 0) return summary;

  if (!prefs) {
    summary[0].selected = true;
  } else {
    const id = prefs.defaultAShareId || summary[0].id;
    const environment = prefs.environment || summary[0].environment;

    summary.find(
      a => a.id === id && a.environment === environment
    ).selected = true;
  }

  return summary;
}
// #endregion ACCOUNT

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
// #endregion PUBLIC USER SELECTORS

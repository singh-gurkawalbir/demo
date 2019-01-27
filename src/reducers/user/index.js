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
  return fromAccounts.accountSummary(state && state.accounts);
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

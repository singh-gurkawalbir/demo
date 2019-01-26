import { combineReducers } from 'redux';
import profile, * as fromProfile from './profile';
import preferences, * as fromPreferences from './preferences';

export default combineReducers({
  profile,
  preferences,
});

// #region PUBLIC USER SELECTORS
export function userPreferences(state) {
  if (!state || !state.preferences) return {};

  return fromPreferences.userPreferences(state.preferences);
}

export function avatarUrl(state) {
  if (!state || !state.profile) return undefined;

  return fromProfile.avatarUrl(state.profile);
}

export function appTheme(state) {
  return fromPreferences.appTheme(state.preferences);
}

export function editorTheme(state) {
  return fromPreferences.editorTheme(state.preferences);
}
// #endregion PUBLIC USER SELECTORS

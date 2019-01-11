import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

const profile = (state = null, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED &&
    action.resourceType === 'profile'
  ) {
    const newState = { ...state, ...action.resource };

    return newState;
  }

  if (action.type === actionTypes.DELETE_PROFILE) {
    // Except for email delete everything

    if (!state || !state.email) return {};

    return { email: state.email };
  }

  return state;
};

export const DEFAULT_THEME = 'dark';
export const DEFAULT_EDITOR_THEME = 'tomorrow';

const themeName = (state = DEFAULT_THEME, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
    action.resourceType === 'preferences'
  ) {
    return action.collection.themeName || DEFAULT_THEME;
  }

  if (action.type === actionTypes.SET_THEME) {
    return action.name || DEFAULT_THEME;
  }

  return state;
};

const preferences = (state = {}, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
    action.resourceType === 'preferences'
  ) {
    const newState = { ...state, ...action.collection };

    return newState;
  }

  return state;
};

export default combineReducers({
  profile,
  themeName,
  preferences,
});

// #region PUBLIC SESSION SELECTORS
export function avatarUrl(state) {
  if (!state || !state.profile) return undefined;

  return `https://secure.gravatar.com/avatar/${
    state.profile.emailHash
  }?d=mm&s=55`;
}

export function userTheme(state) {
  if (!state || !state.themeName) {
    return DEFAULT_THEME;
  }

  return state.themeName;
}

export function editorTheme(state) {
  const defaultEditorTheme = 'tomorrow';

  if (!state) return defaultEditorTheme;

  // props = ui theme, values = editor theme.
  const themeMap = {
    light: 'tomorrow',
    dark: 'monokai',
  };

  return themeMap[userTheme(state)] || defaultEditorTheme;
}
// #endregion PUBLIC SESSION SELECTORS

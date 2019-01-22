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

// const themeName = (state = DEFAULT_THEME, action) => {
//   if (
//     action.type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
//     action.resourceType === 'preferences'
//   ) {
//     return action.collection.themeName || DEFAULT_THEME;
//   }

//   if (action.type === actionTypes.SET_THEME) {
//     return action.name || DEFAULT_THEME;
//   }

//   return state;
// };
// needed both these actions to support an update RECEIVED_COLLECTION
// is from the LoadResources component and the update Preferences allows
// us to update the redux store directly
const preferences = (state = {}, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
    action.resourceType === 'preferences'
  ) {
    const { defaultAShareId, accounts } = action.collection;

    if (!defaultAShareId || defaultAShareId === 'own') {
      return { ...state, ...action.collection };
    }

    const copyActionPayload = Object.assign({}, action.collection);

    delete copyActionPayload.accounts;

    // merging account specific preferences and global specific preferences
    return { ...state, ...accounts[defaultAShareId], ...copyActionPayload };
  }

  if (action.type === actionTypes.UPDATE_PREFERENCES_STORE) {
    const { preferences } = action;

    return { ...state, ...preferences };
  }

  return state;
};

export default combineReducers({
  profile,
  preferences,
});

// #region PUBLIC SESSION SELECTORS
export function avatarUrl(state) {
  if (!state || !state.profile) return undefined;

  return `https://secure.gravatar.com/avatar/${
    state.profile.emailHash
  }?d=mm&s=55`;
}

export function userTheme(preferences) {
  if (preferences && preferences.themeName) {
    return preferences.themeName;
  }

  return DEFAULT_THEME;
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

import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

const GLOBAL_PREFERENCES = [
  'hideGettingStarted',
  'defaultAShareId',
  'environment',
  'dateFormat',
  'timeFormat',
  'scheduleShiftForFlowsCreatedAfter',
  'lastLoginAt',
];
const LOCAL_PREFERENCES = ['themeName'];
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

const preferences = (state = {}, action) => {
  const { type, resourceType, preferences } = action;
  let newState = Object.assign({}, state);

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION:
      // we can't clear if there is no staged data
      if (resourceType === 'preferences') return action.collection;

      return newState;
    case actionTypes.UPDATE_PREFERENCES_STORE: {
      const { defaultAShareId, accounts } = newState;

      if (!defaultAShareId || defaultAShareId === 'own') {
        newState = { ...newState, ...preferences };
      } else {
        Object.keys(preferences).forEach(key => {
          const preference = { [key]: preferences[key] };

          if (GLOBAL_PREFERENCES.includes(key)) {
            newState = { ...newState, ...preference };
          } else {
            accounts[defaultAShareId] = {
              ...accounts[defaultAShareId],
              ...preference,
            };
          }
        });
      }

      return newState;
    }

    default:
      return state;
  }
};

export default combineReducers({
  profile,
  preferences,
});

function pickOutRelevantPreferenceData(preferences) {
  const allUsersPreferenceProps = [...GLOBAL_PREFERENCES, ...LOCAL_PREFERENCES];
  const copyPreferences = Object.assign({}, preferences);

  Object.keys(copyPreferences)
    .filter(key => !allUsersPreferenceProps.includes(key))
    .forEach(key => delete copyPreferences[key]);

  return copyPreferences;
}
// #region PUBLIC SESSION SELECTORS

export function userPreferences(state) {
  if (!state || !state.preferences) return {};
  const { preferences } = state;
  const { defaultAShareId, accounts } = preferences;
  let mergedPreferences;

  if (!defaultAShareId || defaultAShareId === 'own') {
    mergedPreferences = { ...preferences };
  } else {
    mergedPreferences = { ...preferences, ...accounts[defaultAShareId] };
  }

  return pickOutRelevantPreferenceData(mergedPreferences);
}

export function avatarUrl(state) {
  if (!state || !state.profile) return undefined;

  return `https://secure.gravatar.com/avatar/${
    state.profile.emailHash
  }?d=mm&s=55`;
}

export function userTheme(state) {
  const { themeName } = userPreferences(state);

  if (themeName) {
    return themeName;
  }

  return DEFAULT_THEME;
}

export function editorTheme(state) {
  const defaultEditorTheme = 'tomorrow';

  if (!state || !state.preferences) return defaultEditorTheme;

  // props = ui theme, values = editor theme.
  const themeMap = {
    light: 'tomorrow',
    dark: 'monokai',
  };

  return themeMap[userTheme(state)] || defaultEditorTheme;
}
// #endregion PUBLIC SESSION SELECTORS

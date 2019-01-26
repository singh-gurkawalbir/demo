import actionTypes from '../../../actions/types';

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

export const DEFAULT_THEME = 'dark';
export const DEFAULT_EDITOR_THEME = 'tomorrow';

export default (state = {}, action) => {
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

function pickOutRelevantPreferenceData(preferences) {
  const allUsersPreferenceProps = [...GLOBAL_PREFERENCES, ...LOCAL_PREFERENCES];
  const copyPreferences = Object.assign({}, preferences);

  Object.keys(copyPreferences)
    .filter(key => !allUsersPreferenceProps.includes(key))
    .forEach(key => delete copyPreferences[key]);

  return copyPreferences;
}

// #region PUBLIC SELECTORS
export function userPreferences(state) {
  if (!state) return {};

  const { defaultAShareId, accounts } = state;
  let mergedPreferences;

  if (!defaultAShareId || defaultAShareId === 'own') {
    mergedPreferences = { ...state };
  } else {
    mergedPreferences = { ...state, ...accounts[defaultAShareId] };
  }

  return pickOutRelevantPreferenceData(mergedPreferences);
}

export function userTheme(state) {
  const { themeName } = userPreferences(state);

  if (themeName) {
    return themeName;
  }

  return DEFAULT_THEME;
}

export function editorTheme(state) {
  if (!state) return DEFAULT_EDITOR_THEME;

  // props = ui theme, values = editor theme.
  const themeMap = {
    light: 'tomorrow',
    dark: 'monokai',
  };

  return themeMap[userTheme(state)] || DEFAULT_EDITOR_THEME;
}
// #endregion PUBLIC SELECTORS

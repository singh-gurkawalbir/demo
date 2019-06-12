import actionTypes from '../../../actions/types';
import { ACCOUNT_IDS } from '../../../utils/constants';

export const GLOBAL_PREFERENCES = [
  'hideGettingStarted',
  'defaultAShareId',
  'environment',
  'dateFormat',
  'timeFormat',
  'scheduleShiftForFlowsCreatedAfter',
  'lastLoginAt',
];

export const DEFAULT_THEME = 'dark';
export const DEFAULT_EDITOR_THEME = 'tomorrow';

export default (state = { environment: 'production' }, action) => {
  const { type, resourceType, resource, preferences } = action;
  let newState = { ...state };

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED:
      if (resourceType === 'preferences')
        return {
          dateFormat: 'MM/DD/YYYY',
          timeFormat: 'h:mm:ss a',
          ...resource,
        };

      return newState;
    case actionTypes.UPDATE_PREFERENCES: {
      const { defaultAShareId, accounts } = newState;

      if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
        newState = { ...newState, ...preferences };
      } else {
        Object.keys(preferences).forEach(key => {
          const preference = preferences[key];

          if (GLOBAL_PREFERENCES.includes(key)) {
            newState[key] = preference;
          } else {
            accounts[defaultAShareId][key] = preference;
          }
        });
      }

      return newState;
    }

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function userPreferences(state) {
  if (!state) return {};

  const { defaultAShareId, accounts = {} } = state;
  let mergedPreferences;

  if (accounts && defaultAShareId && defaultAShareId !== ACCOUNT_IDS.OWN) {
    mergedPreferences = { ...state, ...accounts[defaultAShareId] };
  } else {
    mergedPreferences = { ...state };
  }

  delete mergedPreferences.accounts;

  return mergedPreferences;
}

export function appTheme(state) {
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

  return themeMap[appTheme(state)] || DEFAULT_EDITOR_THEME;
}
// #endregion PUBLIC SELECTORS

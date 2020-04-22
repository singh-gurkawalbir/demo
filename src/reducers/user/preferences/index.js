import actionTypes from '../../../actions/types';
import {
  ACCOUNT_IDS,
  PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER,
} from '../../../utils/constants';

export const GLOBAL_PREFERENCES = [
  'hideGettingStarted',
  'defaultAShareId',
  'environment',
  'dateFormat',
  'timeFormat',
  'scheduleShiftForFlowsCreatedAfter',
  'lastLoginAt',
  'debug',
];

export default (state = { environment: 'production' }, action) => {
  const { type, resourceType, resource, preferences } = action;
  let newState = { ...state };

  switch (type) {
    case actionTypes.TOGGLE_DEBUG:
      newState.debug = !newState.debug;

      return newState;
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
            if (!accounts[defaultAShareId]) {
              accounts[defaultAShareId] = {};
            }

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

  return state;
}

export function accountShareHeader(preferences, path) {
  const headers = {};

  if (
    !preferences ||
    !preferences.defaultAShareId ||
    preferences.defaultAShareId === ACCOUNT_IDS.OWN
  ) {
    return headers;
  }

  if (
    PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER.includes(
      path.charAt(0) === '/' ? path.replace('/', '') : path
    )
  ) {
    return headers;
  }

  headers['integrator-ashareid'] = preferences.defaultAShareId;

  return headers;
}
// #endregion PUBLIC SELECTORS

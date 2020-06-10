import produce from 'immer';
import actionTypes from '../../../actions/types';
import {
  ACCOUNT_IDS,
  PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER,
} from '../../../utils/constants';

const emptyObj = {};

export const GLOBAL_PREFERENCES = [
  'hideGettingStarted',
  'defaultAShareId',
  'environment',
  'dateFormat',
  'timeFormat',
  'scheduleShiftForFlowsCreatedAfter',
  'lastLoginAt',
];

export default (state = { environment: 'production' }, action) => {
  const { type, resourceType, resource, preferences } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED:
        if (resourceType === 'preferences') {
          draft.dateFormat = 'MM/DD/YYYY';
          draft.timeFormat = 'h:mm:ss a';
          Object.keys(resource).forEach(key => {
            draft[key] = resource[key];
          });
        }

        break;
      case actionTypes.UPDATE_PREFERENCES:
        {
          const { defaultAShareId } = draft;

          if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
            Object.keys(preferences).forEach(key => {
              draft[key] = preferences[key];
            });
          } else {
            Object.keys(preferences).forEach(key => {
              const preference = preferences[key];

              if (GLOBAL_PREFERENCES.includes(key)) {
                draft[key] = preference;
              } else {
                if (!draft.accounts) {
                  draft.accounts = {};
                }

                if (!draft.accounts[defaultAShareId]) {
                  draft.accounts[defaultAShareId] = {};
                }

                draft.accounts[defaultAShareId][key] = preference;
              }
            });
          }
        }

        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export function userPreferences(state) {
  if (!state) return emptyObj;

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

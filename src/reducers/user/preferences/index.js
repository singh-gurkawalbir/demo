import produce from 'immer';
import actionTypes from '../../../actions/types';
import {
  ACCOUNT_IDS,
  PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER,
} from '../../../constants';

const emptyObj = {};

const GLOBAL_PREFERENCES = [
  'hideGettingStarted',
  'defaultAShareId',
  'environment',
  'dateFormat',
  'timeFormat',
  'scheduleShiftForFlowsCreatedAfter',
  'lastLoginAt',
  'darkTheme',  // TODO @Lalit: no need for darkMode prop once changes are in Production
  'colorTheme',
  'showIconView',
];

const getAccountPreferences = draft => {
  const { defaultAShareId } = draft;

  if (!defaultAShareId || defaultAShareId === ACCOUNT_IDS.OWN) {
    return draft;
  }

  return draft.accounts?.[defaultAShareId] || {};
};

const updatePreferences = (draft, preferences) => {
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
};

export default (state = { environment: 'production' }, action) => {
  const { type, resourceType, resource, preferences, integrationKey } = action;

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
      case actionTypes.USER.PREFERENCES.UPDATE:
        updatePreferences(draft, preferences);

        break;

      case actionTypes.USER.ACCOUNT.SWITCH:
        updatePreferences(draft, preferences);

        break;

      case actionTypes.USER.PREFERENCES.PIN_INTEGRATION:
        {
          let {dashboard} = getAccountPreferences(draft);

          if (!dashboard) {
            dashboard = {};
          }
          // push unique integration key to pinnedIntegrations
          if (!dashboard.pinnedIntegrations) {
            dashboard.pinnedIntegrations = [];
          }
          dashboard.pinnedIntegrations.push(integrationKey);
          updatePreferences(draft, { dashboard: {...dashboard, pinnedIntegrations: dashboard.pinnedIntegrations }});
        }

        break;

      case actionTypes.USER.PREFERENCES.UNPIN_INTEGRATION:
        {
          const {dashboard} = getAccountPreferences(draft);

          if (!dashboard || !dashboard.pinnedIntegrations) {
            break;
          }
          const index = dashboard.pinnedIntegrations.indexOf(integrationKey);

          if (index !== -1) {
            dashboard.pinnedIntegrations.splice(index, 1);
            updatePreferences(draft, { dashboard: {...dashboard, pinnedIntegrations: dashboard.pinnedIntegrations }});
          }
        }
        break;

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.userOwnPreferences = state => {
  if (!state) return emptyObj;

  return state;
};
selectors.defaultAShareId = state => state?.defaultAShareId;

selectors.accountShareHeader = (preferences, path) => {
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
};
// #endregion PUBLIC SELECTORS

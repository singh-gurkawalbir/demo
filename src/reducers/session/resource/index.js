import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const defaultObject = { numEnabledPaidFlows: 0, numEnabledSandboxFlows: 0 };

export default function reducer(state = {}, action) {
  const {
    type,
    tempId,
    id,
    resourceReferences,
    response,
    parentId,
    childId,
  } = action;
  let newState;

  switch (type) {
    case actionTypes.RESOURCE.CREATED:
      newState = { ...state, [tempId]: id };

      return newState;
    case actionTypes.RESOURCE.REFERENCES_RECEIVED:
      newState = { ...state, references: resourceReferences };

      return newState;
    case actionTypes.RESOURCE.REFERENCES_CLEAR:
      newState = { ...state };
      delete newState.references;

      return newState;
    case actionTypes.LICENSE_TRIAL_ISSUED:
      newState = {
        ...state,
        platformLicenseActionMessage:
          'Congratulations! Your 30 days of unlimited flows starts now - what will you integrate next?',
      };

      return newState;
    case actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED:
      newState = {
        ...state,
        platformLicenseActionMessage:
          'Your request has been received. We will contact you soon.',
      };

      return newState;
    case actionTypes.LICENSE_NUM_ENABLED_FLOWS_RECEIVED:
      return produce(state, draft => {
        draft.numEnabledFlows = response;
      });
    case actionTypes.LICENSE_ENTITLEMENT_USAGE_RECEIVED:
      return produce(state, draft => {
        draft.licenseEntitlementUsage = response;
      });
    case actionTypes.CLEAR_CHILD_INTEGRATION:
      return produce(state, draft => {
        draft.parentChildMap = undefined;
        delete draft.parentChildMap;
      });

    case actionTypes.UPDATE_CHILD_INTEGRATION:
      return produce(state, draft => {
        draft.parentChildMap = {};
        draft.parentChildMap[parentId] = childId;
      });

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.createdResourceId = (state, tempId) => {
  if (!state) {
    return;
  }

  return state[tempId];
};

selectors.resourceReferences = createSelector(
  state => state && state.references,
  references => {
    if (!references) {
      return null;
    }

    const referencesArray = [];

    Object.keys(references).forEach(type =>
      references[type].forEach(refObj => {
        referencesArray.push({
          resourceType: type,
          id: refObj.id,
          name: refObj.name,
        });
      })
    );

    return referencesArray;
  }
);

selectors.platformLicenseActionMessage = state => {
  if (!state) {
    return;
  }

  return state.platformLicenseActionMessage;
};

selectors.getChildIntegrationId = (state, parentId) => {
  console.log('should be session ', state);
  if (!state || !state.parentChildMap) {
    return;
  }

  return state.parentChildMap[parentId];
};

selectors.getNumEnabledFlows = createSelector(
  state => state && state.numEnabledFlows,
  numEnabledFlows => {
    if (!numEnabledFlows) {
      return defaultObject;
    }

    return {
      numEnabledPaidFlows: numEnabledFlows.numEnabledPaidFlows || 0,
      numEnabledSandboxFlows: numEnabledFlows.numEnabledSandboxFlows || 0,
      numEnabledFreeFlows: numEnabledFlows.numEnabledFreeFlows || 0,
    };
  }
);

selectors.getLicenseEntitlementUsage = createSelector(
  state => state && state.licenseEntitlementUsage,
  licenseEntitlementUsage => {
    if (!licenseEntitlementUsage) {
      return null;
    }

    return licenseEntitlementUsage;
  }
);
// #endregion

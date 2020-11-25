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

  switch (type) {
    case actionTypes.RESOURCE.CREATED:
      return produce(state, draft => {
        draft[tempId] = id;
      });

    case actionTypes.RESOURCE.REFERENCES_RECEIVED:
      return produce(state, draft => {
        draft.references = resourceReferences;
      });

    case actionTypes.RESOURCE.REFERENCES_CLEAR:
      return produce(state, draft => {
        delete draft.references;
      });

    case actionTypes.LICENSE_TRIAL_ISSUED:
      return produce(state, draft => {
        draft.platformLicenseActionMessage = 'Congratulations! Your 30 days of unlimited flows starts now - what will you integrate next?';
      });

    case actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED:
      return produce(state, draft => {
        draft.platformLicenseActionMessage = 'Your request has been received. We will contact you soon.';
      });

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

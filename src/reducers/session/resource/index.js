import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE} from '../../../utils/constants';

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
    code,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.CREATED:
        draft[tempId] = id;
        break;

      case actionTypes.RESOURCE.REFERENCES_RECEIVED:
        draft.references = resourceReferences;
        break;

      case actionTypes.RESOURCE.REFERENCES_CLEAR:
        delete draft.references;
        break;

      case actionTypes.LICENSE.UPGRADE_REQUEST_SUBMITTED:
        draft.platformLicenseActionMessage = LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE;
        break;
      case actionTypes.LICENSE.CLEAR_ACTION_MESSAGE:
        draft.platformLicenseActionMessage = undefined;
        delete draft.platformLicenseActionMessage;
        break;
      case actionTypes.LICENSE.ERROR_MESSAGE_RECEIVED:
        draft.code = code;
        break;
      case actionTypes.LICENSE.CLEAR_ERROR_MESSAGE:
        draft.code = undefined;
        delete draft.code;
        break;
      case actionTypes.LICENSE.NUM_ENABLED_FLOWS_RECEIVED:
        draft.numEnabledFlows = response;
        break;

      case actionTypes.LICENSE.ENTITLEMENT_USAGE_RECEIVED:
        draft.licenseEntitlementUsage = response;
        break;

      case actionTypes.RESOURCE.CLEAR_CHILD_INTEGRATION:
        draft.parentChildMap = undefined;
        delete draft.parentChildMap;
        break;

      case actionTypes.RESOURCE.UPDATE_CHILD_INTEGRATION:
        draft.parentChildMap = {};
        draft.parentChildMap[parentId] = childId;
        break;

      default:
        break;
    }
  });
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
selectors.licenseErrorMessage = state => {
  if (!state) {
    return;
  }

  return state.code;
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

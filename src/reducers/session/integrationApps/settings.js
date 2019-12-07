import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { type, integrationId, flowId, licenseId, response } = action;
  const key = `${integrationId}-${flowId}`;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE:
        draft[key] = { submitComplete: false };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA_UPDATE:
        if (response && response.addOns) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }

          draft[integrationId].addOns = {
            addOnMetaData: response.addOns && response.addOns.addOnMetaData,
            addOnLicenses: response.addOns && response.addOns.addOnLicenses,
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_UPDATE:
        if (response && response) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }

          draft[integrationId].mappingMetadata = response;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_COMPLETE:
        draft[key] = { submitComplete: true };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_FAILED:
        draft[key] = { submitFailed: true };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.CLEAR:
        delete draft[key];
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE_REQUESTED:
        draft[licenseId] = true;
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationAppSettingsFormState(state, integrationId, flowId) {
  if (!state) {
    return emptyObj;
  }

  const key = `${integrationId}-${flowId}`;

  return state[key] || emptyObj;
}

export function integrationAppAddOnState(state, integrationId) {
  if (!state) {
    return emptyObj;
  }

  return state[integrationId] || emptyObj;
}

export function checkUpgradeRequested(state, licenseId) {
  if (!state) {
    return false;
  }

  return !!state[licenseId];
}
// #endregion

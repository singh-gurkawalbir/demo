import produce from 'immer';
import { uniqBy } from 'lodash';
import actionTypes from '../../../actions/types';

const emptyObj = {};
const getStateKey = (integrationId, flowId, sectionId) =>
  `${integrationId}${flowId ? `-${flowId}` : ''}${
    sectionId ? `-${sectionId}` : ''
  }`;

export default (state = {}, action) => {
  const {
    type,
    integrationId,
    flowId,
    licenseId,
    response,
    redirectTo,
    metadata,
    error,
    sectionId,
  } = action;
  const key = getStateKey(integrationId, flowId, sectionId);
  let categoryMappingData;
  let generatesMetadata;

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
      case actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_REQUEST:
        if (!draft[integrationId]) {
          draft[integrationId] = { status: 'requested' };
        } else {
          draft[integrationId].status = 'requested';
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_UPDATE:
        if (response) {
          draft[integrationId].mappingMetadata = response;
          draft[integrationId].status = 'received';
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_ERROR:
        if (error) {
          draft[integrationId].status = 'error';
          draft[integrationId].error = error;
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CLEAR_REDIRECT:
        if (draft[integrationId]) delete draft[integrationId].redirectTo;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.REDIRECT:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }

        draft[integrationId].redirectTo = redirectTo;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE_REQUESTED:
        draft[licenseId] = true;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA:
        ({ response: categoryMappingData } = metadata);
        generatesMetadata = categoryMappingData.find(
          data => data.operation === 'generatesMetaData'
        );

        if (draft[`${flowId}-${integrationId}`]) {
          draft[`${flowId}-${integrationId}`].generatesMetadata = uniqBy(
            [
              ...draft[`${flowId}-${integrationId}`].generatesMetadata,
              generatesMetadata.data.generatesMetaData,
            ],
            'id'
          );
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPING_METADATA:
        ({ response: categoryMappingData } = metadata);
        generatesMetadata = categoryMappingData.find(
          data => data.operation === 'generatesMetaData'
        );
        draft[`${flowId}-${integrationId}`] = {
          uiAssistant: metadata.uiAssistant,
          response: categoryMappingData,
          generatesMetadata: [generatesMetadata.data.generatesMetaData],
        };
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationAppSettingsFormState(
  state,
  integrationId,
  flowId,
  sectionId
) {
  if (!state) {
    return emptyObj;
  }

  const key = getStateKey(integrationId, flowId, sectionId);

  return state[key] || emptyObj;
}

export function categoryMapping(state, integrationId, flowId) {
  if (!state) {
    return null;
  }

  return state[`${flowId}-${integrationId}`];
}

export function categoryMappingGeneratesMetadata(state, integrationId, flowId) {
  if (!state) {
    return null;
  }

  const { generatesMetadata = [] } =
    state[`${flowId}-${integrationId}`] || emptyObj;
  const generates = [];

  function collect(result = [], meta, isRoot = true) {
    if (meta) {
      result.push({ ...meta, isRoot });

      if (meta.children) {
        meta.children.forEach(child => collect(result, child, false));
      }
    }
  }

  generatesMetadata.forEach(meta => {
    collect(generates, meta);
  });

  return generates;
}

export function integrationAppAddOnState(state, integrationId) {
  if (!state) {
    return emptyObj;
  }

  return state[integrationId] || emptyObj;
}

export function shouldRedirect(state, integrationId) {
  if (!state || !state[integrationId]) {
    return null;
  }

  return state[integrationId].redirectTo;
}

export function checkUpgradeRequested(state, licenseId) {
  if (!state) {
    return false;
  }

  return !!state[licenseId];
}
// #endregion

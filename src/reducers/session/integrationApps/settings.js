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
    filters,
    sectionId,
  } = action;
  const key = getStateKey(integrationId, flowId, sectionId);
  let categoryMappingData;
  let generatesMetadata;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.INIT_COMPLETE:
        draft[key] = {
          initComplete: true,
          showFormValidationsBeforeTouch: false,
        };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM
        .SHOW_FORM_VALIDATION_ERRORS:
        if (!draft[key]) draft[key] = {};
        draft[key].showFormValidationsBeforeTouch = true;
        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE:
        if (!draft[key]) draft[key] = {};
        delete draft[key].submitFailed;

        draft[key].submitComplete = false;
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
        if (!draft[key]) draft[key] = {};
        delete draft[key].submitFailed;

        draft[key].submitComplete = true;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_FAILED:
        if (!draft[key]) draft[key] = {};
        delete draft[key].submitComplete;

        draft[key].submitFailed = true;
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPING_FILTERS:
        if (draft[`${flowId}-${integrationId}`]) {
          draft[`${flowId}-${integrationId}`].filters = {
            ...draft[`${flowId}-${integrationId}`].filters,
            ...filters,
          };
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
          filters: {
            attributes: {
              required: true,
              optional: true,
              conditional: true,
              preferred: true,
            },
            mappingFilter: 'mapped',
          },
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

export function categoryMappingFilters(state, integrationId, flowId) {
  if (!state || !state[`${flowId}-${integrationId}`]) {
    return null;
  }

  return state[`${flowId}-${integrationId}`].filters;
}

export function categoryMapping(state, integrationId, flowId) {
  if (!state) {
    return null;
  }

  return state[`${flowId}-${integrationId}`];
}

function flattenChildrenStructrue(result = [], meta, isRoot = true) {
  if (meta) {
    result.push({ ...meta, isRoot });

    if (meta.children) {
      meta.children.forEach(child =>
        flattenChildrenStructrue(result, child, false)
      );
    }
  }
}

export function categoryRelationshipData(state, integrationId, flowId) {
  if (!state) return null;
  const { response = [] } = state[`${flowId}-${integrationId}`] || emptyObj;
  const generatesMetaData = response.find(
    sec => sec.operation === 'generatesMetaData'
  );

  return (
    generatesMetaData &&
    generatesMetaData.data &&
    generatesMetaData.data.categoryRelationshipData
  );
}

export function categoryMappingData(state, integrationId, flowId) {
  if (!state) {
    return null;
  }

  const { response = [] } = state[`${flowId}-${integrationId}`] || emptyObj;
  const mappings = [];
  let mappingMetadata = [];
  const basicMappingData = response.find(
    sec => sec.operation === 'mappingData'
  );

  if (basicMappingData) {
    mappingMetadata =
      basicMappingData.data.mappingData.basicMappings.recordMappings;
  }

  mappingMetadata.forEach(meta => {
    flattenChildrenStructrue(mappings, meta);
  });

  return mappings;
}

export function categoryMappingGeneratesMetadata(state, integrationId, flowId) {
  if (!state) {
    return null;
  }

  const { generatesMetadata = [] } =
    state[`${flowId}-${integrationId}`] || emptyObj;
  const generates = [];

  generatesMetadata.forEach(meta => {
    flattenChildrenStructrue(generates, meta);
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

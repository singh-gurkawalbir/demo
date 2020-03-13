import produce from 'immer';
import { isEqual } from 'lodash';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../../actions/types';
import mappingUtil from '../../../utils/mapping';
import lookupUtil from '../../../utils/lookup';

const emptyObj = {};
const emptySet = [];

function flattenChildrenStructrue(
  result = [],
  meta,
  isRoot = true,
  options = {}
) {
  const { deleted = [], isParentDeleted = false } = options;

  if (meta) {
    result.push({
      ...meta,
      isRoot,
      deleted: deleted.includes(meta.id) || isParentDeleted,
    });

    if (meta.children) {
      meta.children.forEach(child =>
        flattenChildrenStructrue(result, child, false, {
          deleted,
          isParentDeleted: deleted.includes(meta.id),
        })
      );
    }
  }
}

const getStateKey = (integrationId, flowId, sectionId) =>
  `${integrationId}${flowId ? `-${flowId}` : ''}${
    sectionId ? `-${sectionId}` : ''
  }`;
const getCategoryKey = (integrationId, flowId) => `${flowId}-${integrationId}`;

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
    mappingData,
    filters,
    sectionId,
    data,
    id,
    generateFields,
    lookups,
    value,
    index,
    field,
    closeOnSave,
    options = {},
  } = action;
  const key = getStateKey(integrationId, flowId, sectionId);
  const cKey = getCategoryKey(integrationId, flowId);
  let mappingIndex;
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .SAVE_VARIATION_MAPPINGS:
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          draft[cKey].mappings[id].staged = draft[cKey].mappings[id].mappings;
          draft[cKey].mappings[id].stagedLookups =
            draft[cKey].mappings[id].lookups;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .CANCEL_VARIATION_MAPPINGS:
        if (
          draft[cKey] &&
          draft[cKey].mappings &&
          draft[cKey].mappings[id] &&
          draft[cKey].mappings[id].staged
        ) {
          draft[cKey].mappings[id].mappings = draft[cKey].mappings[id].staged;
          draft[cKey].mappings[id].lookups =
            draft[cKey].mappings[id].stagedLookups;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.DELETE: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          draft[cKey].mappings[id].initChangeIdentifier += 1;
          draft[cKey].mappings[id].mappings.splice(index, 1);

          if (draft[cKey].mappings[id].lastModifiedRow === index)
            draft[cKey].mappings[id].lastModifiedRow = -1;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[cKey].mappings[id].mappings,
            draft[cKey].mappings[id].lookups
          );

          draft[cKey].mappings[id].validationErrMsg = isSuccess
            ? undefined
            : validationErrMsg;
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT:
        {
          const {
            adaptorType,
            resourceData,
            application,
            isGroupedSampleData,
            isVariationMapping,
            categoryId,
            childCategoryId,
            variation,
            netsuiteRecordType,
            ...additionalOptions
          } = options;

          if (isVariationMapping) {
            mappingUtil.addVariationMap(
              draft[cKey],
              categoryId,
              childCategoryId,
              variation
            );
          }

          const formattedMappings = mappingUtil.getMappingFromResource(
            resourceData,
            false,
            isGroupedSampleData,
            netsuiteRecordType,
            {
              ...additionalOptions,
              isVariationMapping,
            }
          );
          const lookups = lookupUtil.getLookupFromResource(resourceData);
          const initChangeIdentifier =
            (draft[cKey] &&
              draft[cKey].mappings &&
              draft[cKey].mappings[id] &&
              draft[cKey].mappings[id].initChangeIdentifier) ||
            0;

          if (!draft[cKey]) {
            draft[cKey] = {};
          }

          if (!draft[cKey].mappings) {
            draft[cKey].mappings = {};
          }

          draft[cKey].mappings[id] = {
            mappings: formattedMappings.map(m => ({ ...m, rowIdentifier: 0 })),
            incompleteGenerates: [],
            lookups: lookups || [],
            initChangeIdentifier: initChangeIdentifier + 1,
            application,
            resource: resourceData,
            adaptorType,
            generateFields,
            visible: true,
            isGroupedSampleData,
            flowSampleData: undefined,
            netsuiteRecordType,
            // lastModifiedRow helps to set generate field when any field in salesforce mapping assistant is clicked
            lastModifiedRow: -1,
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .UPDATE_GENERATES: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          draft[cKey].mappings[id].generateFields = generateFields;
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .PATCH_FIELD: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          if (draft[cKey].mappings[id].mappings[index]) {
            const objCopy = {
              ...draft[cKey].mappings[id].mappings[index],
            };

            // TODO: @Aditya, @Sravan, move this logic to mapping Util
            objCopy.rowIdentifier += 1;

            let inputValue = value;

            if (field === 'extract') {
              if (inputValue.indexOf('"') === 0) {
                if (inputValue.charAt(inputValue.length - 1) !== '"')
                  inputValue += '"';
                delete objCopy.extract;
                objCopy.hardCodedValue = inputValue.substr(
                  1,
                  inputValue.length - 2
                );
                objCopy.hardCodedValueTmp = inputValue;
              } else {
                delete objCopy.hardCodedValue;
                delete objCopy.hardCodedValueTmp;
                objCopy.extract = inputValue;
              }
            } else {
              objCopy[field] = inputValue;

              if (inputValue.indexOf('[*].') === -1) {
                if ('isKey' in objCopy) {
                  delete objCopy.isKey;
                }

                if ('useFirstRow' in objCopy) {
                  delete objCopy.useFirstRow;
                }
              }
            }

            draft[cKey].mappings[id].mappings[index] = objCopy;
          } else if (value) {
            draft[cKey].mappings[id].mappings.push({
              [field]: value,
              rowIdentifier: 0,
            });
          }

          draft[cKey].mappings[id].lastModifiedRow = index;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[cKey].mappings[id].mappings,
            draft[cKey].mappings[id].lookups
          );

          draft[cKey].mappings[id].validationErrMsg = isSuccess
            ? undefined
            : validationErrMsg;
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .PATCH_INCOMPLETE_GENERATES: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          const incompleteGeneObj = draft[cKey].mappings[
            id
          ].incompleteGenerates.find(gen => gen.index === index);

          if (incompleteGeneObj) {
            incompleteGeneObj.value = value;
          } else {
            draft[cKey].mappings[id].incompleteGenerates.push({ index, value });
          }
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .PATCH_SETTINGS:
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          const {
            generate,
            extract,
            isNotEditable,
            index: mappingIndex,
            isRequired,
            rowIdentifier,
          } = draft[cKey].mappings[id].mappings[index];
          const valueTmp = {
            generate,
            extract,
            isNotEditable,
            index: mappingIndex,
            isRequired,
            rowIdentifier,
          };

          Object.assign(valueTmp, value);

          // removing lookups
          if (!value.lookupName) {
            delete valueTmp.lookupName;
          }

          // TODO: @Aditya, @Sravan, move this logic to mapping Util
          valueTmp.rowIdentifier += 1;

          if ('hardCodedValue' in valueTmp) {
            // wrap anything expect '' and null ,

            if (valueTmp.hardCodedValue && valueTmp.hardCodedValue.length)
              valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft[cKey].mappings[id].mappings[index] = {
            ...valueTmp,
          };
          draft[cKey].mappings[id].lastModifiedRow = index;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[cKey].mappings[id].mappings,
            draft[cKey].mappings[id].lookups
          );

          draft[cKey].mappings[id].validationErrMsg = isSuccess
            ? undefined
            : validationErrMsg;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .UPDATE_LOOKUP: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          draft[cKey].mappings[id].lookups = lookups;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[cKey].mappings[id].mappings,
            draft[cKey].mappings[id].lookups
          );

          draft[cKey].mappings[id].validationErrMsg = isSuccess
            ? undefined
            : validationErrMsg;
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .CLEAR_VARIATION_MAPPINGS:
        // Variation mappings have id structure as `${flowId}-${integrationId}-${sectionId}-${variation}`
        // ie,  all variations of one section will have same prefix `${flowId}-${integrationId}-${sectionId}`
        // so while deleting section we need to delete all variations of that section.
        // hence searching by prefix and not strict id check.
        if (draft[cKey] && draft[cKey].mappings) {
          Object.keys(draft[cKey].mappings).forEach(_id => {
            if (_id.startsWith(id)) {
              delete draft[cKey].mappings[id];
            }
          });
        }

        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .SET_VISIBILITY:
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          draft[cKey].mappings[id].visible = value;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE:
        if (draft[cKey]) {
          draft[cKey].saveStatus = 'requested';

          if (closeOnSave) {
            draft[cKey].closeOnSave = true;
          }
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .SAVE_COMPLETE:
        if (draft[cKey]) {
          draft[cKey].saveStatus = 'saved';

          if (draft[cKey].closeOnSave) {
            draft[cKey].saveStatus = 'close';
          }
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE_FAILED:
        if (draft[cKey]) {
          draft[cKey].saveStatus = 'failed';
        }

        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA:
        ({ response: categoryMappingData } = metadata);
        generatesMetadata = categoryMappingData.find(
          data => data.operation === 'generatesMetaData'
        );

        if (draft[cKey]) {
          if (!draft[cKey].generatesMetadata) {
            draft[cKey].generatesMetadata = [];
          }

          if (
            !draft[cKey].generatesMetadata.find(
              meta => meta.id === generatesMetadata.data.generatesMetaData.id
            )
          ) {
            draft[cKey].generatesMetadata.push(
              generatesMetadata.data.generatesMetaData
            );
          }
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPING_FILTERS:
        if (draft[cKey]) {
          draft[cKey].filters = {
            ...draft[cKey].filters,
            ...filters,
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.ADD_CATEGORY:
        if (draft[cKey])
          mappingUtil.addCategory(draft, integrationId, flowId, data);

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.DELETE_CATEGORY:
        if (draft[cKey]) {
          if (!draft[cKey].deleted) {
            draft[cKey].deleted = [];
          }

          draft[cKey].deleted.push(sectionId);
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.RESTORE_CATEGORY:
        if (
          draft[cKey] &&
          draft[cKey].deleted &&
          draft[cKey].deleted.indexOf(sectionId) > -1
        ) {
          draft[cKey].deleted.splice(draft[cKey].deleted.indexOf(sectionId), 1);
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPINGS_DATA:
        if (draft[cKey]) {
          draft[cKey].saveStatus = 'saved';

          if (draft[cKey].closeOnSave) {
            draft[cKey].saveStatus = 'close';
          }

          if (draft[cKey].response) {
            mappingIndex = draft[cKey].response.findIndex(
              op => op.operation === 'mappingData'
            );
            draft[cKey].response[mappingIndex] = mappingData;
            draft[cKey].initMappingData = mappingData;
          }
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPING_METADATA:
        ({ response: categoryMappingData } = metadata);
        generatesMetadata = categoryMappingData.find(
          data => data.operation === 'generatesMetaData'
        );
        draft[cKey] = {
          uiAssistant: metadata.uiAssistant,
          response: categoryMappingData,
          filters: {
            attributes: {
              required: true,
              optional: false,
              conditional: false,
              preferred: false,
            },
            mappingFilter: 'all',
          },
          generatesMetadata: [generatesMetadata.data.generatesMetaData],
        };

        if (draft[cKey].response) {
          mappingIndex = draft[cKey].response.findIndex(
            op => op.operation === 'mappingData'
          );
          draft[cKey].initMappingData = draft[cKey].response[mappingIndex];
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.EXPAND_ALL:
        if (draft[cKey]) {
          draft[cKey].collapseStatus = {
            collapseAction: 'expand',
            collapseStatus: 'expanded',
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.COLLAPSE_ALL:
        if (draft[cKey]) {
          draft[cKey].collapseStatus = {
            collapseAction: 'collapse',
            collapseStatus: 'collapsed',
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .CLEAR_COLLAPSE_STATUS:
        if (draft[cKey] && draft[cKey].collapseStatus) {
          delete draft[cKey].collapseStatus.collapseAction;
        }

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

export function categoryMappingsCollapsedStatus(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state || !state[cKey]) {
    return emptyObj;
  }

  return state[cKey].collapseStatus || emptyObj;
}

export function categoryMappingFilters(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state || !state[cKey]) {
    return null;
  }

  return state[cKey].filters;
}

export function categoryMapping(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state) {
    return null;
  }

  return state[cKey];
}

export function variationMappingData(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state) return null;
  const { response = [] } = state[cKey] || emptyObj;
  const mappings = [];
  let mappingMetadata = [];
  const basicMappingData = response.find(
    sec => sec.operation === 'mappingData'
  );

  if (basicMappingData) {
    mappingMetadata =
      basicMappingData.data.mappingData.variationMappings.recordMappings;
  }

  mappingMetadata.forEach(meta => {
    flattenChildrenStructrue(mappings, meta);
  });

  return mappings;
}

export function categoryMappingData(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state) {
    return null;
  }

  const { response = [], deleted = [] } = state[cKey] || emptyObj;
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
    flattenChildrenStructrue(mappings, meta, true, { deleted });
  });

  return mappings;
}

export function categoryMappingGeneratesMetadata(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state) {
    return null;
  }

  const { generatesMetadata = [] } = state[cKey] || emptyObj;
  const generates = [];

  generatesMetadata.forEach(meta => {
    flattenChildrenStructrue(generates, meta);
  });

  return generates;
}

export function categoryMappingsForSection(state, integrationId, flowId, id) {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state) {
    return emptySet;
  }

  return (
    (state[cKey] && state[cKey].mappings && state[cKey].mappings[id]) ||
    emptySet
  );
}

// #region PUBLIC SELECTORS
export function categoryMappingsChanged(state, integrationId, flowId) {
  const cKey = getCategoryKey(integrationId, flowId);
  const isMappingsEqual = false;

  if (!state || !state[cKey] || !state[cKey].response) {
    return isMappingsEqual;
  }

  const { response, mappings } =
    categoryMapping(state, integrationId, flowId) || {};
  const mappingData = response.find(op => op.operation === 'mappingData');
  const sessionMappedData =
    mappingData && mappingData.data && mappingData.data.mappingData;
  const clonedData = deepClone(sessionMappedData);

  mappingUtil.setCategoryMappingData(flowId, clonedData, mappings);

  const initData = state[cKey].initMappingData;

  if (!initData || !initData.data || !initData.data.mappingData) {
    return isMappingsEqual;
  }

  return !isEqual(initData.data.mappingData, clonedData);
}

export function categoryMappingSaveStatus(state, integrationId, flowId) {
  const cKey = `${flowId}-${integrationId}`;

  if (!state || !state[cKey]) {
    return null;
  }

  return state[cKey].saveStatus;
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

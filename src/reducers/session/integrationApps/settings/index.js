import produce from 'immer';
import map from 'lodash/map';
import { createSelector } from 'reselect';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../../../actions/types';
import mappingUtil from '../../../../utils/mapping';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';

const emptyObj = {};
const emptySet = [];

function flattenChildrenStructrue(
  result = [],
  meta,
  isRoot = true,
  options = {}
) {
  const {
    deleted = [],
    isParentDeleted = false,
    deleteChildlessParent = false,
    depth = 0,
  } = options;

  if (meta) {
    let allChildrenDeleted = false;

    if (deleteChildlessParent && meta.children && meta.children.length) {
      allChildrenDeleted = !meta.children.some(
        child => !deleted.includes(child.id)
      );
    }

    result.push({
      ...meta,
      isRoot,
      depth,
      deleted:
        allChildrenDeleted || deleted.includes(meta.id) || isParentDeleted,
    });

    if (meta.children) {
      meta.children.forEach(child =>
        flattenChildrenStructrue(result, child, false, {
          deleted,
          depth: depth + 1,
          isParentDeleted: deleted.includes(meta.id),
          deleteChildlessParent,
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
    oldValue,
    newValue,
    value,
    index,
    field,
    closeOnSave,
    options = {},
  } = action;
  const key = getStateKey(integrationId, flowId, sectionId);
  const cKey = getCategoryKey(integrationId, flowId);
  const addOnKey = `${integrationId}-addOns`;
  let mappingIndex;
  let categoryMappingData;
  let generatesMetadata;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.INIT_COMPLETE:
        draft[key] = {
          initComplete: true,
        };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE:
        if (!draft[key]) draft[key] = {};
        draft[key].formSaveStatus = FORM_SAVE_STATUS.LOADING;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA:
        if (!draft[addOnKey]) {
          draft[addOnKey] = {};
        }

        draft[addOnKey].status = 'requested';

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA_FAILURE:
        if (!draft[addOnKey]) {
          draft[addOnKey] = {};
        }

        draft[addOnKey].status = 'failed';

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA_UPDATE:
        if (response && response.addOns) {
          if (!draft[addOnKey]) {
            draft[addOnKey] = {};
          }

          draft[addOnKey].status = 'received';
          draft[addOnKey].addOns = {
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
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId].mappingMetadata = response;
          draft[integrationId].status = 'received';
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_ERROR:
        if (error) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId].status = 'error';
          draft[integrationId].error = error;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_COMPLETE:
        if (!draft[key]) draft[key] = {};
        draft[key].formSaveStatus = FORM_SAVE_STATUS.COMPLETE;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_FAILED:
        if (!draft[key]) draft[key] = {};
        draft[key].formSaveStatus = FORM_SAVE_STATUS.FAILED;
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE_VARIATION_MAPPINGS:
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          mappingUtil.addVariation(draft, cKey, data);
          draft[cKey].mappings[id].staged = draft[cKey].mappings[id].mappings;
          draft[cKey].mappings[id].stagedLookups =
            draft[cKey].mappings[id].lookups;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CANCEL_VARIATION_MAPPINGS:
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

          if (draft[cKey].mappings[id].lastModifiedRow === index) draft[cKey].mappings[id].lastModifiedRow = -1;
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

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CLEAR:
        delete draft[cKey];
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CLEAR_SAVE_STATUS:
        delete draft[cKey].saveStatus;
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT:
        {
          const {
            adaptorType,
            resourceData,
            application,
            lookups,
            isGroupedSampleData,
            isVariationMapping,
            categoryId,
            childCategoryId,
            variation,
            isVariationAttributes,
            netsuiteRecordType,
            ...additionalOptions
          } = options;

          if (isVariationMapping) {
            mappingUtil.addVariationMap(
              draft[cKey],
              categoryId,
              childCategoryId,
              variation,
              isVariationAttributes
            );
          }

          const staged =
            draft[cKey] &&
            draft[cKey].mappings &&
            draft[cKey].mappings[id] &&
            draft[cKey].mappings[id].staged;
          const formattedMappings =
            staged ||
            mappingUtil.getMappingFromResource({
              importResource: resourceData,
              isFieldMapping: false,
              isGroupedSampleData,
              netsuiteRecordType,
              options: {
                ...additionalOptions,
                isVariationMapping,
              },
            });
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
            staged,
            visible: true,
            isGroupedSampleData,
            flowSampleData: undefined,
            netsuiteRecordType,
            // lastModifiedRow helps to set generate field when any field in salesforce mapping assistant is clicked
            lastModifiedRow: -1,
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.UPDATE_GENERATES: {
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
                if (inputValue.charAt(inputValue.length - 1) !== '"') inputValue += '"';
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

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.PATCH_SETTINGS:
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

            if (valueTmp.hardCodedValue && valueTmp.hardCodedValue.length) valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.UPDATE_LOOKUP: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          if (oldValue) {
            draft[cKey].mappings[id].lookups = draft[cKey].mappings[id].lookups.filter(l => l.name !== oldValue.name);
          }
          if (newValue) {
            draft[cKey].mappings[id].lookups.push(newValue);
          }
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

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CLEAR_VARIATION_MAPPINGS:
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

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SET_VISIBILITY:
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE_COMPLETE:
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
      // the action loadFailed is empty for future use
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.LOAD_FAILED:
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA:
        ({ response: categoryMappingData } = metadata);
        generatesMetadata = categoryMappingData.find(
          data => data.operation === 'generatesMetaData'
        );

        if (draft[cKey]) {
          if (!draft[cKey].generatesMetadata) {
            draft[cKey].generatesMetadata = [];
          }

          if (
            generatesMetadata.data &&
            generatesMetadata.data.generatesMetaData &&
            generatesMetadata.data.generatesMetaData.id &&
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
        if (draft[cKey]) mappingUtil.addCategory(draft, integrationId, flowId, data);

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
      case actionTypes.INTEGRATION_APPS.SETTINGS.RECEIVED_CATEGORY_MAPPINGS_DATA:
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.RECEIVED_CATEGORY_MAPPING_METADATA:
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CLEAR_COLLAPSE_STATUS:
        if (draft[cKey] && draft[cKey].collapseStatus) {
          delete draft[cKey].collapseStatus.collapseAction;
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.integrationAppSettingsFormState = (
  state,
  integrationId,
  flowId,
  sectionId
) => {
  if (!state) {
    return emptyObj;
  }

  const key = getStateKey(integrationId, flowId, sectionId);

  return state[key] || emptyObj;
};

selectors.mkCategoryMappingsCollapsedStatus = () => createSelector(
  (state, integrationId, flowId) => {
    const cKey = getCategoryKey(integrationId, flowId);

    if (!state || !state[cKey]) {
      return emptyObj;
    }

    return state[cKey].collapseStatus || emptyObj;
  },
  collapseStatus => collapseStatus);

selectors.mkCategoryMappingFilters = () => createSelector(
  (state, integrationId, flowId) => {
    const cKey = getCategoryKey(integrationId, flowId);

    if (!state || !state[cKey]) {
      return null;
    }

    return state[cKey].filters;
  }, filters => filters);

selectors.categoryMapping = (state, integrationId, flowId) => {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state) {
    return null;
  }

  return state[cKey];
};

selectors.mkMappedCategories = () => createSelector(
  (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)],
  (categoryMappingData = emptyObj) => {
    let mappedCategories = emptySet;
    const { response } = categoryMappingData;

    if (response) {
      const mappingData = response.find(sec => sec.operation === 'mappingData');

      if (mappingData) {
        mappedCategories = mappingData.data.mappingData.basicMappings.recordMappings.map(
          item => ({
            id: item.id,
            name: item.name === 'commonAttributes' ? 'Common' : item.name,
            children: item.children,
          })
        );
      }
    }

    return mappedCategories;
  }
);

selectors.mkVariationMappingData = () => createSelector(
  (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.response,
  (response = emptySet) => {
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
);

selectors.mkMappingsForVariation = () => {
  const variationMappingsSelector = selectors.mkVariationMappingData();

  return createSelector(
    variationMappingsSelector,
    (_1, _2, _3, filters) => filters,
    (recordMappings = emptyObj, filters = emptyObj) => {
      const { sectionId, variation, isVariationAttributes } = filters;
      let mappings = {};

      if (Array.isArray(recordMappings)) {
        mappings = recordMappings.find(item => item.id === sectionId) || {};
      }

      if (isVariationAttributes) {
        return mappings;
      }

      // propery being read as is from IA metadata, to facilitate initialization and to avoid re-adjust while sending back.
      // eslint-disable-next-line camelcase
      const { variation_themes = [] } = mappings;

      return (
        variation_themes.find(theme => theme.variation_theme === variation) || emptyObj
      );
    });
};

selectors.mkCategoryMappingData = () => createSelector(
  (state, integrationId, flowId) => {
    const cKey = getCategoryKey(integrationId, flowId);

    if (!state) {
      return null;
    }

    const { response = [], deleted = [], uiAssistant } = state[cKey] || emptyObj;
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
      flattenChildrenStructrue(mappings, meta, true, {
        deleted,
        deleteChildlessParent: uiAssistant !== 'jet',
      });
    });

    return mappings;
  }, data => data);
selectors.categoryMappingData = selectors.mkCategoryMappingData();

selectors.mkCategoryMappingGeneratesMetadata = () => createSelector(
  (state, integrationId, flowId) => {
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
  }, generates => generates
);
selectors.categoryMappingGeneratesMetadata = selectors.mkCategoryMappingGeneratesMetadata();

selectors.mkCategoryMappingsForSection = () => createSelector(
  (state, integrationId, flowId, id) => {
    const cKey = getCategoryKey(integrationId, flowId);

    if (!state || !state[cKey] || !state[cKey].mappings) {
      return emptySet;
    }

    return state[cKey].mappings[id] || emptySet;
  }, mappings => mappings
);
selectors.categoryMappingsForSection = selectors.mkCategoryMappingsForSection();

selectors.mkCategoryMappingGenerateFields = () => createSelector(
  (state, integrationId, flowId) => {
    const cKey = getCategoryKey(integrationId, flowId);
    const { generatesMetadata = [] } = state?.[cKey] || emptyObj;
    const generates = [];

    generatesMetadata.forEach(meta => {
      flattenChildrenStructrue(generates, meta);
    });

    return generates;
  },
  (_1, _2, _3, options = emptyObj) => options.sectionId,
  (generatesMetadata, sectionId) => {
    if (Array.isArray(generatesMetadata)) {
      return generatesMetadata.find(sec => sec.id === sectionId);
    }

    return null;
  });
selectors.categoryMappingGenerateFields = selectors.mkCategoryMappingGenerateFields();

selectors.mkMappingsForCategory = () => {
  const categoryMappingFiltersSelector = selectors.mkCategoryMappingFilters();
  const categoryMappingDataSelector = selectors.mkCategoryMappingData();
  const categoryMappingGenerateFieldsSelector = selectors.mkCategoryMappingGenerateFields();

  return createSelector(
    categoryMappingFiltersSelector,
    categoryMappingDataSelector,
    categoryMappingGenerateFieldsSelector,
    (_1, _2, _3, filters) => filters,
    (categoryMappingFilters = emptyObj, recordMappings = emptySet, generateFields = emptyObj, filters = emptyObj) => {
      const { sectionId, depth } = filters;
      let mappings = emptySet;
      const { attributes = {}, mappingFilter = 'all' } = categoryMappingFilters;
      const { fields = [] } = generateFields;

      if (recordMappings) {
        if (depth === undefined) {
          mappings = recordMappings.find(item => item.id === sectionId);
        } else {
          mappings = recordMappings.find(item => item.id === sectionId && depth === item.depth);
        }
      }

      // If no filters are passed, return all mapppings
      if (!mappings || !attributes || !mappingFilter) {
        return mappings;
      }

      const mappedFields = map(mappings.fieldMappings, 'generate');
      // Filter all generateFields with filter which are not yet mapped
      const filteredFields = fields
        .filter(field => !mappedFields.includes(field.id))
        .map(field => ({
          generate: field.id,
          extract: '',
          discardIfEmpty: true,
        }));
      // Combine filtered mappings and unmapped fields and generate unmapped fields
      const filteredMappings = [...mappings.fieldMappings, ...filteredFields];

      // return mappings object by overriding field mappings with filtered mappings
      return {
        ...mappings,
        fieldMappings: filteredMappings,
      };
    });
};

selectors.mkCategoryMappingMetadata = () => createSelector(
  (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)],
  (categoryMappingData = emptyObj) => {
    const categoryMappingMetadata = {};
    const { response } = categoryMappingData;

    if (!response) {
      return categoryMappingMetadata;
    }

    const extractsMetadata = response.find(
      sec => sec.operation === 'extractsMetaData'
    );
    const generatesMetadata = response.find(
      sec => sec.operation === 'generatesMetaData'
    );

    if (extractsMetadata) {
      categoryMappingMetadata.extractsMetadata = extractsMetadata.data;
    }

    if (generatesMetadata) {
      categoryMappingMetadata.generatesMetadata =
      generatesMetadata.data &&
      generatesMetadata.data.generatesMetaData &&
      generatesMetadata.data.generatesMetaData.fields;
      categoryMappingMetadata.relationshipData =
      generatesMetadata.data && generatesMetadata.data.categoryRelationshipData;
    }

    return categoryMappingMetadata;
  });
selectors.categoryMappingMetadata = selectors.mkCategoryMappingMetadata();

selectors.mkPendingCategoryMappings = () => {
  const categoryMappingsGeneratesSelector = selectors.mkCategoryMappingGeneratesMetadata();

  return createSelector(
    (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)],
    categoryMappingsGeneratesSelector,
    (_1, _2, flowId) => flowId,
    (categoryMappingData = emptyObj, categoryRelationshipData, flowId) => {
      const { response = [], mappings, deleted, uiAssistant } = categoryMappingData;
      const mappingData = response.find(op => op.operation === 'mappingData');
      const sessionMappedData =
    mappingData && mappingData.data && mappingData.data.mappingData;

      // SessionMappedData is a state object reference and setCategoryMappingData recursively mutates the parameter, hence deepClone the sessionData
      const sessionMappings = deepClone(sessionMappedData);

      mappingUtil.setCategoryMappingData(
        flowId,
        sessionMappings,
        mappings,
        deleted,
        categoryRelationshipData,
        uiAssistant !== 'jet'
      );

      return sessionMappings;
    });
};
selectors.pendingCategoryMappings = selectors.mkPendingCategoryMappings();

// #region PUBLIC SELECTORS
selectors.mkCategoryMappingsChanged = () => {
  const categoryMappingsGeneratesSelector = selectors.mkCategoryMappingGeneratesMetadata();

  return createSelector(
    (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)],
    categoryMappingsGeneratesSelector,
    (_1, _2, flowId) => flowId,
    (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.initMappingData,
    (categoryMappingData = emptyObj, categoryRelationshipData, flowId, initData) => {
      const isMappingsEqual = false;

      if (!categoryMappingData || !categoryMappingData.response) {
        return isMappingsEqual;
      }

      const { response, mappings, deleted } = categoryMappingData;
      const mappingData = response.find(op => op.operation === 'mappingData');
      const sessionMappedData = mappingData && mappingData.data && mappingData.data.mappingData;
      const clonedData = deepClone(sessionMappedData);

      mappingUtil.setCategoryMappingData(
        flowId,
        clonedData,
        mappings,
        deleted,
        categoryRelationshipData
      );

      if (!initData || !initData.data || !initData.data.mappingData) {
        return isMappingsEqual;
      }

      return !mappingUtil.isEqual(initData.data.mappingData, clonedData);
    });
};

selectors.categoryMappingSaveStatus = (state, integrationId, flowId) => {
  const cKey = `${flowId}-${integrationId}`;

  if (!state || !state[cKey]) {
    return null;
  }

  return state[cKey].saveStatus;
};

selectors.integrationAppAddOnState = (state, integrationId) => {
  if (!state) {
    return emptyObj;
  }

  const addOnKey = `${integrationId}-addOns`;

  return state[addOnKey] || emptyObj;
};

selectors.integrationAppMappingMetadata = (state, integrationId) => {
  if (!state) {
    return emptyObj;
  }

  return state[integrationId] || emptyObj;
};

selectors.shouldRedirect = (state, integrationId) => {
  if (!state || !state[integrationId]) {
    return null;
  }

  return state[integrationId].redirectTo;
};

selectors.checkUpgradeRequested = (state, licenseId) => {
  if (!state) {
    return false;
  }

  return !!state[licenseId];
};

// #endregion

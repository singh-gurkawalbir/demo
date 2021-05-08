import produce from 'immer';
import { createSelector } from 'reselect';
import { deepClone } from 'fast-json-patch/lib/core';
import shortid from 'shortid';
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
        child => !deleted?.[depth + 1]?.includes(child.id)
      );
    }

    result.push({
      ...(meta || {}),
      isRoot,
      depth,
      ...(options?.lookups?.length && { lookups: options.lookups }),
      deleted: allChildrenDeleted || deleted[depth]?.includes(meta.id) || isParentDeleted,
    });

    if (meta.children) {
      meta.children.forEach(child =>
        flattenChildrenStructrue(result, child, false, {
          deleted,
          depth: depth + 1,
          isParentDeleted: deleted[depth]?.includes(meta.id),
          deleteChildlessParent,
          lookups: meta.lookups,
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
    metadata,
    error,
    mappingData,
    filters,
    sectionId,
    data,
    id,
    key: mappingKey,
    generateFields,
    oldValue,
    newValue,
    value,
    field,
    closeOnSave,
    depth,
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
          const mappingToDelete = draft[cKey].mappings[id].mappings?.find(m => m.key === mappingKey);

          if (mappingToDelete?.lookupName) {
          // delete lookup
            draft[cKey].mappings[id].lookups = draft[cKey].mappings[id].lookups.filter(l => l.name !== mappingToDelete.lookupName);
          }
          draft[cKey].mappings[id].mappings = draft[cKey].mappings[id].mappings.filter(m => m.key !== mappingKey);
          if (draft[cKey].mappings[id].lastModifiedRowKey === key) { delete draft[cKey].mappings[id].lastModifiedRowKey; }

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
        if (!draft[cKey]) {
          draft[cKey] = {};
        }
        if (!draft[cKey].mappings) {
          draft[cKey].mappings = {};
        }
        if (!draft[cKey].mappings[id]) {
          draft[cKey].mappings[id] = {
            status: 'requested',
          };
        } else {
          draft[cKey].mappings[id].status = 'requested';
        }
        // {
        //   const {
        //     adaptorType,
        //     resourceData,
        //     application,
        //     lookups,
        //     isGroupedSampleData,
        //     isVariationMapping,
        //     categoryId,
        //     childCategoryId,
        //     variation,
        //     isVariationAttributes,
        //     netsuiteRecordType,
        //     ...additionalOptions
        //   } = options;

        //   if (isVariationMapping) {
        //     mappingUtil.addVariationMap(
        //       draft[cKey],
        //       categoryId,
        //       childCategoryId,
        //       variation,
        //       isVariationAttributes
        //     );
        //   }

        //   const staged =
        //     draft[cKey] &&
        //     draft[cKey].mappings &&
        //     draft[cKey].mappings[id] &&
        //     draft[cKey].mappings[id].staged;
        //   const formattedMappings =
        //     staged ||
        //     mappingUtil.getMappingFromResource({
        //       importResource: resourceData,
        //       isFieldMapping: false,
        //       isGroupedSampleData,
        //       netsuiteRecordType,
        //       options: {
        //         ...additionalOptions,
        //         isVariationMapping,
        //       },
        //     });
        //   const initChangeIdentifier =
        //     (draft[cKey] &&
        //       draft[cKey].mappings &&
        //       draft[cKey].mappings[id] &&
        //       draft[cKey].mappings[id].initChangeIdentifier) ||
        //     0;

        //   if (!draft[cKey]) {
        //     draft[cKey] = {};
        //   }

        //   if (!draft[cKey].mappings) {
        //     draft[cKey].mappings = {};
        //   }

        //   draft[cKey].mappings[id] = {
        //     mappings: formattedMappings.map(m => ({ ...m, rowIdentifier: 0 })),
        //     incompleteGenerates: [],
        //     lookups: lookups || [],
        //     initChangeIdentifier: initChangeIdentifier + 1,
        //     application,
        //     resource: resourceData,
        //     adaptorType,
        //     generateFields,
        //     staged,
        //     visible: true,
        //     isGroupedSampleData,
        //     flowSampleData: undefined,
        //     netsuiteRecordType,
        //     // lastModifiedRow helps to set generate field when any field in salesforce mapping assistant is clicked
        //     lastModifiedRow: -1,
        //   };
        // }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT_COMPLETE: {
        const {
          isVariationMapping,
          categoryId,
          childCategoryId,
          variation,
          isVariationAttributes,
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

        if (draft?.[cKey]?.mappings?.[id]) {
          draft[cKey].mappings[id] = {
            ...options,
            status: 'received',
          };
        }
        break;
      }
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT_FAILED:
        if (draft?.[cKey]?.mappings?.[id]) {
          draft[cKey].mappings[id].status = 'error';
        }
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.UPDATE_LAST_TOUCHED_FIELD:
        if (draft?.[cKey]?.mappings?.[id]) {
          draft[cKey].mappings[id].lastModifiedRowKey = mappingKey || 'new';
        }
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.UPDATE_GENERATES: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          draft[cKey].mappings[id].generateFields = generateFields;
        }

        break;
      }
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.PATCH_FIELD: {
        if (draft[cKey] && draft[cKey].mappings && draft[cKey].mappings[id]) {
          const index = draft[cKey].mappings[id].mappings?.findIndex(m => m.key === mappingKey);

          if (index !== -1) {
            const mapping = draft[cKey].mappings[id].mappings[index];

            if (field === 'extract') {
              if (value.indexOf('"') === 0) {
                delete mapping.extract;
                mapping.hardCodedValue = value.replace(/(^")|("$)/g, '');
              } else {
                delete mapping.hardCodedValue;
                mapping.extract = value;
              }
            } else {
              mapping[field] = value;
            }

            draft[cKey].mappings[id].mappings[index] = mapping;
            draft[cKey].mappings[id].lastModifiedRowKey = mapping.key;
          } else if (value) {
            const newKey = shortid.generate();
            const newRow = {
              key: newKey,
            };

            if (field === 'extract' && value.indexOf('"') === 0) {
              newRow.hardCodedValue = value.replace(/(^")|("$)/g, '');
            } else {
              newRow[field] = value;
            }
            draft[cKey].mappings[id].mappings.push(newRow);
            draft[cKey].mappings[id].lastModifiedRowKey = newKey;
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.PATCH_SETTINGS:
      {
        const index = (draft[cKey]?.mappings?.[id]?.mappings || []).findIndex(m => m.key === mappingKey);

        if (index !== -1) {
          const mapping = draft[cKey].mappings[id].mappings[index];

          Object.assign(mapping, value);

          // removing lookups
          if (!value.lookupName) {
            delete mapping.lookupName;
          }

          if ('hardCodedValue' in value) {
            delete mapping.extract;
          } else {
            delete mapping.hardCodedValue;
          }
          draft[cKey].mappings[id].mappings[index] = mapping;
          draft[cKey].mappings[id].lastModifiedRowKey = mappingKey;

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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SET_FILTERS:
        if (draft[cKey]) {
          draft[cKey].filters = {
            ...draft[cKey].filters,
            ...filters,
          };
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.ADD_CATEGORY:
        if (draft[cKey]) mappingUtil.addCategory(draft, integrationId, flowId, data);

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.DELETE_CATEGORY:
        if (draft[cKey]) {
          if (!draft[cKey].deleted) {
            draft[cKey].deleted = [];
          }
          if (!draft[cKey].deleted[depth]) {
            draft[cKey].deleted[depth] = [];
          }

          draft[cKey].deleted[depth].push(sectionId);
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.RESTORE_CATEGORY:
        if (
          draft[cKey]?.deleted?.[depth] &&
          draft[cKey].deleted[depth]?.indexOf(sectionId) > -1
        ) {
          draft[cKey].deleted[depth].splice(draft[cKey].deleted[depth].indexOf(sectionId), 1);
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.RECEIVED_UPDATED_MAPPING_DATA:
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

selectors.categoryMappingById = (state, integrationId, flowId, id) => {
  const cKey = getCategoryKey(integrationId, flowId);

  if (!state || !state[cKey]) {
    return null;
  }

  return state[cKey]?.mappings?.[id];
};

selectors.mkMappedCategories = () => createSelector(
  (state, integrationId, flowId) => {
    const {response} = state?.[getCategoryKey(integrationId, flowId)] || emptyObj;

    if (response) {
      const mappingData = response.find(sec => sec.operation === 'mappingData');

      return mappingData?.data?.mappingData?.basicMappings?.recordMappings || emptySet;
    }

    return emptySet;
  },
  (mappedCategories = emptySet) => mappedCategories.map(
    item => ({
      id: item.id,
      name: item.name === 'commonAttributes' ? 'Common' : item.name,
      children: item.children,
    })
  )
);

selectors.mkVariationMappingData = () => createSelector(
  (state, integrationId, flowId) => {
    const response = state?.[getCategoryKey(integrationId, flowId)]?.response || emptySet;
    const basicMappingData = response.find(sec => sec.operation === 'mappingData');

    return basicMappingData?.data?.mappingData?.variationMappings?.recordMappings;
  },
  (variationMappingData = emptySet) => {
    const mappings = [];

    variationMappingData.forEach(meta => {
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
      const { sectionId, variation, isVariationAttributes, depth } = filters;
      let mappings = {};

      if (Array.isArray(recordMappings)) {
        if (depth === undefined) {
          mappings = recordMappings.find(item => item.id === sectionId);
        } else {
          mappings = recordMappings.find(item => item.id === sectionId && +depth === item.depth);
        }
      }

      if (isVariationAttributes) {
        return mappings;
      }

      // propery being read as is from IA metadata, to facilitate initialization and to avoid re-adjust while sending back.
      // eslint-disable-next-line camelcase
      const { variation_themes = [] } = mappings || emptyObj;

      return (
        variation_themes.find(theme => theme.variation_theme === variation) || emptyObj
      );
    });
};

selectors.mkCategoryMappingData = () => createSelector(
  (state, integrationId, flowId) => {
    const cKey = getCategoryKey(integrationId, flowId);
    const { response = [] } = state?.[cKey] || emptyObj;
    const basicMappingData = response.find(
      sec => sec.operation === 'mappingData'
    );

    return basicMappingData?.data?.mappingData?.basicMappings?.recordMappings || emptySet;
  },
  (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.deleted || emptySet,
  (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.uiAssistant || '',
  (mappingMetadata, deleted, uiAssistant) => {
    const mappings = [];

    mappingMetadata.forEach(meta => {
      flattenChildrenStructrue(mappings, meta, true, {
        deleted,
        deleteChildlessParent: uiAssistant !== 'jet',
      });
    });

    return mappings;
  });
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

    return generatesMetadata;
  },
  (_1, _2, _3, options = emptyObj) => options.sectionId,
  (_1, _2, _3, options = emptyObj) => options.depth,
  (generatesMetadata, sectionId, depth) => {
    const generates = [];

    generatesMetadata.forEach(meta => {
      flattenChildrenStructrue(generates, meta);
    });
    if (Array.isArray(generates)) {
      if (depth === undefined) {
        return generates.find(sec => sec.id === sectionId);
      }

      return generates.find(sec => sec.id === sectionId && +depth === sec.depth);
    }

    return null;
  });
selectors.categoryMappingGenerateFields = selectors.mkCategoryMappingGenerateFields();

selectors.mkMappingsForCategory = () => {
  const categoryMappingDataSelector = selectors.mkCategoryMappingData();
  const categoryMappingGenerateFieldsSelector = selectors.mkCategoryMappingGenerateFields();

  return createSelector(
    categoryMappingDataSelector,
    categoryMappingGenerateFieldsSelector,
    (_1, _2, _3, filters) => filters,
    (recordMappings = emptySet, generateFields = emptyObj, filters = emptyObj) => {
      const { sectionId, depth } = filters;
      let mappings = emptySet;

      const { fields = [] } = generateFields;

      if (recordMappings) {
        if (depth === undefined) {
          mappings = recordMappings.find(item => item.id === sectionId);
        } else {
          mappings = recordMappings.find(item => item.id === sectionId && depth === item.depth);
        }
      }

      // If no filters are passed, return all mapppings
      if (!mappings) {
        return mappings;
      }

      const filteredMappings = fields.map(field => {
        const mapConfig = mappings.fieldMappings.find(f => f.generate === field.id);

        return mapConfig ? {
          ...mapConfig,
          filterType: field.filterType,
          showListOption: !!field.options?.length,
          description: field.description,
          name: field.name,
        }
          : {
            generate: field.id,
            extract: '',
            discardIfEmpty: true,
            name: field.name,
            showListOption: !!field.options?.length,
            filterType: field.filterType,
            description: field.description,
          };
      });

      // return mappings object by overriding field mappings with filtered mappings
      return {
        ...mappings,
        fieldMappings: filteredMappings,
      };
    });
};

selectors.mkCategoryMappingsExtractsMetadata = () => createSelector(
  (state, integrationId, flowId) => {
    const {response = [] } = state?.[getCategoryKey(integrationId, flowId)] || emptyObj;
    const extractsMetadata = response.find(
      sec => sec.operation === 'extractsMetaData'
    );

    return extractsMetadata?.data || emptySet;
  },
  (extractsMetadata = emptySet) => extractsMetadata);
selectors.categoryMappingsExtractsMetadata = selectors.mkCategoryMappingsExtractsMetadata();

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
    (state, integrationId, flowId) => {
      const categoryMappingData = state?.[getCategoryKey(integrationId, flowId)];
      const { response = emptySet } = categoryMappingData || emptyObj;
      const mappingData = response.find(op => op.operation === 'mappingData');
      const sessionMappedData = mappingData?.data?.mappingData;
      const sessionMappings = deepClone(sessionMappedData);

      return sessionMappings;
    },
    categoryMappingsGeneratesSelector,
    (_1, _2, flowId) => flowId,
    (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.mappings,
    (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.deleted,
    (state, integrationId, flowId) => state?.[getCategoryKey(integrationId, flowId)]?.initMappingData?.data?.mappingData,
    (sessionMappings, categoryRelationshipData, flowId, userMappings, deletedMappings, initData) => {
      const isMappingsEqual = false;

      if (!sessionMappings) {
        return isMappingsEqual;
      }
      mappingUtil.setCategoryMappingData(
        flowId,
        sessionMappings,
        userMappings,
        deletedMappings,
        categoryRelationshipData
      );

      if (!initData) {
        return !isMappingsEqual;
      }

      return !mappingUtil.isEqual(initData, sessionMappings);
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

selectors.checkUpgradeRequested = (state, licenseId) => {
  if (!state) {
    return false;
  }

  return !!state[licenseId];
};

// #endregion

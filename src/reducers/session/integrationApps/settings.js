import produce from 'immer';
import { uniqBy, isEqual, differenceWith } from 'lodash';
import { deepClone } from 'fast-json-patch';
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
const addCategory = (draft, integrationId, flowId, data) => {
  const { category, childCategory, grandchildCategory } = data;
  const { response = [] } = draft[`${flowId}-${integrationId}`];
  const generatesMetaData = response.find(
    sec => sec.operation === 'generatesMetaData'
  );
  const categoryRelationshipData =
    generatesMetaData &&
    generatesMetaData.data &&
    generatesMetaData.data.categoryRelationshipData;
  const mappingData = response.find(sec => sec.operation === 'mappingData');
  let childCategoryDetails;
  let grandchildCategoryDetails;
  const categoryDetails = categoryRelationshipData.find(
    rel => rel.id === category
  );

  if (childCategory && categoryDetails.children) {
    childCategoryDetails = categoryDetails.children.find(
      child => child.id === childCategory
    );
  }

  if (
    childCategoryDetails &&
    grandchildCategory &&
    childCategoryDetails.children
  ) {
    grandchildCategoryDetails = childCategoryDetails.children.find(
      child => child.id === grandchildCategory
    );
  }

  if (
    mappingData.data &&
    mappingData.data.mappingData &&
    mappingData.data.mappingData.basicMappings &&
    mappingData.data.mappingData.basicMappings.recordMappings
  ) {
    const { recordMappings } = mappingData.data.mappingData.basicMappings;

    if (!recordMappings.find(mapping => mapping.id === category)) {
      recordMappings.push({
        id: category,
        name: categoryDetails.name,
        children: [],
        fieldMappings: [],
      });
    }

    if (!childCategory) {
      return;
    }

    const { children = [] } = recordMappings.find(
      mapping => mapping.id === category
    );

    if (!children.find(child => child.id === childCategory)) {
      children.push({
        id: childCategory,
        name: childCategoryDetails.name,
        children: [],
        fieldMappings: [],
      });
    }

    if (!grandchildCategory) {
      return;
    }

    const grandChildren =
      children.find(child => child.id === childCategory).children || [];

    if (!grandChildren.find(child => child.id === grandchildCategory)) {
      grandChildren.push({
        id: grandchildCategory,
        name: grandchildCategoryDetails.name,
        children: [],
        fieldMappings: [],
      });
    }
  }
};

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
    options = {},
  } = action;
  const key = getStateKey(integrationId, flowId, sectionId);
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
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.DELETE: {
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].initChangeIdentifier += 1;
          draft[`${flowId}-${integrationId}`].mappings[id].mappings.splice(
            index,
            1
          );

          if (
            draft[`${flowId}-${integrationId}`].mappings[id].lastModifiedRow ===
            index
          )
            draft[`${flowId}-${integrationId}`].mappings[
              id
            ].lastModifiedRow = -1;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings,
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );

          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].validationErrMsg = isSuccess ? undefined : validationErrMsg;
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
            salesforceMasterRecordTypeId,
            netsuiteRecordType,
            showSalesforceNetsuiteAssistant,
            subRecordMappingId,
            ...additionalOptions
          } = options;
          const formattedMappings = mappingUtil.getMappingFromResource(
            resourceData,
            false,
            isGroupedSampleData,
            netsuiteRecordType,
            additionalOptions
          );
          const lookups = lookupUtil.getLookupFromResource(resourceData);
          const initChangeIdentifier =
            (draft[`${flowId}-${integrationId}`] &&
              draft[`${flowId}-${integrationId}`].mappings &&
              draft[`${flowId}-${integrationId}`].mappings[id] &&
              draft[`${flowId}-${integrationId}`].mappings[id]
                .initChangeIdentifier) ||
            0;

          if (!draft[`${flowId}-${integrationId}`]) {
            draft[`${flowId}-${integrationId}`] = {};
          }

          if (!draft[`${flowId}-${integrationId}`].mappings) {
            draft[`${flowId}-${integrationId}`].mappings = {};
          }

          draft[`${flowId}-${integrationId}`].mappings[id] = {
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
            subRecordMappingId,
            salesforceMasterRecordTypeId,
            showSalesforceNetsuiteAssistant,
            // lastModifiedRow helps to set generate field when any field in salesforce mapping assistant is clicked
            lastModifiedRow: -1,
          };
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].mappingsCopy = deepClone(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings
          );
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].lookupsCopy = deepClone(
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .UPDATE_GENERATES: {
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].generateFields = generateFields;
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].mappingsCopy = deepClone(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings
          );
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].lookupsCopy = deepClone(
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .PATCH_FIELD: {
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          if (
            draft[`${flowId}-${integrationId}`].mappings[id].mappings[index]
          ) {
            const objCopy = {
              ...draft[`${flowId}-${integrationId}`].mappings[id].mappings[
                index
              ],
            };

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

            draft[`${flowId}-${integrationId}`].mappings[id].mappings[
              index
            ] = objCopy;
          } else if (value) {
            draft[`${flowId}-${integrationId}`].mappings[id].mappings.push({
              [field]: value,
              rowIdentifier: 0,
            });
          }

          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].lastModifiedRow = index;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings,
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );

          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .PATCH_INCOMPLETE_GENERATES: {
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          const incompleteGeneObj = draft[
            `${flowId}-${integrationId}`
          ].mappings[id].incompleteGenerates.find(gen => gen.index === index);

          if (incompleteGeneObj) {
            incompleteGeneObj.value = value;
          } else {
            draft[`${flowId}-${integrationId}`].mappings[
              id
            ].incompleteGenerates.push({ index, value });
          }
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .PATCH_SETTINGS:
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          const {
            generate,
            extract,
            isNotEditable,
            index: mappingIndex,
            isRequired,
            rowIdentifier,
          } = draft[`${flowId}-${integrationId}`].mappings[id].mappings[index];
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

          valueTmp.rowIdentifier += 1;

          if ('hardCodedValue' in valueTmp) {
            // wrap anything expect '' and null ,

            if (valueTmp.hardCodedValue && valueTmp.hardCodedValue.length)
              valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft[`${flowId}-${integrationId}`].mappings[id].mappings[index] = {
            ...valueTmp,
          };
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].lastModifiedRow = index;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings,
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );

          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .UPDATE_LOOKUP: {
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[id].lookups = lookups;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = mappingUtil.validateMappings(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings,
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );

          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }

        break;
      }

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .CLEAR_VARIATION_MAPPINGS:
        // Variation mappings have id structure as `${flowId}-${integrationId}-${sectionId}-${variation}`
        // ie,  all variations of one section will have same prefix `${flowId}-${integrationId}-${sectionId}`
        // so while deleting section we need to delete all variations of that section.
        // hence searching by prefix and not strict id check.
        Object.keys(draft[`${flowId}-${integrationId}`].mappings).forEach(
          _id => {
            if (_id.startsWith(id)) {
              delete draft[`${flowId}-${integrationId}`].mappings[id];
            }
          }
        );

        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .SET_VISIBILITY:
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[id].visible = value;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE:
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].submitCompleted = false;
          draft[`${flowId}-${integrationId}`].mappings[id].submitFailed = false;
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
        .SAVE_COMPLETE:
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].submitCompleted = true;
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].validationErrMsg = undefined;
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].mappingsCopy = deepClone(
            draft[`${flowId}-${integrationId}`].mappings[id].mappings
          );
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].lookupsCopy = deepClone(
            draft[`${flowId}-${integrationId}`].mappings[id].lookups
          );
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE_FAILED:
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].mappings &&
          draft[`${flowId}-${integrationId}`].mappings[id]
        ) {
          draft[`${flowId}-${integrationId}`].mappings[id].submitFailed = true;
          draft[`${flowId}-${integrationId}`].mappings[
            id
          ].validationErrMsg = undefined;
        }

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
      case actionTypes.INTEGRATION_APPS.SETTINGS.ADD_CATEGORY:
        if (draft[`${flowId}-${integrationId}`])
          addCategory(draft, integrationId, flowId, data);

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.DELETE_CATEGORY:
        if (draft[`${flowId}-${integrationId}`]) {
          if (!draft[`${flowId}-${integrationId}`].deleted) {
            draft[`${flowId}-${integrationId}`].deleted = [];
          }

          draft[`${flowId}-${integrationId}`].deleted.push(sectionId);
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.RESTORE_CATEGORY:
        if (
          draft[`${flowId}-${integrationId}`] &&
          draft[`${flowId}-${integrationId}`].deleted &&
          draft[`${flowId}-${integrationId}`].deleted.indexOf(sectionId) > -1
        ) {
          draft[`${flowId}-${integrationId}`].deleted.splice(
            draft[`${flowId}-${integrationId}`].deleted.indexOf(sectionId),
            1
          );
        }

        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPINGS_DATA:
        if (draft[`${flowId}-${integrationId}`]) {
          draft[`${flowId}-${integrationId}`].status = 'saved';

          if (draft[`${flowId}-${integrationId}`].response) {
            mappingIndex = draft[
              `${flowId}-${integrationId}`
            ].response.findIndex(op => op.operation === 'mappingData');
            draft[`${flowId}-${integrationId}`].response[
              mappingIndex
            ] = mappingData;
          }
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
              optional: false,
              conditional: false,
              preferred: false,
            },
            mappingFilter: 'all',
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

export function variationMappingData(state, integrationId, flowId) {
  if (!state) return null;
  const { response = [] } = state[`${flowId}-${integrationId}`] || emptyObj;
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
  if (!state) {
    return null;
  }

  const { response = [], deleted = [] } =
    state[`${flowId}-${integrationId}`] || emptyObj;
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

export function mappingSaveProcessTerminate(state, id) {
  if (!state) {
    return emptySet;
  }

  if (!state[id]) return false;
  const { submitFailed, submitCompleted } = state[id];

  return {
    saveTerminated: !!(submitFailed || submitCompleted),
    saveCompleted: !!submitCompleted,
  };
}

const isMappingObjEqual = (mapping1, mapping2) => {
  const {
    rowIdentifier: r1,
    index: i1,
    isNotEditable: e1,
    isRequired: req1,
    ...formattedMapping1
  } = mapping1;
  const {
    rowIdentifier: r2,
    index: i2,
    isNotEditable: e2,
    isRequired: req2,
    ...formattedMapping2
  } = mapping2;

  return isEqual(formattedMapping1, formattedMapping2);
};

export function categoryMappingsForSection(state, integrationId, flowId, id) {
  if (!state) {
    return emptySet;
  }

  return (
    (state[`${flowId}-${integrationId}`] &&
      state[`${flowId}-${integrationId}`].mappings &&
      state[`${flowId}-${integrationId}`].mappings[id]) ||
    emptySet
  );
}

// #region PUBLIC SELECTORS
export function mappingsChanged(state, id) {
  if (!state || !state[id]) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy } = state[id];
  const mappingsDiff = differenceWith(
    mappingsCopy,
    mappings,
    isMappingObjEqual
  );
  let isMappingsEqual =
    mappings.length === mappingsCopy.length && !mappingsDiff.length;

  if (isMappingsEqual) {
    const lookupsDiff = differenceWith(lookupsCopy, lookups, isEqual);

    isMappingsEqual =
      lookupsCopy.length === lookups.length && !lookupsDiff.length;
  }

  return !isMappingsEqual;
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

import produce from 'immer';
import {differenceWith, isEqual } from 'lodash';
import shortid from 'shortid';
import actionTypes from '../../../../actions/types';
import { getSuiteScriptAppType, isMappingObjEqual } from '../../../../utils/suiteScript/mapping';

const { deepClone } = require('fast-json-patch');

const emptyObj = {};
const emptySet = [];

export default (state = {}, action) => {
  const {
    ssLinkedConnectionId,
    integrationId,
    flowId,
    type,
    key,
    shiftIndex,
    oldValue,
    newValue,
    value,
    field,
    lookups = emptySet,
    subRecordFields,
    options = emptyObj,
    mappings,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.MAPPING.INIT:
        if (!draft.mapping) {
          draft.mapping = {};
        }
        draft.mapping.status = 'requested';
        break;
      case actionTypes.SUITESCRIPT.MAPPING.INIT_COMPLETE:
      {
        /**
         * options = {
         * importType,
         * exportType,
         * connectionId,
         * recordType, // in case of netsuite import
         * sObjectType // in case of salesforce import
         * }
         */

        const _mappings = mappings.map(m => ({...m, key: shortid.generate()}));

        draft.mapping = {
          mappings: _mappings,
          mappingsCopy: deepClone(_mappings),
          lookups,
          lookupsCopy: deepClone(lookups),
          ssLinkedConnectionId,
          integrationId,
          subRecordFields,
          flowId,
          status: 'received',
          ...options,
        };
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.INIT_FAILED:
        draft.mapping = {
          status: 'error',
        };
        break;
      case actionTypes.SUITESCRIPT.MAPPING.DELETE: {
        const mappingToDelete = draft.mapping.mappings.find(m => m.key === key);

        if (mappingToDelete) {
          if (mappingToDelete.lookupName) {
            // delete lookup
            draft.mapping.lookups = draft.mapping.lookups.filter(l => l.name !== mappingToDelete.lookupName);
          }
          draft.mapping.mappings = draft.mapping.mappings.filter(m => m.key !== key);
          if (draft.mapping.lastModifiedRowKey === key) { delete draft.mapping.lastModifiedRowKey; }
        }

        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          const mapping = draft.mapping.mappings[index];

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

            if (value.indexOf('[*].') === -1 && 'isKey' in mapping) {
              delete mapping.isKey;
            }
          }

          draft.mapping.mappings[index] = mapping;
          draft.mapping.lastModifiedRowKey = mapping.key;
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
          draft.mapping.mappings.push(newRow);
          draft.mapping.lastModifiedRowKey = newKey;
        }

        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_SETTINGS: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          const mapping = draft.mapping.mappings[index];

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
          draft.mapping.mappings[index] = mapping;
          draft.mapping.lastModifiedRowKey = key;
        }

        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.SHIFT_ORDER: {
        const itemIndex = draft.mapping.mappings.findIndex(m => m.key === key);
        const [removed] = draft.mapping.mappings.splice(itemIndex, 1);

        draft.mapping.mappings.splice(shiftIndex, 0, removed);
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.UPDATE_LOOKUP:
        if (oldValue?.name) {
          draft.mapping.lookups = draft.mapping.lookups.filter(l => l.name !== oldValue.name);
        }
        if (newValue) {
          draft.mapping.lookups.push(newValue);
        }
        break;
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_INCOMPLETE_GENERATES:
        if (!draft.mapping) {
          break;
        }
        if (draft.mapping.incompleteGenerates) {
          const incompleteGeneObj = draft.mapping.incompleteGenerates.find(
            gen => gen.key === key
          );

          if (incompleteGeneObj) {
            incompleteGeneObj.value = value;
          } else {
            draft.mapping.incompleteGenerates.push({ key, value });
          }
        } else {
          draft.mapping.incompleteGenerates = [{ key, value }];
        }
        break;
      case actionTypes.SUITESCRIPT.MAPPING.UPDATE_MAPPINGS: {
        const { mappings } = action;

        draft.mapping.mappings = mappings;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.CLEAR:
        delete draft.mapping;
        break;
      case actionTypes.SUITESCRIPT.MAPPING.SAVE:
        draft.mapping.saveStatus = 'requested';
        break;
      case actionTypes.SUITESCRIPT.MAPPING.SAVE_COMPLETE:
        draft.mapping.saveStatus = 'completed';
        draft.mapping.validationErrMsg = undefined;
        draft.mapping.mappingsCopy = deepClone(draft.mapping.mappings);
        draft.mapping.lookupsCopy = deepClone(draft.mapping.lookups);
        break;
      case actionTypes.SUITESCRIPT.MAPPING.SAVE_FAILED:
        draft.mapping.saveStatus = 'failed';
        draft.mapping.validationErrMsg = undefined;
        break;
      case actionTypes.SUITESCRIPT.MAPPING.UPDATE_LAST_TOUCHED_FIELD: {
        draft.mapping.lastModifiedRowKey = key || 'new';
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.SET_SF_SUBLIST_FIELD_NAME: {
        draft.mapping.sfSubListExtractFieldName = value;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_EXTRACT_LIST: {
        const extractList = deepClone(value);

        if (Array.isArray(extractList) && extractList.length) {
          const key = draft.mapping.lastModifiedRowKey;

          if (key) {
            const index = draft.mapping.mappings.findIndex(m => m.key === key);

            if (index !== -1) {
              const [extract] = extractList;

              draft.mapping.mappings[index].extract = extract;
              draft.mapping.mappings[index].rowIdentifier += 1;
              extractList.splice(0, 1);
            }
            let positionToInsert = index + 1;

            extractList.forEach(ext => {
              const newMapping = {
                extract: ext,
                rowIdentifier: 0,
                key: shortid.generate(),
              };

              draft.mapping.mappings.splice(positionToInsert, 0, newMapping);
              positionToInsert += 1;
            });
          } else {
            let positionToInsert = draft.mapping.mappings.length;

            extractList.forEach(ext => {
              const newMapping = {
                extract: ext,
                rowIdentifier: 0,
                key: shortid.generate(),
              };

              draft.mapping.mappings.splice(positionToInsert, 0, newMapping);
              positionToInsert += 1;
            });
          }
        }
        delete draft.mapping.sfSubListExtractFieldName;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.SET_VALIDATION_MSG:
        if (draft.mapping) {
          draft.mapping.validationErrMsg = value;
        }
        break;

      default:
    }
  });
};

export const selectors = {};

selectors.suiteScriptMapping = state => {
  if (!state || !state.mapping) {
    return emptyObj;
  }

  return state.mapping;
};

selectors.suiteScriptMappingChanged = state => {
  if (!state || !state.mapping) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy,
  } = state.mapping;
  let isMappingsChanged = mappings.length !== mappingsCopy.length;

  // change of order of mappings is treated as Mapping change
  for (let i = 0; i < mappings.length && !isMappingsChanged; i += 1) {
    isMappingsChanged = !isMappingObjEqual(mappings[i], mappingsCopy[i]);
  }

  if (!isMappingsChanged) {
    const lookupsDiff = differenceWith(lookupsCopy, lookups, isEqual);

    isMappingsChanged =
      lookupsCopy.length !== lookups.length || lookupsDiff.length;
  }

  return !!isMappingsChanged;
};
selectors.suiteScriptMappingSaveStatus = state => {
  if (!state || !state.mapping) {
    return emptyObj;
  }

  const { saveStatus } = state.mapping;

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
};

selectors.suitesciptMappingExtractGenerateLabel = state => {
  const {exportType, importType} = state.mapping;
  const extract = `Source Record Field ${getSuiteScriptAppType(exportType) ? `(${getSuiteScriptAppType(exportType)})` : ''}`;
  const generate = `Import Field ${getSuiteScriptAppType(importType) ? `(${getSuiteScriptAppType(importType)})` : ''}`;

  return {extract, generate};
};


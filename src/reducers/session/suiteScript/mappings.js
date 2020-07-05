import produce from 'immer';
import {differenceWith, isEqual } from 'lodash';
import shortid from 'shortid';
import actionTypes from '../../../actions/types';
import suiteScriptMappingUtil from '../../../utils/suiteScriptMapping';

const { deepClone } = require('fast-json-patch');

const emptyObj = {};

export default (state = {}, action) => {
  const { ssLinkedConnectionId, integrationId, flowId, type } = action;

  return produce(state, draft => {
    switch (type) {
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
        const { generatedMappings, lookups, options = {} } = action;

        const formattedMappings = generatedMappings.map(m => ({...m,
          rowIdentifier: 0,
          key: shortid.generate(),
        }));
        draft.mappings = {
          mappings: formattedMappings,
          mappingsCopy: deepClone(formattedMappings),
          lookups,
          lookupsCopy: lookups,
          changeIdentifier: 0,
          ssLinkedConnectionId,
          integrationId,
          flowId,
          status: 'success',
          ...options
        };
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.CHANGE_ORDER: {
        const { mappings } = action;
        draft.mappings.mappings = mappings;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.DELETE: {
        const { key } = action;

        draft.mappings.changeIdentifier += 1;
        const filteredMapping = draft.mappings.mappings.filter(m => m.key !== key);

        draft.mappings.mappings = filteredMapping;

        if (draft.mappings.lastModifiedRowKey === key) delete draft.mappings.lastModifiedRowKey;

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = suiteScriptMappingUtil.validateMappings(draft.mappings.mappings, draft.mappings.lookups);

        draft.mappings.validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD: {
        const {key, field, value} = action;

        draft.mappings.changeIdentifier += 1;
        const index = draft.mappings.mappings.findIndex(m => m.key === key);

        if (draft.mappings.mappings[index]) {
          const objCopy = { ...draft.mappings.mappings[index] };

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

            // if (
            //   !mappingUtil.isCsvOrXlsxResource(draft.mappings.resource) &&
            //   inputValue.indexOf('[*].') === -1
            // ) {
            //   if ('isKey' in objCopy) {
            //     delete objCopy.isKey;
            //   }

            //   if ('useFirstRow' in objCopy) {
            //     delete objCopy.useFirstRow;
            //   }
            // }
          }

          draft.mappings.mappings[index] = objCopy;
          draft.mappings.lastModifiedRowKey = objCopy.key;
        } else if (value) {
          const newKey = shortid.generate();

          draft.mappings.mappings.push({
            [field]: value,
            rowIdentifier: 0,
            key: newKey,
          });
          draft.mappings.lastModifiedRowKey = newKey;
        }

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = suiteScriptMappingUtil.validateMappings(draft.mappings.mappings, draft.mappings.lookups);

        draft.mappings.validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_SETTINGS: {
        const { settings, key: rowKey } = action;
        // ssLinkedConnectionId, integrationId, flowId, key, settings
        draft.mappings.changeIdentifier += 1;
        const index = draft.mappings.mappings.findIndex(m => m.key === rowKey);

        if (draft.mappings.mappings[index]) {
          const {
            generate,
            extract,
            rowIdentifier,
            key,
          } = draft.mappings.mappings[index];
          const valueTmp = {
            generate,
            extract,
            rowIdentifier,
            key,
          };

          Object.assign(valueTmp, settings);

          // removing lookups
          if (!settings.lookupName) {
            delete valueTmp.lookupName;
          }

          valueTmp.rowIdentifier += 1;

          if ('hardCodedValue' in valueTmp) {
            // wrap anything expect '' and null ,

            if (valueTmp.hardCodedValue && valueTmp.hardCodedValue.length) valueTmp.hardCodedValueTmp = `"${valueTmp.hardCodedValue}"`;
            delete valueTmp.extract;
          }

          draft.mappings.mappings[index] = { ...valueTmp };
          draft.mappings.lastModifiedRowKey = key;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = suiteScriptMappingUtil.validateMappings(
            draft.mappings.mappings,
            draft.mappings.lookups
          );

          draft.mappings.validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }
        break;
      }

      case actionTypes.SUITESCRIPT.MAPPING.UPDATE_LOOKUPS:
      {
        const { lookups } = action;
        draft.mappings.lookups = lookups;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = suiteScriptMappingUtil.validateMappings(draft.mappings.mappings, draft.mappings.lookups);

        draft.mappings.validationErrMsg = isSuccess ? undefined : validationErrMsg;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_INCOMPLETE_GENERATES: {
        const { key, value } = action;
        draft.mappings.changeIdentifier += 1;
        if (!draft.mappings.incompleteGenerates) {
          draft.mappings.incompleteGenerates = [];
        }

        const incompleteGeneObj = draft.mappings.incompleteGenerates.find(
          gen => gen.key === key
        );

        if (incompleteGeneObj) {
          incompleteGeneObj.value = value;
        } else {
          draft.mappings.incompleteGenerates.push({ key, value });
        }

        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.UPDATE_MAPPINGS: {
        const { mappings } = action;
        draft.mappings.changeIdentifier += 1;
        draft.mappings.mappings = mappings;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.CLEAR: {
        Object.keys(draft).forEach(key => {
          delete draft[key];
        });
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.SAVE:
        draft.mappings.saveStatus = 'requested';
        break;
      case actionTypes.SUITESCRIPT.MAPPING.SAVE_COMPLETE:
        draft.mappings.saveStatus = 'completed';
        draft.mappings.validationErrMsg = undefined;
        draft.mappings.mappingsCopy = deepClone(draft.mappings.mappings);
        draft.mappings.lookupsCopy = deepClone(draft.mappings.lookups);
        break;
      case actionTypes.SUITESCRIPT.MAPPING.SAVE_FAILED:
        draft.mappings.saveStatus = 'failed';
        draft.mappings.validationErrMsg = undefined;
        break;
      case actionTypes.SUITESCRIPT.MAPPING.UPDATE_LAST_TOUCHED_FIELD: {
        const { key } = action;
        draft.mappings.lastModifiedRowKey = key;
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.SET_SF_SUBLIST_FIELD_NAME: {
        const { value } = action;
        draft.mappings.sfSubListExtractFieldName = value;

        if (!value) {
          const key = draft.mappings.lastModifiedRowKey;
          if (key) {
            const index = draft.mappings.mappings.findIndex(m => m.key === key);
            draft.mappings.mappings[index].rowIdentifier += 1;
          } else {
            draft.mappings.changeIdentifier += 1;
          }
        }
        break;
      }
      case actionTypes.SUITESCRIPT.MAPPING.PATCH_EXTRACT_LIST: {
        const { value } = action;
        const extractList = deepClone(value);
        if (Array.isArray(extractList) && extractList.length) {
          const key = draft.mappings.lastModifiedRowKey;
          if (key) {
            const index = draft.mappings.mappings.findIndex(m => m.key === key);
            if (index !== -1) {
              const [extract] = extractList;
              draft.mappings.mappings[index].extract = extract;
              draft.mappings.mappings[index].rowIdentifier += 1;
              extractList.splice(0, 1);
            }
            let positionToInsert = index + 1;
            extractList.forEach(ext => {
              const newMapping = {
                extract: ext,
                rowIdentifier: 0,
                key: shortid.generate(),
              };
              draft.mappings.mappings.splice(positionToInsert, 0, newMapping);
              positionToInsert += 1;
            });
          } else {
            let positionToInsert = draft.mappings.mappings.length;
            extractList.forEach(ext => {
              const newMapping = {
                extract: ext,
                rowIdentifier: 0,
                key: shortid.generate(),
              };
              draft.mappings.mappings.splice(positionToInsert, 0, newMapping);
              positionToInsert += 1;
            });
          }
          draft.mappings.changeIdentifier += 1;
        }
        delete draft.mappings.sfSubListExtractFieldName;
        break;
      }

      default:
    }
  });
};

const isMappingObjEqual = (mapping1, mapping2) => {
  const {
    rowIdentifier: r1,
    key: key1,
    ...formattedMapping1
  } = mapping1;
  const {
    rowIdentifier: r2,
    key: key2,
    ...formattedMapping2
  } = mapping2;

  return isEqual(formattedMapping1, formattedMapping2);
};

export function mappingState(state) {
  if (!state || !state.mappings) {
    return emptyObj;
  }
  return state.mappings;
}

export function mappingsChanged(state) {
  if (!state || !state.mappings) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy
  } = state.mappings;
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

  return isMappingsChanged;
}
export function mappingsSaveStatus(state) {
  if (!state || !state.mappings) {
    return emptyObj;
  }

  const { saveStatus } = state.mappings;

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
}

import produce from 'immer';
import {differenceWith, isEqual } from 'lodash';
import shortid from 'shortid';
import actionTypes from '../../../actions/types';
import suiteScriptMappingUtil from '../../../utils/suiteScriptMapping';

const { deepClone } = require('fast-json-patch');

const emptyObj = {};

export default function reducer(state = {}, action) {
  const { ssLinkedConnectionId, integrationId, flowId, type } = action;
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT_MAPPING.INIT_COMPLETE:
      {
        const { generatedMappings, lookups } = action;

        const formattedMappings = generatedMappings.map(m => ({...m,
          rowIdentifier: 0,
          key: shortid.generate(),
        }));
        draft[id] = {
          mappings: formattedMappings,
          mappingsCopy: deepClone(formattedMappings),
          lookups,
          lookupsCopy: lookups,
          changeIdentifier: 0,
          status: 'success'
        };
        break;
      }
      case actionTypes.SUITESCRIPT_MAPPING.CHANGE_ORDER: {
        const { mappings } = action;
        const key = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
        draft[key].mappings = mappings;
        break;
      }
      case actionTypes.SUITESCRIPT_MAPPING.DELETE: {
        const { key } = action;

        draft[id].changeIdentifier += 1;
        const filteredMapping = draft[id].mappings.filter(m => m.key !== key);

        draft[id].mappings = filteredMapping;

        if (draft[id].lastModifiedKey === key) draft[id].lastModifiedKey = '';

        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = suiteScriptMappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }
      case actionTypes.SUITESCRIPT_MAPPING.PATCH_FIELD: {
        const {key, field, value} = action;

        draft[id].changeIdentifier += 1;
        const index = draft[id].mappings.findIndex(m => m.key === key);

        if (draft[id].mappings[index]) {
          const objCopy = { ...draft[id].mappings[index] };

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
            //   !mappingUtil.isCsvOrXlsxResource(draft[id].resource) &&
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

          draft[id].mappings[index] = objCopy;
        } else if (value) {
          draft[id].mappings.push({
            [field]: value,
            rowIdentifier: 0,
            key: shortid.generate(),
          });
        }

        draft[id].lastModifiedKey = key;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = suiteScriptMappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }
      case actionTypes.SUITESCRIPT_MAPPING.PATCH_SETTINGS: {
        const { settings, key: rowKey } = action;
        // ssLinkedConnectionId, integrationId, flowId, key, settings
        draft[id].changeIdentifier += 1;
        const index = draft[id].mappings.findIndex(m => m.key === rowKey);

        if (draft[id].mappings[index]) {
          const {
            generate,
            extract,
            isNotEditable,
            isRequired,
            rowIdentifier,
            key,
          } = draft[id].mappings[index];
          const valueTmp = {
            generate,
            extract,
            isNotEditable,
            isRequired,
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

          draft[id].mappings[index] = { ...valueTmp };
          draft[id].lastModifiedKey = key;
          const {
            isSuccess,
            errMessage: validationErrMsg,
          } = suiteScriptMappingUtil.validateMappings(
            draft[id].mappings,
            draft[id].lookups
          );

          draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        }
        break;
      }

      case actionTypes.SUITESCRIPT_MAPPING.UPDATE_LOOKUPS:
      {
        const { lookups } = action;
        draft[id].lookups = lookups;
        const {
          isSuccess,
          errMessage: validationErrMsg,
        } = suiteScriptMappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;
        break;
      }

      case actionTypes.SUITESCRIPT_MAPPING.SAVE:
        draft[id].saveStatus = 'requested';
        break;
      case actionTypes.SUITESCRIPT_MAPPING.SAVE_COMPLETE:
        draft[id].saveStatus = 'completed';
        draft[id].validationErrMsg = undefined;
        draft[id].mappingsCopy = deepClone(draft[id].mappings);
        draft[id].lookupsCopy = deepClone(draft[id].lookups);

        break;
      case actionTypes.SUITESCRIPT_MAPPING.SAVE_FAILED:
        draft[id].saveStatus = 'failed';
        draft[id].validationErrMsg = undefined;

        break;

      default:
    }
  });
}

const isMappingObjEqual = (mapping1, mapping2) => {
  const {
    rowIdentifier: r1,
    key: key1,
    isNotEditable: e1,
    isRequired: req1,
    ...formattedMapping1
  } = mapping1;
  const {
    rowIdentifier: r2,
    key: key2,
    isNotEditable: e2,
    isRequired: req2,
    ...formattedMapping2
  } = mapping2;

  return isEqual(formattedMapping1, formattedMapping2);
};

export function mappings(state, {ssLinkedConnectionId, integrationId, flowId }) {
  if (!state || !ssLinkedConnectionId || !integrationId || !flowId) {
    return emptyObj;
  }
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
  return state[id] || emptyObj;
}

export function mappingsChanged(state, {ssLinkedConnectionId, integrationId, flowId}) {
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
  if (!state || !ssLinkedConnectionId || !integrationId || !flowId || !state[id]) {
    return false;
  }

  const { mappings, mappingsCopy, lookups, lookupsCopy
  } = state[id];
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
export function mappingsSaveStatus(state, {ssLinkedConnectionId, integrationId, flowId }) {
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;

  if (!state || !ssLinkedConnectionId || !integrationId || !flowId || !state[id]) {
    return emptyObj;
  }

  const { saveStatus } = state[id];

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
}

// import shortid from 'shortid';
import produce from 'immer';
// import { differenceWith, isEqual } from 'lodash';
import shortid from 'shortid';
import actionTypes from '../../../actions/types';
// import mappingUtil from '../../../utils/mapping';
// import lookupUtil from '../../../utils/lookup';

// const { deepClone } = require('fast-json-patch');

const emptySet = [];
// const emptyObj = {};

export default function reducer(state = {}, action) {
  const { ssLinkedConnectionId, integrationId, flowId, type } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT_MAPPING.INIT_COMPLETE:
      {
        const { generatedMappings } = action;
        const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
        draft[id] = {
          mappings: generatedMappings.map(m => ({
            ...m,
            rowIdentifier: 0,
            key: shortid.generate(),
          })),
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
        const {key} = action;
        const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;

        draft[id].changeIdentifier += 1;
        const filteredMapping = draft[id].mappings.filter(m => m.key !== key);

        draft[id].mappings = filteredMapping;

        if (draft[id].lastModifiedKey === key) draft[id].lastModifiedKey = '';

        // const {
        //   isSuccess,
        //   errMessage: validationErrMsg,
        // } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        // draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }
      case actionTypes.SUITESCRIPT_MAPPING.PATCH_FIELD: {
        const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
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

        // draft[id].lastModifiedKey = key;
        // const {
        //   isSuccess,
        //   errMessage: validationErrMsg,
        // } = mappingUtil.validateMappings(draft[id].mappings, draft[id].lookups);

        // draft[id].validationErrMsg = isSuccess ? undefined : validationErrMsg;

        break;
      }
      default:
    }
  });
}
export function mappings(state, {ssLinkedConnectionId, integrationId, flowId }) {
  if (!state || !ssLinkedConnectionId || !integrationId || !flowId) {
    return emptySet;
  }
  const key = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
  return state[key] || emptySet;
}

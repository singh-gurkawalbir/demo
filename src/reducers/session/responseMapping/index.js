import produce from 'immer';
import { isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import PATCH_SAVE_STATUS from '../../../constants/patchSaveStatus';

const { deepClone } = require('fast-json-patch');

const emptySet = [];

// TODO: Support error message display
export default function reducer(state = {}, action) {
  const { id, type, index, field, value } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    switch (type) {
      case actionTypes.RESPONSE_MAPPING.INIT: {
        const { resourceIndex, flowId } = value;

        draft[id] = {
          mappings: [],
          mappingsCopy: [],
          changeIdentifier: 0,
          resourceIndex,
          flowId,
        };

        break;
      }

      case actionTypes.RESPONSE_MAPPING.SET_FORMATTED_MAPPING: {
        const _tmp = value.map(m => ({
          ...m,
          rowIdentifier: 0,
        }));

        if (draft[id]) {
          draft[id].mappings = _tmp;
          draft[id].mappingsCopy = deepClone(_tmp);
          draft[id].changeIdentifier += 1;
        }

        break;
      }

      case actionTypes.RESPONSE_MAPPING.PATCH_FIELD: {
        if (draft[id].mappings[index]) {
          const { rowIdentifier } = draft[id].mappings[index];

          draft[id].mappings[index] = {
            ...draft[id].mappings[index],
            [field]: value,
            rowIdentifier: rowIdentifier + 1,
          };
        } else if (value) {
          draft[id].mappings.push({ [field]: value, rowIdentifier: 0 });
        }

        break;
      }

      case actionTypes.RESPONSE_MAPPING.DELETE: {
        draft[id].mappings.splice(index, 1);
        draft[id].changeIdentifier += 1;
        break;
      }

      case actionTypes.RESPONSE_MAPPING.SAVE:
        draft[id].saveStatus = PATCH_SAVE_STATUS.REQUESTED;
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE_COMPLETE:
        draft[id].saveStatus = PATCH_SAVE_STATUS.COMPLETED;
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE_FAILED:
        draft[id].saveStatus = PATCH_SAVE_STATUS.FAILED;
        break;

      default:
    }
  });
}

// #region PUBLIC SELECTORS
export function getResponseMapping(state, id) {
  if (!state || !state[id]) {
    return emptySet;
  }

  return state[id];
}

// #region PUBLIC SELECTORS
export function responseMappingDirty(state, id) {
  if (!state || !state[id]) {
    return false;
  }

  // Response Mapping
  const { mappings, mappingsCopy } = state[id];
  let isDirty = false;

  isDirty = mappings.length !== mappingsCopy.length;

  // if length doesn't match return right away
  if (isDirty) return true;

  for (let i = 0; i < mappings.length && !isDirty; i += 1) {
    const { rowIdentifier, ..._mapping } = mappings[i];

    isDirty = !isEqual(_mapping, mappingsCopy[i]);
  }

  return isDirty;
}

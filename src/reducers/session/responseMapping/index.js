import produce from 'immer';
import { isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import responseMappingUtil from '../../../utils/responseMapping';

const { deepClone } = require('fast-json-patch');

const emptySet = [];
const emptyObj = {};

// TODO: Support error message display
export default function reducer(state = {}, action) {
  const { id, type, index, field, value } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    switch (type) {
      case actionTypes.RESPONSE_MAPPING.INIT: {
        const {
          responseMapping,
          resourceIndex,
          resourceType,
          pageProcessor,
          resource,
          flowId,
        } = value;
        const formattedResponseMapping = responseMappingUtil.getFieldsAndListMappings(
          responseMapping
        );

        draft[id] = {
          mappings: formattedResponseMapping.map(m => ({
            ...m,
            rowIdentifier: 0,
          })),
          changeIdentifier: 0,
          resourceIndex,
          resourceType,
          mappingsCopy: deepClone(formattedResponseMapping),
          pageProcessor,
          resource,
          flowId,
        };

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
        draft[id].saveStatus = 'requested';
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE_COMPLETE:
        draft[id].saveStatus = 'completed';
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE_FAILED:
        draft[id].saveStatus = 'failed';
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

  let isDirty = false;
  // Response Mapping
  const { mappings, mappingsCopy } = state[id];

  isDirty = mappings.length !== mappingsCopy.length;

  for (let i = 0; i < mappings.length && !isDirty; i += 1) {
    const { rowIdentifier, ..._mapping } = mappings[i];

    isDirty = !isEqual(_mapping, mappingsCopy[i]);
  }

  return isDirty;
}

export function responseMappingSaveStatus(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const { saveStatus } = state[id];

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
}

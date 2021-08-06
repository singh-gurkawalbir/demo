import produce from 'immer';
import { isEqual } from 'lodash';
import shortid from 'shortid';
import deepClone from 'lodash/cloneDeep';
import actionTypes from '../../../actions/types';

const emptyObj = {};
// TODO: Support error message display
export default function reducer(state = {}, action) {
  const {
    type,
    mappings,
    flowId,
    resourceId,
    resourceType,
    field,
    value,
    key,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESPONSE_MAPPING.INIT:
        if (!draft.mapping) draft.mapping = {};
        draft.mapping.status = 'requested';
        break;
      case actionTypes.RESPONSE_MAPPING.INIT_COMPLETE:
        draft.mapping = {
          mappings,
          flowId,
          resourceId,
          resourceType,
          status: 'received',
          mappingsCopy: deepClone(mappings),
        };
        break;
      case actionTypes.RESPONSE_MAPPING.INIT_FAILED:
        draft.mapping = {
          status: 'error',
        };
        break;
      case actionTypes.RESPONSE_MAPPING.PATCH_FIELD: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          draft.mapping.mappings[index][field] = value;
        } else if (value) {
          const newKey = shortid.generate();
          const newRow = {
            key: newKey,
          };

          newRow[field] = value;
          draft.mapping.mappings.push(newRow);
        }
        break;
      }
      case actionTypes.RESPONSE_MAPPING.DELETE:
        draft.mapping.mappings = draft.mapping.mappings.filter(m => m.key !== key);
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE:
        if (draft.mapping) {
          draft.mapping.saveStatus = 'requested';
        }
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE_COMPLETE:
        if (draft.mapping) {
          draft.mapping.saveStatus = 'completed';
          draft.mapping.mappingsCopy = deepClone(draft.mapping.mappings);
        }
        break;
      case actionTypes.RESPONSE_MAPPING.SAVE_FAILED:
        if (draft.mapping) {
          draft.mapping.saveStatus = 'failed';
          draft.mapping.validationErrMsg = undefined;
        }
        break;

      default:
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.responseMapping = state => {
  if (!state || !state.mapping) {
    return emptyObj;
  }

  return state.mapping;
};

// #region PUBLIC SELECTORS
selectors.responseMappingChanged = state => {
  if (!state || !state.mapping) {
    return false;
  }
  const { mappings, mappingsCopy } = state.mapping;
  const _mappings = mappings.map(({ key, ...other }) => other);
  const _mappingsCopy = mappingsCopy.map(
    ({ key, ...other }) => other
  );

  return !isEqual(_mappings, _mappingsCopy);
};

selectors.responseMappingSaveStatus = state => {
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

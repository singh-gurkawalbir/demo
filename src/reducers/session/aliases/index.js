import { produce } from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const {
    type,
    resourceId,
    aliases,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_ALIASES: {
        draft[resourceId] = aliases;
        break;
      }

      case actionTypes.RESOURCE.CLEAR_ALIASES: {
        delete draft[resourceId];

        break;
      }

      default:
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.allAliases = (state, resourceId) => {
  if (!state) return emptyObj;

  return state[resourceId] || emptyObj;
};

// #endregion

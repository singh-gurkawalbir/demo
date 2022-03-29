import { produce } from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const {
    type,
    id,
    aliases,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_ALIASES: {
        draft[id] = aliases;
        break;
      }

      case actionTypes.RESOURCE.CLEAR_ALIASES: {
        delete draft[id];

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

  return (state[resourceId] || emptyObj).map(aliasData => ({ _id: aliasData.alias, ...aliasData}));
};

// #endregion

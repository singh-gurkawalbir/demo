import { produce } from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { emptyList } from '../../../utils/constants';

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

selectors.allAliases = createSelector(
  (state, resourceId) => state && state[resourceId],
  aliases => {
    if (!aliases) return emptyList;

    return aliases.map(aliasData => ({ _id: aliasData.alias, ...aliasData}));
  },
);

// #endregion

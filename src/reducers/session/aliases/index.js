import { produce } from 'immer';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const {
    type,
    id,
    aliases,
    aliasId,
    status,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_ALIASES: {
        draft[id] = {
          aliases,
        };
        break;
      }

      case actionTypes.RESOURCE.ALIAS_ACTION_STATUS: {
        draft[id] = {
          aliasId,
          status,
        };
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

selectors.aliasActionStatus = (state, id) => state?.[id]?.status;

selectors.savedAliasId = (state, id) => state?.[id]?.aliasId;
// #endregion

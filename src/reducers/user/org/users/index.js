import actionTypes from '../../../../actions/types';
import { USER_ACCESS_LEVELS } from '../../../../utils/constants';

export default (state = [], action) => {
  const { type, resourceType, collection, user, _id } = action;

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION:
      if (resourceType === 'ashares') {
        return collection ? [...collection] : [];
      }

      return state;
    case actionTypes.USER_CREATED:
      return [...state, user];
    case actionTypes.USER_UPDATED: {
      const index = state.findIndex(u => u._id === user._id);

      if (index === -1) {
        return [...state, user];
      }

      return [
        ...state.slice(0, index),
        {
          ...state[index],
          ...user,
        },
        ...state.slice(index + 1),
      ];
    }

    case actionTypes.USER_DISABLED: {
      const index = state.findIndex(u => u._id === _id);

      if (index === -1) {
        return state;
      }

      return [
        ...state.slice(0, index),
        {
          ...state[index],
          disabled: !state[index].disabled,
        },
        ...state.slice(index + 1),
      ];
    }

    case actionTypes.USER_DELETED: {
      const index = state.findIndex(u => u._id === _id);

      if (index > -1) {
        return [...state.slice(0, index), ...state.slice(index + 1)];
      }

      return state;
    }

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS

export function list(state) {
  if (!state || !state.length) {
    return [];
  }

  const aShares = state.map(share => ({
    ...share,
    accessLevel: share.accessLevel || USER_ACCESS_LEVELS.TILE,
  }));

  return aShares;
}

// #endregion

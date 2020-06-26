import actionTypes from '../../../../actions/types';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../utils/constants';

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

export function integrationUsers(state, integrationId) {
  if (!state || !state.length) {
    return [];
  }

  const aShares = list(state);
  const integrationUsers = [];
  let integrationAccessLevel;

  aShares.forEach(u => {
    if (u.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MANAGE) {
      integrationUsers.push({
        ...u,
        accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
        integrationAccessLevel: undefined,
      });
    } else if ([USER_ACCESS_LEVELS.ACCOUNT_MONITOR, USER_ACCESS_LEVELS.TILE].includes(u.accessLevel)) {
      integrationAccessLevel = u.integrationAccessLevel && u.integrationAccessLevel.find(
        ial => ial._integrationId === integrationId
      );
      if (integrationAccessLevel) {
        integrationAccessLevel = integrationAccessLevel.accessLevel;
      }
      if (!integrationAccessLevel && u.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR) {
        integrationAccessLevel = INTEGRATION_ACCESS_LEVELS.MONITOR;
      }

      if (integrationAccessLevel) {
        integrationUsers.push({
          ...u,
          accessLevel: integrationAccessLevel,
          integrationAccessLevel: undefined,
        });
      }
    }
  });

  return integrationUsers;
}

// #endregion

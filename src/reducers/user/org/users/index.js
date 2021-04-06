import { createSelector } from 'reselect';
import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../utils/constants';
import { COMM_STATES as REINVITE_STATES } from '../../../comms/networkComms';

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
    case actionTypes.USER_REINVITE:
    {
      const index = state.findIndex(u => u._id === _id);

      if (index > -1) {
        return produce(state, draft => {
          draft[index].reinviteStatus = REINVITE_STATES.LOADING;
        });
      }

      return state;
    }

    case actionTypes.USER_REINVITE_ERROR: {
      const index = state.findIndex(u => u._id === _id);

      if (index > -1) {
        return produce(state, draft => {
          draft[index].reinviteStatus = REINVITE_STATES.ERROR;
        });
      }

      return state;
    }
    case actionTypes.USER_UPDATED: {
      const index = state.findIndex(u => u._id === user._id);

      if (index === -1) {
        return [...state, user];
      }
      if (index > -1) {
        return produce(state, draft => {
          draft[index] = {...draft[index], ...user};
        });
      }

      return state;
    }

    case actionTypes.USER_DISABLED: {
      const index = state.findIndex(u => u._id === _id);

      if (index > -1) {
        return produce(state, draft => {
          draft[index].disabled = !draft[index].disabled;
        });
      }

      return state;
    }
    case actionTypes.USER_REINVITED: {
      const index = state.findIndex(u => u._id === _id);

      if (index > -1) {
        return produce(state, draft => {
          draft[index].dismissed = false;
          draft[index].reinviteStatus = REINVITE_STATES.SUCCESS;
        });
      }

      return state;
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
export const selectors = {};

selectors.usersList = createSelector(
  state => state,
  state => {
    if (!state || !state.length) {
      return [];
    }

    const aShares = state.map(share => ({
      ...share,
      accessLevel: share.accessLevel || USER_ACCESS_LEVELS.TILE,
    }));

    return aShares;
  });

selectors.integrationUsersForOwner = (state, integrationId) => {
  if (!state || !state.length) {
    return [];
  }

  const aShares = selectors.usersList(state);
  const integrationUsers = [];
  let integrationAccessLevel;

  aShares.forEach(u => {
    if (u.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_ADMIN) {
      integrationUsers.push({
        ...u,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
        integrationAccessLevel: undefined,
      });
    } else if (u.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MANAGE) {
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
};
selectors.userReinviteStatus = (state, _id) => {
  if (!state || !state.length) {
    return null;
  }
  const index = state.findIndex(u => u._id === _id);

  return state[index]?.reinviteStatus;
};

// #endregion

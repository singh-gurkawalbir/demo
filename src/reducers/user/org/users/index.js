import { createSelector } from 'reselect';
import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  emptyList,
} from '../../../../utils/constants';
import { COMM_STATES as REINVITE_STATES } from '../../../comms/networkComms';

export default (state = [], action) => {
  const { type, resourceType, collection, user, _id } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_COLLECTION:
        if (resourceType === 'ashares') {
          return collection ? [...collection] : [];
        }

        break;
      case actionTypes.USER.CREATED:
        draft.push(user);
        break;
      case actionTypes.USER.REINVITE:
      {
        const index = draft.findIndex(u => u._id === _id);

        if (index > -1) {
          draft[index].reinviteStatus = REINVITE_STATES.LOADING;
        }

        break;
      }

      case actionTypes.USER.REINVITE_ERROR: {
        const index = draft.findIndex(u => u._id === _id);

        if (index > -1) {
          draft[index].reinviteStatus = REINVITE_STATES.ERROR;
        }

        break;
      }
      case actionTypes.USER.UPDATED: {
        const index = draft.findIndex(u => u._id === user._id);

        if (index === -1) {
          draft.push(user);
        } else if (index > -1) {
          draft[index] = {...draft[index], ...user};
        }

        break;
      }

      case actionTypes.USER.DISABLED: {
        const index = draft.findIndex(u => u._id === _id);

        if (index > -1) {
          draft[index].disabled = !draft[index].disabled;
        }

        break;
      }
      case actionTypes.USER.REINVITED: {
        const index = draft.findIndex(u => u._id === _id);

        if (index > -1) {
          draft[index].dismissed = false;
          draft[index].reinviteStatus = REINVITE_STATES.SUCCESS;
        }

        break;
      }

      case actionTypes.USER.DELETED: {
        const index = draft.findIndex(u => u._id === _id);

        if (index > -1) {
          draft.splice(index, 1);
        }

        break;
      }

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.usersList = createSelector(
  state => state,
  state => {
    if (!state || !state.length) {
      return emptyList;
    }

    const aShares = state.map(share => ({
      ...share,
      accessLevel: share.accessLevel || USER_ACCESS_LEVELS.TILE,
    }));

    return aShares;
  });

selectors.integrationUsersForOwner = createSelector(
  (_, integrationId) => integrationId,
  selectors.usersList,
  (integrationId, aShares) => {
    if (!aShares || !aShares.length) {
      return emptyList;
    }

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
  });
selectors.userReinviteStatus = (state, _id) => {
  if (!state || !state.length) {
    return null;
  }
  const index = state.findIndex(u => u._id === _id);

  return state[index]?.reinviteStatus;
};

// #endregion

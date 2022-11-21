import produce from 'immer';
import actionTypes from '../../../actions/types';

const defaultState = {};
const emptySet = [];

export default (state = defaultState, action) => {
  const { type, resourceType, collection, nextPagePath, isNextPageCollection } = action;

  if (type === actionTypes.RESOURCE.AUDIT_LOGS_CLEAR) {
    return defaultState;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.REQUEST_COLLECTION: {
        if (resourceType === 'audit' || resourceType.endsWith('/audit')) {
          if (nextPagePath) {
            draft.loadMoreStatus = 'requested';
          }
        }
        break;
      }

      case actionTypes.RESOURCE.RECEIVED_COLLECTION: {
        if (resourceType === 'audit') {
          draft.loadMoreStatus = 'received';
          draft.all = isNextPageCollection
            ? [...draft.all || [], ...collection]
            : collection || emptySet;

          break;
        }
        if (resourceType.endsWith('/audit')) {
          draft.loadMoreStatus = 'received';
          const resourceTypeParts = resourceType.split('/');

          draft[resourceTypeParts[0]] = {
            [resourceTypeParts[1]]: isNextPageCollection
              ? [...draft[resourceTypeParts[0]][resourceTypeParts[1]] || [], ...collection]
              : collection || emptySet,
          };
        }

        break;
      }

      case actionTypes.RESOURCE.AUDIT_LOGS_NEXT_PATH: {
        draft.loadMoreStatus = 'received';
        draft.nextPagePath = nextPagePath;

        break;
      }

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.auditLogs = (state, resourceType, resourceId, filters) => {
  let logs = emptySet;

  if (!state) {
    return logs;
  }

  if (resourceType && resourceId) {
    logs = state[resourceType] && state[resourceType][resourceId];
  } else {
    logs = state.all;
  }

  if (!logs) {
    logs = emptySet;
  }

  if (!filters) {
    return logs;
  }

  const filteredLogs = logs.filter(al => {
    if (filters.resourceType && filters.resourceType !== al.resourceType) {
      return false;
    }

    if (filters._resourceId && filters._resourceId !== al._resourceId) {
      return false;
    }

    if (filters.byUser && filters.byUser !== al.byUser._id) {
      return false;
    }

    if (filters.source && filters.source !== al.source) {
      return false;
    }

    if (filters.event && filters.event !== al.event) {
      return false;
    }

    return true;
  });

  return filteredLogs;
};

selectors.auditLogsNextPagePath = state => {
  if (!state) return;

  return state.nextPagePath;
};

selectors.auditLoadMoreStatus = state => {
  if (!state) return;

  return state.loadMoreStatus;
};

// #endregion

import produce from 'immer';
import actionTypes from '../../../actions/types';

const defaultState = {};
const emptySet = [];

export default (state = defaultState, action) => {
  const { type, resourceType, collection, nextPagePath, isNextPageCollection, hasMoreDownloads } = action;

  if (type === actionTypes.RESOURCE.AUDIT_LOGS_CLEAR) {
    return defaultState;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.REQUEST_AUDIT_LOGS: {
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
            ? [...(draft.all || []), ...collection]
            : collection || emptySet;

          break;
        }
        if (resourceType.endsWith('/audit')) {
          draft.loadMoreStatus = 'received';
          const resourceTypeParts = resourceType.split('/');

          draft[resourceTypeParts[0]] = {
            [resourceTypeParts[1]]: isNextPageCollection
              ? [...(draft[resourceTypeParts[0]][resourceTypeParts[1]] || []), ...collection]
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

      case actionTypes.RESOURCE.AUDIT_LOGS_HAS_MORE_DOWNLOADS: {
        draft.hasMoreDownloads = hasMoreDownloads;

        break;
      }

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.auditLogs = (state, resourceType, resourceId) => {
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

  return logs;
};

selectors.auditLogsNextPagePath = state => {
  if (!state) return;

  return state.nextPagePath;
};

selectors.auditLoadMoreStatus = state => {
  if (!state) return;

  return state.loadMoreStatus;
};

selectors.auditHasMoreDownloads = state => {
  if (!state) return false;

  return state.hasMoreDownloads;
};

// #endregion

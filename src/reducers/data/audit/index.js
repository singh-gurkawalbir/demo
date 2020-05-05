import actionTypes from '../../../actions/types';

const defaultState = {};
const emptySet = [];

export default (state = defaultState, action) => {
  const { type, resourceType, collection } = action;

  if (type === actionTypes.AUDIT_LOGS_CLEAR) {
    return defaultState;
  }

  if (!resourceType) {
    return state;
  }

  if (type === actionTypes.RESOURCE.RECEIVED_COLLECTION) {
    if (resourceType === 'audit') {
      return { all: collection || emptySet };
    } else if (resourceType.endsWith('/audit')) {
      const resourceTypeParts = resourceType.split('/');

      return {
        [resourceTypeParts[0]]: { [resourceTypeParts[1]]: collection || [] },
      };
    }
  }

  return state;
};

// #region PUBLIC SELECTORS
export function auditLogs(state, resourceType, resourceId, filters) {
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

    return true;
  });

  return filteredLogs;
}

// #endregion

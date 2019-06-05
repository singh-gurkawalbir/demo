import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceType, collection } = action;

  if (!type) {
    return state;
  }

  if (type === actionTypes.CLEAR_AUDIT_LOGS) {
    return {};
  }

  if (!resourceType) {
    return state;
  }

  if (type === actionTypes.RESOURCE.RECEIVED_COLLECTION) {
    if (resourceType === 'audit') {
      return { all: collection || [] };
    } else if (resourceType.endsWith('/audit')) {
      const modelPlural = resourceType.split('/')[0];
      const resourceId = resourceType
        .replace(`${modelPlural}/`, '')
        .replace('/audit', '');

      return { [modelPlural]: { [resourceId]: collection || [] } };
    }
  }

  return state;
};

// #region PUBLIC SELECTORS
export function auditLogs(state, resourceType, resourceId, filters) {
  let logs = [];

  if (!state) {
    return logs;
  }

  if (resourceType && resourceId) {
    logs = state[resourceType] && state[resourceType][resourceId];
  } else {
    logs = state.all;
  }

  if (!logs) {
    logs = [];
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

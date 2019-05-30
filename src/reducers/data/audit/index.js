import * as _ from 'lodash';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceType, collection } = action;

  if (!resourceType) {
    return state;
  }

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION:
      if (resourceType === 'audit') {
        return { all: collection || [] };
      } else if (
        resourceType.startsWith('integrations/') &&
        resourceType.endsWith('/audit')
      ) {
        const integrationId = resourceType
          .replace('integrations/', '')
          .replace('/audit', '');

        return { integrations: { [integrationId]: collection || [] } };
      }

      return state;

    case actionTypes.CLEAR_AUDIT_LOGS:
      return {};
    default:
      return state;
  }
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

export function affectedResources(state, resourceType, resourceId) {
  const logs = auditLogs(state, resourceType, resourceId);
  const affectedResources = {};

  logs.forEach(a => {
    if (!affectedResources[a.resourceType]) {
      affectedResources[a.resourceType] = [];
    }

    affectedResources[a.resourceType].push(a._resourceId);
  });

  Object.keys(affectedResources).forEach(resourceType => {
    affectedResources[resourceType] = _.uniq(affectedResources[resourceType]);
  });

  return affectedResources;
}

export function users(state, resourceType, resourceId) {
  const logs = auditLogs(state, resourceType, resourceId);
  const users = {};

  logs.forEach(a => {
    users[a.byUser._id] = a.byUser;
  });

  return Object.keys(users).map(id => users[id]);
}
// #endregion

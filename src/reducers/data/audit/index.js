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
export function auditLogs(state, resourceType, resourceId) {
  let logs = [];

  if (!state) {
    return logs;
  }

  if (resourceType && resourceId) {
    logs = state[resourceType] && state[resourceType][resourceId];
  } else {
    logs = state.all;
  }

  return logs || [];
}

export function affectedResources(state, resourceType, resourceId) {
  const logs = auditLogs(state, resourceType, resourceId);

  if (!logs.length) {
    return {};
  }

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

  if (!logs.length) {
    return [];
  }

  const users = {};

  logs.forEach(a => {
    users[a.byUser._id] = a.byUser;
  });

  return Object.keys(users).map(id => users[id]);
}
// #endregion

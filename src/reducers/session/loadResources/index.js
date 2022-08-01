import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { emptyList, INTEGRATION_DEPENDENT_RESOURCES } from '../../../constants';

export default (state = {}, action) => {
  const { type, integrationId, resourceType } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.COLLECTION_REQUEST_SENT:
        if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId][resourceType] = 'requested';
        } else {
          draft[resourceType] = 'requested';
        }
        break;
      case actionTypes.RESOURCE.COLLECTION_REQUEST_SUCCEEDED:
        if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId][resourceType] = 'received';
        } else {
          draft[resourceType] = 'received';
        }
        break;
      case actionTypes.RESOURCE.COLLECTION_REQUEST_FAILED:
        if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId][resourceType] = 'failed';
        } else {
          draft[resourceType] = 'failed';
        }
        break;
      default:
        return state;
    }
  });
};

export const selectors = {};

selectors.hasResourcesLoaded = (state, resourceType, integrationId) => {
  if (integrationId) {
    return state?.[integrationId]?.[resourceType] === 'received';
  }

  return state?.[resourceType] === 'received';
};

selectors.mkResourceStatus = () => createSelector(
  (_, resources) => resources,
  (state, resources, integrationId) => resources.reduce((hash, resource, index) => {
    let statusString = state?.[resource] || '';

    if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resource) && statusString !== 'received') {
      statusString = (state?.[integrationId]?.[resource] || '');
    }

    return hash + (index === 0 ? '' : '|') + statusString;
  }, ''),
  (resources, hashString) => resources.length ? hashString.split('|').map((status, index) => (
    {
      resourceType: resources[index],
      isLoading: status === 'requested',
      isReady: status === 'received',
      shouldSendRequest: !status || status === 'failed',
    }
  )) : emptyList
);

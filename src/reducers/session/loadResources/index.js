import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { emptyList, INTEGRATION_DEPENDENT_RESOURCES } from '../../../utils/constants';

export default (state = {}, action) => {
  const { type, integrationId, resourceType } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.REQUEST_COLLECTION_SENT:
        if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId][resourceType] = 'requested';
        } else {
          draft[resourceType] = 'requested';
        }
        break;
      case actionTypes.RESOURCE.COLLECTION_RECEIVED:
        if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId][resourceType] = 'received';
        } else {
          draft[resourceType] = 'received';
        }
        break;

      default:
        return state;
    }
  });
};

export const selectors = {};

selectors.mkResourceStatus = () => createSelector(
  (_, resources) => resources,
  (state, resources, integrationId) => resources.reduce((hash, resource, index) => {
    let statusString = state[resource] || '';

    if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resource) && statusString !== 'received') {
      statusString = (state[integrationId]?.[resource] || '');
    }

    return hash + (index === 0 ? '' : '|') + statusString;
  }, ''),
  (resources, hashString) => hashString ? hashString.split('|').map((status, index) => (
    {
      resourceType: resources[index],
      isLoading: status === 'requested',
      isReady: status === 'received',
      shouldSendRequest: !status,
    }
  )) : emptyList
);


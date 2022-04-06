import produce from 'immer';
import actionTypes from '../../../actions/types';
import { INTEGRATION_DEPENDENT_RESOURCES } from '../../../utils/constants';

export default (state = {}, action) => {
  const { type, integrationId, resourceType } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.REQUEST_COLLECTION:
        if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
          if (!draft[integrationId]) {
            draft[integrationId] = {};
          }
          draft[integrationId][resourceType] = 'requested';
        } else {
          draft[resourceType] = 'requested';
        }
        break;
      case actionTypes.RESOURCE.RECEIVED_COLLECTION:
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

selectors.isResourceStatusLoading = (state, integrationId, resourceType) => {
  if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
    return state[integrationId][resourceType] === 'requested';
  }

  return state[resourceType] === 'requested';
};

selectors.isResourceStatusLoaded = (state, integrationId, resourceType) => {
  if (integrationId && INTEGRATION_DEPENDENT_RESOURCES.includes(resourceType)) {
    return state[integrationId][resourceType] === 'received';
  }

  return state[resourceType] === 'received';
};

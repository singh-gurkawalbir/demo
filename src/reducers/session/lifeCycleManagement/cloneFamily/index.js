import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { integrationId, type, cloneFamily, error } = action;

  if (!integrationId) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.INTEGRATION_LCM.CLONE_FAMILY.REQUEST:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'requested';
        delete draft[integrationId].error;
        break;
      case actionTypes.INTEGRATION_LCM.CLONE_FAMILY.RECEIVED:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'received';
        draft[integrationId].cloneFamily = cloneFamily;
        delete draft[integrationId].error;
        break;
      case actionTypes.INTEGRATION_LCM.CLONE_FAMILY.RECEIVED_ERROR:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'error';
        draft[integrationId].error = error;
        break;
      case actionTypes.INTEGRATION_LCM.CLONE_FAMILY.CLEAR:
        delete draft[integrationId];
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.cloneFamily = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) return;

  return state[integrationId].cloneFamily;
};

selectors.isLoadingCloneFamily = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) return;

  return state[integrationId].status === 'requested';
};

selectors.cloneFamilyFetchError = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) return;

  return state[integrationId].error;
};


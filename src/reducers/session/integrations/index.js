import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const {
    type,
    redirectTo,
    integrationId,
  } = action;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION.CLEAR_REDIRECT:
        if (draft[integrationId]) delete draft[integrationId].redirectTo;
        break;
      case actionTypes.INTEGRATION.REDIRECT:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }

        draft[integrationId].redirectTo = redirectTo;
        break;
      case actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_FAILED:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }

        draft[integrationId].flowGroupSaveStatus = 'Failed';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.shouldRedirect = (state, integrationId) => {
  if (!state || !state[integrationId]) {
    return null;
  }

  return state[integrationId].redirectTo;
};

selectors.flowGroupSaveStatus = (state, integrationId) => {
  if (!state || !state[integrationId]) {
    return null;
  }

  return state[integrationId].flowGroupSaveStatus;
};

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
      case actionTypes.INTEGRATION.FETCH_UNLOADED_FLOWS:
        if (draft[integrationId]) {
          draft[integrationId].resolvedResources = false;
        }
        draft[integrationId] = { resolvedResources: false };
        break;
      case actionTypes.INTEGRATION.RESOLVE_UNLOADED_RESOURCES:
        if (draft[integrationId]) {
          draft[integrationId].resolvedResources = true;
        }
        draft[integrationId] = { resolvedResources: true };
        break;
      case actionTypes.INTEGRATION.CLEAR_REDIRECT:
        if (draft[integrationId]) delete draft[integrationId].redirectTo;
        break;
      case actionTypes.INTEGRATION.REDIRECT:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }

        draft[integrationId].redirectTo = redirectTo;
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

selectors.resolvedIntegrationDependencies = (state, integrationId) => {
  if (!state || !state[integrationId]) {
    return true;
  }

  return !!state[integrationId].resolvedResources;
};

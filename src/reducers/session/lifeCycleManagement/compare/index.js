
import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { integrationId, type, diff } = action;

  if (!integrationId) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.INTEGRATION_LCM.COMPARE.PULL_REQUEST:
      case actionTypes.INTEGRATION_LCM.COMPARE.REVERT_REQUEST:
      case actionTypes.INTEGRATION_LCM.COMPARE.REVISION_REQUEST:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'requested';
        break;
      case actionTypes.INTEGRATION_LCM.COMPARE.RECEIVED_DIFF:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'received';
        draft[integrationId].diff = diff;
        break;
      case actionTypes.INTEGRATION_LCM.COMPARE.TOGGLE_EXPAND_ALL:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].expandAll = !draft[integrationId].expandAll;
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.isResourceComparisonInProgress = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) {
    return false;
  }

  return state[integrationId].status === 'requested';
};

selectors.revisionResourceDiff = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) {
    return;
  }

  return state[integrationId].diff;
};

selectors.isDiffExpanded = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) {
    return false;
  }

  return !!state[integrationId].expandAll;
};

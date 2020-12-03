import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

function updateStatus(state, flowId, status) {
  return produce(state, draft => {
    if (!draft[flowId]) {
      draft[flowId] = {};
    }

    draft[flowId].status = status;
  });
}

export default (state = {}, action) => {
  const { type, resourceId, response } = action;

  if (!resourceId) { return state; }
  switch (type) {
    case actionTypes.FLOW_METRICS.REQUEST:
      return updateStatus(state, resourceId, 'requested');
    case actionTypes.FLOW_METRICS.RECEIVED:
      return produce(state, draft => {
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }

        draft[resourceId].status = 'received';
        draft[resourceId].data = response;
      });
    case actionTypes.FLOW_METRICS.FAILED:
      return updateStatus(state, resourceId, 'failed');

    case actionTypes.FLOW_METRICS.CLEAR:
      return produce(state, draft => {
        delete draft[resourceId];
      });

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.flowMetricsData = createSelector(
  state => state,
  (_, resourceId) => resourceId,
  (state, resourceId) => {
    if (!state || !state[resourceId]) {
      return null;
    }

    return state[resourceId];
  });

// #endregion

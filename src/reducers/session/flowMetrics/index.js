import produce from 'immer';
import { createSelector } from 'reselect';
import {COMM_STATES } from '../../comms/networkComms';
import actionTypes from '../../../actions/types';

function updateStatus(draft, flowId, status) {
  if (!draft[flowId]) {
    draft[flowId] = {};
  }

  draft[flowId].status = status;
}

export default (state = {}, action) => {
  const { type, resourceId, response } = action;

  if (!resourceId) { return state; }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW_METRICS.REQUEST:
        updateStatus(draft, resourceId, COMM_STATES.LOADING);
        break;
      case actionTypes.FLOW_METRICS.RECEIVED:
        updateStatus(draft, resourceId, COMM_STATES.SUCCESS);
        draft[resourceId].data = response;
        break;
      case actionTypes.FLOW_METRICS.FAILED:
        updateStatus(draft, resourceId, COMM_STATES.ERROR);
        break;

      case actionTypes.FLOW_METRICS.CLEAR:
        delete draft[resourceId];
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.flowMetricsData = createSelector(
  state => state,
  (_, resourceId) => resourceId,
  (state, resourceId) => {
    if (!state || !resourceId || !state[resourceId]) {
      return null;
    }

    return state[resourceId];
  });

// #endregion

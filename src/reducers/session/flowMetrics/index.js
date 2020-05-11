import produce from 'immer';
import actionTypes from '../../../actions/types';
import { getFlowMetrics } from '../../../utils/flowMetrics';

function updateStatus(state, flowId, status) {
  return produce(state, draft => {
    if (!draft[flowId]) {
      draft[flowId] = {};
    }

    draft[flowId].status = status;
  });
}

export default (state = {}, action) => {
  const { type, flowId, response } = action;

  switch (type) {
    case actionTypes.FLOW_METRICS.REQUEST:
      return updateStatus(state, flowId, 'requested');
    case actionTypes.FLOW_METRICS.RECEIVED:
      return produce(state, draft => {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }

        draft[flowId].status = 'received';
        draft[flowId].data = response;
      });
    case actionTypes.FLOW_METRICS.FAILED:
      return updateStatus(state, flowId, 'failed');

    case actionTypes.FLOW_METRICS.CLEAR:
      return produce(state, draft => {
        delete draft[flowId];
      });

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function flowMetricsData(state, flowId, measurement, filters) {
  if (!state || !state[flowId]) {
    return null;
  }

  return getFlowMetrics(state[flowId], measurement, filters);
}

export function flowMetricsStatus(state, flowId) {
  if (!state || !state[flowId]) {
    return null;
  }

  return state[flowId].status;
}
// #endregion

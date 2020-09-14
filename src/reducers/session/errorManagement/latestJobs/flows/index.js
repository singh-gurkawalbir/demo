import produce from 'immer';
import actionTypes from '../../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    flowId,
    // jobId,
    latestJobs,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = 'requested';
        break;
      }
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.FAILED: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = 'failed';
        break;
      }
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED: {
        draft[flowId].status = 'received';
        draft[flowId].data = latestJobs;
        break;
      }
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED_JOB_FAMILY: {
        // Update the job with the family response
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.latestJobs = (state, flowId) => {
  if (!state || !flowId || !state[flowId]) return defaultObject;

  return state[flowId];
};

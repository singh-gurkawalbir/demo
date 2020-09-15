import produce from 'immer';
import actionTypes from '../../../../../actions/types';
import { parseJobFamily } from '../../../../data/jobs/util';
import { JOB_STATUS } from '../../../../../utils/constants';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    flowId,
    latestJobs,
    job,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST:
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = 'requested';
        break;
      // case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.FAILED:
      //   draft[flowId].status = 'failed';
      //   break;
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED:
        draft[flowId].status = 'received';
        draft[flowId].data = latestJobs;
        break;
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED_JOB_FAMILY:
        // Update the job with the family response
        if (draft[flowId]?.data) {
          const index = draft[flowId].data.findIndex(flowJob => flowJob._id === job._id);

          draft[flowId].data[index] = parseJobFamily(job);
        }
        break;
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CLEAR:
        if (draft[flowId]) {
          delete draft[flowId];
        }
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.latestFlowJobsList = (state, flowId) => {
  if (!state || !flowId || !state[flowId]) return defaultObject;

  return state[flowId];
};

selectors.getInProgressLatestJobs = (state, flowId) => {
  if (!state || !flowId || !state[flowId]) return [];
  const jobsList = state[flowId].data;

  return jobsList.filter(job => [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING, JOB_STATUS.RETRYING].includes(
    job.status
  )).map(job => job._id);
};

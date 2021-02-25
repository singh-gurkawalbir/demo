import produce from 'immer';
import actionTypes from '../../../../../actions/types';
import { parseJobFamily } from '../../../../data/jobs/util';
import { JOB_STATUS } from '../../../../../utils/constants';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    flowId,
    refresh = false,
    latestJobs,
    job,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST:
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = refresh ? 'refresh' : 'request';
        break;
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = 'received';
        const jobChildrenMap = {};

        draft[flowId].data?.forEach(prevJob => {
          if (prevJob?.children?.length) {
            jobChildrenMap[prevJob._id] = prevJob.children;
          }
        });
        draft[flowId].data = [];
        // retains children till family call gives latest children jobs
        latestJobs?.forEach(latestJob => {
          const prevChildren = jobChildrenMap[latestJob._id];

          draft[flowId].data.push({
            ...latestJob,
            ...(prevChildren ? { children: prevChildren } : {}),
          });
        });

        break;
      }
      case actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED_JOB_FAMILY:
        // Update the job with the family response
        if (draft[flowId]?.data) {
          const index = draft[flowId].data.findIndex(flowJob => flowJob._id === job._id);
          const parsedJobFamily = parseJobFamily(job);

          // parseJobFamily does not update for empty children, so updating the same
          // TODO @Raghu: Make a separate util to handle the same
          if (job.children?.length === 0) {
            parsedJobFamily.children = [];
          }
          // to retain __lastPageGeneratorJob property on the job
          if (draft[flowId].data[index]?.__lastPageGeneratorJob) {
            parsedJobFamily.__lastPageGeneratorJob = true;
          }
          draft[flowId].data[index] = parsedJobFamily;
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

selectors.getInProgressLatestJobs = (state, flowId, considerChildJobs = false) => {
  if (!state || !flowId || !state[flowId]) return [];
  const jobsList = state[flowId].data || [];

  if (!considerChildJobs) {
    return jobsList.filter(job => [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
      job.status
    )).map(job => job._id);
  }

  const jobIds = jobsList.filter(job => {
    const isJobInProgress = [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
      job.status
    );

    if (isJobInProgress) return true;
    if (job.children?.length) {
      return job.children.some(cJob => cJob?.status === JOB_STATUS.RUNNING);
    }

    return false;
  }).map(job => job._id);

  return jobIds;
};

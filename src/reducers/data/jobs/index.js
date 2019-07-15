import actionTypes from '../../../actions/types';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';

function parseJobs(jobs) {
  const flowJobs = jobs.filter(job => job.type === JOB_TYPES.FLOW);
  const bulkRetryJobs = jobs.filter(job => job.type === JOB_TYPES.BULK_RETRY);

  return { flowJobs, bulkRetryJobs };
}

export default (state = {}, action) => {
  const { type, collection, job, integrationId, flowId } = action;

  if (!type) {
    return state;
  }

  if (type === actionTypes.JOB.CLEAR) {
    return {};
  }

  if (type === actionTypes.JOB.RECEIVED_COLLECTION) {
    const { flowJobs, bulkRetryJobs } = parseJobs(collection || []);

    return {
      [[`${integrationId}_${flowId || 'all'}`]]: {
        flowJobs,
        bulkRetryJobs,
      },
    };
  } else if (type === actionTypes.JOB.RECEIVED_FAMILY) {
    let key = [`${job._integrationId}_${job._flowId}`];

    if (!state[key]) {
      key = [`${job._integrationId}_all`];
    }

    if (!state[key]) {
      return state;
    }

    if (job.type === JOB_TYPES.FLOW) {
      const index = state[key].flowJobs.findIndex(j => j._id === job._id);

      if (index > -1) {
        const newCollection = [
          ...state[key].flowJobs.slice(0, index),
          {
            ...job,
          },
          ...state[key].flowJobs.slice(index + 1),
        ];

        return { [key]: { ...state[key], flowJobs: newCollection } };
      }
    } else if (job.type === JOB_TYPES.BULK_RETRY) {
      const index = state[key].bulkRetryJobs.findIndex(j => j._id === job._id);

      if (index > -1) {
        const newCollection = [
          ...state[key].bulkRetryJobs.slice(0, index),
          {
            ...job,
          },
          ...state[key].bulkRetryJobs.slice(index + 1),
        ];

        return { [key]: { ...state[key], bulkRetryJobs: newCollection } };
      }
    }
  }

  return state;
};

// #region PUBLIC SELECTORS
export function jobList(state, integrationId, flowId) {
  const key = [`${integrationId}_${flowId || 'all'}`];

  if (!state || !state[key]) {
    return {};
  }

  return state[key];
}

export function inProgressJobIds(state, integrationId, flowId) {
  const key = [`${integrationId}_${flowId || 'all'}`];
  const jobIds = [];

  if (!state || !state[key]) {
    return jobIds;
  }

  state[key].flowJobs.forEach(job => {
    if ([JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(job.status)) {
      jobIds.push(job._id);
    }
  });

  return jobIds;
}

// #endregion

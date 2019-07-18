import actionTypes from '../../../actions/types';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';
import {
  getFlowJobIdsThatArePartOfBulkRetryJobs,
  getJobDuration,
} from './util';

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
    return {
      flowJobs: [],
      bulkRetryJobs: [],
    };
  }

  return state[key];
}

export function flowJobList(state, integrationId, flowId) {
  const key = [`${integrationId}_${flowId || 'all'}`];

  if (!state || !state[key]) {
    return [];
  }

  const { flowJobs } = state[key];
  const flowJobIds = getFlowJobIdsThatArePartOfBulkRetryJobs(
    flowJobs,
    state[key].bulkRetryJobs
  );

  return flowJobs.map(job => {
    const additionalProps = {
      uiStatus: job.status,
      duration: getJobDuration(job),
      numSuccess: job.numSuccess || 0,
      numIgnore: job.numIgnore || 0,
      numError: job.numError || 0,
      numPagesGenerated: job.numPagesGenerated || 0,
      numPagesProcessed: 0,
      doneExporting: job.doneExporting,
    };

    if (!additionalProps.doneExporting) {
      if (
        [JOB_STATUS.COMPLETED, JOB_STATUS.CANCELED, JOB_STATUS.FAILED].includes(
          job.status
        )
      ) {
        additionalProps.doneExporting = true;
      }
    }

    if (flowJobIds.includes(job._id)) {
      additionalProps.uiStatus = JOB_STATUS.RETRYING;
    }

    if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      job.children = job.children.map(cJob => {
        const additionalChildProps = {
          uiStatus: cJob.status,
          duration: getJobDuration(cJob),
        };

        if (cJob.type === 'import') {
          if (
            additionalProps.doneExporting &&
            additionalProps.numPagesGenerated > 0
          ) {
            additionalChildProps.__percentComplete = Math.floor(
              (cJob.numPagesProcessed * 100) / additionalProps.numPagesGenerated
            );
          } else {
            additionalChildProps.__percentComplete = 0;
          }

          additionalProps.numPagesProcessed += parseInt(
            cJob.numPagesProcessed,
            10
          );

          if (cJob.retriable) {
            additionalProps.retriable = true;
          }
        }

        return { ...cJob, ...additionalChildProps };
      });
    }

    return { ...job, ...additionalProps };
  });
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

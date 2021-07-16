import { createSelector } from 'reselect';
import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  JOB_STATUS,
} from '../../../../utils/constants';
import {
  getJobDuration,
} from '../util';

function getParentJobIndex(jobs, jobId) {
  return jobs.findIndex(j => j._id === jobId);
}
export default (state = {}, action) => {
  const { type, collection = [], jobId, nextPageURL } = action;

  if (!type) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.JOB.DASHBOARD.RUNNING.CLEAR:
        draft.runningJobs = [];
        draft.status = undefined;
        draft.nextPageURL = undefined;
        break;

      case actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_COLLECTION:
        draft.status = 'loading';
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_COLLECTION:
        draft.runningJobs = collection;
        draft.status = undefined;
        draft.nextPageURL = nextPageURL;
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.CANCELED:
        if (!draft.runningJobs) draft.runningJobs = [];
        draft.runningJobs = draft.runningJobs.filter(job => job._id !== jobId);
        draft.status = undefined;
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_FAMILY:
        collection.forEach(job => {
          const index = getParentJobIndex(state.runningJobs, job._id);

          if (index > -1) {
            draft.runningJobs[index] = {...job};
          }
        });
        draft.runningJobs = draft.runningJobs.filter(job => ['running', 'canceling', 'queued'].includes(job.status));
        draft.status = undefined;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.dashboardInProgressJobIds = createSelector(
  state => state && state.runningJobs,
  runningJobs => {
    const jobIds = [];

    if (!runningJobs) {
      return jobIds;
    }

    runningJobs.forEach(job => {
      if (
        job._id &&
        [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING, JOB_STATUS.CANCELING].includes(job.status)
      ) {
        jobIds.push(job._id);
      }
    });

    return jobIds;
  }
);

selectors.runningJobs = createSelector(state => state?.runningJobs, state => state?.status, state => state?.nextPageURL, (runningJobs = [], status, nextPageURL) => {
  const jobs = runningJobs.map(job => {
    const additionalProps = {
      uiStatus: job.status,
      duration: getJobDuration(job),
      doneExporting: !!job.doneExporting,
      numPagesProcessed: 0,
    };

    return { ...job, ...additionalProps };
  });

  return {jobs, status, nextPageURL};
});

selectors.isRunningJobsCollectionLoading = state => state?.status === 'loading';

// #endregion

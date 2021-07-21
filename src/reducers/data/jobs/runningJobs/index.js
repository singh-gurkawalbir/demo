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
  const { type, collection = [], jobId, nextPageURL, loadMore } = action;

  if (!type) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.JOB.DASHBOARD.RUNNING.CLEAR:
        draft.runningJobs = [];
        delete draft.status;
        delete draft.nextPageURL;
        break;

      case actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_COLLECTION:
        draft.status = 'loading';
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_COLLECTION:
        draft.runningJobs = loadMore ? [...draft.runningJobs, ...collection] : collection;
        delete draft.status;
        draft.nextPageURL = nextPageURL;
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.ERROR:
        delete draft.status;
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.CANCELED:
        if (!draft.runningJobs) draft.runningJobs = [];
        draft.runningJobs = draft.runningJobs.filter(job => job._id !== jobId);
        delete draft.status;
        break;
      case actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_FAMILY:
        collection.forEach(job => {
          const index = getParentJobIndex(state.runningJobs, job._id);

          if (index > -1) {
            draft.runningJobs[index] = {...job};
          }
        });
        draft.runningJobs = draft.runningJobs.filter(job => [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING, JOB_STATUS.CANCELING].includes(job.status));
        delete draft.status;
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

selectors.runningJobs = createSelector(state => state?.runningJobs,
  state => state?.status,
  state => state?.nextPageURL,
  (runningJobs = [], status, nextPageURL) => {
    const jobs = runningJobs.map(job => {
      const additionalProps = {
        uiStatus: job.status,
        duration: getJobDuration(job),
        doneExporting: !!job.doneExporting,
        numPagesProcessed: 0,
      };

      if (job.children && job.children.length > 0) {
        // eslint-disable-next-line no-param-reassign
        job.children = job.children.filter(cJob => !!cJob).map(cJob => {
          const additionalChildProps = {
            uiStatus: cJob.status,
            duration: getJobDuration(cJob),
          };

          if (cJob.type === 'import') {
            if (additionalProps.doneExporting && job.numPagesGenerated > 0) {
              additionalChildProps.percentComplete = Math.floor(
                (cJob.numPagesProcessed * 100) / job.numPagesGenerated
              );
            } else {
              additionalChildProps.percentComplete = 0;
            }

            additionalProps.numPagesProcessed += parseInt(
              cJob.numPagesProcessed,
              10
            );
          }

          return { ...cJob, ...additionalChildProps };
        });
      }

      return { ...job, ...additionalProps };
    });

    return {jobs, status, nextPageURL};
  });

selectors.isRunningJobsCollectionLoading = state => state?.status === 'loading';

// #endregion

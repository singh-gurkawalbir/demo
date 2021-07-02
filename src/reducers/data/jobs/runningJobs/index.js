import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import {
  JOB_STATUS,
} from '../../../../utils/constants';
import {
  DEFAULT_STATE,

  getJobDuration,
} from '../util';

export default (state = DEFAULT_STATE, action) => {
  const { type, collection = [] } = action;

  if (!type) {
    return state;
  }

  if (type === actionTypes.JOB.CLEAR) {
    return DEFAULT_STATE;
  }

  if (type === actionTypes.JOB.DASHBOARD.RUNNING.RE) {
    return {
      ...state,
      status: 'loading',
    };
  }
  if (type === actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_COLLECTION) {
    return {
      ...state,
      runningJobs: collection,
      status: undefined,
    };
  }

  return state;
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.runningJobs = createSelector(state => state && state.runningJobs, (runningJobs = []) => runningJobs.map(job => {
  const additionalProps = {
    uiStatus: job.status,
    duration: getJobDuration(job),
    doneExporting: !!job.doneExporting,
    numPagesProcessed: 0,
  };

  if (!additionalProps.doneExporting) {
    if (
      [
        JOB_STATUS.COMPLETED,
        JOB_STATUS.CANCELED,
        JOB_STATUS.FAILED,
      ].includes(job.status)
    ) {
      additionalProps.doneExporting = true;
    }
  }

  return { ...job, ...additionalProps };
}));

selectors.isRunningJobsJobsCollectionLoading = state => state?.status === 'loading';

// #endregion

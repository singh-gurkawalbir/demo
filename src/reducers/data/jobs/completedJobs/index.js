import { createSelector } from 'reselect';
import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, collection = [], nextPageURL, loadMore } = action;

  if (!type) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.JOB.DASHBOARD.COMPLETED.CLEAR:
        draft.completedJobs = [];
        delete draft.status;
        delete draft.nextPageURL;
        break;
      case actionTypes.JOB.DASHBOARD.COMPLETED.ERROR:
        delete draft.status;
        break;

      case actionTypes.JOB.DASHBOARD.COMPLETED.REQUEST_COLLECTION:
        draft.status = 'loading';
        break;
      case actionTypes.JOB.DASHBOARD.COMPLETED.RECEIVED_COLLECTION:
        draft.completedJobs = loadMore ? [...draft.completedJobs, ...collection] : collection;
        delete draft.status;
        draft.nextPageURL = nextPageURL;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.completedJobs = createSelector(state => state?.completedJobs,
  state => state?.status,
  state => state?.nextPageURL,
  (completedJobs = [], status, nextPageURL) =>
    ({jobs: completedJobs,
      status,
      nextPageURL}));

selectors.isCompletedJobsCollectionLoading = state => state?.status === 'loading';

// #endregion

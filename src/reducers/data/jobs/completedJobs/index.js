import { createSelector } from 'reselect';
import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, collection = [] } = action;

  if (!type) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.JOB.DASHBOARD.COMPLETED.CLEAR:
        draft.completedJobs = [];
        draft.status = undefined;
        break;

      case actionTypes.JOB.DASHBOARD.COMPLETED.REQUEST_COLLECTION:
        draft.status = 'loading';
        break;
      case actionTypes.JOB.DASHBOARD.COMPLETED.RECEIVED_COLLECTION:
        draft.completedJobs = collection;
        draft.status = undefined;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.completedJobs = createSelector(state => state && state.completedJobs, (completedJobs = []) => completedJobs);

selectors.isCompletedJobsCollectionLoading = state => state?.status === 'loading';

// #endregion

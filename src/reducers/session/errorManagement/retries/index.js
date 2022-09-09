import produce from 'immer';
import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import { emptyList, JOB_STATUS } from '../../../../constants';
import { getJobDuration } from '../../../../utils/errorManagement';

export default (state = {}, action) => {
  const {
    type,
    resourceId,
    retries,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.RETRIES.REQUEST:
        if (!resourceId) {
          break;
        }
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }
        draft[resourceId].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.RETRIES.RECEIVED: {
        if (!resourceId || !draft[resourceId]) {
          break;
        }

        draft[resourceId].status = 'received';
        if (!draft[resourceId].data || !isEqual(draft[resourceId].data, retries)) {
          draft[resourceId].data = retries;
        }
        break;
      }
      case actionTypes.ERROR_MANAGER.RETRIES.CLEAR: {
        if (!resourceId || !draft[resourceId]) {
          break;
        }

        delete draft[resourceId];
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.retryListStatus = (state, resourceId) => state?.[resourceId]?.status;

selectors.retryList = createSelector(
  (state, resourceId) => state?.[resourceId]?.data || emptyList,
  (_1, _2, filters) => filters?.selectedUsers || emptyList,
  (retryJobs, selectedUsers) => {
    const allRetryJobs = selectedUsers.length ? retryJobs.filter(job => selectedUsers.includes(job.triggeredBy)) : retryJobs;

    return allRetryJobs.map(job => {
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
    });
  }
);

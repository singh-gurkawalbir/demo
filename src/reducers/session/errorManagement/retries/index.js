import produce from 'immer';
import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import { emptyList, JOB_STATUS } from '../../../../constants';
import { getJobDuration } from '../../../../utils/errorManagement';

export default (state = {}, action) => {
  const {
    type,
    flowId,
    resourceId,
    retries,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.RETRIES.REQUEST:
        if (!flowId || !resourceId) {
          break;
        }
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          draft[flowId] = {};
          draft[flowId][resourceId] = {};
        }
        draft[flowId][resourceId].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.RETRIES.RECEIVED: {
        if (!resourceId || !draft[flowId]?.[resourceId]) {
          break;
        }

        draft[flowId][resourceId].status = 'received';
        if (!draft[flowId][resourceId].data || !isEqual(draft[flowId][resourceId].data, retries)) {
          draft[flowId][resourceId].data = retries;
        }
        break;
      }
      case actionTypes.ERROR_MANAGER.RETRIES.CLEAR: {
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }

        delete draft[flowId][resourceId];
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.retryListStatus = (state, flowId, resourceId) => state?.[flowId]?.[resourceId]?.status;

selectors.retryList = createSelector(
  (state, flowId, resourceId) => state?.[flowId]?.[resourceId]?.data || emptyList,
  (_1, _2, _3, filters) => filters?.selectedUsers || emptyList,
  (retryJobs, selectedUsers) => {
    const allRetryJobs = selectedUsers.length && !selectedUsers.includes('all') ? retryJobs.filter(job => selectedUsers.includes(job.triggeredBy)) : retryJobs;

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

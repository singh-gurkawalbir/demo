import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId, logKey, logDetails, logs, nextPageURL, loadMore, deletedLogKey, hasNewLogs, activeLogKey, error, status } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.LOGS.FLOWSTEP.REQUEST:
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }
        delete draft[resourceId].fetchStatus;
        delete draft[resourceId].currQueryTime;
        if (loadMore) {
          draft[resourceId].loadMoreStatus = 'requested';
        } else {
          draft[resourceId].logsStatus = 'requested';
        }
        break;

      case actionTypes.LOGS.FLOWSTEP.RECEIVED:
        if (!draft[resourceId]) break;
        draft[resourceId].logsStatus = 'received';
        draft[resourceId].loadMoreStatus = 'received';
        // if loadMore is true, we only call nextPageURl so hasNewLogs should not reset
        if (!loadMore) {
          draft[resourceId].hasNewLogs = false;
        }
        draft[resourceId].nextPageURL = nextPageURL;

        // adding existing logs first to maintain the sorting order
        draft[resourceId].logsSummary = loadMore
          ? [...(draft[resourceId]?.logsSummary || []), ...logs]
          : logs;
        break;

      case actionTypes.LOGS.FLOWSTEP.LOG.REQUEST:
        if (!draft[resourceId]) break;
        if (!draft[resourceId].logsDetails) {
          draft[resourceId].logsDetails = {};
        }
        if (!draft[resourceId].logsDetails[logKey]) {
          draft[resourceId].logsDetails[logKey] = {
            status: 'requested',
          };
        }

        break;

      case actionTypes.LOGS.FLOWSTEP.LOG.RECEIVED:
        if (!draft[resourceId] || !draft[resourceId].logsDetails) break;

        draft[resourceId].logsDetails[logKey] = {
          status: 'received',
          ...logDetails,
        };
        break;

      case actionTypes.LOGS.FLOWSTEP.ACTIVE_LOG:
        if (!draft[resourceId]) break;
        draft[resourceId].activeLogKey = activeLogKey;
        break;

      case actionTypes.LOGS.FLOWSTEP.LOG.DELETED: {
        if (!draft[resourceId] || !deletedLogKey || !draft[resourceId].logsSummary) break;
        const logs = draft[resourceId].logsSummary;
        const index = logs.findIndex(l => l.key === deletedLogKey);

        if (index !== -1) {
          logs.splice(index, 1);
        }
        delete draft[resourceId].logsDetails?.[deletedLogKey];

        // delete the activeLogKey also if it matches the deleted key
        if (draft[resourceId].activeLogKey === deletedLogKey) {
          delete draft[resourceId].activeLogKey;
        }

        break;
      }
      case actionTypes.LOGS.FLOWSTEP.DEBUG.START:
        if (!draft[resourceId]) break;
        draft[resourceId].debugOn = true;
        break;

      case actionTypes.LOGS.FLOWSTEP.DEBUG.STOP:
        if (!draft[resourceId]) break;
        draft[resourceId].debugOn = false;
        break;

      case actionTypes.LOGS.FLOWSTEP.START_POLL:
        if (!draft[resourceId]) break;
        draft[resourceId].debugOn = true;
        break;

      case actionTypes.LOGS.FLOWSTEP.STOP_POLL:
        if (!draft[resourceId]) break;
        draft[resourceId].hasNewLogs = hasNewLogs;
        break;

      case actionTypes.LOGS.FLOWSTEP.FAILED: {
        if (!draft[resourceId]) break;
        // adding changeIdentifier to know if a new failed action was dispatched
        const changeIdentifier = draft[resourceId].error?.changeIdentifier || 0;

        draft[resourceId].error = {changeIdentifier: changeIdentifier + 1, ...error};
        break;
      }

      case actionTypes.LOGS.FLOWSTEP.FETCH_STATUS: {
        if (!draft[resourceId]) break;

        draft[resourceId].fetchStatus = status;
        const {nextPageURL} = draft[resourceId];

        if (status !== 'completed' && nextPageURL) {
          const queryParams = new URLSearchParams(nextPageURL);

          const timeLte = queryParams.get('time_lte');

          const logsLength = draft[resourceId].logsSummary?.length;
          const lastLogTime = logsLength && draft[resourceId].logsSummary?.[logsLength - 1].time;

          // if nextPageURL does not have time_lte, we use the oldest log time
          // or if logs list is also empty, we use current time
          draft[resourceId].currQueryTime = parseInt(timeLte || lastLogTime || Date.now(), 10);
        }
        break;
      }

      case actionTypes.LOGS.FLOWSTEP.CLEAR:
        delete draft[resourceId];
        break;

      default:
    }
  });
};

export const selectors = {};
const emptyObj = {};
const emptyArr = [];

selectors.flowStepLogs = (state, id) => {
  if (!state) return emptyObj;

  return state[id] || emptyObj;
};

selectors.logsSummary = (state, id) => {
  if (!state) return emptyArr;

  const flowStepLogs = state[id];

  return flowStepLogs?.logsSummary || emptyArr;
};

selectors.logsStatus = (state, id) => {
  if (!state) return;

  const flowStepLogs = state[id];

  return flowStepLogs?.logsStatus;
};

selectors.hasNewLogs = (state, id) => {
  if (!state) return false;

  const flowStepLogs = state[id];

  return !!flowStepLogs?.hasNewLogs;
};

selectors.logDetails = (state, id, key) => {
  if (!state) return emptyObj;

  const flowStepLogs = state[id];

  return flowStepLogs?.logsDetails?.[key] || emptyObj;
};

selectors.isDebugEnabled = (state, id) => {
  if (!state) return false;

  const flowStepLogs = state[id];

  return !!flowStepLogs?.debugOn;
};

selectors.activeLogKey = (state, id) => {
  if (!state) return;

  const flowStepLogs = state[id];

  return flowStepLogs?.activeLogKey;
};

selectors.flowStepErrorMsg = (state, id) => {
  if (!state) return emptyObj;

  const flowStepLogs = state[id];

  return flowStepLogs?.error || emptyObj;
};

import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, exportId, logKey, logDetails, logs, nextPageURL, loadMore, deletedLogKey, hasNewLogs, activeLogKey, error, status } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.LOGS.LISTENER.REQUEST:
        if (!draft[exportId]) {
          draft[exportId] = {};
        }
        delete draft[exportId].fetchStatus;
        delete draft[exportId].currQueryTime;
        if (loadMore) {
          draft[exportId].loadMoreStatus = 'requested';
        } else {
          draft[exportId].logsStatus = 'requested';
        }
        break;

      case actionTypes.LOGS.LISTENER.RECEIVED:
        if (!draft[exportId]) break;
        draft[exportId].logsStatus = 'received';
        draft[exportId].loadMoreStatus = 'received';
        // if loadMore is true, we only call nextPageURl so hasNewLogs should not reset
        if (!loadMore) {
          draft[exportId].hasNewLogs = false;
        }
        draft[exportId].nextPageURL = nextPageURL;

        // adding existing logs first to maintain the sorting order
        draft[exportId].logsSummary = loadMore
          ? [...draft[exportId]?.logsSummary || [], ...logs]
          : logs;
        break;

      case actionTypes.LOGS.LISTENER.LOG.REQUEST:
        if (!draft[exportId]) break;
        if (!draft[exportId].logsDetails) {
          draft[exportId].logsDetails = {};
        }
        if (!draft[exportId].logsDetails[logKey]) {
          draft[exportId].logsDetails[logKey] = {
            status: 'requested',
          };
        }

        break;

      case actionTypes.LOGS.LISTENER.LOG.RECEIVED:
        if (!draft[exportId] || !draft[exportId].logsDetails) break;

        draft[exportId].logsDetails[logKey] = {
          status: 'received',
          ...logDetails,
        };
        break;

      case actionTypes.LOGS.LISTENER.ACTIVE_LOG:
        if (!draft[exportId]) break;
        draft[exportId].activeLogKey = activeLogKey;
        break;

      case actionTypes.LOGS.LISTENER.LOG.DELETED: {
        if (!draft[exportId] || !deletedLogKey || !draft[exportId].logsSummary) break;
        const logs = draft[exportId].logsSummary;
        const index = logs.findIndex(l => l.key === deletedLogKey);

        if (index !== -1) {
          logs.splice(index, 1);
        }
        delete draft[exportId].logsDetails?.[deletedLogKey];

        // delete the activeLogKey also if it matches the deleted key
        if (draft[exportId].activeLogKey === deletedLogKey) {
          delete draft[exportId].activeLogKey;
        }

        break;
      }
      case actionTypes.LOGS.LISTENER.DEBUG.START:
        if (!draft[exportId]) break;
        draft[exportId].debugOn = true;
        break;

      case actionTypes.LOGS.LISTENER.DEBUG.STOP:
        if (!draft[exportId]) break;
        draft[exportId].debugOn = false;
        break;

      case actionTypes.LOGS.LISTENER.START_POLL:
        if (!draft[exportId]) break;
        draft[exportId].debugOn = true;
        break;

      case actionTypes.LOGS.LISTENER.STOP_POLL:
        if (!draft[exportId]) break;
        draft[exportId].hasNewLogs = hasNewLogs;
        break;

      case actionTypes.LOGS.LISTENER.FAILED: {
        if (!draft[exportId]) break;
        // adding changeIdentifier to know if a new failed action was dispatched
        const changeIdentifier = draft[exportId].error?.changeIdentifier || 0;

        draft[exportId].error = {changeIdentifier: changeIdentifier + 1, ...error};
        break;
      }

      case actionTypes.LOGS.LISTENER.FETCH_STATUS: {
        if (!draft[exportId]) break;
        draft[exportId].fetchStatus = status;
        const {nextPageURL} = draft[exportId];

        if (status !== 'completed' && nextPageURL) {
          const queryParams = new URLSearchParams(nextPageURL);

          const timeLte = queryParams.get('time_lte');

          const logsLength = draft[exportId].logsSummary?.length;
          const lastLogTime = logsLength && draft[exportId].logsSummary?.[logsLength - 1].time;

          // if nextPageURL does not have time_lte, we use the oldest log time
          // or if logs list is also empty, we use current time
          draft[exportId].currQueryTime = parseInt(timeLte || lastLogTime || Date.now(), 10);
        }
        break;
      }

      case actionTypes.LOGS.LISTENER.CLEAR:
        delete draft[exportId];
        break;

      default:
    }
  });
};

export const selectors = {};
const emptyObj = {};
const emptyArr = [];

selectors.listenerLogs = (state, id) => {
  if (!state) return emptyObj;

  return state[id] || emptyObj;
};

selectors.logsSummary = (state, id) => {
  if (!state) return emptyArr;

  const exportLogs = state[id];

  return exportLogs?.logsSummary || emptyArr;
};

selectors.logsStatus = (state, id) => {
  if (!state) return;

  const exportLogs = state[id];

  return exportLogs?.logsStatus;
};

selectors.hasNewLogs = (state, id) => {
  if (!state) return false;

  const exportLogs = state[id];

  return !!exportLogs?.hasNewLogs;
};

selectors.logDetails = (state, id, key) => {
  if (!state) return emptyObj;

  const exportLogs = state[id];

  return exportLogs?.logsDetails?.[key] || emptyObj;
};

selectors.isDebugEnabled = (state, id) => {
  if (!state) return false;

  const exportLogs = state[id];

  return !!exportLogs?.debugOn;
};

selectors.activeLogKey = (state, id) => {
  if (!state) return;

  const exportLogs = state[id];

  return exportLogs?.activeLogKey;
};

selectors.listenerErrorMsg = (state, id) => {
  if (!state) return emptyObj;

  const exportLogs = state[id];

  return exportLogs?.error || emptyObj;
};

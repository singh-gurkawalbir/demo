import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, exportId, logKey, logDetails, logs, nextPageURL, loadMore, deletedLogKey, hasNewLogs, activeLogKey, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.LOGS.LISTENER.REQUEST:
        if (!draft[exportId]) {
          draft[exportId] = {};
        }
        draft[exportId].logsStatus = 'requested';
        break;

      case actionTypes.LOGS.LISTENER.RECEIVED:
        if (!draft[exportId]) break;
        draft[exportId].logsStatus = 'received';
        draft[exportId].hasNewLogs = false;
        draft[exportId].nextPageURL = nextPageURL;

        draft[exportId].logsSummary = loadMore
          ? [...logs, ...draft[exportId]?.logsSummary || []]
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

      case actionTypes.LOGS.LISTENER.STOP_POLL:
        if (!draft[exportId]) break;
        draft[exportId].hasNewLogs = hasNewLogs;
        break;

      case actionTypes.LOGS.LISTENER.FAILED: {
        if (!draft[exportId]) break;
        const changeIdentifier = draft[exportId].error?.changeIdentifier || 0;

        draft[exportId].error = {changeIdentifier: changeIdentifier + 1, ...error};
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

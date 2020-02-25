import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, debugLogs, connectionId, response } = action;
  let connection;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONNECTION.PING_AND_UPDATE:
        if (draft.status && Array.isArray(draft.status)) {
          connection = draft.status.find(c => c._id === connectionId);

          if (connection) {
            connection.requestStatus = 'requested';
          }
        }

        break;

      case actionTypes.CONNECTION.PING_AND_UPDATE_FAILURE:
        if (draft.status && Array.isArray(draft.status)) {
          connection = draft.status.find(c => c._id === connectionId);

          if (connection) {
            connection.requestStatus = 'failure';
          }
        }

        break;
      case actionTypes.CONNECTION.PING_AND_UPDATE_SUCCESS:
        if (draft.status && Array.isArray(draft.status)) {
          connection = draft.status.find(c => c._id === connectionId);

          if (connection) {
            connection.requestStatus = 'success';
          }
        }

        break;
      case actionTypes.CONNECTION.AUTHORIZED:
        // On successful authorization of oauth connection, set the connection status to online.
        if (draft.status && Array.isArray(draft.status)) {
          connection = draft.status.find(c => c._id === connectionId);

          if (connection) {
            connection.offline = false;
          }
        }

        break;
      case actionTypes.CONNECTION.DEBUG_LOGS_RECEIVED:
        draft.debugLogs = { ...draft.debugLogs, [connectionId]: debugLogs };
        break;
      case actionTypes.CONNECTION.DEBUG_LOGS_CLEAR:
        if (draft.debugLogs && draft.debugLogs[connectionId]) {
          delete draft.debugLogs[connectionId];
        }

        break;
      case actionTypes.CONNECTION.RECEIVED_STATUS:
        draft.status = response;
        break;
      default:
    }
  });
};

export function debugLogs(state) {
  if (!state || !state.debugLogs) {
    return null;
  }

  return state.debugLogs;
}

export function connectionStatus(state, id) {
  const defaultStatus = { id, queueSize: 0, offline: false };

  if (!state || !state.status || !Array.isArray(state.status)) {
    return defaultStatus;
  }

  const connection = state.status.find(connection => connection._id === id);

  return connection || defaultStatus;
}

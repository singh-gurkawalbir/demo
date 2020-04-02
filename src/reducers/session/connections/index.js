import produce from 'immer';
import actionTypes from '../../../actions/types';

const updateConnectionStatus = (
  allConnectionsStatus,
  connectionId,
  connStatus
) => {
  if (allConnectionsStatus && Array.isArray(allConnectionsStatus)) {
    const connectionIndex = allConnectionsStatus.findIndex(
      c => c._id === connectionId
    );

    if (connectionIndex !== -1) {
      // allConnectionsStatus is a draft... mutating it is fine....hence disabling lint for the next lin
      // eslint-disable-next-line no-param-reassign
      allConnectionsStatus[connectionIndex] = {
        ...allConnectionsStatus[connectionIndex],
        ...connStatus,
      };
    }
  }
};

export default (state = {}, action) => {
  const { type, debugLogs, connectionId } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONNECTION.PING_AND_UPDATE:
        if (!draft.status) {
          draft.status = [{ _id: connectionId }];
        }

        break;
      case actionTypes.CONNECTION.AUTHORIZED:
        // On successful authorization of oauth connection, set the connection status to online.
        updateConnectionStatus(draft.status, connectionId, {
          offline: false,
        });

        break;
      case actionTypes.CONNECTION.DEBUG_LOGS_RECEIVED:
        draft.debugLogs = { ...draft.debugLogs, [connectionId]: debugLogs };
        break;
      case actionTypes.CONNECTION.DEBUG_LOGS_CLEAR:
        if (draft.debugLogs && draft.debugLogs[connectionId]) {
          delete draft.debugLogs[connectionId];
        }

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

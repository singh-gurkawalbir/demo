import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, connectionId, logs } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.LOGS.CONNECTIONS.REQUEST:
        if (!draft.connections) {
          draft.connections = {};
        }
        if (!draft.connections[connectionId]) {
          draft.connections[connectionId] = {};
        }
        draft.connections[connectionId].status = 'requested';
        break;
      case actionTypes.LOGS.CONNECTIONS.RECEIVED:
        draft.connections[connectionId].logs = logs;
        draft.connections[connectionId].status = 'success';
        break;
      case actionTypes.LOGS.CONNECTIONS.REQUEST_FAILED:
        draft.connections[connectionId].status = 'error';
        break;
      case actionTypes.LOGS.CONNECTIONS.REFRESH:
        draft.connections[connectionId].status = 'requested';
        delete draft.connections[connectionId].logs;
        break;
      case actionTypes.LOGS.CONNECTIONS.CLEAR:
        if (connectionId) {
          delete draft.connections[connectionId];
        } else {
          Object.keys(draft.connections).forEach(connectionId => {
            delete draft.connections[connectionId];
          });
        }
        break;
      case actionTypes.LOGS.CONNECTIONS.DELETE:
        delete draft.connections[connectionId].logs;
        break;
      default:
    }
  });
};

export const selectors = {};
const emptyObj = {};

selectors.allConnectionsLogs = state => {
  if (!state || !state.connections) {
    return emptyObj;
  }

  return state.connections;
};

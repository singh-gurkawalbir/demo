import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { COMM_STATES } from '../../../comms/networkComms';

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
        draft.connections[connectionId].status = COMM_STATES.LOADING;

        break;
      case actionTypes.LOGS.CONNECTIONS.RECEIVED:
        if (!draft.connections[connectionId]) {
          draft.connections[connectionId] = {};
        }

        draft.connections[connectionId].logs = logs;
        draft.connections[connectionId].status = COMM_STATES.SUCCESS;
        break;
      case actionTypes.LOGS.CONNECTIONS.REQUEST_FAILED:
        if (draft.connections[connectionId]) {
          draft.connections[connectionId].status = COMM_STATES.ERROR;
        }

        break;
      case actionTypes.LOGS.CONNECTIONS.CLEAR:
        if (draft.connections) {
          if (connectionId) {
            delete draft.connections[connectionId];
          } else {
            draft.connections = {};
          }
        }

        break;
      case actionTypes.LOGS.CONNECTIONS.DELETE:
        if (draft.connections) {
          draft.connections[connectionId] = {};
        }
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

import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, connectionId, logs } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.LOGS.CONNECTION.REQUEST:
        if (!draft.connection) {
          draft.connection = {};
        }
        if (!draft.connection[connectionId]) {
          draft.connection[connectionId] = {};
        }
        draft.connection[connectionId].status = 'requested';
        break;
      case actionTypes.LOGS.CONNECTION.RECEIVED:
        draft.connection[connectionId].logs = logs;
        draft.connection[connectionId].status = 'success';
        break;
      case actionTypes.LOGS.CONNECTION.REQUEST_FAILED:
        draft.connection[connectionId].status = 'error';
        break;
      case actionTypes.LOGS.CONNECTION.REFRESH:
        draft.connection[connectionId].status = 'requested';
        delete draft.connection[connectionId].logs;
        break;
      case actionTypes.LOGS.CONNECTION.CLEAR:
        if (connectionId) {
          delete draft.connection[connectionId];
        } else {
          Object.keys(draft.connection).forEach(connectionId => {
            delete draft.connection[connectionId];
          });
        }
        break;
      case actionTypes.LOGS.CONNECTION.DELETE:
        delete draft.connection[connectionId].logs;
        break;
      default:
    }
  });
};

export const selectors = {};
const emptyObj = {};

selectors.allConnectionsLogs = state => {
  if (!state || !state.connection) {
    return emptyObj;
  }

  return state.connection;
};

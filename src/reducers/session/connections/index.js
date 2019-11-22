import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, debugLogs, connectionId } = action;

  return produce(state, draft => {
    switch (type) {
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

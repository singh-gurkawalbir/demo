import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, debugLogs } = action;
  let newState;

  switch (type) {
    case actionTypes.CONNECTION.DEBUG_LOGS_RECEIVED:
      newState = { ...state, debugLogs };

      return newState;
    case actionTypes.CONNECTION.DEBUG_LOGS_CLEAR:
      newState = { ...state };
      delete newState.debugLogs;

      return newState;

    default:
      return state;
  }
};

export function debugLogs(state) {
  if (!state || !state.debugLogs) {
    return null;
  }

  return state.debugLogs;
}

import produce from 'immer';
import { COMM_STATES } from '../../comms/networkComms';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, response, flowId, onOffInProgress, runStatus } = action;

  if (!flowId) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW.RECEIVED_LAST_EXPORT_DATE_TIME:
        draft[flowId] = {
          lastExportDateTime: {
            data: response && response.lastExportDateTime,
            status: response ? COMM_STATES.SUCCESS : COMM_STATES.ERROR,
          },
        };

        break;
      case actionTypes.FLOW.RECEIVED_ON_OFF_ACTION_STATUS:
        draft[flowId] = { onOffInProgress };
        break;

      case actionTypes.FLOW.RECEIVED_RUN_ACTION_STATUS:
        draft[flowId] = { runStatus };
        break;
      case actionTypes.FLOW.CLEAR:
        delete draft[flowId];
        break;

      default:
    }
  });
};

export const selectors = {};

selectors.getLastExportDateTime = (state, flowId) => {
  if (!state || !state[flowId] || !flowId) {
    return null;
  }

  return state[flowId].lastExportDateTime;
};

selectors.isOnOffInProgress = (state, flowId) => !!(state && state[flowId] && state[flowId].onOffInProgress);

selectors.flowRunStatus = (state, flowId) => state?.[flowId]?.runStatus;

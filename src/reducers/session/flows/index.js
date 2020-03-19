import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, response, flowId, onOffInProgress } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW.RECEIVED_LAST_EXPORT_DATE_TIME:
        draft.lastExportDateTime = {
          [flowId]: {
            data: response && response.lastExportDateTime,
            status: response ? 'received' : 'error',
          },
        };

        break;
      case actionTypes.FLOW.RECEIVED_ON_OFF_ACTION_STATUS:
        draft[flowId] = { onOffInProgress };
        break;

      default:
    }
  });
};

export function getLastExportDateTime(state, flowId) {
  if (!state || !state.lastExportDateTime) {
    return null;
  }

  return state.lastExportDateTime && state.lastExportDateTime[flowId];
}

export function isOnOffInProgress(state, flowId) {
  if (!(state && state[flowId])) {
    return { onOffInProgress: false };
  }

  return { onOffInProgress: state[flowId].onOffInProgress || false };
}

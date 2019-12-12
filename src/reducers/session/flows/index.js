import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, response, flowId } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW.LAST_EXPORT_DATE_TIME_UPDATE:
        draft.lastExportDateTime = {
          ...draft.lastExportDateTime,
          [flowId]: response && response.lastExportDateTime,
        };
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

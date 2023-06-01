import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONNECTIONTRENDS.RECEIVED:
        draft.connectionResponse = response;
        draft.status = 'success';
        draft.error = null;
        break;

      case actionTypes.CONNECTIONTRENDS.REQUEST:
        draft.status = 'loading';
        draft.error = null;
        break;

      case actionTypes.CONNECTIONTRENDS.FAILED:
        draft.status = 'failure';
        draft.error = error;
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.connectionStatus = state => state?.status === 'loading';
selectors.connectionTrends = state => state?.connectionResponse;
selectors.connectionErrorMessage = state => state?.error;

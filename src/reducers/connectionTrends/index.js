import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONNECTIONTRENDS.RECEIVED:
        draft.connectionResponse = response;
        draft.status = 'received';
        break;

      case actionTypes.CONNECTIONTRENDS.REQUEST:
        draft.status = 'requested';
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.isConnectionTrendComplete = state => state?.status === 'received';
selectors.connectionTrends = state => state?.connectionResponse;

import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOWTRENDS.RECEIVED:
        draft.flowResponse = response;
        draft.status = 'received';
        break;

      case actionTypes.FLOWTRENDS.REQUEST:
        draft.status = 'requested';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.isTrendComplete = state => state?.status === 'received';
selectors.flowTrends = state => state?.flowResponse;
// #endregion

import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOWTRENDS.RECEIVED:
        draft.flowResponse = response;
        draft.status = 'success';
        break;

      case actionTypes.FLOWTRENDS.REQUEST:
        draft.status = 'loading';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.flowTrend = state => state?.status === 'loading';
selectors.flowTrendData = state => state?.flowResponse;
// #endregion

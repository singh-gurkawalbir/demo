import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOWTRENDS.RECEIVED:
        draft.flowResponse = response;
        draft.status = 'success';
        draft.error = null;
        break;

      case actionTypes.FLOWTRENDS.REQUEST:
        draft.status = 'loading';
        draft.error = null;
        break;

      case actionTypes.FLOWTRENDS.FAILED:
        draft.status = 'failure';
        draft.error = error;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.flowStatus = state => state?.status === 'loading';
selectors.flowTrendData = state => state?.flowResponse;
selectors.flowErrorMessage = state => state?.error;

// #endregion

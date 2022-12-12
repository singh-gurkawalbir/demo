import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, error, payload } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONCUR.CONNECT:
        draft.isLoading = true;

        break;
      case actionTypes.CONCUR.CONNECT_ERROR:
        delete draft.isLoading;
        draft.error = error;
        break;
      case actionTypes.CONCUR.CONNECT_SUCCESS:
        delete draft.isLoading;
        draft.data = payload;
        break;
      default:
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.isConcurDataLoading = state => !!state?.isLoading;
selectors.concurData = state => state?.data;
selectors.concurErrorMessage = state => state?.error;


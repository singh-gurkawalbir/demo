import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.USERTRENDS.RECEIVED:
        draft.userResponse = response;
        draft.status = 'success';
        draft.error = null;
        break;

      case actionTypes.USERTRENDS.REQUEST:
        draft.status = 'loading';
        draft.error = null;
        break;

      case actionTypes.USERTRENDS.FAILED:
        draft.status = 'failure';
        draft.error = error;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.userStatus = state => state?.status === 'loading';
selectors.userTrends = state => state?.userResponse;
selectors.userErrorMessage = state => state?.error;
// #endregion

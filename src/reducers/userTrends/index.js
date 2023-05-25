import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, response } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.USERTRENDS.RECEIVED:
        draft.userResponse = response;
        draft.status = 'received';
        break;

      case actionTypes.USERTRENDS.REQUEST:
        draft.status = 'requested';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.isUserTrendComplete = state => state?.status === 'received';
selectors.userTrends = state => state?.userResponse;
// #endregion

import produce from 'immer';
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, defaultAShareId } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.DASHBOARD.RECEIVED:
        draft.defaultAShareId = defaultAShareId;
        draft.status = 'received';
        break;

      case actionTypes.DASHBOARD.REQUEST:
        draft.status = 'requested';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.isAPICallComplete = state => state?.status === 'received';
selectors.customId = state => state?.defaultAShareId;
// #endregion

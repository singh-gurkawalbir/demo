import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { value, type } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.BOTTOM_DRAWER.SET_ACTIVE_TAB:
        if (!draft.bottomDrawer) {
          draft.bottomDrawer = {};
        }
        draft.bottomDrawer.activeTab = value;

        break;
      case actionTypes.BOTTOM_DRAWER.CLEAR:
        delete draft.bottomDrawer;

        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.bottomDrawerActiveTab = state => state?.bottomDrawer?.activeTab || 0;


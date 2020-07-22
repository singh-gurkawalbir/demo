import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { type, redirectTo } = action;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.RECYCLEBIN.RESTORE:
        draft.status = 'requested';
        break;
      case actionTypes.RECYCLEBIN.RESTORE_REDIRECT_TO:
        draft.status = 'completed';
        draft.redirectTo = redirectTo;
        break;
      case actionTypes.RECYCLEBIN.RESTORE_CLEAR:
        delete draft.status;
        delete draft.redirectTo;

        break;
    }
  });
};

export function recycleBinState(state) {
  if (!state) return emptyObj;

  return state;
}

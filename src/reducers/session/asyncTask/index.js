import produce from 'immer';
import actionTypes from '../../../actions/types';
import { FORM_SAVE_STATUS } from '../../../utils/constants';

export default (state = {}, action) => {
  const { type, key } = action;

  if (!type || !key) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ASYNC_TASK.START:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].status = FORM_SAVE_STATUS.LOADING;
        break;
      case actionTypes.ASYNC_TASK.SUCCESS:
        if (draft[key]) {
          draft[key].status = FORM_SAVE_STATUS.COMPLETE;
        }
        break;
      case actionTypes.ASYNC_TASK.FAILED:
        if (draft[key]) {
          draft[key].status = FORM_SAVE_STATUS.FAILED;
        }
        break;
      case actionTypes.ASYNC_TASK.CLEAR:
        delete draft[key];
        break;
      default:
    }
  });
};
// #region PUBLIC SELECTORS
export const selectors = {};

selectors.asyncTaskStatus = (state, key) => state?.[key]?.status;

selectors.isAsyncTaskLoading = (state, key) => state?.[key]?.status === FORM_SAVE_STATUS.LOADING;

// #endregion

import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (
  state = {
    retryObjects: {},
  },
  action
) => {
  const { type, retryData, retryId, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.MISCELLANEOUS.RETRY_DATA.REQUEST:
        draft.retryObjects[retryId] = { status: 'requested' };
        break;
      case actionTypes.ERROR_MANAGER.MISCELLANEOUS.RETRY_DATA.RECEIVED:
        draft.retryObjects[retryId].status = 'received';
        draft.retryObjects[retryId].data = retryData;
        break;
      case actionTypes.ERROR_MANAGER.MISCELLANEOUS.RETRY_DATA.RECEIVED_ERROR:
        draft.retryObjects[retryId].status = 'error';
        draft.retryObjects[retryId].data = error;
        break;
      default:
    }
  });
};

export const retryDataContext = (state, retryId) =>
  (state && state.retryObjects && state.retryObjects[retryId]) || defaultObject;

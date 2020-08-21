import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (
  state = {
    retryStatus: {},
    retryObjects: {},
  },
  action
) => {
  const { type, retryData, retryId, error, flowId, resourceId, status } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.RETRY_DATA.REQUEST:
        draft.retryObjects[retryId] = { status: 'requested' };
        break;
      case actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED:
        draft.retryObjects[retryId].status = 'received';
        draft.retryObjects[retryId].data = retryData;
        break;
      case actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED_ERROR:
        draft.retryObjects[retryId].status = 'error';
        draft.retryObjects[retryId].data = error;
        break;
      case actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST:
        if (!draft.retryStatus[flowId]) {
          draft.retryStatus[flowId] = {};
        }
        break;
      case actionTypes.ERROR_MANAGER.RETRY_STATUS.RECEIVED:
        draft.retryStatus[flowId][resourceId] = status;
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.retryDataContext = (state, retryId) =>
  (state.retryObjects?.[retryId]) || defaultObject;

selectors.retryStatus = (state, flowId, resourceId) =>
  state.retryStatus?.[flowId]?.[resourceId];


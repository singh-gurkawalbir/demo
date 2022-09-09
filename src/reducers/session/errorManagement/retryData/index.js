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
        if (retryId) {
          draft.retryObjects[retryId] = { status: 'requested' };
        }
        break;
      case actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED:
        if (!retryId || !draft.retryObjects[retryId]) {
          break;
        }
        draft.retryObjects[retryId].status = 'received';
        draft.retryObjects[retryId].data = retryData;
        draft.retryObjects[retryId].userData = undefined;
        break;
      case actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED_ERROR:
        if (!retryId || !draft.retryObjects[retryId]) {
          break;
        }
        draft.retryObjects[retryId].status = 'error';
        draft.retryObjects[retryId].error = error;
        draft.retryObjects[retryId].userData = undefined;
        break;
      case actionTypes.ERROR_MANAGER.RETRY_DATA.UPDATE_USER_RETRY_DATA:
        if (!retryId || !draft.retryObjects[retryId]) {
          break;
        }
        draft.retryObjects[retryId].userData = retryData;
        break;
      case actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST:
        if (flowId && !draft.retryStatus[flowId]) {
          draft.retryStatus[flowId] = {};
        }
        break;
      case actionTypes.ERROR_MANAGER.RETRY_STATUS.RECEIVED:
        if (flowId && draft.retryStatus[flowId]) {
          draft.retryStatus[flowId][resourceId] = status;
        }
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.retryDataContext = (state, retryId) =>
  (state?.retryObjects?.[retryId]) || defaultObject;

selectors.retryStatus = (state, flowId, resourceId) =>
  state?.retryStatus?.[flowId]?.[resourceId];

selectors.retryData = (state, retryId) => state?.retryObjects?.[retryId]?.data?.data;

selectors.userRetryData = (state, retryId) => state?.retryObjects?.[retryId]?.userData;


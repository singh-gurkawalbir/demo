import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, errorId, errorHttpDoc, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST:
        if (!draft[errorId]) {
          draft[errorId] = {};
        }
        draft[errorId].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.RECEIVED:
        if (!draft[errorId]) {
          break;
        }
        draft[errorId].status = 'received';
        draft[errorId].data = errorHttpDoc || {};
        break;
      case actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR:
        if (!draft[errorId]) {
          break;
        }
        draft[errorId].status = 'error';
        draft[errorId].error = error;
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.errorHttpDocStatus = (state, errorId) => {
  if (!state || !errorId || !state[errorId]) {
    return;
  }

  return state[errorId].status;
};

selectors.errorHttpDoc = (state, errorId) => {
  if (!state || !errorId || !state[errorId]) {
    return;
  }

  return state[errorId].data;
};

selectors.isBlobRequest = (state, errorId) =>
  !!state?.[errorId]?.data?.request?.bodyKey;

selectors.isBlobResponse = (state, errorId) =>
  !!state?.[errorId]?.data?.response?.bodyKey;

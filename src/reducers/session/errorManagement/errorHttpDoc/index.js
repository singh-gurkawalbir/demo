import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, reqAndResKey, errorHttpDoc, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST:
        if (!draft[reqAndResKey]) {
          draft[reqAndResKey] = {};
        }
        draft[reqAndResKey].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.RECEIVED:
        if (!draft[reqAndResKey]) {
          break;
        }
        draft[reqAndResKey].status = 'received';
        draft[reqAndResKey].data = errorHttpDoc;
        break;
      case actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR:
        if (!draft[reqAndResKey]) {
          break;
        }
        draft[reqAndResKey].status = 'error';
        draft[reqAndResKey].error = error;
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.errorHttpDocStatus = (state, reqAndResKey) => {
  if (!state || !reqAndResKey || !state[reqAndResKey]) {
    return;
  }

  return state[reqAndResKey].status;
};

selectors.errorHttpDoc = (state, reqAndResKey, isRequest = false) => {
  if (!state || !reqAndResKey || !state[reqAndResKey]?.data) {
    return;
  }

  return state[reqAndResKey].data[isRequest ? 'request' : 'response'];
};

selectors.errorHttpDocError = (state, reqAndResKey) => {
  if (!state || !reqAndResKey || !state[reqAndResKey]) {
    return;
  }

  return state[reqAndResKey].error;
};

selectors.s3HttpBlobKey = (state, reqAndResKey, isRequest) => {
  if (!state || !reqAndResKey || !state[reqAndResKey]?.data) {
    return;
  }

  return state[reqAndResKey].data[isRequest ? 'request' : 'response']?.bodyKey;
};

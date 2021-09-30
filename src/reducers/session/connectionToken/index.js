import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId, fieldsToBeSetWithValues, message } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.TOKEN.CLEAR:
        draft[resourceId] = {};
        break;
      case actionTypes.TOKEN.REQUEST:
        if (!draft[resourceId]) { draft[resourceId] = {}; }
        draft[resourceId] = { status: 'loading' };
        break;
      case actionTypes.TOKEN.RECEIVED:
        if (!draft[resourceId]) draft[resourceId] = {};
        draft[resourceId] = {
          ...draft[resourceId],
          fieldsToBeSetWithValues,
          status: 'received',
        };

        break;
      case actionTypes.TOKEN.FAILED:
        if (!draft[resourceId]) draft[resourceId] = {};
        delete draft[resourceId].token;
        draft[resourceId] = {
          ...draft[resourceId],
          message,
          status: 'failed',
        };

        break;
      default:
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.connectionTokens = (state, resourceId) => {
  if (!state) return {};

  return state[resourceId];
};

selectors.tokenRequestLoading = (state, resourceId) => {
  if (!state || !state[resourceId]) return false;

  return state[resourceId] && state[resourceId].status === 'loading';
};

// #endregion

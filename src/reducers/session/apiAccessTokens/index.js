import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, accessToken } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ACCESSTOKEN_TOKEN_RECEIVED:
        resourceIndex = state.findIndex(r => r._id === accessToken._id);

        if (resourceIndex > -1) {
          draft[resourceIndex].token = accessToken.token;
        } else {
          draft.push(accessToken);
        }

        break;
      case actionTypes.ACCESSTOKEN_TOKEN_MASK:
        resourceIndex = state.findIndex(r => r._id === accessToken._id);

        if (resourceIndex > -1) {
          draft[resourceIndex].token = null;
        } else {
          draft.push(accessToken);
        }

        break;
      default:
        return draft;
    }
  });
};
// #region PUBLIC SELECTORS

export function apiAccessToken(state, id) {
  if (!state) return '*****';

  return state.find(t => t._id === id) || '*****';
}

// #endregion

import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId, bearerToken, message } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.TOKEN.CLEAR:
    case actionTypes.TOKEN.GENERATE:
      newState[resourceId] = {};

      return newState;
    case actionTypes.TOKEN.SAVE:
      if (!newState[resourceId]) newState[resourceId] = {};
      newState[resourceId] = { ...newState[resourceId], bearerToken };

      return newState;
    case actionTypes.TOKEN.FAILED:
      if (!newState[resourceId]) newState[resourceId] = {};
      delete newState[resourceId].bearerToken;
      newState[resourceId] = { ...newState[resourceId], message };

      return newState;

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function connectionTokens(state, resourceId) {
  if (!state) return {};

  return state[resourceId];
}
// #endregion

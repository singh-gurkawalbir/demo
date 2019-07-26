import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId, fieldsToBeSetWithValues, message } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.TOKEN.CLEAR:
    case actionTypes.TOKEN.REQUEST:
      newState[resourceId] = {};

      return newState;
    case actionTypes.TOKEN.RECEIVED:
      if (!newState[resourceId]) newState[resourceId] = {};
      newState[resourceId] = {
        ...newState[resourceId],
        fieldsToBeSetWithValues,
      };

      return newState;
    case actionTypes.TOKEN.FAILED:
      if (!newState[resourceId]) newState[resourceId] = {};
      delete newState[resourceId].token;
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

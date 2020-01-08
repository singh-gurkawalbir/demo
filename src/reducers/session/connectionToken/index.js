import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId, fieldsToBeSetWithValues, message } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.TOKEN.CLEAR:
      newState[resourceId] = {};

      return newState;

    case actionTypes.TOKEN.REQUEST:
      newState[resourceId] = { status: 'loading' };

      return newState;
    case actionTypes.TOKEN.RECEIVED:
      if (!newState[resourceId]) newState[resourceId] = {};
      newState[resourceId] = {
        ...newState[resourceId],
        fieldsToBeSetWithValues,
        status: 'received',
      };

      return newState;
    case actionTypes.TOKEN.FAILED:
      if (!newState[resourceId]) newState[resourceId] = {};
      delete newState[resourceId].token;
      newState[resourceId] = {
        ...newState[resourceId],
        message,
        status: 'failed',
      };

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

export function tokenRequestLoading(state, resourceId) {
  if (!state || !state[resourceId]) return false;

  return state[resourceId] && state[resourceId].status === 'loading';
}

// #endregion

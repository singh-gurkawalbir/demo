import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, accessToken } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;
  let newState;

  switch (type) {
    case actionTypes.ACCESSTOKEN_TOKEN_RECEIVED:
      resourceIndex = state.findIndex(r => r._id === accessToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], ...accessToken },
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return [...state, { ...accessToken }];

    case actionTypes.ACCESSTOKEN_TOKEN_MASK:
      resourceIndex = state.findIndex(r => r._id === accessToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], token: null },
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return state;

    default:
      return state;
  }
};
// #region PUBLIC SELECTORS

export function apiAccessToken(state, id) {
  if (!state) return '*****';

  return state.find(t => t._id === id) || '*****';
}

// #endregion

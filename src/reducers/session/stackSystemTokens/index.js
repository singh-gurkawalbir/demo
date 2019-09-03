import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, stackToken } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;
  let newState;

  switch (type) {
    case actionTypes.STACK.TOKEN_RECEIVED:
      resourceIndex = state.findIndex(r => r._id === stackToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], ...stackToken },
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return [...state, { ...stackToken }];

    case actionTypes.STACK.TOKEN_MASK:
      resourceIndex = state.findIndex(r => r._id === stackToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], systemToken: null },
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

export function stackSystemToken(state, id) {
  if (!state) return '*****';

  return state.find(t => t._id === id) || '*****';
}

// #endregion

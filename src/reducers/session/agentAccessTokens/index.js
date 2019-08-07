import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, agentToken } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;
  let newState;

  switch (type) {
    case actionTypes.AGENT.TOKEN_RECEIVED:
      resourceIndex = state.findIndex(r => r._id === agentToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], ...agentToken },
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return [...state, { ...agentToken }];

    case actionTypes.AGENT.TOKEN_MASK:
      resourceIndex = state.findIndex(r => r._id === agentToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], accessToken: null },
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

export function agentAccessToken(state, id) {
  return state.find(t => t._id === id);
}

// #endregion

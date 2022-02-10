import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, agentToken } = action;

  if (!type) {
    return state;
  }
  let resourceIndex;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.AGENT.TOKEN_RECEIVED:
        resourceIndex = draft.findIndex(r => r._id === agentToken._id);

        if (resourceIndex > -1) {
          draft.splice(resourceIndex, 1, { ...draft[resourceIndex], ...agentToken });
          break;
        }
        draft.push({ ...agentToken });
        break;

      case actionTypes.AGENT.TOKEN_MASK:
        resourceIndex = draft.findIndex(r => r._id === agentToken._id);

        if (resourceIndex > -1) {
          draft.splice(resourceIndex, 1, { ...draft[resourceIndex], accessToken: null });
          break;
        }

        break;

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.agentAccessToken = (state, id) => {
  if (!state) return '*****';

  return state.find(t => t._id === id) || '*****';
};

// #endregion

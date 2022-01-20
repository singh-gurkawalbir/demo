import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, stackToken } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.STACK.TOKEN_RECEIVED:
        resourceIndex = draft.findIndex(r => r._id === stackToken._id);

        if (resourceIndex > -1) {
          draft.splice(resourceIndex, 1, { ...draft[resourceIndex], ...stackToken });
          break;
        }

        draft.push({ ...stackToken });
        break;

      case actionTypes.STACK.TOKEN_MASK:
        resourceIndex = draft.findIndex(r => r._id === stackToken._id);

        if (resourceIndex > -1) {
          draft.splice(resourceIndex, 1, { ...draft[resourceIndex], systemToken: null });
          break;
        }

        break;

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.stackSystemToken = (state, id) => {
  if (!state) return '*****';

  return state.find(t => t._id === id) || '*****';
};

// #endregion

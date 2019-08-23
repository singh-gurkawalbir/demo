import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, collection, userId } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;
  let newState;

  switch (type) {
    case actionTypes.STACK.STACK_SHARE_COLLECTION_RECEIVED:
      return collection || [];
    case actionTypes.STACK.STACK_SHARE_USER_DELETED:
      return state.filter(user => user._id !== userId);
    case actionTypes.STACK.USER_STACK_SHARING_TOGGLED:
      resourceIndex = state.findIndex(user => user._id === userId);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], disabled: !state[resourceIndex].disabled },
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

export function getStackShareCollection(state) {
  if (!state) return null;

  return state || [];
}

// #endregion

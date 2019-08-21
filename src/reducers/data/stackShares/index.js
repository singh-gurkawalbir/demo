import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, collection } = action;

  if (!type) {
    return state;
  }

  switch (type) {
    case actionTypes.STACK.STACK_SHARE_COLLECTION_RECEIVED:
      return collection || [];
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS

export function getStackShareCollection(state) {
  if (!state) return null;

  return state.collection || [];
}

// #endregion

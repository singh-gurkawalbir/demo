import actionTypes from '../../../actions/types';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const { type, name, filter } = action;
  let newState;

  switch (type) {
    case actionTypes.CLEAR_FILTER:
      newState = { ...state };
      delete newState[name];

      return newState;

    case actionTypes.PATCH_FILTER:
      newState = { ...state };
      newState[name] = { ...newState[name], ...filter };

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function filter(state, name) {
  if (!state) {
    return emptyObj;
  }

  return state[name] || emptyObj;
}
// #endregion

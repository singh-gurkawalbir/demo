import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, name, filter } = action;
  let newState;

  switch (type) {
    case actionTypes.CLEAR_FILTER:
      newState = Object.assign({}, state);

      delete newState[name];

      return newState;

    case actionTypes.PATCH_FILTER:
      newState = Object.assign({}, state);
      newState[name] = { ...newState[name], ...filter };

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function filter(state, name) {
  if (!state) {
    return {};
  }

  return state[name] || {};
}
// #endregion

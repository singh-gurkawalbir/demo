import actionTypes from '../../../actions/types';

export default (state = false, action) => {
  if (action.type === actionTypes.TOGGLE_DEBUG) {
    return !state;
  }

  return state;
};

// #region PUBLIC SELECTORS
export function debugOn(state) {
  return !!state;
}
// #endregion PUBLIC SELECTORS

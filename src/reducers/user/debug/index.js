import actionTypes from '../../../actions/types';

export default (state = false, action) => {
  if (action.type === actionTypes.TOGGLE_DEBUG) {
    return !state;
  }

  return state;
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.debugOn = state => !!state;
// #endregion PUBLIC SELECTORS

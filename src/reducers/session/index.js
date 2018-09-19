import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

export const DEFAULT_THEME = 'dark';
const profile = (state = null, action) => {
  switch (action.type) {
    case actionTypes.PROFILE.RECEIVED:
      return action.profile;

    default:
      return state;
  }
};

const themeName = (state = DEFAULT_THEME, action) => {
  switch (action.type) {
    case actionTypes.SET_THEME:
      return action.themeName;

    default:
      return state;
  }
};

export default combineReducers({
  profile,
  themeName,
});

// *****************
// PUBLIC SELECTORS
// *****************
export function avatarUrl(state) {
  if (!state || !state.profile) return;

  return `https://secure.gravatar.com/avatar/${
    state.profile.emailHash
  }?d=mm&s=55`;
}

export function userTheme(state) {
  if (!state || !state.themeName) {
    return DEFAULT_THEME;
  }

  return state.themeName;
}

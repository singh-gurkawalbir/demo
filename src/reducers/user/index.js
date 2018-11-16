import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

const profile = (state = null, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED &&
    action.resourceType === 'profile'
  ) {
    return action.resource;
  }

  if (action.type === actionTypes.DELETE_PROFILE) {
    // Except for email delete everything

    if (!state) return {};

    return { email: state.email };
  }

  return state;
};

export const DEFAULT_THEME = 'dark';
const themeName = (state = DEFAULT_THEME, action) => {
  switch (action.type) {
    case actionTypes.SET_THEME:
      return action.name;

    default:
      return state;
  }
};

export default combineReducers({
  profile,
  themeName,
});

// #region PUBLIC SESSION SELECTORS

export function avatarUrl(state) {
  if (!state || !state.profile) return undefined;

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

// #endregion PUBLIC SESSION SELECTORS

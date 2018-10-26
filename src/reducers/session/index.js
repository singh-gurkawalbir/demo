import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';

const profile = (state = null, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED &&
    action.resourceType === 'profile'
  ) {
    return action.resource;
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
  filters,
  stage,
});

// #region PUBLIC SELECTORS
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

export function filter(state, name) {
  if (!state) return {};

  return fromFilters.filter(state.filters, name);
}

export function stagedResource(state, id) {
  if (!state) return {};

  return fromStage.stagedResource(state.stage, id);
}
// #endregion

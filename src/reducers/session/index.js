import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

export const DEFAULT_THEME = 'dark';
const profile = (state = null, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED &&
    action.resourceType === 'profile'
  ) {
    return action.resources;
  }

  return state;
};

const themeName = (state = DEFAULT_THEME, action) => {
  switch (action.type) {
    case actionTypes.SET_THEME:
      return action.name;

    default:
      return state;
  }
};

const stagedResources = (state = {}, action) => {
  const { type, id, patch } = action;
  let newState;

  switch (type) {
    case actionTypes.RESOURCE.STAGE_CLEAR:
      newState = Object.assign({}, state);

      delete newState[id];

      return newState;

    case actionTypes.RESOURCE.STAGE_PATCH:
      newState = Object.assign({}, state);

      // TODO: there needs to be a deep copy here...
      // this is temp code to test our the pattern.
      newState[id] = { ...newState[id], ...patch };

      return newState;

    default:
      return state;
  }
};

const filters = (state = {}, action) => {
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
};

export default combineReducers({
  profile,
  themeName,
  filters,
  stagedResources,
});

// *****************
// PUBLIC SELECTORS
// *****************
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
  if (!state || !state.filters) {
    return {};
  }

  return state.filters[name] || {};
}

export function stagedResource(state, id) {
  if (!state || !state.stagedResources || !id) {
    return null;
  }

  return state.stagedResources[id];
}

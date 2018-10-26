import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

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

const stagedResources = (state = {}, action) => {
  const { type, id, patch, conflict } = action;
  let newState;
  let newPatch;

  switch (type) {
    case actionTypes.RESOURCE.STAGE_CLEAR:
      // we can't clear if there is no staged data
      if (!state[id] || !state[id].patch || !state[id].patch.length) {
        return state;
      }

      newState = Object.assign({}, state);

      // drop all staged patches.
      delete newState[id].patch;
      delete newState[id].lastChange;

      return newState;

    case actionTypes.RESOURCE.STAGE_UNDO:
      // we can't undo if there is no staged data
      if (!state[id] || !state[id].patch || !state[id].patch.length) {
        return state;
      }

      newState = Object.assign({}, state);

      // drop last patch.
      newState[id].patch.pop();

      return newState;

    case actionTypes.RESOURCE.STAGE_PATCH:
      newState = Object.assign({}, state);

      newState[id] = newState[id] || {};
      newPatch = newState[id].patch || [];

      // if the previous patch is modifying the same path as the prior patch,
      // remove the prior patch so we dont accumulate single character patches.
      if (
        patch.length === 1 &&
        newPatch.length > 0 &&
        newPatch[newPatch.length - 1].path === patch[0].path
      ) {
        newPatch.pop(); // throw away partial patch.
      }

      newState[id] = {
        ...newState[id],
        lastChange: Date.now(),
        patch: [...newPatch, ...patch],
      };

      return newState;

    case actionTypes.RESOURCE.STAGE_CONFLICT:
      newState = Object.assign({}, state);

      newState[id] = newState[id] || {};

      newState[id].conflict = conflict;

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
  if (!state || !state.filters) {
    return {};
  }

  return state.filters[name] || {};
}

export function stagedResource(state, id) {
  if (!state || !state.stagedResources || !id) {
    return {};
  }

  return state.stagedResources[id] || {};
}
// #endregion

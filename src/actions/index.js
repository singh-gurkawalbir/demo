import actionTypes from './types';

export const availableResources = ['exports', 'imports', 'connections'];

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symetrical in shape by generating them via "action creator"
// functions.

function action(type, payload = {}) {
  return { type, ...payload };
}

const resource = {
  request: resourceType =>
    action(actionTypes.RESOURCE.REQUEST, { resourceType }),

  retry: resourceType => action(actionTypes.RESOURCE.RETRY, { resourceType }),

  received: (resourceType, resources) =>
    action(actionTypes.RESOURCE.RECEIVED, { resourceType, resources }),

  failure: (resourceType, message) =>
    action(actionTypes.RESOURCE.FAILURE, { resourceType, message }),
};
// This set of profile action creators are just helper that curry arguments
// to the generic resource implementations.
// Although rety and failure are valid profile actions, they are never manually
// dispatched since the fetch resource saga acts on the generic actions.
const profile = {
  request: () => resource.request('profile'),
  received: profile => resource.received('profile', profile),
};
const setTheme = themeName => ({
  type: actionTypes.SET_THEME,
  themeName,
});
const patchFilter = (name, filter) => ({
  type: actionTypes.PATCH_FILTER,
  name,
  filter,
});
const clearFilter = name => ({
  type: actionTypes.CLEAR_FILTER,
  name,
});
const patchStagedResource = (id, patch) => ({
  type: actionTypes.PATCH_STAGED_RESOURCE,
  id,
  patch,
});
const clearStagedResource = id => ({
  type: actionTypes.CLEAR_STAGED_RESOURCE,
  id,
});
const commitStagedResource = (resourceType, id) => ({
  type: actionTypes.COMMIT_STAGED_RESOURCE,
  resourceType,
  id,
});

export default {
  setTheme,
  patchFilter,
  clearFilter,
  patchStagedResource,
  clearStagedResource,
  commitStagedResource,
  resource,
  profile,
};

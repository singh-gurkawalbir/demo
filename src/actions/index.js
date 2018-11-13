import actionTypes from './types';

export const availableResources = ['exports', 'imports', 'connections'];

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symetrical in shape by generating them via "action creator"
// functions.

function action(type, payload = {}) {
  return { type, ...payload };
}

const api = {
  request: path => action(actionTypes.API_REQUEST, { path }),
  retry: path => action(actionTypes.API_RETRY, { path }),
  complete: path => action(actionTypes.API_COMPLETE, { path }),
  failure: (path, message) =>
    action(actionTypes.API_FAILURE, { path, message }),
};
const resource = {
  request: (resourceType, id) =>
    action(actionTypes.RESOURCE.REQUEST, { resourceType, id }),

  requestCollection: resourceType =>
    action(actionTypes.RESOURCE.REQUEST_COLLECTION, { resourceType }),

  received: (resourceType, resource) =>
    action(actionTypes.RESOURCE.RECEIVED, { resourceType, resource }),

  receivedCollection: (resourceType, collection) =>
    action(actionTypes.RESOURCE.RECEIVED_COLLECTION, {
      resourceType,
      collection,
    }),

  clearStaged: id => action(actionTypes.RESOURCE.STAGE_CLEAR, { id }),

  undoStaged: id => action(actionTypes.RESOURCE.STAGE_UNDO, { id }),

  patchStaged: (id, patch) =>
    action(actionTypes.RESOURCE.STAGE_PATCH, { patch, id }),

  commitStaged: (resourceType, id) =>
    action(actionTypes.RESOURCE.STAGE_COMMIT, { resourceType, id }),

  commitConflict: (id, conflict) =>
    action(actionTypes.RESOURCE.STAGE_CONFLICT, { conflict, id }),

  clearConflict: id => action(actionTypes.RESOURCE.CLEAR_CONFLICT, { id }),
};
const profile = {
  request: () => resource.request('profile'),
  received: profile => resource.received('profile', profile),
};
const setTheme = name => action(actionTypes.SET_THEME, { name });
const patchFilter = (name, filter) =>
  action(actionTypes.PATCH_FILTER, { name, filter });
const clearFilter = name => action(actionTypes.CLEAR_FILTER, { name });
//
// #region Editor actions
const editor = {
  init: (id, processor, rules, data) =>
    action(actionTypes.EDITOR_INIT, { id, processor, rules, data }),
  ruleChange: (id, rules) =>
    action(actionTypes.EDITOR_RULE_CHANGE, { id, rules }),
  dataChange: (id, data) =>
    action(actionTypes.EDITOR_DATA_CHANGE, { id, data }),
  evaluateRequest: id => action(actionTypes.EDITOR_EVALUATE_REQUEST, { id }),
  evaluateFailure: (id, error) =>
    action(actionTypes.EDITOR_EVALUATE_FAILURE, { id, error }),
  evaluateResponse: (id, result) =>
    action(actionTypes.EDITOR_EVALUATE_RESPONSE, { id, result }),
};
// #endregion

export default {
  setTheme,
  patchFilter,
  clearFilter,
  editor,
  resource,
  profile,
  api,
};

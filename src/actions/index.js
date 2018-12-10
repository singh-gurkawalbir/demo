import actionTypes from './types';

export const availableResources = ['exports', 'imports', 'connections'];

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symetrical in shape by generating them via "action creator"
// functions.

function action(type, payload = {}) {
  return { type, ...payload };
}

const auth = {
  request: (email, password) =>
    action(actionTypes.AUTH_REQUEST, { email, password }),
  complete: () => action(actionTypes.AUTH_SUCCESSFUL),
  failure: message => action(actionTypes.AUTH_FAILURE, { message }),
  logout: () => action(actionTypes.USER_LOGOUT),
  clearStore: () => action(actionTypes.CLEAR_STORE),
  initSession: () => action(actionTypes.INIT_SESSION),
  changePassword: updatedPassword =>
    action(actionTypes.USER_CHANGE_PASSWORD, { updatedPassword }),
  changeEmail: updatedEmail =>
    action(actionTypes.USER_CHANGE_EMAIL, { updatedEmail }),
};
const api = {
  request: (path, message, hidden) =>
    action(actionTypes.API_REQUEST, { path, message, hidden }),
  retry: path => action(actionTypes.API_RETRY, { path }),
  complete: (path, message) =>
    action(actionTypes.API_COMPLETE, { path, message }),
  failure: (path, message) =>
    action(actionTypes.API_FAILURE, { path, message }),
  clearSuccessComms: () => action(actionTypes.CLEAR_SUCCESS_COMMS),
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
  delete: () => action(actionTypes.DELETE_PROFILE),
  update: profilePreferencesPayload =>
    action(actionTypes.UPDATE_PROFILE_PREFERENCES, {
      profilePreferencesPayload,
    }),
};
const setTheme = name => action(actionTypes.SET_THEME, { name });
const patchFilter = (name, filter) =>
  action(actionTypes.PATCH_FILTER, { name, filter });
const clearFilter = name => action(actionTypes.CLEAR_FILTER, { name });
const clearComms = () => action(actionTypes.CLEAR_COMMS);
//
// #region Editor actions
const editor = {
  init: (id, processor, options) =>
    action(actionTypes.EDITOR_INIT, { id, processor, options }),
  patch: (id, patch) => action(actionTypes.EDITOR_PATCH, { id, patch }),
  reset: id => action(actionTypes.EDITOR_RESET, { id }),
  evaluateRequest: id => action(actionTypes.EDITOR_EVALUATE_REQUEST, { id }),
  validateFailure: (id, violations) =>
    action(actionTypes.EDITOR_VALIDATE_FAILURE, { id, violations }),
  evaluateFailure: (id, error) =>
    action(actionTypes.EDITOR_EVALUATE_FAILURE, { id, error }),
  evaluateResponse: (id, result) =>
    action(actionTypes.EDITOR_EVALUATE_RESPONSE, { id, result }),
};
// #endregion

export default {
  clearComms,
  setTheme,
  patchFilter,
  clearFilter,
  editor,
  resource,
  profile,
  api,
  auth,
};

import actionTypes from './types';

export const availableResources = [
  'exports',
  'imports',
  'connections',
  'agents',
  'scripts',
  'stacks',
  'published',
  'integrations',
  'tiles',
];

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symmetrical in shape by generating them via "action creator"
// functions.

function action(type, payload = {}) {
  return { type, ...payload };
}

const auth = {
  requestReducer: () => action(actionTypes.AUTH_REQUEST_REDUCER),
  request: (email, password) =>
    action(actionTypes.AUTH_REQUEST, { email, password }),
  complete: () => action(actionTypes.AUTH_SUCCESSFUL),
  failure: message => action(actionTypes.AUTH_FAILURE, { message }),
  logout: isExistingSessionInvalid =>
    action(actionTypes.USER_LOGOUT, {
      isExistingSessionInvalid,
    }),
  clearStore: () => action(actionTypes.CLEAR_STORE),
  initSession: () => action(actionTypes.INIT_SESSION),
  changePassword: updatedPassword =>
    action(actionTypes.USER_CHANGE_PASSWORD, { updatedPassword }),
  changeEmail: updatedEmail =>
    action(actionTypes.USER_CHANGE_EMAIL, { updatedEmail }),
  defaultAccountSet: () => action(actionTypes.DEFAULT_ACCOUNT_SET),
};
const api = {
  request: (path, method, message, hidden) =>
    action(actionTypes.API_REQUEST, { path, message, hidden, method }),
  retry: (path, method) => action(actionTypes.API_RETRY, { path, method }),
  complete: (path, method, message) =>
    action(actionTypes.API_COMPLETE, { path, method, message }),
  failure: (path, method, message, hidden) =>
    action(actionTypes.API_FAILURE, { path, method, message, hidden }),
};
// #region Resource Actions
const resource = {
  request: (resourceType, id, message) =>
    action(actionTypes.RESOURCE.REQUEST, { resourceType, id, message }),

  requestCollection: (resourceType, message) =>
    action(actionTypes.RESOURCE.REQUEST_COLLECTION, { resourceType, message }),

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

  test: {
    connection: (resourceType, resourceId, values) =>
      action(actionTypes.TEST_CONNECTION, {
        resourceType,
        resourceId,
        values,
      }),
  },
  initCustomForm: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE.INIT_CUSTOM_FORM, { resourceType, resourceId }),

  patchFormField: (resourceType, resourceId, fieldId, value, op, offset = 0) =>
    action(actionTypes.RESOURCE.PATCH_FORM_FIELD, {
      resourceType,
      resourceId,
      fieldId,
      value,
      op,
      offset,
    }),
};
// #endregion
const metadata = {
  requestCollection: (connectionId, metadataType, mode) =>
    action(actionTypes.REQUEST_METADATA_COLLECTION, {
      connectionId,
      metadataType,
      mode,
    }),
  netsuite: {
    receivedCollection: (metadata, metadataType, connectionId, mode) =>
      action(actionTypes.RECEIVED_NETSUITE_COLLECTION, {
        metadata,
        metadataType,
        connectionId,
        mode,
      }),
  },
};
const ashares = {
  receivedCollection: ashares =>
    resource.receivedCollection('ashares', ashares),
};
const user = {
  profile: {
    request: message => resource.request('profile', undefined, message),
    delete: () => action(actionTypes.DELETE_PROFILE),
    update: profile => action(actionTypes.UPDATE_PROFILE, { profile }),
  },
  org: {
    users: {
      requestCollection: message =>
        resource.requestCollection('ashares', undefined, message),
      create: user => action(actionTypes.USER_CREATE, { user }),
      created: user => action(actionTypes.USER_CREATED, { user }),
      update: (_id, user) => action(actionTypes.USER_UPDATE, { _id, user }),
      updated: user => action(actionTypes.USER_UPDATED, { user }),
      delete: _id => action(actionTypes.USER_DELETE, { _id }),
      deleted: _id => action(actionTypes.USER_DELETED, { _id }),
      disable: (_id, disabled) =>
        action(actionTypes.USER_DISABLE, { _id, disabled }),
      disabled: _id => action(actionTypes.USER_DISABLED, { _id }),
      makeOwner: email => action(actionTypes.USER_MAKE_OWNER, { email }),
    },
    accounts: {
      requestCollection: message =>
        resource.requestCollection('shared/ashares', undefined, message),
      requestLicenses: message =>
        resource.requestCollection('licenses', undefined, message),
      requestTrialLicense: () => action(actionTypes.LICENSE_TRIAL_REQUEST, {}),
      trialLicenseIssued: message =>
        action(actionTypes.LICENSE_TRIAL_ISSUED, message),
      requestLicenseUpgrade: () =>
        action(actionTypes.LICENSE_UPGRADE_REQUEST, {}),
      licenseUpgradeRequestSubmitted: message =>
        action(actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED, { message }),
      acceptInvite: id => action(actionTypes.ACCOUNT_INVITE_ACCEPT, { id }),
      acceptedInvite: id => action(actionTypes.ACCOUNT_INVITE_ACCEPTED, { id }),
      rejectInvite: id => action(actionTypes.ACCOUNT_INVITE_REJECT, { id }),
      leave: id => action(actionTypes.ACCOUNT_LEAVE_REQUEST, { id }),
      switchTo: ({ id, environment }) =>
        action(actionTypes.ACCOUNT_SWITCH, { id, environment }),
    },
  },
  preferences: {
    request: message => resource.request('preferences', undefined, message),
    update: preferences =>
      action(actionTypes.UPDATE_PREFERENCES, { preferences }),
  },
};
const reloadApp = () => action(actionTypes.RELOAD_APP);
const patchFilter = (name, filter) =>
  action(actionTypes.PATCH_FILTER, { name, filter });
const clearFilter = name => action(actionTypes.CLEAR_FILTER, { name });
const clearComms = () => action(actionTypes.CLEAR_COMMS);
const clearCommByKey = key => action(actionTypes.CLEAR_COMM_BY_KEY, { key });
const cancelTask = () => action(actionTypes.CANCEL_TASK, {});
//
// #region Editor actions
const editor = {
  init: (id, processor, options) =>
    action(actionTypes.EDITOR_INIT, { id, processor, options }),
  patch: (id, patch) => action(actionTypes.EDITOR_PATCH, { id, patch }),
  reset: id => action(actionTypes.EDITOR_RESET, { id }),
  updateHelperFunctions: helperFunctions =>
    action(actionTypes.EDITOR_UPDATE_HELPER_FUNCTIONS, { helperFunctions }),
  refreshHelperFunctions: () =>
    action(actionTypes.EDITOR_REFRESH_HELPER_FUNCTIONS),
  evaluateRequest: id => action(actionTypes.EDITOR_EVALUATE_REQUEST, { id }),
  validateFailure: (id, violations) =>
    action(actionTypes.EDITOR_VALIDATE_FAILURE, { id, violations }),
  evaluateFailure: (id, error) =>
    action(actionTypes.EDITOR_EVALUATE_FAILURE, { id, error }),
  evaluateResponse: (id, result) =>
    action(actionTypes.EDITOR_EVALUATE_RESPONSE, { id, result }),
};
// #endregion
//
// #region DynaForm Actions
const resourceForm = {
  init: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.INIT, { resourceType, resourceId }),
  initComplete: (
    resourceType,
    resourceId,
    fieldMeta,
    optionsHandler,
    preSubmit
  ) =>
    action(actionTypes.RESOURCE_FORM.INIT_COMPLETE, {
      resourceId,
      resourceType,
      fieldMeta,
      optionsHandler,
      preSubmit,
    }),
  submit: (resourceType, resourceId, values) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT, {
      resourceType,
      resourceId,
      values,
    }),
  submitComplete: (resourceType, resourceId, formValues) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE, {
      resourceType,
      resourceId,
      formValues,
    }),
};
// #endregion

export default {
  metadata,
  cancelTask,
  reloadApp,
  clearComms,
  clearCommByKey,
  patchFilter,
  clearFilter,
  editor,
  resourceForm,
  resource,
  user,
  api,
  ashares,
  auth,
};

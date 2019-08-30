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
  'flows',
  'templates',
];

export const availableOSTypes = ['windows', 'linux', 'macOS'];

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
  created: (id, tempId) => action(actionTypes.RESOURCE.CREATED, { id, tempId }),

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

  delete: (resourceType, id) =>
    action(actionTypes.RESOURCE.DELETE, { resourceType, id }),

  deleted: (resourceType, id) =>
    action(actionTypes.RESOURCE.DELETED, { resourceType, id }),
  update: (resourceType, id, resourceFieldUpdates) =>
    action(actionTypes.RESOURCE.UPDATE, {
      resourceType,
      id,
      resourceFieldUpdates,
    }),

  requestReferences: (resourceType, id) =>
    action(actionTypes.RESOURCE.REFERENCES_REQUEST, {
      resourceType,
      id,
    }),

  clearReferences: () => action(actionTypes.RESOURCE.REFERENCES_CLEAR, {}),

  receivedReferences: resourceReferences =>
    action(actionTypes.RESOURCE.REFERENCES_RECEIVED, {
      resourceReferences,
    }),

  clearStaged: (id, scope) =>
    action(actionTypes.RESOURCE.STAGE_CLEAR, { id, scope }),

  undoStaged: (id, scope) =>
    action(actionTypes.RESOURCE.STAGE_UNDO, { id, scope }),

  patchStaged: (id, patch, scope) =>
    action(actionTypes.RESOURCE.STAGE_PATCH, { patch, id, scope }),

  commitStaged: (resourceType, id, scope) =>
    action(actionTypes.RESOURCE.STAGE_COMMIT, { resourceType, id, scope }),

  commitConflict: (id, conflict, scope) =>
    action(actionTypes.RESOURCE.STAGE_CONFLICT, { conflict, id, scope }),

  clearConflict: (id, scope) =>
    action(actionTypes.RESOURCE.CLEAR_CONFLICT, { id, scope }),

  initCustomForm: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE.INIT_CUSTOM_FORM, {
      resourceType,
      resourceId,
    }),

  patchFormField: (resourceType, resourceId, fieldId, value, op, offset = 0) =>
    action(actionTypes.RESOURCE.PATCH_FORM_FIELD, {
      resourceType,
      resourceId,
      fieldId,
      value,
      op,
      offset,
    }),
  connections: {
    test: (resourceId, values) =>
      action(actionTypes.TEST_CONNECTION, {
        resourceId,
        values,
      }),
    saveAndAuthorize: (resourceId, values) =>
      action(actionTypes.RESOURCE_FORM.SAVE_AND_AUTHORIZE, {
        resourceId,
        values,
      }),
    commitAndAuthorize: resourceId =>
      action(actionTypes.RESOURCE_FORM.COMMIT_AND_AUTHORIZE, {
        resourceId,
      }),

    requestToken: (resourceId, values) =>
      action(actionTypes.TOKEN.REQUEST, {
        resourceId,
        values,
      }),
    saveToken: (resourceId, fieldsToBeSetWithValues) =>
      action(actionTypes.TOKEN.RECEIVED, {
        resourceId,
        fieldsToBeSetWithValues,
      }),
    requestTokenFailed: (resourceId, message) =>
      action(actionTypes.TOKEN.FAILED, { resourceId, message }),
    clearToken: resourceId => action(actionTypes.TOKEN.CLEAR, { resourceId }),

    netsuite: {
      requestUserRoles: (connectionId, values) =>
        action(actionTypes.NETSUITE_USER_ROLES.REQUEST, {
          connectionId,
          values,
        }),
      receivedUserRoles: (connectionId, userRoles) =>
        action(actionTypes.NETSUITE_USER_ROLES.RECEIVED, {
          connectionId,
          userRoles,
        }),
      requestUserRolesFailed: (connectionId, message) =>
        action(actionTypes.NETSUITE_USER_ROLES.FAILED, {
          connectionId,
          message,
        }),
      clearUserRoles: connectionId =>
        action(actionTypes.NETSUITE_USER_ROLES.CLEAR, { connectionId }),
    },
  },
};
// #endregion
const auditLogs = {
  request: (resourceType, resourceId, message) => {
    if (resourceType && resourceId) {
      return action(actionTypes.RESOURCE.REQUEST_COLLECTION, {
        resourceType: `${resourceType}/${resourceId}/audit`,
        message,
      });
    }

    return action(actionTypes.RESOURCE.REQUEST_COLLECTION, {
      resourceType: 'audit',
      message,
    });
  },
  clear: () => action(actionTypes.AUDIT_LOGS_CLEAR),
};
const metadata = {
  request: (connectionId, metadataType, mode, filterKey) =>
    action(actionTypes.METADATA.REQUEST, {
      connectionId,
      metadataType,
      mode,
      filterKey,
    }),
  refresh: (connectionId, metadataType, mode, filterKey) =>
    action(actionTypes.METADATA.REFRESH, {
      connectionId,
      metadataType,
      mode,
      filterKey,
    }),
  netsuite: {
    receivedCollection: (
      metadata,
      metadataType,
      connectionId,
      mode,
      filterKey
    ) =>
      action(actionTypes.METADATA.RECEIVED_NETSUITE, {
        metadata,
        metadataType,
        connectionId,
        mode,
        filterKey,
      }),
    receivedError: (
      metadataError,
      metadataType,
      connectionId,
      mode,
      filterKey
    ) =>
      action(actionTypes.METADATA.RECEIVED_ERROR, {
        metadataError,
        metadataType,
        connectionId,
        mode,
        filterKey,
      }),
  },
};
const ashares = {
  receivedCollection: ashares =>
    resource.receivedCollection('ashares', ashares),
};
const agent = {
  displayToken: id => action(actionTypes.AGENT.TOKEN_DISPLAY, { id }),
  changeToken: id => action(actionTypes.AGENT.TOKEN_CHANGE, { id }),
  tokenReceived: agentToken =>
    action(actionTypes.AGENT.TOKEN_RECEIVED, { agentToken }),
  maskToken: agentToken => action(actionTypes.AGENT.TOKEN_MASK, { agentToken }),
  downloadInstaller: (osType, id) =>
    action(actionTypes.AGENT.DOWNLOAD_INSTALLER, { osType, id }),
};
const template = {
  downloadZip: id => action(actionTypes.TEMPLATE.ZIP_DOWNLOAD, { id }),
  publish: (item, resourceType) =>
    action(actionTypes.TEMPLATE.PUBLISH, { item, resourceType }),
};
const file = {
  upload: (resourceType, resourceId, file) =>
    action(actionTypes.FILE.UPLOAD, { resourceType, resourceId, file }),
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
const appErrored = () => action(actionTypes.APP_ERRORED);
const clearAppError = () => action(actionTypes.APP_CLEAR_ERROR);
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
  init: (resourceType, resourceId, isNew, skipCommit) =>
    action(actionTypes.RESOURCE_FORM.INIT, {
      resourceType,
      resourceId,
      isNew,
      skipCommit,
    }),
  initComplete: (resourceType, resourceId, fieldMeta, isNew, skipCommit) =>
    action(actionTypes.RESOURCE_FORM.INIT_COMPLETE, {
      resourceId,
      resourceType,
      fieldMeta,
      isNew,
      skipCommit,
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
  clear: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.CLEAR, { resourceType, resourceId }),
};
const accessToken = {
  displayToken: id => action(actionTypes.ACCESSTOKEN_TOKEN_DISPLAY, { id }),
  generateToken: id => action(actionTypes.ACCESSTOKEN_TOKEN_GENERATE, { id }),
  tokenReceived: accessToken =>
    action(actionTypes.ACCESSTOKEN_TOKEN_RECEIVED, { accessToken }),
  maskToken: accessToken =>
    action(actionTypes.ACCESSTOKEN_TOKEN_MASK, { accessToken }),
  create: accessToken =>
    action(actionTypes.ACCESSTOKEN_CREATE, { accessToken }),
  created: accessToken =>
    action(actionTypes.ACCESSTOKEN_CREATED, { accessToken }),
  update: accessToken =>
    action(actionTypes.ACCESSTOKEN_UPDATE, { accessToken }),
  updated: accessToken =>
    action(actionTypes.ACCESSTOKEN_UPDATED, { accessToken }),
  revoke: id => action(actionTypes.ACCESSTOKEN_REVOKE, { id }),
  activate: id => action(actionTypes.ACCESSTOKEN_ACTIVATE, { id }),
  deleteAccessToken: id => action(actionTypes.ACCESSTOKEN_DELETE, { id }),
  deleted: id =>
    action(actionTypes.ACCESSTOKEN_DELETED, { accessToken: { _id: id } }),
};
const job = {
  requestCollection: ({ integrationId, flowId, filters }) =>
    action(actionTypes.JOB.REQUEST_COLLECTION, {
      integrationId,
      flowId,
      filters,
    }),
  receivedCollection: ({ collection }) =>
    action(actionTypes.JOB.RECEIVED_COLLECTION, {
      collection,
    }),
  requestFamily: ({ jobId }) =>
    action(actionTypes.JOB.REQUEST_FAMILY, { jobId }),
  receivedFamily: ({ job }) => action(actionTypes.JOB.RECEIVED_FAMILY, { job }),

  requestInProgressJobStatus: () =>
    action(actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS),
  noInProgressJobs: () => action(actionTypes.JOB.NO_IN_PROGRESS_JOBS),
  downloadDiagnosticsFile: ({ jobId }) =>
    action(actionTypes.JOB.DOWNLOAD_DIAGNOSTICS_FILE, { jobId }),
  clear: () => action(actionTypes.JOB.CLEAR),

  cancel: ({ jobId, flowJobId }) =>
    action(actionTypes.JOB.CANCEL, { jobId, flowJobId }),

  resolveAllPending: () => action(actionTypes.JOB.RESOLVE_ALL_PENDING),
  resolve: ({ jobId, parentJobId }) =>
    action(actionTypes.JOB.RESOLVE, { jobId, parentJobId }),
  resolveSelected: ({ jobs }) =>
    action(actionTypes.JOB.RESOLVE_SELECTED, { jobs }),
  resolveAll: ({ flowId, integrationId }) =>
    action(actionTypes.JOB.RESOLVE_ALL, { flowId, integrationId }),
  resolveInit: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RESOLVE_INIT, { parentJobId, childJobId }),
  resolveAllInit: () => action(actionTypes.JOB.RESOLVE_ALL_INIT),
  resolveUndo: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RESOLVE_UNDO, { parentJobId, childJobId }),
  resolveAllUndo: () => action(actionTypes.JOB.RESOLVE_ALL_UNDO),
  resolveCommit: () => action(actionTypes.JOB.RESOLVE_COMMIT),
  resolveAllCommit: () => action(actionTypes.JOB.RESOLVE_ALL_COMMIT),
  retryAllPending: () => action(actionTypes.JOB.RETRY_ALL_PENDING),
  retrySelected: ({ jobs }) => action(actionTypes.JOB.RETRY_SELECTED, { jobs }),
  retryFlowJob: ({ jobId }) =>
    action(actionTypes.JOB.RETRY_FLOW_JOB, { jobId }),
  retryInit: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RETRY_INIT, { parentJobId, childJobId }),
  retryAllInit: () => action(actionTypes.JOB.RETRY_ALL_INIT),
  retryUndo: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RETRY_UNDO, { parentJobId, childJobId }),
  retryCommit: () => action(actionTypes.JOB.RETRY_COMMIT),
  retryFlowJobCommit: () => action(actionTypes.JOB.RETRY_FLOW_JOB_COMMIT),
  retryAll: ({ flowId, integrationId }) =>
    action(actionTypes.JOB.RETRY_ALL, { flowId, integrationId }),
  retryAllUndo: () => action(actionTypes.JOB.RETRY_ALL_UNDO),
  retryAllCommit: () => action(actionTypes.JOB.RETRY_ALL_COMMIT),
  requestRetryObjects: ({ jobId }) =>
    action(actionTypes.JOB.REQUEST_RETRY_OBJECTS, { jobId }),
  receivedRetryObjects: ({ collection, jobId }) =>
    action(actionTypes.JOB.RECEIVED_RETRY_OBJECT_COLLECTION, {
      collection,
      jobId,
    }),
  requestErrors: ({ jobType, jobId, parentJobId }) =>
    action(actionTypes.JOB.ERROR.REQUEST_COLLECTION, {
      jobType,
      jobId,
      parentJobId,
    }),
  receivedErrors: ({ collection, jobId }) =>
    action(actionTypes.JOB.ERROR.RECEIVED_COLLECTION, { collection, jobId }),
  resolveSelectedErrorsInit: ({ selectedErrorIds }) =>
    action(actionTypes.JOB.ERROR.RESOLVE_SELECTED_INIT, {
      selectedErrorIds,
    }),
  resolveSelectedErrors: ({ jobId, flowJobId, selectedErrorIds }) =>
    action(actionTypes.JOB.ERROR.RESOLVE_SELECTED, {
      jobId,
      flowJobId,
      selectedErrorIds,
    }),
  retrySelectedRetries: ({ jobId, flowJobId, selectedRetryIds }) =>
    action(actionTypes.JOB.ERROR.RETRY_SELECTED, {
      jobId,
      flowJobId,
      selectedRetryIds,
    }),
  downloadErrorFile: ({ jobId }) =>
    action(actionTypes.JOB.DOWNLOAD_ERROR_FILE, { jobId }),
  requestRetryData: ({ retryId }) =>
    action(actionTypes.JOB.ERROR.REQUEST_RETRY_DATA, { retryId }),
  receivedRetryData: ({ retryData, retryId }) =>
    action(actionTypes.JOB.ERROR.RECEIVED_RETRY_DATA, { retryData, retryId }),
  updateRetryData: ({ retryData, retryId }) =>
    action(actionTypes.JOB.ERROR.UPDATE_RETRY_DATA, { retryData, retryId }),
  paging: {
    setRowsPerPage: rowsPerPage =>
      action(actionTypes.JOB.PAGING.SET_ROWS_PER_PAGE, { rowsPerPage }),
    setCurrentPage: currentPage =>
      action(actionTypes.JOB.PAGING.SET_CURRENT_PAGE, { currentPage }),
  },
  error: {
    clear: () => action(actionTypes.JOB.ERROR.CLEAR),
  },
};
const flow = {
  run: ({ flowId }) => action(actionTypes.FLOW.RUN, { flowId }),
};
// #endregion

export default {
  clearAppError,
  appErrored,
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
  auditLogs,
  accessToken,
  job,
  flow,
  agent,
  template,
  file,
};

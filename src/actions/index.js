/* eslint-disable camelcase */
import actionTypes from './types';
import suiteScript from './suiteScript';

export const auditResourceTypePath = (resourceType, resourceId) =>
  resourceType && resourceId ? `${resourceType}/${resourceId}/audit` : 'audit';
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
  'apis',
  'eventreports',
];

export const availableOSTypes = ['windows', 'linux', 'macOS'];

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symmetrical in shape by generating them via "action creator"
// functions.

function action(type, payload = {}) {
  return { type, ...payload };
}

// #region this form specific source code, please be careful when making changes to the interface
const form = {
  init: (formKey, remountKey, formSpecificProps) =>
    action(actionTypes.FORM.INIT, { formKey, remountKey, formSpecificProps }),
  clear: formKey => action(actionTypes.FORM.CLEAR, { formKey }),
  formUpdate: (formKey, formSpecificProps) =>
    action(actionTypes.FORM.UPDATE, { formKey, formSpecificProps }),
  showFormValidations: formKey =>
    action(actionTypes.FORM.UPDATE, {
      formKey,
      formSpecificProps: { showValidationBeforeTouched: true },
    }),
  registerField: formKey => fieldProps =>
    action(actionTypes.FORM.FIELD.REGISTER, { formKey, fieldProps }),
  fieldChange: formKey => (id, value, skipFieldTouched) =>
    action(actionTypes.FORM.FIELD.ON_FIELD_CHANGE, {
      formKey,
      fieldProps: { id, value, skipFieldTouched },
    }),
  fieldBlur: formKey => id =>
    action(actionTypes.FORM.FIELD.ON_FIELD_BLUR, {
      formKey,
      fieldProps: { id },
    }),
  fieldFocus: formKey => id =>
    action(actionTypes.FORM.FIELD.ON_FIELD_FOCUS, {
      formKey,
      fieldProps: { id },
    }),
  forceFieldState: formKey => (
    id,
    { visible,
      disabled,
      required,
      touched,
      isValid,
      errorMessages }
  ) =>
    action(actionTypes.FORM.FIELD.FORCE_STATE, {
      formKey,
      fieldProps: {
        id,
        visible,
        disabled,
        required,
        touched,
        isValid,
        errorMessages,
      },
    }),
  clearForceFieldState: formKey => id =>
    action(actionTypes.FORM.FIELD.CLEAR_FORCE_STATE, {
      formKey,
      fieldProps: { id },
    }),
};
// #endregion
const auth = {
  acceptInvite: {
    validate: token => action(actionTypes.AUTH.ACCEPT_INVITE.VALIDATE, { token }),
    validateError: error => action(actionTypes.AUTH.ACCEPT_INVITE.VALIDATE_ERROR, {error}),
    validateSuccess: payload => action(actionTypes.AUTH.ACCEPT_INVITE.VALIDATE_SUCCESS, {payload}),
    submit: payload => action(actionTypes.AUTH.ACCEPT_INVITE.SUBMIT, { payload }),
    success: response => action(actionTypes.AUTH.ACCEPT_INVITE.SUCCESS, { response }),
    failure: error => action(actionTypes.AUTH.ACCEPT_INVITE.FAILED, { error }),
    clear: () => action(actionTypes.AUTH.ACCEPT_INVITE.CLEAR),
  },
  changeEmailRequest: token =>
    action(actionTypes.AUTH.CHANGE_EMAIL_REQUEST, { token }),
  changeEmailSuccess: requestInfo => action(actionTypes.AUTH.CHANGE_EMAIL_SUCCESSFUL, {requestInfo}),
  changeEmailFailed: error => action(actionTypes.AUTH.CHANGE_EMAIL_FAILED, {error}),
  setPasswordRequest: (password, token) =>
    action(actionTypes.AUTH.SET_PASSWORD_REQUEST, { password, token }),
  setPasswordRequestFailed: error => action(actionTypes.AUTH.SET_PASSWORD_REQUEST_FAILED, {error}),
  setPasswordRequestSuccess: setPasswordRequestInfo => action(actionTypes.AUTH.SET_PASSWORD_REQUEST_SUCCESSFUL, {setPasswordRequestInfo}),
  resetRequestSent: () => action(actionTypes.AUTH.RESET_REQUEST_SENT),
  resetRequestSuccess: restRequestInfo => action(actionTypes.AUTH.RESET_REQUEST_SUCCESSFUL, {restRequestInfo}),
  resetRequestFailed: error => action(actionTypes.AUTH.RESET_REQUEST_FAILED, {error}),
  resetRequest: email =>
    action(actionTypes.AUTH.RESET_REQUEST, { email }),
  request: (email, password, showAuthError) =>
    action(actionTypes.AUTH.REQUEST, { email, password, showAuthError }),
  resetPasswordRequest: (password, token) =>
    action(actionTypes.AUTH.RESET_PASSWORD_REQUEST, { password, token }),
  resetPasswordSuccess: resetPasswordRequestInfo => action(actionTypes.AUTH.RESET_PASSWORD_REQUEST_SUCCESSFUL, {resetPasswordRequestInfo}),
  resetPasswordFailed: error => action(actionTypes.AUTH.RESET_PASSWORD_REQUEST_FAILED, {error}),
  signup: payloadBody =>
    action(actionTypes.AUTH.SIGNUP, { payloadBody }),
  signupStatus: (status, message) =>
    action(actionTypes.AUTH.SIGNUP_STATUS, {status, message}),
  signUpWithGoogle: (returnTo, utmParams, acceptInviteParams) =>
    action(actionTypes.AUTH.SIGNUP_WITH_GOOGLE, { returnTo, utmParams, acceptInviteParams }),
  signInWithGoogle: returnTo =>
    action(actionTypes.AUTH.SIGNIN_WITH_GOOGLE, { returnTo }),
  reSignInWithGoogle: email =>
    action(actionTypes.AUTH.RE_SIGNIN_WITH_GOOGLE, { email }),
  reSignInWithSSO: () =>
    action(actionTypes.AUTH.RE_SIGNIN_WITH_SSO),
  linkWithGoogle: returnTo =>
    action(actionTypes.AUTH.LINK_WITH_GOOGLE, { returnTo }),
  complete: () => action(actionTypes.AUTH.SUCCESSFUL),
  mfaRequired: mfaAuthInfo => action(actionTypes.AUTH.MFA_REQUIRED, { mfaAuthInfo }),
  mfaVerify: {
    request: payload => action(actionTypes.AUTH.MFA_VERIFY.REQUEST, { payload }),
    failed: mfaError => action(actionTypes.AUTH.MFA_VERIFY.FAILED, { mfaError }),
    success: () => action(actionTypes.AUTH.MFA_VERIFY.SUCCESS),
  },
  failure: message => action(actionTypes.AUTH.FAILURE, { message }),
  warning: () => action(actionTypes.AUTH.WARNING),
  logout: isExistingSessionInvalid =>
    action(actionTypes.AUTH.USER.LOGOUT, {
      isExistingSessionInvalid,
    }),
  userAlreadyLoggedIn: () => action(actionTypes.AUTH.USER_ALREADY_LOGGED_IN),
  clearStore: auth => action(actionTypes.AUTH.CLEAR_STORE, { auth }),
  abortAllSagasAndInitLR: opts => action(actionTypes.AUTH.ABORT_ALL_SAGAS_AND_INIT_LR, { opts }),
  abortAllSagasAndSwitchAcc: accountToSwitchTo => action(actionTypes.AUTH.ABORT_ALL_SAGAS_AND_SWITCH_ACC, { accountToSwitchTo }),
  initSession: opts => action(actionTypes.AUTH.INIT_SESSION, { opts }),
  validateAndInitSession: () => action(actionTypes.AUTH.VALIDATE_AND_INIT_SESSION),
  validateSession: () => action(actionTypes.AUTH.VALIDATE_SESSION),
  changePassword: updatedPassword =>
    action(actionTypes.AUTH.USER.CHANGE_PASSWORD, { updatedPassword }),
  changeEmail: updatedEmail =>
    action(actionTypes.AUTH.USER.CHANGE_EMAIL, { updatedEmail }),
  defaultAccountSet: () => action(actionTypes.AUTH.DEFAULT_ACCOUNT_SET),
  sessionTimestamp: () => action(actionTypes.AUTH.TIMESTAMP),
};

const asyncTask = {
  start: key => action(actionTypes.ASYNC_TASK.START, { key }),
  success: key => action(actionTypes.ASYNC_TASK.SUCCESS, { key }),
  failed: key => action(actionTypes.ASYNC_TASK.FAILED, { key }),
  clear: key => action(actionTypes.ASYNC_TASK.CLEAR, { key }),
};
const api = {
  request: (path, method, message, hidden, refresh) =>
    action(actionTypes.API.REQUEST, { path, message, hidden, method, refresh }),
  retry: (path, method) => action(actionTypes.API.RETRY, { path, method }),
  complete: (path, method, message) =>
    action(actionTypes.API.COMPLETE, { path, method, message }),
  failure: (path, method, message, hidden) =>
    action(actionTypes.API.FAILURE, { path, method, message, hidden }),
  clearComms: () => action(actionTypes.API.CLEAR_COMMS),
  clearCommByKey: key => action(actionTypes.API.CLEAR_COMM_BY_KEY, { key }),
};
// #region Resource Actions
const connection = {
  setActive: connectionId => action(actionTypes.CONNECTION.ACTIVE_SET, { connectionId }),

  requestRegister: (connectionIds, integrationId) =>
    action(actionTypes.CONNECTION.REGISTER_REQUEST, {
      connectionIds,
      integrationId,
    }),
  completeRegister: (connectionIds, integrationId) =>
    action(actionTypes.CONNECTION.REGISTER_COMPLETE, {
      connectionIds,
      integrationId,
    }),
  requestDeregister: (connectionId, integrationId) =>
    action(actionTypes.CONNECTION.DEREGISTER_REQUEST, {
      connectionId,
      integrationId,
    }),
  updateTradingPartner: connectionId =>
    action(actionTypes.CONNECTION.TRADING_PARTNER_UPDATE, {
      connectionId,
    }),
  requestRevoke: connectionId =>
    action(actionTypes.CONNECTION.REVOKE_REQUEST, {
      connectionId,
    }),
  completeDeregister: (deregisteredId, integrationId) =>
    action(actionTypes.CONNECTION.DEREGISTER_COMPLETE, {
      deregisteredId,
      integrationId,
    }),
  completeTradingPartner: connectionIds =>
    action(actionTypes.CONNECTION.TRADING_PARTNER_UPDATE_COMPLETE, {
      connectionIds,
    }),
  updateIClients: (iClients, connectionId) =>
    action(actionTypes.CONNECTION.UPDATE_ICLIENTS, {
      iClients,
      connectionId,
    }),
  receivedTradingPartnerConnections: (connectionId, connections) =>
    action(actionTypes.CONNECTION.TRADING_PARTNER_CONNECTIONS_RECEIVED, {
      connectionId,
      connections,
    }),
  requestTradingPartnerConnections: connectionId =>
    action(actionTypes.CONNECTION.TRADING_PARTNER_CONNECTIONS_REQUEST, { connectionId }),
  madeOnline: connectionId =>
    action(actionTypes.CONNECTION.MADE_ONLINE, { connectionId }),
  requestQueuedJobsPoll: connectionId =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_REQUEST_POLL, { connectionId }),
  cancelQueuedJobsPoll: connectionId =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_CANCEL_POLL, { connectionId }),
  receivedQueuedJobs: (queuedJobs, connectionId) =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_RECEIVED, {
      queuedJobs,
      connectionId,
    }),
  cancelQueuedJob: jobId =>
    action(actionTypes.CONNECTION.QUEUED_JOB_CANCEL, { jobId }),
  updatedVersion: () => action(actionTypes.CONNECTION.UPDATED_VERSION),
  clearUpdatedVersion: () => action(actionTypes.CONNECTION.CLEAR_UPDATED_VERSION),
};
const marketplace = {
  requestConnectors: () =>
    action(actionTypes.MARKETPLACE.CONNECTORS_REQUEST, {}),
  requestTemplates: () => action(actionTypes.MARKETPLACE.TEMPLATES_REQUEST, {}),
  receivedConnectors: ({ connectors }) =>
    action(actionTypes.MARKETPLACE.CONNECTORS_RECEIVED, { connectors }),
  receivedTemplates: ({ templates }) =>
    action(actionTypes.MARKETPLACE.TEMPLATES_RECEIVED, { templates }),
  installConnector: (connectorId, sandbox, tag) =>
    action(actionTypes.MARKETPLACE.CONNECTOR_INSTALL, {
      connectorId,
      sandbox,
      tag,
    }),
  contactSales: (connectorName, _connectorId) =>
    action(actionTypes.MARKETPLACE.SALES_CONTACT, {
      connectorName,
      _connectorId,
    }),
};
const recycleBin = {
  restore: (resourceType, resourceId) =>
    action(actionTypes.RECYCLEBIN.RESTORE, { resourceType, resourceId }),
  restoreRedirectUrl: redirectTo =>
    action(actionTypes.RECYCLEBIN.RESTORE_REDIRECT_TO, { redirectTo }),
  restoreClear: () => action(actionTypes.RECYCLEBIN.RESTORE_CLEAR),
  purge: (resourceType, resourceId) =>
    action(actionTypes.RECYCLEBIN.PURGE, { resourceType, resourceId }),
};
const flowMetrics = {
  // only 'integrations and flows are valid resourceTypes. The metrics are always related to flows as of now.
  // when resourceType is integrations, fetch metrics of all enabled flows in integration
  // when resourceType is flow, fetch specific flow metrics
  request: (resourceType, resourceId, filters) =>
    action(actionTypes.FLOW_METRICS.REQUEST, {
      resourceType,
      resourceId,
      filters,
    }),

  received: (resourceId, response) =>
    action(actionTypes.FLOW_METRICS.RECEIVED, { resourceId, response }),
  clear: resourceId => action(actionTypes.FLOW_METRICS.CLEAR, { resourceId }),
  failed: resourceId => action(actionTypes.FLOW_METRICS.FAILED, { resourceId }),
  updateLastRunRange: (resourceId, startDate, endDate) => action(actionTypes.FLOW_METRICS.UPDATE_LAST_RUN_RANGE, { resourceId, startDate, endDate }),
};
const resource = {
  replaceConnection: (resourceType, _resourceId, _connectionId, _newConnectionId) =>
    action(actionTypes.RESOURCE.REPLACE_CONNECTION, {resourceType, _resourceId, _connectionId, _newConnectionId}),

  downloadFile: (id, resourceType) =>
    action(actionTypes.RESOURCE.DOWNLOAD_FILE, { resourceType, id }),
  created: (id, tempId, resourceType) =>
    action(actionTypes.RESOURCE.CREATED, { id, tempId, resourceType }),

  request: (resourceType, id, message) =>
    action(actionTypes.RESOURCE.REQUEST, { resourceType, id, message }),
  validate: (resourceType, resourceId) => action(actionTypes.RESOURCE.VALIDATE_RESOURCE, { resourceType, resourceId }),
  updateChildIntegration: (parentId, childId) =>
    action(actionTypes.RESOURCE.UPDATE_CHILD_INTEGRATION, { parentId, childId }),
  clearChildIntegration: () => action(actionTypes.RESOURCE.CLEAR_CHILD_INTEGRATION),

  requestCollection: (resourceType, message, refresh, integrationId) =>
    action(actionTypes.RESOURCE.REQUEST_COLLECTION, { resourceType, message, refresh, integrationId }),
  received: (resourceType, resource) =>
    action(actionTypes.RESOURCE.RECEIVED, { resourceType, resource }),
  collectionRequestSent: (resourceType, integrationId, refresh) =>
    action(actionTypes.RESOURCE.COLLECTION_REQUEST_SENT, {integrationId, resourceType, refresh}),
  collectionRequestSucceeded: ({ resourceType, integrationId }) => action(actionTypes.RESOURCE.COLLECTION_REQUEST_SUCCEEDED, { resourceType, integrationId }),
  collectionRequestFailed: ({resourceType, integrationId}) => action(actionTypes.RESOURCE.COLLECTION_REQUEST_FAILED, {resourceType, integrationId}),

  updated: (resourceType, resourceId, master, patch, context) =>
    action(actionTypes.RESOURCE.UPDATED, {
      resourceType,
      resourceId,
      master,
      patch,
      context,
    }),
  receivedCollection: (resourceType, collection, integrationId, isNextPageCollection) =>
    action(actionTypes.RESOURCE.RECEIVED_COLLECTION, {
      resourceType,
      collection,
      integrationId,
      isNextPageCollection,
    }),
  clearCollection: (resourceType, integrationId) =>
    action(actionTypes.RESOURCE.CLEAR_COLLECTION, { resourceType, integrationId }),
  patch: (resourceType, id, patchSet, asyncKey) =>
    action(actionTypes.RESOURCE.PATCH, { resourceType, id, patchSet, asyncKey}),
  delete: (resourceType, id) =>
    action(actionTypes.RESOURCE.DELETE, { resourceType, id }),

  deleted: (resourceType, id) =>
    action(actionTypes.RESOURCE.DELETED, { resourceType, id }),

  requestReferences: (resourceType, id, options) =>
    action(actionTypes.RESOURCE.REFERENCES_REQUEST, {
      resourceType,
      id,
      options,
    }),

  clearReferences: () => action(actionTypes.RESOURCE.REFERENCES_CLEAR, {}),

  receivedReferences: resourceReferences =>
    action(actionTypes.RESOURCE.REFERENCES_RECEIVED, {
      resourceReferences,
    }),

  removeStage: (id, predicateForPatchFilter) =>
    action(actionTypes.RESOURCE.STAGE_REMOVE, { id, predicateForPatchFilter }),

  clearStaged: id =>
    action(actionTypes.RESOURCE.STAGE_CLEAR, { id }),

  undoStaged: id =>
    action(actionTypes.RESOURCE.STAGE_UNDO, { id }),

  patchAndCommitStaged: (
    resourceType,
    resourceId,
    patch,
    {
      context,
      asyncKey,
      parentContext,
      options,
    } = {}) => action(actionTypes.RESOURCE.STAGE_PATCH_AND_COMMIT, {
    resourceType,
    id: resourceId,
    patch,
    options,
    context,
    parentContext,
    asyncKey,
  }),

  patchStaged: (id, patch) =>
    action(actionTypes.RESOURCE.STAGE_PATCH, { patch, id }),

  commitStaged: (resourceType, id, options, context, asyncKey) =>
    action(actionTypes.RESOURCE.STAGE_COMMIT, {
      resourceType,
      id,
      options,
      context,
      asyncKey,
    }),

  commitConflict: (id, conflict) =>
    action(actionTypes.RESOURCE.STAGE_CONFLICT, { conflict, id }),

  aliases: {
    requestAll: (id, resourceType) =>
      action(actionTypes.RESOURCE.REQUEST_ALL_ALIASES, {id, resourceType}),
    received: (id, aliases) =>
      action(actionTypes.RESOURCE.RECEIVED_ALIASES, {id, aliases}),
    clear: id =>
      action(actionTypes.RESOURCE.CLEAR_ALIASES, {id}),
    createOrUpdate: (id, resourceType, aliasId, isEdit, asyncKey) =>
      action(actionTypes.RESOURCE.CREATE_OR_UPDATE_ALIAS, {
        id,
        resourceType,
        aliasId,
        isEdit,
        asyncKey,
      }),
    delete: (id, resourceType, aliasId, asyncKey) =>
      action(actionTypes.RESOURCE.DELETE_ALIAS, {id, resourceType, aliasId, asyncKey}),
    actionStatus: (id, aliasId, status) =>
      action(actionTypes.RESOURCE.ALIAS_ACTION_STATUS, {id, aliasId, status}),
  },

  integrations: {
    delete: integrationId =>
      action(actionTypes.INTEGRATION.DELETE, { integrationId }),
    redirectTo: (integrationId, redirectTo) =>
      action(actionTypes.INTEGRATION.REDIRECT, {
        integrationId,
        redirectTo,
      }),
    clearRedirect: integrationId =>
      action(actionTypes.INTEGRATION.CLEAR_REDIRECT, {
        integrationId,
      }),
    isTileClick: (integrationId, isTileClick) =>
      action(actionTypes.INTEGRATION.TILE_CLICK, {
        integrationId,
        isTileClick,
      }),
    clearIsTileClick: integrationId =>
      action(actionTypes.INTEGRATION.CLEAR_TILE_CLICK, {
        integrationId,
      }),
    flowGroups: {
      createOrUpdate: (integrationId, flowGroupId, formKey) =>
        action(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE, {
          integrationId,
          flowGroupId,
          formKey,
        }),
      createOrUpdateFailed: (integrationId, error) =>
        action(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE_FAILED, {integrationId, error}),
      delete: (integrationId, flowGroupId, flowIds) =>
        action(actionTypes.INTEGRATION.FLOW_GROUPS.DELETE, {
          integrationId,
          flowGroupId,
          flowIds,
        }),
      deleteFailed: (integrationId, error) =>
        action(actionTypes.INTEGRATION.FLOW_GROUPS.DELETE_FAILED, { integrationId, error }),
      shiftOrder: (integrationId, flowGroupId, newIndex) =>
        action(actionTypes.INTEGRATION.FLOW_GROUPS.SHIFT_ORDER, {
          integrationId,
          flowGroupId,
          newIndex,
        }),
    },
  },
  connections: {
    pingAndUpdate: (connectionId, parentContext) =>
      action(actionTypes.CONNECTION.PING_AND_UPDATE, { connectionId, parentContext }),
    updateStatus: collection =>
      action(actionTypes.CONNECTION.UPDATE_STATUS, { collection }),
    refreshStatus: integrationId =>
      action(actionTypes.CONNECTION.REFRESH_STATUS, { integrationId }),
    test: (resourceId, values, parentContext) =>
      action(actionTypes.CONNECTION.TEST, {
        resourceId,
        values,
        parentContext,
      }),
    requestStatusPoll: integrationId =>
      action(actionTypes.CONNECTION.STATUS_REQUEST_POLL, { integrationId }),
    cancelStatusPoll: integrationId =>
      action(actionTypes.CONNECTION.STATUS_CANCEL_POLL, { integrationId }),
    testErrored: (resourceId, message) =>
      action(actionTypes.CONNECTION.TEST_ERRORED, {
        resourceId,
        message,
      }),
    testCancelled: (resourceId, message) =>
      action(actionTypes.CONNECTION.TEST_CANCELLED, {
        resourceId,
        message,
      }),
    testSuccessful: (resourceId, message) =>
      action(actionTypes.CONNECTION.TEST_SUCCESSFUL, {
        resourceId,
        message,
      }),
    testClear: (resourceId, retainStatus) =>
      action(actionTypes.CONNECTION.TEST_CLEAR, {
        resourceId,
        retainStatus,
      }),
    saveAndAuthorize: (resourceId, values, parentContext) =>
      action(actionTypes.RESOURCE_FORM.SAVE_AND_AUTHORIZE, {
        resourceId,
        values,
        parentContext,
      }),
    authorized: connectionId =>
      action(actionTypes.CONNECTION.AUTHORIZED, { connectionId }),
    requestToken: (resourceId, fieldId, values) =>
      action(actionTypes.TOKEN.REQUEST, {
        resourceId,
        fieldId,
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
    requestIClients: connectionId =>
      action(actionTypes.ICLIENTS, { connectionId }),

    netsuite: {
      testConnection: ({connectionId, values, hideNotificationMessage, parentContext, shouldPingConnection}) =>
        action(actionTypes.NETSUITE_USER_ROLES.REQUEST, {
          connectionId,
          values,
          hideNotificationMessage,
          parentContext,
          shouldPingConnection,
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
  notifications: {
    updateTile: (resourcesToUpdate, integrationId, options = {}) =>
      action(actionTypes.RESOURCE.UPDATE_TILE_NOTIFICATIONS, { resourcesToUpdate, integrationId, ...options }),
    updateFlow: (flowId, isSubscribed) =>
      action(actionTypes.RESOURCE.UPDATE_FLOW_NOTIFICATION, { flowId, isSubscribed }),
  },
  eventreports: {
    cancelReport: reportId => action(actionTypes.EVENT_REPORT.CANCEL, {
      reportId,
    }),
    downloadReport: reportId => action(actionTypes.EVENT_REPORT.DOWNLOAD, {
      reportId,
    }),

  },
};
// #endregion

const auditLogs = {
  request: (resourceType, resourceId, nextPagePath) => action(actionTypes.RESOURCE.REQUEST_AUDIT_LOGS, {
    resourceType: auditResourceTypePath(resourceType, resourceId),
    auditResource: resourceType,
    resourceId,
    nextPagePath,
  }),
  receivedNextPagePath: nextPagePath => action(actionTypes.RESOURCE.AUDIT_LOGS_NEXT_PATH, {
    nextPagePath,
  }),
  download: ({resourceType, resourceId, childId, filters}) => action(actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS, {
    resourceType,
    resourceId,
    childId,
    filters,
  }),
  toggleHasMoreDownloads: hasMoreDownloads => action(actionTypes.RESOURCE.AUDIT_LOGS_HAS_MORE_DOWNLOADS, {hasMoreDownloads}),
  clear: () => action(actionTypes.RESOURCE.AUDIT_LOGS_CLEAR),
};
const connectors = {
  refreshMetadata: (fieldType, fieldName, _integrationId, options) =>
    action(actionTypes.CONNECTORS.METADATA_REQUEST, {
      fieldType,
      fieldName,
      _integrationId,
      options,
    }),
  failedMetadata: (fieldName, _integrationId) =>
    action(actionTypes.CONNECTORS.METADATA_FAILURE, {
      fieldName,
      _integrationId,
    }),
  clearMetadata: (fieldName, _integrationId) =>
    action(actionTypes.CONNECTORS.METADATA_CLEAR, {
      fieldName,
      _integrationId,
    }),
  clearStatus: (fieldName, _integrationId) =>
    action(actionTypes.CONNECTORS.STATUS_CLEAR, {
      fieldName,
      _integrationId,
    }),
  receivedMetadata: (metadata, fieldType, fieldName, _integrationId) =>
    action(actionTypes.CONNECTORS.METADATA_RECEIVED, {
      metadata,
      fieldType,
      fieldName,
      _integrationId,
    }),
  installBase: {
    update: ({ _integrationIds, connectorId }) =>
      action(actionTypes.CONNECTORS.INSTALLBASE.UPDATE, {
        _integrationIds,
        connectorId,
      }),
  },
  publish: {
    request: (_integrationId, isPublished) =>
      action(actionTypes.CONNECTORS.PUBLISH.REQUEST, {
        _integrationId,
        isPublished,
      }),
    success: _integrationId =>
      action(actionTypes.CONNECTORS.PUBLISH.SUCCESS, {
        _integrationId,
      }),
    error: _integrationId =>
      action(actionTypes.CONNECTORS.PUBLISH.ERROR, {
        _integrationId,
      }),
  },
};
const metadata = {
  request: (connectionId, commMetaPath, addInfo) =>
    action(actionTypes.METADATA.REQUEST, {
      connectionId,
      commMetaPath,
      addInfo,
    }),
  refresh: (connectionId, commMetaPath, addInfo) =>
    action(actionTypes.METADATA.REFRESH, {
      connectionId,
      commMetaPath,
      addInfo,
    }),
  receivedCollection: (metadata, connectionId, commMetaPath) =>
    action(actionTypes.METADATA.RECEIVED, {
      metadata,
      connectionId,
      commMetaPath,
    }),
  receivedError: (metadataError, connectionId, commMetaPath) =>
    action(actionTypes.METADATA.RECEIVED_ERROR, {
      metadataError,
      connectionId,
      commMetaPath,
    }),
  validationError: (validationError, connectionId, commMetaPath) =>
    action(actionTypes.METADATA.VALIDATION_ERROR, {
      validationError,
      connectionId,
      commMetaPath,
    }),
  requestAssistantImportPreview: resourceId =>
    action(actionTypes.METADATA.ASSISTANT_PREVIEW_REQUESTED, {
      resourceId,
    }),

  receivedAssistantImportPreview: (resourceId, previewData) =>
    action(actionTypes.METADATA.ASSISTANT_PREVIEW_RECEIVED, {
      resourceId,
      previewData,
    }),
  failedAssistantImportPreview: resourceId =>
    action(actionTypes.METADATA.ASSISTANT_PREVIEW_FAILED, {
      resourceId,
    }),
  resetAssistantImportPreview: resourceId =>
    action(actionTypes.METADATA.ASSISTANT_PREVIEW_RESET, {
      resourceId,
    }),
  setRequestStatus: (connectionId, commMetaPath) =>
    action(actionTypes.METADATA.SET_REQUEST_STATUS, {
      connectionId,
      commMetaPath,
    }),
  getBundleInstallStatus: connectionId =>
    action(actionTypes.METADATA.BUNDLE_INSTALL_STATUS, {
      connectionId,
    }),
};
const fileDefinitions = {
  preBuilt: {
    request: () => action(actionTypes.FILE_DEFINITIONS.PRE_BUILT.REQUEST),
    received: fileDefinitions =>
      action(actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED, {
        fileDefinitions,
      }),
    receivedError: error =>
      action(actionTypes.FILE_DEFINITIONS.PRE_BUILT.RECEIVED_ERROR, {
        error,
      }),
  },
  definition: {
    preBuilt: {
      request: (format, definitionId) =>
        action(actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.UPDATE, {
          format,
          definitionId,
        }),
      received: (definition, format, definitionId) =>
        action(actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.RECEIVED, {
          definition,
          format,
          definitionId,
        }),
    },
    userDefined: {
      save: (definitionRules, formValues, flowId, skipClose) =>
        action(actionTypes.FILE_DEFINITIONS.DEFINITION.USER_DEFINED.SAVE, {
          definitionRules,
          formValues,
          flowId,
          skipClose,
        }),
    },
  },
};
const integrationApp = {
  settings: {
    categoryMappings: {
      requestMetadata: (
        integrationId,
        flowId,
        categoryId,
        options
      ) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_CATEGORY_MAPPING_METADATA,
          { integrationId, flowId, categoryId, options }
        ),
      receivedGeneratesMetadata: (
        integrationId,
        flowId,
        metadata
      ) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS
            .RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA,
          { integrationId, flowId, metadata }
        ),
      init: opts => action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT, opts),
      initComplete: (integrationId, flowId, id, options) => action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT_COMPLETE, {
        integrationId,
        flowId,
        id,
        options,
      }),
      clear: (integrationId, flowId) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.CLEAR, {
          integrationId,
          flowId,
        }),
      clearSaveStatus: (integrationId, flowId) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .CLEAR_SAVE_STATUS,
          {
            integrationId,
            flowId,
          }
        ),
      patchField: (integrationId, flowId, id, field, key, value) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.PATCH_FIELD,
          {
            integrationId,
            flowId,
            id,
            field,
            key,
            value,
          }
        ),
      patchSettings: (integrationId, flowId, id, key, value) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .PATCH_SETTINGS,
          { integrationId, flowId, id, key, value }
        ),
      delete: (integrationId, flowId, id, key) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.DELETE, {
          integrationId,
          flowId,
          id,
          key,
        }),
      collapseAll: (integrationId, flowId) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.COLLAPSE_ALL,
          { integrationId, flowId }
        ),
      expandAll: (integrationId, flowId) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.EXPAND_ALL,
          { integrationId, flowId }
        ),
      clearCollapseStatus: (integrationId, flowId) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .CLEAR_COLLAPSE_STATUS,
          { integrationId, flowId }
        ),
      updateLookup: (integrationId, flowId, id, oldValue, newValue) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.UPDATE_LOOKUP,
          {
            integrationId,
            flowId,
            id,
            oldValue,
            newValue,
          }
        ),
      saveVariationMappings: (integrationId, flowId, id, data = {}) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .SAVE_VARIATION_MAPPINGS,
          {
            integrationId,
            flowId,
            id,
            data,
          }
        ),
      cancelVariationMappings: (integrationId, flowId, id) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .CANCEL_VARIATION_MAPPINGS,
          {
            integrationId,
            flowId,
            id,
          }
        ),
      save: (integrationId, flowId, closeOnSave) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE, {
          integrationId,
          flowId,
          closeOnSave,
        }),

      saveFailed: (integrationId, flowId, id) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE_FAILED,
          { integrationId, flowId, id }
        ),
      loadFailed: (integrationId, flowId, id) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.LOAD_FAILED,
          { integrationId, flowId, id }
        ),
      setFilters: (integrationId, flowId, filters) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SET_FILTERS, {
          integrationId,
          flowId,
          filters,
        }),
      addCategory: (integrationId, flowId, data) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.ADD_CATEGORY, {
          integrationId,
          flowId,
          data,
        }),
      deleteCategory: (integrationId, flowId, sectionId, depth) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.DELETE_CATEGORY, {
          integrationId,
          flowId,
          sectionId,
          depth,
        }),
      restoreCategory: (integrationId, flowId, sectionId, depth) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.RESTORE_CATEGORY, {
          integrationId,
          flowId,
          sectionId,
          depth,
        }),
      receivedUpdatedMappingData: (integrationId, flowId, mappingData) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.RECEIVED_UPDATED_MAPPING_DATA,
          { integrationId, flowId, mappingData }
        ),
    },
    integrationAppV2: {
      upgrade: integrationId =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.V2.UPGRADE, {
          integrationId,
        }),
    },
    initComplete: (integrationId, flowId, sectionId) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.FORM.INIT_COMPLETE, {
        integrationId,
        flowId,
        sectionId,
      }),
    requestUpgrade: (integrationId, options) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_UPGRADE, {
        integrationId,
        options,
      }),
    receivedCategoryMappingMetadata: (integrationId, flowId, metadata) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS
          .RECEIVED_CATEGORY_MAPPING_METADATA,
        { integrationId, flowId, metadata }
      ),
    requestedUpgrade: licenseId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE_REQUESTED, {
        licenseId,
      }),
    requestAddOnLicenseMetadata: integrationId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA, {
        integrationId,
      }),
    addOnLicenseMetadataUpdate: (integrationId, response) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA_UPDATE,
        {
          integrationId,
          response,
        }
      ),
    addOnLicenseMetadataFailed: integrationId =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.ADDON_LICENSES_METADATA_FAILURE,
        {
          integrationId,
        }
      ),
    requestMappingMetadata: integrationId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_REQUEST, {
        integrationId,
      }),
    mappingMetadataUpdate: (integrationId, response) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_UPDATE, {
        integrationId,
        response,
      }),
    mappingMetadataError: (integrationId, error) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.MAPPING_METADATA_ERROR, {
        integrationId,
        error,
      }),
    upgrade: (integrationId, license) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE, {
        integrationId,
        license,
      }),
    update: (integrationId, flowId, childId, sectionId, values, options) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE, {
        integrationId,
        flowId,
        childId,
        sectionId,
        values,
        options,
      }),
    clear: (integrationId, flowId, sectionId) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.FORM.CLEAR, {
        integrationId,
        flowId,
        sectionId,
      }),
    submitComplete: params =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_COMPLETE,
        params
      ),
    submitFailed: params =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_FAILED, params),
  },
  utility: {
    requestS3Key: params => action(actionTypes.INTEGRATION_APPS.UTILITY.REQUEST_S3_KEY, params),
    receivedS3Key: params => action(actionTypes.INTEGRATION_APPS.UTILITY.RECEIVED_S3_RUN_KEY, params),
    clearRunKey: integrationId => action(actionTypes.INTEGRATION_APPS.UTILITY.CLEAR_RUN_KEY, {integrationId}),
    s3KeyError: params => action(actionTypes.INTEGRATION_APPS.UTILITY.S3_KEY_FAILED, params),
  },
  installer: {
    init: integrationId => action(actionTypes.INTEGRATION_APPS.INSTALLER.INIT, {
      id: integrationId,
    }),
    setOauthConnectionMode: (connectionId, openOauthConnection, id) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.RECEIVED_OAUTH_CONNECTION_STATUS, {
        connectionId, openOauthConnection, id,
      }),
    initChild: integrationId => action(actionTypes.INTEGRATION_APPS.INSTALLER.INIT_CHILD, {
      id: integrationId,
    }),
    installStep: (integrationId, installerFunction, childId, addOnId, formVal) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, {
        id: integrationId,
        installerFunction,
        childId,
        addOnId,
        formVal,
      }),
    scriptInstallStep: (
      integrationId,
      connectionId,
      connectionDoc,
      formSubmission,
      stackId
    ) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.SCRIPT_REQUEST, {
        id: integrationId,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId,
      }),
    updateStep: (integrationId, installerFunction, update, formMeta, url) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.UPDATE, {
        id: integrationId,
        installerFunction,
        update,
        formMeta,
        url,
      }),
    completedStepInstall: (stepCompleteResponse, id, installerFunction) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.DONE, {
        stepsToUpdate: stepCompleteResponse.stepsToUpdate,
        id,
        installerFunction,
      }),
    getCurrentStep: (integrationId, step) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.CURRENT_STEP, {
        id: integrationId,
        step,
      }),
  },
  uninstaller: {
    preUninstall: (childId, integrationId) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL, {
        childId,
        id: integrationId,
      }),
    clearSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.CLEAR, {
        id: integrationId,
      }),
    updateStep: (integrationId, uninstallerFunction, update) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.UPDATE, {
        id: integrationId,
        uninstallerFunction,
        update,
      }),
    stepUninstall: (childId, integrationId, uninstallerFunction, addOnId) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.REQUEST, {
        childId,
        id: integrationId,
        uninstallerFunction,
        addOnId,
      }),
    receivedUninstallSteps: (uninstallSteps, id) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.RECEIVED_STEPS, {
        uninstallSteps,
        id,
      }),
    failedUninstallSteps: (id, error, childId) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.FAILED_UNINSTALL_STEPS, {
        id,
        error,
        childId,
      }),
    uninstallIntegration: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.DELETE_INTEGRATION, {
        integrationId,
      }),
  },
  templates: {
    installer: {
      verifyBundleOrPackageInstall: (id, connectionId, installerFunction, isFrameWork2, variant, isManualVerification) =>
        action(actionTypes.INTEGRATION_APPS.TEMPLATES.INSTALLER.VERIFY_BUNDLE_INSTALL, {
          id,
          connectionId,
          installerFunction,
          isFrameWork2,
          variant,
          isManualVerification,
        }),
    },
    upgrade: {
      installer: {
        verifyBundleOrPackageInstall: (id, connectionId, installerFunction, isFrameWork2, variant, isManualVerification) =>
          action(actionTypes.INTEGRATION_APPS.TEMPLATES.INSTALLER.VERIFY_BUNDLE_INSTALL, {
            id,
            connectionId,
            installerFunction,
            isFrameWork2,
            variant,
            isManualVerification,
          }),
      },
    },
  },
  uninstaller2: {
    init: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.INIT, {
        id: integrationId,
      }),
    failed: (integrationId, error) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.FAILED, {
        id: integrationId,
        error,
      }),
    receivedSteps: (integrationId, uninstallSteps) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.RECEIVED_STEPS, {
        id: integrationId,
        uninstallSteps,
      }),
    requestSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.REQUEST_STEPS, {
        id: integrationId,
      }),
    updateStep: (integrationId, update) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.STEP.UPDATE, {
        id: integrationId,
        update,
      }),
    uninstallStep: (integrationId, formVal) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.STEP.UNINSTALL, {
        id: integrationId,
        formVal,
      }),
    clearSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.CLEAR_STEPS, {
        id: integrationId,
      }),
    complete: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER2.COMPLETE, {
        id: integrationId,
      }),
  },
  child: {
    addNew: integrationId =>
      action(actionTypes.INTEGRATION_APPS.CHILD.ADD, { id: integrationId }),
    updateStep: (integrationId, installerFunction, update, showForm) =>
      action(actionTypes.INTEGRATION_APPS.CHILD.UPDATE, {
        id: integrationId,
        installerFunction,
        update,
        showForm,
      }),
    clearSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.CHILD.CLEAR, { id: integrationId }),
    completedStepInstall: (integrationId, installerFunction, steps) =>
      action(actionTypes.INTEGRATION_APPS.CHILD.COMPLETE, {
        id: integrationId,
        installerFunction,
        steps,
      }),
    installStep: (integrationId, installerFunction, formVal) =>
      action(actionTypes.INTEGRATION_APPS.CHILD.INSTALL, {
        id: integrationId,
        installerFunction,
        formVal,
      }),
    failedNewChildSteps: (integrationId, message) =>
      action(actionTypes.INTEGRATION_APPS.CHILD.FAILURE, {
        id: integrationId,
        message,
      }),
    receivedNewChildSteps: (integrationId, steps) =>
      action(actionTypes.INTEGRATION_APPS.CHILD.RECEIVED, {
        id: integrationId,
        steps,
      }),
  },
  clone: {
    receivedIntegrationClonedStatus: (id, integrationId, error, sandbox) =>
      action(actionTypes.INTEGRATION_APPS.CLONE.STATUS, {
        id,
        isCloned: !error,
        integrationId,
        sandbox,
      }),
    clearIntegrationClonedStatus: id =>
      action(actionTypes.INTEGRATION_APPS.CLONE.STATUS, {
        id,
        isCloned: false,
      }),
  },
  // TODO: Need to changes naming convention here as it is applicable to both Install and uninstall
  isAddonInstallInprogress: (installInprogress, id) =>
    action(actionTypes.INTEGRATION_APPS.ADDON.RECEIVED_INSTALL_STATUS, {
      installInprogress,
      id,
    }),
  license: {
    resume: integrationId => action(actionTypes.INTEGRATION_APPS.LICENSE.RESUME, {
      integrationId,
    }),
  },
  upgrade: {
    setStatus: (integrationId, statusObj) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.V2.SET_STATUS, {
        id: integrationId,
        statusObj,
      }),
    getSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.V2.GET_STEPS, {
        integrationId,
      }),
    postChangeEditonSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.V2.POST_CHANGE_EDITION_STEPS, {
        integrationId,
      }),
    addChildForUpgrade: childList =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.V2.ADD_CHILD_UPGRADE_LIST, {
        childList,
      }),
    deleteStatus: integrationId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.V2.DELETE_STATUS, {
        id: integrationId,
      }),
    installer: {
      init: integrationId => action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.INIT, {
        id: integrationId,
      }),
      setOauthConnectionMode: (connectionId, openOauthConnection, id) =>
        action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.RECEIVED_OAUTH_CONNECTION_STATUS, {
          connectionId, openOauthConnection, id,
        }),
      initChild: integrationId => action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.INIT_CHILD, {
        id: integrationId,
      }),
      installStep: (integrationId, installerFunction, childId, addOnId, formVal) =>
        action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.REQUEST, {
          id: integrationId,
          installerFunction,
          childId,
          addOnId,
          formVal,
        }),
      scriptInstallStep: (
        integrationId,
        connectionId,
        connectionDoc,
        formSubmission,
        stackId
      ) =>
        action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.SCRIPT_REQUEST, {
          id: integrationId,
          connectionId,
          connectionDoc,
          formSubmission,
          stackId,
        }),
      updateStep: (integrationId, installerFunction, update, formMeta, url) =>
        action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.UPDATE, {
          id: integrationId,
          installerFunction,
          update,
          formMeta,
          url,
        }),
      completedStepInstall: (stepCompleteResponse, id, installerFunction) =>
        action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.DONE, {
          stepsToUpdate: stepCompleteResponse.stepsToUpdate,
          id,
          installerFunction,
        }),
      getCurrentStep: (integrationId, step) =>
        action(actionTypes.INTEGRATION_APPS.INSTALLER.V2.STEP.CURRENT_STEP, {
          id: integrationId,
          step,
        }),
    },
  },
  landingPage: {
    requestIntegrations: ({ clientId }) => action(actionTypes.INTEGRATION_APPS.LANDING_PAGE.REQUEST_INTEGRATIONS, {
      clientId,
    }),
    receivedIntegrations: ({ integrations }) => action(actionTypes.INTEGRATION_APPS.LANDING_PAGE.RECEIVED_INTEGRATIONS, {
      integrations,
    }),
  },
};
const clone = {
  requestPreview: (resourceType, resourceId) =>
    action(actionTypes.CLONE.PREVIEW_REQUEST, { resourceType, resourceId }),
  createComponents: (resourceType, resourceId) =>
    action(actionTypes.CLONE.CREATE_COMPONENTS, { resourceType, resourceId }),
};
const template = {
  generateZip: integrationId =>
    action(actionTypes.TEMPLATE.ZIP_GENERATE, { integrationId }),
  requestPreview: templateId =>
    action(actionTypes.TEMPLATE.PREVIEW_REQUEST, { templateId }),
  installStepsReceived: (installSteps, connectionMap, templateId, data) =>
    action(actionTypes.TEMPLATE.STEPS_RECEIVED, {
      installSteps,
      connectionMap,
      templateId,
      data,
    }),
  failedPreview: templateId =>
    action(actionTypes.TEMPLATE.FAILURE, { templateId }),
  failedInstall: templateId =>
    action(actionTypes.TEMPLATE.INSTALL_FAILURE, { templateId }),
  createdComponents: (components, templateId) =>
    action(actionTypes.TEMPLATE.CREATED_COMPONENTS, { components, templateId }),
  receivedPreview: (components, templateId, isInstallIntegration) =>
    action(actionTypes.TEMPLATE.RECEIVED_PREVIEW, {
      components,
      templateId,
      isInstallIntegration,
    }),
  updateStep: (step, templateId) =>
    action(actionTypes.TEMPLATE.UPDATE_STEP, { step, templateId }),
  createComponents: (templateId, runKey) =>
    action(actionTypes.TEMPLATE.CREATE_COMPONENTS, { templateId, runKey }),
  clearUploaded: templateId =>
    action(actionTypes.TEMPLATE.CLEAR_UPLOADED, { templateId }),
  clearTemplate: templateId =>
    action(actionTypes.TEMPLATE.CLEAR_TEMPLATE, { templateId }),
  verifyBundleOrPackageInstall: (step, connection, templateId, variant, isManualVerification) =>
    action(actionTypes.TEMPLATE.VERIFY_BUNDLE_INSTALL, {
      step,
      connection,
      templateId,
      variant,
      isManualVerification,
    }),
  publish: {
    request: (templateId, isPublished) =>
      action(actionTypes.TEMPLATE.PUBLISH.REQUEST, {
        templateId,
        isPublished,
      }),
    success: templateId =>
      action(actionTypes.TEMPLATE.PUBLISH.SUCCESS, {
        templateId,
      }),
    error: templateId =>
      action(actionTypes.TEMPLATE.PUBLISH.ERROR, {
        templateId,
      }),
  },
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
const file = {
  previewZip: file => action(actionTypes.FILE.PREVIEW_ZIP, { file }),
  upload: ({resourceType, resourceId, fileType, file, asyncKey}) =>
    action(actionTypes.FILE.UPLOAD, {
      resourceType,
      resourceId,
      fileType,
      file,
      asyncKey,
    }),
  processFile: ({ fileId, file, fileType, fileProps }) =>
    action(actionTypes.FILE.PROCESS, {
      fileId,
      file,
      fileType,
      fileProps,
    }),
  processedFile: ({ fileId, file, fileProps }) =>
    action(actionTypes.FILE.PROCESSED, {
      fileId,
      file,
      fileProps,
    }),
  processError: ({ fileId, error }) =>
    action(actionTypes.FILE.PROCESS_ERROR, { fileId, error }),
  reset: fileId => action(actionTypes.FILE.RESET, { fileId }),
};
const transfer = {
  cancel: id => action(actionTypes.TRANSFER.CANCEL, { id }),
  preview: data => action(actionTypes.TRANSFER.PREVIEW, { data }),
  receivedPreview: ({ response, error }) =>
    action(actionTypes.TRANSFER.RECEIVED_PREVIEW, { response, error }),
  clearPreview: () => action(actionTypes.TRANSFER.CLEAR_PREVIEW),
  create: data => action(actionTypes.TRANSFER.CREATE, { data }),
  canceledTransfer: id => action(actionTypes.TRANSFER.CANCELLED, { id }),
};
const stack = {
  displayToken: id => action(actionTypes.STACK.TOKEN_DISPLAY, { id }),
  generateToken: id => action(actionTypes.STACK.TOKEN_GENERATE, { id }),
  tokenReceived: stackToken =>
    action(actionTypes.STACK.TOKEN_RECEIVED, { stackToken }),
  maskToken: stackToken => action(actionTypes.STACK.TOKEN_MASK, { stackToken }),
  inviteStackShareUser: (email, stackId) =>
    action(actionTypes.STACK.SHARE_USER_INVITE, { email, stackId }),
  toggleUserStackSharing: userId =>
    action(actionTypes.STACK.USER_SHARING_TOGGLE, { userId }),
  toggledUserStackSharing: ({ userId }) =>
    action(actionTypes.STACK.USER_SHARING_TOGGLED, { id: userId }),
  reInviteStackUser: (userInfo, userId) =>
    action(actionTypes.STACK.USER_REINVITE, { userInfo, userId }),
};
const user = {
  toggleDebug: () => action(actionTypes.TOGGLE_DEBUG),
  profile: {
    request: message => resource.request('profile', undefined, message),
    delete: () => action(actionTypes.USER.PROFILE.DELETE),
    update: profile => action(actionTypes.USER.PROFILE.UPDATE, { profile }),
    unlinkWithGoogle: () => action(actionTypes.USER.PROFILE.UNLINK_WITH_GOOGLE),
    unlinkedWithGoogle: () => action(actionTypes.USER.PROFILE.UNLINKED_WITH_GOOGLE),
  },
  org: {
    users: {
      requestCollection: message =>
        resource.requestCollection('ashares', message),
      create: (user, asyncKey) => action(actionTypes.USER.CREATE, { user, asyncKey }),
      created: user => action(actionTypes.USER.CREATED, { user }),
      update: (_id, user, asyncKey) => action(actionTypes.USER.UPDATE, { _id, user, asyncKey }),
      updated: user => action(actionTypes.USER.UPDATED, { user }),
      delete: (_id, isSwitchAccount) => action(actionTypes.USER.DELETE, { _id, isSwitchAccount }),
      deleted: _id => action(actionTypes.USER.DELETED, { _id }),
      disable: (_id, disabled, isSwitchAccount) =>
        action(actionTypes.USER.DISABLE, { _id, disabled, isSwitchAccount }),
      disabled: _id => action(actionTypes.USER.DISABLED, { _id }),
      reinvited: _id => action(actionTypes.USER.REINVITED, { _id }),
      makeOwner: email => action(actionTypes.USER.MAKE_OWNER, { email }),
      reinvite: _id => action(actionTypes.USER.REINVITE, { _id }),
      reinviteError: _id => action(actionTypes.USER.REINVITE_ERROR, { _id }),
    },
    accounts: {
      requestCollection: message =>
        resource.requestCollection('shared/ashares', undefined, message),
      leave: (id, isSwitchAccount) => action(actionTypes.USER.ACCOUNT.LEAVE_REQUEST, { id, isSwitchAccount }),
      switchTo: ({ id }) => action(actionTypes.USER.ACCOUNT.SWITCH, { preferences: { defaultAShareId: id, environment: 'production' } }),
      switchToComplete: () => action(actionTypes.USER.ACCOUNT.SWITCH_COMPLETE),
      addLinkedConnectionId: connectionId =>
        action(actionTypes.USER.ACCOUNT.ADD_SUITESCRIPT_LINKED_CONNECTION, {
          connectionId,
        }),
      deleteLinkedConnectionId: connectionId =>
        action(actionTypes.USER.ACCOUNT.DELETE_SUITESCRIPT_LINKED_CONNECTION, {
          connectionId,
        }),
    },
  },
  preferences: {
    request: message => resource.request('preferences', undefined, message),
    update: (preferences, skipSaga) =>
      action(actionTypes.USER.PREFERENCES.UPDATE, { preferences, skipSaga }),
    pinIntegration: integrationKey => action(actionTypes.USER.PREFERENCES.PIN_INTEGRATION, { integrationKey }),
    unpinIntegration: integrationKey => action(actionTypes.USER.PREFERENCES.UNPIN_INTEGRATION, { integrationKey }),
  },
  sharedNotifications: {
    acceptInvite: (resourceType, id, isAccountTransfer) =>
      action(actionTypes.USER.SHARED_NOTIFICATION_ACCEPT, { resourceType, id, isAccountTransfer }),
    rejectInvite: (resourceType, id) =>
      action(actionTypes.USER.SHARED_NOTIFICATION_REJECT, { resourceType, id }),
  },
};
const license = {
  refreshCollection: () => action(actionTypes.LICENSE.REFRESH_COLLECTION),
  requestLicenses: message =>
    resource.requestCollection('licenses', undefined, message),
  requestTrialLicense: () => action(actionTypes.LICENSE.TRIAL_REQUEST, {}),
  trialLicenseIssued: message =>
    action(actionTypes.LICENSE.TRIAL_ISSUED, message),
  requestLicenseUpgrade: () =>
    action(actionTypes.LICENSE.UPGRADE_REQUEST, {}),
  requestUpdate: (actionType, {connectorId, licenseId, feature}) =>
    action(actionTypes.LICENSE.UPDATE_REQUEST, { actionType, connectorId, licenseId, feature }),
  licenseUpgradeRequestSubmitted: (message, feature, isTwoDotZero) =>
    action(actionTypes.LICENSE.UPGRADE_REQUEST_SUBMITTED, { message, feature, isTwoDotZero }),
  licenseReactivated: () =>
    action(actionTypes.LICENSE.REACTIVATED),
  ssoLicenseUpgradeRequested: () =>
    action(actionTypes.LICENSE.SSO.UPGRADE_REQUESTED),
  dataRetentionLicenseUpgradeRequested: () =>
    action(actionTypes.LICENSE.DATA_RETENTION.UPGRADE_REQUESTED),
  requestLicenseEntitlementUsage: () =>
    action(actionTypes.LICENSE.ENTITLEMENT_USAGE_REQUEST),
  requestNumEnabledFlows: () =>
    action(actionTypes.LICENSE.NUM_ENABLED_FLOWS_REQUEST, {}),
  receivedNumEnabledFlows: response =>
    action(actionTypes.LICENSE.NUM_ENABLED_FLOWS_RECEIVED, { response }),
  receivedLicenseEntitlementUsage: response =>
    action(actionTypes.LICENSE.ENTITLEMENT_USAGE_RECEIVED, { response }),
  clearActionMessage: () =>
    action(actionTypes.LICENSE.CLEAR_ACTION_MESSAGE),
  receivedLicenseErrorMessage: (code, message) => action(actionTypes.LICENSE.ERROR_MESSAGE_RECEIVED, { code, message }),
  clearErrorMessage: () => action(actionTypes.LICENSE.CLEAR_ERROR_MESSAGE),

};
const importSampleData = {
  request: (resourceId, options, refreshCache) =>
    action(actionTypes.IMPORT_SAMPLEDATA.REQUEST, {
      resourceId,
      options,
      refreshCache,
    }),
  iaMetadataRequest: ({ _importId }) =>
    action(actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_REQUEST, {
      _importId,
    }),
  iaMetadataReceived: ({ _importId, metadata }) =>
    action(actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_RECEIVED, {
      _importId,
      metadata,
    }),
  iaMetadataFailed: ({ _importId }) =>
    action(actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_FAILED, {
      _importId,
    }),
};
const flowData = {
  init: flow => action(actionTypes.FLOW_DATA.INIT, { flow }),
  requestStage: (flowId, resourceId, stage) =>
    action(actionTypes.FLOW_DATA.STAGE_REQUEST, { flowId, resourceId, stage }),
  receivedPreviewData: (flowId, resourceId, previewData, previewType) =>
    action(actionTypes.FLOW_DATA.PREVIEW_DATA_RECEIVED, {
      flowId,
      resourceId,
      previewData,
      previewType,
    }),
  setStatusReceived: (flowId, resourceId, previewType) =>
    action(actionTypes.FLOW_DATA.SET_STATUS_RECEIVED, {
      flowId,
      resourceId,
      previewType,
    }),
  receivedProcessorData: (flowId, resourceId, processor, processedData) =>
    action(actionTypes.FLOW_DATA.PROCESSOR_DATA_RECEIVED, {
      flowId,
      resourceId,
      processor,
      processedData,
    }),
  receivedError: (flowId, resourceId, stage, error) =>
    action(actionTypes.FLOW_DATA.RECEIVED_ERROR, {
      flowId,
      resourceId,
      stage,
      error,
    }),
  requestSampleData: (flowId, resourceId, resourceType, stage, refresh, formKey) =>
    action(actionTypes.FLOW_DATA.SAMPLE_DATA_REQUEST, {
      flowId,
      resourceId,
      resourceType,
      stage,
      refresh,
      formKey,
    }),
  resetStages: (flowId, resourceId, stages = [], statusToUpdate) =>
    action(actionTypes.FLOW_DATA.RESET_STAGES, { flowId, resourceId, stages, statusToUpdate }),
  resetFlowSequence: (flowId, updatedFlow) =>
    action(actionTypes.FLOW_DATA.FLOW_SEQUENCE_RESET, { flowId, updatedFlow }),
  updateFlowsForResource: (resourceId, resourceType, stagesToReset = []) =>
    action(actionTypes.FLOW_DATA.FLOWS_FOR_RESOURCE_UPDATE, {
      resourceId,
      resourceType,
      stagesToReset,
    }),
  updateFlow: flowId => action(actionTypes.FLOW_DATA.FLOW_UPDATE, { flowId }),
  updateResponseMapping: (flowId, resourceIndex, responseMapping, {routerIndex, branchIndex} = {}) =>
    action(actionTypes.FLOW_DATA.FLOW_RESPONSE_MAPPING_UPDATE, {
      flowId,
      resourceIndex,
      routerIndex,
      branchIndex,
      responseMapping,
    }),
  clear: flowId => action(actionTypes.FLOW_DATA.CLEAR, { flowId }),
};
const resourceFormSampleData = {
  request: (formKey, options) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUEST, { formKey, options }),
  setStatus: (resourceId, status) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_STATUS, { resourceId, status }),
  receivedPreviewStages: (resourceId, previewStagesData) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_STAGES, { resourceId, previewStagesData }),
  receivedPreviewError: (resourceId, previewError) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_ERROR, { resourceId, previewError }),
  receivedProcessorError: (resourceId, processorError) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PROCESSOR_ERROR, { resourceId, processorError }),
  setParseData: (resourceId, parseData) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_PARSE_DATA, { resourceId, parseData }),
  setRawData: (resourceId, rawData) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_RAW_FILE_DATA, { resourceId, rawData }),
  setPreviewData: (resourceId, previewData) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_PREVIEW_DATA, { resourceId, previewData }),
  setCsvFileData: (resourceId, csvData) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_CSV_FILE_DATA, { resourceId, csvData }),
  setProcessorData: ({resourceId, processor, processorData}) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_PROCESSOR_DATA, { resourceId, processor, processorData }),
  updateRecordSize: (resourceId, recordSize) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.UPDATE_RECORD_SIZE, { resourceId, recordSize }),
  clear: resourceId => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.CLEAR, { resourceId }),
  clearStages: resourceId => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.CLEAR_STAGES, { resourceId }),
  updateType: (resourceId, sampleDataType) => action(actionTypes.RESOURCE_FORM_SAMPLE_DATA.UPDATE_DATA_TYPE, { resourceId, sampleDataType }),
};
const mockInput = {
  request: (resourceId, resourceType, flowId, options) => action(actionTypes.MOCK_INPUT.REQUEST, {resourceId, resourceType, flowId, options}),
  received: (resourceId, data) => action(actionTypes.MOCK_INPUT.RECEIVED, {resourceId, data}),
  receivedError: (resourceId, error) => action(actionTypes.MOCK_INPUT.RECEIVED_ERROR, {resourceId, error}),
  updateUserMockInput: (resourceId, data) => action(actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT, {resourceId, data}),
  clear: resourceId => action(actionTypes.MOCK_INPUT.CLEAR, {resourceId}),
};
const app = {
  polling: {
    start: (pollAction, duration) => action(actionTypes.APP.POLLING.START, {pollAction, duration}),
    slowDown: () => action(actionTypes.APP.POLLING.SLOW),
    resume: () => action(actionTypes.APP.POLLING.RESUME),
    stop: () => action(actionTypes.APP.POLLING.STOP),
    stopSpecificPollProcess: pollActionToStop => action(actionTypes.APP.POLLING.STOP_SPECIFIC_POLL, {pollActionToStop}),
  },
  fetchUiVersion: () => action(actionTypes.APP.UI_VERSION_FETCH),
  updateUIVersion: version => action(actionTypes.APP.UI_VERSION_UPDATE, { version }),
  reload: () => action(actionTypes.APP.RELOAD),
  deleteDataState: () => action(actionTypes.APP.DELETE_DATA_STATE),
  errored: () => action(actionTypes.APP.ERRORED),
  clearError: () => action(actionTypes.APP.CLEAR_ERROR),
  userAcceptedAccountTransfer: () => action(actionTypes.APP.USER_ACCEPTED_ACCOUNT_TRANSFER),
  postFeedback: (resourceType, fieldId, helpful, feedback) =>
    action(actionTypes.APP.POST_FEEDBACK, {
      resourceType,
      fieldId,
      helpful,
      feedback,
    }),
};

const concur = {
  connect: data => action(actionTypes.CONCUR.CONNECT, data),
  connectError: error => action(actionTypes.CONCUR.CONNECT_ERROR, {error}),
  connectSuccess: payload => action(actionTypes.CONCUR.CONNECT_SUCCESS, {payload}),
};

const patchFilter = (name, filter) =>
  action(actionTypes.PATCH_FILTER, { name, filter });
const clearFilter = name => action(actionTypes.CLEAR_FILTER, { name });

// #region Editor actions
const editor = {
  init: (id, editorType, options) =>
    action(actionTypes.EDITOR.INIT, { id, editorType, options }),
  initComplete: (id, options) =>
    action(actionTypes.EDITOR.INIT_COMPLETE, { id, options }),
  changeLayout: (id, newLayout) =>
    action(actionTypes.EDITOR.CHANGE_LAYOUT, { id, newLayout }),
  patchFeatures: (id, featuresPatch) =>
    action(actionTypes.EDITOR.PATCH.FEATURES, { id, featuresPatch }),
  patchRule: (id, rulePatch, options) =>
    action(actionTypes.EDITOR.PATCH.RULE, { id, rulePatch, ...options }),
  patchData: (id, dataPatch) =>
    action(actionTypes.EDITOR.PATCH.DATA, { id, dataPatch }),
  patchFileKeyColumn: (id, fileKeyPatchType, fileKeyPatch) =>
    action(actionTypes.EDITOR.PATCH.FILE_KEY_COLUMN, {
      id,
      fileKeyPatchType,
      fileKeyPatch,
    }),
  clear: id => action(actionTypes.EDITOR.CLEAR, { id }),
  toggleVersion: (id, version) =>
    action(actionTypes.EDITOR.TOGGLE_VERSION, { id, version }),
  sampleDataReceived: (id, sampleData, templateVersion) =>
    action(actionTypes.EDITOR.SAMPLEDATA.RECEIVED, {
      id,
      sampleData,
      templateVersion,
    }),
  sampleDataFailed: (id, sampleDataError) =>
    action(actionTypes.EDITOR.SAMPLEDATA.FAILED, { id, sampleDataError }),
  toggleAutoPreview: (id, autoPreview) =>
    action(actionTypes.EDITOR.TOGGLE_AUTO_PREVIEW, { id, autoPreview }),
  refreshHelperFunctions: () =>
    action(actionTypes.EDITOR.REFRESH_HELPER_FUNCTIONS),
  updateHelperFunctions: helperFunctions =>
    action(actionTypes.EDITOR.UPDATE_HELPER_FUNCTIONS, { helperFunctions }),
  previewRequest: id => action(actionTypes.EDITOR.PREVIEW.REQUEST, { id }),
  previewFailed: (id, error) =>
    action(actionTypes.EDITOR.PREVIEW.FAILED, { id, error }),
  previewResponse: (id, result) =>
    action(actionTypes.EDITOR.PREVIEW.RESPONSE, { id, result }),
  saveRequest: (id, context) =>
    action(actionTypes.EDITOR.SAVE.REQUEST, { id, context }),
  saveFailed: (id, saveMessage) =>
    action(actionTypes.EDITOR.SAVE.FAILED, { id, saveMessage }),
  saveComplete: id => action(actionTypes.EDITOR.SAVE.COMPLETE, { id }),
  validateFailure: (id, violations) =>
    action(actionTypes.EDITOR.VALIDATE_FAILURE, { id, violations }),
  chat: {
    request: (id, prompt) => action(actionTypes.EDITOR.CHAT.REQUEST, {id, prompt }),
    complete: id => action(actionTypes.EDITOR.CHAT.COMPLETE, { id }),
    failed: (id, error) => action(actionTypes.EDITOR.CHAT.FAILED, {id, error }),
  },
};
// #endregion
// #region Mapping actions
const mapping = {
  init: ({ flowId, importId, subRecordMappingId }) =>
    action(actionTypes.MAPPING.INIT, { flowId, importId, subRecordMappingId }),
  initComplete: (options = {}) =>
    action(actionTypes.MAPPING.INIT_COMPLETE, { ...options }),
  initFailed: () => action(actionTypes.MAPPING.INIT_FAILED, {}),
  patchField: (field, key, value) =>
    action(actionTypes.MAPPING.PATCH_FIELD, { field, key, value }),
  patchGenerateThroughAssistant: value =>
    action(actionTypes.MAPPING.PATCH_GENERATE_THROUGH_ASSISTANT, { value }),
  addLookup: ({ value, isConditionalLookup }) =>
    action(actionTypes.MAPPING.ADD_LOOKUP, { value, isConditionalLookup }),
  updateLookup: ({ oldValue, newValue, isConditionalLookup }) =>
    action(actionTypes.MAPPING.UPDATE_LOOKUP, { oldValue, newValue, isConditionalLookup }),
  patchSettings: (key, value) =>
    action(actionTypes.MAPPING.PATCH_SETTINGS, { key, value }),
  patchIncompleteGenerates: (key, value) =>
    action(actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES, { key, value }),
  delete: key => action(actionTypes.MAPPING.DELETE, { key }),
  save: ({ match }) => action(actionTypes.MAPPING.SAVE, { match }),
  saveFailed: () => action(actionTypes.MAPPING.SAVE_FAILED, { }),
  saveComplete: () => action(actionTypes.MAPPING.SAVE_COMPLETE, { }),
  requestPreview: editorId => action(actionTypes.MAPPING.PREVIEW_REQUESTED, { editorId }),
  previewReceived: value =>
    action(actionTypes.MAPPING.PREVIEW_RECEIVED, { value }),
  previewFailed: errors => action(actionTypes.MAPPING.PREVIEW_FAILED, { errors }),
  setNSAssistantFormLoaded: value =>
    action(actionTypes.MAPPING.SET_NS_ASSISTANT_FORM_LOADED, { value }),
  refreshGenerates: () => action(actionTypes.MAPPING.REFRESH_GENERATES, { }),
  updateLastFieldTouched: key => action(actionTypes.MAPPING.UPDATE_LAST_TOUCHED_FIELD, { key }),
  updateMappings: mappings => action(actionTypes.MAPPING.UPDATE_LIST, { mappings }),
  clear: () => action(actionTypes.MAPPING.CLEAR, {}),
  shiftOrder: (key, shiftIndex) => action(actionTypes.MAPPING.SHIFT_ORDER, { key, shiftIndex }),
  setValidationMsg: value => action(actionTypes.MAPPING.SET_VALIDATION_MSG, { value }),
  autoMapper: {
    request: () => action(actionTypes.MAPPING.AUTO_MAPPER.REQUEST),
    received: value => action(actionTypes.MAPPING.AUTO_MAPPER.RECEIVED, { value }),
    failed: (failSeverity, failMsg) => action(actionTypes.MAPPING.AUTO_MAPPER.FAILED, { failSeverity, failMsg }),
  },
  toggleVersion: newVersion => action(actionTypes.MAPPING.TOGGLE_VERSION, { newVersion }),
  v2: {
    toggleOutput: outputFormat => action(actionTypes.MAPPING.V2.TOGGLE_OUTPUT, { outputFormat }),
    toggleRows: expanded => action(actionTypes.MAPPING.V2.TOGGLE_ROWS, { expanded }),
    updateExpandedKeys: expandedKeys => action(actionTypes.MAPPING.V2.UPDATE_EXPANDED_KEYS, { expandedKeys }),
    dropRow: dragDropInfo => action(actionTypes.MAPPING.V2.DRAG_DROP, { dragDropInfo }),
    updateActiveKey: v2Key => action(actionTypes.MAPPING.V2.ACTIVE_KEY, { v2Key }),
    deleteRow: v2Key => action(actionTypes.MAPPING.V2.DELETE_ROW, { v2Key }),
    addRow: v2Key => action(actionTypes.MAPPING.V2.ADD_ROW, { v2Key }),
    updateDataType: (v2Key, newDataType, isSource) => action(actionTypes.MAPPING.V2.UPDATE_DATA_TYPE, { v2Key, newDataType, isSource }),
    changeArrayTab: (v2Key, newTabValue, newTabExtractId) => action(actionTypes.MAPPING.V2.CHANGE_ARRAY_TAB, { v2Key, newTabValue, newTabExtractId }),
    patchField: (field, v2Key, value, isSettingsPatch, selectedExtractJsonPath) => action(actionTypes.MAPPING.V2.PATCH_FIELD, { field, v2Key, value, isSettingsPatch, selectedExtractJsonPath }),
    patchSettings: (v2Key, value) => action(actionTypes.MAPPING.V2.PATCH_SETTINGS, { v2Key, value }),
    patchExtractsFilter: (inputValue, propValue) => action(actionTypes.MAPPING.V2.PATCH_EXTRACTS_FILTER, { inputValue, propValue }),
    deleteAll: isCSVOrXLSX => action(actionTypes.MAPPING.V2.DELETE_ALL, { isCSVOrXLSX }),
    autoCreateStructure: (uploadedData, isCSVOrXLSX) => action(actionTypes.MAPPING.V2.AUTO_CREATE_STRUCTURE, { uploadedData, isCSVOrXLSX }),
    toggleAutoCreateFlag: () => action(actionTypes.MAPPING.V2.TOGGLE_AUTO_CREATE_FLAG, {}),
    searchTree: searchKey => action(actionTypes.MAPPING.V2.SEARCH_TREE, { searchKey }),
    updateFilter: filter => action(actionTypes.MAPPING.V2.UPDATE_FILTER, { filter }),
    deleteNewRowKey: () => action(actionTypes.MAPPING.V2.DELETE_NEW_ROW_KEY, {}),
    patchDestinationFilter: (inputValue, propValue) => action(actionTypes.MAPPING.V2.PATCH_DESTINATION_FILTER, { inputValue, propValue }),
    makeFinalDestinationTree: v2Key => action(actionTypes.MAPPING.V2.FINAL_DESTINATION_TREE, { v2Key }),
    addSelectedDestination: v2Key => action(actionTypes.MAPPING.V2.ADD_SELECTED_DESTINATION, { v2Key }),
    toggleShowNotificationFlag: () => action(actionTypes.MAPPING.V2.TOGGLE_NOTIFICATION_FLAG, {}),
  },
};

const searchCriteria = {
  init: (id, value) =>
    action(actionTypes.SEARCH_CRITERIA.INIT, {
      id,
      value,
    }),
  patchField: (id, field, index, value) =>
    action(actionTypes.SEARCH_CRITERIA.PATCH_FIELD, {
      id,
      field,
      index,
      value,
    }),
  delete: (id, index) =>
    action(actionTypes.SEARCH_CRITERIA.DELETE, { id, index }),
};
// #region DynaForm Actions
const resourceForm = {
  init: (resourceType, resourceId, isNew, skipCommit, flowId, initData, integrationId, fieldMeta, parentConnectionId, options) =>
    action(actionTypes.RESOURCE_FORM.INIT, {
      resourceType,
      resourceId,
      isNew,
      skipCommit,
      flowId,
      initData,
      integrationId,
      fieldMeta,
      parentConnectionId,
      options,
    }),
  initComplete: (
    resourceType,
    resourceId,
    fieldMeta,
    isNew,
    skipCommit,
    flowId
  ) =>
    action(actionTypes.RESOURCE_FORM.INIT_COMPLETE, {
      resourceId,
      resourceType,
      fieldMeta,
      isNew,
      skipCommit,
      flowId,
    }),
  initFailed: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.INIT_FAILED, {
      resourceId,
      resourceType,
    }),
  clearInitData: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.CLEAR_INIT_DATA, {
      resourceId,
      resourceType,
    }),
  submit: (
    resourceType,
    resourceId,
    values,
    match,
    skipClose,
    isGenerate,
    flowId,
    parentContext
  ) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT, {
      resourceType,
      resourceId,
      values,
      match,
      skipClose,
      isGenerate,
      flowId,
      parentContext,
    }),
  saveAndContinue: (resourceType, resourceId, values, match, skipClose, parentContext) =>
    action(actionTypes.RESOURCE_FORM.SAVE_AND_CONTINUE, {
      resourceType,
      resourceId,
      values,
      match,
      skipClose,
      parentContext,
    }),
  submitComplete: (resourceType, resourceId, formValues) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE, {
      resourceType,
      resourceId,
      formValues,
    }),
  submitFailed: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT_FAILED, {
      resourceType,
      resourceId,
    }),
  submitAborted: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT_ABORTED, {
      resourceType,
      resourceId,
    }),
  clear: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.CLEAR, { resourceType, resourceId }),
  showBundleInstallNotification: (bundleUrl, resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.SHOW_BUNDLE_INSTALL_NOTIFICATION, {bundleUrl, resourceType, resourceId }),
  hideBundleInstallNotification: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.HIDE_BUNDLE_INSTALL_NOTIFICATION, { resourceType, resourceId }),
  showSuiteAppInstallNotification: (suiteAppUrl, resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.SHOW_SUITEAPP_INSTALL_NOTIFICATION, {suiteAppUrl, resourceType, resourceId}),
  hideSuiteAppInstallNotification: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.HIDE_SUITEAPP_INSTALL_NOTIFICATION, { resourceType, resourceId }),
};
const accessToken = {
  displayToken: id => action(actionTypes.ACCESSTOKEN.DISPLAY, { id }),
  generateToken: id => action(actionTypes.ACCESSTOKEN.GENERATE, { id }),
  tokenReceived: accessToken =>
    action(actionTypes.ACCESSTOKEN.RECEIVED, { accessToken }),
  maskToken: accessToken =>
    action(actionTypes.ACCESSTOKEN.MASK, { accessToken }),
  deletePurged: () => action(actionTypes.ACCESSTOKEN.DELETE_PURGED),
  updatedCollection: () => action(actionTypes.ACCESSTOKEN.UPDATED_COLLECTION),
};
const job = {
  dashboard: {
    running: {
      requestCollection: ({nextPageURL, integrationId}) =>
        action(actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_COLLECTION, { nextPageURL, integrationId }),
      receivedCollection: ({ collection, nextPageURL, loadMore }) =>
        action(actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_COLLECTION, {
          collection,
          nextPageURL,
          loadMore,
        }),
      cancel: ({ jobId }) =>
        action(actionTypes.JOB.DASHBOARD.RUNNING.CANCEL, { jobId }),
      canceled: ({ jobId }) =>
        action(actionTypes.JOB.DASHBOARD.RUNNING.CANCELED, { jobId }),
      requestInProgressJobStatus: () =>
        action(actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_IN_PROGRESS_JOBS_STATUS),
      clear: () => action(actionTypes.JOB.DASHBOARD.RUNNING.CLEAR),
      error: () => action(actionTypes.JOB.DASHBOARD.RUNNING.ERROR),
      noInProgressJobs: () => action(actionTypes.JOB.DASHBOARD.RUNNING.NO_IN_PROGRESS_JOBS),
      receivedFamily: ({ collection }) => action(actionTypes.JOB.DASHBOARD.RUNNING.RECEIVED_FAMILY, { collection }),
    },
    completed: {
      requestCollection: ({nextPageURL, integrationId}) =>
        action(actionTypes.JOB.DASHBOARD.COMPLETED.REQUEST_COLLECTION, { nextPageURL, integrationId }),
      receivedCollection: ({ collection, nextPageURL, loadMore }) =>
        action(actionTypes.JOB.DASHBOARD.COMPLETED.RECEIVED_COLLECTION, {
          collection,
          nextPageURL,
          loadMore,
        }),
      clear: () => action(actionTypes.JOB.DASHBOARD.COMPLETED.CLEAR),
      error: () => action(actionTypes.JOB.DASHBOARD.COMPLETED.ERROR),
    },
  },
  requestCollection: ({ integrationId, flowId, filters, options }) =>
    action(actionTypes.JOB.REQUEST_COLLECTION, {
      integrationId,
      flowId,
      filters,
      options,
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
  downloadFiles: ({ jobId, fileType, fileIds }) =>
    action(actionTypes.JOB.DOWNLOAD_FILES, { jobId, fileType, fileIds }),
  clear: () => action(actionTypes.JOB.CLEAR),
  purge: {
    request: ({ jobId }) =>
      action(actionTypes.JOB.PURGE.REQUEST, {jobId}),
    success: () =>
      action(actionTypes.JOB.PURGE.SUCCESS),
    clear: () =>
      action(actionTypes.JOB.PURGE.CLEAR),
  },
  cancel: ({ jobId, flowJobId }) =>
    action(actionTypes.JOB.CANCEL, { jobId, flowJobId }),
  resolveAllPending: () => action(actionTypes.JOB.RESOLVE_ALL_PENDING),
  resolveSelected: ({ jobs, match }) =>
    action(actionTypes.JOB.RESOLVE_SELECTED, { jobs, match }),
  resolveAll: ({ flowId, childId, integrationId, filteredJobsOnly, match }) =>
    action(actionTypes.JOB.RESOLVE_ALL, { flowId, childId, integrationId, filteredJobsOnly, match }),
  resolveInit: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RESOLVE_INIT, { parentJobId, childJobId }),
  resolveAllInit: () => action(actionTypes.JOB.RESOLVE_ALL_INIT),
  resolveUndo: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RESOLVE_UNDO, { parentJobId, childJobId }),
  resolveAllUndo: () => action(actionTypes.JOB.RESOLVE_ALL_UNDO),
  resolveCommit: () => action(actionTypes.JOB.RESOLVE_COMMIT),
  resolveAllCommit: () => action(actionTypes.JOB.RESOLVE_ALL_COMMIT),
  retryAllPending: () => action(actionTypes.JOB.RETRY_ALL_PENDING),
  retrySelected: ({ jobs, match }) => action(actionTypes.JOB.RETRY_SELECTED, { jobs, match }),
  retryFlowJob: ({ jobId, match }) =>
    action(actionTypes.JOB.RETRY_FLOW_JOB, { jobId, match }),
  retryInit: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RETRY_INIT, { parentJobId, childJobId }),
  retryAllInit: ({ flowIds }) => action(actionTypes.JOB.RETRY_ALL_INIT, { flowIds }),
  retryUndo: ({ parentJobId, childJobId }) =>
    action(actionTypes.JOB.RETRY_UNDO, { parentJobId, childJobId }),
  retryCommit: () => action(actionTypes.JOB.RETRY_COMMIT),
  retryFlowJobCommit: () => action(actionTypes.JOB.RETRY_FLOW_JOB_COMMIT),
  retryAll: ({ flowId, childId, integrationId, match }) =>
    action(actionTypes.JOB.RETRY_ALL, { flowId, childId, integrationId, match }),
  retryAllUndo: () => action(actionTypes.JOB.RETRY_ALL_UNDO),
  retryAllCommit: () => action(actionTypes.JOB.RETRY_ALL_COMMIT),
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
  resolveSelectedErrors: ({ jobId, flowJobId, selectedErrorIds, match }) =>
    action(actionTypes.JOB.ERROR.RESOLVE_SELECTED, {
      jobId,
      flowJobId,
      selectedErrorIds,
      match,
    }),
  retrySelectedRetries: ({ jobId, flowJobId, selectedRetryIds, match }) =>
    action(actionTypes.JOB.ERROR.RETRY_SELECTED, {
      jobId,
      flowJobId,
      selectedRetryIds,
      match,
    }),
  requestRetryData: ({ retryId }) =>
    action(actionTypes.JOB.ERROR.REQUEST_RETRY_DATA, { retryId }),
  receivedRetryData: ({ retryData, retryId }) =>
    action(actionTypes.JOB.ERROR.RECEIVED_RETRY_DATA, { retryData, retryId }),
  updateRetryData: ({ retryData, retryId, asyncKey }) =>
    action(actionTypes.JOB.ERROR.UPDATE_RETRY_DATA, { retryData, retryId, asyncKey}),
  downloadRetryData: ({retryId}) => action(actionTypes.JOB.ERROR.DOWNLOAD_RETRY_DATA, {retryId}),
  retryForProcessedErrors: ({ jobId, flowJobId, errorFileId }) =>
    action(actionTypes.JOB.ERROR.RETRY_PROCESSED_ERRORS, {
      jobId,
      flowJobId,
      errorFileId,
    }),
  paging: {
    setRowsPerPage: rowsPerPage =>
      action(actionTypes.JOB.PAGING.SET_ROWS_PER_PAGE, { rowsPerPage }),
    setCurrentPage: currentPage =>
      action(actionTypes.JOB.PAGING.SET_CURRENT_PAGE, { currentPage }),
  },
  error: {
    clear: () => action(actionTypes.JOB.ERROR.CLEAR),
  },
  processedErrors: {
    requestPreview: ({ jobId, errorFile }) =>
      action(actionTypes.JOB.ERROR.PREVIEW.REQUEST, {
        jobId,
        errorFile,
      }),
    receivedPreview: ({ jobId, previewData, errorFileId }) =>
      action(actionTypes.JOB.ERROR.PREVIEW.RECEIVED, {
        jobId,
        previewData,
        errorFileId,
      }),
    previewError: ({ jobId, error }) =>
      action(actionTypes.JOB.ERROR.PREVIEW.ERROR, { jobId, error }),
    clearPreview: jobId =>
      action(actionTypes.JOB.ERROR.PREVIEW.CLEAR, { jobId }),
  },
};
const errorManager = {
  openFlowErrors: {
    requestPoll: ({ flowId }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST_FOR_POLL, { flowId }),
    request: ({ flowId }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST, { flowId }),
    received: ({ flowId, openErrors }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.RECEIVED, {
        flowId,
        openErrors,
      }),
    cancelPoll: () =>
      action(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL),
  },
  integrationLatestJobs: {
    requestPoll: ({ integrationId }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.REQUEST_FOR_POLL, { integrationId }),
    request: ({ integrationId }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.REQUEST, {
        integrationId,
      }),
    received: ({ integrationId, latestJobs }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.RECEIVED, {
        integrationId,
        latestJobs,
      }),
    error: ({ integrationId }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.ERROR, {
        integrationId,
      }),
    cancelPoll: () =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.CANCEL_POLL),
  },
  latestFlowJobs: {
    request: ({ flowId, refresh = false }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST, {
        flowId,
        refresh,
      }),
    received: ({ flowId, latestJobs }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED, {
        flowId, latestJobs,
      }),
    receivedJobFamily: ({ flowId, job }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED_JOB_FAMILY, {
        flowId, job,
      }),
    requestInProgressJobsPoll: ({ flowId }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST_IN_PROGRESS_JOBS_POLL, {
        flowId,
      }),
    noInProgressJobs: () =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.NO_IN_PROGRESS_JOBS),
    clear: ({ flowId }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CLEAR, {
        flowId,
      }),
    cancelLatestJobs: ({ flowId, jobIds }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CANCEL, { flowId, jobIds }),
  },
  runHistory: {
    request: ({ flowId }) => action(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, { flowId }),
    received: ({ flowId, runHistory }) => action(actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED, { flowId, runHistory }),
    clear: ({ flowId }) => action(actionTypes.ERROR_MANAGER.RUN_HISTORY.CLEAR, { flowId }),
    requestFamily: ({ jobId }) =>
      action(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST_FAMILY, { jobId }),
    receivedFamily: ({ job }) => action(actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED_FAMILY, { job }),
  },
  integrationErrors: {
    requestPoll: ({ integrationId }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST_FOR_POLL, { integrationId }),
    request: ({ integrationId }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST, {
        integrationId,
      }),
    received: ({ integrationId, integrationErrors }) =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.RECEIVED, {
        integrationId,
        integrationErrors,
      }),
    cancelPoll: () =>
      action(actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.CANCEL_POLL),
  },
  flowErrorDetails: {
    request: ({ flowId, resourceId, loadMore, isResolved = false }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST, {
        flowId,
        resourceId,
        loadMore,
        isResolved,
      }),
    received: ({
      flowId,
      resourceId,
      errorDetails,
      loadMore,
      isResolved = false,
    }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RECEIVED, {
        flowId,
        resourceId,
        errorDetails,
        loadMore,
        isResolved,
      }),
    selectErrors: ({
      flowId,
      resourceId,
      errorIds,
      checked,
      isResolved = false,
    }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ERRORS, {
        flowId,
        resourceId,
        errorIds,
        checked,
        isResolved,
      }),
    deselectAll: ({ flowId, resourceId, isResolved }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DESELECT_ALL_ERRORS, {
        flowId,
        resourceId,
        isResolved,
      }),
    selectAllInCurrPage: ({ flowId, resourceId, checked, isResolved }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ALL_ERRORS_IN_CURR_PAGE, {
        flowId,
        resourceId,
        checked,
        isResolved,
      }),
    saveAndRetry: ({ flowId, resourceId, retryId, retryData }) => action(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.SAVE_AND_RETRY, {
        flowId,
        resourceId,
        retryId,
        retryData,
      }
    ),
    retry: ({ flowId, resourceId, retryIds = [], isResolved = false, retryAll = false }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.REQUEST,
        {
          flowId,
          resourceId,
          retryIds,
          isResolved,
          retryAll,
        }
      ),
    resolve: ({ flowId, resourceId, errorIds = [], resolveAll = false }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST,
        {
          flowId,
          resourceId,
          errorIds,
          resolveAll,
        }
      ),
    retryReceived: ({ flowId, resourceId, retryCount }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.RECEIVED,
        {
          flowId,
          resourceId,
          retryCount,
        }
      ),
    resolveReceived: ({ flowId, resourceId, resolveCount }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.RECEIVED,
        {
          flowId,
          resourceId,
          resolveCount,
        }
      ),
    remove: ({ flowId, resourceId, errorIds = [], isResolved = false }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REMOVE, {
        flowId,
        resourceId,
        isResolved,
        errorIds,
      }),
    clear: ({ flowId, resourceId }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.CLEAR, {
        flowId,
        resourceId,
      }),
    notifyUpdate: ({ flowId, resourceId, diff }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.NOTIFY_UPDATE, {
        flowId,
        resourceId,
        diff,
      }),
    download: ({ flowId, resourceId, isResolved, filters }) => action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST, {
      flowId,
      resourceId,
      isResolved,
      filters,
    }),
    purge: {
      request: ({ flowId, resourceId, errors, isRowAction }) =>
        action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.PURGE.REQUEST, {flowId, resourceId, errors, isRowAction}),
      success: ({ flowId, resourceId, message}) =>
        action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.PURGE.SUCCESS, { flowId, resourceId, message}),
      clear: ({ flowId, resourceId}) => action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.PURGE.CLEAR, { flowId, resourceId}),
    },
  },
  retries: {
    request: ({ flowId, resourceId }) =>
      action(actionTypes.ERROR_MANAGER.RETRIES.REQUEST, { flowId, resourceId }),
    received: ({ flowId, resourceId, retries }) =>
      action(actionTypes.ERROR_MANAGER.RETRIES.RECEIVED, {
        flowId,
        resourceId,
        retries,
      }),
    clear: ({ flowId, resourceId }) =>
      action(actionTypes.ERROR_MANAGER.RETRIES.CLEAR, { flowId, resourceId }),
    cancelRequest: ({ flowId, resourceId, jobId}) =>
      action(actionTypes.ERROR_MANAGER.RETRIES.CANCEL.REQUEST, {flowId, resourceId, jobId}),
  },
  retryData: {
    request: ({ flowId, resourceId, retryId }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.REQUEST, {
        flowId,
        resourceId,
        retryId,
      }),
    received: ({ flowId, resourceId, retryId, retryData }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED, {
        flowId,
        resourceId,
        retryId,
        retryData,
      }),
    updateUserRetryData: ({retryId, retryData}) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.UPDATE_USER_RETRY_DATA, {
        retryId,
        retryData,
      }),
    receivedError: ({ flowId, resourceId, retryId, error }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED_ERROR, {
        flowId,
        resourceId,
        retryId,
        error,
      }),
    download: ({ flowId, resourceId, retryDataKey }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.DOWNLOAD, {
        flowId,
        resourceId,
        retryDataKey,
      }),
    updateRequest: ({ flowId, resourceId, retryId, retryData }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.UPDATE_REQUEST, {
        flowId,
        resourceId,
        retryId,
        retryData,
      }),
  },
  retryStatus: {
    requestPoll: ({ flowId, resourceId }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST_FOR_POLL, { flowId, resourceId }),
    stopPoll: () => action(actionTypes.ERROR_MANAGER.RETRY_STATUS.STOP_POLL),
    request: ({ flowId, resourceId }) => action(actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST, ({ flowId, resourceId })),
    received: ({ flowId, resourceId, status }) => action(actionTypes.ERROR_MANAGER.RETRY_STATUS.RECEIVED, ({ flowId, resourceId, status })),
  },
  filterMetadata: {
    request: () => action(actionTypes.ERROR_MANAGER.FILTER_METADATA.REQUEST),
    received: (metadata = []) =>
      action(actionTypes.ERROR_MANAGER.FILTER_METADATA.RECEIVED, { metadata }),
  },
  errorHttpDoc: {
    request: (flowId, resourceId, reqAndResKey) =>
      action(actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, { flowId, resourceId, reqAndResKey }),
    received: (reqAndResKey, errorHttpDoc) =>
      action(actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.RECEIVED, { reqAndResKey, errorHttpDoc }),
    error: (reqAndResKey, error) =>
      action(actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR, { reqAndResKey, error }),
    downloadBlobDoc: (flowId, resourceId, reqAndResKey) =>
      action(actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.DOWNLOAD_BLOB_DOC, { flowId, resourceId, reqAndResKey }),
  },
};
const flow = {
  addNewPGStep: flowId => action(actionTypes.FLOW.ADD_NEW_PG_STEP, { flowId }),
  addNewPPStep: (flowId, path, processorIndex) => action(actionTypes.FLOW.ADD_NEW_PP_STEP, { flowId, path, processorIndex }),
  moveStep: (flowId, stepInfo) => action(actionTypes.FLOW.MOVE_STEP, {flowId, stepInfo}),
  addNewPPStepInfo: (flowId, info) => action(actionTypes.FLOW.ADD_NEW_PP_STEP_INFO, { flowId, info }),
  clearPPStepInfo: flowId => action(actionTypes.FLOW.CLEAR_PP_STEP_INFO, { flowId }),
  addNewRouter: (flowId, router) => action(actionTypes.FLOW.ADD_NEW_ROUTER, { flowId, router }),
  dragStart: (flowId, stepId) => action(actionTypes.FLOW.DRAG_START, { flowId, stepId }),
  iconView: (flowId, view) => action(actionTypes.FLOW.ICON_VIEW, { flowId, view }),
  toggleSubFlowView: (flowId, isSubFlowView, subFlowProps) => action(actionTypes.FLOW.TOGGLE_SUBFLOW_VIEW, { flowId, isSubFlowView, subFlowProps}),
  setDragInProgress: flowId => action(actionTypes.FLOW.SET_DRAG_IN_PROGRESS, { flowId }),
  dragEnd: flowId => action(actionTypes.FLOW.DRAG_END, { flowId }),
  mergeTargetSet: (flowId, targetType, targetId) => action(actionTypes.FLOW.MERGE_TARGET_SET, { flowId, targetType, targetId }),
  mergeTargetClear: flowId => action(actionTypes.FLOW.MERGE_TARGET_CLEAR, { flowId }),
  mergeBranch: flowId => action(actionTypes.FLOW.MERGE_BRANCH, { flowId }),
  edgeHovered: (flowId, linkedEdges) => action(actionTypes.FLOW.EDGE_HOVER, { flowId, linkedEdges }),
  edgeUnhover: flowId => action(actionTypes.FLOW.EDGE_UNHOVER, { flowId}),
  deleteStep: (flowId, stepId) => action(actionTypes.FLOW.DELETE_STEP, { flowId, stepId }),
  deleteEdge: (flowId, edgeId) => action(actionTypes.FLOW.DELETE_EDGE, { flowId, edgeId }),
  deleteRouter: (flowId, routerId) => action(actionTypes.FLOW.DELETE_ROUTER, { flowId, routerId }),
  initializeFlowGraph: (flowId, flow, isViewMode, isDataLoader) => action(actionTypes.FLOW.INIT_FLOW_GRAPH, { flowId, flow, isViewMode, isDataLoader }),
  setSaveStatus: (flowId, status) => action(actionTypes.FLOW.SET_SAVE_STATUS, { flowId, status }),
  run: ({ flowId, customStartDate, options }) =>
    action(actionTypes.FLOW.RUN, { flowId, customStartDate, options }),
  runDataLoader: ({ flowId, customStartDate, fileContent, fileType, fileName }) =>
    action(actionTypes.FLOW.RUN_DATA_LOADER, {
      flowId,
      customStartDate,
      fileContent,
      fileType,
      fileName,
    }),
  runRequested: flowId => action(actionTypes.FLOW.RUN_REQUESTED, { flowId }),
  runActionStatus: (runStatus, flowId) =>
    action(actionTypes.FLOW.RECEIVED_RUN_ACTION_STATUS, {
      runStatus,
      flowId,
    }),
  isOnOffActionInprogress: (onOffInProgress, flowId) =>
    action(actionTypes.FLOW.RECEIVED_ON_OFF_ACTION_STATUS, {
      onOffInProgress,
      flowId,
    }),
  requestLastExportDateTime: ({ flowId }) =>
    action(actionTypes.FLOW.REQUEST_LAST_EXPORT_DATE_TIME, { flowId }),
  receivedLastExportDateTime: (flowId, response) =>
    action(actionTypes.FLOW.RECEIVED_LAST_EXPORT_DATE_TIME, {
      flowId,
      response,
    }),
  clear: flowId => action(actionTypes.FLOW.CLEAR, { flowId }),
};
const assistantMetadata = {
  received: ({ adaptorType, assistant, metadata }) =>
    action(actionTypes.METADATA.ASSISTANT_RECEIVED, {
      adaptorType,
      assistant,
      metadata,
    }),
};
const httpConnectors = {
  requestMetadata: ({ httpConnectorId, httpVersionId, httpApiId }) =>
    action(actionTypes.HTTP_CONNECTORS.REQUEST_METADATA, {
      httpConnectorId,
      httpVersionId,
      httpApiId,
    }),
  receivedMetadata: ({metadata, httpConnectorId, httpVersionId, httpConnectorApiId}) =>
    action(actionTypes.HTTP_CONNECTORS.RECEIVED_METADATA, {
      metadata,
      httpConnectorId,
      httpVersionId,
      httpConnectorApiId,
    }),
  receivedConnector: ({ httpConnectorId, connector }) =>
    action(actionTypes.HTTP_CONNECTORS.RECEIVED_CONNECTOR, {
      httpConnectorId,
      connector,
    }),
  requestConnector: ({ httpConnectorId }) =>
    action(actionTypes.HTTP_CONNECTORS.REQUEST_CONNECTOR, {
      httpConnectorId,
    }),
};
const analytics = {
  gainsight: {
    trackEvent: (eventId, details) =>
      action(actionTypes.ANALYTICS.GAINSIGHT.TRACK_EVENT, {
        eventId,
        details,
      }),
  },
};
const responseMapping = {
  init: ({ flowId, resourceId, resourceType }) =>
    action(actionTypes.RESPONSE_MAPPING.INIT, {
      resourceId,
      flowId,
      resourceType,
    }),
  initComplete: (options = {}) =>
    action(actionTypes.RESPONSE_MAPPING.INIT_COMPLETE, options),
  initFailed: () => action(actionTypes.RESPONSE_MAPPING.INIT_FAILED, {}),
  patchField: (field, key, value) =>
    action(actionTypes.RESPONSE_MAPPING.PATCH_FIELD, {
      field, key, value,
    }),
  delete: key =>
    action(actionTypes.RESPONSE_MAPPING.DELETE, { key }),
  save: ({ match }) => action(actionTypes.RESPONSE_MAPPING.SAVE, { match }),
  saveFailed: () => action(actionTypes.RESPONSE_MAPPING.SAVE_FAILED, {}),
  saveComplete: () =>
    action(actionTypes.RESPONSE_MAPPING.SAVE_COMPLETE, {}),
  clear: () => action(actionTypes.RESPONSE_MAPPING.CLEAR, {}),

};
const customSettings = {
  formRequest: (resourceType, resourceId, sectionId) =>
    action(actionTypes.CUSTOM_SETTINGS.FORM_REQUEST, {
      resourceType,
      resourceId,
      sectionId,
    }),
  formReceived: (resourceId, formMeta, scriptId) =>
    action(actionTypes.CUSTOM_SETTINGS.FORM_RECEIVED, {
      resourceId,
      formMeta,
      scriptId,
    }),
  formError: (resourceId, error) =>
    action(actionTypes.CUSTOM_SETTINGS.FORM_ERROR, {
      resourceId,
      error,
    }),
  formClear: resourceId =>
    action(actionTypes.CUSTOM_SETTINGS.FORM_CLEAR, {
      resourceId,
    }),
};
const exportData = {
  request: ({kind, identifier, resource, resourceContext}) =>
    action(actionTypes.EXPORTDATA.REQUEST, {
      kind,
      identifier,
      resource,
      resourceContext,
    }),
  receive: (kind, identifier, data) =>
    action(actionTypes.EXPORTDATA.RECEIVED, {
      kind,
      identifier,
      data,
    }),
  receiveError: (kind, identifier, err) =>
    action(actionTypes.EXPORTDATA.ERROR_RECEIVED, {
      kind,
      identifier,
      error: err,
    }),
};

const hooks = {
  save: context => action(actionTypes.HOOKS.SAVE, context),
};

const bottomDrawer = {
  init: flowId => action(actionTypes.BOTTOM_DRAWER.INIT, { flowId }),
  initComplete: value => action(actionTypes.BOTTOM_DRAWER.INIT_COMPLETE, { value }),
  addTab: ({ tabType, label, resourceId }) => action(actionTypes.BOTTOM_DRAWER.ADD_TAB, { tabType, resourceId, label }),
  removeTab: ({ tabType, resourceId }) => action(actionTypes.BOTTOM_DRAWER.REMOVE_TAB, { tabType, resourceId }),
  switchTab: ({ index, tabType }) => action(actionTypes.BOTTOM_DRAWER.SWITCH_TAB, { index, tabType }),
  setActiveTab: ({ index, tabType }) => action(actionTypes.BOTTOM_DRAWER.SET_ACTIVE_TAB, { index, tabType }),
  clear: () => action(actionTypes.BOTTOM_DRAWER.CLEAR),
};

const logs = {
  scripts: {
    request: ({ scriptId, flowId, isInit }) =>
      action(actionTypes.LOGS.SCRIPTS.REQUEST, { scriptId, flowId, isInit }),
    received: ({ logs, nextPageURL, scriptId, flowId }) =>
      action(actionTypes.LOGS.SCRIPTS.RECEIVED, { logs, nextPageURL, scriptId, flowId }),
    requestFailed: ({ flowId, scriptId, errorMsg }) =>
      action(actionTypes.LOGS.SCRIPTS.REQUEST_FAILED, { scriptId, flowId, errorMsg }),
    getDependency: ({ scriptId, flowId }) =>
      action(actionTypes.LOGS.SCRIPTS.GET_DEPENDENCY, { scriptId, flowId }),
    setDependency: ({ resourceReferences, scriptId, flowId }) =>
      action(actionTypes.LOGS.SCRIPTS.SET_DEPENDENCY, { resourceReferences, scriptId, flowId }),
    patchFilter: ({ scriptId, flowId, field, value }) =>
      action(actionTypes.LOGS.SCRIPTS.PATCH_FILTER, { scriptId, flowId, field, value }),
    refresh: ({ scriptId, flowId }) =>
      action(actionTypes.LOGS.SCRIPTS.REFRESH, { scriptId, flowId }),
    clear: ({ flowId, scriptId }) =>
      action(actionTypes.LOGS.SCRIPTS.CLEAR, { flowId, scriptId }),
    loadMore: ({ flowId, scriptId, fetchNextPage }) =>
      action(actionTypes.LOGS.SCRIPTS.LOAD_MORE, { flowId, scriptId, fetchNextPage }),
    startDebug: (scriptId, value) =>
      action(actionTypes.LOGS.SCRIPTS.START_DEBUG, { scriptId, value }),
    setFetchStatus: ({ scriptId, flowId, fetchStatus }) => action(actionTypes.LOGS.SCRIPTS.FETCH_STATUS, { scriptId, flowId, fetchStatus }),
    pauseFetch: ({ scriptId, flowId }) => action(actionTypes.LOGS.SCRIPTS.PAUSE_FETCH, { scriptId, flowId }),
    requestAllLogs: ({scriptId, flowId}) => action(actionTypes.LOGS.SCRIPTS.REQUEST_ALL_LOGS, {scriptId, flowId}),
    receivedAllLogs: ({scriptId, flowId, isPurgeAvailable}) => action(actionTypes.LOGS.SCRIPTS.RECEIVED_ALL_LOGS, {scriptId, flowId, isPurgeAvailable}),
    purge: {
      request: ({ scriptId, flowId }) =>
        action(actionTypes.LOGS.SCRIPTS.PURGE.REQUEST, {scriptId, flowId}),
      success: ({scriptId, flowId}) =>
        action(actionTypes.LOGS.SCRIPTS.PURGE.SUCCESS, {scriptId, flowId}),
      clear: () =>
        action(actionTypes.LOGS.SCRIPTS.PURGE.CLEAR),
    },
  },
  connections: {
    request: connectionId =>
      action(actionTypes.LOGS.CONNECTIONS.REQUEST, { connectionId }),
    requestFailed: connectionId =>
      action(actionTypes.LOGS.CONNECTIONS.REQUEST_FAILED, { connectionId }),
    received: (connectionId, logs) =>
      action(actionTypes.LOGS.CONNECTIONS.RECEIVED, { connectionId, logs }),
    pause: connectionId =>
      action(actionTypes.LOGS.CONNECTIONS.PAUSE, { connectionId }),
    refresh: connectionId =>
      action(actionTypes.LOGS.CONNECTIONS.REFRESH, { connectionId }),
    clear: ({ connectionId, clearAllLogs }) =>
      action(actionTypes.LOGS.CONNECTIONS.CLEAR, { connectionId, clearAllLogs }),
    delete: connectionId =>
      action(actionTypes.LOGS.CONNECTIONS.DELETE, { connectionId }),
    download: connectionId =>
      action(actionTypes.LOGS.CONNECTIONS.DOWNLOAD, { connectionId }),
    startDebug: (connectionId, value) =>
      action(actionTypes.LOGS.CONNECTIONS.START_DEBUG, { connectionId, value }),
  },
  flowStep: {
    startDebug: (flowId, resourceId, resourceType, minutes) => action(actionTypes.LOGS.FLOWSTEP.DEBUG.START, { flowId, resourceId, resourceType, minutes }),
    stopDebug: (flowId, resourceId, resourceType) => action(actionTypes.LOGS.FLOWSTEP.DEBUG.STOP, { flowId, resourceId, resourceType }),
    requestLogDetails: (flowId, resourceId, logKey) => action(actionTypes.LOGS.FLOWSTEP.LOG.REQUEST, { flowId, resourceId, logKey }),
    receivedLogDetails: (resourceId, logKey, logDetails) => action(actionTypes.LOGS.FLOWSTEP.LOG.RECEIVED, { resourceId, logKey, logDetails }),
    removeLog: (flowId, resourceId, logsToRemove) => action(actionTypes.LOGS.FLOWSTEP.LOG.REMOVE, { flowId, resourceId, logsToRemove }),
    logDeleted: (resourceId, deletedLogKey) => action(actionTypes.LOGS.FLOWSTEP.LOG.DELETED, { resourceId, deletedLogKey }),
    request: ({ flowId, resourceId, loadMore }) => action(actionTypes.LOGS.FLOWSTEP.REQUEST, { flowId, resourceId, loadMore }),
    received: ({ resourceId, logs, nextPageURL, loadMore }) => action(actionTypes.LOGS.FLOWSTEP.RECEIVED, { resourceId, logs, nextPageURL, loadMore }),
    failed: (resourceId, error) => action(actionTypes.LOGS.FLOWSTEP.FAILED, { resourceId, error }),
    clear: resourceId => action(actionTypes.LOGS.FLOWSTEP.CLEAR, { resourceId }),
    startLogsPoll: (flowId, resourceId) => action(actionTypes.LOGS.FLOWSTEP.START_POLL, { flowId, resourceId }),
    stopLogsPoll: (resourceId, hasNewLogs) => action(actionTypes.LOGS.FLOWSTEP.STOP_POLL, { resourceId, hasNewLogs }),
    setActiveLog: (resourceId, activeLogKey) => action(actionTypes.LOGS.FLOWSTEP.ACTIVE_LOG, { resourceId, activeLogKey }),
    setFetchStatus: (resourceId, status) => action(actionTypes.LOGS.FLOWSTEP.FETCH_STATUS, { resourceId, status }),
    pauseFetch: (flowId, resourceId) => action(actionTypes.LOGS.FLOWSTEP.PAUSE_FETCH, { flowId, resourceId }),
  },
};

const sso = {
  validateOrgId: orgId => action(actionTypes.SSO.ORG_ID.VALIDATION_REQUEST, { orgId }),
  validationSuccess: () => action(actionTypes.SSO.ORG_ID.VALIDATION_SUCCESS),
  validationError: error => action(actionTypes.SSO.ORG_ID.VALIDATION_ERROR, { error }),
  clearValidations: () => action(actionTypes.SSO.ORG_ID.VALIDATION_CLEAR),
};

const integrationLCM = {
  cloneFamily: {
    request: integrationId => action(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.REQUEST, { integrationId }),
    received: (integrationId, cloneFamily) => action(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.RECEIVED, { integrationId, cloneFamily }),
    receivedError: (integrationId, error) => action(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.RECEIVED_ERROR, { integrationId, error }),
    clear: integrationId => action(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.CLEAR, { integrationId }),
  },
  compare: {
    pullRequest: (integrationId, revisionId) => action(actionTypes.INTEGRATION_LCM.COMPARE.PULL_REQUEST, { integrationId, revisionId }),
    revertRequest: (integrationId, revisionId) => action(actionTypes.INTEGRATION_LCM.COMPARE.REVERT_REQUEST, { integrationId, revisionId }),
    revisionChanges: (integrationId, revisionId) => action(actionTypes.INTEGRATION_LCM.COMPARE.REVISION_REQUEST, { integrationId, revisionId }),
    receivedDiff: (integrationId, diff) => action(actionTypes.INTEGRATION_LCM.COMPARE.RECEIVED_DIFF, { integrationId, diff }),
    receivedDiffError: (integrationId, diffError) => action(actionTypes.INTEGRATION_LCM.COMPARE.RECEIVED_DIFF_ERROR, { integrationId, diffError }),
    clear: integrationId => action(actionTypes.INTEGRATION_LCM.COMPARE.CLEAR, { integrationId }),
    toggleExpandAll: integrationId => action(actionTypes.INTEGRATION_LCM.COMPARE.TOGGLE_EXPAND_ALL, { integrationId }),
  },
  revision: {
    openPull: ({ integrationId, newRevisionId, revisionInfo }) => action(actionTypes.INTEGRATION_LCM.REVISION.OPEN_PULL, { integrationId, newRevisionId, revisionInfo }),
    openRevert: ({ integrationId, newRevisionId, revisionInfo }) => action(actionTypes.INTEGRATION_LCM.REVISION.OPEN_REVERT, { integrationId, newRevisionId, revisionInfo }),
    create: (integrationId, newRevisionId) => action(actionTypes.INTEGRATION_LCM.REVISION.CREATE, { integrationId, newRevisionId }),
    created: (integrationId, newRevisionId) => action(actionTypes.INTEGRATION_LCM.REVISION.CREATED, { integrationId, newRevisionId }),
    creationError: (integrationId, newRevisionId, creationError) => action(actionTypes.INTEGRATION_LCM.REVISION.CREATION_ERROR, { integrationId, newRevisionId, creationError }),
    createSnapshot: ({ integrationId, newRevisionId, revisionInfo }) => action(actionTypes.INTEGRATION_LCM.REVISION.CREATE_SNAPSHOT, { integrationId, newRevisionId, revisionInfo }),
    clear: integrationId => action(actionTypes.INTEGRATION_LCM.REVISION.CLEAR, { integrationId }),
    cancel: (integrationId, revisionId) => action(actionTypes.INTEGRATION_LCM.REVISION.CANCEL, { integrationId, revisionId }),
    fetchErrors: (integrationId, revisionId) => action(actionTypes.INTEGRATION_LCM.REVISION.FETCH_ERRORS, { integrationId, revisionId }),
    receivedErrors: (integrationId, revisionId, errors) => action(actionTypes.INTEGRATION_LCM.REVISION.RECEIVED_ERRORS, {integrationId, revisionId, errors }),
  },
  installSteps: {
    installStep: (integrationId, revisionId, stepInfo) => action(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.INSTALL, { revisionId, integrationId, stepInfo }),
    updateStep: (revisionId, status) => action(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.UPDATE, { revisionId, status }),
    completedStepInstall: revisionId => action(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.DONE, { revisionId }),
    setOauthConnectionMode: ({ revisionId, connectionId, openOauthConnection }) =>
      action(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.RECEIVED_OAUTH_CONNECTION_STATUS, {
        revisionId,
        connectionId,
        openOauthConnection,
      }),
    verifyBundleOrPackageInstall: ({ revisionId, connectionId, integrationId, variant, isManualVerification}) =>
      action(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.VERIFY_BUNDLE_INSTALL, {
        revisionId,
        connectionId,
        integrationId,
        variant,
        isManualVerification,
      }),
  },
  revisions: {
    request: integrationId => resource.requestCollection(`integrations/${integrationId}/revisions`),
  },
};

const mfa = {
  requestUserSettings: () => action(actionTypes.MFA.USER_SETTINGS.REQUEST),
  receivedUserSettings: userSettings => action(actionTypes.MFA.USER_SETTINGS.RECEIVED, { userSettings }),
  setup: mfaConfig => action(actionTypes.MFA.USER_SETTINGS.SETUP, { mfaConfig }),
  requestAccountSettings: () => action(actionTypes.MFA.ACCOUNT_SETTINGS.REQUEST),
  receivedAccountSettings: accountSettings => action(actionTypes.MFA.ACCOUNT_SETTINGS.RECEIVED, { accountSettings }),
  updateAccountSettings: accountSettings => action(actionTypes.MFA.ACCOUNT_SETTINGS.UPDATE, { accountSettings }),
  requestSecretCode: ({ password, isQRCode }) => action(actionTypes.MFA.SECRET_CODE.REQUEST, { password, isQRCode }),
  receivedSecretCode: secretCode => action(actionTypes.MFA.SECRET_CODE.RECEIVED, { secretCode }),
  showSecretCode: () => action(actionTypes.MFA.SECRET_CODE.SHOW),
  showQrCode: () => action(actionTypes.MFA.QR_CODE.SHOW),
  secretCodeError: secretCodeError => action(actionTypes.MFA.SECRET_CODE.ERROR, { secretCodeError }),
  resetMFA: ({ password, aShareId }) => action(actionTypes.MFA.RESET, { aShareId, password }),
  resetOwnerMFA: () => action(actionTypes.MFA.OWNER_ACCOUNT_RESET),
  deleteDevice: deviceId => action(actionTypes.MFA.DELETE_DEVICE, { deviceId }),
  verifyMobileCode: code => action(actionTypes.MFA.MOBILE_CODE.VERIFY, { code }),
  mobileCodeVerified: (status, error) => action(actionTypes.MFA.MOBILE_CODE.STATUS, { status, error }),
  resetMobileCodeStatus: () => action(actionTypes.MFA.MOBILE_CODE.RESET),
  requestSessionInfo: () => action(actionTypes.MFA.SESSION_INFO.REQUEST),
  receivedSessionInfo: sessionInfo => action(actionTypes.MFA.SESSION_INFO.RECEIVED, { sessionInfo }),
  clearSessionInfo: () => action(actionTypes.MFA.SESSION_INFO.CLEAR),
  addSetupContext: context => action(actionTypes.MFA.ADD_SETUP_CONTEXT, { context }),
  clearSetupContext: () => action(actionTypes.MFA.CLEAR_SETUP_CONTEXT),
  clear: () => action(actionTypes.MFA.CLEAR),
};

const accountSettings = {
  request: () => action(actionTypes.ACCOUNT_SETTINGS.REQUEST),
  update: accountSettings => action(actionTypes.ACCOUNT_SETTINGS.UPDATE, {accountSettings}),
  received: accountSettings => action(actionTypes.ACCOUNT_SETTINGS.RECEIVED, {accountSettings}),
};

// {Code that has been added in dashboard}
const dashboard = {
  request: () => action(actionTypes.DASHBOARD.REQUEST),
  update: newDefaultAShareId =>
    action(actionTypes.DASHBOARD.UPDATE, { newDefaultAShareId }),
  received: defaultAShareId =>
    action(actionTypes.DASHBOARD.RECEIVED, { defaultAShareId }),
  // Code that has been added in dashboard}
};

const uiFields = {
  requestFlowLevel: flowId => action(actionTypes.UI_FIELDS.FLOW_LEVEL.REQUEST, { flowId }),
  receivedFlowLevel: (flowId, resources) => action(actionTypes.UI_FIELDS.FLOW_LEVEL.RECEIVED, { flowId, resources }),
  updateFlowResources: (flowId, resourceIds) => action(actionTypes.UI_FIELDS.FLOW_LEVEL.UPDATE_RESOURCES, { flowId, resourceIds }),
};

export default {
  asyncTask,
  form,
  app,
  concur,
  metadata,
  fileDefinitions,
  connectors,
  integrationApp,
  patchFilter,
  clearFilter,
  editor,
  resourceForm,
  resource,
  user,
  license,
  api,
  auth,
  auditLogs,
  accessToken,
  flowMetrics,
  job,
  errorManager,
  flow,
  agent,
  template,
  clone,
  file,
  assistantMetadata,
  stack,
  resourceFormSampleData,
  mockInput,
  importSampleData,
  flowData,
  connection,
  marketplace,
  recycleBin,
  mapping,
  searchCriteria,
  analytics,
  transfer,
  responseMapping,
  suiteScript,
  customSettings,
  exportData,
  hooks,
  logs,
  sso,
  mfa,
  accountSettings,
  bottomDrawer,
  integrationLCM,
  httpConnectors,
  uiFields,
  dashboard,
};

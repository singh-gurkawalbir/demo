import actionTypes from './types';
import suiteScript from './suiteScript';

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
  init: (formKey, formSpecificProps) =>
    action(actionTypes.FORM.INIT, { formKey, formSpecificProps }),
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
      isValid,
      errorMessages}
  ) =>
    action(actionTypes.FORM.FIELD.FORCE_STATE, {
      formKey,
      fieldProps: {
        id,
        visible,
        disabled,
        required,
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
  requestReducer: () => action(actionTypes.AUTH_REQUEST_REDUCER),
  request: (email, password, showAuthError) =>
    action(actionTypes.AUTH_REQUEST, { email, password, showAuthError}),
  signInWithGoogle: returnTo =>
    action(actionTypes.AUTH_SIGNIN_WITH_GOOGLE, { returnTo }),
  reSignInWithGoogle: email =>
    action(actionTypes.AUTH_RE_SIGNIN_WITH_GOOGLE, { email }),
  linkWithGoogle: returnTo =>
    action(actionTypes.AUTH_LINK_WITH_GOOGLE, { returnTo }),
  complete: () => action(actionTypes.AUTH_SUCCESSFUL),
  failure: message => action(actionTypes.AUTH_FAILURE, { message }),
  warning: () => action(actionTypes.AUTH_WARNING),
  logout: isExistingSessionInvalid =>
    action(actionTypes.USER_LOGOUT, {
      isExistingSessionInvalid,
    }),
  userAlreadyLoggedIn: () => action(actionTypes.AUTH_USER_ALREADY_LOGGED_IN),
  clearStore: () => action(actionTypes.CLEAR_STORE),
  abortAllSagasAndInitLR: opts => action(actionTypes.ABORT_ALL_SAGAS_AND_INIT_LR, opts),
  abortAllSagasAndSwitchAcc: accountToSwitchTo => action(actionTypes.ABORT_ALL_SAGAS_AND_SWITCH_ACC, {accountToSwitchTo}),

  abortAllSagasAndReset: accountToResetTo => action(actionTypes.ABORT_ALL_SAGAS_AND_RESET, {accountToResetTo}),
  initSession: () => action(actionTypes.INIT_SESSION),
  changePassword: updatedPassword =>
    action(actionTypes.USER_CHANGE_PASSWORD, { updatedPassword }),
  changeEmail: updatedEmail =>
    action(actionTypes.USER_CHANGE_EMAIL, { updatedEmail }),
  defaultAccountSet: () => action(actionTypes.DEFAULT_ACCOUNT_SET),
  sessionTimestamp: () => action(actionTypes.AUTH_TIMESTAMP),
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
  requestDebugLogs: connectionId =>
    action(actionTypes.CONNECTION.DEBUG_LOGS_REQUEST, { connectionId }),
  receivedDebugLogs: (debugLogs, connectionId) =>
    action(actionTypes.CONNECTION.DEBUG_LOGS_RECEIVED, {
      debugLogs,
      connectionId,
    }),
  clearDebugLogs: connectionId =>
    action(actionTypes.CONNECTION.DEBUG_LOGS_CLEAR, { connectionId }),
  madeOnline: connectionId =>
    action(actionTypes.CONNECTION.MADE_ONLINE, { connectionId }),
  requestQueuedJobs: connectionId =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_REQUEST, { connectionId }),
  requestQueuedJobsPoll: connectionId =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_REQUEST_POLL, {connectionId}),
  cancelQueuedJobsPoll: connectionId =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_CANCEL_POLL, {connectionId}),
  receivedQueuedJobs: (queuedJobs, connectionId) =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_RECEIVED, {
      queuedJobs,
      connectionId,
    }),
  cancelQueuedJob: jobId =>
    action(actionTypes.CONNECTION.QUEUED_JOB_CANCEL, { jobId }),
  enableDebug: ({ id, debugDurInMins, match }) => action(actionTypes.CONNECTION.ENABLE_DEBUG, { id, debugDurInMins, match }),
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

  received: (resourceType, resourceId, response) =>
    action(actionTypes.FLOW_METRICS.RECEIVED, { resourceType, resourceId, response }),
  clear: resourceId => action(actionTypes.FLOW_METRICS.CLEAR, { resourceId }),
  failed: error => action(actionTypes.FLOW_METRICS.FAILED, { error }),
};
const resource = {
  replaceConnection: (_resourceId, _connectionId, _newConnectionId) =>
    action(actionTypes.RESOURCE.REPLACE_CONNECTION, { _resourceId, _connectionId, _newConnectionId }),

  downloadFile: (id, resourceType) =>
    action(actionTypes.RESOURCE.DOWNLOAD_FILE, { resourceType, id }),
  created: (id, tempId, resourceType) =>
    action(actionTypes.RESOURCE.CREATED, { id, tempId, resourceType }),

  request: (resourceType, id, message) =>
    action(actionTypes.RESOURCE.REQUEST, { resourceType, id, message }),
  updateChildIntegration: (parentId, childId) =>
    action(actionTypes.UPDATE_CHILD_INTEGRATION, { parentId, childId }),
  clearChildIntegration: () => action(actionTypes.CLEAR_CHILD_INTEGRATION),

  requestCollection: (resourceType, message) =>
    action(actionTypes.RESOURCE.REQUEST_COLLECTION, { resourceType, message }),

  received: (resourceType, resource) =>
    action(actionTypes.RESOURCE.RECEIVED, { resourceType, resource }),
  updated: (resourceType, resourceId, master, patch, context) =>
    action(actionTypes.RESOURCE.UPDATED, {
      resourceType,
      resourceId,
      master,
      patch,
      context,
    }),
  receivedCollection: (resourceType, collection) =>
    action(actionTypes.RESOURCE.RECEIVED_COLLECTION, {
      resourceType,
      collection,
    }),
  clearCollection: resourceType =>
    action(actionTypes.RESOURCE.CLEAR_COLLECTION, { resourceType }),
  patch: (resourceType, id, patchSet) =>
    action(actionTypes.RESOURCE.PATCH, { resourceType, id, patchSet }),
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

  clearStaged: (id, scope) =>
    action(actionTypes.RESOURCE.STAGE_CLEAR, { id, scope }),

  undoStaged: (id, scope) =>
    action(actionTypes.RESOURCE.STAGE_UNDO, { id, scope }),

  patchStaged: (id, patch, scope) =>
    action(actionTypes.RESOURCE.STAGE_PATCH, { patch, id, scope }),

  commitStaged: (resourceType, id, scope, options, context) =>
    action(actionTypes.RESOURCE.STAGE_COMMIT, {
      resourceType,
      id,
      scope,
      options,
      context,
    }),

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
    pingAndUpdate: connectionId =>
      action(actionTypes.CONNECTION.PING_AND_UPDATE, { connectionId }),
    updateStatus: collection =>
      action(actionTypes.CONNECTION.UPDATE_STATUS, { collection }),
    refreshStatus: integrationId =>
      action(actionTypes.CONNECTION.REFRESH_STATUS, { integrationId }),
    test: (resourceId, values) =>
      action(actionTypes.CONNECTION.TEST, {
        resourceId,
        values,
      }),
    requestStatusPoll: integrationId =>
      action(actionTypes.CONNECTION.STATUS_REQUEST_POLL, {integrationId}),
    cancelStatusPoll: integrationId =>
      action(actionTypes.CONNECTION.STATUS_CANCEL_POLL, {integrationId}),
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
    saveAndAuthorize: (resourceId, values) =>
      action(actionTypes.RESOURCE_FORM.SAVE_AND_AUTHORIZE, {
        resourceId,
        values,
      }),
    authorized: connectionId =>
      action(actionTypes.CONNECTION.AUTHORIZED, { connectionId }),
    commitAndAuthorize: resourceId =>
      action(actionTypes.RESOURCE_FORM.COMMIT_AND_AUTHORIZE, {
        resourceId,
      }),

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
      requestUserRoles: (connectionId, values) =>
        action(actionTypes.NETSUITE_USER_ROLES.REQUEST, {
          connectionId,
          values,
          hideNotificationMessage: true,
        }),
      testConnection: (connectionId, values) =>
        action(actionTypes.NETSUITE_USER_ROLES.REQUEST, {
          connectionId,
          values,
          hideNotificationMessage: false,
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
      action(actionTypes.RESOURCE.UPDATE_FLOW_NOTIFICATION, {flowId, isSubscribed }),
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
      init: (integrationId, flowId, id, options) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.INIT, {
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
      patchField: (integrationId, flowId, id, field, index, value) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.PATCH_FIELD,
          {
            integrationId,
            flowId,
            id,
            field,
            index,
            value,
          }
        ),
      patchSettings: (integrationId, flowId, id, index, value) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .PATCH_SETTINGS,
          { integrationId, flowId, id, index, value }
        ),
      delete: (integrationId, flowId, id, row) =>
        action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.DELETE, {
          integrationId,
          flowId,
          id,
          index: row,
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
      setVisibility: (integrationId, flowId, id, value) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .SET_VISIBILITY,
          {
            integrationId,
            flowId,
            id,
            value,
          }
        ),
      updateGenerates: (integrationId, flowId, id, generateFields) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .UPDATE_GENERATES,
          { integrationId, flowId, id, generateFields }
        ),
      patchIncompleteGenerates: (integrationId, flowId, id, index, value) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS
            .PATCH_INCOMPLETE_GENERATES,
          {
            integrationId,
            flowId,
            id,
            index,
            value,
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
      saveComplete: (integrationId, flowId, id) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.SAVE_COMPLETE,
          {
            integrationId,
            flowId,
            id,
          }
        ),
    },
    initComplete: (integrationId, flowId, sectionId) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.FORM.INIT_COMPLETE, {
        integrationId,
        flowId,
        sectionId,
      }),
    showFormValidations: (integrationId, flowId, sectionId) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SHOW_FORM_VALIDATION_ERRORS,
        {
          integrationId,
          flowId,
          sectionId,
        }
      ),
    requestUpgrade: (integrationId, options) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_UPGRADE, {
        integrationId,
        options,
      }),
    redirectTo: (integrationId, redirectTo) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.REDIRECT, {
        integrationId,
        redirectTo,
      }),
    receivedCategoryMappingData: (integrationId, flowId, mappingData) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.RECEIVED_CATEGORY_MAPPINGS_DATA,
        { integrationId, flowId, mappingData }
      ),
    requestCategoryMappingMetadata: (
      integrationId,
      flowId,
      categoryId,
      options
    ) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_CATEGORY_MAPPING_METADATA,
        { integrationId, flowId, categoryId, options }
      ),
    receivedCategoryMappingMetadata: (integrationId, flowId, metadata) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS
          .RECEIVED_CATEGORY_MAPPING_METADATA,
        { integrationId, flowId, metadata }
      ),
    receivedCategoryMappingGeneratesMetadata: (
      integrationId,
      flowId,
      metadata
    ) =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS
          .RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA,
        { integrationId, flowId, metadata }
      ),
    setCategoryMappingFilters: (integrationId, flowId, filters) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPING_FILTERS, {
        integrationId,
        flowId,
        filters,
      }),
    clearVariationMappings: (integrationId, flowId, data) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.CLEAR_VARIATION_MAPPINGS, {
        integrationId,
        flowId,
        data,
      }),

    addCategory: (integrationId, flowId, data) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.ADD_CATEGORY, {
        integrationId,
        flowId,
        data,
      }),
    deleteCategory: (integrationId, flowId, sectionId) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.DELETE_CATEGORY, {
        integrationId,
        flowId,
        sectionId,
      }),
    restoreCategory: (integrationId, flowId, sectionId) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.RESTORE_CATEGORY, {
        integrationId,
        flowId,
        sectionId,
      }),
    clearRedirect: integrationId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.CLEAR_REDIRECT, {
        integrationId,
      }),
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
    update: (integrationId, flowId, storeId, sectionId, values, options) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE, {
        integrationId,
        flowId,
        storeId,
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
  installer: {
    setOauthConnectionMode: (connectionId, openOauthConnection, id) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.RECEIVED_OAUTH_CONNECTION_STATUS, {
        connectionId, openOauthConnection, id,
      }),
    initChild: integrationId => action(actionTypes.INTEGRATION_APPS.INSTALLER.INIT_CHILD, {
      id: integrationId,
    }),
    installStep: (integrationId, installerFunction, storeId, addOnId) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, {
        id: integrationId,
        installerFunction,
        storeId,
        addOnId,
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
    updateStep: (integrationId, installerFunction, update, formMeta) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.UPDATE, {
        id: integrationId,
        installerFunction,
        update,
        formMeta,
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
    preUninstall: (storeId, integrationId) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL, {
        storeId,
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
    stepUninstall: (storeId, integrationId, uninstallerFunction, addOnId) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.REQUEST, {
        storeId,
        id: integrationId,
        uninstallerFunction,
        addOnId,
      }),
    receivedUninstallSteps: (uninstallSteps, storeId, id) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.RECEIVED_STEPS, {
        uninstallSteps,
        id,
        storeId,
      }),
    failedUninstallSteps: (id, error, storeId) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.FAILED_UNINSTALL_STEPS, {
        id,
        error,
        storeId,
      }),
    uninstallIntegration: integrationId =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.DELETE_INTEGRATION, {
        integrationId,
      }),
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
  store: {
    addNew: integrationId =>
      action(actionTypes.INTEGRATION_APPS.STORE.ADD, { id: integrationId }),
    updateStep: (integrationId, installerFunction, update) =>
      action(actionTypes.INTEGRATION_APPS.STORE.UPDATE, {
        id: integrationId,
        installerFunction,
        update,
      }),
    clearSteps: integrationId =>
      action(actionTypes.INTEGRATION_APPS.STORE.CLEAR, { id: integrationId }),
    completedStepInstall: (integrationId, installerFunction, steps) =>
      action(actionTypes.INTEGRATION_APPS.STORE.COMPLETE, {
        id: integrationId,
        installerFunction,
        steps,
      }),
    installStep: (integrationId, installerFunction) =>
      action(actionTypes.INTEGRATION_APPS.STORE.INSTALL, {
        id: integrationId,
        installerFunction,
      }),
    failedNewStoreSteps: (integrationId, message) =>
      action(actionTypes.INTEGRATION_APPS.STORE.FAILURE, {
        id: integrationId,
        message,
      }),
    receivedNewStoreSteps: (integrationId, steps) =>
      action(actionTypes.INTEGRATION_APPS.STORE.RECEIVED, {
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
};
const ashare = {
  receivedCollection: ashares =>
    resource.receivedCollection('ashares', ashares),
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
  verifyBundleOrPackageInstall: (step, connection, templateId) =>
    action(actionTypes.TEMPLATE.VERIFY_BUNDLE_INSTALL, {
      step,
      connection,
      templateId,
    }),
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
  upload: (resourceType, resourceId, fileType, file) =>
    action(actionTypes.FILE.UPLOAD, {
      resourceType,
      resourceId,
      fileType,
      file,
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
    delete: () => action(actionTypes.DELETE_PROFILE),
    update: profile => action(actionTypes.UPDATE_PROFILE, { profile }),
    unlinkWithGoogle: () => action(actionTypes.UNLINK_WITH_GOOGLE),
    unlinkedWithGoogle: () => action(actionTypes.UNLINKED_WITH_GOOGLE),
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
      requestUpdate: (actionType, connectorId, licenseId) =>
        action(actionTypes.LICENSE_UPDATE_REQUEST, { actionType, connectorId, licenseId}),
      licenseUpgradeRequestSubmitted: message =>
        action(actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED, { message }),
      leave: id => action(actionTypes.ACCOUNT_LEAVE_REQUEST, { id }),
      switchTo: ({ id }) => action(actionTypes.ACCOUNT_SWITCH, { id }),
      requestLicenseEntitlementUsage: () =>
        action(actionTypes.LICENSE_ENTITLEMENT_USAGE_REQUEST),
      requestNumEnabledFlows: () =>
        action(actionTypes.LICENSE_NUM_ENABLED_FLOWS_REQUEST, {}),
      receivedNumEnabledFlows: response =>
        action(actionTypes.LICENSE_NUM_ENABLED_FLOWS_RECEIVED, { response }),
      receivedLicenseEntitlementUsage: response =>
        action(actionTypes.LICENSE_ENTITLEMENT_USAGE_RECEIVED, { response }),
      addLinkedConnectionId: connectionId =>
        action(actionTypes.ACCOUNT_ADD_SUITESCRIPT_LINKED_CONNECTION, {
          connectionId,
        }),
      deleteLinkedConnectionId: connectionId =>
        action(actionTypes.ACCOUNT_DELETE_SUITESCRIPT_LINKED_CONNECTION, {
          connectionId,
        }),
    },
  },
  preferences: {
    request: message => resource.request('preferences', undefined, message),
    update: preferences =>
      action(actionTypes.UPDATE_PREFERENCES, { preferences }),
  },
  sharedNotifications: {
    acceptInvite: (resourceType, id, isAccountTransfer) =>
      action(actionTypes.SHARED_NOTIFICATION_ACCEPT, { resourceType, id, isAccountTransfer }),
    acceptedInvite: id =>
      action(actionTypes.SHARED_NOTIFICATION_ACCEPTED, { id }),
    rejectInvite: (resourceType, id) =>
      action(actionTypes.SHARED_NOTIFICATION_REJECT, { resourceType, id }),
  },
};
const sampleData = {
  request: (resourceId, resourceType, values, stage, options = {}) =>
    action(actionTypes.SAMPLEDATA.REQUEST, {
      resourceId,
      resourceType,
      values,
      stage,
      options,
    }),
  requestLookupPreview: (resourceId, flowId, formValues) =>
    action(actionTypes.SAMPLEDATA.LOOKUP_REQUEST, {
      resourceId,
      flowId,
      formValues,
    }),
  received: (resourceId, previewData) =>
    action(actionTypes.SAMPLEDATA.RECEIVED, { resourceId, previewData }),
  update: (resourceId, processedData, stage) =>
    action(actionTypes.SAMPLEDATA.UPDATE, { resourceId, processedData, stage }),
  patch: (resourceId, patch) =>
    action(actionTypes.SAMPLEDATA.PATCH, { resourceId, patch }),
  receivedError: (resourceId, error, stage) =>
    action(actionTypes.SAMPLEDATA.RECEIVED_ERROR, { resourceId, error, stage }),
  reset: resourceId => action(actionTypes.SAMPLEDATA.RESET, { resourceId }),
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
};
const flowData = {
  init: flow => action(actionTypes.FLOW_DATA.INIT, { flow }),
  requestStage: (flowId, resourceId, stage) =>
    action(actionTypes.FLOW_DATA.STAGE_REQUEST, { flowId, resourceId, stage }),
  requestPreviewData: (flowId, resourceId, previewType) =>
    action(actionTypes.FLOW_DATA.PREVIEW_DATA_REQUEST, {
      flowId,
      resourceId,
      previewType,
    }),
  receivedPreviewData: (flowId, resourceId, previewData, previewType) =>
    action(actionTypes.FLOW_DATA.PREVIEW_DATA_RECEIVED, {
      flowId,
      resourceId,
      previewData,
      previewType,
    }),
  requestProcessorData: (flowId, resourceId, resourceType, processor) =>
    action(actionTypes.FLOW_DATA.PROCESSOR_DATA_REQUEST, {
      flowId,
      resourceId,
      resourceType,
      processor,
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
  requestSampleData: (flowId, resourceId, resourceType, stage, refresh) =>
    action(actionTypes.FLOW_DATA.SAMPLE_DATA_REQUEST, {
      flowId,
      resourceId,
      resourceType,
      stage,
      refresh,
    }),
  resetStages: (flowId, resourceId, stages = [], statusToUpdate) =>
    action(actionTypes.FLOW_DATA.RESET_STAGES, { flowId, resourceId, stages, statusToUpdate}),
  resetFlowSequence: (flowId, updatedFlow) =>
    action(actionTypes.FLOW_DATA.FLOW_SEQUENCE_RESET, { flowId, updatedFlow }),
  updateFlowsForResource: (resourceId, resourceType, stagesToReset = []) =>
    action(actionTypes.FLOW_DATA.FLOWS_FOR_RESOURCE_UPDATE, {
      resourceId,
      resourceType,
      stagesToReset,
    }),
  updateFlow: flowId => action(actionTypes.FLOW_DATA.FLOW_UPDATE, { flowId }),
  updateResponseMapping: (flowId, resourceIndex, responseMapping) =>
    action(actionTypes.FLOW_DATA.FLOW_RESPONSE_MAPPING_UPDATE, {
      flowId,
      resourceIndex,
      responseMapping,
    }),
};
const app = {
  fetchUiVersion: () => action(actionTypes.UI_VERSION_FETCH),
  updateUIVersion: version => action(actionTypes.UI_VERSION_UPDATE, {version}),
  reload: () => action(actionTypes.APP_RELOAD),
  deleteDataState: () => action(actionTypes.APP_DELETE_DATA_STATE),
  errored: () => action(actionTypes.APP_ERRORED),
  clearError: () => action(actionTypes.APP_CLEAR_ERROR),
  userAcceptedAccountTransfer: () => action(actionTypes.USER_ACCEPTED_ACCOUNT_TRANSFER),
};
const postFeedback = (resourceType, fieldId, helpful, feedback) =>
  action(actionTypes.POST_FEEDBACK, {
    resourceType,
    fieldId,
    helpful,
    feedback,
  });
const toggleBanner = () => action(actionTypes.APP_TOGGLE_BANNER);
const toggleDrawer = () => action(actionTypes.APP_TOGGLE_DRAWER);
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
    action(actionTypes.EDITOR.INIT, { id, processor, options }),
  changeLayout: id => action(actionTypes.EDITOR.CHANGE_LAYOUT, { id }),
  patch: (id, patch) => action(actionTypes.EDITOR.PATCH, { id, patch }),
  reset: id => action(actionTypes.EDITOR.RESET, { id }),
  clear: id => action(actionTypes.EDITOR.CLEAR, { id }),
  updateHelperFunctions: helperFunctions =>
    action(actionTypes.EDITOR.UPDATE_HELPER_FUNCTIONS, { helperFunctions }),
  refreshHelperFunctions: () =>
    action(actionTypes.EDITOR.REFRESH_HELPER_FUNCTIONS),
  evaluateRequest: id => action(actionTypes.EDITOR.EVALUATE_REQUEST, { id }),
  validateFailure: (id, violations) =>
    action(actionTypes.EDITOR.VALIDATE_FAILURE, { id, violations }),
  evaluateFailure: (id, error) =>
    action(actionTypes.EDITOR.EVALUATE_FAILURE, { id, error }),
  evaluateResponse: (id, result) =>
    action(actionTypes.EDITOR.EVALUATE_RESPONSE, { id, result }),
  save: (id, context) => action(actionTypes.EDITOR.SAVE, { id, context }),
  saveFailed: id => action(actionTypes.EDITOR.SAVE_FAILED, { id }),
  saveComplete: id => action(actionTypes.EDITOR.SAVE_COMPLETE, { id }),
};
// #endregion
// #region Mapping actions
const mapping = {
  init: ({ flowId, importId, subRecordMappingId}) =>
    action(actionTypes.MAPPING.INIT, {flowId, importId, subRecordMappingId}),
  initComplete: (options = {}) =>
    action(actionTypes.MAPPING.INIT_COMPLETE, {...options}),
  initFailed: () => action(actionTypes.MAPPING.INIT_FAILED, {}),
  patchField: (field, key, value) =>
    action(actionTypes.MAPPING.PATCH_FIELD, { field, key, value }),
  patchGenerateThroughAssistant: value =>
    action(actionTypes.MAPPING.PATCH_GENERATE_THROUGH_ASSISTANT, { value }),
  addLookup: ({value, isConditionalLookup}) =>
    action(actionTypes.MAPPING.ADD_LOOKUP, { value, isConditionalLookup }),
  updateLookup: ({oldValue, newValue, isConditionalLookup}) =>
    action(actionTypes.MAPPING.UPDATE_LOOKUP, { oldValue, newValue, isConditionalLookup }),
  patchSettings: (key, value) =>
    action(actionTypes.MAPPING.PATCH_SETTINGS, { key, value }),
  setVisibility: value =>
    action(actionTypes.MAPPING.SET_VISIBILITY, { value }),
  patchIncompleteGenerates: (key, value) =>
    action(actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES, { key, value}),
  delete: key => action(actionTypes.MAPPING.DELETE, { key }),
  save: ({ match }) => action(actionTypes.MAPPING.SAVE, { match }),
  saveFailed: () => action(actionTypes.MAPPING.SAVE_FAILED, { }),
  saveComplete: () => action(actionTypes.MAPPING.SAVE_COMPLETE, { }),
  requestPreview: () => action(actionTypes.MAPPING.PREVIEW_REQUESTED, { }),
  previewReceived: value =>
    action(actionTypes.MAPPING.PREVIEW_RECEIVED, {value }),
  previewFailed: () => action(actionTypes.MAPPING.PREVIEW_FAILED, { }),
  setNSAssistantFormLoaded: value =>
    action(actionTypes.MAPPING.SET_NS_ASSISTANT_FORM_LOADED, { value }),
  refreshGenerates: () => action(actionTypes.MAPPING.REFRESH_GENERATES, { }),
  updateLastFieldTouched: key => action(actionTypes.MAPPING.UPDATE_LAST_TOUCHED_FIELD, { key }),
  updateMappings: mappings => action(actionTypes.MAPPING.UPDATE_LIST, { mappings }),
  clear: () => action(actionTypes.MAPPING.CLEAR, {}),
  shiftOrder: (key, shiftIndex) => action(actionTypes.MAPPING.SHIFT_ORDER, { key, shiftIndex }),
  setValidationMsg: value => action(actionTypes.MAPPING.SET_VALIDATION_MSG, { value }),

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
  init: (resourceType, resourceId, isNew, skipCommit, flowId, initData, integrationId) =>
    action(actionTypes.RESOURCE_FORM.INIT, {
      resourceType,
      resourceId,
      isNew,
      skipCommit,
      flowId,
      initData,
      integrationId,
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
    flowId
  ) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT, {
      resourceType,
      resourceId,
      values,
      match,
      skipClose,
      isGenerate,
      flowId,
    }),
  saveAndContinue: (resourceType, resourceId, values, match, skipClose) =>
    action(actionTypes.RESOURCE_FORM.SAVE_AND_CONTINUE, {
      resourceType,
      resourceId,
      values,
      match,
      skipClose,
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
  showBundleInstallNotification: (bundleVersion, bundleUrl, resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.SHOW_BUNDLE_INSTALL_NOTIFICATION, {bundleVersion, bundleUrl, resourceType, resourceId}),
  hideBundleInstallNotification: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.HIDE_BUNDLE_INSTALL_NOTIFICATION, {resourceType, resourceId}),
};
const accessToken = {
  displayToken: id => action(actionTypes.ACCESSTOKEN_TOKEN_DISPLAY, { id }),
  generateToken: id => action(actionTypes.ACCESSTOKEN_TOKEN_GENERATE, { id }),
  tokenReceived: accessToken =>
    action(actionTypes.ACCESSTOKEN_TOKEN_RECEIVED, { accessToken }),
  maskToken: accessToken =>
    action(actionTypes.ACCESSTOKEN_TOKEN_MASK, { accessToken }),
  revoke: id => action(actionTypes.ACCESSTOKEN_REVOKE, { id }),
  activate: id => action(actionTypes.ACCESSTOKEN_ACTIVATE, { id }),
  deletePurged: () => action(actionTypes.ACCESSTOKEN_DELETE_PURGED),
  updatedCollection: () => action(actionTypes.ACCESSTOKEN_UPDATED_COLLECTION),
};
const job = {
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
  requestLatestJobs: ({ integrationId, flowId }) =>
    action(actionTypes.JOB.REQUEST_LATEST, {
      integrationId,
      flowId,
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

  cancel: ({ jobId, flowJobId }) =>
    action(actionTypes.JOB.CANCEL, { jobId, flowJobId }),
  resolveAllPending: () => action(actionTypes.JOB.RESOLVE_ALL_PENDING),
  resolveSelected: ({ jobs, match }) =>
    action(actionTypes.JOB.RESOLVE_SELECTED, { jobs, match }),
  resolveAll: ({ flowId, storeId, integrationId, filteredJobsOnly, match }) =>
    action(actionTypes.JOB.RESOLVE_ALL, { flowId, storeId, integrationId, filteredJobsOnly, match }),
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
  retryAll: ({ flowId, storeId, integrationId, match }) =>
    action(actionTypes.JOB.RETRY_ALL, { flowId, storeId, integrationId, match }),
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
  updateRetryData: ({ retryData, retryId }) =>
    action(actionTypes.JOB.ERROR.UPDATE_RETRY_DATA, { retryData, retryId }),
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
    error: ({integrationId}) =>
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
    received: ({flowId, latestJobs}) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.RECEIVED, {
        flowId, latestJobs,
      }),
    requestJobFamily: ({ flowId, jobId}) =>
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST_JOB_FAMILY, {
        flowId, jobId,
      }),
    receivedJobFamily: ({ flowId, job}) =>
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
      action(actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CANCEL, { flowId, jobIds}),
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
    error: ({ flowId, resourceId, isResolved = false }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ERROR, {
        flowId,
        resourceId,
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
    selectAll: ({ flowId, resourceId, checked, options }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ALL_ERRORS, {
        flowId,
        resourceId,
        checked,
        options,
      }),
    saveAndRetry: ({ flowId, resourceId, retryId, retryData }) => action(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.SAVE_AND_RETRY, {
        flowId,
        resourceId,
        retryId,
        retryData,
      }
    ),
    retry: ({ flowId, resourceId, retryIds = [], isResolved = false }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.REQUEST,
        {
          flowId,
          resourceId,
          retryIds,
          isResolved,
        }
      ),
    resolve: ({ flowId, resourceId, errorIds = [] }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST,
        {
          flowId,
          resourceId,
          errorIds,
        }
      ),
    retryReceived: ({ flowId, resourceId, retryCount, isResolved = false }) =>
      action(
        actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.RECEIVED,
        {
          flowId,
          resourceId,
          isResolved,
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
    clear: ({ flowId, resourceId, isResolved = false }) =>
      action(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.CLEAR, {
        flowId,
        resourceId,
        isResolved,
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
    receivedError: ({ flowId, resourceId, retryId, error }) =>
      action(actionTypes.ERROR_MANAGER.RETRY_DATA.RECEIVED_ERROR, {
        flowId,
        resourceId,
        retryId,
        error,
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
    clear: flowId => action(actionTypes.ERROR_MANAGER.RETRY_STATUS.CLEAR, { flowId }),
    request: ({ flowId, resourceId }) => action(actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST, ({ flowId, resourceId })),
    received: ({ flowId, resourceId, status }) => action(actionTypes.ERROR_MANAGER.RETRY_STATUS.RECEIVED, ({ flowId, resourceId, status})),
  },
};
const flow = {
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
};
const assistantMetadata = {
  request: ({ adaptorType, assistant }) =>
    action(actionTypes.METADATA.ASSISTANT_REQUEST, { adaptorType, assistant }),
  received: ({ adaptorType, assistant, metadata }) =>
    action(actionTypes.METADATA.ASSISTANT_RECEIVED, {
      adaptorType,
      assistant,
      metadata,
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
  init: ({flowId, resourceId}) =>
    action(actionTypes.RESPONSE_MAPPING.INIT, {
      resourceId,
      flowId,
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
  formRequest: (resourceType, resourceId) =>
    action(actionTypes.CUSTOM_SETTINGS.FORM_REQUEST, {
      resourceType,
      resourceId,
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
  request: (kind, identifier, resource) =>
    action(actionTypes.EXPORTDATA.REQUEST, {
      kind,
      identifier,
      resource,
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

const editorSampleData = {
  request: ({
    flowId,
    resourceId,
    resourceType,
    stage,
    formKey,
    fieldType,
    requestedTemplateVersion,
    isEditorV2Supported,
  }) =>
    action(actionTypes.EDITOR_SAMPLE_DATA.REQUEST, {
      flowId,
      resourceId,
      resourceType,
      stage,
      formKey,
      fieldType,
      requestedTemplateVersion,
      isEditorV2Supported,
    }),
  received: ({ flowId, resourceId, fieldType, sampleData, templateVersion }) =>
    action(actionTypes.EDITOR_SAMPLE_DATA.RECEIVED, {
      flowId,
      resourceId,
      fieldType,
      sampleData,
      templateVersion,
    }),
  failed: ({ flowId, resourceId, fieldType }) =>
    action(actionTypes.EDITOR_SAMPLE_DATA.FAILED, {
      resourceId,
      flowId,
      fieldType,
    }),
  clear: ({ resourceId, flowId }) =>
    action(actionTypes.EDITOR_SAMPLE_DATA.CLEAR, {
      resourceId,
      flowId,
    }),
};

const hooks = {
  save: context => action(actionTypes.HOOKS.SAVE, context),
};

export default {
  form,
  postFeedback,
  app,
  toggleBanner,
  toggleDrawer,
  metadata,
  fileDefinitions,
  connectors,
  cancelTask,
  integrationApp,
  clearComms,
  clearCommByKey,
  patchFilter,
  clearFilter,
  editor,
  resourceForm,
  resource,
  user,
  api,
  ashare,
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
  sampleData,
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
  editorSampleData,
  hooks,
};

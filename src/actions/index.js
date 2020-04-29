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
  clearStore: () => action(actionTypes.CLEAR_STORE),
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
  requestRevoke: connectionId =>
    action(actionTypes.CONNECTION.REVOKE_REQUEST, {
      connectionId,
    }),
  completeDeregister: (deregisteredId, integrationId) =>
    action(actionTypes.CONNECTION.DEREGISTER_COMPLETE, {
      deregisteredId,
      integrationId,
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
  receivedQueuedJobs: (queuedJobs, connectionId) =>
    action(actionTypes.CONNECTION.QUEUED_JOBS_RECEIVED, {
      queuedJobs,
      connectionId,
    }),
  cancelQueuedJob: jobId =>
    action(actionTypes.CONNECTION.QUEUED_JOB_CANCEL, { jobId }),
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
  purge: (resourceType, resourceId) =>
    action(actionTypes.RECYCLEBIN.PURGE, { resourceType, resourceId }),
};
const resource = {
  downloadFile: (id, resourceType) =>
    action(actionTypes.RESOURCE.DOWNLOAD_FILE, { resourceType, id }),
  created: (id, tempId, resourceType) =>
    action(actionTypes.RESOURCE.CREATED, { id, tempId, resourceType }),

  request: (resourceType, id, message) =>
    action(actionTypes.RESOURCE.REQUEST, { resourceType, id, message }),

  requestCollection: (resourceType, message) =>
    action(actionTypes.RESOURCE.REQUEST_COLLECTION, { resourceType, message }),

  received: (resourceType, resource) =>
    action(actionTypes.RESOURCE.RECEIVED, { resourceType, resource }),
  updated: (resourceType, resourceId, master, patch) =>
    action(actionTypes.RESOURCE.UPDATED, {
      resourceType,
      resourceId,
      master,
      patch,
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

  commitStaged: (resourceType, id, scope, options) =>
    action(actionTypes.RESOURCE.STAGE_COMMIT, {
      resourceType,
      id,
      scope,
      options,
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
  flows: {
    requestLineGraphDetails: flowId =>
      action(actionTypes.RESOURCE.REQUEST_LINE_GRAPH_DETAILS, { flowId }),
  },
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
    update: notifications =>
      action(actionTypes.RESOURCE.UPDATE_NOTIFICATIONS, { notifications }),
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
      save: (definitionRules, formValues) =>
        action(actionTypes.FILE_DEFINITIONS.DEFINITION.USER_DEFINED.SAVE, {
          definitionRules,
          formValues,
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
      updateLookup: (integrationId, flowId, id, lookups) =>
        action(
          actionTypes.INTEGRATION_APPS.SETTINGS.CATEGORY_MAPPINGS.UPDATE_LOOKUP,
          {
            integrationId,
            flowId,
            id,
            lookups,
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
    installStep: (integrationId, installerFunction, storeId, addOnId) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, {
        id: integrationId,
        installerFunction,
        storeId,
        addOnId,
      }),
    scriptInstallStep: (integrationId, connectionId, connectionDoc) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.SCRIPT_REQUEST, {
        id: integrationId,
        connectionId,
        connectionDoc,
      }),
    updateStep: (integrationId, installerFunction, update) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.UPDATE, {
        id: integrationId,
        installerFunction,
        update,
      }),
    completedStepInstall: (stepCompleteResponse, id, installerFunction) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.DONE, {
        stepsToUpdate: stepCompleteResponse.stepsToUpdate,
        id,
        installerFunction,
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
    receivedIntegrationClonedStatus: (id, integrationId) =>
      action(actionTypes.INTEGRATION_APPS.CLONE.STATUS, {
        id,
        isCloned: true,
        integrationId,
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
  processFile: ({ fileId, file, fileType }) =>
    action(actionTypes.FILE.PROCESS, {
      fileId,
      file,
      fileType,
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
      requestUpdate: actionType =>
        action(actionTypes.LICENSE_UPDATE_REQUEST, { actionType }),
      licenseUpgradeRequestSubmitted: message =>
        action(actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED, { message }),
      leave: id => action(actionTypes.ACCOUNT_LEAVE_REQUEST, { id }),
      switchTo: ({ id }) => action(actionTypes.ACCOUNT_SWITCH, { id }),
      requestNumEnabledFlows: () =>
        action(actionTypes.LICENSE_NUM_ENABLED_FLOWS_REQUEST, {}),
      receivedNumEnabledFlows: response =>
        action(actionTypes.LICENSE_NUM_ENABLED_FLOWS_RECEIVED, { response }),
    },
  },
  preferences: {
    request: message => resource.request('preferences', undefined, message),
    update: preferences =>
      action(actionTypes.UPDATE_PREFERENCES, { preferences }),
    toggleDebug: () => action(actionTypes.TOGGLE_DEBUG),
  },
  sharedNotifications: {
    acceptInvite: (resourceType, id) =>
      action(actionTypes.SHARED_NOTIFICATION_ACCEPT, { resourceType, id }),
    acceptedInvite: id =>
      action(actionTypes.SHARED_NOTIFICATION_ACCEPTED, { id }),
    rejectInvite: (resourceType, id) =>
      action(actionTypes.SHARED_NOTIFICATION_REJECT, { resourceType, id }),
  },
};
const sampleData = {
  request: (resourceId, resourceType, values, stage, runOffline) =>
    action(actionTypes.SAMPLEDATA.REQUEST, {
      resourceId,
      resourceType,
      values,
      stage,
      runOffline,
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
  reset: (flowId, resourceId) =>
    action(actionTypes.FLOW_DATA.RESET, { flowId, resourceId }),
  resetFlowSequence: (flowId, updatedFlow) =>
    action(actionTypes.FLOW_DATA.FLOW_SEQUENCE_RESET, { flowId, updatedFlow }),
  updateFlowsForResource: (resourceId, resourceType) =>
    action(actionTypes.FLOW_DATA.FLOWS_FOR_RESOURCE_UPDATE, {
      resourceId,
      resourceType,
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
  reload: () => action(actionTypes.APP_RELOAD),
  errored: () => action(actionTypes.APP_ERRORED),
  clearError: () => action(actionTypes.APP_CLEAR_ERROR),
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
    action(actionTypes.EDITOR_INIT, { id, processor, options }),
  changeLayout: id => action(actionTypes.EDITOR_CHANGE_LAYOUT, { id }),
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
  save: id => action(actionTypes.EDITOR_SAVE, { id }),
  saveFailed: id => action(actionTypes.EDITOR_SAVE_FAILED, { id }),
  saveComplete: id => action(actionTypes.EDITOR_SAVE_COMPLETE, { id }),
};
// #endregion
// #region Mapping actions
const mapping = {
  init: ({ id, options }) =>
    action(actionTypes.MAPPING.INIT, {
      id,
      options,
    }),
  patchField: (id, field, key, value) =>
    action(actionTypes.MAPPING.PATCH_FIELD, { id, field, key, value }),
  updateImportSampleData: (id, value) =>
    action(actionTypes.MAPPING.UPDATE_IMPORT_SAMPLE_DATA, { id, value }),
  updateLookup: (id, lookups) =>
    action(actionTypes.MAPPING.UPDATE_LOOKUP, { id, lookups }),
  patchSettings: (id, key, value) =>
    action(actionTypes.MAPPING.PATCH_SETTINGS, { id, key, value }),
  setVisibility: (id, value) =>
    action(actionTypes.MAPPING.SET_VISIBILITY, { id, value }),
  patchIncompleteGenerates: (id, key, value) =>
    action(actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES, {
      id,
      key,
      value,
    }),
  delete: (id, key) => action(actionTypes.MAPPING.DELETE, { id, key }),
  save: id => action(actionTypes.MAPPING.SAVE, { id }),
  saveFailed: id => action(actionTypes.MAPPING.SAVE_FAILED, { id }),
  saveComplete: id => action(actionTypes.MAPPING.SAVE_COMPLETE, { id }),
  updateFlowData: (id, value) =>
    action(actionTypes.MAPPING.UPDATE_FLOW_DATA, { id, value }),
  requestPreview: id => action(actionTypes.MAPPING.PREVIEW_REQUESTED, { id }),
  previewReceived: (id, value) =>
    action(actionTypes.MAPPING.PREVIEW_RECEIVED, { id, value }),
  previewFailed: id => action(actionTypes.MAPPING.PREVIEW_FAILED, { id }),
  changeOrder: (id, value) =>
    action(actionTypes.MAPPING.CHANGE_ORDER, { id, value }),
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
  init: (resourceType, resourceId, isNew, skipCommit, flowId, initData) =>
    action(actionTypes.RESOURCE_FORM.INIT, {
      resourceType,
      resourceId,
      isNew,
      skipCommit,
      flowId,
      initData,
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
  clearInitData: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.CLEAR_INIT_DATA, {
      resourceId,
      resourceType,
    }),
  showFormValidations: (resourceType, resourceId) =>
    action(actionTypes.RESOURCE_FORM.SHOW_FORM_VALIDATION_ERRORS, {
      resourceType,
      resourceId,
    }),
  submit: (resourceType, resourceId, values, match, skipClose, isGenerate) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT, {
      resourceType,
      resourceId,
      values,
      match,
      skipClose,
      isGenerate,
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
  downloadFiles: ({ jobId, fileType, fileIds }) =>
    action(actionTypes.JOB.DOWNLOAD_FILES, { jobId, fileType, fileIds }),
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
const flow = {
  run: ({ flowId, customStartDate, options }) =>
    action(actionTypes.FLOW.RUN, { flowId, customStartDate, options }),
  runDataLoader: ({ flowId, customStartDate, fileContent, fileType }) =>
    action(actionTypes.FLOW.RUN_DATA_LOADER, {
      flowId,
      customStartDate,
      fileContent,
      fileType,
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
  init: (id, value) =>
    action(actionTypes.RESPONSE_MAPPING.INIT, {
      id,
      value,
    }),
  setFormattedMapping: (id, value) =>
    action(actionTypes.RESPONSE_MAPPING.SET_FORMATTED_MAPPING, {
      id,
      value,
    }),
  patchField: (id, field, index, value) =>
    action(actionTypes.RESPONSE_MAPPING.PATCH_FIELD, {
      id,
      field,
      index,
      value,
    }),
  delete: (id, index) =>
    action(actionTypes.RESPONSE_MAPPING.DELETE, { id, index }),
  save: id => action(actionTypes.RESPONSE_MAPPING.SAVE, { id }),
  saveFailed: id => action(actionTypes.RESPONSE_MAPPING.SAVE_FAILED, { id }),
  saveComplete: id =>
    action(actionTypes.RESPONSE_MAPPING.SAVE_COMPLETE, { id }),
};
// #endregion

export default {
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
  job,
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
};

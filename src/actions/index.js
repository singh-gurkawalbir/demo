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
  completeDeregister: (deregisteredId, integrationId) =>
    action(actionTypes.CONNECTION.DEREGISTER_COMPLETE, {
      deregisteredId,
      integrationId,
    }),
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
  clearCollection: resourceType =>
    action(actionTypes.RESOURCE.CLEAR_COLLECTION, { resourceType }),
  patch: (resourceType, id, patchSet) =>
    action(actionTypes.RESOURCE.PATCH, { resourceType, id, patchSet }),
  delete: (resourceType, id) =>
    action(actionTypes.RESOURCE.DELETE, { resourceType, id }),

  deleted: (resourceType, id) =>
    action(actionTypes.RESOURCE.DELETED, { resourceType, id }),

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
    authorized: connectionId =>
      action(actionTypes.CONNECTION.AUTHORIZED, { connectionId }),
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
const connectors = {
  refreshMetadata: (fieldType, fieldName, _integrationId) =>
    action(actionTypes.CONNECTORS.METADATA_REQUEST, {
      fieldType,
      fieldName,
      _integrationId,
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
  request: ({
    connectionId,
    metadataType,
    mode,
    filterKey,
    recordType,
    selectField,
    addInfo,
  }) => {
    if (mode) {
      return action(actionTypes.METADATA.NETSUITE_REQUEST, {
        connectionId,
        metadataType,
        mode,
        filterKey,
        recordType,
        selectField,
        addInfo,
      });
    }

    return action(actionTypes.METADATA.SALESFORCE_REQUEST, {
      connectionId,
      metadataType,
      recordType,
      selectField,
    });
  },
  refresh: (
    connectionId,
    metadataType,
    mode,
    filterKey,
    recordType,
    selectField
  ) =>
    action(actionTypes.METADATA.REFRESH, {
      connectionId,
      metadataType,
      mode,
      filterKey,
      recordType,
      selectField,
    }),
  netsuite: {
    receivedCollection: (
      metadata,
      metadataType,
      connectionId,
      mode,
      filterKey,
      recordType,
      selectField
    ) =>
      action(actionTypes.METADATA.RECEIVED_NETSUITE, {
        metadata,
        metadataType,
        connectionId,
        mode,
        filterKey,
        recordType,
        selectField,
      }),
    receivedError: (
      metadataError,
      metadataType,
      connectionId,
      mode,
      filterKey,
      recordType,
      selectField
    ) =>
      action(actionTypes.METADATA.RECEIVED_NETSUITE_ERROR, {
        metadataError,
        metadataType,
        connectionId,
        mode,
        filterKey,
        recordType,
        selectField,
      }),
  },
  salesforce: {
    receivedCollection: (
      metadata,
      metadataType,
      connectionId,
      recordType,
      selectField
    ) =>
      action(actionTypes.METADATA.RECEIVED_SALESFORCE, {
        metadata,
        metadataType,
        connectionId,
        recordType,
        selectField,
      }),
    receivedError: (
      metadataError,
      metadataType,
      connectionId,
      recordType,
      selectField
    ) =>
      action(actionTypes.METADATA.RECEIVED_SALESFORCE_ERROR, {
        metadataError,
        metadataType,
        connectionId,
        recordType,
        selectField,
      }),
  },
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
    requestUpgrade: (integration, options) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.REQUEST_UPGRADE, {
        integration,
        options,
      }),
    requestedUpgrade: licenseId =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE_REQUESTED, {
        licenseId,
      }),
    upgrade: (integration, license) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE, {
        integration,
        license,
      }),
    update: (integrationId, flowId, storeId, values) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE, {
        integrationId,
        flowId,
        storeId,
        values,
      }),
    clear: (integrationId, flowId) =>
      action(actionTypes.INTEGRATION_APPS.SETTINGS.FORM.CLEAR, {
        integrationId,
        flowId,
      }),
    submitComplete: params =>
      action(
        actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_COMPLETE,
        params
      ),
  },
  installer: {
    installStep: (integrationId, installerFunction) =>
      action(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, {
        id: integrationId,
        installerFunction,
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
    stepUninstall: (storeId, integrationId, uninstallerFunction) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.REQUEST, {
        storeId,
        id: integrationId,
        uninstallerFunction,
      }),
    receivedUninstallSteps: (uninstallSteps, storeId, id) =>
      action(actionTypes.INTEGRATION_APPS.UNINSTALLER.RECEIVED_STEPS, {
        uninstallSteps,
        id,
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
    receivedNewStoreSteps: (integrationId, steps) =>
      action(actionTypes.INTEGRATION_APPS.STORE.RECEIVED, {
        id: integrationId,
        steps,
      }),
  },
};
const ashare = {
  receivedCollection: ashares =>
    resource.receivedCollection('ashares', ashares),
};
const template = {
  generateZip: integrationId =>
    action(actionTypes.TEMPLATE.ZIP_GENERATE, { integrationId }),
  requestPreview: templateId =>
    action(actionTypes.TEMPLATE.PREVIEW_REQUEST, { templateId }),
  installStepsReceived: (installSteps, connectionMap, templateId) =>
    action(actionTypes.TEMPLATE.STEPS_RECEIVED, {
      installSteps,
      connectionMap,
      templateId,
    }),
  failedPreview: templateId =>
    action(actionTypes.TEMPLATE.FAILURE, { templateId }),
  failedInstall: templateId =>
    action(actionTypes.TEMPLATE.INSTALL_FAILURE, { templateId }),
  createdComponents: (components, templateId) =>
    action(actionTypes.TEMPLATE.CREATED_COMPONENTS, { components, templateId }),
  receivedPreview: (components, templateId) =>
    action(actionTypes.TEMPLATE.RECEIVED_PREVIEW, { components, templateId }),
  updateStep: (step, templateId) =>
    action(actionTypes.TEMPLATE.UPDATE_STEP, { step, templateId }),
  createComponents: templateId =>
    action(actionTypes.TEMPLATE.CREATE_COMPONENTS, { templateId }),
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
  upload: (resourceType, resourceId, fileType, file) =>
    action(actionTypes.FILE.UPLOAD, {
      resourceType,
      resourceId,
      fileType,
      file,
    }),
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
const sampleData = {
  request: (resourceId, resourceType, values, stage, runOffline) =>
    action(actionTypes.SAMPLEDATA.REQUEST, {
      resourceId,
      resourceType,
      values,
      stage,
      runOffline,
    }),
  received: (resourceId, previewData) =>
    action(actionTypes.SAMPLEDATA.RECEIVED, { resourceId, previewData }),
  update: (resourceId, processedData, stage) =>
    action(actionTypes.SAMPLEDATA.UPDATE, { resourceId, processedData, stage }),
  receivedError: (resourceId, error, stage) =>
    action(actionTypes.SAMPLEDATA.RECEIVED_ERROR, { resourceId, error, stage }),
};
const importSampleData = {
  request: resourceId =>
    action(actionTypes.IMPORT_SAMPLEDATA.REQUEST, { resourceId }),
};
const flowData = {
  init: flow => action(actionTypes.FLOW_DATA.INIT, { flow }),
  requestPreviewData: (flowId, resourceId, previewType, isPageGenerator) =>
    action(actionTypes.FLOW_DATA.PREVIEW_DATA_REQUEST, {
      flowId,
      resourceId,
      previewType,
      isPageGenerator,
    }),
  receivedPreviewData: (
    flowId,
    resourceId,
    previewData,
    previewType,
    isPageGenerator
  ) =>
    action(actionTypes.FLOW_DATA.PREVIEW_DATA_RECEIVED, {
      flowId,
      resourceId,
      previewData,
      previewType,
      isPageGenerator,
    }),
  requestProcessorData: (
    flowId,
    resourceId,
    resourceType,
    processor,
    isPageGenerator
  ) =>
    action(actionTypes.FLOW_DATA.PROCESSOR_DATA_REQUEST, {
      flowId,
      resourceId,
      resourceType,
      processor,
      isPageGenerator,
    }),
  receivedProcessorData: (
    flowId,
    resourceId,
    processor,
    processedData,
    isPageGenerator
  ) =>
    action(actionTypes.FLOW_DATA.PROCESSOR_DATA_RECEIVED, {
      flowId,
      resourceId,
      processor,
      processedData,
      isPageGenerator,
    }),
  requestSampleData: (
    flowId,
    resourceId,
    resourceType,
    stage,
    isPageGenerator
  ) =>
    action(actionTypes.FLOW_DATA.SAMPLE_DATA_REQUEST, {
      flowId,
      resourceId,
      resourceType,
      stage,
      isPageGenerator,
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
};
const app = {
  reload: () => action(actionTypes.APP_RELOAD),
  errored: () => action(actionTypes.APP_ERRORED),
  clearError: () => action(actionTypes.APP_CLEAR_ERROR),
};
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
  submit: (resourceType, resourceId, values, match) =>
    action(actionTypes.RESOURCE_FORM.SUBMIT, {
      resourceType,
      resourceId,
      values,
      match,
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
  revoke: id => action(actionTypes.ACCESSTOKEN_REVOKE, { id }),
  activate: id => action(actionTypes.ACCESSTOKEN_ACTIVATE, { id }),
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
// #endregion

export default {
  app,
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
  file,
  assistantMetadata,
  stack,
  sampleData,
  importSampleData,
  flowData,
  connection,
  marketplace,
  recycleBin,
};

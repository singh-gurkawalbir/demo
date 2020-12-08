import actionTypes from './types';
import { suiteScriptResourceKey } from '../utils/suiteScript';

function action(type, payload = {}) {
  return { type, ...payload };
}

export default {
  iaForm: {
    initComplete: (ssLinkedConnectionId, integrationId) => action(actionTypes.SUITESCRIPT.IA_FORM.INIT_COMPLETE, {ssLinkedConnectionId, integrationId}),
    initClear: (ssLinkedConnectionId, integrationId) => action(actionTypes.SUITESCRIPT.IA_FORM.INIT_CLEAR, {ssLinkedConnectionId, integrationId}),
    submit: (ssLinkedConnectionId, integrationId, sectionId, values) => action(actionTypes.SUITESCRIPT.IA_FORM.SUBMIT, {ssLinkedConnectionId, integrationId, sectionId, values}),
    submitComplete: (ssLinkedConnectionId, integrationId) => action(actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_COMPLETE, {ssLinkedConnectionId, integrationId}),
    submitFailed: (ssLinkedConnectionId, integrationId) => action(actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_FAILED, {ssLinkedConnectionId, integrationId}),
  },
  featureCheck: {
    request: (ssLinkedConnectionId, integrationId, featureName) => action(actionTypes.SUITESCRIPT.FEATURE_CHECK.REQUEST, {ssLinkedConnectionId, integrationId, featureName}),
    successful: (ssLinkedConnectionId, integrationId, featureName) => action(actionTypes.SUITESCRIPT.FEATURE_CHECK.SUCCESSFUL, {ssLinkedConnectionId, integrationId, featureName}),
    failed: (ssLinkedConnectionId, integrationId, featureName, message) => action(actionTypes.SUITESCRIPT.FEATURE_CHECK.FAILED, {ssLinkedConnectionId, integrationId, featureName, message}),
    clear: (ssLinkedConnectionId, integrationId, featureName) => action(actionTypes.SUITESCRIPT.FEATURE_CHECK.CLEAR, {ssLinkedConnectionId, integrationId, featureName}),
  },
  resourceForm: {
    initFailed: (ssLinkedConnectionId, resourceType, resourceId) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT_FAILED, {
        ssLinkedConnectionId,
        resourceType,
        resourceId,
      }),
    init: (
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      isNew,
      skipCommit,
      flowId,
      initData,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT, {
        resourceType,
        resourceId,
        isNew,
        skipCommit,
        flowId,
        initData,
        ssLinkedConnectionId,
      }),
    initComplete: (
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      fieldMeta,
      isNew,
      skipCommit,
      flowId,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT_COMPLETE, {
        resourceId,
        resourceType,
        fieldMeta,
        isNew,
        skipCommit,
        flowId,
        ssLinkedConnectionId,
      }),
    clear: (ssLinkedConnectionId, resourceType, resourceId) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.CLEAR, {
        resourceType,
        resourceId,
        ssLinkedConnectionId,
      }),
    submit: (
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      resourceId,
      values,
      match,
      skipClose,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT, {
        resourceType,
        resourceId,
        values,
        match,
        skipClose,
        ssLinkedConnectionId,
        integrationId,
      }),
    submitComplete: (
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      resourceId,
      formValues,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_COMPLETE, {
        resourceType,
        resourceId,
        formValues,
        ssLinkedConnectionId,
        integrationId,
      }),
    submitFailed: (
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      resourceId,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_FAILED, {
        resourceType,
        resourceId,
        ssLinkedConnectionId,
        integrationId,
      }),
    submitAborted: (
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      resourceId,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_ABORTED, {
        resourceType,
        resourceId,
        ssLinkedConnectionId,
        integrationId,
      }),
  },
  resource: {
    connections: {
      test: (resourceId, values, ssLinkedConnectionId) =>
        action(actionTypes.SUITESCRIPT.CONNECTION.TEST, {
          resourceId,
          values,
          ssLinkedConnectionId,
        }),
      testErrored: (resourceId, message, ssLinkedConnectionId) =>
        action(actionTypes.SUITESCRIPT.CONNECTION.TEST_ERRORED, {
          resourceId,
          message,
          ssLinkedConnectionId,
        }),
      testCancelled: (resourceId, message, ssLinkedConnectionId) =>
        action(actionTypes.SUITESCRIPT.CONNECTION.TEST_CANCELLED, {
          resourceId,
          message,
          ssLinkedConnectionId,
        }),
      testSuccessful: (resourceId, ssLinkedConnectionId) =>
        action(actionTypes.SUITESCRIPT.CONNECTION.TEST_SUCCESSFUL, {
          resourceId,
          ssLinkedConnectionId,
        }),
      testClear: (resourceId, retainStatus, ssLinkedConnectionId) =>
        action(actionTypes.SUITESCRIPT.CONNECTION.TEST_CLEAR, {
          resourceId,
          retainStatus,
          ssLinkedConnectionId,
        }),
      linkIntegrator: (resourceId, link) =>
        action(actionTypes.SUITESCRIPT.CONNECTION.LINK_INTEGRATOR, {
          connectionId: resourceId,
          link,
        }),
    },
    patchStaged: (
      ssLinkedConnectionId,
      resourceType,
      id,
      patch,
      scope,
    ) =>
      action(actionTypes.RESOURCE.STAGE_PATCH, {
        patch,
        id: suiteScriptResourceKey({
          ssLinkedConnectionId,
          resourceType,
          resourceId: id,
        }),
        scope,
      }),
    commitStaged: (
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      id,
      scope,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE.STAGE_COMMIT, {
        resourceType,
        id,
        scope,
        ssLinkedConnectionId,
        integrationId,
      }),
    clearStaged: (
      ssLinkedConnectionId,
      resourceType,
      id,
      scope,
    ) =>
      action(actionTypes.RESOURCE.STAGE_CLEAR, {
        id: suiteScriptResourceKey({
          ssLinkedConnectionId,
          resourceType,
          resourceId: id,
        }),
        scope,
      }),

    request: (
      resourceType,
      ssLinkedConnectionId,
      integrationId,
    ) => action(actionTypes.SUITESCRIPT.RESOURCE.REQUEST, {
      resourceType,
      ssLinkedConnectionId,
      integrationId,
    }),
    received: (ssLinkedConnectionId, integrationId, resourceType, resource) =>
      action(actionTypes.SUITESCRIPT.RESOURCE.RECEIVED, {
        resourceType,
        resource,
        ssLinkedConnectionId,
        integrationId,
      }),
    updated: (
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      resourceId,
      master,
      patch,
    ) =>
      action(actionTypes.SUITESCRIPT.RESOURCE.UPDATED, {
        resourceType,
        resourceId,
        master,
        patch,
        ssLinkedConnectionId,
        integrationId,
      }),
    deleted: (resourceType, resourceId, ssLinkedConnectionId) =>
      action(actionTypes.SUITESCRIPT.RESOURCE.DELETED, {
        resourceType,
        resourceId,
        ssLinkedConnectionId,
      }),
  },
  importSampleData: {
    request: ({ssLinkedConnectionId, integrationId, flowId, options}) => action(actionTypes.SUITESCRIPT.IMPORT_SAMPLEDATA.REQUEST, {
      ssLinkedConnectionId, integrationId, flowId, options,
    }),
  },
  sampleData: {
    request: ({
      ssLinkedConnectionId,
      integrationId,
      flowId,
      options,
    }) =>
      action(actionTypes.SUITESCRIPT.SAMPLEDATA.REQUEST, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        options,
      }),
    received: ({
      ssLinkedConnectionId,
      integrationId,
      flowId,
      previewData,
    }) =>
      action(actionTypes.SUITESCRIPT.SAMPLEDATA.RECEIVED, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        previewData,
      }),
    receivedError: ({ ssLinkedConnectionId, integrationId, flowId, error }) =>
      action(actionTypes.SUITESCRIPT.SAMPLEDATA.RECEIVED_ERROR, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        error,
      }),
    reset: ({ssLinkedConnectionId, integrationId, flowId}) =>
      action(actionTypes.SUITESCRIPT.SAMPLEDATA.RESET, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
      }),
  },
  job: {
    clear: () => action(actionTypes.SUITESCRIPT.JOB.CLEAR),
    requestCollection: ({
      ssLinkedConnectionId,
      integrationId,
      flowId,
      filters,
    }) =>
      action(actionTypes.SUITESCRIPT.JOB.REQUEST_COLLECTION, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        filters,
      }),
    receivedCollection: ({ collection }) =>
      action(actionTypes.SUITESCRIPT.JOB.RECEIVED_COLLECTION, {
        collection,
      }),
    request: ({ jobId }) =>
      action(actionTypes.SUITESCRIPT.JOB.REQUEST, { jobId }),
    received: ({ job }) =>
      action(actionTypes.SUITESCRIPT.JOB.RECEIVED, { job }),
    requestInProgressJobStatus: ({ ssLinkedConnectionId, integrationId }) =>
      action(actionTypes.SUITESCRIPT.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS, {
        ssLinkedConnectionId,
        integrationId,
      }),
    noInProgressJobs: () =>
      action(actionTypes.SUITESCRIPT.JOB.NO_IN_PROGRESS_JOBS),
    requestErrors: ({ ssLinkedConnectionId, integrationId, jobType, jobId }) =>
      action(actionTypes.SUITESCRIPT.JOB.ERROR.REQUEST_COLLECTION, {
        ssLinkedConnectionId,
        integrationId,
        jobType,
        jobId,
      }),
    receivedErrors: ({ collection, jobId, jobType }) =>
      action(actionTypes.SUITESCRIPT.JOB.ERROR.RECEIVED_COLLECTION, {
        collection,
        jobId,
        jobType,
      }),
    resolveAllPending: () =>
      action(actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING),
    resolve: ({ jobId }) =>
      action(actionTypes.SUITESCRIPT.JOB.RESOLVE, { jobId }),
    resolveSelected: ({ ssLinkedConnectionId, integrationId, flowId, jobs }) =>
      action(actionTypes.SUITESCRIPT.JOB.RESOLVE_SELECTED, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobs,
      }),
    resolveAll: ({ flowId, integrationId, ssLinkedConnectionId }) =>
      action(actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL, {
        flowId,
        integrationId,
        ssLinkedConnectionId,
      }),
    resolveInit: job => action(actionTypes.SUITESCRIPT.JOB.RESOLVE_INIT, job),
    resolveAllInit: () => action(actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_INIT),
    resolveUndo: job => action(actionTypes.SUITESCRIPT.JOB.RESOLVE_UNDO, job),
    resolveAllUndo: ({ flowId, integrationId, ssLinkedConnectionId }) =>
      action(actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_UNDO, {
        flowId,
        integrationId,
        ssLinkedConnectionId,
      }),
    resolveCommit: () => action(actionTypes.SUITESCRIPT.JOB.RESOLVE_COMMIT),
    resolveAllCommit: () =>
      action(actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_COMMIT),
    resolveSelectedErrorsInit: ({ selectedErrorIds }) =>
      action(actionTypes.SUITESCRIPT.JOB.ERROR.RESOLVE_SELECTED_INIT, {
        selectedErrorIds,
      }),
    resolveSelectedErrors: ({
      ssLinkedConnectionId,
      integrationId,
      jobId,
      jobType,
      selectedErrorIds,
    }) =>
      action(actionTypes.SUITESCRIPT.JOB.ERROR.RESOLVE_SELECTED, {
        ssLinkedConnectionId,
        integrationId,
        jobId,
        jobType,
        selectedErrorIds,
      }),
    error: {
      clear: () => action(actionTypes.SUITESCRIPT.JOB.ERROR.CLEAR),
    },
  },
  paging: {
    job: {
      setRowsPerPage: rowsPerPage =>
        action(actionTypes.SUITESCRIPT.PAGING.JOB.SET_ROWS_PER_PAGE, {
          rowsPerPage,
        }),
      setCurrentPage: currentPage =>
        action(actionTypes.SUITESCRIPT.PAGING.JOB.SET_CURRENT_PAGE, {
          currentPage,
        }),
    },
  },
  flow: {
    run: ({ ssLinkedConnectionId, integrationId, flowId, _id }) =>
      action(actionTypes.SUITESCRIPT.FLOW.RUN, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        _id,
      }),
    enable: ({ ssLinkedConnectionId, integrationId, _id }) =>
      action(actionTypes.SUITESCRIPT.FLOW.ENABLE, {
        ssLinkedConnectionId,
        integrationId,
        _id,
      }),
    disable: ({ ssLinkedConnectionId, integrationId, _id }) =>
      action(actionTypes.SUITESCRIPT.FLOW.DISABLE, {
        ssLinkedConnectionId,
        integrationId,
        _id,
      }),
    isOnOffActionInprogress: ({ onOffInProgress, ssLinkedConnectionId, _id }) =>
      action(actionTypes.SUITESCRIPT.FLOW.RECEIVED_ON_OFF_ACTION_STATUS, {
        onOffInProgress,
        ssLinkedConnectionId,
        _id,
      }),
    delete: ({ ssLinkedConnectionId, integrationId, _id }) =>
      action(actionTypes.SUITESCRIPT.FLOW.DELETE, {
        ssLinkedConnectionId,
        integrationId,
        _id,
      }),
  },
  account: {
    checkHasIntegrations: connectionId =>
      action(actionTypes.SUITESCRIPT.ACCOUNT.CHECK_HAS_INTEGRATIONS, {
        connectionId,
      }),
    receivedHasIntegrations: (account, hasIntegrations) =>
      action(actionTypes.SUITESCRIPT.ACCOUNT.RECEIVED_HAS_INTEGRATIONS, {
        account,
        hasIntegrations,
      }),
  },
  installer: {
    initSteps: connectorId =>
      action(actionTypes.SUITESCRIPT.INSTALLER.INIT_STEPS, {
        id: connectorId,
      }),
    updateStep: (connectorId, status) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.UPDATE.STEP, {
        id: connectorId,
        status,
      }),
    updateSSLinkedConnectionId: (connectorId, connectionId) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.UPDATE.LINKED_CONNECTION, {
        id: connectorId,
        ssLinkedConnectionId: connectionId,
      }),
    updateSSIntegrationId: (connectorId, ssIntegrationId) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.UPDATE.SS_INTEGRATION_ID, {
        id: connectorId,
        ssIntegrationId,
      }),
    updateSSConnection: (connectorId, connectionId, doc) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.UPDATE.SS_CONNECTION, {
        id: connectorId,
        connectionId,
        doc,
      }),
    updatePackage: (connectorId, packageType, packageUrl) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.UPDATE.PACKAGE, {
        id: connectorId,
        packageType,
        packageUrl,
      }),
    requestPackages: (connectorId, ssLinkedConnectionId) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.REQUEST_PACKAGES, {
        connectorId,
        ssLinkedConnectionId,
      }),
    verifyNSBundle: (connectorId, ssLinkedConnectionId, shouldContinue, ssName) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.INTEGRATOR_BUNDLE, {
        connectorId,
        ssLinkedConnectionId,
        shouldContinue,
        ssName,
      }),
    verifySFBundle: (connectorId, ssLinkedConnectionId, ssName) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.CONNECTOR_BUNDLE, {
        connectorId,
        ssLinkedConnectionId,
        ssName,
      }),
    verifySSConnection: (connectorId, ssLinkedConnectionId, connectionType) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.SS_CONNECTION, {
        connectorId,
        ssLinkedConnectionId,
        connectionType,
      }),
    verifyPackage: (connectorId, ssLinkedConnectionId, installerFunction) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.VERIFY.PACKAGE, {
        connectorId,
        ssLinkedConnectionId,
        installerFunction,
      }),
    failed: (connectorId, error) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.FAILED, {
        id: connectorId,
        error,
      }),
    clearSteps: connectorId =>
      action(actionTypes.SUITESCRIPT.INSTALLER.CLEAR_STEPS, {
        id: connectorId,
      }),
    completeSetup: (connectorId, ssLinkedConnectionId) =>
      action(actionTypes.SUITESCRIPT.INSTALLER.POST_INSTALL, {
        connectorId,
        ssLinkedConnectionId,
      }),
    done: connectorId =>
      action(actionTypes.SUITESCRIPT.INSTALLER.DONE, {
        id: connectorId,
      }),
  },
  mapping: {
    init: ({ ssLinkedConnectionId, integrationId, flowId, subRecordMappingId }) =>
      action(actionTypes.SUITESCRIPT.MAPPING.INIT, {
        ssLinkedConnectionId, integrationId, flowId, subRecordMappingId,
      }),
    initComplete: ({ ssLinkedConnectionId, integrationId, flowId, generatedMappings, subRecordFields, lookups, options }) =>
      action(actionTypes.SUITESCRIPT.MAPPING.INIT_COMPLETE, {
        ssLinkedConnectionId, integrationId, flowId, generatedMappings, subRecordFields, lookups, options,
      }),
    patchField: ({ field, key, value }) =>
      action(actionTypes.SUITESCRIPT.MAPPING.PATCH_FIELD, { field, key, value }),
    patchGenerateThroughAssistant: value =>
      action(actionTypes.SUITESCRIPT.MAPPING.PATCH_GENERATE_THROUGH_ASSISTANT, { value }),
    delete: key =>
      action(actionTypes.SUITESCRIPT.MAPPING.DELETE, {
        key,
      }),
    patchSettings: (key, settings) =>
      action(actionTypes.SUITESCRIPT.MAPPING.PATCH_SETTINGS, {
        key, settings,
      }),

    updateLookups: lookups =>
      action(actionTypes.SUITESCRIPT.MAPPING.UPDATE_LOOKUPS, {
        lookups,
      }),
    changeOrder: mappings =>
      action(actionTypes.SUITESCRIPT.MAPPING.CHANGE_ORDER, {
        mappings,
      }),
    save: () =>
      action(actionTypes.SUITESCRIPT.MAPPING.SAVE, {}),
    saveFailed: () =>
      action(actionTypes.SUITESCRIPT.MAPPING.SAVE_FAILED, { }),
    saveComplete: () =>
      action(actionTypes.SUITESCRIPT.MAPPING.SAVE_COMPLETE, {}),
    refreshGenerates: () =>
      action(actionTypes.SUITESCRIPT.MAPPING.REFRESH_GENEREATES, {}),
    patchIncompleteGenerates: (
      {key, value},
    ) => action(actionTypes.SUITESCRIPT.MAPPING.PATCH_INCOMPLETE_GENERATES, { key, value }),
    updateMappings: mappings => action(actionTypes.SUITESCRIPT.MAPPING.UPDATE_MAPPINGS, {
      mappings,
    }),
    updateLastFieldTouched: key => action(actionTypes.SUITESCRIPT.MAPPING.UPDATE_LAST_TOUCHED_FIELD, { key }),
    clear: () => action(actionTypes.SUITESCRIPT.MAPPING.CLEAR, {}),
    checkForSFSublistExtractPatch: (key, value) => action(actionTypes.SUITESCRIPT.MAPPING.CHECK_FOR_SF_SUBLIST_EXTRACT_PATCH, {key, value}),
    setSFSubListFieldName: value => action(actionTypes.SUITESCRIPT.MAPPING.SET_SF_SUBLIST_FIELD_NAME, {value}),
    patchExtractList: value => action(actionTypes.SUITESCRIPT.MAPPING.PATCH_EXTRACT_LIST, {value}),
  },
};

/* eslint-disable no-param-reassign */
import deepClone from 'lodash/cloneDeep';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import { some, map, isEmpty } from 'lodash';
import app, { selectors as fromApp } from './app';
import data, { selectors as fromData } from './data';
import { selectors as fromResources } from './data/resources';
import { selectors as fromMarketPlace } from './data/marketPlace';
import session, { selectors as fromSession } from './session';
import comms, { selectors as fromComms } from './comms';
import { COMM_STATES, selectors as fromNetworkComms } from './comms/networkComms';
import auth, { selectors as fromAuth } from './authentication';
import user, { selectors as fromUser } from './user';
import actionTypes from '../actions/types';
import {
  isSimpleImportFlow,
  showScheduleIcon,
  isRealtimeFlow,
  getExportIdsFromFlow,
  getImportIdsFromFlow,
  getUsedActionsMapForResource,
  isPageGeneratorResource,
  getImportsFromFlow,
  getPageProcessorImportsFromFlow,
  getFlowListWithMetadata,
  getNextDataFlows,
  getIAFlowSettings,
  getFlowDetails,
  getFlowResources,
  isImportMappingAvailable,
  getFlowReferencesForResource,
  isFreeFlowResource,
  isIntegrationApp,
} from '../utils/flows';
import {
  PASSWORD_MASK,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  TILE_STATUS,
  INTEGRATION_MODES,
  STANDALONE_INTEGRATION,
  ACCOUNT_IDS,
  SUITESCRIPT_CONNECTORS,
  JOB_STATUS,
} from '../utils/constants';
import { LICENSE_EXPIRED } from '../utils/messageStore';
import { changePasswordParams, changeEmailParams } from '../sagas/api/apiPaths';
import {
  getFieldById,
} from '../forms/utils';
import { upgradeButtonText, expiresInfo } from '../utils/license';
import commKeyGen from '../utils/commKeyGenerator';
import {
  isNewId,
  MODEL_PLURAL_TO_LABEL,
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
  adaptorTypeMap,
  isQueryBuilderSupported,
} from '../utils/resource';
import { processSampleData } from '../utils/sampleData';
import {
  getAvailablePreviewStages,
  isPreviewPanelAvailable,
} from '../utils/exportPanel';
import inferErrorMessage from '../utils/inferErrorMessage';
import getRoutePath from '../utils/routePaths';
import { getIntegrationAppUrlName, getTitleIdFromSection } from '../utils/integrationApps';
import mappingUtil from '../utils/mapping';
import { suiteScriptResourceKey, isJavaFlow } from '../utils/suiteScript';
import { stringCompare } from '../utils/sort';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../constants/resource';
import { getFormattedGenerateData } from '../utils/suiteScript/mapping';
import {getSuiteScriptNetsuiteRealTimeSampleData} from '../utils/suiteScript/sampleData';
import { genSelectors } from './util';
import getJSONPaths from '../utils/jsonPaths';
import sqlUtil from '../utils/sql';
import getFilteredErrors from '../utils/errorManagement';
import {
  getFlowResourcesYetToBeCreated,
  generateFlowSteps,
  getRunConsoleJobSteps,
  getParentJobSteps,
} from '../utils/latestJobs';

const emptySet = [];
const emptyObject = {};
const combinedReducers = combineReducers({
  app,
  session,
  data,
  user,
  auth,
  comms,
});
const rootReducer = (state, action) => {
  const newState = combinedReducers(state, action);

  if (action.type === actionTypes.CLEAR_STORE) {
    const { app, auth } = newState;

    return { app, auth };
  }

  return newState;
};

export default rootReducer;

// auto generated selectors
export const selectors = {};
const subSelectors = {
  app: fromApp,
  session: fromSession,
  data: fromData,
  comms: fromComms,
  auth: fromAuth,
  user: fromUser,
};

genSelectors(selectors, subSelectors);

// additional user defined selectors
selectors.userState = state => state && state.user;

// #region PUBLIC COMMS SELECTORS
// Use shallowEquality operator to prevent re-renders.
// or convert this to re-select since it has no args, it s perfect
// case for re-select.
selectors.commsErrors = state => {
  const commsState = state?.comms?.networkComms;

  if (!commsState) return;
  const errors = {};

  Object.keys(commsState).forEach(key => {
    const c = commsState[key];

    if (!c.hidden && c.status === COMM_STATES.ERROR) {
      errors[key] = inferErrorMessage(c.message);
    }
  });

  return errors;
};

selectors.commsSummary = state => {
  let isLoading = false;
  let isRetrying = false;
  let hasError = false;
  const commsState = state?.comms?.networkComms;

  if (commsState) {
    Object.keys(commsState).forEach(key => {
      const c = commsState[key];

      if (!c.hidden) {
        if (c.status === COMM_STATES.ERROR) {
          hasError = true;
        } else if (c.retryCount > 0) {
          isRetrying = true;
        } else if (c.status === COMM_STATES.LOADING && Date.now() - c.timestamp > Number(process.env.NETWORK_THRESHOLD)) {
          isLoading = true;
        }
      }
    });
  }

  return { isLoading, isRetrying, hasError };
};

selectors.commStatusPerPath = (state, path, method) => {
  const key = commKeyGen(path, method);

  return fromComms.commStatus(state && state.comms, key);
};
// #endregion

// #region PUBLIC SESSION SELECTORS
selectors.clonePreview = (state, resourceType, resourceId) => fromSession.previewTemplate(
  state && state.session,
  `${resourceType}-${resourceId}`
);

selectors.cloneData = (state, resourceType, resourceId) => fromSession.template(
  state && state.session,
  `${resourceType}-${resourceId}`
);

selectors.isSetupComplete = (
  state,
  { templateId, resourceType, resourceId }
) => {
  let isSetupComplete = false;
  const installSteps =
    fromSession.templateInstallSteps(
      state && state.session,
      templateId || `${resourceType}-${resourceId}`
    ) || [];

  isSetupComplete =
    installSteps.length &&
    !installSteps.reduce((result, step) => result || !step.completed, false);

  return isSetupComplete;
};

selectors.isUninstallComplete = (state, { integrationId, storeId }) => {
  let isSetupComplete = false;
  const uninstallSteps =
    fromSession.uninstallSteps(
      state && state.session,
      integrationId,
      storeId
    ) || [];

  isSetupComplete =
    uninstallSteps.length &&
    !uninstallSteps.reduce((result, step) => result || !step.completed, false);

  return isSetupComplete;
};

selectors.redirectToOnInstallationComplete = (
  state,
  { resourceType = 'integrations', resourceId, templateId }
) => {
  let environment;
  let redirectTo = 'dashboard';
  let flow;
  let flowDetails;
  let integration;
  const { createdComponents: components } = fromSession.template(
    state && state.session,
    templateId || `${resourceType}-${resourceId}`
  );

  const { isInstallFailed } = fromSession.template(
    state && state.session,
    templateId || `${resourceType}-${resourceId}`
  );

  if (isInstallFailed) {
    return {redirectTo: null, isInstallFailed: true};
  }

  if (!components) {
    return {redirectTo: null};
  }

  switch (resourceType) {
    case 'integrations':
      integration = components.find(c => c.model === 'Integration');

      if (integration) redirectTo = `/integrations/${integration._id}/flows`;
      break;
    case 'flows':
      flow = components.find(c => c.model === 'Flow');

      if (flow) {
        // eslint-disable-next-line no-use-before-define
        flowDetails = selectors.resource(state, 'flows', flow._id);

        if (flowDetails) {
          if (!flowDetails._integrationId) {
            environment = flowDetails.sandbox ? 'sandbox' : 'production';
          }
          redirectTo = `integrations/${flowDetails._integrationId ||
            'none'}/flows`;
        }
      }

      break;
    case 'exports':
    case 'imports':
      redirectTo = resourceType;
      break;
    default:
      break;
  }

  return { redirectTo: getRoutePath(redirectTo), environment };
};

selectors.installSetup = (state, { resourceType, resourceId, templateId }) => fromSession.template(
  state && state.session,
  templateId || `${resourceType}-${resourceId}`
);

selectors.templateSetup = (state, templateId) => fromSession.template(state && state.session, templateId);

selectors.templateInstallSteps = (state, templateId) => {
  const templateInstallSteps = fromSession.templateInstallSteps(
    state && state.session,
    templateId
  );

  return produce(templateInstallSteps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });
};

selectors.cloneInstallSteps = (state, resourceType, resourceId) => selectors.templateInstallSteps(state, `${resourceType}-${resourceId}`);

selectors.connectorFieldOptions = (
  state,
  fieldName,
  id,
  _integrationId,
  defaultFieldOptions
) => {
  const { data, isLoading } = selectors.connectorMetadata(
    state,
    fieldName,
    id,
    _integrationId
  );

  // should select options from either defaultOptions or the refreshed metadata options
  return {
    isLoading,
    value: data && data.value,
    options:
      (data &&
        data.options &&
        data.options.map(option => ({
          value: option[0],
          label: option[1],
        }))) ||
      (defaultFieldOptions && defaultFieldOptions[0].items),
  };
};

selectors.editorHelperFunctions = state => state?.session?.editors?.helperFunctions || [];

selectors.userProfile = createSelector(
  state => state?.user?.profile,
  profile => profile
);

selectors.developerMode = state => (
  state && state.user && state.user.profile && state.user.profile.developer
);

selectors.currentEnvironment = state => selectors.userPreferences(state).environment;

selectors.userOwnPreferences = createSelector(
  state => state.user,
  user => fromUser.userOwnPreferences(user)
);

// TODO: make this selector a lot more granular...its dependency is user
selectors.userProfilePreferencesProps = createSelector(
  selectors.userProfile,
  selectors.userPreferences,
  (profile, preferences) => {
    const {
      _id,
      name,
      email,
      company,
      role,
      developer,
      phone,
      dateFormat,
      timezone,
      timeFormat,
      scheduleShiftForFlowsCreatedAfter,
      // eslint-disable-next-line camelcase
      auth_type_google,
    } = { ...profile, ...preferences };

    return {
      _id,
      name,
      email,
      company,
      role,
      developer,
      phone,
      dateFormat,
      timezone,
      timeFormat,
      scheduleShiftForFlowsCreatedAfter,
      auth_type_google,
    };
  });

selectors.userProfileEmail = state => state?.user?.profile?.email;

selectors.userProfileLinkedWithGoogle = state => !!(
  state &&
    state.user &&
    state.user.profile &&
    state.user.profile.auth_type_google &&
    state.user.profile.auth_type_google.id
);
// #endregiod

// #region AUTHENTICATION SELECTORS
selectors.isAuthenticated = state => !!(state && state.auth && state.auth.authenticated);

selectors.isDefaultAccountSet = state => !!(state && state.auth && state.auth.defaultAccountSet);

selectors.isAuthInitialized = state => !!(state && state.auth && state.auth.initialized);
selectors.isUserLoggedInDifferentTab = state => !!(state && state.auth && state.auth.userLoggedInDifferentTab);

selectors.authenticationErrored = state => state && state.auth && state.auth.failure;

selectors.isUserLoggedOut = state => !!(state && state.auth && state.auth.loggedOut);

selectors.isDefaultAccountSetAfterAuth = state => {
  if (!selectors.isAuthLoading(state)) {
    const authenticated = selectors.isAuthenticated(state);

    if (authenticated) {
      return selectors.isDefaultAccountSet(state);
    }

    return true;
  }

  return false;
};

// This selector is used by the UI to determine
// when to show appRouting component
// For now only when the default account is set or user is logged out
// show the appRouting component
selectors.shouldShowAppRouting = state => selectors.isDefaultAccountSetAfterAuth(state) || selectors.isUserLoggedOut(state);

selectors.isSessionExpired = state => !!(state && state.auth && state.auth.sessionExpired);

selectors.sessionValidTimestamp = state => state && state.auth && state.auth.authTimestamp;
// #endregion AUTHENTICATION SELECTORS

// #region PASSWORD & EMAIL update selectors for modals
selectors.changePasswordSuccess = state => {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.SUCCESS;
};

selectors.changePasswordFailure = state => {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.ERROR;
};

selectors.changePasswordMsg = state => {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const message = fromComms.requestMessage(state && state.comms, commKey);

  return message || '';
};

selectors.changeEmailFailure = state => {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.ERROR;
};

selectors.changeEmailSuccess = state => {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.SUCCESS;
};

selectors.changeEmailMsg = state => {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const message = fromComms.requestMessage(state && state.comms, commKey);

  return message || '';
};

// #endregion PASSWORD & EMAIL update selectors for modals

// #region USER SELECTORS
selectors.testConnectionCommState = (state, resourceId) => {
  const status = fromComms.testConnectionStatus(
    state && state.comms,
    resourceId
  );
  const message = fromComms.testConnectionMessage(
    state && state.comms,
    resourceId
  );

  return {
    commState: status,
    message,
  };
};

selectors.hasPreferences = state => !!selectors.userPreferences(state);

selectors.hasProfile = state => !!selectors.userProfile(state);
// #endregion

// #region PUBLIC DATA SELECTORS
selectors.resourceList = (state, options = {}) => {
  if (
    !options.ignoreEnvironmentFilter &&
    ![
      'accesstokens',
      'agents',
      'iClients',
      'scripts',
      'stacks',
      'templates',
      'published',
      'transfers',
      'apis',
    ].includes(
      /* These resources are common for both production & sandbox environments. */
      options.type
    )
  ) {
    const preferences = selectors.userPreferences(state);

    // eslint-disable-next-line no-param-reassign
    options.sandbox = preferences.environment === 'sandbox';
  }

  return fromData.resourceList(state && state.data, options);
};

selectors.resourceListModified = (userState, resourcesState, options = {}) => {
  if (
    !options.ignoreEnvironmentFilter &&
    ![
      'accesstokens',
      'agents',
      'iclients',
      'scripts',
      'stacks',
      'templates',
      'published',
      'transfers',
      'apis',
    ].includes(
      /* These resources are common for both production & sandbox environments. */
      options.type
    )
  ) {
    const preferences = fromUser.userPreferences(userState);

    // eslint-disable-next-line no-param-reassign
    options.sandbox = preferences.environment === 'sandbox';
  }

  return fromResources.resourceList(resourcesState, options);
};

selectors.makeResourceListSelector = () =>
  createSelector(
    selectors.userState,
    selectors.resourceState,
    (_, options) => options,
    (userState, resourcesState, options) =>
      selectors.resourceListModified(userState, resourcesState, options)
  );

selectors.iaFlowSettings = (state, integrationId, flowId) => {
  const integration = selectors.resource(state, 'integrations', integrationId);

  return getIAFlowSettings(integration, flowId);
};

// TODO: The object returned from this selector needs to be overhauled.
// It is shared between IA and DIY flows,
// yet its impossible to know which works for each flow type. For example,
// showMapping is an IA only field, how do we determine if a DIY flow has mapping support?
// Maybe its best to only hav common props here and remove all IA props to a separate selector.
selectors.flowDetails = (state, id) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow) return emptyObject;
  const integration = selectors.resource(state, 'integrations', flow._integrationId);
  const exports = selectors.resourceList(state, {
    type: 'exports',
  }).resources;

  return getFlowDetails(flow, integration, exports);
};

selectors.mkFlowDetails = () => {
  const resource = fromData.makeResourceSelector();
  const integrationResource = fromData.makeResourceSelector();

  return createSelector(
    (state, id) => resource(state?.data?.resources, 'flows', id),
    (state, id) => {
      const flow = resource(state?.data?.resources, 'flows', id);

      if (!flow || !flow._integrationId) return null;

      return integrationResource(state?.data?.resources, 'integrations', flow._integrationId);
    },
    state => state?.data?.resources?.exports,
    (flow, integration, exports) => {
      if (!flow) return emptyObject;

      return getFlowDetails(flow, integration, exports);
    });
};

/* ***********************************************************************
  This is the beginning of refactoring the above selector. There is just WAY to
  much data returned above and in most cased a component only needs a small slice
  of the above. */
selectors.isDataLoader = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (!flow) return false;

  // TODO: review with team... is this an ok pattern to access
  // state directly? seems ok.
  const exports = state && state.data && state.data.resources.exports;

  if (!exports) return false;

  return isSimpleImportFlow(flow, exports);
};

selectors.flowType = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (!flow) return '';

  const exports = state && state.data && state.data.resources.exports;

  if (!exports) return '';

  if (isSimpleImportFlow(flow, exports)) {
    return 'Data Loader';
  }

  if (isRealtimeFlow(flow, exports)) {
    return 'Realtime';
  }

  // TODO: further refine this logic to differentiate between 'Scheduled'
  // and 'mixed'. Note that mixed is the case where some exports are scheduled
  // and others are not.
  return 'Scheduled';
};

selectors.isFlowEnableLocked = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (!flow || !flow._connectorId) return false;

  const integration = selectors.resource(state, 'integrations', flow._integrationId);

  if (!integration) return false;

  const flowSettings = getIAFlowSettings(integration, flow._id);

  // strange flow setting name to indicate that flows can not be
  // enabled/disabled by a user...
  return flowSettings.disableSlider;
};

// // Possible refactor! If we need both canSchedule (flow has ability to schedule),
// // and if the IA allows for schedule overrides, then we can return a touple...
// // for the current purpose, we just need to know if a flow allows or doesn't allow
// // schedule editing.
selectors.mkFlowAllowsScheduling = () => {
  const resource = selectors.makeResourceSelector();
  const integrationResource = selectors.makeResourceSelector();

  return createSelector(
    (state, id) => resource(state?.data?.resources, 'flows', id),
    (state, id) => {
      const flow = resource(state?.data?.resources, 'flows', id);

      if (!flow || !flow._integrationId) return null;

      return integrationResource(state?.data?.resources, 'integrations', flow._integrationId);
    },
    state => state?.data?.resources?.exports,
    (state, id) => {
      const flow = resource(state?.data?.resources, 'flows', id);

      if (!flow || !flow._integrationId) return false;

      return selectors.isIntegrationAppVersion2(state, flow._integrationId, true);
    },
    (flow, integration, allExports, isAppVersion2) => {
      if (!flow) return false;
      const isApp = flow._connectorId;
      const canSchedule = showScheduleIcon(flow, allExports);

      // For IA2.0, 'showSchedule' is assumed true for now until we have more clarity
      if (!isApp || isAppVersion2) return canSchedule;
      const flowSettings = getIAFlowSettings(integration, flow._id);

      return canSchedule && !!flowSettings.showSchedule;
    }
  );
};

selectors.flowUsesUtilityMapping = (state, id) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow) return false;
  const integration = selectors.resource(state, 'integrations', flow._integrationId);
  const isApp = flow._connectorId;

  if (!isApp) return false;

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!flowSettings.showUtilityMapping;
};

selectors.flowSupportsMapping = (state, id) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow) return false;

  const isApp = flow._connectorId;
  const isAppVersion2 = selectors.isIntegrationAppVersion2(state, flow._integrationId, true);

  // For IA2.0, 'showMapping' is assumed true for now until we have more clarity
  if (!isApp || isAppVersion2) return true;

  const integration = selectors.resource(state, 'integrations', flow._integrationId);

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!flowSettings.showMapping;
};

selectors.flowSupportsSettings = (state, id) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow) return false;

  const isApp = flow._connectorId;

  if (!isApp) return false;

  const integration = selectors.resource(state, 'integrations', flow._integrationId);

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!(
    (flowSettings.settings && flowSettings.settings.length) ||
    (flowSettings.sections && flowSettings.sections.length)
  );
};

/* End of refactoring of flowDetails selector.. Once all use is refactored of
   the flowDetails, we should delete that selector.
*********************************************************************** */

selectors.flowListWithMetadata = (state, options) => {
  const flows = selectors.resourceList(state, options).resources || emptySet;
  const exports = selectors.resourceList(state, {
    type: 'exports',
  }).resources;

  return getFlowListWithMetadata(flows, exports);
};

/*
 * Gives all other valid flows of same Integration
 */
selectors.mkNextDataFlowsForFlow = () => createSelector(
  state => state?.data?.resources?.flows,
  (_, flow) => flow,
  (flows, flow) => getNextDataFlows(flows, flow)
);

selectors.isIAConnectionSetupPending = (state, connectionId) => {
  const connection = selectors.resource(state, 'connections', connectionId) || {};

  if (!connection || !connection._connectorId) {
    return;
  }

  const { _integrationId } = connection;
  const integration = selectors.resource(state, 'integrations', _integrationId);

  const addNewStoreSteps = fromSession.addNewStoreSteps(
    state?.session,
    _integrationId
  );
  const { steps } = addNewStoreSteps;

  if (steps && Array.isArray(steps)) {
    const installStep = steps.find(s => s._connectionId === connectionId);

    if (!installStep?.completed) {
      return true;
    }
  }

  if (integration?.mode === 'settings') {
    return false;
  }

  if (integration?.install) {
    const installStep = integration.install.find(
      step => step._connectionId === connectionId
    );

    if (!installStep?.completed) {
      return true;
    }
  }

  return false;
};

selectors.isConnectionOffline = (state, id) => {
  const connection = selectors.resource(state, 'connections', id);

  return connection && connection.offline;
};

// TODO: could this be converted to re-select?
selectors.resourcesByIds = (state, resourceType, resourceIds) => {
  const { resources } = selectors.resourceList(state, {
    type: resourceType,
  });

  return resources.filter(r => resourceIds.indexOf(r._id) >= 0);
};

selectors.userAccessLevelOnConnection = (state, connectionId) => {
  const permissions = selectors.userPermissions(state);
  let accessLevelOnConnection;

  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
      USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
    ].includes(permissions.accessLevel)
  ) {
    accessLevelOnConnection = permissions.accessLevel;
  } else if (USER_ACCESS_LEVELS.TILE === permissions.accessLevel) {
    const ioIntegrations = selectors.resourceList(state, {
      type: 'integrations',
    }).resources;
    const ioIntegrationsWithConnectionRegistered = ioIntegrations.filter(
      i =>
        i?._registeredConnectionIds &&
        i._registeredConnectionIds.includes(connectionId)
    );

    ioIntegrationsWithConnectionRegistered.forEach(i => {
      if ((permissions.integrations[i._id] || {}).accessLevel) {
        if (!accessLevelOnConnection) {
          accessLevelOnConnection = (permissions.integrations[i._id] || {})
            .accessLevel;
        } else if (
          accessLevelOnConnection === INTEGRATION_ACCESS_LEVELS.MONITOR
        ) {
          accessLevelOnConnection = (permissions.integrations[i._id] || {})
            .accessLevel;
        }
      }
    });
  }

  return accessLevelOnConnection;
};
selectors.matchingConnectionList = (state, connection = {}, environment, manageOnly) => {
  if (!environment) {
    // eslint-disable-next-line no-param-reassign
    environment = selectors.currentEnvironment(state);
  }

  const { resources = [] } = selectors.resourceList(state, {
    type: 'connections',
    ignoreEnvironmentFilter: true,
    filter: {
      $where() {
        if (connection.assistant) {
          return (
            this.assistant === connection.assistant &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
          );
        }

        if (['netsuite'].indexOf(connection.type) > -1) {
          const accessLevel = manageOnly ? selectors.userAccessLevelOnConnection(state, this._id) : 'owner';

          return (
            this.type === 'netsuite' &&
            !this._connectorId &&
            (this.netsuite.account && this.netsuite.environment) &&
            (!environment || !!this.sandbox === (environment === 'sandbox')) &&
            (accessLevel === 'owner' || accessLevel === 'manage')
          );
        }

        return (
          this.type === connection.type &&
          !this._connectorId &&
          (!environment || !!this.sandbox === (environment === 'sandbox'))
        );
      },
    },
  });

  return resources;
};

selectors.matchingStackList = state => {
  const { resources = [] } = selectors.resourceList(state, {
    type: 'stacks',
    filter: {
      _connectorId: { $exists: false },
    },
  });

  return resources;
};

selectors.filteredResourceList = (
  state,
  resource,
  resourceType,
  environment,
  manageOnly
) => resourceType === 'connections'
  ? selectors.matchingConnectionList(state, resource, environment, manageOnly)
  : selectors.matchingStackList(state);

selectors.marketplaceConnectors = (
  userState,
  marketPlaceState,
  resourceState,
  application,
  sandbox
) => {
  const licenses = fromUser.licenses(userState);
  const connectors = fromMarketPlace.connectors(
    marketPlaceState,
    application,
    sandbox,
    licenses
  );

  return connectors
    .map(c => {
      const installedIntegrationApps = selectors.resourceListModified(
        userState,
        resourceState,
        {
          type: 'integrations',
          sandbox,
          filter: { _connectorId: c._id },
        }
      );

      return { ...c, installed: !!installedIntegrationApps.resources.length };
    })
    .sort(stringCompare('name'));
};

selectors.integrationAppSettings = selectors.mkIntegrationAppSettings();

selectors.makeMarketPlaceConnectorsSelector = () =>
  createSelector(
    selectors.userState,
    selectors.marketPlaceState,
    selectors.resourceState,
    (_, application) => application,
    (_1, _2, sandbox) => sandbox,
    (userState, marketPlaceState, resourceState, application, sandbox) =>
      selectors.marketplaceConnectors(
        userState,
        marketPlaceState,
        resourceState,
        application,
        sandbox
      )
  );

selectors.getAllConnectionIdsUsedInTheFlow = (state, flow, options = {}) => {
  const exportIds = getExportIdsFromFlow(flow);
  const importIds = getImportIdsFromFlow(flow);
  const connectionIds = [];
  const connections = selectors.resourceList(state, { type: 'connections' }).resources;
  const exports = selectors.resourceList(state, { type: 'exports' }).resources;
  const imports = selectors.resourceList(state, { type: 'imports' }).resources;

  if (!flow) {
    return emptySet;
  }

  const attachedExports =
    exports && exports.filter(e => exportIds.indexOf(e._id) > -1);
  const attachedImports =
    imports && imports.filter(i => importIds.indexOf(i._id) > -1);

  attachedExports.forEach(exp => {
    if (
      exp &&
      exp._connectionId &&
      !connectionIds.includes(exp._connectionId)
    ) {
      connectionIds.push(exp._connectionId);
    }
  });
  attachedImports.forEach(imp => {
    if (
      imp &&
      imp._connectionId &&
      !connectionIds.includes(imp._connectionId)
    ) {
      connectionIds.push(imp._connectionId);
    }
  });

  const attachedConnections =
    connections &&
    connections.filter(conn => connectionIds.indexOf(conn._id) > -1);

  if (!options.ignoreBorrowedConnections) {
    attachedConnections.forEach(conn => {
      if (
        conn &&
        conn._borrowConcurrencyFromConnectionId &&
        !connectionIds.includes(conn._borrowConcurrencyFromConnectionId)
      ) {
        connectionIds.push(conn._borrowConcurrencyFromConnectionId);
      }
    });
  }

  return connectionIds;
};

selectors.getFlowsAssociatedExportFromIAMetadata = (state, fieldMeta) => {
  const { resource: flowResource, properties } = fieldMeta;
  let resourceId;

  if (properties && properties._exportId) {
    resourceId = properties._exportId;
  } else if (flowResource && flowResource._exportId) {
    resourceId = flowResource._exportId;
  } else if (
    flowResource &&
    flowResource.pageGenerators &&
    flowResource.pageGenerators.length
  ) {
    resourceId = flowResource.pageGenerators[0]._exportId;
  }

  return selectors.resource(state, 'exports', resourceId);
};
// #begin integrationApps Region
selectors.integrationConnectionList = (state, integrationId, childId, tableConfig) => {
  const integration = selectors.resource(state, 'integrations', integrationId) || {};
  // eslint-disable-next-line no-use-before-define
  const childIntegrations = map(selectors.integrationChildren(state, integrationId), 'value');
  let { resources = [] } = selectors.resourceList(state, {
    type: 'connections',
    ...(tableConfig || {}),
  });

  if (integrationId && integrationId !== 'none' && !integration._connectorId) {
    let registeredConnections = [];

    if (!childId) {
      childIntegrations.forEach(intId => {
        const integration = selectors.resource(state, 'integrations', intId);

        if (integration) {
          registeredConnections = registeredConnections.concat(integration._registeredConnectionIds);
        }
      });
    } else {
      const parentIntegration = selectors.resource(state, 'integrations', integrationId);
      const childIntegration = selectors.resource(state, 'integrations', childId);

      if (parentIntegration) {
        registeredConnections = registeredConnections.concat(parentIntegration._registeredConnectionIds);
      }
      if (childIntegration) {
        registeredConnections = registeredConnections.concat(childIntegration._registeredConnectionIds);
      }
    }

    if (registeredConnections) {
      resources = resources.filter(c => registeredConnections.includes(c._id));
    }
  } else if (integration._connectorId) {
    resources = resources.filter(conn => {
      if (childId && childId !== integrationId) {
        return [integrationId, childId].includes(conn._integrationId);
      }

      return childIntegrations.includes(conn._integrationId);
    });
  }

  return resources;
};

selectors.integrationAppV2FlowList = (state, integrationId, childId) => {
  if (!state) return null;

  return selectors.resourceList(state, {
    type: 'flows',
    filter: { _integrationId: childId },
  }).resources;
};

selectors.integrationAppV2ConnectionList = (state, integrationId, childId) => {
  if (!state) return null;
  const isParent = integrationId === childId;
  let integrations;

  if (isParent) {
    const childIntegrations = selectors.resourceList(state, {
      type: 'integrations',
      filter: { _parentId: integrationId },
    }).resources;

    integrations = [integrationId, ...map(childIntegrations, '_id')];
  } else {
    integrations = [integrationId, childId];
  }

  const connections = selectors.resourceList(state, {
    type: 'connections',
    filter: {
      $where() {
        return integrations.includes(this._integrationId);
      },
    },
  }).resources;

  return connections;
};

selectors.integrationAppResourceList = (
  state,
  integrationId,
  storeId,
  tableConfig
) => {
  if (!state) return { connections: emptySet, flows: emptySet };

  const integrationResource =
    selectors.integrationAppSettings(state, integrationId) || {};
  const { supportsMultiStore, sections } = integrationResource.settings || {};
  const { resources: integrationConnections } = selectors.resourceList(state, {
    type: 'connections',
    filter: { _integrationId: integrationId },
    ...(tableConfig || {}),
  });

  if (!supportsMultiStore || !storeId) {
    return {
      connections: integrationConnections,
      flows: selectors.resourceList(state, {
        type: 'flows',
        filter: { _integrationId: integrationId },
      }).resources,
    };
  }

  const flows = [];
  const flowIds = [];
  const allFlowIds = [];
  const connections = [];
  const flowConnections = [];
  const exports = [];
  const imports = [];
  const selectedStore = (sections || []).find(s => s.id === storeId) || {};

  (selectedStore.sections || []).forEach(sec => {
    flowIds.push(...map(sec.flows, '_id'));
  });
  (sections || []).forEach(store => {
    (store.sections || []).forEach(sec => {
      allFlowIds.push(...map(sec.flows, '_id'));
    });
  });
  allFlowIds.forEach(fid => {
    const flow = selectors.resource(state, 'flows', fid) || {};

    flowConnections.push(...selectors.getAllConnectionIdsUsedInTheFlow(state, flow));
  });
  const unUsedConnections = integrationConnections.filter(c => !flowConnections.includes(c._id));

  flowIds.forEach(fid => {
    const flow = selectors.resource(state, 'flows', fid) || {};

    flows.push({_id: flow._id, name: flow.name});
    connections.push(...selectors.getAllConnectionIdsUsedInTheFlow(state, flow));
    exports.push(...getExportIdsFromFlow(state, flow));
    imports.push(...getImportIdsFromFlow(state, flow));
  });

  return {
    connections: [...integrationConnections.filter(c => connections.includes(c._id)), ...unUsedConnections],
    flows,
    exports,
    imports,
  };
};

selectors.mkIntegrationAppStore = () => {
  const integrationSettings = selectors.mkIntegrationAppSettings();

  return createSelector(
    (state, integrationId) => integrationSettings(state, integrationId),
    (_1, _2, storeId) => storeId,
    (integration, storeId) => {
      if (!integration || !integration.stores || !integration.stores.length) {
        return emptyObject;
      }

      return (
        integration.stores.find(store => store.value === storeId) || emptyObject
      );
    }

  );
};

selectors.integrationAppConnectionList = (
  state,
  integrationId,
  storeId,
  tableConfig
) => selectors.integrationAppResourceList(state, integrationId, storeId, tableConfig)
  .connections;

selectors.pendingCategoryMappings = (state, integrationId, flowId) => {
  const { response, mappings, deleted, uiAssistant } =
    fromSession.categoryMapping(
      state && state.session,
      integrationId,
      flowId
    ) || {};
  const mappingData = response.find(op => op.operation === 'mappingData');
  const sessionMappedData =
    mappingData && mappingData.data && mappingData.data.mappingData;
  const categoryRelationshipData = fromSession.categoryMappingGeneratesMetadata(
    state && state.session,
    integrationId,
    flowId
  );
  // SessionMappedData is a state object reference and setCategoryMappingData recursively mutates the parameter, hence deepClone the sessionData
  const sessionMappings = deepClone(sessionMappedData);

  mappingUtil.setCategoryMappingData(
    flowId,
    sessionMappings,
    mappings,
    deleted,
    categoryRelationshipData,
    uiAssistant !== 'jet'
  );

  return sessionMappings;
};

selectors.categoryMappingMetadata = (state, integrationId, flowId) => {
  const categoryMappingData =
    fromSession.categoryMapping(
      state && state.session,
      integrationId,
      flowId
    ) || emptyObject;
  const categoryMappingMetadata = {};
  const { response } = categoryMappingData;

  if (!response) {
    return categoryMappingMetadata;
  }

  const extractsMetadata = response.find(
    sec => sec.operation === 'extractsMetaData'
  );
  const generatesMetadata = response.find(
    sec => sec.operation === 'generatesMetaData'
  );

  if (extractsMetadata) {
    categoryMappingMetadata.extractsMetadata = extractsMetadata.data;
  }

  if (generatesMetadata) {
    categoryMappingMetadata.generatesMetadata =
      generatesMetadata.data &&
      generatesMetadata.data.generatesMetaData &&
      generatesMetadata.data.generatesMetaData.fields;
    categoryMappingMetadata.relationshipData =
      generatesMetadata.data && generatesMetadata.data.categoryRelationshipData;
  }

  return categoryMappingMetadata;
};

selectors.mappedCategories = (state, integrationId, flowId) => {
  const categoryMappingData =
    fromSession.categoryMapping(
      state && state.session,
      integrationId,
      flowId
    ) || {};
  let mappedCategories = emptySet;
  const { response } = categoryMappingData;

  if (response) {
    const mappingData = response.find(sec => sec.operation === 'mappingData');

    if (mappingData) {
      mappedCategories = mappingData.data.mappingData.basicMappings.recordMappings.map(
        item => ({
          id: item.id,
          name: item.name === 'commonAttributes' ? 'Common' : item.name,
          children: item.children,
        })
      );
    }
  }

  return mappedCategories;
};

selectors.categoryMappingGenerateFields = (
  state,
  integrationId,
  flowId,
  options
) => {
  const { sectionId } = options;
  const generatesMetadata =
    fromSession.categoryMappingGeneratesMetadata(
      state && state.session,
      integrationId,
      flowId
    ) || {};

  if (generatesMetadata) {
    return generatesMetadata.find(sec => sec.id === sectionId);
  }

  return null;
};

selectors.mappingsForVariation = (state, integrationId, flowId, filters) => {
  const { sectionId, variation, isVariationAttributes } = filters;
  let mappings = {};
  const recordMappings =
    fromSession.variationMappingData(
      state && state.session,
      integrationId,
      flowId
    ) || emptyObject;

  if (recordMappings) {
    mappings = recordMappings.find(item => item.id === sectionId) || {};
  }

  if (isVariationAttributes) {
    return mappings;
  }

  // propery being read as is from IA metadata, to facilitate initialization and to avoid re-adjust while sending back.
  // eslint-disable-next-line camelcase
  const { variation_themes = [] } = mappings;

  return (
    variation_themes.find(theme => theme.variation_theme === variation) ||
    emptyObject
  );
};

selectors.mappingsForCategory = (state, integrationId, flowId, filters) => {
  const { sectionId, depth } = filters;
  let mappings = emptySet;
  const { attributes = {}, mappingFilter = 'all' } =
    selectors.categoryMappingFilters(state, integrationId, flowId) || {};
  const recordMappings =
    fromSession.categoryMappingData(
      state && state.session,
      integrationId,
      flowId
    ) || {};
  const { fields = [] } =
    selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
      sectionId,
    }) || {};

  if (recordMappings) {
    if (depth === undefined) {
      mappings = recordMappings.find(item => item.id === sectionId);
    } else {
      mappings = recordMappings.find(item => item.id === sectionId && depth === item.depth);
    }
  }

  // If no filters are passed, return all mapppings
  if (!mappings || !attributes || !mappingFilter) {
    return mappings;
  }

  const mappedFields = map(mappings.fieldMappings, 'generate');
  // Filter all generateFields with filter which are not yet mapped
  const filteredFields = fields
    .filter(field => !mappedFields.includes(field.id))
    .map(field => ({
      generate: field.id,
      extract: '',
      discardIfEmpty: true,
    }));
  // Combine filtered mappings and unmapped fields and generate unmapped fields
  const filteredMappings = [...mappings.fieldMappings, ...filteredFields];

  // return mappings object by overriding field mappings with filtered mappings
  return {
    ...mappings,
    fieldMappings: filteredMappings,
  };
};

selectors.integrationAppName = () => createSelector(
  state => state?.data?.resources.integrations,
  (state, integrationId) => integrationId,
  (integrations, integrationId) => {
    const integration = integrations.find(i => i._id === integrationId);

    if (integration && integration._connectorId && integration.name) {
      return getIntegrationAppUrlName(integration.name);
    }

    return null;
  }
);

selectors.integrationChildren = (state, integrationId) => {
  if (!state) return null;
  const children = [];
  const integration = selectors.resource(state, 'integrations', integrationId) || {};
  const childIntegrations = selectors.resourceList(state, {
    type: 'integrations',
    filter: { _parentId: integrationId },
  }).resources;

  children.push({ value: integrationId, label: integration.name });
  childIntegrations.forEach(ci => {
    children.push({ value: ci._id, label: ci.name, mode: ci.mode });
  });

  return children;
};

selectors.mkIntegrationChildren = () => createSelector(
  state => state?.data?.resources?.integrations,
  (state, integrationId) => integrationId,
  (integrations = [], integrationId) => {
    const children = [];
    const integration = integrations.find(int => int._id === integrationId) || {};
    const childIntegrations = integrations.filter(int => int._parentId === integrationId);

    children.push({ value: integrationId, label: integration.name });
    childIntegrations.forEach(ci => {
      children.push({ value: ci._id, label: ci.name, mode: ci.mode });
    });

    return children;
  }
);

selectors.integrationAppLicense = (state, id) => {
  if (!state) return emptyObject;
  const integrationResource = selectors.integrationAppSettings(state, id);
  const { connectorEdition: edition } = integrationResource.settings || {};
  const userLicenses = fromUser.licenses(state && state.user) || [];
  const license = userLicenses.find(l => l._integrationId === id) || {};
  const upgradeRequested = selectors.checkUpgradeRequested(state, license._id);
  const { expires, created } = license;
  const hasExpired = moment(expires) - moment() < 0;
  const createdFormatted = `Started on ${moment(created).format(
    'MMM Do, YYYY'
  )}`;
  const isExpiringSoon =
    moment.duration(moment(expires) - moment()).as('days') <= 15;
  const expiresText = expiresInfo(license);
  const upgradeText = upgradeButtonText(
    license,
    integrationResource,
    upgradeRequested
  );
  const plan = `${
    edition ? edition.charAt(0).toUpperCase() + edition.slice(1) : 'Standard'
  } plan`;

  return {
    ...license,
    plan,
    expiresText,
    upgradeText,
    upgradeRequested: !!upgradeRequested,
    createdText: createdFormatted,
    showLicenseExpiringWarning: hasExpired || isExpiringSoon,
  };
};
selectors.makeIntegrationSectionFlows = () => createSelector(
  (state, integrationId) => selectors.integrationAppSettings(state, integrationId) || emptyObject,
  (_1, _2, childId) => childId,
  (_1, _2, _3, sectionId) => sectionId,
  (integration, childId, sectionId) => {
    let flows = [];
    const { sections = [], supportsMultiStore } = integration.settings || {};

    if (supportsMultiStore) {
      if (Array.isArray(sections) && sections.length) {
        if (childId) {
          const child =
            (sections.find(sec => sec.id === childId) || {}).sections || [];

          if (child) {
            if (sectionId) {
              const selectedSection = child.find(sec => getTitleIdFromSection(sec) === sectionId);

              if (selectedSection) {
                flows = selectedSection.flows.map(f => f._id);
              }
            } else {
              child.forEach(sec => flows.push(...sec.flows.map(f => f._id)));
            }
          }
        } else {
          sections.forEach(sec => {
            if (sec.mode === 'settings') {
              if (sectionId) {
                const selectedSection = sec.sections.find(s => getTitleIdFromSection(s) === sectionId);

                if (selectedSection) {
                  flows.push(...selectedSection.flows.map(f => f._id));
                }
              } else {
                sec.sections.forEach(s => flows.push(...s.flows.map(f => f._id)));
              }
            }
          });
        }
      }
    } else if (sectionId) {
      const selectedSection = sections.find(sec => getTitleIdFromSection(sec) === sectionId);

      if (selectedSection) {
        flows = selectedSection.flows.map(f => f._id);
      }
    } else {
      sections.forEach(sec => flows.push(...sec.flows.map(f => f._id)));
    }

    return flows;
  }
);

selectors.mkIntegrationAppFlowSections = () => {
  const integrationSettingsSelector = selectors.mkIntegrationAppSettings();

  return createSelector(
    (state, id) => (state && integrationSettingsSelector(state, id)) || emptyObject,
    (_1, _2, store) => store,
    (integrationResource, store) => {
      let flowSections = [];
      const { sections = [], supportsMultiStore } =
      integrationResource.settings || {};

      if (supportsMultiStore) {
        if (Array.isArray(sections) && sections.length) {
          if (store) {
            flowSections =
            (sections.find(sec => sec.id === store) || {}).sections || [];
          } else {
            flowSections =
            (sections.find(sec => sec.mode !== 'install') || {}).sections || [];
          }
        }
      } else {
        flowSections = sections;
      }

      return flowSections.map(sec => ({
        ...sec,
        titleId: getTitleIdFromSection(sec),
      }));
    });
};

selectors.integrationAppFlowSections = selectors.mkIntegrationAppFlowSections();

selectors.mkIntegrationAppGeneralSettings = () => {
  const integrationSettingsSelector = selectors.mkIntegrationAppSettings();

  return createSelector(

    (state, id) => (state && integrationSettingsSelector(state, id)),
    (_1, _2, storeId) => storeId,
    (integrationResource, storeId) => {
      if (!integrationResource) return emptyObject;
      let fields;
      let subSections;
      const { supportsMultiStore, general } = integrationResource.settings || {};

      if (supportsMultiStore) {
        const storeSection = (general || []).find(s => s.id === storeId) || {};

        ({ fields, sections: subSections } = storeSection);
      } else if (Array.isArray(general)) {
        ({ fields, sections: subSections } =
      general.find(s => s.title === 'General') || {});
      } else {
        ({ fields, sections: subSections } = general || {});
      }

      return {
        fields,
        sections: subSections,
      };
    }

  );
};

selectors.integrationAppGeneralSettings = selectors.mkIntegrationAppGeneralSettings();

selectors.hasGeneralSettings = (state, integrationId, storeId) => {
  if (!state) return false;
  const integrationResource =
    selectors.integrationAppSettings(state, integrationId) || {};
  const { supportsMultiStore, general } = integrationResource.settings || {};

  if (supportsMultiStore) {
    return !!(general || []).find(s => s.id === storeId);
  }
  if (Array.isArray(general)) {
    return !!general.find(s => s.title === 'General');
  }

  return !isEmpty(general);
};

selectors.mkIntegrationAppSectionMetadata = () => {
  const integrationSettings = selectors.mkIntegrationAppSettings();

  return createSelector(
    (state, integrationId) => integrationSettings(state, integrationId),
    (_1, _2, section) => section,
    (_1, _2, _3, storeId) => storeId,
    (integrationResource, section, storeId) => {
      if (!integrationResource) return emptyObject;

      const { supportsMultiStore, sections = [] } = integrationResource.settings || {};
      let allSections = sections;

      if (supportsMultiStore) {
        if (storeId) {
          // If storeId passed, return sections from that store
          const store = sections.find(s => s.id === storeId) || {};

          allSections = store.sections || [];
        }
      }

      const selectedSection =
    allSections.find(
      sec =>
        getTitleIdFromSection(sec) === section
    ) || {};

      return selectedSection;
    }

  );
};

selectors.integrationAppFlowSettings = (state, id, section, storeId, options = {}) => {
  if (!state) return emptyObject;
  const integrationResource =
    selectors.integrationAppSettings(state, id) || emptyObject;
  const {
    supportsMultiStore,
    supportsMatchRuleEngine: showMatchRuleEngine,
    sections = [],
  } = integrationResource.settings || {};
  let requiredFlows = [];
  let hasNSInternalIdLookup = false;
  let showFlowSettings = false;
  let hasDescription = false;
  let sectionFlows;
  let allSections = sections;

  if (supportsMultiStore) {
    if (storeId) {
      // If storeId passed, return sections from that store
      const store = sections.find(s => s.id === storeId) || {};

      allSections = store.sections || [];
    } else {
      // If no storeId is passed, return all sections from all stores
      allSections = [];
      sections.forEach(sec => {
        allSections.push(...sec.sections);
      });
    }
  }

  const selectedSection =
    allSections.find(
      sec =>
        getTitleIdFromSection(sec) === section
    ) || {};

  if (!section) {
    allSections.forEach(sec => {
      sectionFlows = options.excludeHiddenFlows ? sec.flows.filter(f => !f.hidden) : sec.flows;
      requiredFlows.push(...map(sectionFlows, '_id'));
    });
  } else {
    sectionFlows = options.excludeHiddenFlows ? selectedSection.flows.filter(f => !f.hidden) : selectedSection.flows;
    requiredFlows = map(sectionFlows, '_id');
  }
  hasNSInternalIdLookup = some(
    selectedSection.flows,
    f => f.showNSInternalIdLookup
  );
  hasDescription = some(selectedSection.flows, f => {
    const flow = selectors.resource(state, 'flows', f._id) || {};

    return !!flow.description;
  });
  showFlowSettings = some(
    selectedSection.flows,
    f =>
      !!((f.settings && f.settings.length) || (f.sections && f.sections.length))
  );
  const { fields, sections: subSections } = selectedSection;
  let flows = selectors.flowListWithMetadata(state, {
    type: 'flows',
    filter: {
      _integrationId: id,
    },
  }).resources;

  flows = flows
    .filter(f => requiredFlows.includes(f._id))
    .sort(
      (a, b) => requiredFlows.indexOf(a._id) - requiredFlows.indexOf(b._id)
    );

  return {
    flows,
    fields,
    flowSettings: selectedSection.flows,
    sections: subSections,
    hasNSInternalIdLookup,
    hasDescription,
    showFlowSettings,
    showMatchRuleEngine,
  };
};

// This selector is used in dashboard, it shows all the flows including the flows not in sections.
// Integration App settings page should not use this selector.
selectors.integrationAppFlowIds = (state, integrationId, storeId) => {
  const allIntegrationFlows = selectors.resourceList(state, {
    type: 'flows',
    filter: { _integrationId: integrationId },
  }).resources;

  const integration = selectors.integrationAppSettings(state, integrationId);

  if (integration && integration.stores && storeId) {
    const store = integration.stores.find(store => store.value === storeId);
    const { flows } = selectors.integrationAppFlowSettings(
      state,
      integrationId,
      null,
      storeId
    );

    if (store) {
      const storeFlows = allIntegrationFlows.filter(f => {
        // TODO: this is not reliable way to extract store flows. With current integration json,
        // there is no good way to extract this
        // Extract store from the flow name. (Regex extracts store label from flow name)
        // Flow name usually follows this format: <Flow Name> [<StoreLabel>]
        const flowStore = /\s\[(.*)\]$/.test(f.name)
          ? /\s\[(.*)\]$/.exec(f.name)[1]
          : null;

        return flowStore
          ? flowStore === store.label
          : flows.indexOf(f._id) > -1;
      });

      return map(storeFlows.length ? storeFlows : flows,
        '_id'
      );
    }

    return map(flows, '_id');
  }

  return map(allIntegrationFlows, '_id');
};

selectors.integrationInstallSteps = (state, integrationId) => {
  if (!state) return null;
  const integrationInstallSteps = fromData.integrationInstallSteps(
    state.data,
    integrationId
  );
  const installStatus = fromSession.integrationAppsInstaller(
    state.session,
    integrationId
  );

  const visibleSteps = integrationInstallSteps.filter(s => s.type !== 'hidden');

  return visibleSteps.map(step => {
    if (step.isCurrentStep) {
      return { ...step, ...installStatus };
    }

    return step;
  });
};

const emptyStepsArr = [];

selectors.integrationUninstallSteps = (state, { integrationId, isFrameWork2 }) => {
  const uninstallData = isFrameWork2 ? fromSession.uninstall2Data(
    state && state.session,
    integrationId
  ) : fromSession.uninstallData(
    state && state.session,
    integrationId
  );
  const { steps: uninstallSteps, error, isFetched, isComplete } = uninstallData;

  if (!uninstallSteps || !Array.isArray(uninstallSteps)) {
    return uninstallData;
  }

  const visibleSteps = uninstallSteps.filter(s => s.type !== 'hidden');

  if (visibleSteps.length === 0) {
    return { steps: emptyStepsArr, error, isFetched, isComplete };
  }

  const modifiedSteps = produce(visibleSteps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });

  return { steps: modifiedSteps, error, isFetched, isComplete };
};

selectors.addNewStoreSteps = (state, integrationId) => {
  const addNewStoreSteps = fromSession.addNewStoreSteps(
    state && state.session,
    integrationId
  );
  const { steps } = addNewStoreSteps;

  if (!steps || !Array.isArray(steps)) {
    return addNewStoreSteps;
  }

  const modifiedSteps = produce(steps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });

  return { steps: modifiedSteps };
};

selectors.isIAV2UninstallComplete = (state, { integrationId }) => {
  const integration = selectors.integrationAppSettings(state, integrationId);

  if (!integration) return true;
  if (integration.mode !== 'uninstall') return false;

  const uninstallData = fromSession.uninstall2Data(
    state && state.session,
    integrationId
  );

  const { steps: uninstallSteps, isFetched } = uninstallData;

  if (isFetched) {
    if (!uninstallSteps || uninstallSteps.length === 0) return true;

    return !(uninstallSteps.find(s =>
      !s.completed
    ));
  }

  return false;
};

// FIXME: @ashu, we can refactor this later and completely remove
// the clone check once the functionality is clear and tested for all scenarios
selectors.isIntegrationAppVersion2 = (state, integrationId, skipCloneCheck) => {
  const integration = selectors.resource(state, 'integrations', integrationId);

  if (!integration) return false;
  let isCloned = false;

  if (!skipCloneCheck) {
    isCloned =
    integration.install &&
    integration.install.find(step => step.isClone);
  }
  const isFrameWork2 =
    !!((
      integration.installSteps &&
      integration.installSteps.length) || (
      integration.uninstallSteps &&
        integration.uninstallSteps.length)) ||
    isCloned;

  return isFrameWork2;
};

selectors.integrationAppChildIdOfFlow = (state, integrationId, flowId) => {
  if (!state || !integrationId) {
    return null;
  }
  const integration = fromData.resource(state.data, 'integrations', integrationId);

  if (integration?.settings?.supportsMultiStore) {
    const { stores } = selectors.integrationAppSettings(state, integrationId);

    if (!flowId) {
      return null;
    }

    return stores.find(store => selectors.integrationAppFlowIds(state, integrationId, store?.value)?.includes(flowId))?.value;
  }
  if (selectors.isIntegrationAppVersion2(state, integrationId, true)) {
    if (!flowId) return integrationId;

    return fromData.resource(state.data, 'flows', flowId)?._integrationId;
  }

  return null;
};

// #region PUBLIC ACCOUNTS SELECTORS

selectors.platformLicense = createSelector(
  selectors.userPreferences,
  // TODO: Surya make it even more granular the selector
  // it should be made receptive to changes to the state.user.org.accounts
  selectors.userState,
  (preferencesObj, userStateObj) =>
    fromUser.platformLicense(userStateObj, preferencesObj.defaultAShareId)
);

selectors.platformLicenseActionDetails = state => {
  let licenseActionDetails = {};
  const license = selectors.platformLicense(state);

  if (!license) {
    return licenseActionDetails;
  }

  if (license.tier === 'none') {
    if (!license.trialEndDate) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'GO UNLIMITED FOR 30 DAYS',
      };
    }
  } else if (license.tier === 'free') {
    if (!license.trialEndDate) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'GO UNLIMITED FOR 30 DAYS',
      };
    } else if (license.status === 'TRIAL_EXPIRED') {
      licenseActionDetails = {
        action: 'upgrade',
        label: 'UPGRADE NOW',
      };
    } else if (license.status === 'IN_TRIAL') {
      if (license.expiresInDays < 1) {
        licenseActionDetails = {
          action: 'upgrade',
          label: 'UPGRADE NOW',
        };
      } else {
        licenseActionDetails = {
          action: 'upgrade',
          label: `${license.expiresInDays} DAYS LEFT UPGRADE NOW`,
        };
        licenseActionDetails.expiresSoon = license.expiresInDays < 10;
      }
    }
  }

  licenseActionDetails.upgradeRequested = license.upgradeRequested;

  return licenseActionDetails;
};

function getTierToFlowsMap(license) {
  const flowsInTier = {
    none: 0,
    free: 0,
    limited: 3,
    standard: 8,
    premium: 20,
    enterprise: 50,
  };
  let flows = flowsInTier[license.tier] || 0;

  if (license.inTrial) flows = Number.MAX_SAFE_INTEGER;

  if (license.tier === 'free' && !license.inTrial) {
    if (
      !license.numAddOnFlows &&
      !license.sandbox &&
      !license.numSandboxAddOnFlows
    ) {
      flows = 1;
    }
  }

  return flows;
}
selectors.platformLicenseWithMetadata = createSelector(
  selectors.platformLicense,
  license => {
    const licenseActionDetails = { ...license };
    const nameMap = {
      none: 'None',
      free: 'Free',
      limited: 'Limited',
      standard: 'Standard',
      premium: 'Premium',
      enterprise: 'Enterprise',
    };

    if (!licenseActionDetails) {
      return licenseActionDetails;
    }

    licenseActionDetails.isNone = licenseActionDetails.tier === 'none';
    licenseActionDetails.tierName = nameMap[licenseActionDetails.tier] || licenseActionDetails.tier;
    licenseActionDetails.inTrial = false;

    if (licenseActionDetails.tier === 'free') {
      if (licenseActionDetails.trialEndDate) {
        licenseActionDetails.inTrial =
        moment(licenseActionDetails.trialEndDate) - moment() >= 0;
      }
    }

    licenseActionDetails.hasSubscription = false;

    if (['none', 'free'].indexOf(licenseActionDetails.tier) === -1) {
      licenseActionDetails.hasSubscription = true;
    } else if (
      licenseActionDetails.tier === 'free' &&
    !licenseActionDetails.inTrial
    ) {
      if (
        licenseActionDetails.numAddOnFlows > 0 ||
      licenseActionDetails.sandbox ||
      licenseActionDetails.numSandboxAddOnFlows > 0
      ) {
        licenseActionDetails.hasSubscription = true;
      }
    }

    licenseActionDetails.isFreemium =
    licenseActionDetails.tier === 'free' &&
    !licenseActionDetails.hasSubscription &&
    !licenseActionDetails.inTrial;
    licenseActionDetails.hasExpired = false;

    if (licenseActionDetails.hasSubscription && licenseActionDetails.expires) {
      licenseActionDetails.hasExpired =
      moment(licenseActionDetails.expires) - moment() < 0;
    }

    licenseActionDetails.isExpiringSoon = false;
    let dateToCheck;

    if (licenseActionDetails.hasSubscription) {
      if (!licenseActionDetails.hasExpired && licenseActionDetails.expires) {
        dateToCheck = licenseActionDetails.expires;
      }
    } else if (licenseActionDetails.inTrial) {
      dateToCheck = licenseActionDetails.trialEndDate;
    }

    if (dateToCheck) {
      licenseActionDetails.isExpiringSoon =
      moment.duration(moment(dateToCheck) - moment()).as('days') <= 15; // 15 days
    }

    licenseActionDetails.subscriptionName = licenseActionDetails.tierName;

    if (licenseActionDetails.inTrial) {
      licenseActionDetails.subscriptionName = 'Free trial';
    }

    licenseActionDetails.expirationDate = licenseActionDetails.expires;

    if (licenseActionDetails.inTrial) {
      licenseActionDetails.expirationDate = licenseActionDetails.trialEndDate;
    } else if (licenseActionDetails.isFreemium) {
      licenseActionDetails.expirationDate = '';
    }

    if (licenseActionDetails.expirationDate) {
      licenseActionDetails.expirationDate = moment(
        licenseActionDetails.expirationDate
      ).format('MMM Do, YYYY');
    }

    const names = {
      free: 'Free',
      light: 'Starter',
      moderate: 'Professional',
      heavy: 'Enterprise',
      custom: 'Custom',
    };

    licenseActionDetails.usageTierName =
    names[licenseActionDetails.usageTier || 'free'];

    const hours = {
      free: 1,
      light: 40,
      moderate: 400,
      heavy: 4000,
      custom: 10000, // TODO - not sure how to get this
    };

    licenseActionDetails.usageTierHours =
    hours[licenseActionDetails.usageTier || 'free'];
    licenseActionDetails.status = '';

    if (licenseActionDetails.hasSubscription) {
      licenseActionDetails.status = licenseActionDetails.hasExpired
        ? 'expired'
        : 'active';
    }

    if (
      licenseActionDetails.tier === 'free' &&
    (licenseActionDetails.inTrial || licenseActionDetails.isFreemium)
    ) {
      licenseActionDetails.status = 'active';
    }

    licenseActionDetails.totalFlowsAvailable = getTierToFlowsMap(
      licenseActionDetails
    );

    if (licenseActionDetails.numAddOnFlows > 0) {
      licenseActionDetails.totalFlowsAvailable +=
      licenseActionDetails.numAddOnFlows;
    }

    licenseActionDetails.totalSandboxFlowsAvailable = 0;

    if (licenseActionDetails.sandbox) {
      licenseActionDetails.totalSandboxFlowsAvailable = getTierToFlowsMap(
        licenseActionDetails
      );
    }

    if (licenseActionDetails.numSandboxAddOnFlows > 0) {
      licenseActionDetails.totalSandboxFlowsAvailable +=
      licenseActionDetails.numSandboxAddOnFlows;
    }

    if (
      !(
        (licenseActionDetails.status === 'active' ||
        licenseActionDetails.isFreemium) &&
      licenseActionDetails.supportTier
      )
    ) {
      licenseActionDetails.supportTier = '';
    }

    const toReturn = {
      actions: [],
    };

    toReturn.__trialExtensionRequested =
    licenseActionDetails.__trialExtensionRequested;

    if (licenseActionDetails.tier === 'none') {
      toReturn.actions = ['start-free-trial'];
    } else if (licenseActionDetails.tier === 'free') {
      if (licenseActionDetails.inTrial) {
        toReturn.actions = ['request-subscription'];
      } else if (licenseActionDetails.hasSubscription) {
        if (licenseActionDetails.hasExpired) {
          toReturn.actions = ['request-upgrade'];
        }
      } else if (licenseActionDetails.trialEndDate) {
        toReturn.actions = ['request-upgrade', 'request-trial-extension'];
      } else {
        toReturn.actions = ['start-free-trial'];
      }
    } else if (licenseActionDetails.hasExpired) {
      toReturn.actions = ['request-upgrade'];
    } else if (licenseActionDetails.tier !== 'enterprise') {
      toReturn.actions = ['request-upgrade'];
    } else {
      toReturn.actions = ['add-more-flows'];
    }

    licenseActionDetails.subscriptionActions = toReturn;

    return licenseActionDetails;
  });

selectors.isLicenseValidToEnableFlow = state => {
  const licenseDetails = { enable: true };
  const license = selectors.platformLicenseWithMetadata(state);

  if (!license) {
    return licenseDetails;
  }

  if (license.hasExpired) {
    licenseDetails.enable = false;
    licenseDetails.message = LICENSE_EXPIRED;
  }

  return licenseDetails;
};

selectors.hasAccounts = state => !!(state && state.user && state.user.accounts);

selectors.hasAcceptedUsers = state => !!(
  state &&
    state.user &&
    state.user.org &&
    state.user.org.users &&
    state.user.org.users.filter(a => a.accepted && !a.disabled).length > 0
);

selectors.hasAcceptedAccounts = state => !!(
  state &&
    state.user &&
    state.user.org.accounts &&
    state.user.org.accounts.filter(
      a => a._id !== ACCOUNT_IDS.OWN && a.accepted && !a.disabled
    ).length > 0
);

selectors.isValidSharedAccountId = (state, _id) => !!(
  state &&
    state.user &&
    state.user.org.accounts &&
    state.user.org.accounts.filter(
      a =>
        a.accepted && !a.disabled && a._id === _id && a._id !== ACCOUNT_IDS.OWN
    ).length > 0
);

selectors.getOneValidSharedAccountId = state => {
  let _id;

  if (state && state.user && state.user.org && state.user.org.accounts) {
    const accepted = state.user.org.accounts.filter(
      a => a.accepted && !a.disabled && a._id !== ACCOUNT_IDS.OWN
    );

    if (accepted && accepted.length > 0) {
      [{ _id }] = accepted;
    }
  }

  return _id;
};

const parentResourceToLookUpTo = {
  flows: 'integrations',
};
const getParentsResourceId = (state, resourceType, resourceId) => {
  if (!resourceType) return null;

  const parentResourceType = parentResourceToLookUpTo[resourceType];

  if (!parentResourceType) return null;

  if (parentResourceType === 'integrations') {
    const { _integrationId } = selectors.resource(state, resourceType, resourceId) || {};

    return _integrationId;
  }

  return null;
};

selectors.getResourceEditUrl = (state, resourceType, resourceId, childId) => {
  let integrationId = resourceType === 'integrations' ? resourceId : getParentsResourceId(state, resourceType, resourceId);
  // eslint-disable-next-line prefer-const
  let { name: integrationName, _parentId } = selectors.resource(state, 'integrations', integrationId) || {};

  // fetch parent integration name and id to append in the url
  if (_parentId) {
    const name = selectors.resource(state, 'integrations', _parentId)?.name;

    integrationName = name;
    integrationId = _parentId;
  }
  // to handle standalone integrations
  integrationId = integrationId || 'none';

  const { _connectorId } =
      selectors.resource(state, resourceType, resourceId) || {};

  let iaUrlPrefix;

  if (_connectorId) {
    if (childId) {
      iaUrlPrefix = `/integrationapps/${getIntegrationAppUrlName(integrationName)}/${integrationId}/child/${childId}`;
    } else {
      iaUrlPrefix = `/integrationapps/${getIntegrationAppUrlName(integrationName)}/${integrationId}`;
    }
  }

  if (resourceType === 'flows') {
    const isDataLoader = selectors.isDataLoader(state, resourceId);
    const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';

    return getRoutePath(`${iaUrlPrefix || `/integrations/${integrationId}`}/${flowBuilderPathName}/${resourceId}`);
  }
  if (resourceType === 'integrations') {
    return getRoutePath(`${iaUrlPrefix || `/integrations/${resourceId}`}/flows`);
  }

  return getRoutePath(`${resourceType}/edit/${resourceType}/${resourceId}`);
};

selectors.userPermissionsOnConnection = (state, connectionId) => {
  const permissions = selectors.userPermissions(state);

  if (!permissions) {
    return emptyObject;
  }

  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
      USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
    ].includes(permissions.accessLevel)
  ) {
    const connection = selectors.resource(state, 'connections', connectionId);

    return (
      (connection && connection._connectorId
        ? permissions.integrations.connectors
        : permissions.integrations.all) || {}
    ).connections;
  }
  if (USER_ACCESS_LEVELS.TILE === permissions.accessLevel) {
    const ioIntegrations = selectors.resourceList(state, {
      type: 'integrations',
    }).resources;
    const ioIntegrationsWithConnectionRegistered = ioIntegrations.filter(
      i =>
        i?._registeredConnectionIds &&
        i._registeredConnectionIds.includes(connectionId)
    );
    let highestPermissionIntegration = {};
    let integrationPermissions = {};

    ioIntegrationsWithConnectionRegistered.forEach(i => {
      integrationPermissions = permissions.integrations[i._id] || permissions.integrations.all || {};
      if (integrationPermissions.accessLevel) {
        if (!highestPermissionIntegration.accessLevel || highestPermissionIntegration.accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR) {
          highestPermissionIntegration = integrationPermissions;
        }
      }
    });

    return (highestPermissionIntegration || {}).connections;
  }

  return emptyObject;
};

selectors.resourcePermissions = (
  state,
  resourceType,
  resourceId,
  childResourceType
) => {
  // to support parent-child integration permissions
  if (resourceType === 'integrations') {
    const resourceData = selectors.resource(state, 'integrations', resourceId);

    if (resourceData?._parentId) {
      return selectors.resourcePermissions(
        state,
        resourceType,
        resourceData._parentId,
        childResourceType);
    }
  }
  //  when resourceType == connection and resourceID = connectionId, we fetch connection
  //  permission by checking for highest order connection permission under integrations
  if (resourceType === 'connections' && resourceId) {
    return selectors.userPermissionsOnConnection(state, resourceId) || emptyObject;
  }

  const permissions = selectors.userPermissions(state);

  if (!permissions) return emptyObject;

  // special case, where resourceType == integrations. Its childResource,
  // ie. connections, flows can be retrieved by passing childResourceType
  if (resourceType === 'integrations' && (childResourceType || resourceId)) {
    const resourceData =
      resourceId && selectors.resource(state, 'integrations', resourceId);

    if (
      [
        USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      ].includes(permissions.accessLevel)
    ) {
      const value =
        resourceData && resourceData._connectorId
          ? permissions.integrations.connectors
          : permissions.integrations.all;

      // filtering child resource
      return (
        (childResourceType ? value && value[childResourceType] : value) ||
        emptyObject
      );
    }
    if (resourceId) {
      let value = permissions[resourceType][resourceId];

      if (!value && resourceType === 'integrations') {
        value = permissions[resourceType].all;
      }

      // remove tile level permissions added to connector while are not valid.
      if (resourceData && resourceData._connectorId) {
        const connectorTilePermission = {
          accessLevel: value.accessLevel,
          flows: {
            edit: value.flow && value.flow.edit,
          },
          connections: {
            edit: value.connections && value.connections.edit,
            create: value.connections && value.connections.create,
          },
          edit: value.edit,
          delete: value.delete,
        };

        value = connectorTilePermission;
      }

      return (
        (childResourceType ? value && value[childResourceType] : value) ||
        emptyObject
      );
    }

    return emptyObject;
  }
  if (resourceType) {
    return resourceId
      ? permissions[resourceType][resourceId]
      : permissions[resourceType];
  }

  return permissions || emptyObject;
};

selectors.isFormAMonitorLevelAccess = (state, integrationId) => {
  const { accessLevel } = selectors.resourcePermissions(state);

  // if all forms is monitor level
  if (accessLevel === 'monitor') return true;

  // check integration level is monitor level
  const { accessLevel: accessLevelIntegration } = selectors.resourcePermissions(
    state,
    'integrations',
    integrationId
  );

  if (accessLevelIntegration === 'monitor') return true;

  return false;
};

selectors.formAccessLevel = (state, integrationId, resource, disabled) => {
  // if all forms is monitor level

  const isMonitorLevelAccess = selectors.isFormAMonitorLevelAccess(state, integrationId);

  if (isMonitorLevelAccess) return { disableAllFields: true };

  // check integration access level
  const { accessLevel: accessLevelIntegration } = selectors.resourcePermissions(
    state,
    'integrations',
    integrationId
  );
  const isIntegrationApp = resource && resource._connectorId;

  if (
    accessLevelIntegration === USER_ACCESS_LEVELS.ACCOUNT_OWNER ||
    accessLevelIntegration === USER_ACCESS_LEVELS.ACCOUNT_MANAGE
  ) {
    // check integration app is manage or owner then selectively disable fields
    if (isIntegrationApp) return { disableAllFieldsExceptClocked: true };
  }

  return { disableAllFields: !!disabled };
};

// TODO: @Ashu, we need to add tests for this once GA is done.  I extracted this
// logic from the DynaSettings component since it needed to be used in multiple
// places. Also, the logic below, now in one place could surely be cleaned up and made more
// readable...I left as-is to minimize risk of regressions.
selectors.canEditSettingsForm = (state, resourceType, resourceId, integrationId) => {
  const r = selectors.resource(state, resourceType, resourceId);
  const isIAResource = !!(r && r._connectorId);
  const {allowedToPublish, developer} = selectors.userProfile(state);
  const viewOnly = selectors.isFormAMonitorLevelAccess(state, integrationId);

  // if the resource belongs to an IA and the user cannot publish, then
  // a user can thus also not edit
  const visibleForUser = !isIAResource || allowedToPublish;

  return developer && !viewOnly && visibleForUser;
};

selectors.publishedConnectors = state => {
  const ioConnectors = selectors.resourceList(state, {
    type: 'published',
  }).resources;

  return ioConnectors.concat(SUITESCRIPT_CONNECTORS);
};

selectors.availableConnectionsToRegister = (state, integrationId) => {
  if (!state) {
    return [];
  }

  const connList = selectors.resourceList(state, { type: 'connections' });
  const allConnections = connList && connList.resources;
  const integration = selectors.resource(state, 'integrations', integrationId);
  const registeredConnections =
    (integration && integration._registeredConnectionIds) || [];
  let availableConnectionsToRegister = allConnections.filter(
    conn => registeredConnections.indexOf(conn._id) === -1
  );

  availableConnectionsToRegister = availableConnectionsToRegister.filter(
    conn => {
      const accessLevel = selectors.userAccessLevelOnConnection(state, conn._id);

      return accessLevel === 'manage' || accessLevel === 'owner';
    }
  );

  return availableConnectionsToRegister;
};

selectors.suiteScriptLinkedConnections = state => {
  const preferences = selectors.userPreferences(state);
  const connections = selectors.resourceList(state, {
    type: 'connections',
  }).resources;
  const linkedConnections = [];
  let connection;
  let accessLevel;

  if (
    !preferences.ssConnectionIds ||
    preferences.ssConnectionIds.length === 0
  ) {
    return linkedConnections;
  }

  preferences.ssConnectionIds.forEach(connectionId => {
    connection = connections.find(c => c._id === connectionId);

    if (connection) {
      accessLevel = selectors.userAccessLevelOnConnection(state, connectionId);

      if (accessLevel) {
        linkedConnections.push({
          ...connection,
          permissions: {
            accessLevel,
          },
        });
      }
    }
  });

  return linkedConnections;
};

selectors.suiteScriptLinkedTiles = state => {
  const linkedConnections = selectors.suiteScriptLinkedConnections(state);
  let tiles = [];

  linkedConnections.forEach(connection => {
    tiles = tiles.concat(selectors.suiteScriptTiles(state, connection._id));
  });

  return tiles;
};

selectors.tiles = state => {
  const tiles = selectors.resourceList(state, {
    type: 'tiles',
  }).resources;
  let integrations = [];

  if (tiles.length > 0) {
    integrations = selectors.resourceList(state, {
      type: 'integrations',
    }).resources;
  }

  let published;
  const hasConnectorTiles = tiles.filter(t => t._connectorId);

  if (hasConnectorTiles) {
    published = selectors.publishedConnectors(state);
  }

  const permissions = selectors.userPermissions(state);
  const hasStandaloneTile = tiles.find(
    t => t._integrationId === STANDALONE_INTEGRATION.id
  );

  if (hasStandaloneTile) {
    integrations = [
      ...integrations,
      { _id: STANDALONE_INTEGRATION.id, name: STANDALONE_INTEGRATION.name },
    ];
  }

  integrations = integrations.map(i => {
    if (
      [
        USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      ].includes(permissions.accessLevel)
    ) {
      return {
        ...i,
        permissions: {
          accessLevel: permissions.integrations.all.accessLevel,
          connections: {
            edit: permissions.integrations.all.connections.edit,
          },
        },
      };
    }

    return {
      ...i,
      permissions: {
        accessLevel: (permissions.integrations[i._id] || permissions.integrations.all)?.accessLevel,
        connections: {
          edit:
            (permissions.integrations[i._id] || permissions.integrations.all)?.connections?.edit,
        },
      },
    };
  });

  let integration;
  let connector;
  let status;

  return tiles.map(t => {
    integration = integrations.find(i => i._id === t._integrationId) || {};

    if (t._connectorId && integration.mode === INTEGRATION_MODES.UNINSTALL) {
      status = TILE_STATUS.UNINSTALL;
    } else if (
      integration.mode === INTEGRATION_MODES.INSTALL || integration.mode === INTEGRATION_MODES.UNINSTALL
    ) {
      status = TILE_STATUS.IS_PENDING_SETUP;
    } else if (t.numError && t.numError > 0) {
      status = TILE_STATUS.HAS_ERRORS;
    } else {
      status = TILE_STATUS.SUCCESS;
    }

    if (t._connectorId) {
      connector = published.find(i => i._id === t._connectorId) || {
        user: {},
      };

      return {
        ...t,
        status,
        integration: {
          mode: integration.mode,
          permissions: integration.permissions,
        },
        connector: {
          owner: connector.user.company || connector.user.name,
          applications: connector.applications || [],
        },
      };
    }

    return {
      ...t,
      status,
      integration: {
        permissions: integration.permissions,
      },
    };
  });
};
// #endregion

// #region PUBLIC GLOBAL SELECTORS

selectors.isProfileDataReady = state => {
  const commKey = commKeyGen('/profile', 'GET');

  return !!(
    state &&
    selectors.hasProfile(state) &&
    !fromComms.isLoading(state.comms, commKey)
  );
};

selectors.isProfileLoading = state => {
  const commKey = commKeyGen('/profile', 'GET');

  return !!(state && fromComms.isLoading(state.comms, commKey));
};

selectors.isDataReady = (state, resource) => (
  fromData.hasData(state.data, resource) &&
    !fromComms.isLoading(state.comms, resource)
);

// Below selector will take resourceName as argument and returns
// true if resource is Loading.
selectors.isResourceCollectionLoading = (state, resourceName) => {
  // Incase of transfers as we make two API calls for fetching
  // transfers and invited transfers, checking for both the keys
  if (resourceName === 'transfers') {
    return [commKeyGen(`/${resourceName}`, 'GET'), commKeyGen(`/${resourceName}/invited`, 'GET')].some(
      resourceKey => fromComms.isLoading(state?.comms, resourceKey)
    );
  }

  return fromComms.isLoading(state?.comms, commKeyGen(`/${resourceName}`, 'GET'));
};

// the keys for the comm's reducers require a forward slash before
// the resource name where as the keys for the data reducer don't
selectors.resourceStatus = (
  state,
  origResourceType,
  resourceReqMethod = 'GET'
) => {
  let resourceType;

  if (origResourceType && origResourceType.startsWith('/')) resourceType = origResourceType;
  else resourceType = `/${origResourceType}`;
  const commKey = commKeyGen(resourceType, resourceReqMethod);
  const method = resourceReqMethod;
  const hasData = fromData.hasData(state.data, origResourceType);
  const isLoading = fromComms.isLoading(state.comms, commKey);
  const retryCount = fromComms.retryCount(state.comms, commKey);
  const isReady = method !== 'GET' || (hasData && !isLoading);

  return {
    resourceType: origResourceType,
    hasData,
    isLoading,
    retryCount,
    method,
    isReady,
  };
};

selectors.resourceStatusModified = (
  resourceState,
  networkCommState,
  origResourceType,
  resourceReqMethod = 'GET'
) => {
  let resourceType;

  if (origResourceType && origResourceType.startsWith('/')) resourceType = origResourceType;
  else resourceType = `/${origResourceType}`;
  const commKey = commKeyGen(resourceType, resourceReqMethod);
  const method = resourceReqMethod;
  const hasData = fromResources.hasData(resourceState, origResourceType);
  const isLoading = fromNetworkComms.isLoading(networkCommState, commKey);
  const retryCount = fromNetworkComms.retryCount(networkCommState, commKey);
  const isReady = method !== 'GET' || (hasData && !isLoading);

  return {
    resourceType: origResourceType,
    hasData,
    isLoading,
    retryCount,
    method,
    isReady,
  };
};

selectors.allResourceStatus = (
  resourceState,
  networkCommState,
  resourceTypes
) => (typeof resourceTypes === 'string'
  ? resourceTypes.split(',')
  : resourceTypes
).map(resourceType =>
  selectors.resourceStatusModified(resourceState, networkCommState, resourceType.trim())
);

selectors.makeAllResourceStatusSelector = () =>
  createSelector(
    selectors.resourceState,
    selectors.networkCommState,
    (_, resourceTypes) => resourceTypes,
    (resourcesState, networkCommState, resourceTypes) =>
      selectors.allResourceStatus(resourcesState, networkCommState, resourceTypes)
  );

selectors.resourceDataModified = (
  resourceIdState,
  stagedIdState,
  resourceType,
  id
) => {
  if (!resourceType || !id) return emptyObject;

  const master = resourceIdState;
  const { patch, conflict } = stagedIdState || {};

  if (!master && !patch) return { merged: emptyObject };

  let merged;
  let lastChange;

  if (patch) {
    try {
      // If the patch is not deep cloned, its values are also mutated and
      // on some operations can corrupt the merged result.
      const patchResult = jsonPatch.applyPatch(
        master ? jsonPatch.deepClone(master) : {},
        jsonPatch.deepClone(patch)
      );

      merged = patchResult.newDocument;
    } catch (ex) {
      // eslint-disable-next-line
      console.warn('unable to apply patch to the document. PatchSet = ', patch, 'document = ', master);
      // Incase if we are not able to apply patchSet to document,
      // catching the excpetion and assigning master to the merged.
      merged = master;
    }

    if (patch.length) lastChange = patch[patch.length - 1].timestamp;
  }

  const data = {
    master,
    patch,
    lastChange,
    merged: merged || master,
  };

  if (conflict) data.conflict = conflict;

  return data;
};

// fromResources.resourceIdState
// nothing but state && state.data && state.data.resources && state.data.resources.type
selectors.makeResourceDataSelector = () => {
  const cachedStageSelector = fromSession.makeTransformStagedResource();
  const cachedResourceSelector = fromData.makeResourceSelector();

  return createSelector(
    (state, resourceType, id) => {
      if (!resourceType || !id) return null;
      let type = resourceType;

      if (resourceType.indexOf('/licenses') >= 0) {
        type = 'connectorLicenses';
      }

      // For accesstokens and connections within an integration
      if (resourceType.indexOf('integrations/') >= 0) {
        type = resourceType.split('/').pop();
      }

      return cachedResourceSelector(
        fromData.resourceState(state && state.data),
        type,
        id
      );
    },
    (state, resourceType, id, scope) =>
      cachedStageSelector(
        fromSession.stagedState(state && state.session),
        id,
        scope
      ),
    (_1, resourceType) => resourceType,
    (_1, _2, id) => id,

    (resourceIdState, stagedIdState, resourceType, id) =>
      selectors.resourceDataModified(resourceIdState, stagedIdState, resourceType, id)
  );
};

// Please use makeResourceDataSelector in JSX as it is cached selector.
// For sagas we can use resourceData which points to cached selector.
selectors.resourceData = selectors.makeResourceDataSelector();

selectors.isEditorV2Supported = (state, resourceId, resourceType) => {
  const { merged: resource = {} } = selectors.resourceData(
    state,
    resourceType,
    resourceId
  );

  // AFE 2.0 not supported for Native REST Adaptor
  if (['RESTImport', 'RESTExport'].includes(resource.adaptorType)) {
    const restConnection = selectors.resource(state, 'connections', resource._connectionId);

    return !!restConnection.isHTTP;
  }

  return [
    'HTTPImport',
    'HTTPExport',
    'FTPImport',
    'FTPExport',
    'AS2Import',
    'AS2Export',
    'S3Import',
    'S3Export',
  ].includes(resource.adaptorType);
};

selectors.resourceFormField = (state, resourceType, resourceId, id) => {
  const data = selectors.resourceData(state, resourceType, resourceId);

  if (!data || !data.merged) return;

  const { merged } = data;
  const meta = merged.customForm && merged.customForm.form;

  if (!meta) return;

  const field = getFieldById({ meta, id });

  if (!field) return;

  return field;
};

selectors.notificationResources = (state, _integrationId, storeId) => {
  const diyFlows = selectors.resourceList(state, {
    type: 'flows',
    filter: {
      $where() {
        if (!_integrationId || ['none'].includes(_integrationId)) {
          return !this._integrationId;
        }

        return this._integrationId === _integrationId;
      },
    },
  }).resources;
  const { _registeredConnectionIds = [], _connectorId } =
    selectors.resource(state, 'integrations', _integrationId) || {};
  const diyConnections = selectors.resourceList(state, {
    type: 'connections',
    filter: {
      _id: id =>
        _registeredConnectionIds.includes(id) ||
        ['none'].includes(_integrationId),
    },
  }).resources;
  const notifications = selectors.resourceList(state, { type: 'notifications' })
    .resources;
  const connections = _connectorId
    ? selectors.integrationAppConnectionList(state, _integrationId, storeId)
    : diyConnections;
  const flows = _connectorId
    ? selectors.integrationAppResourceList(state, _integrationId, storeId).flows
    : diyFlows;
  const connectionValues = connections
    .filter(c => !!notifications.find(n => n._connectionId === c._id))
    .map(c => c._id);
  let flowValues = flows
    .filter(f => !!notifications.find(n => n._flowId === f._id))
    .map(f => f._id);
  const allFlowsSelected = !!notifications.find(
    n => n._integrationId === _integrationId
  );

  if (_integrationId && !['none'].includes(_integrationId) && allFlowsSelected) {
    flowValues = [_integrationId, ...flows];
  }

  return {
    connections,
    flows,
    connectionValues,
    flowValues,
  };
};

selectors.auditLogs = (
  state,
  resourceType,
  resourceId,
  filters,
  options = {}
) => {
  let auditLogs = fromData.auditLogs(
    state.data,
    resourceType,
    resourceId,
    filters
  );

  const result = {
    logs: [],
    count: 0,
    totalCount: 0,
  };

  if (options.storeId) {
    const {
      exports = [],
      imports = [],
      flows = [],
      connections = [],
    } = selectors.integrationAppResourceList(state, resourceId, options.storeId);
    const resourceIds = [
      ...exports,
      ...imports,
      ...map(flows, '_id'),
      ...map(connections, '_id'),
    ];

    auditLogs = auditLogs.filter(log => {
      if (
        ['export', 'import', 'connection', 'flow'].includes(log.resourceType)
      ) {
        return resourceIds.includes(log._resourceId);
      }

      return true;
    });
  }

  result.logs = options.take ? auditLogs.slice(0, options.take) : auditLogs;
  result.count = result.logs.length;
  result.totalCount = auditLogs.length;

  return result;
};

// #endregion

// #region Session metadata selectors
selectors.makeOptionsFromMetadata = () => {
  const madeSelector = fromSession.makeOptionsFromMetadata();

  return (state,
    connectionId,
    commMetaPath,
    filterKey,
  ) => madeSelector(
    state?.session?.metadata,
    connectionId,
    commMetaPath,
    filterKey,
  );
};

selectors.metadataOptionsAndResources = (state, {
  connectionId,
  commMetaPath,
  filterKey,
}) => (
  selectors.optionsFromMetadata(state, {
    connectionId,
    commMetaPath,
    filterKey,
  }) || emptyObject
);

selectors.getMetadataOptions = (
  state,
  { connectionId, commMetaPath, filterKey }
) => (
  selectors.optionsFromMetadata(state, {
    connectionId,
    commMetaPath,
    filterKey,
  }) || emptyObject
);

selectors.isValidatingNetsuiteUserRoles = state => {
  const commPath = commKeyGen('/netsuite/alluserroles', 'POST');

  return fromComms.isLoading(state.comms, commPath);
};
// #endregion Session metadata selectors

selectors.commStatusByKey = (state, key) => {
  const commStatus =
    state &&
    state.comms &&
    state.comms.networkComms &&
    state.comms.networkComms[key];

  return commStatus;
};

// TODO: This all needs to be refactored, and the code that uses is too.
// The extra data points added to the results should be a different selector
// also the new selector (that fetches metadata about a token) should be for a
// SINGLE resource and then called in the iterator function of the presentation
// layer.
selectors.accessTokenList = (
  state,
  { integrationId, take, keyword, sort, sandbox }
) => {
  const tokensList = selectors.resourceList(state, {
    type: 'accesstokens',
    keyword,
    sort,
    sandbox,
  });
  const filteredTokens = tokensList.resources.filter(t => {
    if (integrationId) {
      return t._integrationId === integrationId;
    }

    return !t._integrationId;
  });
  let isEmbeddedToken;
  const tokens = filteredTokens.map(t => {
    isEmbeddedToken = !!(t._connectorId && !t.autoPurgeAt);

    const permissions = {
      displayToken: !isEmbeddedToken,
      generateToken: !isEmbeddedToken,
      revoke: !t.revoked,
      activate: !!t.revoked,
      edit: !isEmbeddedToken,
      /* deletion of connector tokens is not allowed by backend */
      delete: !t._connectorId && !!t.revoked,
    };
    const permissionReasons = {
      displayToken: isEmbeddedToken ? 'Embedded Token' : '',
      generateToken:
        'This api token is owned by a SmartConnector and cannot be regenerated.',
      edit:
        'This api token is owned by a SmartConnector and cannot be edited or deleted here.',
      delete: t._connectorId
        ? 'This api token is owned by a SmartConnector and cannot be edited or deleted here.'
        : 'To delete this api token you need to revoke it first.',
    };

    Object.keys(permissions).forEach(p => {
      if (permissions[p]) {
        delete permissionReasons[p];
      }
    });

    let fullAccess = !!t.fullAccess;

    if (!fullAccess && t._connectorId && t.autoPurgeAt) {
      if (
        (!t._connectionIds || !t._connectionIds.length) &&
        (!t._exportIds || !t._exportIds.length) &&
        (!t._importIds || !t._importIds.length)
      ) {
        fullAccess = true;
      }
    }

    return {
      ...t,
      token: t.token === PASSWORD_MASK ? '' : t.token,
      fullAccess,
      revoked: !!t.revoked,
      isEmbeddedToken,
      permissions,
      permissionReasons,
    };
  });

  tokensList.filtered -= tokensList.resources.length - tokens.length;
  tokensList.resources = tokens;

  if (typeof take !== 'number' || take < 1) {
    return tokensList;
  }

  tokensList.resources = tokensList.resources.slice(0, take);
  tokensList.count = (tokensList.resources || []).length;

  return tokensList;
};

selectors.flowJobs = (state, options = {}) => {
  const jobs = fromData.flowJobs(state?.data, options);
  const resourceMap = fromData.resourceDetailsMap(state?.data);

  return jobs.map(job => {
    if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      job.children = job.children.map(cJob => {
        const additionalChildProps = {
          name: cJob._exportId
            ? resourceMap.exports && resourceMap.exports[cJob._exportId]?.name
            : resourceMap.imports && resourceMap.imports[cJob._importId]?.name,
        };

        return { ...cJob, ...additionalChildProps };
      });
    }

    const additionalProps = {
      name:
        resourceMap.flows &&
        resourceMap.flows[job._flowId] &&
        resourceMap.flows[job._flowId].name,
    };

    if (job.doneExporting && job.numPagesGenerated > 0) {
      additionalProps.percentComplete = Math.floor(
        (job.numPagesProcessed * 100) /
          (job.numPagesGenerated *
            ((resourceMap.flows &&
              resourceMap.flows[job._flowId] &&
              resourceMap.flows[job._flowId].numImports) ||
              1))
      );
    } else {
      additionalProps.percentComplete = 0;
    }

    return { ...job, ...additionalProps };
  });
};

selectors.flowDashboardJobs = createSelector(
  (state, flowId) => selectors.latestFlowJobsList(state, flowId),
  state => fromData.resourceDetailsMap(state?.data),
  (state, flowId) => selectors.resourceData(state, 'flows', flowId).merged,
  (latestFlowJobs, resourceMap, flowObj) => {
    const dashboardSteps = [];

    latestFlowJobs?.data?.forEach(parentJob => {
      // parent job steps are special cases like waiting / cancelled jobs to show a dashboard step
      const parentJobSteps = getParentJobSteps(parentJob);

      parentJobSteps.forEach(step => dashboardSteps.push(step));
      // Show flow steps if the parent job has children
      if (parentJob.children?.length) {
        const dashboardJobSteps = getRunConsoleJobSteps(parentJob, parentJob.children, resourceMap);

        dashboardJobSteps.forEach(step => dashboardSteps.push(step));
      }
      // If the parent job is queued/in progress, show dummy steps of flows
      if ([JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(parentJob.status)) {
        const pendingChildren = getFlowResourcesYetToBeCreated(flowObj, parentJob.children);
        const pendingChildrenSteps = generateFlowSteps(pendingChildren, resourceMap);

        pendingChildrenSteps.forEach(pendingChildStep => dashboardSteps.push(pendingChildStep));
      }
    });

    return {
      status: latestFlowJobs?.status,
      data: dashboardSteps,
    };
  });

selectors.flowJob = (state, ops = {}) => {
  const jobList = selectors.flowJobs(state, ops);

  return jobList.find(j => j._id === ops?.jobId);
};

selectors.job = (state, { type, jobId, parentJobId }) => {
  const resourceMap = selectors.resourceDetailsMap(state);
  const j = fromData.job(state.data, { type, jobId, parentJobId });

  if (!j) {
    return j;
  }

  return {
    ...j,
    name: resourceMap.flows[j._flowId] && resourceMap.flows[j._flowId].name,
  };
};

selectors.flowJobConnections = () => createSelector(
  state => state?.data?.resources?.connections,
  (state, flowId) => {
    const flow = selectors.resource(state, 'flows', flowId);

    const connectionIds = selectors.getAllConnectionIdsUsedInTheFlow(state, flow, {
      ignoreBorrowedConnections: true,
    });

    return connectionIds;
  },
  (connections = [], connectionIds) => connections.filter(c => connectionIds.includes(c._id)).map(c => ({id: c._id, name: c.name}))
);

selectors.getAllConnectionIdsUsedInSelectedFlows = (state, selectedFlows) => {
  let connectionIdsToRegister = [];

  if (!selectedFlows) {
    return connectionIdsToRegister;
  }

  selectedFlows.forEach(flow => {
    connectionIdsToRegister = connectionIdsToRegister.concat(
      selectors.getAllConnectionIdsUsedInTheFlow(state, flow)
    );
  });

  return connectionIdsToRegister;
};

// returns a list of import resources for a given flow,
// identified by flowId.
selectors.flowImports = (state, id) => {
  const flow = selectors.resource(state, 'flows', id);
  const imports = selectors.resourceList(state, { type: 'imports' }).resources;

  return getImportsFromFlow(flow, imports);
};

selectors.flowMappingsImportsList = () => createSelector(
  (state, flowId) => selectors.resource(state, 'flows', flowId),
  state => state?.data?.resources?.imports,
  (state, flowId, importId) => importId,
  (flow, imports, importId) => {
    if (importId) {
      const subRecordResource = imports.find(i => i._id === importId);

      return [subRecordResource];
    }

    const flowImports = getImportsFromFlow(flow, imports);

    return flowImports.filter(i => isImportMappingAvailable(i) || isQueryBuilderSupported(i));
  }
);

// TODO: The selector below should be deprecated and the above selector
// should be used instead.
selectors.getAllPageProcessorImports = (state, pageProcessors) => {
  const imports = selectors.resourceList(state, { type: 'imports' }).resources;

  return getPageProcessorImportsFromFlow(imports, pageProcessors);
};

selectors.getImportSampleData = (state, resourceId, options = {}) => {
  const { merged: resource } = selectors.resourceData(state, 'imports', resourceId);
  const { assistant, adaptorType, sampleData, _connectorId } = resource;
  const isIntegrationApp = !!_connectorId;

  if (assistant && assistant !== 'financialforce') {
    // get assistants sample data
    return selectors.assistantPreviewData(state, resourceId);
  }
  if (adaptorType === 'NetSuiteDistributedImport') {
    // eslint-disable-next-line camelcase
    const { _connectionId: connectionId, netsuite_da = {} } = resource;
    const { recordType } = options;
    let commMetaPath;

    if (recordType) {
      /** special case of netsuite/metadata/suitescript/connections/5c88a4bb26a9676c5d706324/recordTypes/inventorydetail?parentRecordType=salesorder
       * in case of subrecord */
      commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}?parentRecordType=${netsuite_da.recordType}`;
    } else {
      commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${netsuite_da.recordType}`;
    }

    const { data, status } = selectors.metadataOptionsAndResources(state, {
      connectionId,
      commMetaPath,
      filterKey: 'suitescript-recordTypeDetail',
    });

    return { data, status };
  }
  if (adaptorType === 'SalesforceImport') {
    const { _connectionId: connectionId, salesforce } = resource;
    const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`;
    const { data, status } = selectors.metadataOptionsAndResources(state, {
      connectionId,
      commMetaPath,
      filterKey:
        salesforce.api === 'compositerecord'
          ? 'salesforce-sObjectCompositeMetadata'
          : 'salesforce-recordType',
    });

    return { data, status };
  }
  if (isIntegrationApp) {
    // handles incase of IAs
    return selectors.integrationAppImportMetadata(state, resourceId);
  }
  if (sampleData) {
    // Formats sample data into readable form
    return {
      data: processSampleData(sampleData, resource),
      status: 'received',
    };
  }

  return emptyObject;
};

selectors.getSalesforceMasterRecordTypeInfo = (state, resourceId) => {
  const { merged: resource } = selectors.resourceData(state, 'imports', resourceId);
  const { _connectionId: connectionId, salesforce } = resource;
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`;
  const { data, status } = selectors.metadataOptionsAndResources(state, {
    connectionId,
    commMetaPath,
    filterKey: 'salesforce-masterRecordTypeInfo',
  });

  return { data, status };
};

selectors.isAnyFlowConnectionOffline = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (!flow) return false;

  const connectionIds = selectors.getAllConnectionIdsUsedInTheFlow(state, flow);
  const connectionList =
    selectors.resourcesByIds(state, 'connections', connectionIds) || [];

  return connectionList.some(c => c.offline);
};

selectors.flowConnectionList = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);
  const connectionIds = selectors.getAllConnectionIdsUsedInTheFlow(state, flow);
  const connectionList = selectors.resourcesByIds(state, 'connections', connectionIds);

  return connectionList;
};

selectors.flowReferencesForResource = (state, resourceType, resourceId) => {
  const flowsState = state && state.session && state.session.flowData;
  const exports = selectors.resourceList(state, {
    type: 'exports',
  }).resources;
  const imports = selectors.resourceList(state, {
    type: 'imports',
  }).resources;

  return getFlowReferencesForResource(
    flowsState,
    exports,
    imports,
    resourceType,
    resourceId
  );
};

/*
 * Given flowId, resourceId determines whether resource is a pg/pp
 */
selectors.isPageGenerator = (state, flowId, resourceId, resourceType) => {
  // If imports , straight forward not a pg
  if (resourceType === 'imports') return false;

  // Incase of new resource (export/lookup), flow doc does not have this resource yet
  // So, get staged resource and determine export/lookup based on isLookup flag
  const { merged: resource = {} } = selectors.resourceData(
    state,
    'exports',
    resourceId
  );

  if (isNewId(resourceId)) {
    return !resource.isLookup;
  }
  // In case of webhook, by default it is page generator.
  if (resource.type === 'webhook') {
    return true;
  }

  // Search in flow doc to determine pg/pp
  const { merged: flow } = selectors.resourceData(state, 'flows', flowId, 'value');

  return isPageGeneratorResource(flow, resourceId);
};

selectors.getUsedActionsForResource = (
  state,
  resourceId,
  resourceType,
  flowNode
) => {
  const r = selectors.resource(state, resourceType, resourceId);

  if (!r) return emptyObject;

  return getUsedActionsMapForResource(r, resourceType, flowNode);
};

selectors.transferListWithMetadata = state => {
  const transfers =
    selectors.resourceList(state, {
      type: 'transfers',
    }).resources || [];

  const updatedTransfers = [...transfers];

  updatedTransfers.forEach((transfer, i) => {
    let integrations = [];

    if (transfer.ownerUser && transfer.ownerUser._id) {
      updatedTransfers[i].isInvited = true;
    }

    if (transfer.toTransfer && transfer.toTransfer.integrations) {
      transfer.toTransfer.integrations.forEach(i => {
        let { name } = i;

        if (i._id === 'none') {
          name = 'Standalone flows';
        }

        name = name || i._id;

        if (i.tag) {
          name += ` (${i.tag})`;
        }

        integrations.push(name);
      });
    }

    integrations = integrations.join('\n');
    updatedTransfers[i].integrations = integrations;
  });

  return updatedTransfers.filter(t => !t.isInvited || t.status !== 'unapproved');
};

selectors.isRestCsvMediaTypeExport = (state, resourceId) => {
  const { merged: resourceObj } = selectors.resourceData(state, 'exports', resourceId);
  const { adaptorType, _connectionId: connectionId } = resourceObj || {};

  // Returns false if it is not a rest export
  if (adaptorType !== 'RESTExport') {
    return false;
  }

  const connection = selectors.resource(state, 'connections', connectionId);

  // Check for media type 'csv' from connection object
  return connection && connection.rest && connection.rest.mediaType === 'csv';
};

selectors.isDataLoaderExport = (state, resourceId, flowId) => {
  if (isNewId(resourceId)) {
    if (!flowId) return false;
    const { merged: flowObj = {} } = selectors.resourceData(state, 'flows', flowId, 'value');

    return !!(flowObj.pageGenerators &&
              flowObj.pageGenerators[0] &&
              flowObj.pageGenerators[0].application === 'dataLoader');
  }
  const { merged: resourceObj = {} } = selectors.resourceData(
    state,
    'exports',
    resourceId,
    'value'
  );

  return resourceObj.type === 'simple';
};
/**
 * All the adaptors whose preview depends on connection
 * are disabled if their respective connections are offline
 * Any other criteria to disable preview panel can be added here
 */
selectors.isExportPreviewDisabled = (state, resourceId, resourceType) => {
  const { merged: resourceObj = {} } = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  );

  // Incase of File adaptors(ftp, s3)/As2/Rest csv where file upload is supported
  // their preview does not depend on connection, so it can be enabled
  // TODO @Raghu: Add a selector which tells whether resource is file upload supported type or not
  // As we are using this below condition multiple places
  if (
    isFileAdaptor(resourceObj) ||
    isAS2Resource(resourceObj) ||
    selectors.isRestCsvMediaTypeExport(state, resourceId)
  ) {
    return false;
  }

  // In all other cases, where preview depends on connection being online, return the same
  return selectors.isConnectionOffline(state, resourceObj._connectionId);
};

// Gives back supported stages of data flow based on resource type
selectors.getAvailableResourcePreviewStages = (
  state,
  resourceId,
  resourceType,
  flowId
) => {
  const { merged: resourceObj = {} } = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  );

  const isDataLoader = selectors.isDataLoaderExport(state, resourceId, flowId);
  const isRestCsvExport = selectors.isRestCsvMediaTypeExport(state, resourceId);

  return getAvailablePreviewStages(resourceObj, { isDataLoader, isRestCsvExport });
};

selectors.isRequestUrlAvailableForPreviewPanel = (state, resourceId, resourceType) => {
  const resourceObj = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  ).merged;
  // for rest and http
  const appType = adaptorTypeMap[resourceObj?.adaptorType];

  return ['http', 'rest'].includes(appType);
};

/*
 * Returns boolean true/false whether it is a lookup export or not based on passed flowId and resourceType
 */
selectors.isLookUpExport = (state, { flowId, resourceId, resourceType }) => {
  // If not an export , then it is not a lookup
  if (resourceType !== 'exports' || !resourceId) return false;

  // Incase of a new resource , check for isLookup flag on resource patched for new lookup exports
  // Also for existing exports ( newly created after Flow Builder feature ) have isLookup flag
  const { merged: resourceObj = {} } = selectors.resourceData(
    state,
    'exports',
    resourceId
  );

  // If exists it is a lookup
  if (resourceObj.isLookup) return true;

  // If it is an existing export with a flow context, search in pps to match this resource id
  const flow = selectors.resource(state, 'flows', flowId);
  const { pageProcessors = [] } = flow || {};

  return !!pageProcessors.find(pp => pp._exportId === resourceId);
};

/*
 * This Selector handles all Resource Type's Label in case of Stand alone / Flow Builder Context
 * Used at Resource Form's Title like 'Create/Edit Export' , at Bread Crumb level to show 'Add/Edit Export'
 */
selectors.getCustomResourceLabel = (
  state,
  { resourceType, resourceId, flowId }
) => {
  const isLookup = selectors.isLookUpExport(state, { flowId, resourceId, resourceType });
  const isDataloader = !!selectors.flowDetails(state, flowId).isSimpleImport;
  const isNewResource = isNewId(resourceId);
  const { merged: resource = {} } = selectors.resourceData(
    state,
    resourceType,
    resourceId
  );
  let resourceLabel;

  // Default resource labels based on resourceTypes handled here
  if (isLookup) {
    resourceLabel = 'Lookup';
  } else if (isDataloader && resourceType === 'pageProcessor') {
    // Incase of data loader PP 1st step , we cannot add lookups so , resourceLabel is of imports type
    resourceLabel = MODEL_PLURAL_TO_LABEL.imports;
  } else {
    resourceLabel = MODEL_PLURAL_TO_LABEL[resourceType];
  }

  // Incase of Flow context, 2nd step of PG/PP creation resource labels handled here
  // The Below resource labels override the default labels above
  if (flowId && isNewResource) {
    if (resource.resourceType === 'exportRecords') {
      resourceLabel = 'Export';
    } else if (
      ['transferFiles', 'lookupFiles'].indexOf(resource.resourceType) >= 0
    ) {
      resourceLabel = 'Transfer';
    } else if (['webhook', 'realtime'].indexOf(resource.resourceType) >= 0) {
      resourceLabel = 'Listener';
    } else if (resource.resourceType === 'importRecords') {
      resourceLabel = 'Import';
    } else if (resource.resourceType === 'lookupRecords') {
      resourceLabel = 'Lookup';
    }
  } else if (flowId) {
    if (
      ([
        'RESTExport',
        'HTTPExport',
        'NetSuiteExport',
        'SalesforceExport',
      ].indexOf(resource.adaptorType) >= 0 &&
        resource.type === 'blob') ||
      ['FTPExport', 'S3Export'].indexOf(resource.adaptorType) >= 0 ||
      ([
        'RESTImport',
        'HTTPImport',
        'NetSuiteImport',
        'SalesforceImport',
      ].indexOf(resource.adaptorType) >= 0 &&
        resource.blobKeyPath) ||
      ['FTPImport', 'S3Import'].indexOf(resource.adaptorType) >= 0
    ) {
      resourceLabel = 'Transfer';
    }
  }

  // For real time resources , we show resource label as 'listener'
  if (
    resourceType === 'exports' &&
    isRealTimeOrDistributedResource(resource, resourceType)
  ) {
    resourceLabel = 'Listener';
  }

  return resourceLabel;
};

/*
 * This selector used to differentiate drawers with/without Preview Panel
 */
selectors.isPreviewPanelAvailableForResource = (
  state,
  resourceId,
  resourceType,
  flowId
) => {
  if (resourceType !== 'exports') return false;
  const { merged: resourceObj = {} } = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  );
  const connectionObj = selectors.resource(
    state,
    'connections',
    resourceObj._connectionId
  );

  if (selectors.isDataLoaderExport(state, resourceId, flowId)) {
    return true;
  }

  return isPreviewPanelAvailable(resourceObj, resourceType, connectionObj);
};

// TODO @Raghu:  Revisit this selector once stabilized as it can be simplified
selectors.getSampleDataWrapper = createSelector(
  [
    // eslint-disable-next-line no-use-before-define
    (state, params) => selectors.getSampleDataContext(state, params),
    (state, params) => {
      if (['postMap', 'postSubmit'].includes(params.stage)) {
        return selectors.getSampleDataContext(state, { ...params, stage: 'preMap' });
      }

      return undefined;
    },
    (state, params) => {
      if (params.stage === 'postSubmit') {
        return selectors.getSampleDataContext(state, { ...params, stage: 'postMap' });
      }

      return undefined;
    },
    (state, { flowId }) => selectors.resource(state, 'flows', flowId) || emptyObject,
    (state, { flowId }) => {
      const flow = selectors.resource(state, 'flows', flowId) || emptyObject;

      return (
        selectors.resource(state, 'integrations', flow._integrationId) || emptyObject
      );
    },
    (state, { resourceId, resourceType }) =>
      selectors.resource(state, resourceType, resourceId) || emptyObject,
    (state, { resourceId, resourceType }) => {
      const res = selectors.resource(state, resourceType, resourceId) || emptyObject;

      return selectors.resource(state, 'connections', res._connectionId) || emptyObject;
    },
    (state, { stage }) => stage,
  ],
  (
    sampleData,
    preMapSampleData,
    postMapSampleData,
    flow,
    integration,
    resource,
    connection,
    stage
  ) => {
    const { status, data } = sampleData || {};
    let resourceType = 'export';

    if (
      resource &&
      resource.adaptorType &&
      resource.adaptorType.includes('Import')
    ) {
      resourceType = 'import';
    }

    if (!status) {
      return { status };
    }

    const contextFields = {};

    if (['outputFilter', 'preSavePage'].includes(stage)) {
      contextFields.pageIndex = 0;

      if (resource?.type === 'delta') {
        contextFields.lastExportDateTime = moment()
          .startOf('day')
          .add(-7, 'd')
          .toISOString();
        contextFields.currentExportDateTime = moment()
          .startOf('day')
          .add(-24, 'h')
          .toISOString();
      }
    }

    const resourceIds = {};

    if (
      [
        'preSavePage',
        'preMap',
        'postMap',
        'postSubmit',
        'postAggregate',
      ].includes(stage)
    ) {
      resourceIds[resourceType === 'import' ? '_importId' : '_exportId'] =
        resource._id;
      resourceIds._connectionId = connection._id;
      resourceIds._flowId = flow._id;
      resourceIds._integrationId = integration._id;
    }

    const settings = {
      integration: integration.settings || {},
      flow: flow.settings || {},
      [resourceType]: resource.settings || {},
      connection: connection.settings || {},
    };

    if (
      ['sampleResponse', 'transform', 'outputFilter', 'inputFilter'].includes(
        stage
      )
    ) {
      return {
        status,
        data: {
          record: data || {},
          ...resourceIds,
          ...contextFields,
          settings,
        },
      };
    }

    if (['preSavePage'].includes(stage)) {
      return {
        status,
        data: {
          data: data ? [data] : [],
          errors: [],
          ...resourceIds,
          ...contextFields,
          settings,
        },
      };
    }

    if (['preMap'].includes(stage)) {
      return {
        status,
        data: {
          data: data ? [data] : [],
          ...resourceIds,
          settings,
        },
      };
    }

    if (['postMap'].includes(stage)) {
      return {
        status,
        data: {
          preMapData: preMapSampleData.data ? [preMapSampleData.data] : [],
          postMapData: data ? [data] : [],
          ...resourceIds,
          settings,
        },
      };
    }

    if (['postSubmit'].includes(stage)) {
      return {
        status,
        data: {
          preMapData: preMapSampleData.data ? [preMapSampleData.data] : [],
          postMapData: postMapSampleData.data ? [postMapSampleData.data] : [],
          responseData: [data].map(() => ({
            statusCode: 200,
            errors: [{ code: '', message: '', source: '' }],
            ignored: false,
            id: '',
            _json: data || {},
            dataURI: '',
          })),
          ...resourceIds,
          settings,
        },
      };
    }

    if (stage === 'postAggregate') {
      return {
        status: 'received',
        data: {
          postAggregateData: {
            success: true,
            _json: {},
            code: '',
            message: '',
            source: '',
          },
          ...resourceIds,
          settings,
        },
      };
    }

    if (stage === 'postResponseMapHook') {
      return {
        status,
        data: {
          postResponseMapData: data || [],
        },
      };
    }

    // For all other stages, return basic sampleData
    return { status, data };
  }
);

/*
 * The selector returns appropriate context for the JS Processor to run
 * For now, it supports contextType: hook
 * Other context types are 'settings' and 'setup'
 */
selectors.getScriptContext = createSelector(
  [
    (state, { contextType }) => contextType,
    (state, { flowId }) => {
      const flow = selectors.resource(state, 'flows', flowId) || emptyObject;

      return flow._integrationId;
    },
  ],
  (contextType, _integrationId) => {
    if (contextType === 'hook' && _integrationId) {
      return {
        type: 'hook',
        container: 'integration',
        _integrationId,
      };
    }
  }
);

// #region suiteScript
selectors.makeSuiteScriptIAFlowSections = () => {
  const cachedIASettingsSelector = selectors.makeSuiteScriptIASettings();

  return createSelector(
    (state, id, ssLinkedConnectionId) => cachedIASettingsSelector(state?.data?.suiteScript, id, ssLinkedConnectionId),

    meta => {
      const {sections = []} = meta;

      return sections.map(sec => ({
        ...sec,
        titleId: getTitleIdFromSection(sec),
        id: sec?.id?.charAt(0)?.toLowerCase() + sec?.id?.slice(1),
      }));
    }
  );
};

selectors.makeSuiteScriptIASections = () => {
  const cachedIASettingsSelector = selectors.makeSuiteScriptIASettings();

  return createSelector(
    (state, id, ssLinkedConnectionId) => cachedIASettingsSelector(state?.data?.suiteScript, id, ssLinkedConnectionId),

    metaSections => {
      const {general, sections = [] } = metaSections;

      let selectedGeneral = general;

      if (Array.isArray(general)) {
        selectedGeneral = general.find(s => s.title === 'General');
      }

      return (selectedGeneral
        ? [{...selectedGeneral, id: 'genSettings', title: 'General'},
          ...sections] : sections).map(sec => ({
        ...sec,
        titleId: getTitleIdFromSection(sec),
        id: sec?.id?.charAt(0)?.toLowerCase() + sec?.id?.slice(1),
      }));
    }

  );
};

selectors.suiteScriptResourceStatus = (
  state,
  {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
    resourceReqMethod = 'GET',
  }
) => {
  let path = `/suitescript/connections/${ssLinkedConnectionId}/`;

  if (resourceType === 'flows') {
    path += `integrations/${integrationId}/flows`;
  } else if (resourceType === 'nextFlows') {
    path += 'flows';
  } else {
    path += `${resourceType}`;
  }

  const commKey = commKeyGen(path, resourceReqMethod);
  const method = resourceReqMethod;
  const hasData = fromData.hasSuiteScriptData(state.data, {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
  });
  const isLoading = fromComms.isLoading(state.comms, commKey);
  const retryCount = fromComms.retryCount(state.comms, commKey);
  const isReady = method !== 'GET' || (hasData && !isLoading);

  return {
    resourceType,
    hasData,
    isLoading,
    retryCount,
    method,
    isReady,
  };
};

selectors.suiteScriptResourceData = (
  state,
  { resourceType, id, ssLinkedConnectionId, integrationId, scope }
) => {
  if (!state || !resourceType || !id || !ssLinkedConnectionId) {
    return emptyObject;
  }

  const master = selectors.suiteScriptResource(state, {
    resourceType,
    id,
    ssLinkedConnectionId,
    integrationId,
  });
  const { patch, conflict } = fromSession.stagedResource(
    state.session,
    suiteScriptResourceKey({
      ssLinkedConnectionId,
      resourceType,
      resourceId: id,
    }),
    scope
  );

  if (!master && !patch) return { merged: {} };

  let merged;
  let lastChange;

  if (patch) {
    // If the patch is not deep cloned, its values are also mutated and
    // on some operations can corrupt the merged result.
    const patchResult = jsonPatch.applyPatch(
      master ? jsonPatch.deepClone(master) : {},
      jsonPatch.deepClone(patch)
    );

    merged = patchResult.newDocument;

    if (patch.length) lastChange = patch[patch.length - 1].timestamp;
  }

  const data = {
    master,
    patch,
    lastChange,
    merged: merged || master,
  };

  if (conflict) data.conflict = conflict;

  return data;
};

// TODO: deprecate this function and rely on the cached selector

selectors.suiteScriptIASettings = selectors.makeSuiteScriptIASettings();

selectors.suiteScriptFlowSettings = (state, id, ssLinkedConnectionId, section) => {
  if (!state) return emptyObject;

  const integrationResource =
  // // TODO: deprecate this function and rely on the cached selector
    selectors.suiteScriptIASettings(state?.data?.suiteScript, id, ssLinkedConnectionId) || emptyObject;
  const { sections = []} = integrationResource || {};
  let requiredFlows = [];
  const allSections = sections;

  const selectedSection =
      allSections.find(
        sec =>
          getTitleIdFromSection(sec) === section
      ) || {};

  if (!section) {
    allSections.forEach(sec => {
      requiredFlows.push(...map(sec.flows, '_id'));
    });
  } else {
    requiredFlows = map(selectedSection.flows, '_id');
  }
  const { fields, sections: subSections } = selectedSection;

  let flows = selectors.suiteScriptResourceList(state, {
    resourceType: 'flows',
    integrationId: id,
    ssLinkedConnectionId,
  });

  flows = flows
    .filter(f => requiredFlows.includes(f.flowGUID))
    .sort(
      (a, b) => requiredFlows.indexOf(a.flowGUID) - requiredFlows.indexOf(b.flowGUID)
    );

  return {
    flows,
    fields,
    sections: subSections,
  };
};

selectors.suiteScriptFlowConnectionList = (
  state,
  { ssLinkedConnectionId, flowId }
) => {
  const flow = selectors.suiteScriptResource(state, {
    resourceType: 'flows',
    id: flowId,
    ssLinkedConnectionId,
  });
  const connections = selectors.suiteScriptResourceList(state, {
    resourceType: 'connections',
    ssLinkedConnectionId,
  });
  const connectionIdsInUse = [];

  if (flow?.export._connectionId) {
    connectionIdsInUse.push(flow.export._connectionId);
  }
  if (flow?.import?._connectionId) {
    connectionIdsInUse.push(flow.import._connectionId);
  }
  if (isJavaFlow(flow)) {
    connectionIdsInUse.push('CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION');
  }

  return connections.filter(
    c => c.id !== 'ACTIVITY_STREAM' && connectionIdsInUse.includes(c.id)
  );
};

selectors.suiteScriptIntegrationConnectionList = (
  state,
  { ssLinkedConnectionId, integrationId }
) => {
  const flows = selectors.suiteScriptResourceList(state, {
    resourceType: 'flows',
    ssLinkedConnectionId,
    integrationId,
  });
  const connections = selectors.suiteScriptResourceList(state, {
    resourceType: 'connections',
    ssLinkedConnectionId,
  });
  const connectionIdsInUse = [];

  if (integrationId && flows) {
    flows.forEach(f => {
      if (f.export && f.export._connectionId) {
        connectionIdsInUse.push(f.export._connectionId);
      }
      if (f.import && f.import._connectionId) {
        connectionIdsInUse.push(f.import._connectionId);
      }
      if (isJavaFlow(f)) {
        connectionIdsInUse.push('CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION');
      }
    });
  }

  return connections.filter(
    c => c.id !== 'ACTIVITY_STREAM' && connectionIdsInUse.includes(c.id)
  );
};

selectors.suiteScriptTestConnectionCommState = (
  state,
  resourceId,
  ssLinkedConnectionId
) => {
  const status = fromComms.suiteScriptTestConnectionStatus(
    state && state.comms,
    resourceId,
    ssLinkedConnectionId
  );
  const message = fromComms.suiteScriptTestConnectionMessage(
    state && state.comms,
    resourceId,
    ssLinkedConnectionId
  );

  return {
    commState: status,
    message,
  };
};

selectors.suiteScriptJob = (
  state,
  { ssLinkedConnectionId, integrationId, jobId, jobType }
) => {
  const jobList = selectors.suiteScriptResourceList(state, {
    ssLinkedConnectionId,
    integrationId,
    resourceType: 'jobs',
  });

  return jobList.find(j => j._id === jobId && j.type === jobType);
};

// Given an errorId, gives back error doc
selectors.resourceError = (state, { flowId, resourceId, options, errorId }) => {
  const { errors = [] } = selectors.resourceErrors(state, {
    flowId,
    resourceId,
    options,
  });

  return errors.find(error => error.errorId === errorId);
};

selectors.selectedRetryIds = (state, { flowId, resourceId, options = {} }) => {
  const { errors } = selectors.resourceErrors(state, { flowId, resourceId, options });

  return errors
    .filter(({ selected, retryDataKey }) => selected && !!retryDataKey)
    .map(error => error.retryDataKey);
};

selectors.selectedErrorIds = (state, { flowId, resourceId, options = {} }) => {
  const { errors } = selectors.resourceErrors(state, { flowId, resourceId, options });

  return errors.filter(({ selected }) => selected).map(error => error.errorId);
};

selectors.isAllErrorsSelected = (
  state,
  { flowId, resourceId, filterKey, defaultFilter, isResolved }
) => {
  const errorFilter = selectors.filter(state, filterKey) || defaultFilter;
  const { errors = [] } = selectors.resourceErrors(state, {
    flowId,
    resourceId,
    options: { ...errorFilter, isResolved },
  });
  const errorIds = errors.map(error => error.errorId);

  return fromSession.isAllErrorsSelected(state && state.session, {
    flowId,
    resourceId,
    isResolved,
    errorIds,
  });
};

selectors.isAnyErrorActionInProgress = (state, { flowId, resourceId }) => {
  const isRetryInProgress =
    selectors.errorActionsContext(state, { flowId, resourceId, actionType: 'retry' })
      .status === 'requested';
  const isResolveInProgress =
    selectors.errorActionsContext(state, { flowId, resourceId, actionType: 'resolve' })
      .status === 'requested';

  return isRetryInProgress || isResolveInProgress;
};

selectors.mkflowResources = () => createSelector(
  state => state?.data?.resources?.flows,
  state => state?.data?.resources?.exports,
  state => state?.data?.resources?.imports,
  (_, flowId) => flowId,
  (flows, exports, imports, flowId) => getFlowResources(flows, exports, imports, flowId)
);

selectors.redirectUrlToResourceListingPage = (
  state,
  resourceType,
  resourceId
) => {
  if (resourceType === 'integration') {
    return getRoutePath(`/integrations/${resourceId}/flows`);
  }

  if (resourceType === 'flow') {
    const flow = selectors.resource(state, 'flows', resourceId);

    if (flow) {
      return getRoutePath(
        `integrations/${flow._integrationId || 'none'}/flows`
      );
    }
  }

  return getRoutePath(RESOURCE_TYPE_SINGULAR_TO_PLURAL[resourceType]);
};

selectors.httpAssistantSupportsMappingPreview = (state, importId) => {
  const importResource = selectors.resource(state, 'imports', importId);
  const { _integrationId, _connectionId, http } = importResource;

  if (_integrationId && http) {
    const connection = selectors.resource(state, 'connections', _connectionId);

    return (http.requestMediaType === 'xml' || connection?.http?.mediaType === 'xml');
  }

  return false;
};

selectors.mappingPreviewType = (state, importId) => {
  const importResource = selectors.resource(state, 'imports', importId);

  if (!importResource) return;
  const { adaptorType } = importResource;

  if (adaptorType === 'NetSuiteDistributedImport') {
    return 'netsuite';
  } if (adaptorType === 'SalesforceImport') {
    const masterRecordTypeInfo = selectors.getSalesforceMasterRecordTypeInfo(
      state,
      importId
    );

    if (masterRecordTypeInfo && masterRecordTypeInfo.data) {
      const { searchLayoutable } = masterRecordTypeInfo.data;

      if (searchLayoutable) {
        return 'salesforce';
      }
    }
  } else if (importResource.http) {
    const showHttpAssistant = selectors.httpAssistantSupportsMappingPreview(
      state,
      importId
    );

    if (showHttpAssistant) {
      return 'http';
    }
  }
};

selectors.rdbmsConnectionType = (state, connectionId) => {
  const connection = selectors.resource(state, 'connections', connectionId) || {};

  return connection.rdbms && connection.rdbms.type;
};

selectors.netsuiteAccountHasSuiteScriptIntegrations = (state, connectionId) => {
  const connection = selectors.resource(state, 'connections', connectionId);

  if (!(connection && connection.netsuite && connection.netsuite.account)) {
    return false;
  }

  return fromSession.netsuiteAccountHasSuiteScriptIntegrations(
    state && state.session,
    connection.netsuite.account
  );
};

selectors.canLinkSuiteScriptIntegrator = (state, connectionId) => {
  const preferences = selectors.userPreferences(state);

  if (preferences && preferences.ssConnectionIds) {
    if (preferences.ssConnectionIds.includes(connectionId)) {
      return true;
    }

    const linkedAccounts = [];
    let connection = selectors.resource(state, 'connections', connectionId);

    if (!connection?.netsuite?.account || connection._connectorId) {
      return false;
    }
    const connectionAccount = connection.netsuite.account.toUpperCase();

    preferences.ssConnectionIds.forEach(connId => {
      connection = selectors.resource(state, 'connections', connId);
      if (connection && connection.netsuite && connection.netsuite.account) {
        linkedAccounts.push(connection.netsuite.account.toUpperCase());
      }
    });
    if (linkedAccounts.includes(connectionAccount)) {
      return false;
    }
  }

  return selectors.netsuiteAccountHasSuiteScriptIntegrations(state, connectionId);
};

selectors.suiteScriptIntegratorLinkedConnectionId = (state, account) => {
  const preferences = selectors.userPreferences(state);

  if (!preferences || !preferences.ssConnectionIds || !account) {
    return;
  }

  let linkedConnectionId;
  let connection;

  preferences.ssConnectionIds.forEach(connId => {
    connection = selectors.resource(state, 'connections', connId);
    if (
      connection?.netsuite?.account?.toUpperCase() === account.toUpperCase()
    ) {
      linkedConnectionId = connId;
    }
  });

  return linkedConnectionId;
};

const emptyArr = [];

selectors.suiteScriptIntegrationAppInstallerData = (state, id) => {
  if (!state) return null;
  const installer = fromSession.suiteScriptIntegrationAppInstallerData(state.session, id);
  const modifiedSteps = produce(installer.steps || emptyArr, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });

  return {...installer, steps: modifiedSteps};
};

selectors.isSuiteScriptIntegrationAppInstallComplete = (state, id) => {
  if (!state) return null;
  let isInstallComplete = false;
  const installer = fromSession.suiteScriptIntegrationAppInstallerData(state.session, id);

  if (!installer || !installer.steps) return isInstallComplete;
  isInstallComplete =
    installer.steps.length &&
    !installer.steps.reduce((result, step) => result || !step.completed, false);

  return isInstallComplete;
};

selectors.userHasManageAccessOnSuiteScriptAccount = (state, ssLinkedConnectionId) => !!selectors.resourcePermissions(state, 'connections', ssLinkedConnectionId)?.edit;

selectors.suiteScriptFlowDetail = (state, {ssLinkedConnectionId, integrationId, flowId}) => {
  const flows = selectors.suiteScriptResourceList(state, {
    resourceType: 'flows',
    integrationId,
    ssLinkedConnectionId,
  });

  return flows && flows.find(flow => flow._id === flowId);
};

selectors.suiteScriptNetsuiteMappingSubRecord = (state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}) => {
  if (!subRecordMappingId) return emptyObject;
  const flow = selectors.suiteScriptFlowDetail(state, {
    integrationId,
    ssLinkedConnectionId,
    flowId,
  });

  if (flow?.import?.netsuite?.subRecordImports?.length) {
    let selectedSubRecord = emptyObject;
    const iterateSubRecord = subRecords => {
      if (subRecords?.length) {
        for (let i = 0; i < subRecords.length; i += 1) {
          if (subRecords[i].mappingId === subRecordMappingId) {
            selectedSubRecord = subRecords[i];

            return;
          }
          iterateSubRecord(subRecords[i]?.subRecordImports);
        }
      }
    };

    iterateSubRecord(flow.import.netsuite.subRecordImports);

    return selectedSubRecord;
  }

  return emptyObject;
};

selectors.suiteScriptImportSampleData = (state, {ssLinkedConnectionId, integrationId, flowId, options = {}}) => {
  const flow = selectors.suiteScriptFlowDetail(state, {
    ssLinkedConnectionId,
    integrationId,
    flowId,
  });

  if (!flow) { return emptyObject; }
  const { import: importConfig } = flow;
  const { type: importType, _connectionId } = importConfig;

  if (importType === 'netsuite') {
    const recordType = options.recordType || importConfig.netsuite?.recordType;
    const commMetaPath = `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;
    const { data, status } = selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'suitescript-recordTypeDetail',
    });

    return { data, status };
  }
  if (importType === 'salesforce') {
    const { sObjectType } = importConfig.salesforce;

    const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`;
    // TO check
    const { data, status } = selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'suiteScriptSalesforce-sObjectCompositeMetadata',
    });

    return { data, status };
  }

  return fromSession.suiteScriptImportSampleDataContext(state && state.session, {ssLinkedConnectionId, integrationId, flowId});
};

selectors.suiteScriptGenerates = createSelector(
  [
    (state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}) => {
      const options = {};

      if (subRecordMappingId) {
        const {recordType} = selectors.suiteScriptNetsuiteMappingSubRecord(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});

        options.recordType = recordType;
      }

      return selectors.suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId, options});
    },
    (state, {ssLinkedConnectionId, integrationId, flowId}) => {
      const flow = selectors.suiteScriptFlowDetail(state, {
        integrationId,
        ssLinkedConnectionId,
        flowId,
      });

      return flow?.import?.type;
    },
  ],
  ({ data, status }, importType) => {
    if (!data) {
      return {data, status};
    }
    const formattedFields = getFormattedGenerateData(
      data,
      importType
    );
    const generates = formattedFields.sort((a, b) => {
      const nameA = a.name ? a.name.toUpperCase() : '';
      const nameB = b.name ? b.name.toUpperCase() : '';

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0; // names must be equal
    });

    return {data: generates, status};
  }
);

selectors.suiteScriptFlowSampleData = (state, {ssLinkedConnectionId, integrationId, flowId}) => {
  const flow = selectors.suiteScriptFlowDetail(state, {
    ssLinkedConnectionId,
    integrationId,
    flowId,
  });

  if (!flow) { return emptyObject; }
  const { export: exportConfig } = flow;
  const { type: exportType, _connectionId } = exportConfig;

  if (exportConfig.netsuite && exportConfig.netsuite.type === 'realtime') {
    const {recordType} = exportConfig.netsuite.realtime;

    const commMetaPath = `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;

    const { data, status } = selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'raw',
    });
    const formattedData = status === 'received' ? getSuiteScriptNetsuiteRealTimeSampleData(data, recordType) : data;

    return { data: formattedData, status };
  }
  if (exportType === 'salesforce') {
    const { sObjectType } = exportConfig.salesforce;

    const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`;
    // TO check
    const { data, status } = selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'suiteScriptSalesforce-sObjectMetadata',
    });

    return { data, status };
  }

  return fromSession.suiteScriptFlowSampleDataContext(state && state.session, {ssLinkedConnectionId, integrationId, flowId});
};

selectors.suiteScriptExtracts = createSelector(
  [(state, {ssLinkedConnectionId, integrationId, flowId}) => selectors.suiteScriptFlowDetail(state, {ssLinkedConnectionId, integrationId, flowId}),
    (state, {ssLinkedConnectionId, integrationId, flowId}) => selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId})],
  (flow, flowData) => {
    if (!flowData) {
      return emptySet;
    }
    const {data, status} = flowData;
    let formattedFields;

    if (status === 'received') {
      formattedFields = [];
      data?.forEach(extract => {
        formattedFields.push({
          id: extract.id || extract.value,
          name: extract.name || extract.label || extract.id,
        });
        if (flow?.export?.netsuite?.type === 'restlet' && extract.type === 'select') {
          formattedFields.push({
            id: `${extract.id}.internalid`,
            name: `${extract.name} (InternalId)`,
          });
        }
      });
    }
    const sortedFields = formattedFields?.sort((a, b) => {
      const nameA = a.name ? a.name.toUpperCase() : '';
      const nameB = b.name ? b.name.toUpperCase() : '';

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0; // names must be equal
    });

    return {data: sortedFields, status};
  }

);

selectors.suiteScriptSalesforceMasterRecordTypeInfo = (state, {ssLinkedConnectionId, integrationId, flowId}) => {
  const flow = selectors.suiteScriptFlowDetail(state, {
    ssLinkedConnectionId,
    integrationId,
    flowId,
  });

  if (!flow) { return emptyObject; }
  const { import: importConfig} = flow;

  const {type: importType, _connectionId, salesforce } = importConfig;

  if (importType !== 'salesforce') {
    return emptyObject;
  }
  const {sObjectType} = salesforce;

  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`;

  return selectors.metadataOptionsAndResources(state, {
    connectionId: ssLinkedConnectionId,
    commMetaPath,
    filterKey: 'salesforce-masterRecordTypeInfo',
  });
};

/*
* Definition rules are fetched in 2 ways
* 1. In creation of an export, from FileDefinitions list based on 'definitionId' and 'format'
* 2. In Editing an existing export, from UserSupportedFileDefinitions based on userDefinitionId
* TODO @Raghu: Refactor this selector to be more clear
*/
selectors.fileDefinitionSampleData = (state, { userDefinitionId, resourceType, options }) => {
  const { resourcePath, definitionId, format } = options;
  let template;

  if (definitionId && format) {
    template = selectors.fileDefinition(state, definitionId, {
      format,
      resourceType,
    });
  } else if (userDefinitionId) {
    // selector to get that resource based on userDefId
    template = selectors.resource(state, 'filedefinitions', userDefinitionId);
  }

  if (!template) return {};
  const { sampleData, ...fileDefinitionRules } = template;
  // Stringify rules as the editor expects a string
  let rule;
  let formattedSampleData;

  if (resourceType === 'imports') {
    rule = JSON.stringify(fileDefinitionRules, null, 2);
    formattedSampleData =
        sampleData &&
        JSON.stringify(
          Array.isArray(sampleData) && sampleData.length ? sampleData[0] : {},
          null,
          2
        );
  } else {
    rule = JSON.stringify(
      {
        resourcePath: resourcePath || '',
        fileDefinition: fileDefinitionRules,
      },
      null,
      2
    );
    formattedSampleData = sampleData;
  }

  return { sampleData: formattedSampleData, rule };
};

/**
 * Supported File types : csv, json, xml, xlsx
 * Note : Incase of xlsx 'csv' stage is requested as the raw stage contains xlsx format which is not used
 * Modify this if we need xlsx content any where to show
 */
selectors.fileSampleData = (state, { resourceId, resourceType, fileType}) => {
  const stage = fileType === 'xlsx' ? 'csv' : 'rawFile';
  const { data: rawData } = selectors.getResourceSampleDataWithStatus(
    state,
    resourceId,
    stage,
  );

  if (!rawData) {
    const resourceObj = selectors.resource(state, resourceType, resourceId);

    if (resourceObj?.file?.type === fileType) {
      return resourceObj.sampleData;
    }
  }

  return rawData?.body;
};
selectors.suiteScriptFileExportSampleData = (state, { ssLinkedConnectionId, resourceType, resourceId}) => {
  // const stage = fileType === 'xlsx' ? 'csv' : 'rawFile';
  const { data: rawData } = selectors.getResourceSampleDataWithStatus(
    state,
    resourceId,
    'rawFile',
  );

  if (!rawData) {
    const resourceObj = selectors.suiteScriptResource(state, {resourceType, id: resourceId, ssLinkedConnectionId});

    if (
      resourceObj?.export?.file?.csv
    ) {
      return resourceObj.export.sampleData;
    }
  }

  return rawData?.body;
};
selectors.getSuitescriptMappingSubRecordList = createSelector([
  (state, {integrationId,
    ssLinkedConnectionId,
    flowId}) => selectors.suiteScriptFlowDetail(state, {
    integrationId,
    ssLinkedConnectionId,
    flowId,
  }),
], flow => {
  if (flow?.import?.netsuite?.subRecordImports?.length) {
    // recursively fetch subrecordMapping
    const subRecordList = [];
    const iterateSubRecord = subRecords => {
      if (subRecords?.length) {
        subRecords.forEach(_subRecordImp => {
          subRecordList.push({
            id: _subRecordImp.mappingId,
            name: `${_subRecordImp.recordType} (Subrecord)`,
          });
          iterateSubRecord(_subRecordImp?.subRecordImports);
        });
      }
    };

    iterateSubRecord(flow?.import?.netsuite?.subRecordImports);

    return [{id: '__parent', name: 'Netsuite'}, ...subRecordList];
  }

  return emptySet;
});
selectors.applicationType = (state, resourceType, id) => {
  const resourceObj = selectors.resource(state, resourceType, id);
  const stagedResourceObj = selectors.stagedResource(state, id);

  if (!resourceObj && (!stagedResourceObj || !stagedResourceObj.patch)) {
    return '';
  }

  function getStagedValue(key) {
    const result = stagedResourceObj?.patch?.find(p => p.op === 'replace' && p.path === key);

    return result?.value;
  }

  // [{}, ..., {}, {op: "replace", path: "/adaptorType", value: "HTTPExport"}, ...]
  const adaptorType = resourceType === 'connections'
    ? getStagedValue('/type') || resourceObj?.type
    : getStagedValue('/adaptorType') || resourceObj?.adaptorType;
  const assistant = getStagedValue('/assistant') || resourceObj?.assistant;

  if (adaptorType === 'WebhookExport') {
    return (
      getStagedValue('/webhook/provider') ||
      (resourceObj && resourceObj.webhook && resourceObj.webhook.provider)
    );
  }
  // For Data Loader cases, there is no image.
  if (getStagedValue('/type') === 'simple' || resourceObj?.type === 'simple') {
    return '';
  }

  if (adaptorType?.toUpperCase().startsWith('RDBMS')) {
    const connection = resourceType === 'connections' ? resourceObj : selectors.resource(
      state,
      'connections',
      getStagedValue('/_connectionId') || (resourceObj?._connectionId)
    );

    return connection && connection.rdbms && connection.rdbms.type;
  }

  return assistant || adaptorType;
};
selectors.lookupProcessorResourceType = (state, resourceId) => {
  const stagedProcessor = selectors.stagedResource(state, resourceId);

  if (!stagedProcessor || !stagedProcessor.patch) {
    // TODO: we need a better pattern for logging warnings. We need a common util method
    // which logs these warning only if the build is dev... if build is prod, these
    // console.warn/logs should not even be bundled by webpack...
    // eslint-disable-next-line
    /*
     console.warn(
      'No patch-set available to determine new Page Processor resourceType.'
    );
    */
    return;
  }

  // [{}, ..., {}, {op: "replace", path: "/adaptorType", value: "HTTPExport"}, ...]
  const adaptorType = stagedProcessor?.patch?.find(
    p => p.op === 'replace' && p.path === '/adaptorType'
  );

  // console.log(`adaptorType-${id}`, adaptorType);

  return adaptorType?.value?.includes('Export') ? 'exports' : 'imports';
};
selectors.tradingPartnerConnections = (
  state,
  connectionId,
) => {
  const connections = selectors.resourceList(state, { type: 'connections' }).resources;
  const currConnection = selectors.resource(state, 'connections', connectionId);

  return connections?.filter(c => (c.type === 'ftp' &&
      c.ftp.hostURI === currConnection.ftp.hostURI &&
      c.ftp.port === currConnection.ftp.port &&
      c.sandbox === currConnection.sandbox
  ));
};

selectors.mappingImportSampleDataSupported = (state, importId) => {
  const importResource = selectors.resource(state, 'imports', importId);
  const {adaptorType} = importResource;
  const isAssistant =
  !!importResource.assistant && importResource.assistant !== 'financialforce';

  return isAssistant || ['NetSuiteImport', 'NetSuiteDistributedImport', 'SalesforceImport'].includes(adaptorType);
};

selectors.mappingSubRecordAndJSONPath = (state, importId, subRecordMappingId) => {
  const importResource = selectors.resource(state, 'imports', importId);

  if (subRecordMappingId && ['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importResource.adaptorType)) {
    return mappingUtil.getSubRecordRecordTypeAndJsonPath(importResource, subRecordMappingId);
  }

  return emptyObject;
};
selectors.mappingGenerates = createSelector([
  (state, importId) => selectors.resource(state, 'imports', importId).adaptorType,
  (state, importId, subRecordMappingId) => {
    const opts = selectors.mappingSubRecordAndJSONPath(state, importId, subRecordMappingId);

    return selectors.getImportSampleData(state, importId, opts).data;
  },
], (adaptorType, importSampleData) => mappingUtil.getFormattedGenerateData(importSampleData, adaptorTypeMap[adaptorType]));

selectors.mappingExtracts = createSelector([
  (state, resourceId, flowId) => selectors.getSampleDataContext(state, {
    flowId,
    resourceId,
    stage: 'importMappingExtract',
    resourceType: 'imports',
  }).data,
  (state, resourceId, flowId, subRecordMappingId) => selectors.mappingSubRecordAndJSONPath(state, resourceId, subRecordMappingId),
], (flowData, subRecordObj) => {
  if (flowData) {
    const extractPaths = mappingUtil.getExtractPaths(
      flowData,
      subRecordObj
    );

    return (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
        emptySet;
  }

  return emptySet;
});

selectors.mappingExtractGenerateLabel = (state, flowId, resourceId, type) => {
  if (type === 'generate') {
    /** generating generate Label */
    const importResource = selectors.resource(state, 'imports', resourceId);
    const importConn = selectors.resource(state, 'connections', importResource._connectionId);

    return `Import field (${mappingUtil.getApplicationName(
      importResource,
      importConn
    )})`;
  }
  if (type === 'extract') {
    /** generating extract Label */
    const flow = selectors.resource(state, 'flows', flowId);

    if (flow && flow.pageGenerators && flow.pageGenerators.length && flow.pageGenerators[0]._exportId) {
      const {_exportId} = flow.pageGenerators[0];
      const exportResource = selectors.resource(state, 'exports', _exportId);
      const exportConn = selectors.resource(state, 'connections', exportResource._connectionId);

      return `Export field (${mappingUtil.getApplicationName(
        exportResource,
        exportConn
      )})`;
    }

    return 'Source record field';
  }
};
selectors.mappingHttpAssistantPreviewData = createSelector([
  state => {
    const mappingPreview = selectors.mapping(state).preview;

    return mappingPreview && mappingPreview.data;
  },
  (state, importId) => {
    const previewType = selectors.mappingPreviewType(state, importId);

    return previewType === 'http';
  },
  (state, importId) => selectors.resource(state, 'imports', importId),
  (state, importId) => {
    const importResource = selectors.resource(state, 'imports', importId);

    return selectors.resource(state, 'connections', importResource._connectionId);
  },
  (state, importId) => selectors.getImportSampleData(state, importId, {}).data,
], (previewData, isHttpPreview, importResource, importConn, importSampleData) => {
  if (!isHttpPreview) {
    return;
  }
  const model = {
    connection: importConn,
    data: [],
  };

  if (previewData) {
    model.data = previewData;
  } else if (importSampleData) {
    model.data = Array.isArray(importSampleData)
      ? importSampleData
      : [importSampleData];
  }

  return {
    rule: importResource?.http?.body[0],
    data: JSON.stringify(model),
  };
});

selectors.mappingNSRecordType = (state, importId, subRecordMappingId) => {
  const importResource = selectors.resource(state, 'imports', importId);
  const {adaptorType} = importResource;

  if (!['NetSuiteImport', 'NetSuiteDistributedImport'].includes(adaptorType)) {
    return;
  }
  if (subRecordMappingId) {
    const { recordType } = mappingUtil.getSubRecordRecordTypeAndJsonPath(
      importResource,
      subRecordMappingId
    );

    return recordType;
  }

  return importResource.netsuite_da.recordType;
};

/** returns 1st Page generator for a flow */
selectors.firstFlowPageGenerator = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (flow?.pageGenerators?.length) {
    const exportId = flow.pageGenerators[0]._exportId;

    return selectors.resource(state, 'exports', exportId);
  }

  return emptyObject;
};

selectors.sampleRuleForSQLQueryBuilder = createSelector([
  (state, { importId}) => {
    const {merged: importResource = {}} = selectors.resourceData(
      'imports',
      importId
    );

    return importResource.adaptorType;
  },
  (state, { importId}) => {
    const {merged: importResource = {}} =
      selectors.resourceData(
        'imports',
        importId
      );
    const {_connectionId} = importResource;

    return selectors.resource(state, 'connections', _connectionId);
  },
  (state, {importId, flowId}) => selectors.getSampleDataContext(state, {
    flowId,
    resourceId: importId,
    resourceType: 'imports',
    stage: 'flowInput',
  }).data,
  (state, {importId, flowId}) => selectors.getSampleDataContext(state, {
    flowId,
    resourceId: importId,
    resourceType: 'imports',
    stage: 'importMappingExtract',
  }).data,
  (state, {method}) => method,
  (state, {queryType}) => queryType,
], (adaptorType, connection, sampleData, extractFields, method, queryType) => {
  if (sampleData && extractFields) {
    const extractPaths = getJSONPaths(extractFields, null, {
      wrapSpecialChars: true,
    });

    if (adaptorType === 'MongodbImport') {
      return sqlUtil.getSampleMongoDbTemplate(
        sampleData,
        extractPaths,
        method === 'insertMany'
      );
    } if (
      adaptorType === 'DynamodbImport'
    ) {
      return sqlUtil.getSampleDynamodbTemplate(
        sampleData,
        extractPaths,
        method === 'putItem'
      );
    } if (
      adaptorType === 'RDBMSImport' && connection?.rdbms?.type === 'snowflake'
    ) {
      return sqlUtil.getSampleSnowflakeTemplate(
        sampleData,
        extractPaths,
        queryType === 'INSERT'
      );
    }

    return sqlUtil.getSampleSQLTemplate(
      sampleData,
      extractPaths,
      queryType === 'INSERT'
    );
  }
});

selectors.errorDetails = (state, params) => {
  const { flowId, resourceId, options = {} } = params;

  return selectors.getErrors(state, {
    flowId,
    resourceId,
    errorType: options.isResolved ? 'resolved' : 'open',
  });
};

selectors.makeResourceErrorsSelector = () => createSelector(
  selectors.errorDetails,
  (_1, params) => params.options,
  (errorDetails, options) => ({
    ...errorDetails,
    errors: getFilteredErrors(errorDetails.errors, options),
  })
);

selectors.resourceErrors = selectors.makeResourceErrorsSelector();

/**
 * Returns error count per category in a store for IA 1.0
 * A map of titleId and total errors on that category
 */
selectors.integrationErrorsPerSection = createSelector(
  selectors.integrationAppFlowSections,
  (state, integrationId) => selectors.errorMap(state, integrationId)?.data || emptyObject,
  state => selectors.resourceList(state, { type: 'flows' }).resources,
  (flowSections, integrationErrors, flowsList) =>
    // go through all sections and aggregate error counts of all the flows per sections against titleId
    flowSections.reduce((errorsMap, section) => {
      const { flows = [], titleId } = section;

      errorsMap[titleId] = flows.reduce((total, flow) => {
        const isFlowDisabled = !!flowsList.find(flowObj => flowObj._id === flow._id)?.disabled;

        // we consider enabled flows to show total count per section
        if (!isFlowDisabled) {
          total += (integrationErrors[flow._id] || 0);
        }

        return total;
      }, 0);

      return errorsMap;
    }, {})
);

/**
 * Returns error count per Store in an Integration for IA 1.0
 * A map of storeId and total errors on that Store
 */
selectors.integrationErrorsPerStore = (state, integrationId) => {
  const integrationAppSettings = selectors.integrationAppSettings(state, integrationId);
  const { supportsMultiStore, sections: stores = [] } = integrationAppSettings.settings || {};

  if (!supportsMultiStore) return emptyObject;

  return stores.reduce((storeErrorsMap, store) => {
    const sectionErrorsMap = selectors.integrationErrorsPerSection(state, integrationId, store.id);

    storeErrorsMap[store.id] = Object.values(sectionErrorsMap).reduce(
      (total, count) => total + count,
      0);

    return storeErrorsMap;
  }, {});
};

selectors.mkChildIntegration = () => {
  const resourceSelector = selectors.makeResourceSelector();

  return createSelector(
    (state, integrationId) => {
      const id = selectors.getChildIntegrationId(state, integrationId);

      return id && resourceSelector(state?.data?.resources, 'integrations', id);
    },
    childIntegration => childIntegration
  );
};

// #region Flow builder selectors

selectors.isFreeFlowResource = (state, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;

  const isFreeFlow = isFreeFlowResource(flow);

  return isFreeFlow;
};

selectors.isIAType = (state, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;
  const isIAType = isIntegrationApp(flow);

  return isIAType;
};

selectors.isFlowViewMode = (state, integrationId, flowId) => {
  const isIAType = selectors.isIAType(state, flowId);

  const isMonitorLevelAccess =
    selectors.isFormAMonitorLevelAccess(state, integrationId);

  return isMonitorLevelAccess || isIAType;
};

const selectorFlowDetails = selectors.mkFlowDetails();

selectors.isDataLoaderFlow = (state, flowId) => {
  const flowDetails = selectorFlowDetails(state, flowId);
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;
  const { pageGenerators = [] } = flow;

  return flowDetails.isSimpleImport ||
  (pageGenerators.length && pageGenerators[0].application === 'dataLoader');
};

selectors.shouldShowAddPageProcessor = (state, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;

  const { pageProcessors = [], pageGenerators = [] } = flow;
  const isDataLoaderFlow = selectors.isDataLoaderFlow(state, flowId);

  const showAddPageProcessor =
    !isDataLoaderFlow ||
    (pageProcessors.length === 0 &&
      pageGenerators.length &&
      pageGenerators[0]._exportId);

  return showAddPageProcessor;
};

// #endregion Flow builder selectors

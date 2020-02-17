import deepClone from 'lodash/cloneDeep';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import { uniq, some, map, keys, isEmpty } from 'lodash';
import app, * as fromApp from './app';
import data, * as fromData from './data';
import session, * as fromSession from './session';
import comms, * as fromComms from './comms';
import auth, * as fromAuth from './authentication';
import user, * as fromUser from './user';
import actionTypes from '../actions/types';
import {
  PASSWORD_MASK,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  TILE_STATUS,
  INTEGRATION_MODES,
  STANDALONE_INTEGRATION,
  ACCOUNT_IDS,
  SUITESCRIPT_CONNECTORS,
} from '../utils/constants';
import { changePasswordParams, changeEmailParams } from '../sagas/api/apiPaths';
import { getFieldById } from '../forms/utils';
import { upgradeButtonText, expiresInfo } from '../utils/license';
import commKeyGen from '../utils/commKeyGenerator';
import {
  isRealtimeExport,
  isSimpleImportFlow,
  isRunnable,
  showScheduleIcon,
} from './flowsUtil';
import {
  getUsedActionsMapForResource,
  isPageGeneratorResource,
} from '../utils/flows';
import { isValidResourceReference, isNewId } from '../utils/resource';
import { processSampleData } from '../utils/sampleData';
import {
  getAvailablePreviewStages,
  isPreviewPanelAvailable,
} from '../utils/exportPanel';
import inferErrorMessage from '../utils/inferErrorMessage';
import getRoutePath from '../utils/routePaths';
import { COMM_STATES } from './comms/networkComms';
import { getIntegrationAppUrlName } from '../utils/integrationApps';

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

// TODO: Do we really need to proxy all selectors here?
// Instead, we could only have the selectors that cross
// state subdivisions (marked GLOBAL right now)
// This is a lot of boiler plate code to maintain for the
// sole purpose of abstracting the state "shape" completely.
// It may be just fine to directly reference the primary state
// subdivisions (data, session, comms) in order to simplify the code further...

// -------------------
// Following this pattern:
// https://hackernoon.com/selector-pattern-painless-redux-state-destructuring-bfc26b72b9ae

// #region app selectors
export function bannerOpened(state) {
  return fromApp.bannerOpened(state && state.app);
}

export function drawerOpened(state) {
  return fromApp.drawerOpened(state && state.app);
}

export function reloadCount(state) {
  return fromApp.reloadCount((state && state.app) || null);
}

export function appErrored(state) {
  return fromApp.appErrored(state && state.app);
}
// #endregion app selectors

// #region PUBLIC COMMS SELECTORS
export function allLoadingOrErrored(state) {
  return fromComms.allLoadingOrErrored(state.comms);
}

export function allLoadingOrErroredWithCorrectlyInferredErroredMessage(state) {
  const resourceStatuses = allLoadingOrErrored(state);

  if (!resourceStatuses) return null;

  return resourceStatuses.map(comm => {
    const { message, ...rest } = comm;

    return { ...rest, message: inferErrorMessage(message) };
  });
}

export function isLoadingAnyResource(state) {
  return fromComms.isLoadingAnyResource(state.comms);
}

export function isAllLoadingCommsAboveThreshold(state) {
  const loadingOrErrored = allLoadingOrErrored(state);

  if (loadingOrErrored === null) return;

  return (
    loadingOrErrored.filter(
      resource =>
        resource.status === COMM_STATES.LOADING &&
        Date.now() - resource.timestamp < Number(process.env.NETWORK_THRESHOLD)
    ).length === 0
  );
}

export function commStatusPerPath(state, path, method) {
  const key = commKeyGen(path, method);

  return fromComms.commStatus(state && state.comms, key);
}

// #endregion

// #region PUBLIC SESSION SELECTORS
export function resourceFormState(state, resourceType, resourceId) {
  return fromSession.resourceFormState(
    state && state.session,
    resourceType,
    resourceId
  );
}

export function getNumEnabledFlows(state) {
  return fromSession.getNumEnabledFlows(state && state.session);
}

export function resourceFormSaveProcessTerminated(
  state,
  resourceType,
  resourceId
) {
  return fromSession.resourceFormSaveProcessTerminated(
    state && state.session,
    resourceType,
    resourceId
  );
}

export function clonePreview(state, resourceType, resourceId) {
  return fromSession.previewTemplate(
    state && state.session,
    `${resourceType}-${resourceId}`
  );
}

export function cloneData(state, resourceType, resourceId) {
  return fromSession.template(
    state && state.session,
    `${resourceType}-${resourceId}`
  );
}

export function isSetupComplete(
  state,
  { templateId, resourceType, resourceId }
) {
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
}

export function isUninstallComplete(state, { integrationId, storeId }) {
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
}

export function redirectToOnInstallationComplete(
  state,
  { resourceType = 'integrations', resourceId, templateId }
) {
  let redirectTo = 'dashboard';
  let flow;
  let flowDetails;
  let integration;
  const { createdComponents: components } = fromSession.template(
    state && state.session,
    templateId || `${resourceType}-${resourceId}`
  );

  if (!components) {
    return false;
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
        flowDetails = resource(state, 'flows', flow._id);

        if (flowDetails) {
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

  return getRoutePath(redirectTo);
}

export function previewTemplate(state, templateId) {
  return fromSession.previewTemplate(state && state.session, templateId);
}

export function isFileUploaded(state) {
  return fromSession.isFileUploaded(state && state.session);
}

export function installSetup(state, { resourceType, resourceId, templateId }) {
  return fromSession.template(
    state && state.session,
    templateId || `${resourceType}-${resourceId}`
  );
}

export function templateSetup(state, templateId) {
  return fromSession.template(state && state.session, templateId);
}

export function isAuthorized(state, connectionId) {
  return fromSession.isAuthorized(state && state.session, connectionId);
}

export function templateInstallSteps(state, templateId) {
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
}

export function cloneInstallSteps(state, resourceType, resourceId) {
  return templateInstallSteps(state, `${resourceType}-${resourceId}`);
}

export function templateConnectionMap(state, templateId) {
  return fromSession.connectionMap(state && state.session, templateId);
}

export function connectorMetadata(state, fieldName, id, _integrationId) {
  return fromSession.connectorMetadata(
    state && state.session,
    fieldName,
    id,
    _integrationId
  );
}

export function connectorFieldOptions(
  state,
  fieldName,
  id,
  _integrationId,
  defaultFieldOptions
) {
  const { data, isLoading } = connectorMetadata(
    state,
    fieldName,
    id,
    _integrationId
  );

  // should select options from either defaultOptions or the refreshed metadata options
  return {
    isLoading,
    options:
      (data &&
        data.options &&
        data.options.map(option => ({
          value: option[0],
          label: option[1],
        }))) ||
      (defaultFieldOptions && defaultFieldOptions[0].items),
  };
}

export function filter(state, name) {
  return fromSession.filter(state.session, name);
}

export function agentAccessToken(state, id) {
  return fromSession.agentAccessToken(state && state.session, id);
}

export function stackSystemToken(state, id) {
  return fromSession.stackSystemToken(state && state.session, id);
}

export function getResourceSampleDataWithStatus(state, resourceId, stage) {
  return fromSession.getResourceSampleDataWithStatus(
    state && state.session,
    resourceId,
    stage
  );
}

export function apiAccessToken(state, id) {
  return fromSession.apiAccessToken(state && state.session, id);
}

export function editor(state, id) {
  return fromSession.editor(state && state.session, id);
}

export function editorViolations(state, id) {
  return fromSession.editorViolations(state && state.session, id);
}

export function mapping(state, id) {
  return fromSession.mapping(state && state.session, id);
}

export function mappingsChanged(state, id) {
  return fromSession.mappingsChanged(state && state.session, id);
}

export function mappingSaveProcessTerminate(state, id) {
  return fromSession.mappingSaveProcessTerminate(state && state.session, id);
}

export function searchCriteria(state, id) {
  return fromSession.getSearchCriteria(state && state.session, id);
}

export function editorHelperFunctions(state) {
  return (
    (state &&
      state.session &&
      state.session.editors &&
      state.session.editors.helperFunctions) ||
    []
  );
}

export function processorRequestOptions(state, id) {
  return fromSession.processorRequestOptions(state && state.session, id);
}

export function getSampleData(
  state,
  { flowId, resourceId, resourceType, stage }
) {
  return fromSession.getSampleData(state && state.session, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });
}

export const getSampleDataWrapper = createSelector(
  [
    // eslint-disable-next-line no-use-before-define
    (state, params) => getSampleDataContext(state, params),
    (state, { flowId }) => {
      // eslint-disable-next-line no-use-before-define
      return resource(state, 'flows', flowId);
    },
    (state, { flowId }) => {
      // eslint-disable-next-line no-use-before-define
      const flow = resource(state, 'flows', flowId);

      // eslint-disable-next-line no-use-before-define
      return resource(state, 'integrations', flow._integrationId);
    },
  ],
  (sampleData, flow, integration) => {
    console.log(`hii @ ${new Date().toISOString()}`);
    const { status, data } = sampleData || {};

    if (!status) {
      return { status };
    }

    const { _CONTEXT, ...restOfSampleData } = data || {};

    return {
      status,
      data: {
        record: restOfSampleData || {},
        pageIndex: 1,
        lastExportDateTime: moment()
          .add(-7, 'd')
          .toISOString(),
        currentExportDateTime: moment()
          .add(-24, 'h')
          .toISOString(),
        settings: {
          integration: integration.settings || {},
          flow: flow.settings || {},
        },
      },
    };
  }
);

export function getSampleDataContext(
  state,
  { flowId, resourceId, resourceType, stage }
) {
  return fromSession.getSampleDataContext(state && state.session, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });
}

export function getFlowDataState(state, flowId, resourceId) {
  return fromSession.getFlowDataState(
    state && state.session,
    flowId,
    resourceId
  );
}

export function avatarUrl(state) {
  return fromUser.avatarUrl(state.user);
}

export function userProfile(state) {
  return state && state.user && state.user.profile;
}

export function developerMode(state) {
  return (
    state && state.user && state.user.profile && state.user.profile.developer
  );
}

export function userPreferences(state) {
  return fromUser.userPreferences((state && state.user) || null);
}

export function currentEnvironment(state) {
  return userPreferences(state).environment;
}

export function accountShareHeader(state, path) {
  return fromUser.accountShareHeader(state && state.user, path);
}

export const userOwnPreferences = createSelector(
  state => state.user,
  user => fromUser.userOwnPreferences(user)
);

// export function userOwnPreferences(state) {
//   return fromUser.userOwnPreferences(state && state.user);
// }

export function userProfilePreferencesProps(state) {
  const profile = userProfile(state);
  const preferences = userPreferences(state);
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
  };
}

export function userProfileEmail(state) {
  return state && state.user && state.user.profile && state.user.profile.email;
}
// #endregion

// #region AUTHENTICATION SELECTORS
export function isAuthenticated(state) {
  return !!(state && state.auth && state.auth.authenticated);
}

export function isDefaultAccountSet(state) {
  return !!(state && state.auth && state.auth.defaultAccountSet);
}

export function isAuthInitialized(state) {
  return !!(state && state.auth && state.auth.initialized);
}

export function isAuthLoading(state) {
  return state && state.auth && state.auth.commStatus === COMM_STATES.LOADING;
}

export function authenticationErrored(state) {
  return state && state.auth && state.auth.failure;
}

export function isUserLoggedOut(state) {
  return !!(state && state.auth && state.auth.loggedOut);
}

export function isDefaultAccountSetAfterAuth(state) {
  if (!isAuthLoading(state)) {
    const authenticated = isAuthenticated(state);

    if (authenticated) {
      return isDefaultAccountSet(state);
    }

    return true;
  }

  return false;
}

// This selector is used by the UI to determine
// when to show appRouting component
// For now only when the default account is set or user is logged out
// show the appRouting component
export function shouldShowAppRouting(state) {
  return isDefaultAccountSetAfterAuth(state) || isUserLoggedOut(state);
}

export function isSessionExpired(state) {
  return !!(state && state.auth && state.auth.sessionExpired);
}

export function showSessionStatus(state, date) {
  return fromAuth.showSessionStatus(state && state.auth, date);
}

export function sessionValidTimestamp(state) {
  return state && state.auth && state.auth.authTimestamp;
}
// #endregion AUTHENTICATION SELECTORS

// #region PASSWORD & EMAIL update selectors for modals
export function changePasswordSuccess(state) {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.SUCCESS;
}

export function changePasswordFailure(state) {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.ERROR;
}

export function changePasswordMsg(state) {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const message = fromComms.requestMessage(state && state.comms, commKey);

  return message || '';
}

export function changeEmailFailure(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.ERROR;
}

export function changeEmailSuccess(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === COMM_STATES.SUCCESS;
}

export function changeEmailMsg(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const message = fromComms.requestMessage(state && state.comms, commKey);

  return message || '';
}

// #endregion PASSWORD & EMAIL update selectors for modals

// #region USER SELECTORS
export function testConnectionCommState(state, resourceId) {
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
}

export function themeName(state) {
  return fromUser.appTheme((state && state.user) || null);
}

export function hasPreferences(state) {
  return !!userPreferences(state);
}

export function hasProfile(state) {
  return !!userProfile(state);
}
// #endregion

// #region PUBLIC DATA SELECTORS
export function marketplaceTemplate(state, templateId) {
  return fromData.template(state && state.data, templateId);
}

export function resource(state, resourceType, id) {
  return fromData.resource(state && state.data, resourceType, id);
}

export function resourceList(state, options = {}) {
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
    ].includes(
      /* These resources are common for both production & sandbox environments. */
      options.type
    )
  ) {
    const preferences = userPreferences(state);

    // eslint-disable-next-line no-param-reassign
    options.sandbox = preferences.environment === 'sandbox';
  }

  return fromData.resourceList(state && state.data, options);
}

export function getIAFlowSettings(state, integrationId, flowId) {
  const integration = resource(state, 'integrations', integrationId);
  const allFlows = [];

  if (!integration || !integration._connectorId) {
    // return empty object for DIY integrations.
    return emptyObject;
  }

  if (integration.settings && integration.settings.supportsMultiStore) {
    integration.settings.sections.forEach(section => {
      if (!section.sections) {
        return;
      }

      const { flows } = section.sections.reduce((a, b) => ({
        flows: [...a.flows, ...b.flows],
      }));

      allFlows.push(...(flows || []));
    });
  } else {
    const { flows } = integration.settings.sections.reduce((a, b) => ({
      flows: [...a.flows, ...b.flows],
    }));

    allFlows.push(...(flows || []));
  }

  return allFlows.find(flow => flow._id === flowId) || emptyObject;
}

export function isDeltaFlow(state, id) {
  const flow = resource(state, 'flows', id);
  const exports = resourceList(state, {
    type: 'exports',
  }).resources;

  if (!flow) return false;
  let isDeltaFlow = false;

  flow &&
    flow.pageGenerators &&
    flow.pageGenerators.forEach(pg => {
      const flowExp = exports && exports.find(e => e._id === pg._exportId);

      if (
        flowExp &&
        flowExp.type === 'delta' &&
        !(flowExp.delta && flowExp.delta.lagOffset)
      ) {
        isDeltaFlow = true;
      }
    });

  return isDeltaFlow;
}

// TODO: The object returned from this selector needs to be overhauled.
// It is shared between IA and DIY flows,
// yet its impossible to know which works for each flow type. For example,
// showMapping is an IA only field, how do we determine if a DIY flow has mapping support?
// Maybe its best to only hav common props here and remove all IA props to a separate selector.
export function flowDetails(state, id) {
  const flow = resource(state, 'flows', id);

  if (!flow) return emptyObject;

  return produce(flow, draft => {
    const exportId =
      draft.pageGenerators && draft.pageGenerators.length
        ? draft.pageGenerators[0]._exportId
        : draft._exportId;
    const pg = resource(state, 'exports', exportId);
    const allExports = resourceList(state, {
      type: 'exports',
    }).resources;

    draft.isRealtime = isRealtimeExport(pg);
    draft.isSimpleImport = isSimpleImportFlow(pg);
    draft.isRunnable = isRunnable(allExports, pg, draft);
    draft.canSchedule = showScheduleIcon(allExports, pg, draft);
    draft.isDeltaFlow = isDeltaFlow(state, id);
    const flowSettings = getIAFlowSettings(state, flow._integrationId, id);

    draft.showMapping = flowSettings.showMapping;
    draft.hasSettings = !!flowSettings.settings || !!flowSettings.sections;
    draft.showSchedule = draft._connectorId
      ? draft.canSchedule && !!flowSettings.showSchedule
      : draft.canSchedule;
    draft.showStartDateDialog = flowSettings.showStartDateDialog;
    draft.disableSlider = flowSettings.disableSlider;
    draft.showUtilityMapping = flowSettings.showUtilityMapping;
  });
}

export function flowListWithMetadata(state, options) {
  const flows = resourceList(state, options).resources || [];

  flows.forEach((f, i) => {
    const _exportId =
      f.pageGenerators && f.pageGenerators.length
        ? f.pageGenerators[0]._exportId
        : f._exportId;
    const exp = resource(state, 'exports', _exportId);
    const exports = resourceList(state, {
      type: 'exports',
    }).resources;

    if (isRealtimeExport(exp)) {
      flows[i].isRealtime = true;
    }

    if (isSimpleImportFlow(exp)) {
      flows[i].isSimpleImport = true;
    }

    if (isRunnable(exports, exp, f)) {
      flows[i].isRunnable = true;
    }

    if (showScheduleIcon(exports, exp, f)) {
      flows[i].showScheduleIcon = true;
    }
  });

  return { resources: flows };
}

/*
 * Gives all other valid flows of same Integration
 */
export function getNextDataFlows(state, flow) {
  const flows = flowListWithMetadata(state, { type: 'flows' }).resources || [];
  const { _integrationId } = flow;
  // Incase of standalone Integrations, _integrationId is undefined for flow resources
  const flowIntegrationId =
    _integrationId === STANDALONE_INTEGRATION ? undefined : _integrationId;

  // Returns all valid flows under this integration
  return flows.filter(
    f =>
      f._integrationId === flowIntegrationId &&
      f._id !== flow._id &&
      !f.isRealtime &&
      !f.isSimpleImport &&
      !f.disabled
  );
}

export function resourceListWithPermissions(state, options) {
  const list = resourceList(state, options);
  // eslint-disable-next-line no-use-before-define
  const permissions = userPermissions(state);

  list.resources = list.resources.map(r => {
    const additionalInfo = {};

    additionalInfo.permissions = deepClone(permissions);

    // For connections resource, add the status and queueSize info
    if (options.type === 'connections') {
      const status = fromSession.connectionStatus(
        state && state.session,
        r._id
      );

      additionalInfo.offline = status.offline;
      additionalInfo.queueSize = status.queueSize;
    }

    return { ...r, ...additionalInfo };
  });

  return list;
}

export function resourcesByIds(state, resourceType, resourceIds) {
  const { resources } = resourceListWithPermissions(state, {
    type: resourceType,
  });

  return resources.filter(r => resourceIds.indexOf(r._id) >= 0);
}

export function matchingConnectionList(state, connection = {}, environment) {
  if (!environment) {
    // eslint-disable-next-line no-param-reassign
    environment = currentEnvironment(state);
  }

  const { resources = [] } = resourceList(state, {
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
          return (
            this.type === 'netsuite' &&
            !this._connectorId &&
            (this.netsuite.account && this.netsuite.environment) &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
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
}

export function matchingStackList(state) {
  const { resources = [] } = resourceList(state, {
    type: 'stacks',
    filter: {
      _connectorId: { $exists: false },
    },
  });

  return resources;
}

export function filteredResourceList(
  state,
  resource,
  resourceType,
  environment
) {
  return resourceType === 'connections'
    ? matchingConnectionList(state, resource, environment)
    : matchingStackList(state);
}

export function integrationAppList(state) {
  return fromData.integrationAppList(state && state.data);
}

export function marketplaceConnectors(state, application, sandbox) {
  const licenses = fromUser.licenses(state && state.user);
  const connectors = fromData.marketplaceConnectors(
    state && state.data,
    application,
    sandbox,
    licenses
  );

  return connectors.map(c => {
    const installedIntegrationApps = resourceList(state, {
      type: 'integrations',
      sandbox,
      filter: { _connectorId: c._id },
    });

    return { ...c, installed: !!installedIntegrationApps.resources.length };
  });
}

export function marketplaceTemplates(state, application) {
  return fromData.marketplaceTemplates(state.data, application);
}

export function getAllConnectionIdsUsedInTheFlow(state, flow) {
  const exportIds = [];
  const importIds = [];
  const connectionIds = [];
  const borrowConnectionIds = [];
  const connections = resourceList(state, { type: 'connections' }).resources;
  const exports = resourceList(state, { type: 'exports' }).resources;
  const imports = resourceList(state, { type: 'imports' }).resources;

  if (!flow) {
    return connectionIds;
  }

  if (flow._exportId) {
    exportIds.push(flow._exportId);
  }

  if (flow._importId) {
    importIds.push(flow._importId);
  }

  if (flow.pageProcessors && flow.pageProcessors.length > 0) {
    flow.pageProcessors.forEach(pp => {
      if (pp._exportId) {
        exportIds.push(pp._exportId);
      }

      if (pp._importId) {
        importIds.push(pp._importId);
      }
    });
  }

  if (flow.pageGenerators && flow.pageGenerators.length > 0) {
    flow.pageGenerators.forEach(pg => {
      if (pg._exportId) {
        exportIds.push(pg._exportId);
      }

      if (pg._importId) {
        importIds.push(pg._importId);
      }
    });
  }

  const attachedExports =
    exports && exports.filter(e => exportIds.indexOf(e._id) > -1);
  const attachedImports =
    imports && imports.filter(i => importIds.indexOf(i._id) > -1);

  attachedExports.forEach(exp => {
    if (exp && exp._connectionId) {
      connectionIds.push(exp._connectionId);
    }
  });
  attachedImports.forEach(imp => {
    if (imp && imp._connectionId) {
      connectionIds.push(imp._connectionId);
    }
  });
  const attachedConnections =
    connections &&
    connections.filter(conn => connectionIds.indexOf(conn._id) > -1);

  attachedConnections.forEach(conn => {
    if (conn && conn._borrowConcurrencyFromConnectionId) {
      borrowConnectionIds.push(conn._borrowConcurrencyFromConnectionId);
    }
  });

  return uniq(connectionIds.concat(borrowConnectionIds));
}

export function getFlowsAssociatedExportFromIAMetadata(state, fieldMeta) {
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

  return resource(state, 'exports', resourceId);
}
// #begin integrationApps Region

export function integrationAppSettingsFormState(
  state,
  integrationId,
  flowId,
  sectionId
) {
  return fromSession.integrationAppSettingsFormState(
    state && state.session,
    integrationId,
    flowId,
    sectionId
  );
}

export function shouldRedirect(state, integrationId) {
  return fromSession.shouldRedirect(state && state.session, integrationId);
}

export function integrationAppAddOnState(state, integrationId) {
  return fromSession.integrationAppAddOnState(state.session, integrationId);
}

export function checkUpgradeRequested(state, licenseId) {
  return fromSession.checkUpgradeRequested(state && state.session, licenseId);
}

export function integrationConnectionList(state, integrationId) {
  const integration = resource(state, 'integrations', integrationId) || {};
  let { resources = [] } = resourceListWithPermissions(state, {
    type: 'connections',
  });

  if (integrationId && integrationId !== 'none' && !integration._connectorId) {
    const registeredConnections = integration._registeredConnectionIds;

    if (registeredConnections) {
      resources = resources.filter(c => registeredConnections.includes(c._id));
    }
  } else if (integration._connectorId) {
    resources = resources.filter(conn => conn._integrationId === integrationId);
  }

  return resources;
}

export function integrationAppResourceList(state, integrationId, storeId) {
  if (!state) return { connections: emptySet, flows: emptySet };

  const integrationResource =
    fromData.integrationAppSettings(state.data, integrationId) || {};
  const { supportsMultiStore, sections } = integrationResource.settings || {};
  const { resources: integrationConnections } = resourceListWithPermissions(
    state,
    {
      type: 'connections',
      filter: { _integrationId: integrationId },
    }
  );

  if (!supportsMultiStore || !storeId) {
    return {
      connections: integrationConnections,
      flows: resourceListWithPermissions(state, {
        type: 'flows',
        filter: { _integrationId: integrationId },
      }).resources,
    };
  }

  const flows = [];
  const connections = [];
  const selectedStore = (sections || []).find(s => s.id === storeId) || {};

  (selectedStore.sections || []).forEach(sec => {
    flows.push(...map(sec.flows, '_id'));
  });

  flows.forEach(f => {
    const flow = resource(state, 'flows', f) || {};

    connections.push(...getAllConnectionIdsUsedInTheFlow(state, flow));
  });

  return {
    connections: integrationConnections.filter(c =>
      connections.includes(c._id)
    ),
    flows,
  };
}

export function integrationAppStore(state, integrationId, storeId) {
  const integration = fromData.integrationAppSettings(
    state && state.data,
    integrationId
  );

  if (!integration || !integration.stores || !integration.stores.length) {
    return emptyObject;
  }

  return (
    integration.stores.find(store => store.value === storeId) || emptyObject
  );
}

export function integrationAppConnectionList(state, integrationId, storeId) {
  return integrationAppResourceList(state, integrationId, storeId).connections;
}

export function categoryMapping(state, integrationId, flowId) {
  return fromSession.categoryMapping(
    state && state.session,
    integrationId,
    flowId
  );
}

export function categoryMappingMetadata(state, integrationId, flowId) {
  const categoryMappingData =
    fromSession.categoryMapping(
      state && state.session,
      integrationId,
      flowId
    ) || {};
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
}

export function mappedCategories(state, integrationId, flowId) {
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
}

export function categoryMappingGenerateFields(
  state,
  integrationId,
  flowId,
  options
) {
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
}

export function categoryMappingFilters(state, integrationId, flowId) {
  return fromSession.categoryMappingFilters(
    state && state.session,
    integrationId,
    flowId
  );
}

export function mappingsForCategory(state, integrationId, flowId, filters) {
  const { sectionId } = filters;
  let mappings = emptySet;
  const { attributes = {}, mappingFilter = 'mapped' } =
    categoryMappingFilters(state, integrationId, flowId) || {};
  const recordMappings =
    fromSession.categoryMappingData(
      state && state.session,
      integrationId,
      flowId
    ) || {};
  const { fields = [] } =
    categoryMappingGenerateFields(state, integrationId, flowId, {
      sectionId,
    }) || {};

  if (recordMappings) {
    mappings = recordMappings.find(item => item.id === sectionId);
  }

  // If no filters are passed, return all mapppings
  if (!attributes || !mappingFilter) {
    return mappings;
  }

  const mappedFields = map(mappings.fieldMappings, 'generate');
  // Filter all mapped fields
  const filteredMappedFields = mappings.fieldMappings.filter(field => {
    const generateField = fields.find(f => f.id === field.generate);

    return generateField && attributes[generateField.filterType];
  });
  // Filter all generateFields with filter which are not yet mapped
  const filteredFields = fields
    .filter(
      field => attributes[field.filterType] && !mappedFields.includes(field.id)
    )
    .map(field => ({ generate: field.id, extract: '' }));
  // Combine filtered mappings and unmapped fields and generate unmapped fields
  const filteredMappings = [...filteredMappedFields, ...filteredFields].filter(
    field => {
      if (mappingFilter === 'all') return true;
      else if (mappingFilter === 'mapped') return !!field.extract;

      return !field.extract && !field.hardCodedValue;
    }
  );

  // return mappings object by overriding field mappings with filtered mappings
  return {
    ...mappings,
    fieldMappings: filteredMappings,
  };
}

export function integrationAppSettings(state, id) {
  if (!state) return null;

  return fromData.integrationAppSettings(state.data, id);
}

export function integrationAppLicense(state, id) {
  if (!state) return {};
  const integrationResource = fromData.integrationAppSettings(state.data, id);
  const { connectorEdition: edition } = integrationResource.settings || {};
  const userLicenses = fromUser.licenses(state && state.user) || [];
  const license = userLicenses.find(l => l._integrationId === id) || {};
  const upgradeRequested = checkUpgradeRequested(state, license._id);
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
  } Plan`;

  return {
    ...license,
    plan,
    expiresText,
    upgradeText,
    upgradeRequested: !!upgradeRequested,
    createdText: createdFormatted,
    showLicenseExpiringWarning: hasExpired || isExpiringSoon,
  };
}

export function integrationAppFlowSections(state, id, store) {
  if (!state) return emptySet;
  let flowSections = [];
  const integrationResource =
    fromData.integrationAppSettings(state.data, id) || emptyObject;
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
    titleId: sec.title ? sec.title.replace(/\s/g, '').replace(/\W/g, '_') : '',
  }));
}

export function integrationAppGeneralSettings(state, id, storeId) {
  if (!state) return emptyObject;
  let fields;
  let subSections;
  const integrationResource =
    fromData.integrationAppSettings(state.data, id) || emptyObject;
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

export function hasGeneralSettings(state, integrationId, storeId) {
  if (!state) return false;
  const integrationResource =
    fromData.integrationAppSettings(state.data, integrationId) || {};
  const { supportsMultiStore, general } = integrationResource.settings || {};

  if (supportsMultiStore) {
    return !!(general || []).find(s => s.id === storeId);
  } else if (Array.isArray(general)) {
    return !!general.find(s => s.title === 'General');
  }

  return !isEmpty(general);
}

export function integrationAppSectionMetadata(
  state,
  integrationId,
  section,
  storeId
) {
  if (!state) {
    return {};
  }

  const integrationResource = fromData.integrationAppSettings(
    state.data,
    integrationId
  );
  const { supportsMultiStore, sections = [] } =
    integrationResource.settings || {};
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
        sec.title &&
        sec.title.replace(/\s/g, '').replace(/\W/g, '_') === section
    ) || {};

  return selectedSection;
}

export function integrationAppFlowSettings(state, id, section, storeId) {
  if (!state) return emptyObject;
  const integrationResource =
    fromData.integrationAppSettings(state.data, id) || emptyObject;
  const {
    supportsMultiStore,
    supportsMatchRuleEngine: showMatchRuleEngine,
    sections = [],
  } = integrationResource.settings || {};
  let requiredFlows = [];
  let hasNSInternalIdLookup = false;
  let showFlowSettings = false;
  let hasDescription = false;
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
        sec.title &&
        sec.title.replace(/\s/g, '').replace(/\W/g, '_') === section
    ) || {};

  if (!section) {
    allSections.forEach(sec => {
      requiredFlows.push(...map(sec.flows, '_id'));
    });
  } else {
    requiredFlows = map(selectedSection.flows, '_id');
  }

  hasNSInternalIdLookup = some(
    selectedSection.flows,
    f => f.showNSInternalIdLookup
  );
  hasDescription = some(selectedSection.flows, f => {
    const flow = resource(state, 'flows', f._id) || {};

    return !!flow.description;
  });
  showFlowSettings = some(
    selectedSection.flows,
    f => !!f.settings || !!f.sections
  );
  const { fields, sections: subSections } = selectedSection;
  let flows = flowListWithMetadata(state, {
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
}

// This selector is used in dashboard, it shows all the flows including the flows not in sections.
// Integration App settings page should not use this selector.
export function integrationAppFlowIds(state, integrationId, storeId) {
  const allIntegrationFlows = resourceList(state, {
    type: 'flows',
    filter: { _integrationId: integrationId },
  }).resources;
  const integration = integrationAppSettings(state, integrationId);

  if (integration.stores && storeId) {
    const store = integration.stores.find(store => store.value === storeId);
    const { flows } = integrationAppFlowSettings(
      state,
      integrationId,
      null,
      storeId
    );

    if (store) {
      return map(
        allIntegrationFlows.filter(f => {
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
        }),
        '_id'
      );
    }

    return map(flows, '_id');
  }

  return map(allIntegrationFlows, '_id');
}

export function defaultStoreId(state, id, store) {
  return fromData.defaultStoreId(state && state.data, id, store);
}

export function integrationInstallSteps(state, integrationId) {
  if (!state) return null;
  const integrationInstallSteps = fromData.integrationInstallSteps(
    state.data,
    integrationId
  );
  const installStatus = fromSession.integrationAppsInstaller(
    state.session,
    integrationId
  );

  return integrationInstallSteps.map(step => {
    if (step.isCurrentStep) {
      return { ...step, ...installStatus };
    }

    return step;
  });
}

export function integrationUninstallSteps(state, integrationId) {
  const uninstallData = fromSession.uninstallData(
    state && state.session,
    integrationId
  );
  const { steps: uninstallSteps, error } = uninstallData;

  if (!uninstallSteps || !Array.isArray(uninstallSteps)) {
    return uninstallData;
  }

  const modifiedSteps = produce(uninstallSteps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });

  return { steps: modifiedSteps, error };
}

export function addNewStoreSteps(state, integrationId) {
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
}

// #end integrationApps Region

export function resourceReferences(state) {
  return fromSession.resourceReferences(state && state.session);
}

export function resourceDetailsMap(state) {
  return fromData.resourceDetailsMap(state.data);
}

export function processors(state) {
  return fromData.processors(state.data);
}

export function isAgentOnline(state, agentId) {
  return fromData.isAgentOnline(state.data, agentId);
}

export function exportNeedsRouting(state, id) {
  return fromData.exportNeedsRouting(state && state.data, id);
}

export function connectionHasAs2Routing(state, id) {
  return fromData.connectionHasAs2Routing(state && state.data, id);
}
// #endregion

// #region PUBLIC ACCOUNTS SELECTORS
export function integratorLicense(state) {
  const preferences = userPreferences(state);

  return fromUser.integratorLicense(state.user, preferences.defaultAShareId);
}

export function diyLicense(state) {
  const preferences = userPreferences(state);

  return fromUser.diyLicense(state.user, preferences.defaultAShareId);
}

export function integratorLicenseActionDetails(state) {
  let licenseActionDetails = {};
  const license = integratorLicense(state);

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
}

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

export function integratorLicenseWithMetadata(state) {
  const license = integratorLicense(state);
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
  licenseActionDetails.tierName = nameMap[licenseActionDetails.tier];
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
    licenseActionDetails.subscriptionName = '30 day Free Trial';
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
  toReturn.__upgradeRequested = licenseActionDetails.__upgradeRequested;

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
  }

  licenseActionDetails.subscriptionActions = toReturn;

  return licenseActionDetails;
}

export function accountSummary(state) {
  return fromUser.accountSummary(state.user);
}

export function userNotifications(state) {
  return fromUser.userNotifications(state.user);
}

export function hasAccounts(state) {
  return !!(state && state.user && state.user.accounts);
}

export function hasAcceptedUsers(state) {
  return !!(
    state &&
    state.user &&
    state.user.org &&
    state.user.org.users &&
    state.user.org.users.filter(a => a.accepted && !a.disabled).length > 0
  );
}

export function hasAcceptedAccounts(state) {
  return !!(
    state &&
    state.user &&
    state.user.org.accounts &&
    state.user.org.accounts.filter(
      a => a._id !== ACCOUNT_IDS.OWN && a.accepted && !a.disabled
    ).length > 0
  );
}

export function isValidSharedAccountId(state, _id) {
  return !!(
    state &&
    state.user &&
    state.user.org.accounts &&
    state.user.org.accounts.filter(
      a =>
        a.accepted && !a.disabled && a._id === _id && a._id !== ACCOUNT_IDS.OWN
    ).length > 0
  );
}

export function getOneValidSharedAccountId(state) {
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
}

export function userAccessLevel(state) {
  return fromUser.accessLevel(state.user);
}

export function userPermissions(state) {
  return fromUser.permissions(state.user);
}

const parentResourceToLookUpTo = {
  flows: 'integrations',
};
const getParentsResourceId = (state, resourceType, resourceId) => {
  if (!resourceType) return null;

  const parentResourceType = parentResourceToLookUpTo[resourceType];

  if (!parentResourceType) return null;

  if (parentResourceType === 'integrations') {
    const { _integrationId } = resource(state, resourceType, resourceId) || {};

    return _integrationId;
  }

  return null;
};

export const getResourceEditUrl = (state, resourceType, resourceId) => {
  if (resourceType === 'flows') {
    const integrationId = getParentsResourceId(state, resourceType, resourceId);
    const { _connectorId, name } =
      resource(state, resourceType, resourceId) || {};

    // if _connectorId its an integrationApp
    if (_connectorId) {
      return getRoutePath(
        `/integrationapps/${getIntegrationAppUrlName(
          name
        )}/${integrationId}/flowBuilder/${resourceId}`
      );
    }

    return getRoutePath(
      `/integrations/${integrationId}/flowBuilder/${resourceId}`
    );
  }

  return getRoutePath(`${resourceType}/edit/${resourceType}/${resourceId}`);
};

export function resourcePermissions(state, resourceType, resourceId) {
  const permissions = userPermissions(state);

  if (resourceType === 'integrations') {
    if (
      [
        USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      ].includes(permissions.accessLevel)
    ) {
      return permissions.integrations.all;
    }

    return permissions.integrations[resourceId] || {};
  }

  return {};
}

export function isFormAMonitorLevelAccess(state, integrationId) {
  const { accessLevel } = userPermissions(state);

  // if all forms is monitor level
  if (accessLevel === 'monitor') return true;

  // check integration level is monitor level
  const { accessLevel: accessLevelIntegration } = resourcePermissions(
    state,
    'integrations',
    integrationId
  );

  if (accessLevelIntegration === 'monitor') return true;

  return false;
}

export function publishedConnectors(state) {
  const ioConnectors = resourceList(state, {
    type: 'published',
  }).resources;

  return ioConnectors.concat(SUITESCRIPT_CONNECTORS);
}

export function userAccessLevelOnConnection(state, connectionId) {
  const permissions = userPermissions(state);
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
    const ioIntegrations = resourceList(state, {
      type: 'integrations',
    }).resources;
    const ioIntegrationsWithConnectionRegistered = ioIntegrations.filter(
      i =>
        i._registeredConnectionIds &&
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
}

export function availableConnectionsToRegister(state, integrationId) {
  if (!state) {
    return [];
  }

  const connList = resourceList(state, { type: 'connections' });
  const allConnections = connList && connList.resources;
  const integration = resource(state, 'integrations', integrationId);
  const registeredConnections =
    (integration && integration._registeredConnectionIds) || [];
  let availableConnectionsToRegister = allConnections.filter(
    conn => registeredConnections.indexOf(conn._id) === -1
  );

  availableConnectionsToRegister = availableConnectionsToRegister.filter(
    conn => {
      const accessLevel = userAccessLevelOnConnection(state, conn._id);

      return accessLevel === 'manage' || accessLevel === 'owner';
    }
  );

  return availableConnectionsToRegister;
}

export function suiteScriptLinkedConnections(state) {
  const preferences = userPreferences(state);
  const connections = resourceList(state, {
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
      accessLevel = userAccessLevelOnConnection(state, connectionId);

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
}

export function suiteScriptIntegrations(state, connection) {
  let ssIntegrations = [];

  if (!connection.permissions || !connection.permissions.accessLevel) {
    return ssIntegrations;
  }

  ssIntegrations = fromData.suiteScriptIntegrations(state.data, connection._id);

  ssIntegrations = ssIntegrations.map(i => ({
    ...i,
    permissions: {
      accessLevel: connection.permissions.accessLevel,
      connections: {
        edit: [
          USER_ACCESS_LEVELS.ACCOUNT_OWNER,
          INTEGRATION_ACCESS_LEVELS.MANAGE,
        ].includes(connection.permissions.accessLevel),
      },
    },
  }));

  return ssIntegrations;
}

export function suiteScriptTiles(state, connection) {
  let tiles = fromData.suiteScriptTiles(state.data, connection._id);

  if (tiles.length === 0) {
    return tiles;
  }

  const integrations = suiteScriptIntegrations(state, connection);
  const hasConnectorTiles = tiles.filter(t => t._connectorId).length;
  let published;

  if (hasConnectorTiles) {
    published = publishedConnectors(state);
  }

  let integration;
  let status;
  let connector;
  let tile;

  tiles = tiles.map(t => {
    integration = integrations.find(i => i._id === t._integrationId) || {};

    if (t._connectorId && integration.mode !== INTEGRATION_MODES.SETTINGS) {
      status = TILE_STATUS.IS_PENDING_SETUP;
    } else if (t.offlineConnections && t.offlineConnections.length > 0) {
      status = TILE_STATUS.HAS_OFFLINE_CONNECTIONS;
    } else if (t.numError && t.numError > 0) {
      status = TILE_STATUS.HAS_ERRORS;
    } else {
      status = TILE_STATUS.SUCCESS;
    }

    tile = {
      ...t,
      status,
      integration: {
        permissions: integration.permissions,
      },
      tag: connection.netsuite.account,
    };

    if (t._connectorId) {
      connector = published.find(i => i._id === t._connectorId);
      tile.connector = {
        owner: connector.user.company || connector.user.name,
        applications: connector.applications || [],
      };
    }

    return tile;
  });

  return tiles;
}

export function suiteScriptLinkedTiles(state) {
  const linkedConnections = suiteScriptLinkedConnections(state);
  let tiles = [];

  linkedConnections.forEach(connection => {
    tiles = tiles.concat(suiteScriptTiles(state, connection));
  });

  return tiles;
}

export function tiles(state) {
  const tiles = resourceList(state, {
    type: 'tiles',
  }).resources;
  let integrations = [];

  if (tiles.length > 0) {
    integrations = resourceList(state, {
      type: 'integrations',
    }).resources;
  }

  let published;
  const hasConnectorTiles = tiles.filter(t => t._connectorId);

  if (hasConnectorTiles) {
    published = publishedConnectors(state);
  }

  const permissions = userPermissions(state);
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
        accessLevel: (permissions.integrations[i._id] || {}).accessLevel,
        connections: {
          edit:
            permissions.integrations[i._id] &&
            permissions.integrations[i._id].connections.edit,
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
      t._connectorId &&
      integration.mode !== INTEGRATION_MODES.SETTINGS
    ) {
      status = TILE_STATUS.IS_PENDING_SETUP;
    } else if (t.offlineConnections && t.offlineConnections.length > 0) {
      status = TILE_STATUS.HAS_OFFLINE_CONNECTIONS;
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
}
// #endregion

// #region PUBLIC GLOBAL SELECTORS
export function isProfileDataReady(state) {
  const commKey = commKeyGen('/profile', 'GET');

  return !!(
    state &&
    hasProfile(state) &&
    !fromComms.isLoading(state.comms, commKey)
  );
}

export function isProfileLoading(state) {
  const commKey = commKeyGen('/profile', 'GET');

  return !!(state && fromComms.isLoading(state.comms, commKey));
}

export function isDataReady(state, resource) {
  return (
    fromData.hasData(state.data, resource) &&
    !fromComms.isLoading(state.comms, resource)
  );
}

// the keys for the comm's reducers require a forward slash before
// the resource name where as the keys for the data reducer don't
export function resourceStatus(
  state,
  origResourceType,
  resourceReqMethod = 'GET'
) {
  let resourceType;

  if (origResourceType && origResourceType.startsWith('/'))
    resourceType = origResourceType;
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
}

export function resourceData(state, resourceType, id, scope) {
  if (!state || !resourceType || !id) return {};
  let type = resourceType;

  if (resourceType.indexOf('/licenses') >= 0) {
    type = 'connectorLicenses';
  }

  // For accesstokens and connections within an integration
  if (resourceType.indexOf('integrations/') >= 0) {
    type = resourceType.split('/').pop();
  }

  const master = resource(state, type, id);
  const { patch, conflict } = fromSession.stagedResource(
    state.session,
    id,
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
}

export function resourceFormField(state, resourceType, resourceId, id) {
  const data = resourceData(state, resourceType, resourceId);

  if (!data || !data.merged) return;

  const { merged } = data;
  const meta = merged.customForm && merged.customForm.form;

  if (!meta) return;

  const field = getFieldById({ meta, id });

  if (!field) return;

  return field;
}

export function orgUsers(state) {
  return fromUser.usersList(state.user);
}

export function integrationUsersForOwner(state, integrationId) {
  return fromUser.integrationUsers(state.user, integrationId);
}

export function integrationResources(state, _integrationId, storeId) {
  const diyFlows = resourceList(state, {
    type: 'flows',
    filter: {
      $where() {
        if (!_integrationId || ['none', 'none-sb'].includes(_integrationId)) {
          return !this._integrationId;
        }

        return this._integrationId === _integrationId;
      },
    },
  }).resources;
  const { _registeredConnectionIds = [], _connectorId } =
    resource(state, 'integrations', _integrationId) || {};
  const diyConnections = resourceList(state, {
    type: 'connections',
    filter: {
      _id: id =>
        _registeredConnectionIds.includes(id) ||
        ['none', 'none-sb'].includes(_integrationId),
    },
  }).resources;
  const notifications = resourceList(state, { type: 'notifications' })
    .resources;
  const connections = _connectorId
    ? integrationAppConnectionList(state, _integrationId, storeId)
    : diyConnections;
  let flows = _connectorId
    ? integrationAppResourceList(state, _integrationId, storeId).flows
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

  if (_integrationId && !['none', 'none-sb'].includes(_integrationId)) {
    flows = [{ _id: _integrationId, name: '---All Flows---' }, ...flows];

    if (allFlowsSelected) flowValues = [_integrationId, ...flows];
  }

  return {
    connections,
    flows,
    connectionValues,
    flowValues,
  };
}

export function integrationUsers(state, integrationId) {
  return fromData.integrationUsers(state.data, integrationId);
}

export function accountOwner(state) {
  return fromUser.accountOwner(state.user);
}

export function auditLogs(state, resourceType, resourceId, filters) {
  return fromData.auditLogs(state.data, resourceType, resourceId, filters);
}

export function affectedResourcesAndUsersFromAuditLogs(
  state,
  resourceType,
  resourceId
) {
  return fromData.affectedResourcesAndUsersFromAuditLogs(
    state.data,
    resourceType,
    resourceId
  );
}
// #endregion

// #region Session metadata selectors

export function netsuiteUserRoles(
  state,
  connectionId,
  netsuiteResourceType,
  env,
  acc
) {
  return fromSession.netsuiteUserRoles(
    state && state.session,
    connectionId,
    netsuiteResourceType,
    env,
    acc
  );
}

export function stagedResource(state, id, scope) {
  return fromSession.stagedResource(state && state.session, id, scope);
}

export function optionsFromMetadata({
  state,
  connectionId,
  commMetaPath,
  filterKey,
}) {
  return fromSession.optionsFromMetadata({
    state: state && state.session,
    connectionId,
    commMetaPath,
    filterKey,
  });
}

export function optionsMapFromMetadata(
  state,
  connectionId,
  applicationType,
  recordType,
  selectField,
  optionsMap
) {
  return fromSession.optionsMapFromMetadata(
    state && state.session,
    connectionId,
    applicationType,
    recordType,
    selectField,
    optionsMap
  );
}

export const getPreBuiltFileDefinitions = (state, format) =>
  fromData.getPreBuiltFileDefinitions(state && state.data, format);

export const getFileDefinition = (state, definitionId, options) =>
  fromData.getFileDefinition(state && state.data, definitionId, options);

export function metadataOptionsAndResources({
  state,
  connectionId,
  commMetaPath,
  filterKey,
}) {
  return (
    optionsFromMetadata({
      state,
      connectionId,
      commMetaPath,
      filterKey,
    }) || {}
  );
}

/*
 * TODO: @Raghu - Should be removed and use above selector
 * Function Definition needs to be changed to 
 * metadataOptionsAndResources(
    state,
    { 
      connectionId,
      commMetaPath,
      filterKey,
  }) to support yield select
  * Change needs to be done all the places where it is getting called
 */
export function getMetadataOptions(
  state,
  { connectionId, commMetaPath, filterKey }
) {
  return (
    optionsFromMetadata({
      state,
      connectionId,
      commMetaPath,
      filterKey,
    }) || {}
  );
}

export function isValidatingNetsuiteUserRoles(state) {
  const commPath = commKeyGen('/netsuite/alluserroles', 'POST');

  return fromComms.isLoading(state.comms, commPath);
}

export function createdResourceId(state, tempId) {
  return fromSession.createdResourceId(state && state.session, tempId);
}

export function integratorLicenseActionMessage(state) {
  return fromSession.integratorLicenseActionMessage(state && state.session);
}

// #endregion Session metadata selectors

// #region Session token selectors

export function connectionTokens(state, resourceId) {
  return fromSession.connectionTokens(state && state.session, resourceId);
}

export function tokenRequestLoading(state, resourceId) {
  return fromSession.tokenRequestLoading(state && state.session, resourceId);
}

// #endregion

export function commStatusByKey(state, key) {
  const commStatus =
    state &&
    state.comms &&
    state.comms.networkComms &&
    state.comms.networkComms[key];

  return commStatus;
}

// TODO: This all needs to be refactored, and the code that uses is too.
// The extra data points added to the results should be a different selector
// also the new selector (that fetches metadata about a token) should be for a
// SINGLE resource and then called in the iterator function of the presentation
// layer.
export function accessTokenList(
  state,
  { integrationId, take, keyword, sort, sandbox }
) {
  const tokensList = resourceList(state, {
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
}

export function flowJobsPagingDetails(state) {
  return fromData.flowJobsPagingDetails(state.data);
}

export function flowJobs(state) {
  const jobs = fromData.flowJobs(state.data);
  const resourceMap = resourceDetailsMap(state);

  return jobs.map(job => {
    if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      job.children = job.children.map(cJob => {
        const additionalChildProps = {
          name: cJob._exportId
            ? resourceMap.exports[cJob._exportId].name
            : resourceMap.imports[cJob._importId].name,
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
}

export function flowJob(state, { jobId }) {
  const jobList = flowJobs(state);

  return jobList.find(j => j._id === jobId);
}

export function inProgressJobIds(state) {
  return fromData.inProgressJobIds(state.data);
}

export function job(state, { type, jobId, parentJobId }) {
  const resourceMap = resourceDetailsMap(state);
  const j = fromData.job(state.data, { type, jobId, parentJobId });

  if (!j) {
    return j;
  }

  return {
    ...j,
    name: resourceMap.flows[j._flowId] && resourceMap.flows[j._flowId].name,
  };
}

export function isBulkRetryInProgress(state) {
  return fromData.isBulkRetryInProgress(state.data);
}

export function jobErrors(state, jobId) {
  return fromData.jobErrors(state.data, jobId);
}

export function jobErrorRetryObject(state, retryId) {
  return fromData.jobErrorRetryObject(state.data, retryId);
}

export function assistantData(state, { adaptorType, assistant }) {
  return fromSession.assistantData(state && state.session, {
    adaptorType,
    assistant,
  });
}

export function assistantPreviewData(state, resourceId) {
  return fromSession.assistantPreviewData(state && state.session, resourceId);
}

export function getAllConnectionIdsUsedInSelectedFlows(state, selectedFlows) {
  let connectionIdsToRegister = [];

  if (!selectedFlows) {
    return connectionIdsToRegister;
  }

  selectedFlows.forEach(flow => {
    connectionIdsToRegister = connectionIdsToRegister.concat(
      getAllConnectionIdsUsedInTheFlow(state, flow)
    );
  });

  return connectionIdsToRegister;
}

const emptyList = [];

// returns a list of import resources for a given flow,
// identified by flowId.
export function flowImports(state, id) {
  const importIds = [];
  const flow = resource(state, 'flows', id);

  if (!flow) return emptyList;

  if (flow._importId) {
    importIds.push(flow._importId);
  } else if (flow.pageProcessors && flow.pageProcessors.length) {
    flow.pageProcessors.forEach(p => {
      if (p._importId) {
        importIds.push(p._importId);
      }
    });
  }

  // wherever possible, to prevent re-renders in components using this
  // selector, return a static pointer.
  if (importIds.length === 0) return emptyList;

  const imports = resourceList(state, { type: 'imports' }).resources;

  // possibly imports are not loaded in the state yet?
  if (!imports || imports.length === 0) return emptyList;

  return imports.filter(i => importIds.indexOf(i._id) > -1);
}

// TODO: The selector below should be deprecated and the above selector
// should be used instead.
export function getAllPageProcessorImports(state, pageProcessors) {
  let ppImports = [];
  const pageProcessorIds = [];
  const imports = resourceList(state, { type: 'imports' }).resources;

  if (!pageProcessors) {
    return imports;
  }

  pageProcessors.forEach(pageProcessor => {
    if (pageProcessor && pageProcessor._importId) {
      pageProcessorIds.push(pageProcessor._importId);
    }
  });
  ppImports =
    imports && imports.filter(i => pageProcessorIds.indexOf(i._id) > -1);

  return ppImports;
}

export function getImportSampleData(state, resourceId) {
  const { merged: resource } = resourceData(state, 'imports', resourceId);
  const { assistant, adaptorType, sampleData } = resource;

  if (assistant) {
    // get assistants sample data
    return assistantPreviewData(state, resourceId);
  } else if (sampleData) {
    // Formats sample data into readable form
    return {
      data: processSampleData(sampleData, resource),
      status: 'received',
    };
  } else if (adaptorType === 'NetSuiteDistributedImport') {
    // eslint-disable-next-line camelcase
    const { _connectionId: connectionId, netsuite_da = {} } = resource;
    const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${netsuite_da.recordType}`;
    const { data, status } = metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey: 'suitescript-recordTypeDetail',
    });

    return { data, status };
  } else if (adaptorType === 'SalesforceImport') {
    const { _connectionId: connectionId, salesforce } = resource;
    const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`;
    const { data, status } = metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey:
        salesforce.api === 'compositerecord'
          ? 'salesforce-sObjectCompositeMetadata'
          : 'salesforce-recordType',
    });

    return { data, status };
  }

  return emptyObject;
}

export function getSalesforceMasterRecordTypeInfo(state, resourceId) {
  const { merged: resource } = resourceData(state, 'imports', resourceId);
  const { _connectionId: connectionId, salesforce } = resource;
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`;
  const { data, status } = metadataOptionsAndResources({
    state,
    connectionId,
    commMetaPath,
    filterKey: 'salesforce-masterRecordTypeInfo',
  });

  return { data, status };
}

export function isAnyFlowConnectionOffline(state, flowId) {
  const flow = resource(state, 'flows', flowId);

  if (!flow) return false;

  const connectionIds = getAllConnectionIdsUsedInTheFlow(state, flow);
  const connectionList =
    resourcesByIds(state, 'connections', connectionIds) || [];

  return connectionList.some(c => c.offline);
}

export function flowConnectionList(state, flow) {
  const connectionIds = getAllConnectionIdsUsedInTheFlow(state, flow);
  const connectionList = resourcesByIds(state, 'connections', connectionIds);

  return connectionList;
}

export function getFlowReferencesForResource(state, resourceId, resourceType) {
  const flowsState = state && state.session && state.session.flowData;
  const existingFlows = keys(flowsState);
  const flowRefs = [];

  existingFlows.forEach(flowId => {
    const { pageGenerators = [], pageProcessors = [] } = flowsState[flowId];
    let [pgIndex, ppIndex] = [0, 0];

    while (pgIndex < pageGenerators.length) {
      const pg = pageGenerators[pgIndex];
      const pgResource = resource(state, 'exports', pg._exportId);

      if (
        isValidResourceReference(
          pgResource,
          pg._exportId,
          resourceType,
          resourceId
        )
      ) {
        flowRefs.push({ flowId, resourceId: pg._exportId });

        return;
      }

      pgIndex += 1;
    }

    while (ppIndex < pageProcessors.length) {
      const pp = pageProcessors[ppIndex];
      const ppId = pp._exportId || pp._importId;
      const ppResourceType = pp._exportId ? 'exports' : 'imports';
      const ppResource = resource(state, ppResourceType, ppId);

      if (
        isValidResourceReference(ppResource, ppId, resourceType, resourceId)
      ) {
        flowRefs.push({ flowId, resourceId: ppId });

        return;
      }

      ppIndex += 1;
    }
  });

  return flowRefs;
}

/*
 * Given flowId, resourceId determines whether resource is a pg/pp
 */
export function isPageGenerator(state, flowId, resourceId, resourceType) {
  // If imports , straight forward not a pg
  if (resourceType === 'imports') return false;

  // Incase of new resource (export/lookup), flow doc does not have this resource yet
  // So, get staged resource and determine export/lookup based on isLookup flag
  if (isNewId(resourceId)) {
    const { merged: resource = {} } = resourceData(
      state,
      'exports',
      resourceId
    );

    return !resource.isLookup;
  }

  // Search in flow doc to determine pg/pp
  const { merged: flow } = resourceData(state, 'flows', flowId, 'value');

  return isPageGeneratorResource(flow, resourceId);
}

export function getUsedActionsForResource(
  state,
  resourceId,
  resourceType,
  flowNode
) {
  const r = resource(state, resourceType, resourceId);

  if (!r) return emptyObject;

  return getUsedActionsMapForResource(r, resourceType, flowNode);
}

export function debugLogs(state) {
  return fromSession.debugLogs(state && state.session);
}

export function connectionStatus(state, id) {
  return fromSession.connectionStatus(state && state.session, id);
}

export function getLastExportDateTime(state, flowId) {
  return fromSession.getLastExportDateTime(state && state.session, flowId);
}

export function resourceNamesByIds(state, type) {
  const { resources } = resourceList(state, { type });
  const resourceIdNameMap = {};

  resources.forEach(r => (resourceIdNameMap[r._id] = r.name || r._id));

  return resourceIdNameMap;
}

export function getTransferPreviewData(state) {
  return fromSession.getTransferPreviewData(state && state.session);
}

export function transferListWithMetadata(state) {
  const transfers =
    resourceList(state, {
      type: 'transfers',
    }).resources || [];
  const preferences = userProfilePreferencesProps(state);

  transfers.forEach((transfer, i) => {
    let fromUser = '';
    let toUser = '';
    let integrations = [];

    if (transfer.transferToUser && transfer.transferToUser._id) {
      transfers[i].ownerUser = {
        _id: preferences._id,
        email: preferences.email,
        name: 'Me',
      };
    } else if (transfer.ownerUser && transfer.ownerUser._id) {
      transfers[i].transferToUser = {
        _id: preferences._id,
        email: preferences.email,
        name: 'Me',
      };
      transfers[i].isInvited = true;
    }

    if (transfers[i].ownerUser && transfers[i].ownerUser.name) {
      fromUser = transfers[i].ownerUser.name;
    }

    if (
      transfers[i].isInvited &&
      transfers[i].ownerUser &&
      transfers[i].ownerUser.email
    ) {
      fromUser = transfers[i].ownerUser.email;
    }

    if (transfers[i].transferToUser && transfers[i].transferToUser.name) {
      toUser = transfers[i].transferToUser.name;
    }

    if (
      !transfers[i].isInvited &&
      transfers[i].transferToUser &&
      transfers[i].transferToUser.email
    ) {
      toUser = transfers[i].transferToUser.email;
    }

    if (transfer.toTransfer && transfer.toTransfer.integrations) {
      transfer.toTransfer.integrations.forEach(i => {
        let { name } = i;

        if (i._id === 'none') {
          name = 'Standalone Flows';
        }

        name = name || i._id;

        if (i.tag) {
          name += ` (${i.tag})`;
        }

        integrations.push(name);
      });
    }

    integrations = integrations.join('\n');
    transfers[i].fromUser = fromUser;
    transfers[i].toUser = toUser;
    transfers[i].integrations = integrations;
  });

  return { resources: transfers };
}

// Gives back supported stages of data flow based on resource type
export function getAvailableResourcePreviewStages(
  state,
  resourceId,
  resourceType
) {
  const { merged: resourceObj } = resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  );

  return getAvailablePreviewStages(resourceObj);
}

/*
 * Returns boolean true/false whether it is a lookup export or not based on passed flowId and resourceType
 */
export function isLookUpExport(state, { flowId, resourceId, resourceType }) {
  // If not an export , then it is not a lookup
  if (resourceType !== 'exports' || !resourceId) return false;

  // Incase of a new resource , check for isLookup flag on resource patched for new lookup exports
  // Also for existing exports ( newly created after Flow Builder feature ) have isLookup flag
  const { merged: resourceObj = {} } = resourceData(
    state,
    'exports',
    resourceId
  );

  // If exists it is a lookup
  if (resourceObj.isLookup) return true;

  // If it is an existing export with a flow context, search in pps to match this resource id
  const flow = resource(state, 'flows', flowId);
  const { pageProcessors = [] } = flow || {};

  return !!pageProcessors.find(pp => pp._exportId === resourceId);
}

/*
 * This selector used to differentiate drawers with/without Preview Panel
 */
export function isPreviewPanelAvailableForResource(
  state,
  resourceId,
  resourceType,
  flowId
) {
  const { merged: resourceObj = {} } = resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  );
  const connectionObj = resource(
    state,
    'connections',
    resourceObj._connectionId
  );

  // Preview panel is not shown for lookups
  if (
    resourceObj.isLookup ||
    isLookUpExport(state, { resourceId, flowId, resourceType })
  ) {
    return false;
  }

  return isPreviewPanelAvailable(resourceObj, resourceType, connectionObj);
}

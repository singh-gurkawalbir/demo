/* eslint-disable no-param-reassign */
import uniqBy from 'lodash/uniqBy';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import { map, isEmpty, uniq } from 'lodash';
import app, { selectors as fromApp } from './app';
import data, { selectors as fromData } from './data';
import { selectors as fromResources } from './data/resources';
import { selectors as fromMarketPlace } from './data/marketPlace';
import session, { selectors as fromSession } from './session';
import comms, { selectors as fromComms } from './comms';
import { selectors as fromNetworkComms } from './comms/networkComms';
import auth, { selectors as fromAuth } from './authentication';
import user, { selectors as fromUser } from './user';
import actionTypes from '../actions/types';
import {
  isSimpleImportFlow,
  getUsedActionsMapForResource,
  isPageGeneratorResource,
  getImportsFromFlow,
  getPageProcessorImportsFromFlow,
  getAllConnectionIdsUsedInTheFlow,
  getFlowListWithMetadata,
  getNextDataFlows,
  getIAFlowSettings,
  getIAResources,
  getFlowDetails,
  getFlowResources,
  isImportMappingAvailable,
  getFlowReferencesForResource,
  isFreeFlowResource,
  isIntegrationApp,
  flowAllowsScheduling,
  getFlowType,
  flowSupportsSettings,
  isRealtimeExport,
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
  FILE_PROVIDER_ASSISTANTS,
  MISCELLANEOUS_SECTION_ID} from '../utils/constants';
import { LICENSE_EXPIRED } from '../utils/messageStore';
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
  filterAndSortResources,
  getUserAccessLevelOnConnection,
  shouldHaveMiscellaneousSection,
} from '../utils/resource';
import { convertFileDataToJSON, wrapSampleDataWithContext } from '../utils/sampleData';
import {
  getAvailablePreviewStages,
  isPreviewPanelAvailable,
} from '../utils/exportPanel';
import getRoutePath from '../utils/routePaths';
import { getIntegrationAppUrlName, getTitleIdFromSection, isIntegrationAppVerion2 } from '../utils/integrationApps';
import mappingUtil from '../utils/mapping';
import responseMappingUtil from '../utils/responseMapping';
import { suiteScriptResourceKey, isJavaFlow } from '../utils/suiteScript';
import { stringCompare } from '../utils/sort';
import { getFormattedGenerateData } from '../utils/suiteScript/mapping';
import {getSuiteScriptNetsuiteRealTimeSampleData} from '../utils/suiteScript/sampleData';
import { genSelectors } from './util';
import { getFilteredErrors, FILTER_KEYS, DEFAULT_ROWS_PER_PAGE, getSourceOptions } from '../utils/errorManagement';
import {
  getFlowStepsYetToBeCreated,
  generatePendingFlowSteps,
  getRunConsoleJobSteps,
  getParentJobSteps,
} from '../utils/latestJobs';
import getJSONPaths from '../utils/jsonPaths';
import { getApp } from '../constants/applications';
import { FLOW_STAGES, HOOK_STAGES } from '../utils/editor';
import { remainingDays } from './user/org/accounts';
import { FILTER_KEY as LISTENER_LOG_FILTER_KEY, DEFAULT_ROWS_PER_PAGE as LISTENER_LOG_DEFAULT_ROWS_PER_PAGE } from '../utils/listenerLogs';
import { AUTO_MAPPER_ASSISTANTS_SUPPORTING_RECORD_TYPE } from '../utils/assistant';

const emptyArray = [];
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

  const {type} = action;

  return produce(newState, draft => {
    switch (type) {
      case actionTypes.CLEAR_STORE:
        Object.keys(draft).forEach(key => {
          // delete everthing except for app and auth
          if (key !== 'app' && key !== 'auth') {
            delete draft[key];
          }
        });

        break;

      case actionTypes.APP_DELETE_DATA_STATE:
        delete draft.data;

        break;

      default:
    }
  });
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

// #region PUBLIC SESSION SELECTORS
// #region  user selectors
selectors.userState = state => state && state.user;

selectors.userProfile = createSelector(
  state => state?.user?.profile,
  profile => profile
);

selectors.developerMode = state => (
  state && state.user && state.user.profile && state.user.profile.developer
);

selectors.currentEnvironment = state => selectors.userPreferences(state).environment;

selectors.userOwnPreferences = createSelector(
  state => state?.user,
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
// #endregion user selectors

// #region  Template, Cloning, installation and uninstallation selectors

selectors.isSetupComplete = (
  state,
  options = emptyObject
) => {
  const { templateId, resourceType, resourceId } = options;
  let isSetupComplete = false;
  const installSteps =
    fromSession.templateInstallSteps(
      state && state.session,
      templateId || `${resourceType}-${resourceId}`
    ) || [];

  isSetupComplete =
    installSteps.length &&
    !installSteps.reduce((result, step) => result || !step.completed, false);

  return !!isSetupComplete;
};

selectors.isIAConnectionSetupPending = (state, connectionId) => {
  const connection = selectors.resource(state, 'connections', connectionId) || {};

  if (!connection || !connection._connectorId) {
    return;
  }

  const { _integrationId } = connection;
  const integration = selectors.resource(state, 'integrations', _integrationId);

  const addNewChildSteps = fromSession.addNewChildSteps(
    state?.session,
    _integrationId
  );
  const { steps } = addNewChildSteps;

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

selectors.isUninstallComplete = (state, { integrationId, childId }) => {
  let isSetupComplete = false;
  const uninstallSteps =
    fromSession.uninstallSteps(
      state && state.session,
      integrationId,
      childId
    ) || [];

  isSetupComplete =
    uninstallSteps.length &&
    !uninstallSteps.reduce((result, step) => result || !step.completed, false);

  return !!isSetupComplete;
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
  const uninstallData = isFrameWork2 ? fromSession.uninstall2Data(state?.session, integrationId) : fromSession.uninstallData(state?.session, integrationId);
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

selectors.addNewChildSteps = (state, integrationId) => {
  const addNewChildSteps = fromSession.addNewChildSteps(
    state && state.session,
    integrationId
  );
  const { steps } = addNewChildSteps;

  if (!steps || !Array.isArray(steps)) {
    return addNewChildSteps;
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

  const uninstallData = fromSession.uninstall2Data(state?.session, integrationId);

  const { steps: uninstallSteps, isFetched } = uninstallData;

  if (isFetched) {
    if (!uninstallSteps || uninstallSteps.length === 0) return true;

    return !(uninstallSteps.find(s =>
      !s.completed
    ));
  }

  return false;
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

// #endregion Template, Cloning, installation and uninstallation selectors

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

// #region resource selectors

selectors.mkTileApplications = () => createSelector(
  (_, tile) => tile,
  state => state?.data?.resources?.integrations,
  state => state?.data?.resources?.connections,
  (state, tile) => selectors.isIntegrationAppVersion2(state, tile?._integrationId, true),
  (tile, integrations = emptyArray, connections = emptyArray, isIAV2) => {
    let applications = [];

    if (!tile || !tile._connectorId) {
      return emptyArray;
    }
    if (!isIAV2) {
      applications = tile?.connector?.applications || emptyArray;
      // Slight hack here. Both Magento1 and magento2 use same applicationId 'magento', but we need to show different images.
      if (tile.name && tile.name.indexOf('Magento 1') !== -1 && applications[0] === 'magento') {
        applications[0] = 'magento1';
      }
    } else {
      const childIntegrations = integrations.filter(i => i._parentId === tile._integrationId);
      const parentIntegration = integrations.find(i => i._id === tile._integrationId);

      childIntegrations.forEach(i => {
        const integrationConnections = connections.filter(c => c._integrationId === i._id);

        integrationConnections.forEach(c => {
          applications.push(c.assistant || c.type);
        });
      });

      const parentIntegrationConnections = connections.filter(c => c._integrationId === parentIntegration._id);

      parentIntegrationConnections.forEach(c => {
        applications.push(c.assistant || c.type);
      });
      applications = uniq(applications);
    }

    // Make NetSuite always the last application
    if (applications.length) { applications.push(applications.splice(applications.indexOf('netsuite'), 1)[0]); }
    // Only consider up to four applications
    if (applications.length > 4) {
      applications.length = 4;
    }

    return applications;
  }
);

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
      'connectors',
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
      'connectors',
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

const integrationsFilter = {
  type: 'integrations',
  sort: { orderBy: 'name', order: 'asc' },
};

selectors.mkGetChildIntegrations = () => {
  const resourceListSel = selectors.makeResourceListSelector();

  const integrationAppSettingSel = selectors.mkIntegrationAppSettings();

  return createSelector(
    state => resourceListSel(state, integrationsFilter)?.resources,
    (state, integrationId) => integrationAppSettingSel(state, integrationId),
    (state, integrationId) => selectors.isIntegrationAppVersion2(state, integrationId, true),
    (_1, integrationId) => integrationId,
    (allIntegrations, integrationSettings, isV2, integrationId) => {
      if (!integrationId) return null;
      if (isV2) {
        // slight component layer support adding label value props
        return allIntegrations.filter(i => i._parentId === integrationId).map(int => ({...int,
          label: int.name,
          value: int._id}));
      }

      return integrationSettings?.children;
    }

  );
};

const flowsFilter = {
  type: 'flows',
  sort: { orderBy: 'name', order: 'asc' },
};

const getChildIntegrations = selectors.mkGetChildIntegrations();

selectors.getChildIntegrationLabelsTiedToFlows = (state, integrationId, flowIds) => {
  if (!state || !integrationId) {
    return null;
  }
  const integration = fromData.resource(state.data, 'integrations', integrationId);

  if (integration?.settings?.supportsMultiStore) {
    const { children } = selectors.integrationAppSettings(state, integrationId);

    if (!flowIds) {
      return null;
    }

    return children.filter(child => {
      const allFlowIds = selectors.integrationAppFlowIds(state, integrationId, child?.value);

      return flowIds?.some(flowId => allFlowIds?.includes(flowId));
    }).reduce((acc, child) => {
      if (child?.label && !acc.includes(child.label)) {
        acc.push(child.label);
      }

      return acc;
    }, []);
  }
  if (selectors.isIntegrationAppVersion2(state, integrationId, true)) {
    if (!flowIds) return null;

    const allChildIntegrations = getChildIntegrations(state, integrationId);
    const allFlowsIntegrationIds = flowIds.map(flowId => fromData.resource(state.data, 'flows', flowId)?._integrationId).filter(intId => intId);

    return allChildIntegrations.filter(({value}) => allFlowsIntegrationIds.includes(value)).map(({label}) => label);
  }

  return null;
};
const resourceListSel = selectors.makeResourceListSelector();

selectors.mkGetAllValidIntegrations = () => {
  const integrationsListSelector = selectors.makeResourceListSelector();
  const flowListSelector = selectors.makeResourceListSelector();

  return createSelector(
    state => integrationsListSelector(state, integrationsFilter)?.resources,
    state => flowListSelector(state, flowsFilter)?.resources,
    selectors.licenses,
    (integrations, flows, allLicenses) => {
      if (!integrations || !integrations.length) return emptyArray;
      const hasStandaloneFlows = flows.some(({_integrationId}) => !_integrationId);

      const allValidIntegrations = integrations.filter(({mode, _id, _connectorId }) => {
      // DIY
        if (!_connectorId && mode !== 'install' && mode !== 'uninstall') return true;

        // integrationApp
        if (_connectorId) {
          const expiresTimeStamp = allLicenses?.find(l => l._integrationId === _id)?.expires;

          if (!expiresTimeStamp) return false;
          const isIntegrationNotExpired = remainingDays(expiresTimeStamp) > 0;

          return mode === 'settings' && isIntegrationNotExpired;
        }

        return false;
      });

      if (hasStandaloneFlows) {
        return [
          {_id: STANDALONE_INTEGRATION.id, name: STANDALONE_INTEGRATION.name},
          ...(allValidIntegrations || [])];
      }

      return allValidIntegrations;
    }
  );
};
const integrationSettingsSel = selectors.mkIntegrationAppSettings();

selectors.isParentChildIntegration = (state, integrationId) => {
  const integrations = resourceListSel(state, integrationsFilter)?.resources;
  const integrationSettings = integrationSettingsSel(state, integrationId);
  const isV2 = selectors.isIntegrationAppVersion2(state, integrationId, true);

  if (!integrations) {
    return false;
  }

  if (isV2) {
    const selectedIntegration = integrations.find(({_id}) => _id === integrationId);

    return !!selectedIntegration?.initChild?.function;
  }

  return !!integrationSettings?.settings?.supportsMultiStore;
};
selectors.mkAllFlowsTiedToIntegrations = () => {
  const resourceListSel = selectors.makeResourceListSelector();

  const allFlowsFromSections = selectors.makeIntegrationAppSectionFlows();

  return createSelector(
    state => resourceListSel(state, flowsFilter).resources,
    (_1, parentIntegration) => parentIntegration,
    (state, parentIntegration) => selectors.isIntegrationAppVersion2(state, parentIntegration, true),
    (state, parentIntegration) => !selectors.isIntegrationApp(state, parentIntegration),
    (state, parentIntegration) => allFlowsFromSections(state, parentIntegration),
    (_1, _2, childIntegrationIds) => childIntegrationIds,
    (flows, parentIntegration, isV2, isDiy, flowsFromAllChildren, childIntegrationIds) => {
      if (!flows || !parentIntegration) return null;

      if (parentIntegration === STANDALONE_INTEGRATION.id) {
        return flows.filter(({_integrationId}) => !_integrationId);
      }

      if (isV2 || isDiy) {
        const consolidatedIntegrationIds = [parentIntegration, ...(childIntegrationIds || [])];

        return flows.filter(({_integrationId}) => consolidatedIntegrationIds.includes(_integrationId));
      }
      // v1

      if (!childIntegrationIds || childIntegrationIds?.length === 0) {
        // no child filter in this case...just return all parent integrations

        return flowsFromAllChildren;
      }

      // filter based on selected childIntegrations

      return flowsFromAllChildren.filter(({childId}) => childIntegrationIds.includes(childId));
    }
  );
};

selectors.mkGetSortedScriptsTiedToFlow = () => {
  const scriptsTiedToFlowSelector = selectors.mkGetScriptsTiedToFlow();

  return createSelector(
    scriptsTiedToFlowSelector,
    (state, _1, filterKey) => state?.session?.filters?.[filterKey],
    (scripts, scriptsFilter) => {
      const comparer = ({ order, orderBy }) => order === 'desc' ? stringCompare(orderBy, true) : stringCompare(orderBy);

      if (scriptsFilter?.sort) {
        return [...scripts].sort(comparer(scriptsFilter.sort));
      }

      return scripts;
    }
  );
};

const reportsFilter = {
  type: 'eventreports',
};

selectors.getIntegrationIdForEventReport = (state, eventReport) => {
  const foundFlow = eventReport._flowIds.find(flowId => selectors.resource(state, 'flows', flowId));

  return selectors.resource(state, 'flows', foundFlow)?._integrationId;
};

selectors.getEventReportIntegrationName = (state, r) => {
  const integrationId = selectors.getIntegrationIdForEventReport(state, r);

  const integration = selectors.resource(state, 'integrations', integrationId);

  // if there is no integration associated to a flow then its a standalone flow

  return integration?.name || STANDALONE_INTEGRATION.name;
};

selectors.getAllIntegrationsTiedToEventReports = createSelector(state => {
  const eventReports = resourceListSel(state, reportsFilter)?.resources;

  if (!eventReports) { return emptyArray; }

  const allIntegrations = eventReports.map(r => {
    const integrationId = selectors.getIntegrationIdForEventReport(state, r);

    // integration has been deleted
    if (!integrationId) return null;

    const integration = selectors.resource(state, 'integrations', integrationId);

    if (!integration) {
      return STANDALONE_INTEGRATION;
    }

    return integration;
  }).filter(Boolean);

  // get sorted integrations
  return uniqBy(allIntegrations, '_id').sort(stringCompare('name'));
},
integrations => integrations
);

selectors.getAllFlowsTiedToEventReports = createSelector(state => {
  const eventReports = resourceListSel(state, reportsFilter)?.resources;
  const flows = resourceListSel(state, flowsFilter)?.resources;

  if (!eventReports) { return emptyArray; }

  const allFlowIdsTiedToEvenReports = uniq(eventReports.flatMap(r =>
    r?._flowIds || []
  ).filter(Boolean));

  if (!allFlowIdsTiedToEvenReports) { return emptyArray; }

  return flows.filter(({_id: flowId}) =>
    allFlowIdsTiedToEvenReports.includes(flowId)).sort(stringCompare('name'));
},
flows => flows
);

selectors.mkEventReportsFiltered = () => {
  const resourceListSelector = selectors.makeResourceListSelector();

  return createSelector(
    (state, options) => resourceListSelector(state, options),
    selectors.getAllFlowsTiedToEventReports,
    (_1, options) => options,
    (allEventReports, allUniqueFlowsTiedToEventReports, options) => {
      if (!(allEventReports?.resources) || !allUniqueFlowsTiedToEventReports) { return null; }
      const {paging, ...filterParams} = options || {};

      const {integrationId: integrationIdFilter, flowIds: flowIdsFilter, status: statusFilter, startDate: startDateFilter, endDate: endDateFilter } = filterParams;

      let filteredEventReports = allEventReports.resources.filter(({startTime, endTime, status, _flowIds}) => {
        const statusCriteria = (!statusFilter || !statusFilter.length) ? true : statusFilter.includes(status);
        const flowIdCriteria = (!flowIdsFilter || !flowIdsFilter.length) ? true : flowIdsFilter.some(flowId => _flowIds.includes(flowId));
        const startDateStatus = !startDateFilter ? true : moment(startTime).isBetween(moment(startDateFilter.startDate), moment(startDateFilter.endDate));
        const endDateStatus = !endDateFilter ? true : moment(endTime).isBetween(moment(endDateFilter.startDate), moment(endDateFilter.endDate));

        return statusCriteria && flowIdCriteria && startDateStatus && endDateStatus;
      });
      // checking filtering by integration

      filteredEventReports = (!integrationIdFilter || !integrationIdFilter.length) ? filteredEventReports : filteredEventReports.filter(({_flowIds}) => {
        const flow = allUniqueFlowsTiedToEventReports.find(({_id}) => _flowIds?.includes(_id));

        // flow is deleted do not list the report
        if (!flow) {
          return false;
        }

        return integrationIdFilter.includes(flow._integrationId);
      });

      if (!paging) {
        return {
          ...allEventReports,
          resources: filteredEventReports,
          count: filteredEventReports.length,
        };
      }

      const {currPage, rowsPerPage} = paging;
      const startIndex = currPage * rowsPerPage;
      const endIndex = (currPage + 1) * rowsPerPage;

      return {
        ...allEventReports,
        resources: filteredEventReports.slice(startIndex, endIndex),
        count: filteredEventReports.length,
      };
    }
  );
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
  const resourceSel = selectors.makeResourceSelector();
  const integrationResourceSel = selectors.makeResourceSelector();

  return createSelector(
    (state, id) => resourceSel(state, 'flows', id),
    (state, id) => {
      const flow = resourceSel(state, 'flows', id);

      if (!flow || !flow._integrationId) return null;

      return integrationResourceSel(state, 'integrations', flow._integrationId);
    },
    state => state?.data?.resources?.exports,
    (_1, _2, childId) => childId,
    (flow, integration, exports, childId) => {
      if (!flow) return emptyObject;

      return getFlowDetails(flow, integration, exports, childId);
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

selectors.mkFlowAttributes = () => createSelector(
  state => state?.data?.resources?.exports,
  (_, flows) => flows,
  (_1, _2, integration) => integration,
  (_1, _2, _3, childId) => childId,
  (exps = emptyArray, flows = emptyArray, integration, childId) => {
    const out = {};

    if (exps.length < 1) return out;
    const exportIdToExport = {};
    const flowExports = {};
    // eslint-disable-next-line no-use-before-define
    const isIntegrationV2 = isIntegrationAppVerion2(integration, true);

    exps.forEach(exp => {
      exportIdToExport[exp._id] = exp;
    });
    flows.forEach(flow => {
      let flExp = (flow.pageGenerators && flow.pageGenerators.length) ? (flow.pageGenerators.map(pg => pg._exportId)) : [flow._exportId];

      flExp = flExp.map(expId => exportIdToExport[expId]);
      flowExports[flow._id] = flExp;
      if (!out[flow._id]) out[flow._id] = {};
      const o = out[flow._id];

      // isDataLoader
      o.isDataLoader = !!isSimpleImportFlow(flow, [], flExp);
      // isFlowEnableLocked
      // moved from previous selector impl
      let isLocked = true;
      let isRunnable = true;

      if (!flow || !flow._connectorId) isLocked = false;
      else if (!integration) isLocked = false;
      else {
        // strange flow setting name to indicate that flows can not be
        // enabled/disabled by a user...
        const iaFlowSettings = getIAFlowSettings(integration, flow._id, childId);

        isLocked = iaFlowSettings?.disableSlider;
        isRunnable = !iaFlowSettings?.disableRunFlow;
      }
      o.disableRunFlow = isRunnable;
      o.isFlowEnableLocked = isLocked;
      // allowSchedule
      o.allowSchedule = flowAllowsScheduling(flow, integration, [], isIntegrationV2, flExp, childId);
      // flow type
      o.type = getFlowType(flow, [], flExp);
      // supports settings
      o.supportsSettings = flowSupportsSettings(flow, integration, childId);
    });

    return out;
  }
);

selectors.flowType = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);
  const exports = state?.data?.resources?.exports;

  return getFlowType(flow, exports);
};

// // Possible refactor! If we need both canSchedule (flow has ability to schedule),
// // and if the IA allows for schedule overrides, then we can return a touple...
// // for the current purpose, we just need to know if a flow allows or doesn't allow
// // schedule editing.
selectors.mkFlowAllowsScheduling = () => {
  const resourceSel = selectors.makeResourceSelector();
  const integrationResourceSel = selectors.makeResourceSelector();

  return createSelector(
    (state, id) => resourceSel(state, 'flows', id),
    (state, id) => {
      const flow = resourceSel(state, 'flows', id);

      if (!flow || !flow._integrationId) return null;

      return integrationResourceSel(state, 'integrations', flow._integrationId);
    },
    state => state?.data?.resources?.exports,
    (state, id) => {
      const flow = resourceSel(state, 'flows', id);

      if (!flow || !flow._integrationId) return false;

      return selectors.isIntegrationAppVersion2(state, flow._integrationId, true);
    },
    flowAllowsScheduling
  );
};

selectors.flowUsesUtilityMapping = (state, id, childId) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow || !flow._connectorId) return false;
  const integration = selectors.resource(state, 'integrations', flow._integrationId);
  const flowSettings = getIAFlowSettings(integration, flow._id, childId);

  return !!flowSettings?.showUtilityMapping;
};

selectors.flowSupportsMapping = (state, id, childId) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow) return false;

  if (!flow._connectorId) return true;

  const integration = selectors.resource(state, 'integrations', flow._integrationId);

  const flowSettings = getIAFlowSettings(integration, flow._id, childId);

  return !!flowSettings?.showMapping;
};

selectors.flowSupportsSettings = (state, id, childId) => {
  const flow = selectors.resource(state, 'flows', id);

  if (!flow) return false;
  const integration = selectors.resource(state, 'integrations', flow._integrationId);

  return flowSupportsSettings(flow, integration, childId);
};

/* End of refactoring of flowDetails selector.. Once all use is refactored of
   the flowDetails, we should delete that selector.
*********************************************************************** */

selectors.flowListWithMetadata = (state, options) => {
  const flows = selectors.resourceList(state, options || emptyObject).resources || emptyArray;
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

selectors.isConnectionOffline = (state, id) => {
  const connection = selectors.resource(state, 'connections', id);

  return !!connection?.offline;
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
      USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
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
        if (connection.rdbms?.type) {
          return (
            this.rdbms?.type === connection.rdbms?.type &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
          );
        }

        if (['netsuite'].indexOf(connection.type) > -1) {
          const accessLevel = manageOnly ? selectors.userAccessLevelOnConnection(state, this._id) : 'owner';

          return (
            this.type === 'netsuite' &&
            !this._connectorId &&
            (this.netsuite.account) &&
            (!environment || !!this.sandbox === (environment === 'sandbox')) &&
            ([USER_ACCESS_LEVELS.ACCOUNT_ADMIN, USER_ACCESS_LEVELS.ACCOUNT_OWNER, USER_ACCESS_LEVELS.ACCOUNT_MANAGE].includes(accessLevel))
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

selectors.publishedConnectors = createSelector(
  state => state?.data?.resources?.published,
  (published = []) => published.concat(SUITESCRIPT_CONNECTORS)
);

selectors.integrationEnabledFlowIds = createSelector(
  state => state?.data?.resources?.flows,
  (state, integrationId) => integrationId,
  (flows = [], integrationId) => flows.filter(f => f._integrationId === integrationId && !f.disabled).map(f => f._id)
);

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
  sandbox,
  isAccountOwnerOrAdmin,
) => {
  const licenses = fromUser.licenses(userState);
  const connectors = fromMarketPlace.connectors(
    marketPlaceState,
    application,
    sandbox,
    licenses,
    isAccountOwnerOrAdmin,
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

selectors.makeMarketPlaceConnectorsSelector = () =>
  createSelector(
    selectors.userState,
    selectors.marketPlaceState,
    selectors.resourceState,
    (_, application) => application,
    (_1, _2, sandbox) => sandbox,
    selectors.isAccountOwnerOrAdmin,
    (userState, marketPlaceState, resourceState, application, sandbox, isAccountOwnerOrAdmin) =>
      selectors.marketplaceConnectors(
        userState,
        marketPlaceState,
        resourceState,
        application,
        sandbox,
        isAccountOwnerOrAdmin,
      )
  );

selectors.mkTiles = () => createSelector(
  state => state?.data?.resources?.tiles,
  state => state?.data?.resources?.integrations,
  state => selectors.currentEnvironment(state),
  state => selectors.publishedConnectors(state),
  state => selectors.userPermissions(state),
  (allTiles = emptyArray, integrations = emptyArray, currentEnvironment, published = emptyArray, permissions) => {
    const tiles = allTiles.filter(t => (!!t.sandbox === (currentEnvironment === 'sandbox')));

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
          USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
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
  });

selectors.isDataReady = (state, resource) => (
  fromData.hasData(state?.data, resource) &&
      !fromComms.isLoading(state?.comms, resource)
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
  const hasData = fromData.hasData(state?.data, origResourceType);
  const isLoading = fromComms.isLoading(state?.comms, commKey);
  const retryCount = fromComms.retryCount(state?.comms, commKey);
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
  const refresh = fromNetworkComms.isRefreshing(networkCommState, commKey);
  const retryCount = fromNetworkComms.retryCount(networkCommState, commKey);
  const isReady = method !== 'GET' || (refresh ? hasData : (hasData && !isLoading));

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
  const cachedStageSelector = selectors.makeTransformStagedResource();
  const cachedResourceSelector = selectors.makeResourceSelector();

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
        state,
        type,
        id
      );
    },
    (state, resourceType, id, scope) =>
      cachedStageSelector(
        state,
        id,
        scope
      ),
    (_1, resourceType) => resourceType,
    (_1, _2, id) => id,

    (resourceIdState, stagedIdState, resourceType, id) => selectors.resourceDataModified(resourceIdState, stagedIdState, resourceType, id)
  );
};
// Please use makeResourceDataSelector in JSX as it is cached selector.
// For sagas we can use resourceData which points to cached selector.
selectors.resourceData = selectors.makeResourceDataSelector();

selectors.auditLogs = (
  state,
  resourceType,
  resourceId,
  filters,
  options = {}
) => {
  let auditLogs = fromData.auditLogs(
    state?.data,
    resourceType,
    resourceId,
    filters
  );

  const result = {
    logs: [],
    count: 0,
    totalCount: 0,
  };

  if (options.childId) {
    const {
      exports = [],
      imports = [],
      flows = [],
      connections = [],
    } = selectors.integrationAppResourceList(state, resourceId, options.childId);
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

selectors.mkFlowResources = () => createSelector(
  state => state?.data?.resources?.flows,
  state => state?.data?.resources?.exports,
  state => state?.data?.resources?.imports,
  (_, flowId) => flowId,
  (flows, exports, imports, flowId) => getFlowResources(flows, exports, imports, flowId)
);

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

selectors.mkConnectionIdsUsedInSelectedFlows = () => createSelector(
  state => state?.data?.resources?.connections,
  state => state?.data?.resources?.exports,
  state => state?.data?.resources?.imports,
  state => state?.data?.resources?.flows,
  (_, selectedFlows) => selectedFlows,
  (connections = emptyArray, exports = emptyArray, imports = emptyArray, flows = emptyArray, selectedFlows) => {
    let connectionIdsToRegister = [];

    if (!selectedFlows) {
      return connectionIdsToRegister;
    }

    selectedFlows.forEach(flowId => {
      const flow = flows.find(f => f._id === flowId);

      connectionIdsToRegister = connectionIdsToRegister.concat(
        getAllConnectionIdsUsedInTheFlow(flow, connections, exports, imports)
      );
    });

    return uniq(connectionIdsToRegister);
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

selectors.mkChildIntegration = () => {
  const resourceSelector = selectors.makeResourceSelector();

  return createSelector(
    (state, integrationId) => {
      const id = selectors.getChildIntegrationId(state, integrationId);

      return id && resourceSelector(state, 'integrations', id);
    },
    childIntegration => childIntegration
  );
};

selectors.mkDIYIntegrationFlowList = () => createSelector(
  state => state?.data?.resources?.integrations,
  state => state?.data?.resources?.flows,
  (state, integrationId) => integrationId,
  (_1, _2, childId) => childId,
  (_1, _2, _3, options) => options,
  selectors.errorMap,
  selectors.currentEnvironment,
  (integrations = emptyArray, flows = emptyArray, integrationId, childId, options, errorMap, currentEnvironment) => {
    const childIntegrationIds = integrations.filter(i => i._parentId === integrationId || i._id === integrationId).map(i => i._id);
    let integrationFlows = flows.filter(f => {
      if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
        return !f._integrationId && !!f.sandbox === (currentEnvironment === 'sandbox');
      }
      if (childId && childId !== integrationId) return f._integrationId === childId;

      return childIntegrationIds.includes(f._integrationId);
    });

    integrationFlows = integrationFlows.map(f => ({...f, errors: (errorMap?.data && errorMap.data[f._id]) || 0}));

    return filterAndSortResources(integrationFlows, options);
  }
);

selectors.mkIntegrationFlowGroups = () => {
  const integrationAppFlowSections = selectors.mkIntegrationAppFlowSections();
  const flowGroupings = selectors.mkFlowGroupingsSections();

  return createSelector(
    state => state?.data?.resources?.flows,
    (_, integrationId) => integrationId,
    selectors.isIntegrationAppV1,
    (state, integrationId) => integrationAppFlowSections(state, integrationId),
    (state, integrationId) => flowGroupings(state, integrationId),
    (flows = emptyArray, integrationId, isIAV1, flowSections, flowGroupings) => {
      if (isIAV1) {
        return flowSections;
      }

      if (flowGroupings) {
        const integrationFlows = flows.filter(f => f._integrationId === integrationId);

        if (shouldHaveMiscellaneousSection(flowGroupings, integrationFlows)) {
          return [...flowGroupings, {title: 'Miscellaneous', sectionId: MISCELLANEOUS_SECTION_ID}];
        }
      }

      return flowGroupings || emptyArray;
    }
  );
};

selectors.mkIntegrationFlowsByGroup = () => {
  const integrationAppV1Flows = selectors.makeIntegrationSectionFlows();

  return createSelector(
    state => state?.data?.resources?.integrations,
    state => state?.data?.resources?.flows,
    (_, integrationId) => integrationId,
    (_1, _2, childId) => childId,
    (_1, _2, _3, groupId) => groupId,
    selectors.currentEnvironment,
    selectors.isIntegrationAppV1,
    (state, integrationId, childId, sectionId) => integrationAppV1Flows(state, integrationId, childId, sectionId),
    (integrations = emptyArray, flows = emptyArray, integrationId, childId, groupId, currentEnvironment, isIAV1, IAV1Flows) => {
      if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
        return flows.filter(flow => (!flow._integrationId && !!flow.sandbox === (currentEnvironment === 'sandbox')));
      }
      const childIntegrations = integrations
        .filter(integration => (integration._parentId === integrationId || integration._id === integrationId))
        .map(integration => integration._id);

      if (isIAV1) {
        return flows.filter(flow => IAV1Flows.includes(flow._id));
      }

      return flows.filter(flow => {
        let isValid = !flow.disabled;

        if (!childId || childId === integrationId) {
          isValid = isValid && childIntegrations.includes(flow._integrationId);
        } else {
          isValid = isValid && flow._integrationId === childId;
        }

        if (groupId) {
          if (groupId === MISCELLANEOUS_SECTION_ID) {
            isValid = isValid && !flow._flowGroupingId;
          } else {
            isValid = isValid && flow._flowGroupingId === groupId;
          }
        }

        return isValid;
      });
    }
  );
};

selectors.getResourceType = (state, { resourceType, resourceId }) => {
  let updatedResourceType;

  if (resourceType === 'pageGenerator') {
    updatedResourceType = 'exports';
  } else if (resourceType === 'pageProcessor') {
    const createdId = selectors.createdResourceId(state, resourceId);
    const importResource = selectors.resource(state, 'imports', createdId);

    // it should be either an export or an import
    if (importResource) {
      updatedResourceType = 'imports';
    } else {
      updatedResourceType = 'exports';
    }
  } else {
    updatedResourceType = resourceType;
  }

  return updatedResourceType;
};

// #endregion resource selectors

// #region integrationApps selectors

selectors.integrationAppSettings = selectors.mkIntegrationAppSettings();

selectors.getFlowsAssociatedExportFromIAMetadata = (state, fieldMeta) => {
  const { resource: flowResource, properties } = fieldMeta || {};
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
  const isParent = (integrationId === childId) || !childId;
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

selectors.mkIntegrationAppResourceList = () => {
  const integrationAppSettings = selectors.mkIntegrationAppSettings();

  return createSelector(
    integrationAppSettings,
    state => state?.data?.resources?.flows,
    state => state?.data?.resources?.connections,
    state => state?.data?.resources?.exports,
    state => state?.data?.resources?.imports,
    (_1, integrationId) => integrationId,
    (_1, _2, childId) => childId,
    (_1, _2, _3, options) => options,
    (integrationResource, flows = emptyArray, connections = emptyArray, exports = emptyArray, imports = emptyArray, integrationId, childId, options = emptyObject) => getIAResources(integrationResource, flows, connections, exports, imports, {...options, integrationId, childId})
  );
};
selectors.integrationAppResourceList = selectors.mkIntegrationAppResourceList();

selectors.mkIntegrationAppChild = () => {
  const integrationSettings = selectors.mkIntegrationAppSettings();

  return createSelector(
    (state, integrationId) => integrationSettings(state, integrationId),
    (_1, _2, childId) => childId,
    (integration, childId) => {
      if (!integration || !integration.children || !integration.children.length) {
        return emptyObject;
      }

      return (
        integration.children.find(child => child.value === childId) || emptyObject
      );
    }

  );
};

selectors.mkIntegrationAppConnectionList = () => {
  const integrationAppResourceList = selectors.mkIntegrationAppResourceList();

  return createSelector(
    integrationAppResourceList,
    resourceList => resourceList?.connections
  );
};
selectors.integrationAppConnectionList = selectors.mkIntegrationAppConnectionList();

selectors.integrationAppName = () => createSelector(
  state => state?.data?.resources?.integrations,
  (state, integrationId) => integrationId,
  (integrations = emptyArray, integrationId) => {
    const integration = integrations.find(i => i._id === integrationId);

    if (integration && integration._connectorId && integration.name) {
      return getIntegrationAppUrlName(integration.name);
    }

    return null;
  }
);

selectors.mkIntegrationChildren = () => createSelector(
  state => state?.data?.resources?.integrations,
  (state, integrationId) => integrationId,
  (integrations = [], integrationId) => {
    const children = [];
    const integration = integrations.find(int => int._id === integrationId) || {};
    const childIntegrations = integrations.filter(int => int._parentId === integrationId);

    childIntegrations.sort(stringCompare('createdAt'));

    children.push({ value: integrationId, label: integration.name });
    childIntegrations.forEach(ci => {
      children.push({ value: ci._id, label: ci.name, mode: ci.mode });
    });

    return children;
  }
);
selectors.integrationChildren = selectors.mkIntegrationChildren();

selectors.integrationAppEdition = (state, integrationId) => {
  if (!state) return 'Standard plan';
  const integrationResource = selectors.integrationAppSettings(state, integrationId);
  let { connectorEdition: edition } = integrationResource.settings || {};
  const userLicenses = fromUser.licenses(state?.user) || [];
  const license = userLicenses.find(l => l._integrationId === integrationId) || {};
  const integrationAppList = selectors.publishedConnectors(state);

  const connector =
     integrationAppList?.find(ia => ia._id === license?._connectorId);

  const editions = connector?.twoDotZero?.editions || emptyArray;

  edition = edition ||
            (editions.find(ed => ed._id === license._editionId) || {})?.displayName;

  const plan = `${
    edition ? edition.charAt(0).toUpperCase() + edition.slice(1) : 'Standard'
  } plan`;

  return plan;
};

selectors.integrationAppLicense = (state, id) => {
  if (!state) return emptyObject;
  const integrationResource = selectors.integrationAppSettings(state, id);
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

  return {
    ...license,
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

              if (selectedSection?.flows?.length) {
                flows = selectedSection.flows.map(f => f._id);
              }
            } else {
              child.forEach(sec => sec?.flows?.length && flows.push(...sec.flows.map(f => f._id)));
            }
          }
        } else {
          sections.forEach(sec => {
            if (sec.mode === 'settings' || !sec.mode) {
              if (sectionId) {
                const selectedSection = sec.sections.find(s => getTitleIdFromSection(s) === sectionId);

                if (selectedSection?.flows?.length) {
                  flows.push(...selectedSection.flows.map(f => f._id));
                }
              } else {
                sec.sections.forEach(s => s?.flows?.length && flows.push(...s.flows.map(f => f._id)));
              }
            }
          });
        }
      }
    } else if (sectionId) {
      const selectedSection = sections.find(sec => getTitleIdFromSection(sec) === sectionId);

      if (selectedSection?.flows?.length) {
        flows = selectedSection.flows.map(f => f._id);
      }
    } else {
      sections.forEach(sec => sec?.flows?.length && flows.push(...sec.flows.map(f => f._id)));
    }

    return flows;
  }
);

selectors.mkIntegrationAppFlowSections = () => {
  const integrationSettingsSelector = selectors.mkIntegrationAppSettings();

  return createSelector(
    (state, id) => (state && integrationSettingsSelector(state, id)) || emptyObject,
    (_1, _2, childId) => childId,
    (integrationResource, childId) => {
      let flowSections = [];
      const { sections = [], supportsMultiStore } =
      integrationResource.settings || {};

      if (supportsMultiStore) {
        if (Array.isArray(sections) && sections.length) {
          if (childId) {
            flowSections =
            (sections.find(sec => sec.id === childId) || {}).sections || [];
          } else {
            const allFlowsections = sections
              .filter(sec => sec.mode !== 'install')
              .map(sec => sec.sections || [])
              .flat();

            allFlowsections.forEach(section => {
              const index = flowSections.findIndex(sec => sec.title === section.title);

              if (index === -1) {
                flowSections.push({...section});
              } else {
                flowSections[index].flows = uniqBy([...flowSections[index].flows, ...section.flows], '_id');
              }
            });
          }
        }
      } else {
        flowSections = sections;
      }

      return flowSections
        .filter(sec => !!sec.title)
        .map(sec => ({
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
    (_1, _2, childId) => childId,
    (integrationResource, childId) => {
      if (!integrationResource) return emptyObject;
      let fields;
      let subSections;
      const { supportsMultiStore, general } = integrationResource.settings || {};

      if (supportsMultiStore) {
        const childSection = (general || []).find(s => s.id === childId) || {};

        ({ fields, sections: subSections } = childSection);
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

selectors.hasGeneralSettings = (state, integrationId, childId) => {
  if (!state) return false;
  const integrationResource =
    selectors.integrationAppSettings(state, integrationId) || {};
  const { supportsMultiStore, general } = integrationResource.settings || {};

  if (supportsMultiStore) {
    return !!(general || []).find(s => s.id === childId);
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
    (_1, _2, _3, childId) => childId,
    (integrationResource, section, childId) => {
      if (!integrationResource) return emptyObject;

      const { supportsMultiStore, sections = [] } = integrationResource.settings || {};
      let allSections = sections;

      if (supportsMultiStore) {
        if (childId) {
          // If childId passed, return sections from that child
          const child = sections.find(s => s.id === childId) || {};

          allSections = child.sections || [];
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

selectors.makeIntegrationAppSectionFlows = () =>
  createSelector(
    selectors.integrationAppSettings,
    state => state?.data?.resources?.flows,
    (_, integrationId) => integrationId,
    (_1, _2, section) => section,
    (_1, _2, _3, childId) => childId,
    selectors.errorMap,
    (_1, _2, _3, _4, options) => options,
    (integration, flows = [], integrationId, section, childId, errorMap = emptyObject, options = emptyObject) => {
      if (!integration) {
        return emptyArray;
      }
      const {
        supportsMultiStore,
        sections = [],
      } = integration.settings || {};
      const requiredFlows = [];
      let sectionFlows;
      let allSections = sections;

      if (supportsMultiStore) {
        if (childId) {
          // If childId passed, return sections from that child
          const child = sections.find(s => s.id === childId) || {};

          allSections = child.sections || [];
        } else {
          // If no childId is passed, return all sections from all children
          allSections = [];
          sections.forEach(sec => {
            allSections.push(...(sec.sections.map(s => ({...s, childId: sec.id, childName: sec.title}))));
          });
        }
      }
      const selectedSections =
        allSections.filter(
          sec =>
            !section || getTitleIdFromSection(sec) === section
        );

      selectedSections.forEach(sec => {
        sectionFlows = options.excludeHiddenFlows ? (sec.flows || []).filter(f => !f.hidden) : sec.flows;
        (sectionFlows || []).forEach(f => {
          const flow = requiredFlows.find(fi => fi.id === f._id);

          if (flow) {
            // If flow is present in two children, then it is a common flow and does not belong to any single child, so remove child information from flow
            delete flow.childId;
            delete flow.childName;
          } else if (flows.find(fi => fi._id === f._id)) {
            // Add only valid flows, the flow must be present in flows collection. This is possible when child is in uninstall mode.
            // Flow may be deleted but child structure is intact on integration json.
            requiredFlows.push({id: f._id, childId: sec.childId, childName: sec.childName});
          }
        });
      });
      const requiredFlowIds = requiredFlows.map(f => f.id);

      return filterAndSortResources(flows
        .filter(f => f._integrationId === integrationId && requiredFlowIds.includes(f._id))
        .sort(
          (a, b) => requiredFlowIds.indexOf(a._id) - requiredFlowIds.indexOf(b._id)
        ).map(f => ({...f, errors: (errorMap && errorMap.data && errorMap.data[f._id]) || 0}))
        .map((f, i) => (supportsMultiStore && !childId) ? ({...f, ...requiredFlows[i]}) : f), options);
    }
  );
selectors.integrationAppSectionFlows = selectors.makeIntegrationAppSectionFlows();

// This selector is used in dashboard, it shows all the flows including the flows not in sections.
// Integration App settings page should not use this selector.
selectors.integrationAppFlowIds = (state, integrationId, childId) => {
  const allIntegrationFlows = selectors.resourceList(state, {
    type: 'flows',
    filter: { _integrationId: integrationId },
  }).resources;

  const integration = selectors.integrationAppSettings(state, integrationId);

  if (integration?.children && childId) {
    const child = integration.children.find(c => c.value === childId);
    const flows = selectors.integrationAppSectionFlows(
      state,
      integrationId,
      null,
      childId
    );

    if (child) {
      const childFlows = allIntegrationFlows.filter(f => {
        // TODO: this is not reliable way to extract child flows. With current integration json,
        // there is no good way to extract this
        // Extract child from the flow name. (Regex extracts child label from flow name)
        // Flow name usually follows this format: <Flow Name> [<StoreLabel>]
        const regex = new RegExp(`\\s\\[(${integration.children.map(c => c.label).join('|')})\\]$`);
        const flowChild = regex.test(f.name)
          ? regex.exec(f.name)[1]
          : null;

        return flowChild
          ? flowChild === child.label
          : map(flows, '_id').indexOf(f._id) > -1;
      });

      return map(childFlows.length ? childFlows : flows,
        '_id'
      );
    }

    return map(flows, '_id');
  }

  return map(allIntegrationFlows, '_id');
};

// FIXME: @ashu, we can refactor this later and completely remove
// the clone check once the functionality is clear and tested for all scenarios
selectors.isIntegrationAppVersion2 = (state, integrationId, skipCloneCheck) => {
  const integration = selectors.resource(state, 'integrations', integrationId);

  return isIntegrationAppVerion2(integration, skipCloneCheck);
};

selectors.isIntegrationAppV1 = (state, integrationId) => {
  const isIntegrationAppV2 = selectors.isIntegrationAppVersion2(state, integrationId, true);
  const integration = selectors.resource(state, 'integrations', integrationId);

  return !!integration?._connectorId && !isIntegrationAppV2;
};

selectors.integrationAppChildIdOfFlow = (state, integrationId, flowId) => {
  if (!state || !integrationId) {
    return null;
  }
  const integration = fromData.resource(state.data, 'integrations', integrationId);

  if (integration?.settings?.supportsMultiStore) {
    const { children } = selectors.integrationAppSettings(state, integrationId);

    if (!flowId) {
      return null;
    }

    return children.find(child => selectors.integrationAppFlowIds(state, integrationId, child?.value)?.includes(flowId))?.value;
  }
  if (selectors.isIntegrationAppVersion2(state, integrationId, true)) {
    if (!flowId) return integrationId;

    return fromData.resource(state.data, 'flows', flowId)?._integrationId;
  }

  return null;
};

// #endregion integrationApps selectors

// #region PUBLIC ACCOUNTS SELECTORS

selectors.isAccountOwnerOrAdmin = state => {
  const userPermissions = selectors.userPermissions(state) || emptyObject;

  return [USER_ACCESS_LEVELS.ACCOUNT_ADMIN, USER_ACCESS_LEVELS.ACCOUNT_OWNER].includes(userPermissions.accessLevel);
};
selectors.isAccountOwner = state => {
  const userPermissions = selectors.userPermissions(state) || emptyObject;

  return userPermissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;
};

selectors.allRegisteredConnectionIdsFromManagedIntegrations = createSelector(
  selectors.userPermissions,
  state => state?.data?.resources?.integrations,
  state => state?.data?.resources?.connections,
  selectors.isAccountOwnerOrAdmin,
  (permissions = emptyObject, integrations = emptyArray, connections = emptyArray, isAccountOwnerOrAdmin) => {
    if (isAccountOwnerOrAdmin || permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MANAGE) {
      return connections.map(c => c._id);
    }
    if (permissions.accessLevel === USER_ACCESS_LEVELS.TILE) {
      const connectionIds = [];

      integrations.forEach(i => {
        if (permissions?.integrations && permissions.integrations[i._id] && permissions.integrations[i._id].accessLevel === 'manage') {
          connectionIds.push(...i._registeredConnectionIds);
        }
      });

      return connectionIds;
    }

    return emptyArray;
  }
);

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

selectors.availableUsersList = (state, integrationId) => {
  const isAccountOwnerOrAdmin = selectors.isAccountOwnerOrAdmin(state);
  let _users = [];

  if (isAccountOwnerOrAdmin) {
    if (integrationId) {
      _users = selectors.integrationUsersForOwner(state, integrationId);
    } else {
      _users = selectors.usersList(state);
    }
  } else if (integrationId) {
    _users = selectors.integrationUsers(state, integrationId);
  }

  if ((integrationId || isAccountOwnerOrAdmin) && _users?.length > 0) {
    const accountOwner = selectors.accountOwner(state);

    _users = [
      {
        _id: ACCOUNT_IDS.OWN,
        accepted: true,
        accessLevel: INTEGRATION_ACCESS_LEVELS.OWNER,
        sharedWithUser: accountOwner,
      },
      ..._users,
    ];
  }

  return _users ? _users.sort(stringCompare('sharedWithUser.name')) : emptyArray;
};

selectors.platformLicense = createSelector(
  selectors.userPreferences,
  // TODO: Surya make it even more granular the selector
  // it should be made receptive to changes to the state.user.org.accounts
  selectors.userState,
  (preferencesObj, userStateObj) =>
    fromUser.platformLicense(userStateObj, preferencesObj.defaultAShareId)
);

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
      USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
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

  // TODO: userPermissions should be written to handle when there isn't a state and in those circumstances
  // should return null rather than an empty object for all cases
  if (!permissions || isEmpty(permissions)) return emptyObject;

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
        USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
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
    accessLevelIntegration === USER_ACCESS_LEVELS.ACCOUNT_MANAGE ||
    accessLevelIntegration === USER_ACCESS_LEVELS.ACCOUNT_ADMIN
  ) {
    // check integration app is manage or owner then selectively disable fields
    if (isIntegrationApp) return { disableAllFieldsExceptClocked: true };
  }

  return { disableAllFields: !!disabled };
};

selectors.canEditSettingsForm = (state, resourceType, resourceId, integrationId) => {
  const r = selectors.resource(state, resourceType, resourceId);
  const isIAResource = !!r?._connectorId;
  const { developer } = selectors.userProfile(state) || emptyObject;
  const allowedToPublish = selectors.canUserPublish(state);
  const viewOnly = selectors.isFormAMonitorLevelAccess(state, integrationId);

  // if the resource belongs to an IA and the user cannot publish, then
  // a user can thus also not edit
  const visibleForUser = !isIAResource || allowedToPublish;

  return developer && !viewOnly && visibleForUser;
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

// #endregion

// #region PUBLIC GLOBAL SELECTORS

// #region  Notifications selectors

selectors.mkSubscribedNotifications = () => createSelector(
  (state, email) => email,
  selectors.userProfileEmail,
  state => state?.data?.resources?.notifications,
  (email, userEmail, allNotifications = emptyArray) => {
    const emailIdToFilter = email || userEmail;

    return allNotifications.filter(notification => notification.subscribedByUser.email === emailIdToFilter);
  }
);

selectors.mkDiyFlows = () => createSelector(
  state => state?.data?.resources?.flows,
  (_, _integrationId) => _integrationId,
  (flows = emptyArray, _integrationId) => flows.filter(f => {
    if (!_integrationId || _integrationId === 'none') {
      return !f._integrationId;
    }

    return f._integrationId === _integrationId;
  })
);

selectors.mkDiyConnections = () => createSelector(
  state => state?.data?.resources?.connections,
  (state, _integrationId) => selectors.resource(state, 'integrations', _integrationId)?._registeredConnectionIds,
  (_, _integrationId) => _integrationId,
  (connections = emptyArray, registeredConnections = emptyArray, _integrationId) => connections.filter(c => registeredConnections.includes(c._id) || _integrationId === 'none')
);

selectors.mkIntegrationNotificationResources = () => {
  const diyConnections = selectors.mkDiyConnections();
  const diyFlows = selectors.mkDiyFlows();
  const integrationAppResourceList = selectors.mkIntegrationAppResourceList();
  const subscribedNotifications = selectors.mkSubscribedNotifications();

  return createSelector(
    (_1, _integrationId) => _integrationId,
    (state, _integrationId) => selectors.resource(state, 'integrations', _integrationId)?._connectorId,
    diyFlows,
    diyConnections,
    (state, _integrationId, options) => integrationAppResourceList(state, _integrationId, options?.childId, options),
    (state, _1, options) => subscribedNotifications(state, options?.userEmail),
    (_integrationId, _connectorId, diyFlows, diyConnections, integrationAppResources, notifications = emptyArray) => {
      const connections = _connectorId ? integrationAppResources?.connections : diyConnections;
      const flows = _connectorId ? integrationAppResources?.flows : diyFlows;
      const connectionValues = (connections || [])
        .filter(c => !!notifications.find(n => n._connectionId === c._id))
        .map(c => c._id);
      let flowValues = (flows || [])
        .filter(f => !!notifications.find(n => n._flowId === f._id))
        .map(f => f._id);
      const allFlowsSelected = !!notifications.find(
        n => n._integrationId === _integrationId
      );

      if (_integrationId && _integrationId !== 'none') {
        if (allFlowsSelected) flowValues = [_integrationId, ...flows];
      }

      return {
        connections,
        flows,
        connectionValues,
        flowValues,
      };
    }

  );
};

selectors.integrationNotificationResources = selectors.mkIntegrationNotificationResources();

selectors.isFlowSubscribedForNotification = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);
  const integrationId = flow?._integrationId || 'none';
  const subscribedFlows = selectors.integrationNotificationResources(state, integrationId).flowValues;

  return subscribedFlows.includes(integrationId) || subscribedFlows.includes(flowId);
};
// #endregion Notification selectors

// #region Session metadata selectors

selectors.metadataOptionsAndResources = (state, {
  connectionId,
  commMetaPath,
  filterKey,
}) => (
  selectors.optionsFromMetadata(state,
    connectionId,
    commMetaPath,
    filterKey,
  ) || emptyObject
);

selectors.getMetadataOptions = (
  state,
  { connectionId, commMetaPath, filterKey }
) => (
  selectors.optionsFromMetadata(state,
    connectionId,
    commMetaPath,
    filterKey,
  ) || emptyObject
);

selectors.getSalesforceMasterRecordTypeInfo = (state, resourceId) => {
  const { _connectionId: connectionId, salesforce } = selectors.resourceData(state, 'imports', resourceId)?.merged || emptyObject;
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce?.sObjectType}`;
  const { data, status } = selectors.metadataOptionsAndResources(state, {
    connectionId,
    commMetaPath,
    filterKey: 'salesforce-masterRecordTypeInfo',
  });

  return { data, status };
};

// #endregion Session metadata selectors

// #region SAMPLE DATA selectors

/**
 * User can select number of records in all cases except for realtime adaptors
 * No need to show when export preview is disabled
 */
selectors.canSelectRecordsInPreviewPanel = (state, resourceId, resourceType) => {
  const isExportPreviewDisabled = selectors.isExportPreviewDisabled(state, resourceId, resourceType);

  if (isExportPreviewDisabled) return false;
  const resource = selectors.resourceData(state, resourceType, resourceId)?.merged || {};
  // TODO @Raghu: merge this as part of isRealTimeOrDistributedResource to handle this resourceType
  // it is realtime incase of new export for realtime adaptors

  if (resource?.resourceType === 'realtime') return false;
  if (isRealTimeOrDistributedResource(resource, resourceType)) return false;

  return true;
};

/*
* Definition rules are fetched in 2 ways
* 1. In creation of an export, from FileDefinitions list based on 'definitionId' and 'format'
* 2. In Editing an existing export, from UserSupportedFileDefinitions based on userDefinitionId
* TODO @Raghu: Refactor this selector to be more clear
*/
selectors.fileDefinitionSampleData = (state, { userDefinitionId, resourceType, options = emptyObject }) => {
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
selectors.fileSampleData = (state, { resourceId, resourceType, fileType, ssLinkedConnectionId}) => {
  if (ssLinkedConnectionId) return selectors.suiteScriptFileExportSampleData(state, {resourceId, resourceType, ssLinkedConnectionId});

  const stage = fileType === 'xlsx' ? 'csv' : 'rawFile';
  const { data: rawData } = selectors.getResourceSampleDataWithStatus(
    state,
    resourceId,
    stage,
  );

  if (!rawData) {
    const resourceObj = selectors.resource(state, resourceType, resourceId) || emptyObject;

    if (resourceObj?.file?.type === fileType) {
      return resourceObj.sampleData;
    }
  }

  return rawData?.body;
};

selectors.getImportSampleData = (state, resourceId, options = {}) => {
  const resource = selectors.resourceData(state, 'imports', resourceId)?.merged || emptyObject;
  const { assistant, adaptorType, sampleData, _connectorId } = resource;
  const isIntegrationApp = !!_connectorId;

  if (assistant && assistant !== 'financialforce' && !(FILE_PROVIDER_ASSISTANTS.includes(assistant))) {
    // get assistants sample data
    return selectors.assistantPreviewData(state, resourceId);
  }
  if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(adaptorType)) {
    // eslint-disable-next-line camelcase
    const { _connectionId: connectionId} = resource;
    let commMetaPath;
    // eslint-disable-next-line camelcase
    const importRecordType = resource?.netsuite_da?.recordType || resource?.netsuite?.recordType;

    if (options.recordType) {
      /** special case of netsuite/metadata/suitescript/connections/5c88a4bb26a9676c5d706324/recordTypes/inventorydetail?parentRecordType=salesorder
       * in case of subrecord */
      commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${options.recordType}?parentRecordType=${importRecordType}`;
    } else {
      commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${importRecordType}`;
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
      data: convertFileDataToJSON(sampleData, resource),
      status: 'received',
    };
  }

  return emptyObject;
};

// This selector will pre-process the raw sample data to the proper stage for each AFE
selectors.sampleDataWrapper = createSelector(
  [
    // eslint-disable-next-line no-use-before-define
    (state, params) => params.sampleData || selectors.getSampleDataContext(state, params),
    (state, params) => {
      if (['postMap', 'postSubmit'].includes(params.stage)) {
        return selectors.getSampleDataContext(state, { ...params, stage: 'preMap' });
      }
    },
    (state, params) => {
      if (params.stage === 'postSubmit') {
        return selectors.getSampleDataContext(state, { ...params, stage: 'postMap' });
      }
    },
    (state, { flowId }) => selectors.resource(state, 'flows', flowId) || emptyObject,
    (state, { flowId }) => {
      const flow = selectors.resource(state, 'flows', flowId) || emptyObject;

      return (
        selectors.resource(state, 'integrations', flow._integrationId) || emptyObject
      );
    },
    (state, { resourceId, resourceType }) => {
      const { merged } = selectors.resourceData(
        state,
        resourceType,
        resourceId,
        'value'
      );

      return merged || emptyObject;
    },
    (state, { resourceId, resourceType }) => {
      const res = selectors.resource(state, resourceType, resourceId) || emptyObject;

      return selectors.resource(state, 'connections', res._connectionId) || emptyObject;
    },
    (_, { stage }) => stage,
    (_, { fieldType }) => fieldType,
    (state, { flowId }) => {
      const flow = selectors.resource(state, 'flows', flowId) || emptyObject;
      const integration = selectors.resource(state, 'integrations', flow._integrationId) || emptyObject;

      if (integration._parentId) {
        return (
          selectors.resource(state, 'integrations', integration._parentId) || emptyObject
        );
      }

      return null;
    },
  ],
  (
    sampleData,
    preMapSampleData,
    postMapSampleData,
    flow,
    integration,
    resource,
    connection,
    stage,
    fieldType,
    parentIntegration,
  ) => wrapSampleDataWithContext({sampleData,
    preMapSampleData,
    postMapSampleData,
    flow,
    integration,
    resource,
    connection,
    stage,
    fieldType,
    parentIntegration})
);

/**
 * All the adaptors whose preview depends on connection
 * are disabled if their respective connections are offline
 * Any other criteria to disable preview panel can be added here
 */
selectors.isExportPreviewDisabled = (state, resourceId, resourceType) => {
  const resourceObj = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value',
  )?.merged || emptyObject;

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
  const resourceObj = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  )?.merged || emptyObject;

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

// #endregion SAMPLE DATA selectors

// #region  SUITESCRIPT Selectors

selectors.mkSuiteScriptLinkedConnections = () => createSelector(
  selectors.userPreferences,
  selectors.userPermissions,
  state => state?.data?.resources?.connections,
  state => state?.data?.resources?.integrations,
  state => selectors.currentEnvironment(state),
  (preferences, permissions, allConnections = [], integrations = [], currentEnvironment) => {
    const linkedConnections = [];
    const connections = allConnections.filter(c => (!!c.sandbox === (currentEnvironment === 'sandbox')));

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
        accessLevel = getUserAccessLevelOnConnection(permissions, integrations, connectionId);

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
);
selectors.suiteScriptLinkedConnections = selectors.mkSuiteScriptLinkedConnections();

selectors.suiteScriptLinkedTiles = createSelector(
  selectors.suiteScriptLinkedConnections,
  state => state?.data?.suiteScript,
  (linkedConnections, suiteScriptTiles = {}) => {
    let tiles = [];

    linkedConnections.forEach(connection => {
      tiles = tiles.concat(suiteScriptTiles[connection._id]?.tiles || []);
    });

    return tiles;
  });

selectors.makeSuiteScriptIAFlowSections = () => {
  const cachedIASettingsSelector = selectors.makeSuiteScriptIASettings();

  return createSelector(
    (state, id, ssLinkedConnectionId) => cachedIASettingsSelector(state, id, ssLinkedConnectionId),

    meta => {
      const {sections = []} = meta || {};

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
    (state, id, ssLinkedConnectionId) => cachedIASettingsSelector(state, id, ssLinkedConnectionId),

    metaSections => {
      const {general, sections = [] } = metaSections || {};

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
  const hasData = fromData.hasSuiteScriptData(state?.data, {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
  });
  const isLoading = fromComms.isLoading(state?.comms, commKey);
  const retryCount = fromComms.retryCount(state?.comms, commKey);
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
  ) || {};

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
    selectors.suiteScriptIASettings(state, id, ssLinkedConnectionId) || emptyObject;
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

  if (flow?.export?._connectionId) {
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
      if (f.export?._connectionId) {
        connectionIdsInUse.push(f.export._connectionId);
      }
      if (f.import?._connectionId) {
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
  const status = fromComms.suiteScriptTestConnectionStatus(state?.comms, resourceId, ssLinkedConnectionId);
  const message = fromComms.suiteScriptTestConnectionMessage(state?.comms, resourceId, ssLinkedConnectionId);

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

selectors.suiteScriptIntegrationAppInstallerData = (state, id) => {
  if (!state) return null;
  const installer = fromSession.suiteScriptIntegrationAppInstallerData(state.session, id);
  const modifiedSteps = produce(installer.steps || emptyArray, draft => {
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

  return !!isInstallComplete;
};

selectors.userHasManageAccessOnSuiteScriptAccount = (state, ssLinkedConnectionId) => !!selectors.resourcePermissions(state, 'connections', ssLinkedConnectionId)?.edit;

selectors.suiteScriptFlowDetail = (state, {ssLinkedConnectionId, integrationId, flowId}) => {
  const flows = selectors.suiteScriptResourceList(state, {
    resourceType: 'flows',
    integrationId,
    ssLinkedConnectionId,
  });

  return flows?.find(flow => flow._id === flowId);
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
      return emptyArray;
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

  return emptyArray;
});

// #endregion SUITESCRIPT Selectors

// #region  MAPPINGS START

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

selectors.httpAssistantSupportsMappingPreview = (state, importId) => {
  const importResource = selectors.resource(state, 'imports', importId) || emptyObject;
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

  if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(adaptorType)) {
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
  const resourceObj = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'value'
  )?.merged || emptyObject;
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

selectors.mappingGenerates = createSelector([
  (state, importId) => selectors.resource(state, 'imports', importId)?.adaptorType,
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
        emptyArray;
  }

  return emptyArray;
});

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

    return selectors.resource(state, 'connections', importResource?._connectionId);
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

selectors.responseMappingExtracts = (state, resourceId, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  )?.merged || emptyObject;
  const pageProcessor = flow?.pageProcessors && flow?.pageProcessors.find(({_importId, _exportId}) => _exportId === resourceId || _importId === resourceId);

  if (!pageProcessor) {
    return emptyArray;
  }
  const isImport = pageProcessor.type === 'import';
  const resource = selectors.resource(state, isImport ? 'imports' : 'exports', resourceId);

  if (!resource) { return emptyArray; }

  if (isImport) {
    const extractFields = selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      stage: 'responseMappingExtract',
      resourceType: 'imports',
    }).data;

    if (!isEmpty(extractFields)) {
      const extractPaths = getJSONPaths(extractFields);

      return extractPaths.map(obj => ({ name: obj.id, id: obj.id })) || emptyArray;
    }
  }

  return responseMappingUtil.getResponseMappingDefaultExtracts(
    isImport ? 'imports' : 'exports',
    resource.adaptorType
  );
};

// #endregion MAPPING END

// DO NOT DELETE, might be needed later
// selectors.sampleRuleForSQLQueryBuilder = createSelector([
//   (state, { importId}) => {
//     const {merged: importResource = {}} = selectors.resourceData(
//       'imports',
//       importId
//     );

//     return importResource.adaptorType;
//   },
//   (state, { importId}) => {
//     const {merged: importResource = {}} =
//       selectors.resourceData(
//         'imports',
//         importId
//       );
//     const {_connectionId} = importResource;

//     return selectors.resource(state, 'connections', _connectionId);
//   },
//   (state, {importId, flowId}) => selectors.getSampleDataContext(state, {
//     flowId,
//     resourceId: importId,
//     resourceType: 'imports',
//     stage: 'flowInput',
//   }).data,
//   (state, {importId, flowId}) => selectors.getSampleDataContext(state, {
//     flowId,
//     resourceId: importId,
//     resourceType: 'imports',
//     stage: 'importMappingExtract',
//   }).data,
//   (state, {method}) => method,
//   (state, {queryType}) => queryType,
// ], (adaptorType, connection, sampleData, extractFields, method, queryType) => {
//   if (sampleData && extractFields) {
//     const extractPaths = getJSONPaths(extractFields, null, {
//       wrapSpecialChars: true,
//     });

//     if (adaptorType === 'MongodbImport') {
//       return sqlUtil.getSampleMongoDbTemplate(
//         sampleData,
//         extractPaths,
//         method === 'insertMany'
//       );
//     } if (
//       adaptorType === 'DynamodbImport'
//     ) {
//       return sqlUtil.getSampleDynamodbTemplate(
//         sampleData,
//         extractPaths,
//         method === 'putItem'
//       );
//     } if (
//       adaptorType === 'RDBMSImport' && connection?.rdbms?.type === 'snowflake'
//     ) {
//       return sqlUtil.getSampleSnowflakeTemplate(
//         sampleData,
//         extractPaths,
//         queryType === 'INSERT'
//       );
//     }

//     return sqlUtil.getSampleSQLTemplate(
//       sampleData,
//       extractPaths,
//       queryType === 'INSERT'
//     );
//   }
// });

// #region errorManagement selectors

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
          flowDisabled: resourceMap.flows && resourceMap.flows[job._flowId]?.disabled,
        };

        return { ...cJob, ...additionalChildProps };
      });
    }

    const additionalProps = {
      name: resourceMap.flows && resourceMap.flows[job._flowId]?.name,
      flowDisabled: resourceMap.flows && resourceMap.flows[job._flowId]?.disabled,
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
      // If the parent job is queued/in progress, show dummy steps of flows as waiting status
      if ([JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(parentJob.status)) {
        const pendingChildren = getFlowStepsYetToBeCreated(flowObj, parentJob.children);
        const pendingChildrenSteps = generatePendingFlowSteps(pendingChildren, resourceMap);

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

selectors.allJobs = (state, { type }) => fromData.allJobs(state.data, { type });

selectors.flowJobConnections = () => createSelector(
  state => state?.data?.resources?.connections,
  state => state?.data?.resources?.imports,
  state => state?.data?.resources?.exports,
  state => state?.data?.resources?.flows,
  (state, flowId) => flowId,
  (_1, _2, options) => options,
  (connections = emptyArray, imports = emptyArray, exports = emptyArray, flows = emptyArray, flowId, options = {}) => {
    const flow = flows.find(f => f._id === flowId);
    const connectionIds = getAllConnectionIdsUsedInTheFlow(flow, connections, exports, imports, options);

    return connections.filter(c => connectionIds.includes(c._id)).map(c => ({id: c._id, name: c.name}));
  }
);

// Given an errorId, gives back error doc
selectors.resourceError = (state, { flowId, resourceId, isResolved, errorId }) => {
  const { errors = [] } = selectors.allResourceErrorDetails(state, {
    flowId,
    resourceId,
    isResolved,
  });

  return errors.find(error => error.errorId === errorId);
};

selectors.selectedRetryIds = (state, { flowId, resourceId, isResolved }) => {
  const { errors = [] } = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved });

  return errors
    .filter(({ selected, retryDataKey }) => selected && !!retryDataKey)
    .map(error => error.retryDataKey);
};

selectors.selectedErrorIds = (state, { flowId, resourceId, isResolved }) => {
  const { errors = [] } = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved });

  return errors.filter(({ selected }) => selected).map(error => error.errorId);
};

selectors.isAllErrorsSelectedInCurrPage = (state, { flowId, resourceId, isResolved }) => {
  const errorsInCurrPage = selectors.resourceFilteredErrorsInCurrPage(state, {
    flowId,
    resourceId,
    isResolved,
  });
  const errorIds = errorsInCurrPage.map(error => error.errorId);

  return fromSession.isAllErrorsSelected(state && state.session, {
    flowId,
    resourceId,
    isResolved,
    errorIds,
  });
};

selectors.errorFilter = (state, params = {}) => {
  const filterKey = params.isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  return selectors.filter(state, filterKey);
};

selectors.mkResourceFilteredErrorDetailsSelector = () => createSelector(
  selectors.allResourceErrorDetails,
  selectors.errorFilter,
  (errorDetails, errorFilter) => ({
    ...errorDetails,
    errors: getFilteredErrors(errorDetails.errors, errorFilter),
  })
);

selectors.resourceFilteredErrorDetails = selectors.mkResourceFilteredErrorDetailsSelector();

selectors.mkResourceFilteredErrorsInCurrPageSelector = () => {
  const resourceFilteredErrorDetails = selectors.mkResourceFilteredErrorDetailsSelector();

  return createSelector(
    resourceFilteredErrorDetails,
    selectors.errorFilter,
    (allErrors, errorFilter) => {
      const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = errorFilter.paging || {};

      return allErrors.errors.slice(currPage * rowsPerPage, (currPage + 1) * rowsPerPage);
    }
  );
};

selectors.resourceFilteredErrorsInCurrPage = selectors.mkResourceFilteredErrorsInCurrPageSelector();

/**
 * Returns error count per category in a child for IA 1.0
 * A map of titleId and total errors on that category
 */
selectors.integrationErrorsPerSection = createSelector(
  selectors.integrationAppFlowSections,
  (state, integrationId) => selectors.errorMap(state, integrationId)?.data || emptyObject,
  state => state?.data?.resources?.flows,
  (flowSections, integrationErrors, flowsList = emptyArray) =>
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
 * Returns error count per child in an Integration for IA 1.0
 * A map of child id and total errors on that child
 */
selectors.integrationErrorsPerChild = (state, integrationId) => {
  const integrationAppSettings = selectors.integrationAppSettings(state, integrationId) || emptyObject;
  const { supportsMultiStore, sections: children = [] } = integrationAppSettings.settings || {};

  if (!supportsMultiStore) return emptyObject;

  return children.reduce((childErrorsMap, child) => {
    const sectionErrorsMap = selectors.integrationErrorsPerSection(state, integrationId, child.id);

    childErrorsMap[child.id] = Object.values(sectionErrorsMap).reduce(
      (total, count) => total + count,
      0);

    return childErrorsMap;
  }, {});
};

/**
 * Returns error count per flow group in an integration for IAF 2.0 & DIY Flow groupings
 * A map of groupId and total errors on that group
 */
selectors.integrationErrorsPerFlowGroup = createSelector(
  selectors.integrationEnabledFlowIds,
  (state, integrationId) => selectors.errorMap(state, integrationId)?.data || emptyObject,
  state => state?.data?.resources?.flows,
  (enabledFlowIds, errorMap, flowsList) => enabledFlowIds.reduce((groupErrorMap, flowId) => {
    const flow = flowsList.find(f => f._id === flowId);
    const groupId = flow._flowGroupingId || MISCELLANEOUS_SECTION_ID;
    const errorCount = errorMap[flowId] || 0;

    if (!groupErrorMap[groupId]) {
      groupErrorMap[groupId] = 0;
    }
    groupErrorMap[groupId] += errorCount;

    return groupErrorMap;
  }, {})
);

selectors.getIntegrationUserNameById = (state, userId, flowId) => {
  const profile = selectors.userProfile(state) || emptyObject;

  // If it is logged in user , return its name
  if (profile._id === userId) return profile.name || profile.email;
  // else get user name from integration users list
  const integrationId = selectors.resource(state, 'flows', flowId)?._integrationId || 'none';
  const usersList = selectors.availableUsersList(state, integrationId);

  return usersList.find(user => user?.sharedWithUser?._id === userId)?.sharedWithUser?.name;
};

// #endregion errorManagement selectors

// #region Flow builder selectors

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

selectors.mkFlowConnectionList = () => createSelector(
  state => state?.data?.resources?.connections,
  state => state?.data?.resources?.exports,
  state => state?.data?.resources?.imports,
  (state, flowId) => selectors.resource(state, 'flows', flowId),
  (connections = emptyArray, exports = emptyArray, imports = emptyArray, flow) => {
    const connectionIds = getAllConnectionIdsUsedInTheFlow(flow, connections, exports, imports);

    return connections.filter(c => connectionIds.includes(c._id));
  }
);

selectors.mkIsAnyFlowConnectionOffline = () => {
  const flowConnections = selectors.mkFlowConnectionList();

  return createSelector(
    (state, flowId) => flowConnections(state, flowId),
    flowConnections => flowConnections.some(c => c.offline)
  );
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
  const { merged: resource } = selectors.resourceData(
    state,
    'exports',
    resourceId
  );

  if (!resource) return false;

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
    const flowObj = selectors.resourceData(state, 'flows', flowId, 'value')?.merged || emptyObject;

    return !!(flowObj.pageGenerators &&
              flowObj.pageGenerators[0] &&
              flowObj.pageGenerators[0].application === 'dataLoader');
  }
  const resourceObj = selectors.resourceData(
    state,
    'exports',
    resourceId,
    'value'
  )?.merged || emptyObject;

  return resourceObj.type === 'simple';
};

selectors.isFreeFlowResource = (state, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;

  const isFreeFlow = isFreeFlowResource(flow);

  return isFreeFlow;
};

selectors.isFlowViewMode = (state, integrationId, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;
  const isIAType = isIntegrationApp(flow);

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
  const { pageGenerators = [] } = flow || emptyObject;

  return flowDetails.isSimpleImport ||
  (pageGenerators.length && pageGenerators[0].application === 'dataLoader');
};

selectors.shouldShowAddPageProcessor = (state, flowId) => {
  const flow = selectors.resourceData(state,
    'flows',
    flowId
  ).merged;

  const { pageProcessors = [], pageGenerators = [] } = flow || {};
  const isDataLoaderFlow = selectors.isDataLoaderFlow(state, flowId);

  const showAddPageProcessor =
    !isDataLoaderFlow ||
    !!(pageProcessors.length === 0 &&
      pageGenerators.length &&
      pageGenerators[0]._exportId);

  return showAddPageProcessor;
};

/*
 * Returns boolean true/false whether it is a lookup export or not based on passed flowId and resourceType
 */
selectors.isLookUpExport = (state, { flowId, resourceId, resourceType }) => {
  // If not an export , then it is not a lookup
  if (resourceType !== 'exports' || !resourceId) return false;

  // Incase of a new resource , check for isLookup flag on resource patched for new lookup exports
  // Also for existing exports ( newly created after Flow Builder feature ) have isLookup flag
  const { merged: resourceObj } = selectors.resourceData(
    state,
    'exports',
    resourceId
  );

  // If exists it is a lookup
  if (resourceObj?.isLookup) return true;

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
  const { merged: resource } = selectors.resourceData(
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
  } else if (resourceType === 'connectorLicenses' && resource.type === 'integrationAppChild') {
    resourceLabel = 'Child License';
  } else {
    resourceLabel = MODEL_PLURAL_TO_LABEL[resourceType];
  }

  if (!resource) { return ''; }
  // Incase of Flow context, 2nd step of PG/PP creation resource labels handled here
  // The Below resource labels override the default labels above
  if (flowId && isNewResource) {
    if (resource.resourceType === 'exportRecords') {
      resourceLabel = 'Export';
    } else if (
      ['transferFiles', 'lookupFiles'].includes(resource.resourceType)
    ) {
      resourceLabel = 'Transfer';
    } else if (['webhook', 'realtime'].includes(resource.resourceType)) {
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
      ].includes(resource.adaptorType) &&
        resource.type === 'blob') ||
        (isFileAdaptor(resource) && resource.adaptorType.includes('Export')) ||
      ([
        'RESTImport',
        'HTTPImport',
        'NetSuiteImport',
        'SalesforceImport',
      ].indexOf(resource.adaptorType) >= 0 &&
        resource.blob) ||
        (isFileAdaptor(resource) && resource.adaptorType.includes('Import'))
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
// #endregion Flow builder selectors

// #region connection log selectors

selectors.flowConnectionsWithLogEntry = () => {
  const flowConnections = selectors.mkFlowConnectionList();

  return createSelector(
    (state, flowId) => flowConnections(state, flowId),
    state => selectors.allConnectionsLogs(state),
    (flowConnections, allConnectionsLog) => flowConnections.filter(({_id}) => !!allConnectionsLog[_id])
  );
};
// #endregion connection log selectors

// #region AFE selectors
selectors.editorHelperFunctions = state => state?.session?.editors?.helperFunctions || {};

// this selector returns true if the field/editor supports only AFE2.0 data
selectors.editorSupportsOnlyV2Data = (state, editorId) => {
  const {editorType, fieldId, flowId, resourceId, resourceType, stage} = fromSession.editor(state?.session, editorId);
  const isPageGenerator = selectors.isPageGenerator(state, flowId, resourceId, resourceType);

  if (stage === 'outputFilter' ||
    stage === 'exportFilter' ||
    stage === 'inputFilter') return true;

  // no use case yet where any PG field supports only v2 data
  if (isPageGenerator) return false;

  if (editorType === 'csvGenerator' || fieldId === 'file.backupPath' || fieldId === 'traceKeyTemplate') return true;

  return false;
};

selectors.isEditorDisabled = (state, editorId) => {
  const editor = fromSession.editor(state?.session, editorId);
  const {flowId, fieldId, formKey, editorType, activeProcessor} = editor;
  const flow = selectors.resource(state, 'flows', flowId);
  const integrationId = flow?._integrationId || 'none';

  // if we are on form field then form state determines disabled
  if (formKey) {
    const fieldState = selectors.fieldState(state, formKey, fieldId);

    if (fieldState) {
      // Currently, many IA settings of type expression has disabled property as true and they shouldn't
      // be disabled. We added this below check temporarily and once IA fixes, we can remove the below code.
      // reference for IA tracker: https://celigo.atlassian.net/browse/SFNSIO-1127
      if (fieldState.type === 'iaexpression') {
        return false;
      }

      return fieldState.disabled;
    }
  }

  // if we are on FB actions, below logic applies
  // for input and output filter, the filter processor(not the JS processor) uses isMonitorLevelAccess check
  if (activeProcessor === 'filter' && (editorType === 'inputFilter' || editorType === 'outputFilter')) {
    const isMonitorLevelAccess = selectors.isFormAMonitorLevelAccess(state, integrationId);

    return isMonitorLevelAccess;
  }
  const isViewMode = selectors.isFlowViewMode(state, integrationId, flowId);
  const isFreeFlow = selectors.isFreeFlowResource(state, flowId);

  return isViewMode || isFreeFlow;
};

selectors.isEditorLookupSupported = (state, editorId) => {
  const editor = fromSession.editor(state?.session, editorId);
  const {resultMode, fieldId, editorType, resourceType} = editor;
  const fieldsWhichNotSupportlookup = [
    '_body',
    '_postBody',
    '_relativeURI',
    '_query',
    'file.xml.body',
  ];
  const uriFields = [
    'http.relativeURI',
    'rest.relativeURI',
  ];

  // lookups are only valid for http request body and sql query import fields (but not for lookup fields inside those)
  // and other text result fields
  if (resourceType !== 'imports') {
    return false;
  }
  if (uriFields.includes(fieldId)) {
    return true;
  }

  if (fieldsWhichNotSupportlookup.includes(fieldId) || (resultMode === 'text' && editorType !== 'sql' && editorType !== 'databaseMapping')) {
    return false;
  }

  return true;
};

// this selector returns if BE supports the /getContext
// for passed stage and field
// //TODO: update the logic here once BE trackers
// IO-19867 and IO-19868 are complete
selectors.shouldGetContextFromBE = (state, editorId, sampleData) => {
  const editor = fromSession.editor(state?.session, editorId);
  const {stage, resourceId, resourceType, flowId, fieldId} = editor;
  const resource = selectors.resourceData(
    state,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const connection = selectors.resource(state, 'connections', resource._connectionId);
  let _sampleData = null;
  const isPageGenerator = selectors.isPageGenerator(state, flowId, resourceId, resourceType);

  if (FLOW_STAGES.includes(stage) || HOOK_STAGES.includes(stage)) {
    _sampleData = sampleData;
  } else if (isPageGenerator) {
    // for PGs, no sample data is shown
    _sampleData = undefined;
  } else {
    // for all PPs, default sample data is shown in case its empty
    _sampleData = { data: sampleData || { myField: 'sample' }};
  }

  // for lookup fields, BE doesn't support v1/v2 yet
  if (fieldId?.startsWith('lookup') || fieldId?.startsWith('_')) {
    return {shouldGetContextFromBE: false, sampleData: _sampleData};
  }

  // TODO: BE would be deprecating native REST adaptor as part of IO-19864
  // we can remove this logic from UI as well once that is complete
  if (['RESTImport', 'RESTExport'].includes(resource.adaptorType)) {
    if (!connection.isHTTP && (stage === 'outputFilter' || stage === 'exportFilter' || stage === 'inputFilter')) {
      // native REST adaptor filters
      return {
        shouldGetContextFromBE: false,
        sampleData: Array.isArray(_sampleData) ? {
          rows: _sampleData,
        } : {
          record: _sampleData,
        },
      };
    }
  }
  if (stage === 'transform' ||
  stage === 'sampleResponse' || stage === 'importMappingExtract' || HOOK_STAGES.includes(stage)) {
    return {shouldGetContextFromBE: false, sampleData: _sampleData};
  }

  return {shouldGetContextFromBE: true};
};

// #endregion AFE selectors

selectors.applicationName = (state, _expOrImpId) => {
  if (!_expOrImpId) return;
  const exportsList = selectors.resourceList(state, {
    type: 'exports',
  }).resources;
  const resourceType = exportsList.find(e => e._id === _expOrImpId) ? 'exports' : 'imports';
  const resource = selectors.resource(state, resourceType, _expOrImpId);

  if (!resource) return;
  const { _connectionId, type } = resource;

  if (type === 'simple') {
    return 'Data loader';
  }

  let appType;

  if (!_connectionId) {
    appType = type;
  } else {
    const connection = selectors.resource(state, 'connections', _connectionId) || {};

    appType = connection.assistant || connection.rdbms?.type || connection.type;
  }

  return getApp(appType)?.name;
};

selectors.sourceOptions = createSelector(
  state => selectors.getSourceMetadata(state),
  (state, resourceId) => selectors.applicationName(state, resourceId),
  (sources, applicationName) => getSourceOptions(sources, applicationName)
);

selectors.isConnectionLogsNotSupported = (state, connectionId) => {
  const connectionResource = selectors.resource(state, 'connections', connectionId);

  return ['wrapper', 'dynamodb', 'mongodb'].includes(connectionResource?.type);
};

selectors.tileLicenseDetails = (state, tile) => {
  const licenses = selectors.licenses(state);
  const license = tile._connectorId && tile._integrationId && licenses.find(l => l._integrationId === tile._integrationId);
  const expiresInDays = license && remainingDays(license.expires);
  const trialExpiresInDays = license && remainingDays(license.trialEndDate);

  let licenseMessageContent = '';
  let expired = false;
  let trialExpired = false;
  let showTrialLicenseMessage = false;
  const resumable = license?.resumable;

  if (resumable) {
    licenseMessageContent = 'Your subscription has been renewed. Click Reactivate to continue.';
  } else if (!license?.expires && license?.trialEndDate && trialExpiresInDays <= 0) {
    licenseMessageContent = `Trial expired on ${moment(license.trialEndDate).format('MMM Do, YYYY')}`;
    showTrialLicenseMessage = true;
    trialExpired = true;
  } else if (!license?.expires && license?.trialEndDate && trialExpiresInDays > 0) {
    licenseMessageContent = `Trial expires in ${trialExpiresInDays} days.`;
    showTrialLicenseMessage = true;
  } else if (expiresInDays <= 0) {
    expired = true;
    licenseMessageContent = `Your license expired on ${moment(license.expires).format('MMM Do, YYYY')}. Contact sales to renew your license.`;
  } else if (expiresInDays > 0 && expiresInDays <= 30) {
    licenseMessageContent = `Your license will expire in ${expiresInDays} day${expiresInDays === 1 ? '' : 's'}. Contact sales to renew your license.`;
  }

  return {licenseMessageContent, expired, trialExpired, showTrialLicenseMessage, resumable, licenseId: license?._id};
};

// #region listener request logs selectors
selectors.hasLogsAccess = (state, resourceId, resourceType, isNew, flowId) => {
  if (resourceType !== 'exports' || !flowId) return false;
  const resource = selectors.resource(state, 'exports', resourceId);

  if (!isRealtimeExport(resource)) return false;

  return !isNew;
};

selectors.canEnableDebug = (state, exportId, flowId) => {
  if (!exportId || !flowId) return false;

  const flow = selectors.resource(state, 'flows', flowId);

  const userPermissionsOnIntegration = selectors.resourcePermissions(state, 'integrations', flow?._integrationId)?.accessLevel;

  if (userPermissionsOnIntegration && userPermissionsOnIntegration !== INTEGRATION_ACCESS_LEVELS.MONITOR) return true;

  const resource = selectors.resource(state, 'exports', exportId) || {};

  // webhook exports have no attached connection
  if (resource.type === 'webhook') {
    return false;
  }

  const userPermissionsOnConnection = selectors.resourcePermissions(state, 'connections', resource._connectionId)?.edit;

  return !!userPermissionsOnConnection;
};

selectors.mkLogsInCurrPageSelector = () => createSelector(
  selectors.logsSummary,
  state => selectors.filter(state, LISTENER_LOG_FILTER_KEY),
  (debugLogsList, filterOptions) => {
    const { currPage = 0 } = filterOptions.paging || {};

    return debugLogsList.slice(currPage * LISTENER_LOG_DEFAULT_ROWS_PER_PAGE, (currPage + 1) * LISTENER_LOG_DEFAULT_ROWS_PER_PAGE);
  }
);

// #endregion listener request logs selectors

selectors.assistantName = (state, resourceType, resourceId) => {
  const _resource = selectors.resource(state, resourceType, resourceId);

  if (!_resource) {
    return;
  }
  const conn = selectors.resource(state, 'connections', _resource._connectionId);

  return _resource.assistant || conn?.assistant;
};

selectors.recordTypeForAutoMapper = (state, resourceType, resourceId, subRecordMappingId) => {
  const resource = selectors.resource(state, resourceType, resourceId);

  if (!resource?.adaptorType) {
    return '';
  }
  if (['NetSuiteDistributedImport', 'NetSuiteImport'].includes(resource.adaptorType)) {
    return selectors.mappingNSRecordType(state, resourceId, subRecordMappingId);
  }
  if (resource.adaptorType === 'NetSuiteExport') {
    const netsuiteType = resource.netsuite?.type === 'distributed' ? 'distributed' : 'restlet';

    return resource.netsuite[netsuiteType]?.recordType;
  }
  if (['SalesforceExport', 'SalesforceImport'].includes(resource.adaptorType)) {
    const { sObjectType } = resource.salesforce;

    return sObjectType;
  }
  const assistantName = selectors.assistantName(state, resourceType, resourceId);

  if (assistantName && AUTO_MAPPER_ASSISTANTS_SUPPORTING_RECORD_TYPE.indexOf(assistantName) !== -1) {
    return mappingUtil.autoMapperRecordTypeForAssistant(resource);
  }

  return '';
};

// #region sso selectors
selectors.oidcSSOClient = state => state?.data?.resources?.ssoclients?.find(client => client.type === 'oidc');

selectors.isSSOEnabled = state => {
  const oidcClient = selectors.oidcSSOClient(state);

  if (!oidcClient) return false;

  return !oidcClient.disabled;
};

selectors.userLinkedSSOClientId = state => {
  if (selectors.isAccountOwner(state)) {
    return selectors.oidcSSOClient(state)?._id;
  }
  const profile = selectors.userProfile(state) || emptyObject;

  return profile.authTypeSSO?._ssoClientId;
};

selectors.isUserAllowedOnlySSOSignIn = state => {
  if (selectors.isAccountOwner(state)) {
    return false;
  }
  const linkedSSOClientId = selectors.userLinkedSSOClientId(state);

  if (!linkedSSOClientId) {
    return false;
  }
  const orgAccounts = state?.user?.org?.accounts?.filter(acc => acc._id !== ACCOUNT_IDS.OWN);
  const ssoLinkedAccount = orgAccounts?.find(acc => acc.ownerUser?._ssoClientId === linkedSSOClientId);

  return !!ssoLinkedAccount?.accountSSORequired;
};

selectors.isUserAllowedOptionalSSOSignIn = state => {
  if (selectors.isAccountOwner(state)) {
    return selectors.isSSOEnabled(state);
  }
  const linkedSSOClientId = selectors.userLinkedSSOClientId(state);

  if (!linkedSSOClientId) return false;
  if (linkedSSOClientId) {
    const orgAccounts = state?.user?.org?.accounts?.filter(acc => acc._id !== ACCOUNT_IDS.OWN);
    const ssoLinkedAccount = orgAccounts?.find(acc => acc.ownerUser?._ssoClientId === linkedSSOClientId);

    // _ssoClientId matched owner's account ashare has accountSSORequired - false
    return !!(ssoLinkedAccount && !ssoLinkedAccount.accountSSORequired);
  }
};
// #endregion sso selectors

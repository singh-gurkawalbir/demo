import uniqBy from 'lodash/uniqBy';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import { map, isEmpty, uniq, get} from 'lodash';
import sift from 'sift';
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
  getAllConnectionIdsUsedInTheFlow,
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
  addLastExecutedAtSortableProp,
  shouldHaveUnassignedSection,
  getPageProcessorFromFlow,
  getAllPageProcessors,
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
  UNASSIGNED_SECTION_ID,
  NO_ENVIRONMENT_RESOURCE_TYPES,
  NO_ENVIRONMENT_MODELS_FOR_BIN, HOME_PAGE_PATH,
  AFE_SAVE_STATUS,
  UNASSIGNED_SECTION_NAME,
  emptyList,
  MAX_DATA_RETENTION_PERIOD,
} from '../constants';
import { message } from '../utils/messageStore';
import { upgradeButtonText, expiresInfo, isNextTheHighestPlan } from '../utils/license';
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
  rdbmsSubTypeToAppType,
  getResourceFromAlias,
  finalSuccessMediaType,
} from '../utils/resource';
import { convertFileDataToJSON, wrapSampleDataWithContext } from '../utils/sampleData';
import {
  getAvailablePreviewStages,
  isPreviewPanelAvailable,
} from '../utils/exportPanel';
import getRoutePath from '../utils/routePaths';
import { getIntegrationAppUrlName, getTitleFromEdition, getTitleIdFromSection, isIntegrationAppVersion2 } from '../utils/integrationApps';
import mappingUtil, { applyRequiredFilter, applyMappedFilter, applySearchFilter, countMatches } from '../utils/mapping';
import responseMappingUtil from '../utils/responseMapping';
import { suiteScriptResourceKey, isJavaFlow } from '../utils/suiteScript';
import { stringCompare, comparer } from '../utils/sort';
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
import { getApp, getHttpConnector, applicationsList} from '../constants/applications';
import { HOOK_STAGES } from '../utils/editor';
import { getTextAfterCount } from '../utils/string';
import { remainingDays } from './user/org/accounts';
import { FILTER_KEY as FLOWSTEP_LOG_FILTER_KEY, DEFAULT_ROWS_PER_PAGE as FLOWSTEP_LOG_DEFAULT_ROWS_PER_PAGE } from '../utils/flowStepLogs';
import { AUTO_MAPPER_ASSISTANTS_SUPPORTING_RECORD_TYPE, isAmazonSellingPartnerConnection } from '../utils/assistant';
import {FILTER_KEYS_AD} from '../utils/accountDashboard';
import { getSelectedRange } from '../utils/flowMetrics';
import { FILTER_KEY as HOME_FILTER_KEY, LIST_VIEW, sortTiles, getTileId, tileCompare } from '../utils/home';
import { getTemplateUrlName } from '../utils/template';
import { filterMap } from '../components/GlobalSearch/filterMeta';
import { getRevisionFilterKey, getFilteredRevisions, getPaginatedRevisions, REVISION_DIFF_ACTIONS } from '../utils/revisions';
import { buildDrawerUrl, drawerPaths } from '../utils/rightDrawer';
import { GRAPHQL_HTTP_FIELDS, isGraphqlResource } from '../utils/graphql';
import { initializeFlowForReactFlow, getFlowAsyncKey } from '../utils/flows/flowbuilder';
import { HTTP_BASED_ADAPTORS } from '../utils/http';
import { getAuditLogFilterKey } from '../constants/auditLog';
import { SHOPIFY_APP_STORE_LINKS } from '../constants/urls';
import customCloneDeep from '../utils/customCloneDeep';
import { convertUtcToTimezone } from '../utils/date';

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
      case actionTypes.AUTH.CLEAR_STORE:
        Object.keys(draft).forEach(key => {
          // delete everything except for app and auth
          if (key !== 'app' && key !== 'auth') {
            delete draft[key];
          }
        });

        break;

      case actionTypes.APP.DELETE_DATA_STATE:
        delete draft.data;
        delete draft.session.loadResources;

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
      showRelativeDateTime,
      developer,
      phone,
      dateFormat,
      timezone,
      timeFormat,
      scheduleShiftForFlowsCreatedAfter,
      // eslint-disable-next-line camelcase
      auth_type_google,
      _ssoAccountId,
      authTypeSSO,
      colorTheme,
      helpContent,
      showIconView,
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
      showRelativeDateTime,
      _ssoAccountId,
      authTypeSSO,
      colorTheme,
      helpContent,
      showIconView,
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

selectors.integrationInstallSteps = createSelector(
  (state, integrationId) => fromData.integrationInstallSteps(state?.data, integrationId),
  (state, integrationId) => fromSession.integrationAppsInstaller(state?.session, integrationId),
  (state, integrationId) => selectors.integrationAppSettings(state, integrationId)?._connectorId,
  (integrationInstallSteps, installStatus, _connectorId) => {
    const visibleSteps = integrationInstallSteps.filter(s => s.type !== 'hidden');

    const installSteps = visibleSteps.map(step => {
      if (step.isCurrentStep) {
        return { ...step, ...installStatus };
      }

      return step;
    });

    // Incase of IAs, return the install steps
    if (_connectorId) return installSteps;
    // Else do below changes to the install steps incase of a template
    // @Sravan review the logic below - moved from the component
    const bundleInstallationForNetsuiteConnections = installSteps.filter(step => step.sourceConnection?.type === 'netsuite');
    const bundleInstallationForSalesforceConnections = installSteps.filter(step => step.sourceConnection?.type === 'salesforce');

    let netsuiteConnIndex = 0;
    let salesforceConnIndex = 0;

    const useNewImplementationForNetSuiteURLSteps = installSteps.some(installStep => installStep.type === 'url' && (installStep.name.startsWith('Integrator Bundle') || installStep.name.startsWith('Integrator SuiteApp')) && installStep?.sourceConnection?._id);
    // passing connectionId as _connId in case of 'Integrator Bundle' and 'Integrator Adaptor Package'

    return installSteps.map(step => {
      if (step.installURL || step.url) {
        if (step.name.startsWith('Integrator Bundle') || step.name.startsWith('Integrator SuiteApp')) {
          if (useNewImplementationForNetSuiteURLSteps) {
            const matchingNetSuiteConnection = installSteps.find(installStep => installStep?.sourceConnection?._id === step?.sourceConnection?._id);

            return {
              ...step,
              _connId: matchingNetSuiteConnection?._connectionId,
            };
          }

          return {
            ...step,
            // eslint-disable-next-line no-plusplus
            _connId: bundleInstallationForNetsuiteConnections[netsuiteConnIndex++]?._connectionId,
          };
        } if (step.name.includes('Integrator Adaptor Package')) {
          const connectionId = bundleInstallationForSalesforceConnections[salesforceConnIndex]?._connectionId;

          salesforceConnIndex += 1;

          return {
            ...step,
            _connId: connectionId,
          };
        }
      }

      return step;
    });
  }
);
selectors.integrationChangeEditionSteps = createSelector(
  (state, integrationId) => fromSession.changeEditionSteps(state?.session, integrationId),
  (state, integrationId) => fromData.integrationChangeEditionSteps(state?.data, integrationId),
  (state, integrationId) => fromSession.v2integrationAppsInstaller(state?.session, integrationId),
  (state, integrationId) => selectors.integrationAppSettings(state, integrationId)?._connectorId,
  (steps, integrationChangeEditionSteps, changeEditionStepsStatus, _connectorId) => {
    const visibleSteps = (steps.length
      ? steps
      : integrationChangeEditionSteps)
      .filter(s => s.type !== 'hidden');

    const changeEditionSteps = visibleSteps.map(step => {
      if (step.isCurrentStep) {
        return { ...step, ...changeEditionStepsStatus };
      }

      return step;
    });

    if (_connectorId) return changeEditionSteps;
    const bundleInstallationForNetsuiteConnections = changeEditionSteps.filter(step => step.sourceConnection?.type === 'netsuite');
    const bundleInstallationForSalesforceConnections = changeEditionSteps.filter(step => step.sourceConnection?.type === 'salesforce');

    let netsuiteConnIndex = 0;
    let salesforceConnIndex = 0;
    // passing connectionId as _connId in case of 'Integrator Bundle' and 'Integrator Adaptor Package'

    return changeEditionSteps.map(step => {
      if (step.installURL || step.url) {
        if (
          step.name.includes('Integrator Bundle')
        ) {
          const connectionId = bundleInstallationForNetsuiteConnections[netsuiteConnIndex]?._connectionId;

          netsuiteConnIndex += 1;

          return {
            ...step,
            _connId: connectionId,
          };
        } if (step.name.includes('Integrator Adaptor Package')) {
          const connectionId = bundleInstallationForSalesforceConnections[salesforceConnIndex]?._connectionId;

          salesforceConnIndex += 1;

          return {
            ...step,
            _connId: connectionId,
          };
        }
      }

      return step;
    });
  }
);

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

selectors.currentStepPerMode = (state, { mode, integrationId, revisionId, cloneResourceId, cloneResourceType }) => {
  let steps = [];

  if (mode === 'install') {
    steps = selectors.integrationInstallSteps(state, integrationId);
  } else if (mode === 'child') {
    steps = selectors.addNewChildSteps(state, integrationId)?.steps;
  } else if (mode === 'uninstall') {
    steps = selectors.integrationUninstallSteps(state, { integrationId, isFrameWork2: true })?.steps;
  } else if (mode === 'clone') {
    steps = selectors.cloneInstallSteps(state, cloneResourceType, cloneResourceId);
  } else if (mode === 'revision') {
    steps = selectors.currentRevisionInstallSteps(state, integrationId, revisionId);
  }

  return (steps || []).find(s => !!s.isCurrentStep);
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
  let redirectTo = HOME_PAGE_PATH;
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

selectors.templateInstallSteps = createSelector(
  (state, templateId) => state?.session?.templates?.[templateId]?.installSteps,
  (templateInstallSteps = emptyArray) => produce(templateInstallSteps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  })
);

selectors.cloneInstallSteps = (state, resourceType, resourceId) => selectors.templateInstallSteps(state, `${resourceType}-${resourceId}`);

// #endregion Template, Cloning, installation and uninstallation selectors

// #region AUTHENTICATION SELECTORS
selectors.isAuthenticated = state => !!(state && state.auth && state.auth.authenticated);

selectors.isDefaultAccountSet = state => !!(state && state.auth && state.auth.defaultAccountSet);

selectors.isAuthInitialized = state => !!(state && state.auth && state.auth.initialized);
selectors.isUserLoggedInDifferentTab = state => !!(state && state.auth && state.auth.userLoggedInDifferentTab);

selectors.authenticationErrored = state => state?.auth?.failure;

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

selectors.mkTileApplications = () => {
  const resourceSel = selectors.makeResourceSelector();

  return createSelector(
    (_, tile) => tile,
    state => state?.data?.resources?.integrations,
    state => state?.data?.resources?.connections,
    (state, tile) => selectors.isIntegrationAppVersion2(state, tile?._integrationId, true),
    (state, tile) => resourceSel(state, 'integrations', tile?._integrationId),
    state => selectors.isHomeListView(state),
    (tile, integrations = emptyArray, connections = emptyArray, isIAV2, integration, isListView) => {
      let applications = [];

      if (!tile || (!isListView && !tile._connectorId)) {
        return emptyArray;
      }
      if (!tile._connectorId) {
        tile?._registeredConnectionIds?.forEach(r => {
          const connection = connections.find(c => c._id === r);

          if (connection) {
            if (connection.assistant) {
              applications.push(connection.assistant);
            } else if (getHttpConnector(connection?.http?._httpConnectorId)) {
              const apps = applicationsList();
              const app = apps.find(a => a._httpConnectorId === connection?.http?._httpConnectorId) || {};

              applications.push(app.id || 'http');
            } else {
              applications.push(connection.rdbms?.type || connection?.http?.formType || connection.jdbc?.type || connection.type);
            }
          }
        });

        return uniq(applications);
      }

      if (!isIAV2) {
        applications = [...(tile?.connector?.applications || [])] || emptyArray;
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
            applications.push(c.assistant || c.rdbms?.type || c.http?.formType || c.jdbc?.type || c.type);
          });
        });

        const parentIntegrationConnections = connections.filter(c => c._integrationId === parentIntegration._id);

        parentIntegrationConnections.forEach(c => {
          applications.push(c.assistant || c.rdbms?.type || c.jdbc?.type || c.http?.formType || c.jdbc?.type || c.type);
        });
        applications = uniq(applications);
      }

      // Make NetSuite always the last application only for tile view
      if (applications.length && !isListView) { applications.push(applications.splice(applications.indexOf('netsuite'), 1)[0]); }
      // Only consider up to four applications only for tile view
      if (applications.length > 4 && !isListView) {
        applications.length = 4;
      }

      return applications;
    }
  );
};

const filterByEnvironmentResources = (resources, sandbox, resourceType) => {
  const filterByEnvironment = typeof sandbox === 'boolean';

  if (!filterByEnvironment) { return resources; }

  if (resourceType === 'recycleBinTTL') {
    // NO_ENVIRONMENT_MODELS_FOR_BIN are common for sandbox and production,
    // so should be visible at both places

    return resources.filter(r => {
      if (NO_ENVIRONMENT_MODELS_FOR_BIN.includes(r.model)) return true;

      return !!r.doc?.sandbox === sandbox;
    });
  }

  // https://celigo.atlassian.net/browse/IO-31027 - remove this change in R2-2023
  if (resourceType === 'scripts') {
    return resources.filter(r => !r?.hasOwnProperty('sandbox') || !!r.sandbox === sandbox);
  }

  return resources.filter(r => !!r.sandbox === sandbox);
};

selectors.makeResourceListSelector = () =>
  createSelector(
    selectors.currentEnvironment,
    (state, options) => {
      const type = options?.type;

      if (!state || !type || typeof type !== 'string') { return null; }

      return selectors.resourceState(state)?.[type];
    },
    (_, options) => options,
    (currentEnvironment, resources, options) => {
      const result = {
        resources: [],
        total: 0,
        filtered: 0,
        count: 0,
      };

      if (!options) return result;
      const { type, take, keyword, sort, ignoreEnvironmentFilter, filter, searchBy } = options;

      let {sandbox} = options;

      // NO_ENVIRONMENT_RESOURCE_TYPES resources are common for both production & sandbox environments.
      if (
        !ignoreEnvironmentFilter &&
        !NO_ENVIRONMENT_RESOURCE_TYPES.includes(type)
      ) {
        // eslint-disable-next-line no-param-reassign
        sandbox = currentEnvironment === 'sandbox';
      }
      result.type = type;

      if (!resources) {
        return result;
      }

      // TODO: what is the siginificance of this
      // if (type === 'ui/assistants') {
      //   return state[type];
      // }

      result.total = resources.length;
      result.count = resources.length;

      function searchKey(resource, key) {
        if (key === 'environment') {
          return get(resource, 'sandbox') ? 'Sandbox' : 'Production';
        }

        const value = get(resource, key);

        return typeof value === 'string' ? value : '';
      }

      const stringTest = r => {
        if (!keyword) return true;
        const searchableText =
            Array.isArray(searchBy) && searchBy.length
              ? `${searchBy.map(key => searchKey(r, key)).join('|')}`
              : `${r._id}|${r.name}|${r.description}`;

        return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
      };
      const matchTest = rOrig => {
        const r = type === 'recycleBinTTL' ? rOrig?.doc : rOrig;

        return stringTest(r);
      };

      const comparer = ({ order, orderBy }) =>
        order === 'desc' ? stringCompare(orderBy, true) : stringCompare(orderBy);
        // console.log('sort:', sort, resources.sort(comparer, sort));
      const sorted = sort ? [...resources].sort(comparer(sort)) : resources;

      const filteredByEnvironment = filterByEnvironmentResources(sorted, sandbox, type);

      const filtered = filteredByEnvironment.filter(
        filter ? sift({ $and: [filter, matchTest] }) : matchTest
      );

      result.filtered = filtered.length;
      result.resources = filtered;

      if (typeof take !== 'number' || take < 1) {
        return result;
      }

      const slice = filtered.slice(0, take);

      return {
        ...result,
        resources: slice,
        count: slice.length,
      };
    }
  );

selectors.resourceList = selectors.makeResourceListSelector();

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
selectors.mkFlowGroupingsTiedToIntegrations = () => {
  const resourceSel = selectors.makeResourceSelector();

  return createSelector(
    (state, id) => resourceSel(state, 'integrations', id)?.flowGroupings,
    flowGroupings => flowGroupings || [],
  );
};

selectors.mkGetSortedScriptsTiedToFlow = () => {
  const scriptsTiedToFlowSelector = selectors.mkGetScriptsTiedToFlow();

  return createSelector(
    scriptsTiedToFlowSelector,
    (state, _1, filterKey) => state?.session?.filters?.[filterKey],
    (scripts, scriptsFilter) => {
      const comparer = ({ order, orderBy }) => stringCompare(orderBy, order === 'desc');

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

selectors.getAnyValidFlowFromEventReport = (state, eventReport) => {
  const foundFlow = eventReport._flowIds.find(flowId => selectors.resource(state, 'flows', flowId));

  return selectors.resource(state, 'flows', foundFlow);
};

selectors.getEventReportIntegrationName = (state, r) => {
  const flow = selectors.getAnyValidFlowFromEventReport(state, r);

  // if flow is deleted then we cannot find the integrationId
  if (!flow) return '';
  const integrationId = flow?._integrationId;

  const integration = selectors.resource(state, 'integrations', integrationId);

  // if there is no integration associated to a flow then its a standalone flow

  return integration?.name || STANDALONE_INTEGRATION.name;
};

selectors.showNotificationForTechAdaptorForm = (state, resourceId) => {
  const staggedPatches = selectors.stagedResource(state, resourceId)?.patch;
  const connectionId = staggedPatches?.find(p => p.op === 'replace' && p.path === '/_connectionId')?.value;
  const connection = selectors.resource(state, 'connections', connectionId);

  if (isAmazonSellingPartnerConnection(connection)) return false;

  return !!staggedPatches?.find(
      p => p.op === 'replace' && p.path === '/useTechAdaptorForm'
    )?.value;
};

// It will give list of flows which to be displayed in flows filter in account dashboard.
selectors.getAllAccountDashboardFlows = (state, filterKey, integrationId) => {
  let allFlows = selectors.resourceList(state, {
    type: 'flows',
  }).resources || [];
  let allStoreFlows = [];
  const jobFilter = selectors.filter(state, filterKey);

  let storeId;
  let parentIntegrationId;
  let selectedIntegrations;

  if (integrationId) {
    selectedIntegrations = [integrationId];
  } else {
    selectedIntegrations = jobFilter?.integrationIds?.filter(i => i !== 'all') || [];
  }

  // In IA 1.0, if any one select stores, the store will be stored as "store{$storeID}pid{#integrationId}"
  // below logic is used to extact store id and integration id from this.
  const selectedStores = selectedIntegrations.filter(i => {
    if (!i.includes('store')) return false;
    storeId = i.substring(5, i.indexOf('pid'));
    parentIntegrationId = i.substring(i.indexOf('pid') + 3);

    return !(selectedIntegrations.includes(parentIntegrationId));
  });

  // eslint-disable-next-line no-restricted-syntax
  for (const s of selectedStores) {
    storeId = s.substring(5, s.indexOf('pid'));
    parentIntegrationId = s.substring(s.indexOf('pid') + 3);
    allStoreFlows = [...allStoreFlows, ...selectors.integrationAppFlowIds(state,
      parentIntegrationId,
      storeId
    )];
  }
  if (selectedIntegrations.length) {
    allFlows = allFlows.filter(f => {
      if (selectedIntegrations.includes('none') && !f._integrationId) {
        return true;
      }
      if (allStoreFlows.includes(f._id)) {
        return true;
      }

      return selectedIntegrations.includes(f._integrationId);
    });
  }

  const defaultFilter = [{ _id: 'all', name: 'All flows'}];

  if (!allFlows) { return defaultFilter; }

  allFlows = uniqBy(allFlows, '_id').sort(stringCompare('name'));
  allFlows = [...defaultFilter, ...allFlows];

  return allFlows;
};
selectors.accountDashboardJobs = (state, filterKey) => {
  const {jobs: totalRunningJobs, nextPageURL: runningNextPageURL, status: runnningStatus} = selectors.runningJobs(state);

  const {jobs: totalCompletedJobs, nextPageURL: completedNextPageURL, status: completedStatus} = selectors.completedJobs(state);

  const totalJobs = filterKey === FILTER_KEYS_AD.RUNNING ? totalRunningJobs : totalCompletedJobs;
  const nextPageURL = filterKey === FILTER_KEYS_AD.RUNNING ? runningNextPageURL : completedNextPageURL;

  const status = filterKey === FILTER_KEYS_AD.RUNNING ? runnningStatus : completedStatus;

  return {jobs: totalJobs, nextPageURL, status};
};
selectors.requestOptionsOfDashboardJobs = (state, {filterKey, nextPageURL, integrationId }) => {
  let path;

  if (nextPageURL) {
    path = nextPageURL.replace('/api', '');
  } else {
    path = filterKey === FILTER_KEYS_AD.RUNNING ? '/jobs/current' : '/flows/runs/stats';
  }
  const jobFilter = selectors.filter(state, `${integrationId || ''}${filterKey}`);

  const userPreferences = selectors.userPreferences(state);
  const sandbox = userPreferences.environment === 'sandbox';
  // If 'all' selected, it can be filtered out, as by defaults it considered "all".
  let selectedIntegrations = jobFilter?.integrationIds?.filter(i => i !== 'all') || [];
  const selectedFlows = jobFilter?.flowIds?.filter(i => i !== 'all') || [];
  const selectedStatus = jobFilter?.status?.filter(i => i !== 'all') || [];
  const body = {sandbox};
  let selectedStores = [];
  let parentIntegrationId;
  let storeId;
  let { resources: allFlows } = selectors.resourceList(state, { type: 'flows' });
  let allFlowIds = [];
  const {startDate, endDate, preset} = getSelectedRange(jobFilter?.range) || {};
  const currentDate = new Date();

  function isSameDay() {
    return !!(endDate.getFullYear() === currentDate.getFullYear() &&
      endDate.getMonth() === currentDate.getMonth() &&
      endDate.getDate() === currentDate.getDate());
  }

  if (filterKey === FILTER_KEYS_AD.COMPLETED) {
    if (startDate) { body.time_gt = startDate.getTime(); }
    // Parameter time_lte is expected only for custom date range when the end date is not same as the current date
    // Ref: IO-24960
    if (preset === 'custom' && !isSameDay()) {
      // When current date is selected in custom date filter, the end date considers time to be the last minute 23:59
      // which could be future date for the user as the time does not match
      // Update end date in those cases to current date
      // Ref: IO-24139
      const currentDate = new Date();

      if (endDate > currentDate) {
        body.time_lte = currentDate.getTime();
      } else {
        body.time_lte = endDate.getTime();
      }
    }
  }
  if (integrationId) {
    selectedIntegrations = [integrationId];
  }

  if (selectedStatus.length) {
    body.status = selectedStatus;
  }
  if (selectedFlows.length) {
    body._flowIds = selectedFlows;
  } else if (selectedIntegrations.length) {
    // In IA 1.0, if any one select stores, the store will be stored as "store{$storeID}pid{#integrationId}"
    // below logic is used to extact store id and integration id from this.
    selectedStores = selectedIntegrations.filter(i => {
      if (!i.includes('store')) return false;
      storeId = i.substring(5, i.indexOf('pid'));
      parentIntegrationId = i.substring(i.indexOf('pid') + 3);

      return !(selectedIntegrations.includes(parentIntegrationId));
    });
    body._integrationIds = selectedIntegrations.filter(i => !i.includes('store'));
    // eslint-disable-next-line no-restricted-syntax
    for (const s of selectedStores) {
      storeId = s.substring(5, s.indexOf('pid'));
      parentIntegrationId = s.substring(s.indexOf('pid') + 3);
      body._flowIds = [...(body._flowIds || []), ...selectors.integrationAppFlowIds(state,
        parentIntegrationId,
        storeId
      )];
    }
    // If any store is selected and its parent is not selected, then we need to send all flowIds of all selected integrations.
    // UI should send either flowIds or integrationIds, should not send both together.
    if (body._flowIds?.length && body._integrationIds?.length) {
      allFlows = allFlows.filter(f => {
        if (!f._integrationId) { // this check is for stand alone flows
          return body._integrationIds.includes('none');
        }

        return body._integrationIds.includes(f._integrationId);
      });
      allFlowIds = (allFlows || []).map(({_id}) => _id);
      delete body._integrationIds;
      body._flowIds = [...body._flowIds, ...allFlowIds];
    }
  }

  return {path, opts: {method: 'POST', body}};
};
selectors.getAllAccountDashboardIntegrations = state => {
  let allIntegrations = selectors.resourceList(state, {
    type: 'integrations',
  }).resources;
  const allTiles = state?.data?.resources?.tiles || [];
  const currentEnvironment = selectors.currentEnvironment(state);
  const tiles = allTiles.filter(t => (!!t.sandbox === (currentEnvironment === 'sandbox')));

  const hasStandaloneTile = tiles.find(
    t => t._integrationId === STANDALONE_INTEGRATION.id
  );

  if (hasStandaloneTile) {
    allIntegrations = [
      ...allIntegrations,
      { _id: STANDALONE_INTEGRATION.id, name: STANDALONE_INTEGRATION.name },
    ];
  }
  const defaultFilter = [{ _id: 'all', name: 'All integrations'}];

  if (!allIntegrations) { return defaultFilter; }

  allIntegrations = uniqBy(allIntegrations, '_id').sort(stringCompare('name'));
  allIntegrations = [...defaultFilter, ...allIntegrations];

  allIntegrations = allIntegrations.map(i => {
    const { supportsMultiStore, sections: children = [] } = i.settings || {};

    if (supportsMultiStore) {
      return {...i, children: children.map(({id, title}) => ({_id: `store${id}pid${i._id}`, name: title}))};
    }

    return i;
  });

  return allIntegrations;
};

// It will give list of all integrations which to be displayed in integration filter in account dashboard.
selectors.getAllIntegrationsTiedToEventReports = createSelector(state => {
  const eventReports = resourceListSel(state, reportsFilter)?.resources;

  if (!eventReports) { return emptyArray; }

  const allIntegrations = eventReports.map(r => {
    const foundFlow = selectors.getAnyValidFlowFromEventReport(state, r);

    // if flow is deleted then we cannot find the integrationId
    if (!foundFlow) return null;

    const integrationId = foundFlow?._integrationId;

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

selectors.mkGetAllFlowsTiedToEventReports = () => {
  const eventReportsSel = selectors.makeResourceListSelector();
  const flowsSel = selectors.makeResourceListSelector();

  return createSelector(
    state => eventReportsSel(state, reportsFilter)?.resources,
    state => flowsSel(state, flowsFilter)?.resources,
    (eventReports, flows) => {
      if (!eventReports) { return emptyArray; }

      const allFlowIdsTiedToEvenReports = uniq(eventReports.flatMap(r =>
    r?._flowIds || []
      ).filter(Boolean));

      if (!allFlowIdsTiedToEvenReports) { return emptyArray; }

      return flows.filter(({_id: flowId}) =>
        allFlowIdsTiedToEvenReports.includes(flowId)).sort(stringCompare('name'));
    }
  );
};
selectors.getAllFlowsTiedToEventReports = selectors.mkGetAllFlowsTiedToEventReports();
selectors.mkGetFlowsTiedToEventReports = () => {
  const eventReportsSel = selectors.makeResourceListSelector();
  const flowsSel = selectors.makeResourceListSelector();

  return createSelector(
    state => eventReportsSel(state, reportsFilter)?.resources,
    state => flowsSel(state, flowsFilter)?.resources,
    (_1, integrationIds) => integrationIds,
    (eventReports, flows, integrationIds) => {
      if (!eventReports) { return emptyArray; }

      const allFlowIdsTiedToEvenReports = uniq(eventReports.flatMap(r =>
        r?._flowIds || []
      ).filter(Boolean));

      if (!allFlowIdsTiedToEvenReports) { return emptyArray; }

      const allFlows = flows.filter(({_id: flowId}) =>
        allFlowIdsTiedToEvenReports.includes(flowId)).sort(stringCompare('name'));

      if (!integrationIds || !integrationIds.length) { return allFlows; }

      return allFlows.filter(flow => flow && integrationIds.includes(flow._integrationId));
    }

  );
};

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

        // flow is deleted we don't know the integration id for it
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
    const isIntegrationV2 = isIntegrationAppVersion2(integration, true);

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

/*
 * Gives all other valid flows of same Integration
 */
selectors.mkNextDataFlowsForFlow = () => createSelector(
  state => state?.data?.resources?.flows,
  state => state?.data?.resources?.exports,
  (_, flow) => flow,
  (flows, exports, flow) => getNextDataFlows(flows, exports, flow)
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
        if (getHttpConnector(connection.http?._httpConnectorId)) {
          return (
            this.http?._httpConnectorId === connection.http?._httpConnectorId &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
          );
        }
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
        if (connection.jdbc?.type) {
          return (
            this.jdbc?.type === connection.jdbc?.type &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
          );
        }

        if (connection.type === 'http') {
          if (connection.http?.formType) {
            return (
            this.http?.formType === connection.http?.formType &&
            this.type === 'http' &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
            );
          }

          return (
            this.http?.formType !== 'rest' &&
            this.type === 'http' &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
          );
        }

        if (connection.type === 'rest') {
          return (
            (this.http?.formType === 'rest' || this.type === 'rest') &&
            !this._connectorId &&
            (!environment || !!this.sandbox === (environment === 'sandbox'))
          );
        }

        if (['netsuite'].indexOf(connection.type) > -1) {
          const accessLevel = manageOnly ? selectors.userAccessLevelOnConnection(state, this._id) : 'owner';

          return (
            this.type === 'netsuite' &&
            !this._connectorId &&
            this.netsuite?.account &&
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

selectors.makeMarketPlaceConnectorsSelector = () => {
  const integrationsList = selectors.makeResourceListSelector();

  return createSelector(
    state => integrationsList(state, integrationsFilter)?.resources,
    selectors.userState,
    selectors.marketPlaceState,
    (_, application) => application,
    (_1, _2, sandbox) => sandbox,
    selectors.isAccountOwnerOrAdmin,
    (integrations, userState, marketPlaceState, application, sandbox, isAccountOwnerOrAdmin) => {
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
          const installedIntegrationApps = integrations.filter(int => int._connectorId === c._id);

          return { ...c, installed: !!installedIntegrationApps.length };
        })
        .sort(stringCompare('name'));
    }

  );
};

selectors.mkTiles = () => createSelector(
  state => state?.data?.resources?.tiles,
  state => state?.data?.resources?.flows,
  state => selectors.currentEnvironment(state),
  state => selectors.publishedConnectors(state),
  state => selectors.userPermissions(state),
  (allTiles = emptyArray, flows = emptyArray, currentEnvironment, published = emptyArray, permissions) => {
    const tiles = allTiles.filter(t => (!!t.sandbox === (currentEnvironment === 'sandbox')));

    const permissionMap = tiles.reduce((acc, t) => {
      if (
        [
          USER_ACCESS_LEVELS.ACCOUNT_OWNER,
          USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
          USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
          USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
        ].includes(permissions.accessLevel)
      ) {
        acc[t._integrationId] = {
          accessLevel: permissions.integrations.all.accessLevel,
          connections: {
            edit: permissions.integrations.all.connections.edit,
          },
        };
      } else {
        acc[t._integrationId] = {
          accessLevel: (permissions.integrations[t._integrationId] || permissions.integrations.all)?.accessLevel,
          connections: {
            edit: (permissions.integrations[t._integrationId] || permissions.integrations.all)?.connections?.edit,
          },
        };
      }

      return acc;
    }, {});

    let connector;
    let status;

    return tiles.map(t => {
      let flowsNameAndDescription = '';

      if (t._connectorId && t.mode === INTEGRATION_MODES.UNINSTALL) {
        status = TILE_STATUS.UNINSTALL;
      } else if (
        t.mode === INTEGRATION_MODES.INSTALL || t.mode === INTEGRATION_MODES.UNINSTALL
      ) {
        status = TILE_STATUS.IS_PENDING_SETUP;
      } else if (t.numError && t.numError > 0) {
        status = TILE_STATUS.HAS_ERRORS;
      } else {
        status = TILE_STATUS.SUCCESS;
      }

      if (t._connectorId) {
        // adding flow names and descriptions to be used for searching tiles
        flowsNameAndDescription = flows
          .filter(f => f._connectorId === t._connectorId)
          .reduce((result, f) => `${result}|${f.name || ''}|${f.description || ''}`, '');

        connector = published.find(i => i._id === t._connectorId) || {
          user: {},
        };

        return {
          ...t,
          key: getTileId(t), // for Celigo table unique key
          status,
          flowsNameAndDescription,
          sortablePropType: -1,
          integration: {
            mode: t.mode,
            permissions: permissionMap[t._integrationId],
          },
          connector: {
            owner: connector.user.company || connector.user.name,
            applications: connector.applications || [],
          },
        };
      }

      // adding flow names and descriptions to be used for searching tiles
      flowsNameAndDescription = flows
        .filter(f => {
          if (!t._integrationId || t._integrationId === STANDALONE_INTEGRATION.id) {
            return !f._integrationId && !!f.sandbox === (currentEnvironment === 'sandbox');
          }

          return f._integrationId === t._integrationId;
        })
        .reduce((result, f) => `${result}|${f.name || ''}|${f.description || ''}`, '');

      return {
        ...t,
        key: getTileId(t),
        status,
        flowsNameAndDescription,
        sortablePropType: t.numFlows || 0,
        integration: {
          permissions: permissionMap[t._integrationId],
        },
      };
    });
  });

selectors.mkFilteredHomeTiles = () => {
  const tilesSelector = selectors.mkTiles();
  const appSel = selectors.mkTileApplications();

  return createSelector(
    state => {
      const tiles = tilesSelector(state);

      tiles.forEach(t => {
        const applications = appSel(state, t);
        const pinnedIntegrations = selectors.userPreferences(state).dashboard?.pinnedIntegrations || emptyArray;

        // eslint-disable-next-line no-param-reassign
        t.applications = applications;
        // eslint-disable-next-line no-param-reassign
        t.pinned = pinnedIntegrations.includes(t._integrationId);
      });

      return tiles;
    },
    state => selectors.suiteScriptLinkedTiles(state),
    state => selectors.userPreferences(state).dashboard,
    state => selectors.isHomeListView(state),
    state => selectors.filter(state, HOME_FILTER_KEY),
    (tiles = emptyArray, ssTiles = emptyArray, homePreferences, isListView, filterConfig) => {
      const {tilesOrder, pinnedIntegrations} = homePreferences || emptyObject;
      const {take, applications} = filterConfig || emptyObject;

      const suiteScriptLinkedTiles = ssTiles.filter(t => {
        // only fully configured svb tile should be shown on dashboard
        const isPendingSVB = t._connectorId === 'suitescript-svb-netsuite' && (t.status === TILE_STATUS.IS_PENDING_SETUP || t.status === TILE_STATUS.UNINSTALL);

        return !isPendingSVB;
      });
      const homeTiles = tiles.concat(suiteScriptLinkedTiles);
      const comparer = ({ order = 'asc', orderBy = 'name' }) =>
        order === 'desc' ? tileCompare(orderBy, true) : tileCompare(orderBy);

      let filteredTiles = filterAndSortResources(homeTiles, filterConfig, !isListView, comparer);

      if (isListView && applications && !applications.includes('all')) {
        // filter on applications, for applications which have multiple versions/metadata, temporary assistant name
        // will be a substring of the actual assistant name
        // for e.g, user selects 'constantcontact' in the filters (which is a temporary assistant),
        // resources will have assistants 'constantcontactv2' or 'constantcontactv3',
        // below filter will ensure that all versions of constant contact are filtered as 'constantcontact' is a substring of
        // both 'constantcontactv2' or 'constantcontactv3'
        filteredTiles = filteredTiles.filter(
          tile => tile.applications?.some(tileApp => applications.some(app => tileApp.includes(app)))
        );
      }

      if (isListView && pinnedIntegrations?.length && filteredTiles.length) {
        // move pinned integrations to the top, not affected by sorting
        pinnedIntegrations.forEach(p => {
          const index = filteredTiles.findIndex(t => t.key === p);

          // only push to beginning if the tile exists in filteredTiles
          if (index !== -1) {
            const pinnedInt = filteredTiles.splice(index, 1);

            filteredTiles.unshift(pinnedInt[0]);
          }
        });
      }

      if (typeof take !== 'number' || take < 1 || !isListView) {
        return {
          filteredTiles: isListView ? filteredTiles : sortTiles(
            filteredTiles,
            tilesOrder
          ),
          filteredCount: filteredTiles.length,
          perPageCount: filteredTiles.length,
          totalCount: tiles.length,
        };
      }
      const slicedTiles = filteredTiles.slice(0, take);

      return {
        filteredTiles: isListView ? slicedTiles : sortTiles(
          filteredTiles,
          tilesOrder
        ),
        filteredCount: filteredTiles.length,
        perPageCount: slicedTiles.length,
        totalCount: tiles.length,
      };
    });
};

selectors.mkHomeTileRedirectUrl = () => {
  const marketplaceResourceSel = selectors.makeResourceSelector();

  return createSelector(
    (_, tile) => tile,
    state => selectors.isOwnerUserInErrMgtTwoDotZero(state),
    (state, tile) => {
      if (tile?._templateId) {
        const template = marketplaceResourceSel(state, 'marketplacetemplates', tile._templateId);

        return getTemplateUrlName(template?.applications);
      }

      return null;
    },
    (tile, isUserInErrMgtTwoDotZero, templateName) => {
      // separate logic for suitescript tiles
      if (tile.ssLinkedConnectionId) {
        let urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrations/${tile._integrationId}`;
        let urlToIntegrationStatus = `/suitescript/${tile.ssLinkedConnectionId}/integrations/${tile._integrationId}/dashboard`;

        if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
          urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile._connectorId}/setup`;
          urlToIntegrationStatus = urlToIntegrationSettings;
        } else if (tile.status === TILE_STATUS.UNINSTALL) {
          urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/uninstall`;
        } else if (tile._connectorId) {
          urlToIntegrationSettings = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/flows`;
        }

        if (tile._connectorId) {
          urlToIntegrationStatus = `/suitescript/${tile.ssLinkedConnectionId}/integrationapps/${tile.urlName}/${tile._integrationId}/dashboard`;
        }

        return {
          urlToIntegrationSettings: getRoutePath(urlToIntegrationSettings),
          urlToIntegrationStatus: getRoutePath(urlToIntegrationStatus),
        };
      }

      const integrationAppTileName =
        tile._connectorId && tile.name ? getIntegrationAppUrlName(tile.name) : '';

      let urlToIntegrationSettings = templateName
        ? `/templates/${templateName}/${tile._integrationId}`
        : `/integrations/${tile._integrationId}`;

      let urlToIntegrationUsers = templateName
        ? `/templates/${templateName}/${tile._integrationId}/users`
        : `/integrations/${tile._integrationId}/users`;

      let urlToIntegrationStatus = `/integrations/${tile._integrationId}/dashboard`;
      let urlToIntegrationConnections = `/integrations/${tile._integrationId}/connections`;

      if (tile.status === TILE_STATUS.IS_PENDING_SETUP) {
        if (tile._connectorId) {
          urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/setup`;
        } else {
          urlToIntegrationSettings = `integrations/${tile._integrationId}/setup`;
        }
        urlToIntegrationUsers = urlToIntegrationSettings;
        urlToIntegrationStatus = urlToIntegrationSettings;
      } else if (tile.status === TILE_STATUS.UNINSTALL) {
        urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/uninstall`;
        urlToIntegrationUsers = urlToIntegrationSettings;
      } else if (tile._connectorId) {
        urlToIntegrationSettings = `/integrationapps/${integrationAppTileName}/${tile._integrationId}`;
        urlToIntegrationUsers = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/users`;
      }

      if (tile._connectorId) {
        urlToIntegrationConnections = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/connections`;
      }

      if (isUserInErrMgtTwoDotZero) {
        urlToIntegrationStatus = urlToIntegrationSettings;
      } else if (tile._connectorId) {
        urlToIntegrationStatus = `/integrationapps/${integrationAppTileName}/${tile._integrationId}/dashboard`;
      }

      return {
        urlToIntegrationSettings: getRoutePath(urlToIntegrationSettings),
        urlToIntegrationUsers: getRoutePath(urlToIntegrationUsers),
        urlToIntegrationConnections: getRoutePath(urlToIntegrationConnections),
        urlToIntegrationStatus: getRoutePath(urlToIntegrationStatus),
      };
    }
  );
};

selectors.isHomeListView = state => {
  const homePreferences = selectors.userPreferences(state).dashboard || emptyObject;

  return homePreferences.view === LIST_VIEW;
};

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
  uiFields,
  resourceType,
  id
) => {
  if (!resourceType || !id) return emptyObject;

  const master = resourceIdState ? { ...resourceIdState, ...uiFields } : resourceIdState;
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
    (state, resourceType, id) =>
      cachedStageSelector(
        state,
        id,
      ),
    (state, resourceType, id) => selectors.resourceUIFields(state, id),
    (_1, resourceType) => resourceType,
    (_1, _2, id) => id,

    (resourceIdState, stagedIdState, uiFields, resourceType, id) => selectors.resourceDataModified(resourceIdState, stagedIdState, uiFields, resourceType, id)
  );
};

selectors.makeFlowDataForFlowBuilder = () => {
  const cachedResourceSelector = selectors.makeResourceDataSelector();

  return createSelector(
    (state, flowId) => cachedResourceSelector(
      state,
      'flows',
      flowId
    )?.merged,
    flow => initializeFlowForReactFlow(flow)
  );
};

selectors.isFlowSaveInProgress = (state, flowId) => selectors.isAsyncTaskLoading(state, getFlowAsyncKey(flowId));

selectors.flowDataForFlowBuilder = selectors.makeFlowDataForFlowBuilder();
// Please use makeResourceDataSelector in JSX as it is cached selector.
// For sagas we can use resourceData which points to cached selector.
selectors.resourceData = selectors.makeResourceDataSelector();

selectors.auditLogs = (
  state,
  resourceType,
  resourceId,
  options = {}
) => {
  let auditLogs = fromData.auditLogs(
    state?.data,
    resourceType,
    resourceId,
  );

  const result = {
    logs: [],
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

  result.logs = auditLogs;
  result.totalCount = auditLogs.length;

  return result;
};

selectors.paginatedAuditLogs = createSelector(
  selectors.auditLogs,
  (state, resourceType, resourceId) => {
    const filterKey = getAuditLogFilterKey(resourceType, resourceId);

    return selectors.filter(state, filterKey);
  },
  (auditLogs, filters) => {
    const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = filters?.paging || {};

    const logs = auditLogs.logs.slice(currPage * rowsPerPage, (currPage + 1) * rowsPerPage);

    return {...auditLogs, logs};
  });

selectors.mkFlowResources = () => createSelector(
  state => state?.data?.resources?.flows,
  state => state?.data?.resources?.exports,
  state => state?.data?.resources?.imports,
  (_, flowId) => flowId,
  (flows, exports, imports, flowId) => getFlowResources(flows, exports, imports, flowId)
);

selectors.flowResourceIds = (state, flowId) => {
  const flowResources = selectors.mkFlowResources()(state, flowId);

  // extracts import's and export's id from the flowResources
  return flowResources.filter(r => !!r.type).map(r => r._id);
};

selectors.mkFlowStepsErrorInfo = () => {
  const flowResources = selectors.mkFlowResources();

  return createSelector(
    flowResources,
    selectors.openErrorsDetails,
    (state, _1, _2, _3, filterKey) => selectors.filter(state, filterKey),
    (_, flowId) => flowId,
    (_1, _2, integrationId) => integrationId,
    (_1, _2, _3, childId) => childId,
    (flowResources, openErrorsDetails, errorStepsFilter, flowId, integrationId, childId) => {
      const errorSteps = flowResources
        .filter(r => r._id !== flowId)
        .map(r => ({
          id: r._id,
          name: r.name || r._id,
          count: openErrorsDetails?.[r._id]?.numError,
          lastErrorAt: openErrorsDetails?.[r._id]?.lastErrorAt,
          flowId,
          type: r.type,
          isLookup: r.isLookup,
          childId,
          integrationId,
        }));

      if (errorStepsFilter?.sort) {
        const { order, orderBy } = errorStepsFilter.sort;

        return errorSteps.sort(stringCompare(orderBy, order === 'desc'));
      }

      return errorSteps;
    }
  );
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
    (_1, { contextType }) => contextType,
    (_1, { flowId }) => flowId,
    (state, { flowId }) => {
      const flow = selectors.resource(state, 'flows', flowId) || emptyObject;

      return flow._integrationId;
    },
    (state, { resourceType }) => resourceType,
    (state, { resourceId }) => resourceId,
  ],
  (contextType, _flowId, _integrationId, resourceType, resourceId) => {
    if (contextType === 'hook') {
      if (_integrationId) {
        return {
          type: 'hook',
          container: 'integration',
          _integrationId,
          _flowId,
        };
      }
      if (_flowId) {
        return {
          type: 'hook',
          container: 'flow',
          _integrationId,
          _flowId,
        };
      }
      if (resourceType === 'apis' && !isNewId(resourceId)) {
        return {
          type: 'hook',
          container: 'api',
          _apiId: resourceId,
        };
      }
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

selectors.mkFlowGroupMap = () => {
  const flowGroupsSelector = selectors.mkIntegrationFlowGroups();

  return createSelector(
    (state, integrationId) => flowGroupsSelector(state, integrationId),
    flowGroups => flowGroups.reduce((infoMap, { title, sectionId}) => ({
      ...infoMap,
      [sectionId]: title,
    }), {})
  );
};

selectors.mkDIYIntegrationFlowList = () => {
  const flowGroupsMapSelector = selectors.mkFlowGroupMap();

  return createSelector(
    state => state?.data?.resources?.flows,
    (state, integrationId, childId) => selectors.latestJobMap(state, childId || integrationId || 'none')?.data,
    (state, integrationId) => integrationId,
    (_1, _2, childId) => childId,
    (_1, _2, _3, isUserInErrMgtTwoDotZero) => isUserInErrMgtTwoDotZero,
    (_1, _2, _3, _4, options) => options,
    selectors.openErrorsMap,
    selectors.currentEnvironment,
    flowGroupsMapSelector,
    (flows = emptyArray, latestFlowJobs,
      integrationId, childId, isUserInErrMgtTwoDotZero, options, errorMap, currentEnvironment, flowGroupsMap) => {
      let integrationFlows = flows.filter(f => {
        if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
          return !f._integrationId && !!f.sandbox === (currentEnvironment === 'sandbox');
        }
        if (childId && childId !== integrationId) return f._integrationId === childId;

        return f._integrationId === integrationId;
      });
      const customSearchableText = r => {
        if (!options?.keyword) return;

        return `${r._id}|${r.name}|${r.description}|${flowGroupsMap[r._flowGroupingId || UNASSIGNED_SECTION_ID]}`;
      };

      integrationFlows = integrationFlows.map(f => ({...f, errors: errorMap?.[f._id] || 0, searchKey: customSearchableText(f)}));

      return filterAndSortResources(addLastExecutedAtSortableProp({
        flows: integrationFlows,
        isUserInErrMgtTwoDotZero,
        latestFlowJobs}), options
      );
    }
  );
};

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

        if (shouldHaveUnassignedSection(flowGroupings, integrationFlows)) {
          return [...flowGroupings, {title: UNASSIGNED_SECTION_NAME, sectionId: UNASSIGNED_SECTION_ID}];
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
          if (groupId === UNASSIGNED_SECTION_ID) {
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

// As of now, we are not showing the lookup option for BigQuery and snowflake imports
selectors.mappingHasLookupOption = (state, resourceType, connectionId) => {
  const connection = selectors.resource(state, resourceType, connectionId) || {};

  return !['bigquery', 'redshift', 'snowflake'].includes(connection?.rdbms?.type);
};

// this selector updates the field options based on the
// parent field media type
selectors.mkGetMediaTypeOptions = () => {
  const resourceSelector = selectors.makeResourceSelector();

  return createSelector(
    (state, {formKey}) => selectors.formState(state, formKey)?.value || emptyObject,

    (state, {formKey}) => {
      const formValues = selectors.formState(state, formKey)?.value || {};
      const connectionId = formValues['/_connectionId'];
      const connection = resourceSelector(state, 'connections', connectionId) || {};

      return connection.type === 'http' ? connection.http?.mediaType : connection.rest?.mediaType;
    },
    (_, {resourceType}) => resourceType,
    (_, {dependentFieldForMediaType}) => dependentFieldForMediaType,
    (_, {options}) => options,
    (_, {fieldId}) => fieldId,
    (formValues, connectionMediaType, resourceType, dependentFieldForMediaType, _options, fieldId) => {
      let options = Array.isArray(_options) ? [..._options] : [];

      if (resourceType === 'imports' && fieldId === 'http.requestMediaType') {
        const inputMode = formValues['/inputMode'];

        options = inputMode === 'blob' ? [
          { label: 'Multipart / form-data', value: 'form-data' },
          { label: 'JSON', value: 'json' },
        ] : [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
          { label: 'CSV', value: 'csv' },
          { label: 'URL encoded', value: 'urlencoded' },
          { label: 'Multipart / form-data', value: 'form-data' },
        ];
      }

      let mediaTypeIndex = -1;
      const parentFieldMediaType = formValues[dependentFieldForMediaType] || connectionMediaType;

      // find the media type in the options
      if (parentFieldMediaType && options) {
        mediaTypeIndex = options.findIndex(o => o.value === parentFieldMediaType);
      }

      // remove the media type which is set on connection/dependent field , from options
      // cloning options so as to not affect original options
      const modifiedOptions = customCloneDeep(options);

      if (mediaTypeIndex !== -1) modifiedOptions.splice(mediaTypeIndex, 1);

      return {modifiedOptions: [{ items: modifiedOptions}], parentFieldMediaType};
    }
  );
};

// for IA 1.0 install mode dummy connection are created. since we don't know it's new connection or existing connection we will verify
// if connection is online or not.
selectors.isNewConnectionId = () => {
  const makeResourceSelector = selectors.makeResourceSelector();

  return createSelector(
    (state, resourceType, resourceId) => {
      const resource = makeResourceSelector(state, resourceType, resourceId);

      if (!resource?._connectorId) {
        return [];
      }
      let steps = selectors.getChildInstallSteps(state, resource?._integrationId) || [];

      if (!steps.length) {
        const integrationResource = makeResourceSelector(state, 'integrations', resource?._integrationId);

        if (integrationResource?.mode === 'install') {
          steps = selectors.integrationInstallSteps(state, resource?._integrationId) || [];
        }
      }

      return steps;
    },
    (_1, _2, resourceId) => resourceId,
    (installSteps, resourceId) => !!installSteps?.find(s => s?._connectionId === resourceId)
  );
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

selectors.mkIntegrationTreeChildren = () => createSelector(
  state => state?.data?.resources?.integrations,
  state => state?.data?.resources?.['tree/metadata'],
  (state, integrationId) => integrationId,
  (integrations = emptyArray, treeMetaData = emptyArray, integrationId) => {
    const children = [];
    const integration = integrations.find(int => int._id === integrationId) || {};
    const childIntegrations = treeMetaData.filter(int => int._parentId === integrationId);

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
    edition ? getTitleFromEdition(edition) : 'Standard'
  } plan`;

  return plan;
};

selectors.isChildLicenseInUpgrade = createSelector(
  state => selectors.licenses(state),
  (state, id) => id,
  (licenses, id) => {
    const parentLicenseId = licenses.find(license => license._integrationId === id)?._id;
    const childLicenses = licenses.filter(license => (!!license?._integrationId) && (license?._parentId === parentLicenseId));

    return childLicenses.some(license => !!license?._changeEditionId);
  }
);

selectors.integrationAppLicense = (state, id) => {
  if (!state) return emptyObject;
  const integrationResource = selectors.integrationAppSettings(state, id);
  const userLicenses = fromUser.licenses(state && state.user) || [];
  const license = userLicenses.find(l => l._integrationId === id) || {};
  const integrationAppList = selectors.publishedConnectors(state);
  const connector =
     integrationAppList?.find(ia => ia._id === license?._connectorId);
  const editions = connector?.twoDotZero?.editions || emptyArray;
  const changeEdition = (editions.find(ed => ed._id === license?._changeEditionId) || {})?.displayName;
  const nextPlan = changeEdition ? getTitleFromEdition(changeEdition) : '';
  const upgradeRequested = selectors.checkUpgradeRequested(state, license._id);
  const dateFormat = selectors.userProfilePreferencesProps(state)?.dateFormat;
  const { expires, created } = license;
  const hasExpired = moment(expires) - moment() < 0;
  const createdFormatted = `Started on ${moment(created).format(dateFormat || 'MMM Do, YYYY')}`;
  const isExpiringSoon =
    moment.duration(moment(expires) - moment()).as('days') <= 15;
  const expiresText = expiresInfo(license, dateFormat);
  const upgradeText = upgradeButtonText(
    license,
    integrationResource,
    upgradeRequested,
    editions,
    connector?.twoDotZero
  );
  const isHighestPlan = isNextTheHighestPlan(
    license?._changeEditionId,
    connector?.twoDotZero,
    editions,
  );

  return {
    ...license,
    expiresText,
    upgradeText,
    upgradeRequested: !!upgradeRequested,
    createdText: createdFormatted,
    showLicenseExpiringWarning: hasExpired || isExpiringSoon,
    nextPlan,
    isHighestPlan,
  };
};

selectors.isIntegrationAppLicenseExpired = (state, id) => {
  if (!state) return true;
  const userLicenses = fromUser.licenses(state && state.user) || [];
  const license = userLicenses.find(l => l._integrationId === id);

  if (!license) {
    return true;
  }

  return moment(license.expires) - moment() < 0;
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
    return Array.isArray(general) && !!general.find(s => s.id === childId);
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
    (state, integrationId) => selectors.latestJobMap(state, integrationId || 'none')?.data,
    (_1, _2, _3, _4, _5, isUserInErrMgtTwoDotZero) => isUserInErrMgtTwoDotZero,
    (_, integrationId) => integrationId,
    (_1, _2, section) => section,
    (_1, _2, _3, childId) => childId,
    selectors.openErrorsMap,
    (_1, _2, _3, _4, options) => options,
    (integration, flows = [], latestFlowJobs, isUserInErrMgtTwoDotZero, integrationId, section, childId, errorMap, options = emptyObject) => {
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
            if (!sec.mode || sec.mode === 'settings') {
              allSections.push(...(sec.sections.map(s => ({...s, childId: sec.id, childName: sec.title}))));
            }
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
          const selectedFlow = flows.find(fi => fi._id === f._id);
          const customSearchableText = (flow, sec) => {
            if (!options?.keyword) return;

            if (!sec.title) return `${flow._id}|${flow.name}|${flow.description}`;

            return `${flow._id}|${flow.name}|${flow.description}|${sec.title}`;
          };

          if (flow) {
            // If flow is present in two children, then it is a common flow and does not belong to any single child, so remove child information from flow
            delete flow.childId;
            delete flow.childName;
          } else if (selectedFlow) {
            // Add only valid flows, the flow must be present in flows collection. This is possible when child is in uninstall mode.
            // Flow may be deleted but child structure is intact on integration json.
            requiredFlows.push({id: f._id, childId: sec.childId, childName: sec.childName, searchKey: customSearchableText(selectedFlow, sec)});
          }
        });
      });
      const requiredFlowIds = requiredFlows.map(f => f.id);

      const _flows = flows
        .filter(f => f._integrationId === integrationId && requiredFlowIds.includes(f._id))
        .sort(
          (a, b) => requiredFlowIds.indexOf(a._id) - requiredFlowIds.indexOf(b._id)
        ).map(f => ({...f, errors: errorMap?.[f._id] || 0, searchKey: requiredFlows.find(flow => flow.id === f._id)?.searchKey}));

      return filterAndSortResources(addLastExecutedAtSortableProp({
        flows: _flows,
        isUserInErrMgtTwoDotZero,
        latestFlowJobs,
        supportsMultiStore,
        childId,
        requiredFlows,
      }), options);
    }
  );
selectors.integrationAppSectionFlows = selectors.makeIntegrationAppSectionFlows();

selectors.mkIntegrationAppFlowSections = () => {
  const integrationSettingsSelector = selectors.mkIntegrationAppSettings();
  const allFlowsFromSections = selectors.makeIntegrationAppSectionFlows();

  return createSelector(
    (state, id) => (state && integrationSettingsSelector(state, id)) || emptyObject,
    (_1, _2, childId) => childId,
    (state, id, childId, flowsFilterConfig, isUserInErrMgtTwoDotZero) => allFlowsFromSections(state, id, '', childId, flowsFilterConfig, isUserInErrMgtTwoDotZero),
    (_1, _2, _3, flowsFilterConfig) => flowsFilterConfig,
    (integrationResource, childId, filteredFlows, flowsFilterConfig) => {
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
        .filter(sec => {
          if (!flowsFilterConfig?.keyword) {
            return !!sec.title;
          }

          // filteredFlows contains flows which have name or description starting with keyword in flowsFilterConfig
          // a section is selected if atleast one of the flows in the section is present in filteredFlows

          return !!sec.title && (
            sec.flows.some(flow => filteredFlows.some(selectedFlow => selectedFlow._id === flow._id)) ||
            sec.title.toUpperCase().includes(flowsFilterConfig.keyword.toUpperCase()));
        })
        .map(sec => ({
          ...sec,
          titleId: getTitleIdFromSection(sec),
        }));
    });
};

selectors.integrationAppFlowSections = selectors.mkIntegrationAppFlowSections();

selectors.mkAllFlowsTiedToIntegrations = () => {
  const resourceListSel = selectors.makeResourceListSelector();

  const allFlowsFromSections = selectors.makeIntegrationAppSectionFlows();

  return createSelector(
    state => resourceListSel(state, flowsFilter).resources,
    (_1, parentIntegrationId) => parentIntegrationId,
    (state, parentIntegrationId) => selectors.isIntegrationAppVersion2(state, parentIntegrationId, true),
    (state, parentIntegrationId) => !selectors.isIntegrationApp(state, parentIntegrationId),
    (state, parentIntegrationId) => allFlowsFromSections(state, parentIntegrationId),
    (_1, _2, childIntegrationIds) => childIntegrationIds,
    (flows, parentIntegrationId, isV2, isDiy, flowsFromAllChildren, childIntegrationIds) => {
      if (!flows || !parentIntegrationId) return null;

      if (parentIntegrationId === STANDALONE_INTEGRATION.id) {
        return flows.filter(({_integrationId}) => !_integrationId);
      }

      if (isV2 || isDiy) {
        const consolidatedIntegrationIds = [parentIntegrationId, ...(childIntegrationIds || [])];

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
selectors.allFlowsTiedToIntegrations = selectors.mkAllFlowsTiedToIntegrations();

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

  return isIntegrationAppVersion2(integration, skipCloneCheck);
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

selectors.availableUsersList = createSelector(
  (_, integrationId) => integrationId,
  selectors.usersList,
  selectors.isAccountOwnerOrAdmin,
  selectors.integrationUsersForOwner,
  selectors.integrationUsers,
  selectors.accountOwner,
  (integrationId, usersList, isAccountOwnerOrAdmin, integrationUsersForOwner, integrationUsers, accountOwner) => {
    let _users = [];

    if (isAccountOwnerOrAdmin) {
      if (integrationId) {
        _users = integrationUsersForOwner;
      } else {
        _users = usersList;
      }
    } else if (integrationId) {
      _users = integrationUsers;
    }

    if ((integrationId || isAccountOwnerOrAdmin) && _users?.length > 0) {
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

    return _users
      ? _users.sort(stringCompare('sharedWithUser.name'))
        .map(userVal => !userVal.sharedWithUser ? ({ ...userVal, sharedWithUser: emptyObject }) : userVal)
      : emptyArray;
  }

);

selectors.allUsersList = createSelector(
  selectors.availableUsersList,
  selectors.accountOwner,
  (users, accountOwner) => {
    if (users?.length) {
      return users;
    }

    return [{
      _id: ACCOUNT_IDS.OWN,
      sharedWithUser: accountOwner,
    }];
  }
);

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
  state => selectors.userProfilePreferencesProps(state)?.dateFormat,
  (license, dateFormat) => {
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
      ).format(dateFormat || 'MMM Do, YYYY');
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
    licenseActionDetails.isMaxDataRetentionPeriodAvailable = !!(licenseActionDetails.maxAllowedDataRetention === MAX_DATA_RETENTION_PERIOD);

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
    licenseDetails.message = message.SUBSCRIPTION.LICENSE_EXPIRED;
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

selectors.resourcePermissionsForTile = (
  state,
  resourceType,
  resourceId,
  tileOps = {}
) => {
  const {childResourceType, _connectorId, _parentId} = tileOps;

  // to support parent-child integration permissions
  if (resourceType === 'integrations') {
    if (_parentId) {
      return selectors.resourcePermissions(
        state,
        resourceType,
        _parentId,
        childResourceType
      );
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
    if (
      [
        USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
        USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
      ].includes(permissions.accessLevel)
    ) {
      const value =
       _connectorId
         ? permissions.integrations.connectors
         : permissions.integrations.all;

      // filtering child resource
      return (
        (childResourceType ? value && value[childResourceType] : value) ||
        emptyObject
      );
    }
    if (resourceId) {
      let value = permissions.integrations[resourceId] || permissions.integrations.all;

      if (!value) {
        return emptyObject;
      }

      // remove tile level permissions added to connector while are not valid.
      if (_connectorId) {
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
      let value = permissions.integrations[resourceId] || permissions.integrations.all;

      if (!value) {
        return emptyObject;
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

selectors.isFormAManageLevelAccess = (state, integrationId) => {
  const { accessLevel } = selectors.resourcePermissions(state);

  // if all forms is manage level
  if (accessLevel === 'manage') return true;

  // check integration level is monitor level
  const { accessLevel: accessLevelIntegration } = selectors.resourcePermissions(
    state,
    'integrations',
    integrationId
  );

  if (accessLevelIntegration === 'manage') return true;

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

selectors.availableConnectionsToRegister = (state, integrationId, tableConfig) => {
  if (!state) {
    return [];
  }

  const connList = selectors.resourceList(state, {
    type: 'connections',
    ...(tableConfig || {}),
  });
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

      return ['manage', 'owner', 'administrator'].includes(accessLevel);
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
selectors.canSelectRecordsInPreviewPanel = (state, formKey) => {
  const isExportPreviewDisabled = selectors.isExportPreviewDisabled(state, formKey);
  const { resourceId, resourceType } = selectors.formParentContext(state, formKey) || {};

  if (isExportPreviewDisabled || resourceType === 'imports') return false;

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

  const stage = fileType === 'xlsx' ? 'csv' : 'raw';
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

  return rawData;
};

selectors.getImportSampleData = (state, resourceId, options = {}) => {
  const resource = selectors.resourceData(state, 'imports', resourceId)?.merged || emptyObject;
  const { assistant, adaptorType, sampleData, _connectorId } = resource;
  const isIntegrationApp = !!_connectorId;
  const connection = selectors.resource(state, 'connections', resource._connectionId) || emptyObject;

  if (getHttpConnector(connection.http?._httpConnectorId) || (assistant && assistant !== 'financialforce' && !(FILE_PROVIDER_ASSISTANTS.includes(assistant)))) {
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
        return selectors.getSampleDataContext(state, { ...params, stage: 'importMappingExtract' });
      }
    },
    (state, params) => {
      if (params.stage === 'postSubmit') {
        return selectors.getSampleDataContext(state, { ...params, stage: 'postMapOutput' });
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
      );

      return merged || emptyObject;
    },
    (state, { resourceId, resourceType }) => {
      const res = selectors.resource(state, resourceType, resourceId) || emptyObject;

      return selectors.resource(state, 'connections', res._connectionId) || emptyObject;
    },
    (_, { stage }) => stage,
    (_, { fieldType }) => fieldType,
    (_, { editorType }) => editorType,
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
    (state, { flowId }) => {
      const { data: origLastExportDateTime } = selectors.getLastExportDateTime(state, flowId) || emptyObject;

      if (origLastExportDateTime) {
        const preferences = selectors.userOwnPreferences(state);
        const timeZone = selectors.userTimezone(state);

        const lastExportDateTime = convertUtcToTimezone(origLastExportDateTime, preferences.dateFormat, preferences.timeFormat, timeZone, {skipFormatting: true});

        return lastExportDateTime;
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
    editorType,
    parentIntegration,
    lastExportDateTime,
  ) => wrapSampleDataWithContext({sampleData,
    preMapSampleData,
    postMapSampleData,
    flow,
    integration,
    resource,
    connection,
    stage,
    fieldType,
    editorType,
    parentIntegration,
    lastExportDateTime})
);

/**
 * All the adaptors whose preview depends on connection
 * are disabled if their respective connections are offline
 * Any other criteria to disable preview panel can be added here
 */
selectors.isExportPreviewDisabled = (state, formKey) => {
  if (!formKey) {
    return true;
  }

  const { resourceId, resourceType } = selectors.formParentContext(state, formKey) || {};
  const formValues = selectors.formState(state, formKey)?.value || {};

  const resourceObj = selectors.resourceData(
    state,
    resourceType,
    resourceId,
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

  const connectionId = formValues['/_connectionId'];

  // In all other cases, where preview depends on connection being online, return the same
  return selectors.isConnectionOffline(state, connectionId);
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
  ).merged;
  // for rest and http
  const appType = adaptorTypeMap[resourceObj?.adaptorType];

  return HTTP_BASED_ADAPTORS.includes(appType);
};

selectors.resourceCanHaveFileDefinitions = (state, resourceId, resourceType) => {
  if (!['exports', 'imports'].includes(resourceType)) {
    return false;
  }
  const resource = selectors.resourceData(state, resourceType, resourceId)?.merged;

  if (resource?.type === 'simple') {
    // Data loaders do not have file definitions
    return false;
  }

  return isFileAdaptor(resource) || isAS2Resource(resource) || FILE_PROVIDER_ASSISTANTS.includes(resource?.assistant);
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
  state => selectors.userPreferences(state).dashboard?.pinnedIntegrations,
  (linkedConnections, suiteScriptTiles = {}, pinnedIntegrations = emptyArray) => {
    let tiles = [];

    linkedConnections.forEach(connection => {
      tiles = tiles.concat(suiteScriptTiles[connection._id]?.tiles || []);
    });

    return tiles.map(t => ({ ...t,
      key: getTileId(t), // for Celigo Table unique key
      name: t.displayName,
      sortablePropType: t._connectorId ? -1 : (t.numFlows || 0),
      pinned: pinnedIntegrations.includes(getTileId(t)) }));
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
  } else if (resourceType === 'settings') {
    path += `integrations/${integrationId}/settings`;
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
  { resourceType, id, ssLinkedConnectionId, integrationId }
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
  const permissions = selectors.userPermissions(state);

  const hasAccountLevelEditAccess = [
    USER_ACCESS_LEVELS.ACCOUNT_OWNER,
    USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
  ].includes(permissions.accessLevel);

  if (!hasAccountLevelEditAccess) return false;
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
  const { data: rawData } = selectors.getResourceSampleDataWithStatus(
    state,
    resourceId,
    'raw',
  );

  if (!rawData) {
    const resourceObj = selectors.suiteScriptResource(state, {resourceType, id: resourceId, ssLinkedConnectionId});

    if (
      resourceObj?.export?.file?.csv
    ) {
      return resourceObj.export.sampleData;
    }
  }

  return rawData;
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

      return (subRecordResource ? [subRecordResource] : []);
    }

    const flowImports = getImportsFromFlow(flow, imports);

    return flowImports.filter(i => isImportMappingAvailable(i) || isQueryBuilderSupported(i));
  }
);

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
  const resourceObj = selectors.resourceData(
    state,
    resourceType,
    resourceId,
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

selectors.showFullDrawerWidth = (state, drawerProps, urlProps) => {
  const { width, flowId } = drawerProps;

  if (width === 'full') return true;
  const { resourceType, id } = urlProps;

  return selectors.isPreviewPanelAvailableForResource(state, id, resourceType, flowId);
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
  let adaptorType = resourceType === 'connections'
    ? getStagedValue('/type') || resourceObj?.type
    : getStagedValue('/adaptorType') || resourceObj?.adaptorType;
  const assistant = getStagedValue('/assistant') || resourceObj?.assistant;

  if (adaptorType === 'WebhookExport') {
    const httpConnectorId = getStagedValue('/_httpConnectorId') || getStagedValue('/webhook/_httpConnectorId') || resourceObj?._httpConnectorId || resourceObj?.webhook?._httpConnectorId;
    const applications = applicationsList();
    const httpApp = applications.find(a => a._httpConnectorId === httpConnectorId);

    if (httpConnectorId && httpApp) {
      return httpApp._legacyId || httpApp.id;
    }

    return (
      getStagedValue('/webhook/provider') ||
      (resourceObj && resourceObj.webhook && resourceObj.webhook.provider)
    );
  }

  if (adaptorType === 'http' && resourceObj?.http?.formType === 'rest') {
    adaptorType = 'rest';
  }
  if (adaptorTypeMap[adaptorType] === 'graph_ql' || resourceObj?.http?.formType === 'graph_ql') {
    adaptorType = 'graph_ql';
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

    return connection && connection.rdbms && rdbmsSubTypeToAppType(connection.rdbms.type);
  }
  if (adaptorType?.toUpperCase().startsWith('JDBC')) {
    const connection = resourceType === 'connections' ? resourceObj : selectors.resource(
      state,
      'connections',
      getStagedValue('/_connectionId') || (resourceObj?._connectionId)
    );

    return connection && connection.jdbc && connection.jdbc.type;
  }
  if ((adaptorType?.toUpperCase().startsWith('HTTP') || adaptorType?.toUpperCase().startsWith('REST')) && !assistant) {
    const connection = resourceType === 'connections' ? resourceObj : selectors.resource(
      state,
      'connections',
      getStagedValue('/_connectionId') || (resourceObj?._connectionId)
    );
    const httpConnectorId = getStagedValue('/_httpConnectorId') || connection?._httpConnectorId || connection?.http?._httpConnectorId;
    const applications = applicationsList();
    const httpApp = applications.find(a => a._httpConnectorId === httpConnectorId);

    if (httpConnectorId && httpApp) {
      return httpApp._legacyId || httpApp.id;
    }
  }

  if (adaptorType?.toUpperCase().startsWith('HTTP') && resourceObj?.http?.formType === 'rest' && !assistant) {
    adaptorType = adaptorType.replace(/HTTP/, 'REST');
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

  if (!flow) return emptyArray;
  const pageProcessor = getPageProcessorFromFlow(flow, resourceId);

  if (!pageProcessor) {
    return emptyArray;
  }
  const isImport = pageProcessor.type === 'import';
  const resource = selectors.resource(state, isImport ? 'imports' : 'exports', resourceId);

  if (!resource) { return emptyArray; }

  if (isImport) {
    // imports can have response transformation wherein the sample data can be saved.
    // if present, that sample data acts as the input to the response mappings
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

selectors.responseMappingInput = (state, resourceType, resourceId, flowId) => {
  const preProcessedData = selectors.getSampleDataContext(state, {
    flowId,
    resourceId,
    stage: 'responseMappingExtract',
    resourceType,
  }).data;
  const resource = selectors.resource(state, resourceType, resourceId);

  return responseMappingUtil.getResponseMappingDefaultInput(resourceType, preProcessedData, resource?.adaptorType);
};

selectors.isMapper2Supported = state => {
  const {importId} = selectors.mapping(state);

  if (!importId) return false;

  const resource = selectors.resource(state, 'imports', importId);

  if (!resource) return false;

  // IAs will only support mapper2 if its present in the doc
  if (resource._connectorId && isEmpty(resource.mappings)) {
    return false;
  }

  return !!(
    isFileAdaptor(resource) ||
    isAS2Resource(resource) ||
    resource.adaptorType === 'HTTPImport' ||
    resource.adaptorType === 'RESTImport'
  );
};

selectors.resourceHasMappings = (state, importId) => {
  const resource = selectors.resource(state, 'imports', importId);

  if (!resource) return false;

  // v2 mappings
  if (resource.mappings?.length) {
    return true;
  }

  // v1 mappings
  const mappings = mappingUtil.getMappingFromResource({
    importResource: resource,
    isFieldMapping: true,
  });
  const { fields = [], lists = [] } = mappings || {};

  return !!(fields.length || lists.length);
};

selectors.flowHasMappings = (state, flowId) => {
  const flow = selectors.resource(state, 'flows', flowId);

  if (!flow) return false;

  const pageProcessors = getAllPageProcessors(flow)?.filter(pp => pp?.type === 'import');
  const imports = pageProcessors?.map(pp => pp._importId);

  if (!imports?.length) return false;

  let hasMapping = false;

  imports.forEach(imp => {
    if (selectors.resourceHasMappings(state, imp)) {
      hasMapping = true;
    }
  });

  return hasMapping;
};

selectors.mappingEditorNotification = (state, editorId) => {
  const {editorType, resourceId} = fromSession.editor(state?.session, editorId);
  const isMapper2Supported = selectors.isMapper2Supported(state);

  if (editorType !== 'mappings' || !isMapper2Supported) return emptyObject;

  const {mapping, mappings, _connectorId} = selectors.resource(state, 'imports', resourceId) || {};

  // IAs don't support the notification
  if (_connectorId) return emptyObject;

  const resourceHasV2Mappings = !!mappings?.length;

  const { fields = [], lists = [] } = mapping || {};

  const resourceHasV1Mappings = !!(fields.length || lists.length);

  // if both mappings don't exist, no message to be displayed
  if (!resourceHasV1Mappings && !resourceHasV2Mappings) {
    return emptyObject;
  }

  const mappingVersion = selectors.mappingVersion(state);

  // if v2 mappings exist, no v2 message is shown and only show v1 message
  if (resourceHasV2Mappings) {
    if (mappingVersion === 2) return emptyObject;

    return {
      message: message.MAPPER2.MAPPER1_REFERENCE_INFO,
      variant: 'info',
    };
  }
  if (mappingVersion === 1) return emptyObject;

  return {
    message: message.MAPPER2.BANNER_WARNING,
    variant: 'warning',
  };
};

selectors.filteredV2TreeData = createSelector(
  state => selectors.v2MappingsTreeData(state),
  state => selectors.mapping(state).filter,
  state => selectors.mapping(state).lookups,
  state => selectors.mapping(state).searchKey,
  (v2TreeData, filter = [], lookups = [], searchKey) => {
    if (isEmpty(v2TreeData) || (!searchKey && (isEmpty(filter) || filter.includes('all')))) return {filteredTreeData: v2TreeData};

    let filteredTreeData = customCloneDeep(v2TreeData);
    let expandedKeys;
    let searchCount;

    if (searchKey) {
      expandedKeys = [];
      filteredTreeData = applySearchFilter(filteredTreeData, lookups, searchKey, expandedKeys);
      searchCount = countMatches(filteredTreeData, searchKey);
    } else if (filter.includes('required') && filter.includes('mapped')) {
      filteredTreeData = applyMappedFilter(filteredTreeData, lookups, true);
    } else if (filter.includes('required')) {
      filteredTreeData = applyRequiredFilter(filteredTreeData);
    } else {
      filteredTreeData = applyMappedFilter(filteredTreeData, lookups);
    }

    return {filteredTreeData, searchCount, expandedKeys};
  }
);

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
          name: resourceMap[cJob.type === 'export' ? 'exports' : 'imports']?.[cJob._expOrImpId || cJob._exportId || cJob._importId]?.name,
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
selectors.accountDashboardRunningJobs = createSelector(
  (state, options) => selectors.runningJobs(state, options)?.jobs,
  state => selectors.filter(state, FILTER_KEYS_AD.RUNNING),
  state => fromData.resourceDetailsMap(state?.data),
  (runningJobs = [], jobFilter, resourceMap) => {
    const jobsWithAdditionalProps = runningJobs.map(job => {
      if (job.children && job.children.length > 0) {
        // eslint-disable-next-line no-param-reassign
        job.children = job.children.map(cJob => {
          const additionalChildProps = {
            name: resourceMap[cJob.type === 'export' ? 'exports' : 'imports']?.[cJob._expOrImpId || cJob._exportId || cJob._importId]?.name,
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
    const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = jobFilter.paging || {};
    const dashboardJobs = jobFilter.sort ? [...jobsWithAdditionalProps].sort(comparer(jobFilter.sort)) : [...jobsWithAdditionalProps];

    return dashboardJobs.slice(currPage * rowsPerPage, (currPage + 1) * rowsPerPage);
  });

selectors.accountDashboardCompletedJobs = createSelector(
  (state, options) => selectors.completedJobs(state, options)?.jobs,
  state => selectors.filter(state, FILTER_KEYS_AD.COMPLETED),
  (completedJobs = [], jobFilter) => {
    const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = jobFilter.paging || {};
    const dashboardJobs = jobFilter.sort ? [...completedJobs].sort(comparer(jobFilter.sort)) : [...completedJobs];

    return dashboardJobs.slice(currPage * rowsPerPage, (currPage + 1) * rowsPerPage);
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
    name: resourceMap?.flows ? resourceMap?.flows[j._flowId] && resourceMap?.flows[j._flowId].name : j._flowd,
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
  selectors.userProfilePreferencesProps,
  selectors.userTimezone,
  (errorDetails, errorFilter, preferences, timezone) => ({
    ...errorDetails,
    errors: getFilteredErrors(errorDetails.errors, errorFilter, preferences, timezone),
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
  (state, integrationId) => selectors.openErrorsMap(state, integrationId),
  state => state?.data?.resources?.flows,
  (flowSections, integrationErrors, flowsList = emptyArray) =>
    // go through all sections and aggregate error counts of all the flows per sections against titleId
    flowSections.reduce((acc, section) => {
      const { flows = [], titleId } = section;

      acc[titleId] = flows.reduce((total, flow) => {
        const isFlowDisabled = !!flowsList.find(flowObj => flowObj._id === flow._id)?.disabled;

        // we consider enabled flows to show total count per section
        if (!isFlowDisabled) {
          // eslint-disable-next-line no-param-reassign
          total += (integrationErrors[flow._id] || 0);
        }

        return total;
      }, 0);

      return acc;
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

  return children.reduce((acc, child) => {
    const sectionErrorsMap = selectors.integrationErrorsPerSection(state, integrationId, child.id);

    acc[child.id] = Object.values(sectionErrorsMap).reduce(
      (total, count) => total + count,
      0);

    return acc;
  }, {});
};

/**
 * Returns error count per flow group in an integration for IAF 2.0 & DIY Flow groupings
 * A map of groupId and total errors on that group
 */
selectors.integrationErrorsPerFlowGroup = createSelector(
  selectors.integrationEnabledFlowIds,
  (state, integrationId) => selectors.openErrorsMap(state, integrationId),
  state => state?.data?.resources?.flows,
  (enabledFlowIds, errorMap, flowsList) => enabledFlowIds.reduce((acc, flowId) => {
    const flow = flowsList.find(f => f._id === flowId);
    const groupId = flow._flowGroupingId || UNASSIGNED_SECTION_ID;
    const errorCount = errorMap[flowId] || 0;

    if (!acc[groupId]) {
      acc[groupId] = 0;
    }
    acc[groupId] += errorCount;

    return acc;
  }, {})
);

selectors.getIntegrationUserNameById = (state, userId, flowId) => {
  const profile = selectors.userProfile(state) || emptyObject;

  // If it is logged in user , return its name
  if (profile._id === userId) return profile.name || profile.email;
  // else get user name from integration users list
  const integrationId = selectors.resource(state, 'flows', flowId)?._integrationId || 'none';
  const usersList = selectors.availableUsersList(state, integrationId);
  const userObject = usersList.find(user => user?.sharedWithUser?._id === userId);

  return userObject?.sharedWithUser?.name || userObject?.sharedWithUser?.email;
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

selectors.getResourceEditUrl = (state, resourceType, resourceId, childId, sectionId) => {
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
      if (resourceType === 'flows' && sectionId) {
        iaUrlPrefix = `/integrationapps/${getIntegrationAppUrlName(integrationName)}/${integrationId}/child/${childId}/flows/sections/${sectionId}`;
      } else {
        iaUrlPrefix = `/integrationapps/${getIntegrationAppUrlName(integrationName)}/${integrationId}/child/${childId}`;
      }
    } else if (resourceType === 'flows' && sectionId) {
      iaUrlPrefix = `/integrationapps/${getIntegrationAppUrlName(integrationName)}/${integrationId}/flows/sections/${sectionId}`;
    } else {
      iaUrlPrefix = `/integrationapps/${getIntegrationAppUrlName(integrationName)}/${integrationId}`;
    }
  }

  if (resourceType === 'flows') {
    const isDataLoader = selectors.isDataLoader(state, resourceId);
    const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';

    if (!iaUrlPrefix && sectionId && integrationId !== 'none') {
      return getRoutePath(`/integrations/${integrationId}/flows/sections/${sectionId}/${flowBuilderPathName}/${resourceId}`);
    }

    return getRoutePath(`${iaUrlPrefix || `/integrations/${integrationId}`}/${flowBuilderPathName}/${resourceId}`);
  }
  if (resourceType === 'integrations') {
    return getRoutePath(`${iaUrlPrefix || `/integrations/${resourceId}`}/flows`);
  }

  return getRoutePath(buildDrawerUrl({
    path: drawerPaths.RESOURCE.EDIT,
    baseUrl: resourceType,
    params: { resourceType, id: resourceId },
  }));
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

selectors.isAnyIntegrationConnectionOffline = (state, integrationId) => {
  const integration = selectors.resource(state, 'integrations', integrationId);
  const connections = selectors.resourceList(state, {
    type: 'connections',
  }).resources;

  if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
    return connections.some(c => c.offline);
  }
  const connectionIds = integration?._registeredConnectionIds || emptyArray;

  return connections.some(c => connectionIds.includes(c._id) && c.offline);
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
 * Given flowId, exportId determines if the export is a standalone export
 * i.e., not linked to any flow PG/PP
 */
selectors.isStandaloneExport = (state, flowId, exportId) => {
  if (!exportId) {
    return false;
  }

  if (!flowId || isNewId(flowId)) {
    return true;
  }

  if (selectors.isPageGenerator(state, flowId, exportId, 'exports')) {
    return false;
  }

  const { merged: flow = {} } = selectors.resourceData(state, 'flows', flowId);

  return !flow.pageProcessors?.find(pp => pp._exportId === exportId) &&
  !flow.routers?.some(r => !r.branches?.some(b => b.pageProcessors?.some(pp => pp._exportId === exportId)));
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
  const { merged: flow } = selectors.resourceData(state, 'flows', flowId);

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

  const updatedTransfers = transfers.map(transfer => {
    let integrations = [];
    const updatedTransfer = {...transfer};

    if (transfer.ownerUser && transfer.ownerUser._id) {
      updatedTransfer.isInvited = true;
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
    updatedTransfer.integrations = integrations;

    return updatedTransfer;
  });

  return updatedTransfers.filter(t => !t.isInvited || t.status !== 'unapproved');
};

selectors.isRestCsvMediaTypeExport = (state, resourceId) => {
  const { merged: resourceObj } = selectors.resourceData(state, 'exports', resourceId);
  const { _connectionId: connectionId } = resourceObj || {};

  const connection = selectors.resource(state, 'connections', connectionId);

  // This change is because of recent rest to http migration.
  // In case of old connections, connection.type will come as a rest
  // In all other cases, "connection?.http?.formType" should be used to find whether it is rest or http.
  if (connection?.type === 'rest') {
    return connection.rest?.mediaType === 'csv';
  }

  return connection?.http?.formType === 'rest' && connection?.http?.successMediaType === 'csv';
};

selectors.isDataLoaderExport = (state, resourceId, flowId) => {
  if (isNewId(resourceId)) {
    if (!flowId) return false;
    const flowObj = selectors.resourceData(state, 'flows', flowId)?.merged || emptyObject;

    return !!(flowObj.pageGenerators &&
              flowObj.pageGenerators[0] &&
              flowObj.pageGenerators[0].application === 'dataLoader');
  }
  const resourceObj = selectors.resourceData(
    state,
    'exports',
    resourceId,
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
  // If not an export or not inside a flow context , then it is not a lookup
  if (resourceType !== 'exports' || !resourceId || !flowId) return false;

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
  const { pageProcessors = [], routers = [] } = flow || {};

  return !!pageProcessors.find(pp => pp._exportId === resourceId) ||
    routers.some(router => router.branches?.some(branch => branch.pageProcessors?.some(pp => pp._exportId === resourceId)));
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
selectors.mkEditorHelperFunctions = () => createSelector(
  state => state?.session?.editors?.helperFunctions || emptyObject,
  selectors.userTimezone,
  (helperFunctions, userTimezone) => {
    const functions = {...helperFunctions};
    const timestampFunc = functions.timestamp;

    if (timestampFunc && userTimezone) {
      functions.timestamp = timestampFunc.replace('timezone', `"${userTimezone}"`);
    }

    return functions;
  }

);
selectors.editorHelperFunctions = selectors.mkEditorHelperFunctions();

selectors.isGraphqlResource = (state, resourceId, resourceType) => {
  const { merged: resource } = selectors.resourceData(
    state,
    resourceType,
    resourceId
  );

  return isGraphqlResource(resource);
};

// this selector returns true if the field/editor supports only AFE2.0 data
selectors.editorSupportsOnlyV2Data = (state, editorId) => {
  const { editorType, fieldId, flowId, resourceId, resourceType } = fromSession.editor(state?.session, editorId);
  const isPageGenerator = selectors.isPageGenerator(state, flowId, resourceId, resourceType);
  const mappingVersion = selectors.mappingVersion(state);

  // all afe fields for mapper2 should only support v2 AFE
  if (mappingVersion === 2) {
    return true;
  }

  if (['outputFilter', 'exportFilter', 'inputFilter', 'router'].includes(editorType)) {
    return true;
  }

  const isGraphqlResource = selectors.isGraphqlResource(state, resourceId, resourceType);

  // graphql fields only support v2 data
  if (isGraphqlResource && GRAPHQL_HTTP_FIELDS.includes(fieldId)) return true;

  // no use case yet where any PG field supports only v2 data
  if (isPageGenerator) return false;
  const fieldsWithOnlyV2DataSupport = [
    'file.backupPath',
    'traceKeyTemplate',
    'file.json.body',
  ];

  if (editorType === 'csvGenerator' || fieldsWithOnlyV2DataSupport.includes(fieldId)) return true;

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

  const isMonitorLevelAccess = selectors.isFormAMonitorLevelAccess(state, integrationId);

  // if we are on FB actions, below logic applies
  // for input and output filter, the filter processor(not the JS processor) uses isMonitorLevelAccess check
  if (editorType === 'mappings' ||
  (activeProcessor === 'filter' && (editorType === 'inputFilter' || editorType === 'outputFilter'))) {
    return isMonitorLevelAccess;
  }
  if (editorType === 'responseMappings') {
    if (isIntegrationApp(flow)) {
      return false;
    }

    return isMonitorLevelAccess;
  }

  const isViewMode = selectors.isFlowViewMode(state, integrationId, flowId);
  const isFreeFlow = selectors.isFreeFlowResource(state, flowId);

  return isViewMode || isFreeFlow;
};

selectors.isEditorLookupSupported = (state, editorId) => {
  const editor = fromSession.editor(state?.session, editorId);
  const {resultMode, fieldId, editorType, resourceType, resourceId} = editor;
  const fieldsWhichNotSupportlookup = [
    '_body',
    '_postBody',
    '_relativeURI',
    '_query',
    'file.xml.body',
    'file.json.body',
  ];
  const uriFields = [
    'http.relativeURI',
    'rest.relativeURI',
  ];
  const resource = selectors.resourceData(
    state,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const connection = selectors.resource(state, 'connections', resource._connectionId) || emptyObject;

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

  if (['bigquery', 'redshift'].includes(connection?.rdbms?.type)) {
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
  const {stage, resourceId, resourceType, flowId, fieldId, editorType} = editor;
  const resource = selectors.resourceData(
    state,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const connection = selectors.resource(state, 'connections', resource._connectionId) || emptyObject;
  const isPageGenerator = selectors.isPageGenerator(state, flowId, resourceId, resourceType);
  const mappingVersion = selectors.mappingVersion(state);

  // all afe fields for mapper2 should only support v2 AFE
  if (mappingVersion === 2) {
    return {shouldGetContextFromBE: true, isMapperField: true};
  }

  // for lookup fields, BE doesn't support v1/v2 yet
  if (fieldId?.startsWith('lookup') || fieldId?.startsWith('_')) {
    return {shouldGetContextFromBE: false, sampleData: { data: sampleData || { myField: 'sample' }}};
  }

  // TODO: BE would be deprecating native REST adaptor as part of IO-19864
  // we can remove this logic from UI as well once that is complete
  if (['RESTImport', 'RESTExport'].includes(resource.adaptorType) && !connection.isHTTP) {
    let _sampleData;

    if (['outputFilter', 'exportFilter', 'inputFilter'].includes(editorType)) {
      // native REST adaptor filters
      _sampleData = Array.isArray(sampleData) ? {
        rows: sampleData,
      } : {
        record: sampleData,
      };
    } else if (!isPageGenerator) {
      _sampleData = { data: sampleData || { myField: 'sample' }};
    }

    return {
      shouldGetContextFromBE: false,
      sampleData: _sampleData,
    };
  }

  if (
    ['structuredFileGenerator', 'flowTransform', 'responseTransform', 'netsuiteLookupFilter', 'salesforceLookupFilter'].includes(editorType) ||
  HOOK_STAGES.includes(stage)
  ) {
    return {shouldGetContextFromBE: false, sampleData};
  }

  return {shouldGetContextFromBE: true};
};

selectors.isEditorSaveInProgress = (state, editorId) => {
  // at a time only one of below editors would be active,
  // so checking save status for all
  const {saveStatus} = selectors.editor(state, editorId);
  const editorSaveInProgress = saveStatus === AFE_SAVE_STATUS.REQUESTED;
  const mappingSaveInProgress = selectors.mappingSaveStatus(state)?.saveInProgress;
  const responseMappingSaveInProgress = selectors.responseMappingSaveStatus(state)?.saveInProgress;

  return !!(editorSaveInProgress || mappingSaveInProgress || responseMappingSaveInProgress);
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

    appType = connection.assistant || rdbmsSubTypeToAppType(connection.rdbms?.type) || connection.http?.formType || connection.type;
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
  const dateFormat = selectors.userProfilePreferencesProps(state)?.dateFormat;

  let licenseMessageContent = '';
  let listViewLicenseMesssage = '';
  let expired = false;
  let trialExpired = false;
  let showTrialLicenseMessage = false;
  const resumable = license?.resumable;

  if (resumable) {
    licenseMessageContent = 'Your subscription has been renewed. Click Reactivate to continue.';
  } else if (!license?.expires && license?.trialEndDate && trialExpiresInDays <= 0) {
    licenseMessageContent = `Trial expired on ${moment(license.trialEndDate).format(dateFormat || 'MMM Do, YYYY')}`;
    listViewLicenseMesssage = `Expired ${Math.abs(trialExpiresInDays)} days ago`;
    showTrialLicenseMessage = true;
    trialExpired = true;
  } else if (!license?.expires && license?.trialEndDate && trialExpiresInDays > 0) {
    licenseMessageContent = `Trial expires in ${trialExpiresInDays} days.`;
    listViewLicenseMesssage = `Expiring in ${trialExpiresInDays} days.`;
    showTrialLicenseMessage = true;
  } else if (expiresInDays <= 0) {
    expired = true;
    licenseMessageContent = `Your subscription expired on ${moment(license.expires).format(dateFormat || 'MMM Do, YYYY')}. Contact sales to renew your subscription.`;
    listViewLicenseMesssage = `Expired ${Math.abs(expiresInDays)} days ago`;
  } else if (expiresInDays > 0 && expiresInDays <= 30) {
    licenseMessageContent = `Your subscription will expire in ${getTextAfterCount('day', expiresInDays)}. Contact sales to renew your subscription.`;
    listViewLicenseMesssage = `Expiring in ${getTextAfterCount('day', expiresInDays)}`;
  }

  return {licenseMessageContent, expired, trialExpired, showTrialLicenseMessage, resumable, licenseId: license?._id, listViewLicenseMesssage};
};

// #region flow step debug logs selectors
selectors.hasLogsAccess = (state, resourceId, resourceType, isNew, flowId) => {
  if (!['exports', 'imports'].includes(resourceType) || !flowId || isNew) return false;
  const resource = selectors.resource(state, resourceType, resourceId);
  const connection = selectors.resource(state, 'connections', resource?._connectionId) || emptyObject;

  // It should return false for all http file providers
  if (resource?.http?.type === 'file') {
    return false;
  }

  return isRealtimeExport(resource) || ['HTTPImport', 'HTTPExport'].includes(resource?.adaptorType) || (connection.isHTTP && connection.type === 'rest');
};

selectors.canEnableDebug = (state, exportId, flowId) => {
  if (!exportId || !flowId) return false;

  const flow = selectors.resource(state, 'flows', flowId) || emptyObject;
  const permissions = selectors.userPermissions(state) || emptyObject;

  if ([
    USER_ACCESS_LEVELS.ACCOUNT_OWNER,
    USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
  ].includes(permissions.accessLevel)) {
    return true;
  }

  const userPermissionsOnIntegration = selectors.resourcePermissions(state, 'integrations', flow._integrationId)?.accessLevel;

  if (userPermissionsOnIntegration && userPermissionsOnIntegration !== INTEGRATION_ACCESS_LEVELS.MONITOR) return true;

  return false;
};

selectors.mkLogsInCurrPageSelector = () => createSelector(
  selectors.logsSummary,
  state => selectors.filter(state, FLOWSTEP_LOG_FILTER_KEY),
  (debugLogsList, filterOptions) => {
    const { currPage = 0 } = filterOptions.paging || {};

    return debugLogsList.slice(currPage * FLOWSTEP_LOG_DEFAULT_ROWS_PER_PAGE, (currPage + 1) * FLOWSTEP_LOG_DEFAULT_ROWS_PER_PAGE);
  }
);

// #endregion flow step debug logs selectors

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

selectors.isAccountOwnerMFAEnabled = state => {
  const accountOwner = selectors.ownerUser(state);

  return !!accountOwner?.mfaEnabled;
};

selectors.userLinkedSSOClientId = state => {
  if (selectors.isAccountOwner(state)) {
    return selectors.oidcSSOClient(state)?._id;
  }
  const profile = selectors.userProfile(state) || emptyObject;

  return profile.authTypeSSO?._ssoClientId;
};

selectors.userRequiredToAgreeTOSAndPP = state => selectors.agreeTOSAndPPRequired(state) && !selectors.userAgreedTOSAndPP(state);

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

selectors.primaryAccounts = createSelector(
  state => selectors.isAccountOwner(state),
  state => state?.user?.org?.accounts,
  (isAccountOwner, allAccounts) => {
    const orgAccounts = allAccounts?.filter(acc => acc._id !== ACCOUNT_IDS.OWN);

    if (isAccountOwner) {
      return emptyList;
    }

    return orgAccounts || emptyList;
  }
);

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

selectors.httpPagingValidationError = (state, formKey, pagingMethodsToValidate, pagingFieldsToValidate) => {
  const formFields = selectors.formState(state, formKey)?.fields || {};
  const pagingMethod = formFields['http.paging.method']?.value;

  // if a particular paging method is selected
  // do validations against pagingFieldsToValidate to verify if any field contains the setup
  if (pagingMethodsToValidate && pagingMethod && Object.keys(pagingMethodsToValidate).includes(pagingMethod)) {
    const regex = pagingMethodsToValidate[pagingMethod];

    const validated = pagingFieldsToValidate?.some(f => new RegExp(regex).test(formFields[f]?.value));

    if (!validated) {
      return `The paging method selected must use {{export.http.paging.${pagingMethod}}} in either the relative URI or HTTP request body.`;
    }
  }
};

selectors.httpDeltaValidationError = (state, formKey, deltaFieldsToValidate) => {
  const formFields = selectors.formState(state, formKey)?.fields || {};
  const exportType = formFields.type?.value;
  const regex = /.*{{.*lastExportDateTime.*}}/;

  // if delta export type
  // do validations against deltaFieldsToValidate to verify if any field contains the setup
  if (exportType === 'delta' && deltaFieldsToValidate) {
    const validated = deltaFieldsToValidate.some(f => regex.test(formFields[f]?.value));

    if (!validated) {
      return 'Delta exports must use {{lastExportDateTime}} in either the relative URI or HTTP request body.';
    }
  }
};

selectors.showAmazonRestrictedReportType = (state, formKey) => {
  const connectionId = selectors.fieldState(state, formKey, '_connectionId')?.value;
  const apiType = selectors.fieldState(state, formKey, 'unencrypted.apiType')?.value;
  const relativeURI = selectors.fieldState(state, formKey, 'http.relativeURI')?.value;
  const connectionType = selectors.resource(state, 'connections', connectionId)?.http?.type;

  return ((connectionType === 'Amazon-Hybrid' && apiType === 'Amazon-SP-API') ||
          connectionType === 'Amazon-SP-API') &&
          relativeURI?.startsWith('/reports/2021-06-30/documents/');
};

selectors.isParserSupported = (state, formKey, parser) => {
  const formDetails = selectors.formState(state, formKey);
  const exportId = formDetails?.parentContext?.resourceId;

  // selectors.resource won't work in case of new exports, so using selectors.resourceData here.
  const { adaptorType, assistant } = selectors.resourceData(state, 'exports', exportId)?.merged || {};

  //  At present, we are checking only for HTTP export. Using the assistant property to exclude other exports with adaptorType as "HTTPExport".
  //  For remaining, we are returning true so that it does not affect the existing functionality, as it has been used as a conditional.

  if (adaptorType !== 'HTTPExport' || FILE_PROVIDER_ASSISTANTS.includes(assistant)) return true;

  const formValues = formDetails?.value;
  const connectionId = selectors.fieldState(state, formKey, '_connectionId')?.value;
  const connection = selectors.resource(state, 'connections', connectionId);

  return finalSuccessMediaType(formValues, connection) === parser;
};

const resourceListSelector = selectors.makeResourceListSelector();

selectors.globalSearchResults = createSelector(
  [
    state => state,
    (state, keyword, filters, filterBlackList) => {
      if (keyword?.length < 2) return {};
      const resourceIds = Object.keys(filterMap);

      const results = resourceIds.reduce((acc, id) => {
        const resourceId = filterMap[id]?.resourceURL;

        if ((filters?.length > 0 && !(filters.includes(resourceId))) || filterBlackList.includes(resourceId)) return acc;
        const resourceResults = resourceListSelector(state, {type: resourceId, take: 3, keyword, searchBy: ['name']});
        let resourcesList = resourceResults?.resources;

        if (id === 'connections') {
          resourcesList = resourcesList.map(connection => ({...connection, isOnline: selectors.isConnectionOffline(state, connection?._id)}));
        }
        if (resourcesList?.length > 0) {
          acc[id] = resourcesList;
        }

        return acc;
      }, {});

      return results;
    },
  ],
  (_, resourceResults) => resourceResults
);

selectors.revisionsFilter = (state, integrationId) => {
  const filterKey = getRevisionFilterKey(integrationId);

  return selectors.filter(state, filterKey);
};

selectors.filteredRevisions = createSelector(
  selectors.revisions,
  selectors.revisionsFilter,
  (revisionsList, revisionsFilter) => getFilteredRevisions(customCloneDeep(revisionsList), revisionsFilter)
);

selectors.getCurrPageFilteredRevisions = createSelector(
  selectors.filteredRevisions,
  selectors.revisionsFilter,
  (filteredRevisions, filters) => getPaginatedRevisions(filteredRevisions, filters));

selectors.diffResourceName = (state, { resourceId, resourceType, resourceDiff }) => {
  if (!resourceId || !resourceType) return '';
  const resource = selectors.resource(state, resourceType, resourceId);

  if (resource?.name) {
    return resource.name;
  }
  // If the resource does not exist and it is about to create a new resource as part of the revision
  // Then fetch resource name from the diff document
  if (resourceDiff?.action === REVISION_DIFF_ACTIONS.NEW && resourceDiff?.after?.name) {
    return resourceDiff.after.name;
  }

  // If neither of the above cases are applied, fall back to showing resourceId
  return resourceId;
};

selectors.resourceReferencesPerIntegration = createSelector(
  selectors.resourceReferences,
  state => state.data.resources.flows,
  state => state.data.resources.integrations,
  (resourceReferences, flowsList, integrationsList) => {
    if (!resourceReferences) return null;
    const flowReferences = resourceReferences.filter(ref => ref.resourceType === 'flows');
    const results = [];

    flowReferences.forEach(flowRef => {
      const integrationId = flowsList?.find(f => f._id === flowRef.id)?._integrationId;
      const integrationName = integrationsList?.find(i => i._id === integrationId)?.name;

      results.push({
        flowId: flowRef.id,
        flowName: flowRef.name,
        integrationId,
        integrationName,
      });
    });

    return results;
  }
);

selectors.currentRevisionInstallSteps = createSelector(
  selectors.revisionInstallSteps,
  (state, _, revisionId) => selectors.updatedRevisionInstallStep(state, revisionId),
  (revisionInstallSteps, updatedRevisionInstallStep) => {
    const updatedSteps = revisionInstallSteps.map(step => {
      if (step.isCurrentStep) {
        return {...step, ...updatedRevisionInstallStep};
      }

      return step;
    });

    return updatedSteps.reduce((steps, currStep) => {
      if (currStep.url && currStep._forSourceConnectionId) {
        // Incase of Bundle Install step, fetch related connection step's connectionId and populate the same on this step
        const connectionId = updatedSteps.find(step => step?.sourceConnection?._id === currStep._forSourceConnectionId)?._connectionId;

        if (connectionId) {
          return [...steps, {...currStep, connectionId}];
        }
      }

      return [...steps, currStep];
    }, []);
  });

selectors.areAllRevisionInstallStepsCompleted = (state, integrationId, revisionId) => {
  const installSteps = selectors.currentRevisionInstallSteps(state, integrationId, revisionId);

  // TODO:  check for hidden step. Do we need to consider them?
  return installSteps.every(step => step.completed);
};

selectors.accountHasSandbox = state => {
  const accounts = selectors.accountSummary(state);
  const selectedAccount = accounts?.find(a => a.selected);

  return !!(selectedAccount?.hasSandbox || selectedAccount?.hasConnectorSandbox);
};

// This selector returns the aliases defined at the resource level
selectors.ownAliases = createSelector(
  (state, resourceType, id) => selectors.resource(state, resourceType, id)?.aliases || emptyArray,
  (state, _1, _2, filterKey) => selectors.filter(state, filterKey),
  (aliases, aliasesFilter) => {
    const tempAliases = aliases.map(aliasData => ({ type: getResourceFromAlias(aliasData).resourceType, ...aliasData }));

    return aliasesFilter?.sort ? tempAliases.sort(comparer(aliasesFilter.sort)) : aliases;
  });

// This selector returns the aliases defined at its parent level
// If aliases are defined at both the integration and parentIntegration level,
// if some of aliases have common aliasId among them, then aliases of integration takes precedence over parentIntegration's
selectors.inheritedAliases = createSelector(
  (state, id) => {
    const flow = selectors.resource(state, 'flows', id);

    if (!flow?._integrationId) return;

    return selectors.resource(state, 'integrations', flow._integrationId)?.aliases?.map(
      aliasData => ({...aliasData, _parentId: flow._integrationId, type: getResourceFromAlias(aliasData).resourceType })
    );
  },
  (state, id) => {
    const flow = selectors.resource(state, 'flows', id);

    if (!flow || !flow._integrationId) return;

    const integration = selectors.resource(state, 'integrations', flow._integrationId);

    if (!integration?._parentId) return;

    return selectors.resource(state, 'integrations', integration._parentId)?.aliases?.map(
      aliasData => ({...aliasData, _parentId: integration._parentId, type: getResourceFromAlias(aliasData).resourceType })
    );
  },
  (state, _1, filterKey) => selectors.filter(state, filterKey),
  (integrationAliases, parentIntegrationAliases, aliasesFilter) => {
    if (!integrationAliases && !parentIntegrationAliases) return emptyArray;

    let allInheritedAliases;

    if (parentIntegrationAliases && integrationAliases) {
      const filteredParentIntegrationAliases = parentIntegrationAliases.filter(aliasData => !integrationAliases.some(ia => ia.alias === aliasData.alias));

      allInheritedAliases = [...integrationAliases, ...filteredParentIntegrationAliases];
    } else if (integrationAliases) {
      allInheritedAliases = [...integrationAliases];
    } else {
      allInheritedAliases = [...parentIntegrationAliases];
    }

    return aliasesFilter?.sort ? allInheritedAliases.sort(comparer(aliasesFilter.sort)) : allInheritedAliases;
  });

// This selector returns the resourcelist for a given alias resourcetype
selectors.aliasResources = createSelector(
  (_1, aliasResourceType) => aliasResourceType,
  (state, aliasResourceType) => selectors.resources(state, aliasResourceType),
  (_1, _2, _3, aliasContextResourceId) => aliasContextResourceId,
  (state, _2, aliasContextResourceType, aliasContextResourceId) => {
    let integrationId;

    if (aliasContextResourceType === 'flows') {
      const flow = selectors.resource(state, aliasContextResourceType, aliasContextResourceId);

      if (!flow || !flow._integrationId) return emptyObject;

      integrationId = flow._integrationId;
    }

    return selectors.resource(state, 'integrations', integrationId || aliasContextResourceId) || emptyObject;
  },
  (resourceType, resourceList, aliasContextResourceId, integration) => {
    const integrationId = integration._id;
    const registeredConnectionIds = integration._registeredConnectionIds;

    if (!resourceList) return emptyArray;

    // should return connections registered to the integration in which alias is being defined
    if (resourceType === 'connections') {
      return resourceList.filter(res => registeredConnectionIds?.includes(res._id));
    }
    // should return flows attached to the integration in which alias is being defined
    // if the alias is being defined at flow level, should filter this particular flow
    if (resourceType === 'flows') {
      return resourceList.filter(res => (res._integrationId === integrationId) && (res._id !== aliasContextResourceId));
    }

    // should return exports/imports whose connection is registered to the integration in which alias is being defined
    return resourceList.filter(res => registeredConnectionIds?.includes(res._connectionId));
  });

selectors.allAliases = createSelector(
  (state, resourceId) => state.session.aliases[resourceId]?.aliases,
  (state, _1, filterKey) => selectors.filter(state, filterKey),
  (aliases, aliasesFilter) => {
    if (!aliases) return emptyArray;

    const allAliases = aliases.map(aliasData => ({ _id: aliasData.alias, type: getResourceFromAlias(aliasData).resourceType, ...aliasData}));

    return aliasesFilter?.sort ? allAliases.sort(comparer(aliasesFilter.sort)) : allAliases;
  });

selectors.retryUsersList = createSelector(
  selectors.userProfile,
  (state, integrationId) => selectors.availableUsersList(state, integrationId),
  (state, _1, flowId, resourceId) => selectors.retryList(state, flowId, resourceId),
  (profile, availableUsersList, retryJobs) => {
    if (!Array.isArray(retryJobs)) {
      return [{ _id: 'all', name: 'All users'}];
    }

    const allUsersTriggeredRetry = retryJobs.reduce((users, job) => {
      if (!job.triggeredBy) {
        return users;
      }

      if (job.triggeredBy === 'auto') {
        users.push({
          _id: job.triggeredBy,
          name: 'Auto-retried',
        });
      } else {
        const userObject = availableUsersList.find(userOb => userOb.sharedWithUser?._id === job.triggeredBy);
        const name = profile._id === job.triggeredBy
          ? (profile.name || profile.email)
          : (userObject?.sharedWithUser?.name || userObject?.sharedWithUser?.email);

        if (name) {
          users.push({
            _id: job.triggeredBy,
            name,
          });
        }
      }

      return users;
    }, []);

    return [{ _id: 'all', name: 'All users'}, ...(uniqBy(allUsersTriggeredRetry, '_id'))];
  }
);

selectors.mkFlowResourcesRetryStatus = () => {
  const flowResources = selectors.mkFlowResources();

  return createSelector(
    state => state?.session?.errorManagement?.retryData?.retryStatus,
    (_1, flowId) => flowId,
    (state, flowId) => flowResources(state, flowId)?.filter(res => res.type === 'exports' || res.type === 'imports'),
    (resourcesRetryStatus, flowId, flowResources) => {
      const finalResourcesRetryStatus = {
        isAnyRetryInProgress: false,
        resourcesWithRetryCompleted: [],
      };

      if (!resourcesRetryStatus || !resourcesRetryStatus[flowId]) {
        return finalResourcesRetryStatus;
      }

      finalResourcesRetryStatus.isAnyRetryInProgress = !!flowResources.find(res => resourcesRetryStatus?.[flowId]?.[res._id] === 'inProgress');
      finalResourcesRetryStatus.resourcesWithRetryCompleted = flowResources.filter(res => resourcesRetryStatus?.[flowId]?.[res._id] === 'completed');

      return finalResourcesRetryStatus;
    }
  );
};

selectors.flowResourcesRetryStatus = selectors.mkFlowResourcesRetryStatus();
selectors.getShopifyStoreLink = (state, resourceId) => {
  const {_connectorId} = selectors.resourceData(
    state,
    'connections',
    resourceId,
  )?.merged || emptyObject;

  if (!_connectorId) return SHOPIFY_APP_STORE_LINKS.DIY_APP;

  /* uncomment the below code when
    'SAP Business ByDesign Integration App' or 'Microsoft Business Central Integration App' are published
    const integration = selectors.resource(state, 'integrations', _integrationId);
    if (integration.name.toLowerCase().includes('microsoft')) return SHOPIFY_APP_STORE_LINKS.MICROSOFT_BUSINESS_IA_APP;
    if (integration.name.toLowerCase().includes('sap')) return SHOPIFY_APP_STORE_LINKS.SAP_BUSINESS_IA_APP; */

  return SHOPIFY_APP_STORE_LINKS.NETSUITE_IA_APP;
};

selectors.isHttpConnector = (state, resourceId, resourceType) => {
  const resource = selectors.resourceData(state, resourceType, resourceId)?.merged;

  if (resourceType === 'connections') {
    const isNewHTTPFramework = !!getHttpConnector(resource?.http?._httpConnectorId);

    if (!isNewHTTPFramework) return false;
  }
  if (!['exports', 'imports'].includes(resourceType) || !resource?._connectionId) {
    return false;
  }

  const connectionObj = selectors.resourceData(
    state,
    'connections',
    resource._connectionId,
  )?.merged || emptyObject;

  const isNewHTTPFramework = !!getHttpConnector(connectionObj?.http?._httpConnectorId);

  const isHttpConnectorParentFormView = selectors.isHttpConnectorParentFormView(state, resourceId);

  return isNewHTTPFramework && !isHttpConnectorParentFormView;
};

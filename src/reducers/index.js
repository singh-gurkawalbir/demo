import deepClone from 'lodash/cloneDeep';
import { combineReducers } from 'redux';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import { uniq, some, map, keys } from 'lodash';
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
import {
  changePasswordParams,
  changeEmailParams,
  pingConnectionParams,
} from '../sagas/api/apiPaths';
import { getFieldById } from '../forms/utils';
import { upgradeButtonText, expiresInfo } from '../utils/license';
import commKeyGen from '../utils/commKeyGenerator';
import {
  isRealtimeExport,
  isSimpleImportFlow,
  isRunnable,
  showScheduleIcon,
} from './flowsUtil';
import { getUsedActionsMapForResource } from '../utils/flows';
import { isValidResourceReference } from '../utils/resource';
import { processSampleData } from '../utils/sampleData';

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

export function isLoadingAnyResource(state) {
  return fromComms.isLoadingAnyResource(state.comms);
}

export function isAllLoadingCommsAboveThreshold(state) {
  const loadingOrErrored = allLoadingOrErrored(state);

  if (loadingOrErrored === null) return;

  return (
    loadingOrErrored.filter(
      resource =>
        resource.status === fromComms.COMM_STATES.LOADING &&
        Date.now() - resource.timestamp < Number(process.env.NETWORK_THRESHOLD)
    ).length === 0
  );
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

export function previewTemplate(state, templateId) {
  return fromSession.previewTemplate(state && state.session, templateId);
}

export function isFileUploaded(state) {
  return fromSession.isFileUploaded(state && state.session);
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
  if (!state) return {};

  return fromSession.agentAccessToken(state.session, id);
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
  if (!state) return {};

  return fromSession.editor(state.session, id);
}

export function mapping(state, id) {
  if (!state) return [];

  return fromSession.mapping(state.session, id);
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
  if (!state) return {};

  return fromSession.processorRequestOptions(state.session, id);
}

export function getSampleData(state, flowId, resourceId, stage, options = {}) {
  return fromSession.getSampleData(
    state && state.session,
    flowId,
    resourceId,
    stage,
    options
  );
}

export function getFlowDataState(state, flowId, resourceId, isPageGenerator) {
  return fromSession.getFlowDataState(
    state && state.session,
    flowId,
    resourceId,
    isPageGenerator
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

export function accountShareHeader(state, path) {
  return fromUser.accountShareHeader(state && state.user, path);
}

export function userOwnPreferences(state) {
  return fromUser.userOwnPreferences(state && state.user);
}

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
  return (
    state &&
    state.auth &&
    state.auth.commStatus === fromComms.COMM_STATES.LOADING
  );
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

  return (
    state &&
    state.comms &&
    state.comms[commKey] &&
    state.comms[commKey].status &&
    state.comms[commKey].status === fromComms.COMM_STATES.SUCCESS
  );
}

export function changePasswordFailure(state) {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );

  return (
    state &&
    state.comms &&
    state.comms[commKey] &&
    state.comms[commKey].status &&
    state.comms[commKey].status === fromComms.COMM_STATES.ERROR
  );
}

export function changePasswordMsg(state) {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );

  return (
    (state &&
      state.comms &&
      state.comms[commKey] &&
      state.comms[commKey].message) ||
    ''
  );
}

export function changeEmailFailure(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );

  return (
    state &&
    state.comms &&
    state.comms[commKey] &&
    state.comms[commKey].status &&
    state.comms[commKey].status === fromComms.COMM_STATES.ERROR
  );
}

export function changeEmailSuccess(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );

  return (
    state &&
    state.comms &&
    state.comms[commKey] &&
    state.comms[commKey].status &&
    state.comms[commKey].status === fromComms.COMM_STATES.SUCCESS
  );
}

export function changeEmailMsg(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );

  return (
    (state &&
      state.comms &&
      state.comms[commKey] &&
      state.comms[commKey].message) ||
    ''
  );
}

// #endregion PASSWORD & EMAIL update selectors for modals

// #region USER SELECTORS
export function testConnectionCommState(state) {
  const commKey = commKeyGen(
    pingConnectionParams.path,
    pingConnectionParams.opts.method
  );

  if (
    !(
      state &&
      state.comms &&
      state.comms[commKey] &&
      state.comms[commKey].status
    )
  )
    return {
      commState: null,
      message: null,
    };

  const comm = state.comms[commKey];

  return {
    commState: comm.status,
    message: comm.message,
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

const emptyObject = {};

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
      resourceType: 'exports',
    }).resources;

    draft.isRealtime = isRealtimeExport(pg);
    draft.isSimpleImport = isSimpleImportFlow(pg);
    draft.isRunnable = isRunnable(allExports, pg, draft);
    draft.showScheduleIcon = showScheduleIcon(allExports, pg, draft);
    // TODO: add logic to properly determine if this flow should
    // display mapping/settings. This would come from the IA metadata.
    draft.showMapping = true;
    draft.hasSettings = !!flow._connectorId;
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
      resourceType: 'exports',
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

export function resourceListWithPermissions(state, options) {
  const list = resourceList(state, options);
  // eslint-disable-next-line no-use-before-define
  const permissions = userPermissions(state);

  list.resources = list.resources.map(r => {
    // eslint-disable-next-line no-param-reassign
    r.permissions = deepClone(permissions);

    return r;
  });

  return list;
}

export function resourcesByIds(state, resourceType, resourceIds) {
  const { resources } = resourceListWithPermissions(state, {
    type: resourceType,
  });

  return resources.filter(r => resourceIds.indexOf(r._id) >= 0);
}

export function matchingConnectionList(state, connection = {}) {
  const { resources = [] } = resourceList(state, {
    type: 'connections',
    filter: {
      $where() {
        if (connection.assistant) {
          return this.assistant === connection.assistant && !this._connectorId;
        }

        if (['netsuite'].indexOf(connection.type) > -1) {
          return (
            this.type === 'netsuite' &&
            !this._connectorId &&
            (this.netsuite.account && this.netsuite.environment)
          );
        }

        return this.type === connection.type && !this._connectorId;
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

export function filteredResourceList(state, resource, resourceType) {
  return resourceType === 'connections'
    ? matchingConnectionList(state, resource)
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
// #begin integrationApps Region

export function integrationAppSettingsFormState(state, integrationId, flowId) {
  return fromSession.integrationAppSettingsFormState(
    state.session,
    integrationId,
    flowId
  );
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
      resources = resources.filter(
        conn => registeredConnections.indexOf(conn._id) >= 0
      );
    }
  } else if (integration._connectorId) {
    resources = resources.filter(conn => conn._integrationId === integrationId);
  }

  return resources;
}

export function integrationAppResourceList(state, integrationId, storeId) {
  if (!state) return { connections: [], flows: [] };
  const integrationResource = fromData.integrationAppSettings(
    state.data,
    integrationId
  );
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

export function integrationAppConnectionList(state, integrationId, storeId) {
  return integrationAppResourceList(state, integrationId, storeId).connections;
}

export function integrationAppSettings(state, id, storeId) {
  if (!state) return { settings: {} };
  const integrationResource = fromData.integrationAppSettings(state.data, id);
  const uninstallSteps = fromSession.uninstallSteps(
    state.resource,
    id,
    storeId
  );

  return { ...integrationResource, ...uninstallSteps };
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
  if (!state) return [];
  let flowSections = [];
  const integrationResource = fromData.integrationAppSettings(state.data, id);
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
    titleId: sec.title ? sec.title.replace(/\s/g, '') : '',
  }));
}

export function integrationAppGeneralSettings(state, id, storeId) {
  if (!state) return {};
  let fields;
  let subSections;
  const integrationResource = fromData.integrationAppSettings(state.data, id);
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

export function integrationAppFlowSettings(state, id, section, storeId) {
  if (!state) return {};
  const integrationResource = fromData.integrationAppSettings(state.data, id);
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
      sec => sec.title && sec.title.replace(/\s/g, '') === section
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
  const uninstallSteps = fromSession.uninstallSteps(
    state && state.session,
    integrationId
  );

  if (!uninstallSteps || !Array.isArray(uninstallSteps)) {
    return [];
  }

  return produce(uninstallSteps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });
}

export function addNewStoreSteps(state, integrationId) {
  const addNewStoreSteps = fromSession.addNewStoreSteps(
    state && state.session,
    integrationId
  );

  if (!addNewStoreSteps || !Array.isArray(addNewStoreSteps)) {
    return [];
  }

  return produce(addNewStoreSteps, draft => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });
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

// #endregion

// #region PUBLIC ACCOUNTS SELECTORS
export function integratorLicense(state) {
  const preferences = userPreferences(state);

  return fromUser.integratorLicense(state.user, preferences.defaultAShareId);
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

export function accountSummary(state) {
  return fromUser.accountSummary(state.user);
}

export function notifications(state) {
  return fromUser.notifications(state.user);
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
      connector = published.find(i => i._id === t._connectorId) || { user: {} };

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

export function flowMetadata(state, id, scope) {
  if (!state || !id) return {};

  const flows = flowListWithMetadata(state, {
    type: 'flows',
    filter: {
      _id: id,
    },
  }).resources;
  const master = flows && flows[0];
  const { patch, conflict } = fromSession.stagedResource(
    state.session,
    id,
    scope
  );

  if (!master && !patch) return { merged: {} };

  let merged;
  let lastChange;

  if (patch) {
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

export function resourceData(state, resourceType, id, scope) {
  if (!state || !resourceType || !id) return {};
  let type = resourceType;

  if (resourceType.indexOf('/licenses') >= 0) {
    type = 'connectorLicenses';
  }

  const master = resource(state, type, id);
  const { patch, conflict } = fromSession.stagedResource(
    state.session,
    id,
    scope
  );

  if (!master && !patch) return { merged: {} };

  // console.log('patch:', patch);
  let merged;
  let lastChange;

  if (patch) {
    // If the patch is not deep cloned, its values are also mutated and
    // on some operations can corrupt the merged result.
    const patchResult = jsonPatch.applyPatch(
      master ? jsonPatch.deepClone(master) : {},
      jsonPatch.deepClone(patch)
    );

    // console.log('patchResult', patchResult);
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

// #endregion

export function commStatusByKey(state, key) {
  const commStatus = state && state.comms && state.comms[key];

  return commStatus;
}

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
  tokensList.total = (tokensList.resources || []).length;
  tokensList.count = (tokensList.resources || []).length;

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
  const preferences = userPreferences(state);
  const resourceMap = resourceDetailsMap(state);
  const getEndedAtAsString = job =>
    job.endedAt &&
    moment(job.endedAt).format(
      `${preferences.dateFormat} ${preferences.timeFormat}`
    );

  return jobs.map(job => {
    if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      job.children = job.children.map(cJob => {
        const additionalChildProps = {
          endedAtAsString: getEndedAtAsString(cJob),
          name: cJob._exportId
            ? resourceMap.exports[cJob._exportId].name
            : resourceMap.imports[cJob._importId].name,
        };

        if (cJob.retries && cJob.retries.length > 0) {
          // eslint-disable-next-line no-param-reassign
          cJob.retries = cJob.retries.map(r => ({
            ...r,
            endedAtAsString: getEndedAtAsString(r),
          }));
        }

        return { ...cJob, ...additionalChildProps };
      });
    }

    const additionalProps = {
      endedAtAsString: getEndedAtAsString(job),
      name:
        resourceMap.flows[job._flowId] && resourceMap.flows[job._flowId].name,
    };

    if (job.doneExporting && job.numPagesGenerated > 0) {
      additionalProps.percentComplete = Math.floor(
        (job.numPagesProcessed * 100) /
          (job.numPagesGenerated *
            ((resourceMap.flows[job._flowId] &&
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
  const jErrors = fromData.jobErrors(state.data, jobId);
  const preferences = userPreferences(state);

  return jErrors.map(je => {
    let similarErrors = [];

    if (je.similarErrors && je.similarErrors.length > 0) {
      similarErrors = je.similarErrors.map(sje => ({
        ...sje,
        createdAtAsString:
          sje.createdAt &&
          moment(sje.createdAt).format(
            `${preferences.dateFormat} ${preferences.timeFormat}`
          ),
      }));
    }

    return {
      ...je,
      createdAtAsString:
        je.createdAt &&
        moment(je.createdAt).format(
          `${preferences.dateFormat} ${preferences.timeFormat}`
        ),
      similarErrors,
    };
  });
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

  // Formats sample data into readable form
  if (sampleData) return processSampleData(sampleData, resource);
  else if (assistant) {
    if (resource.sampleData) {
      return resource.sampleData;
    }

    const sampleData = assistantPreviewData(state, resourceId);

    return sampleData;

    // get assistants sample data
  } else if (adaptorType === 'NetSuiteDistributedImport') {
    // eslint-disable-next-line camelcase
    const { _connectionId: connectionId, netsuite_da } = resource;
    const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${netsuite_da.recordType}`;
    const { data: sampleData } = metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
    });

    return sampleData;
  } else if (adaptorType === 'SalesforceImport') {
    const { _connectionId: connectionId, salesforce } = resource;
    const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`;
    const { data: sampleData } = metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey: 'salesforce-recordType',
    });

    return sampleData;
  }
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

export function getUsedActionsForResource(
  state,
  resourceId,
  resourceType,
  flowNode
) {
  const { merged: resource } = resourceData(state, resourceType, resourceId);

  return getUsedActionsMapForResource(resource, resourceType, flowNode);
}

export function debugLogs(state) {
  return fromSession.debugLogs(state && state.session);
}

export function resourceNamesByIds(state, type) {
  const { resources } = resourceList(state, { type });
  const resourceIdNameMap = {};

  resources.forEach(r => (resourceIdNameMap[r._id] = r.name || r._id));

  return resourceIdNameMap;
}

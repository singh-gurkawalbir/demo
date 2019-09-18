import { combineReducers } from 'redux';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import app, * as fromApp from './app';
import data, * as fromData from './data';
import session, * as fromSession from './session';
import comms, * as fromComms from './comms';
import auth from './authentication';
import user, * as fromUser from './user';
import actionTypes from '../actions/types';
import {
  changePasswordParams,
  changeEmailParams,
  pingConnectionParams,
} from '../sagas/api/apiPaths';
import { getFieldById } from '../forms/utils';
import commKeyGen from '../utils/commKeyGenerator';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  TILE_STATUS,
  INTEGRATION_MODES,
  STANDALONE_INTEGRATION,
  ACCOUNT_IDS,
  SUITESCRIPT_CONNECTORS,
} from '../utils/constants';

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

export function connectorMetadata(state, fieldName, id, _integrationId) {
  return fromSession.connectorMetadata(
    state && state.session,
    fieldName,
    id,
    _integrationId
  );
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

export function editor(state, id) {
  if (!state) return {};

  return fromSession.editor(state.session, id);
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

export function avatarUrl(state) {
  return fromUser.avatarUrl(state.user);
}

export function userProfile(state) {
  return state && state.user && state.user.profile;
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
export function resource(state, resourceType, id) {
  if (!state) return null;

  return fromData.resource(state.data, resourceType, id);
}

export function resourceList(state, options) {
  return fromData.resourceList(state.data, options);
}

export function integrationConnectionList(state, integrationId) {
  const integration = resource(state, 'integrations', integrationId);
  const connList = fromData.resourceList(state.data, { type: 'connections' });

  if (integrationId && integrationId !== 'none' && integration) {
    const registeredConnections =
      integration && integration._registeredConnectionIds;

    if (registeredConnections) {
      connList.resources =
        connList &&
        connList.resources &&
        connList.resources.filter(
          conn => registeredConnections.indexOf(conn._id) >= 0
        );
    }
  }

  return connList;
}

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

export function integrationAppSettings(state, id, storeId) {
  if (!state) return null;
  const integrationResource = fromData.integrationAppSettings(state.data, id);
  const uninstallSteps = fromSession.uninstallSteps(
    state.resource,
    id,
    storeId
  );

  return { ...integrationResource, ...uninstallSteps };
}

export function defaultStoreId(state, id) {
  return fromData.defaultStoreId(state && state.data, id);
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
    if (draft.find(s => !s.completed)) {
      draft.find(s => !s.completed).isCurrentStep = true;
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
    if (draft.find(s => !s.completed)) {
      draft.find(s => !s.completed).isCurrentStep = true;
    }
  });
}

// #endregion

// #region PUBLIC ACCOUNTS SELECTORS
export function integratorLicense(state) {
  const preferences = userPreferences(state);

  return fromUser.integratorLicense(state.user, preferences.defaultAShareId);
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
    sandbox: preferences.environment === 'sandbox',
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
      tile.connector = { owner: connector.user.company || connector.user.name };
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
  const preferences = userPreferences(state);
  const tiles = resourceList(state, {
    type: 'tiles',
    sandbox: preferences.environment === 'sandbox',
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
        connector: { owner: connector.user.company || connector.user.name },
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

  const master = resource(state, resourceType, id);
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

export function optionsFromMetadata(
  state,
  connectionId,
  applicationType,
  metadataType,
  mode,
  recordType,
  selectField
) {
  return fromSession.optionsFromMetadata(
    state && state.session,
    connectionId,
    applicationType,
    metadataType,
    mode,
    recordType,
    selectField
  );
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

export function commMetadataPathGen(
  applicationType,
  connectionId,
  metadataType,
  mode,
  recordType,
  selectField,
  addInfo
) {
  let commMetadataPath;

  if (applicationType === 'netsuite') {
    if (mode === 'webservices' && metadataType !== 'recordTypes') {
      commMetadataPath = `netSuiteWS/${metadataType}`;
    } else {
      commMetadataPath = `${applicationType}/metadata/${mode}/connections/${connectionId}/${metadataType}`;

      if (selectField && recordType) {
        commMetadataPath += `/${recordType}/selectFieldValues/${selectField}`;
      }
    }
  } else if (applicationType === 'salesforce') {
    commMetadataPath = `${applicationType}/metadata/connections/${connectionId}/${metadataType}`;

    if (recordType) {
      commMetadataPath += `/${recordType}`;
    }
  } else {
    throw Error('Invalid application type...cannot support it');
  }

  if (addInfo) {
    if (addInfo.refreshCache === true) {
      commMetadataPath += '?refreshCache=true';
    }

    if (addInfo.recordTypeOnly === true) {
      commMetadataPath += `${
        addInfo.refreshCache === true ? '&' : '?'
      }recordTypeOnly=true`;
    }
  }

  return commMetadataPath;
}

export function metadataOptionsAndResources(
  state,
  connectionId,
  mode,
  metadataType,
  filterKey,
  recordType,
  selectField
) {
  const connection = resource(state, 'connections', connectionId);
  // determining application type from the connection
  const applicationType = connection.type;
  const key = filterKey ? `${metadataType}-${filterKey}` : metadataType;

  return (
    optionsFromMetadata(
      state,
      connectionId,
      applicationType,
      key,
      mode,
      recordType,
      selectField
    ) || {}
  );
}

export function isValidatingNetsuiteUserRoles(state) {
  const commPath = commKeyGen('/netsuite/alluserroles', 'POST');

  return fromComms.isLoading(state.comms, commPath);
}

export function createdResourceId(state, tempId) {
  return fromSession.createdResourceId(state && state.session, tempId);
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

export function accessTokenList(state, integrationId) {
  return fromData.accessTokenList(state.data, integrationId);
}

export function accessToken(state, id) {
  return fromData.accessToken(state.data, id);
}

export function flowJobsPagingDetails(state) {
  return fromData.flowJobsPagingDetails(state.data);
}

export function flowJobs(state) {
  const jobs = fromData.flowJobs(state.data);
  const preferences = userPreferences(state);
  const resourceMap = resourceDetailsMap(state);

  return jobs.map(job => {
    if (job.children && job.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      job.children = job.children.map(cJob => {
        const additionalChildProps = {
          endedAtAsString:
            cJob.endedAt &&
            moment(cJob.endedAt).format(
              `${preferences.dateFormat} ${preferences.timeFormat}`
            ),
          name: cJob._exportId
            ? resourceMap.exports[cJob._exportId].name
            : resourceMap.imports[cJob._importId].name,
        };

        return { ...cJob, ...additionalChildProps };
      });
    }

    const additionalProps = {
      endedAtAsString:
        job.endedAt &&
        moment(job.endedAt).format(
          `${preferences.dateFormat} ${preferences.timeFormat}`
        ),
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

  return jErrors.map(je => ({
    ...je,
    createdAtAsString:
      je.createdAt &&
      moment(je.createdAt).format(
        `${preferences.dateFormat} ${preferences.timeFormat}`
      ),
  }));
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

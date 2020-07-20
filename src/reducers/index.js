import deepClone from 'lodash/cloneDeep';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import jsonPatch from 'fast-json-patch';
import moment from 'moment';
import produce from 'immer';
import { some, map, isEmpty } from 'lodash';
import app, * as fromApp from './app';
import data, * as fromData from './data';
import * as fromResources from './data/resources';
import * as fromMarketPlace from './data/marketPlace';
import session, * as fromSession from './session';
import * as fromMetadata from './session/metadata';
import comms, * as fromComms from './comms';
import * as fromNetworkComms from './comms/networkComms';
import auth, * as fromAuth from './authentication';
import user, * as fromUser from './user';
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
  getFlowReferencesForResource,
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
} from '../utils/constants';
import { LICENSE_EXPIRED } from '../utils/messageStore';
import { changePasswordParams, changeEmailParams } from '../sagas/api/apiPaths';
import { getFieldById } from '../forms/utils';
import { upgradeButtonText, expiresInfo } from '../utils/license';
import commKeyGen from '../utils/commKeyGenerator';
import {
  isNewId,
  MODEL_PLURAL_TO_LABEL,
  isRealTimeOrDistributedResource,
  isFileAdaptor,
  isAS2Resource,
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

export function recycleBinState(state) {
  return fromSession.recycleBinState(state && state.session);
}

export function marketPlaceState(state) {
  return fromData.marketPlaceState(state && state.data);
}

export function resourcesState(state) {
  return fromData.resourceState(state && state.data);
}

export function networkCommState(state) {
  return fromComms.networkCommState(state && state.comms);
}

export function userState(state) {
  return state && state.user;
}
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

export function reloadCount(state) {
  return fromApp.reloadCount((state && state.app) || null);
}

export function isUiVersionDifferent(state) {
  return fromApp.isUiVersionDifferent(state?.app);
}
export function appErrored(state) {
  return fromApp.appErrored(state && state.app);
}
// #endregion app selectors

// #region PUBLIC COMMS SELECTORS
// Use shallowEquality operator to prevent re-renders.
// or convert this to re-select since it has no args, it s perfect
// case for re-select.
export function commsErrors(state) {
  const commsState = state?.comms?.networkComms;

  if (!commsState) return;
  // console.log(commsState);
  let errors;

  Object.keys(commsState).forEach(key => {
    const c = commsState[key];
    if (!c.hidden && c.status === fromNetworkComms.COMM_STATES.ERROR) {
      if (!errors) errors = {};
      errors[key] = inferErrorMessage(c.message);
    }
  });

  return errors;
}

export function commsSummary(state) {
  let isLoading = false;
  let isRetrying = false;
  let hasError = false;
  const commsState = state?.comms?.networkComms;

  if (commsState) {
    Object.keys(commsState).forEach(key => {
      const c = commsState[key];
      if (!c.isHidden) {
        if (c.status === fromNetworkComms.COMM_STATES.ERROR) {
          hasError = true;
        } else if (c.retryCount > 0) {
          isRetrying = true;
        } else if (c.status === fromNetworkComms.COMM_STATES.LOADING && Date.now() - c.timestamp > Number(process.env.NETWORK_THRESHOLD)) {
          isLoading = true;
        }
      }
    });
  }

  return { isLoading, isRetrying, hasError };
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

export function getLicenseEntitlementUsage(state) {
  return fromSession.getLicenseEntitlementUsage(state && state.session);
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

export function getChildIntegrationId(state, parentId) {
  return fromSession.getChildIntegrationId(state && state.session, parentId);
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
        flowDetails = resource(state, 'flows', flow._id);

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

export function isEditorDirty(state, id) {
  return fromSession.isEditorDirty(state && state.session, id);
}

export function editorPatchSet(state, id) {
  return fromSession.editorPatchSet(state && state.session, id);
}

export function editorPatchStatus(state, id) {
  return fromSession.editorPatchStatus(state && state.session, id);
}

export function getEditorSampleData(state, { flowId, resourceId, fieldType }) {
  return fromSession.getEditorSampleData(state && state.session, {
    flowId,
    resourceId,
    fieldType,
  });
}

export function mapping(state, id) {
  return fromSession.mapping(state && state.session, id);
}

export function mappingsChanged(state, id) {
  return fromSession.mappingsChanged(state && state.session, id);
}

export function mappingsSaveStatus(state, id) {
  return fromSession.mappingsSaveStatus(state && state.session, id);
}

export function responseMappings(state, id) {
  return fromSession.responseMappings(state && state.session, id);
}

export function responseMappingDirty(state, id) {
  return fromSession.responseMappingDirty(state && state.session, id);
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

export function flowMetricsData(state, flowId, measurement) {
  return fromSession.flowMetricsData(
    state && state.session,
    flowId,
    measurement
  );
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

export function isUserInErrMgtTwoDotZero(state) {
  return fromUser.isUserInErrMgtTwoDotZero(state && state.user);
}

export const userProfile = createSelector(
  state => state?.user?.profile,
  profile => profile
);


export function developerMode(state) {
  return (
    state && state.user && state.user.profile && state.user.profile.developer
  );
}

export function userPreferences(state) {
  return fromUser.userPreferences(state && state.user);
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

// TODO: make this selector a lot more granular...its dependency is user
export const userProfilePreferencesProps = createSelector(
  userProfile,
  userPreferences,
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
  }
);

export function userProfileEmail(state) {
  return state && state.user && state.user.profile && state.user.profile.email;
}

export function userProfileLinkedWithGoogle(state) {
  return !!(
    state &&
    state.user &&
    state.user.profile &&
    state.user.profile.auth_type_google &&
    state.user.profile.auth_type_google.id
  );
}
// #endregiod

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
    state.auth.commStatus === fromNetworkComms.COMM_STATES.LOADING
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
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === fromNetworkComms.COMM_STATES.SUCCESS;
}

export function changePasswordFailure(state) {
  const commKey = commKeyGen(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === fromNetworkComms.COMM_STATES.ERROR;
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

  return status === fromNetworkComms.COMM_STATES.ERROR;
}

export function changeEmailSuccess(state) {
  const commKey = commKeyGen(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = fromComms.commStatus(state && state.comms, commKey);

  return status === fromNetworkComms.COMM_STATES.SUCCESS;
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
export function debugOn(state) {
  return fromUser.debugOn(state && state.user);
}

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

export function editorTheme(state) {
  return fromUser.editorTheme((state && state.user) || null);
}

export function hasPreferences(state) {
  return !!userPreferences(state);
}

export function drawerOpened(state) {
  return fromUser.drawerOpened((state && state.user) || null);
}

export function expandSelected(state) {
  return fromUser.expandSelected((state && state.user) || null);
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
    const preferences = userPreferences(state);

    // eslint-disable-next-line no-param-reassign
    options.sandbox = preferences.environment === 'sandbox';
  }

  return fromData.resourceList(state && state.data, options);
}

export function resourceListModified(userState, resourcesState, options = {}) {
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
}

export function hasSettingsForm(state, resourceType, resourceId) {
  return fromData.hasSettingsForm(
    state && state.data,
    resourceType,
    resourceId
  );
}

export const makeResourceListSelector = () =>
  createSelector(
    userState,
    resourcesState,
    (_, options) => options,
    (userState, resourcesState, options) =>
      resourceListModified(userState, resourcesState, options)
  );

export function iaFlowSettings(state, integrationId, flowId) {
  const integration = resource(state, 'integrations', integrationId);

  return getIAFlowSettings(integration, flowId);
}

// TODO: The object returned from this selector needs to be overhauled.
// It is shared between IA and DIY flows,
// yet its impossible to know which works for each flow type. For example,
// showMapping is an IA only field, how do we determine if a DIY flow has mapping support?
// Maybe its best to only hav common props here and remove all IA props to a separate selector.
export function flowDetails(state, id) {
  const flow = resource(state, 'flows', id);

  if (!flow) return emptyObject;
  const integration = resource(state, 'integrations', flow._integrationId);
  const exports = resourceList(state, {
    type: 'exports',
  }).resources;

  return getFlowDetails(flow, integration, exports);
}

/* ***********************************************************************
  This is the beginning of refactoring the above selector. There is just WAY to
  much data returned above and in most cased a component only needs a small slice
  of the above. */
export function isDataLoader(state, flowId) {
  const flow = resource(state, 'flows', flowId);

  if (!flow) return false;

  // TODO: review with team... is this an ok pattern to access
  // state directly? seems ok.
  const exports = state && state.data && state.data.resources.exports;

  if (!exports) return false;

  return isSimpleImportFlow(flow, exports);
}

export function flowType(state, flowId) {
  const flow = resource(state, 'flows', flowId);

  if (!flow) return '';

  const exports = state && state.data && state.data.resources.exports;

  if (!exports) return '';

  if (isSimpleImportFlow(flow, exports)) {
    return 'Data loader';
  }

  if (isRealtimeFlow(flow, exports)) {
    return 'Realtime';
  }

  // TODO: further refine this logic to differentiate between 'Scheduled'
  // and 'mixed'. Note that mixed is the case where some exports are scheduled
  // and others are not.
  return 'Scheduled';
}

export function isFlowEnableLocked(state, flowId) {
  const flow = resource(state, 'flows', flowId);

  if (!flow || !flow._connectorId) return false;

  const integration = resource(state, 'integrations', flow._integrationId);

  if (!integration) return false;

  const flowSettings = getIAFlowSettings(integration, flow._id);

  // strange flow setting name to indicate that flows can not be
  // enabled/disabled by a user...
  return flowSettings.disableSlider;
}

// Possible refactor! If we need both canSchedule (flow has ability to schedule),
// and if the IA allows for schedule overrides, then we can return a touple...
// for the current purpose, we just need to know if a flow allows or doesn't allow
// schedule editing.
export function flowAllowsScheduling(state, id) {
  const flow = resource(state, 'flows', id);

  if (!flow) return false;
  const integration = resource(state, 'integrations', flow._integrationId);
  const isApp = flow._connectorId;
  const allExports = state && state.data && state.data.resources.exports;
  const canSchedule = showScheduleIcon(flow, allExports);

  if (!isApp) return canSchedule;

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return canSchedule && !!flowSettings.showSchedule;
}

export function flowUsesUtilityMapping(state, id) {
  const flow = resource(state, 'flows', id);

  if (!flow) return false;
  const integration = resource(state, 'integrations', flow._integrationId);
  const isApp = flow._connectorId;
  if (!isApp) return false;

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!flowSettings.showUtilityMapping;
}

export function flowSupportsMapping(state, id) {
  const flow = resource(state, 'flows', id);

  if (!flow) return false;

  const isApp = flow._connectorId;

  if (!isApp) return true;

  const integration = resource(state, 'integrations', flow._integrationId);

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!flowSettings.showMapping;
}

export function flowSupportsSettings(state, id) {
  const flow = resource(state, 'flows', id);

  if (!flow) return false;

  const isApp = flow._connectorId;

  if (!isApp) return false;

  const integration = resource(state, 'integrations', flow._integrationId);

  const flowSettings = getIAFlowSettings(integration, flow._id);

  return !!(
    (flowSettings.settings && flowSettings.settings.length) ||
    (flowSettings.sections && flowSettings.sections.length)
  );
}

/* End of refactoring of flowDetails selector.. Once all use is refactored of
   the flowDetails, we should delete that selector.
*********************************************************************** */

export function flowListWithMetadata(state, options) {
  const flows = resourceList(state, options).resources || emptySet;
  const exports = resourceList(state, {
    type: 'exports',
  }).resources;

  return getFlowListWithMetadata(flows, exports);
}

/*
 * Gives all other valid flows of same Integration
 */
export function nextDataFlowsForFlow(state, flow) {
  const flows = flowListWithMetadata(state, { type: 'flows' }).resources || [];

  return getNextDataFlows(flows, flow);
}

export function isIAConnectionSetupPending(state, connectionId) {
  const connection = resource(state, 'connections', connectionId) || {};

  if (!connection || !connection._connectorId) {
    return;
  }

  const { _integrationId } = connection;
  const integration = resource(state, 'integrations', _integrationId);

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
}

export function isConnectionOffline(state, id) {
  const connection = resource(state, 'connections', id);

  return connection && connection.offline;
}

// TODO: could this be converted to re-select?
export function resourcesByIds(state, resourceType, resourceIds) {
  const { resources } = resourceList(state, {
    type: resourceType,
  });

  return resources.filter(r => resourceIds.indexOf(r._id) >= 0);
}

export function userPermissions(state) {
  return fromUser.permissions(state.user);
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
}
export function matchingConnectionList(state, connection = {}, environment, manageOnly) {
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
          const accessLevel = manageOnly ? userAccessLevelOnConnection(state, this._id) : 'owner';
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
  environment,
  manageOnly
) {
  return resourceType === 'connections'
    ? matchingConnectionList(state, resource, environment, manageOnly)
    : matchingStackList(state);
}

export function integrationAppList(state) {
  return fromData.integrationAppList(state && state.data);
}

export function marketplaceConnectors(
  userState,
  marketPlaceState,
  resourceState,
  application,
  sandbox
) {
  const licenses = fromUser.licenses(userState);
  const connectors = fromMarketPlace.connectors(
    marketPlaceState,
    application,
    sandbox,
    licenses
  );

  return connectors
    .map(c => {
      const installedIntegrationApps = resourceListModified(
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
}

export const makeMarketPlaceConnectorsSelector = () =>
  createSelector(
    userState,
    marketPlaceState,
    resourcesState,
    (_, application) => application,
    (_1, _2, sandbox) => sandbox,
    (userState, marketPlaceState, resourceState, application, sandbox) =>
      marketplaceConnectors(
        userState,
        marketPlaceState,
        resourceState,
        application,
        sandbox
      )
  );

export function marketplaceTemplates(state, application) {
  return fromData.marketplaceTemplates(state.data, application);
}

export function getAllConnectionIdsUsedInTheFlow(state, flow, options = {}) {
  const exportIds = getExportIdsFromFlow(flow);
  const importIds = getImportIdsFromFlow(flow);
  const connectionIds = [];
  const connections = resourceList(state, { type: 'connections' }).resources;
  const exports = resourceList(state, { type: 'exports' }).resources;
  const imports = resourceList(state, { type: 'imports' }).resources;

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

export function queuedJobs(state, connectionId) {
  return fromSession.queuedJobs(state && state.session, connectionId);
}

export function iClients(state, connectionId) {
  return fromSession.iClients(state && state.session, connectionId);
}

export function integrationAppAddOnState(state, integrationId) {
  return fromSession.integrationAppAddOnState(
    state && state.session,
    integrationId
  );
}

export function integrationAppMappingMetadata(state, integrationId) {
  return fromSession.integrationAppMappingMetadata(
    state && state.session,
    integrationId
  );
}

export function isAddOnInstallInProgress(state, id) {
  return fromSession.isAddOnInstallInProgress(state && state.session, id);
}

export function checkUpgradeRequested(state, licenseId) {
  return fromSession.checkUpgradeRequested(state && state.session, licenseId);
}

export function isOnOffInProgress(state, flowId) {
  return fromSession.isOnOffInProgress(state && state.session, flowId);
}
export function canOpenOauthConnection(state, integrationId) {
  return fromSession.canOpenOauthConnection(state && state.session, integrationId);
}


export function integrationConnectionList(state, integrationId, childId, tableConfig) {
  const integration = resource(state, 'integrations', integrationId) || {};
  // eslint-disable-next-line no-use-before-define
  const childIntegrations = map(integrationChildren(state, integrationId), 'value');
  let { resources = [] } = resourceList(state, {
    type: 'connections',
    ...(tableConfig || {}),
  });

  if (integrationId && integrationId !== 'none' && !integration._connectorId) {
    let registeredConnections = [];
    if (!childId) {
      childIntegrations.forEach(intId => {
        const integration = resource(state, 'integrations', intId);
        if (integration) {
          registeredConnections = registeredConnections.concat(integration._registeredConnectionIds);
        }
      });
    } else {
      const parentIntegration = resource(state, 'integrations', integrationId);
      const childIntegration = resource(state, 'integrations', childId);
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
}

export function integrationAppV2FlowList(state, integrationId, childId) {
  if (!state) return null;

  return resourceList(state, {
    type: 'flows',
    filter: { _integrationId: childId },
  }).resources;
}

export function integrationAppV2ConnectionList(state, integrationId, childId) {
  if (!state) return null;
  const isParent = integrationId === childId;
  let integrations;

  if (isParent) {
    const childIntegrations = resourceList(state, {
      type: 'integrations',
      filter: { _parentId: integrationId },
    }).resources;

    integrations = [integrationId, ...map(childIntegrations, '_id')];
  } else {
    integrations = [integrationId, childId];
  }

  const connections = resourceList(state, {
    type: 'connections',
    filter: {
      $where() {
        return integrations.includes(this._integrationId);
      },
    },
  }).resources;

  return connections;
}

export function integrationAppResourceList(
  state,
  integrationId,
  storeId,
  tableConfig
) {
  if (!state) return { connections: emptySet, flows: emptySet };

  const integrationResource =
    fromData.integrationAppSettings(state.data, integrationId) || {};
  const { supportsMultiStore, sections } = integrationResource.settings || {};
  const { resources: integrationConnections } = resourceList(state, {
    type: 'connections',
    filter: { _integrationId: integrationId },
    ...(tableConfig || {}),
  });

  if (!supportsMultiStore || !storeId) {
    return {
      connections: integrationConnections,
      flows: resourceList(state, {
        type: 'flows',
        filter: { _integrationId: integrationId },
      }).resources,
    };
  }

  const flows = [];
  const flowIds = [];
  const connections = [];
  const exports = [];
  const imports = [];
  const selectedStore = (sections || []).find(s => s.id === storeId) || {};

  (selectedStore.sections || []).forEach(sec => {
    flowIds.push(...map(sec.flows, '_id'));
  });

  flowIds.forEach(fid => {
    const flow = resource(state, 'flows', fid) || {};
    flows.push({_id: flow._id, name: flow.name});
    connections.push(...getAllConnectionIdsUsedInTheFlow(state, flow));
    exports.push(...getExportIdsFromFlow(state, flow));
    imports.push(...getImportIdsFromFlow(state, flow));
  });

  return {
    connections: integrationConnections.filter(c =>
      connections.includes(c._id)
    ),
    flows,
    exports,
    imports,
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

export function integrationAppConnectionList(
  state,
  integrationId,
  storeId,
  tableConfig
) {
  return integrationAppResourceList(state, integrationId, storeId, tableConfig)
    .connections;
}

export function categoryMappingsForSection(state, integrationId, flowId, id) {
  return fromSession.categoryMappingsForSection(
    state && state.session,
    integrationId,
    flowId,
    id
  );
}

export function categoryMappingsCollapsedStatus(state, integrationId, flowId) {
  return fromSession.categoryMappingsCollapsedStatus(
    state && state.session,
    integrationId,
    flowId
  );
}

export function categoryMappingsChanged(state, integrationId, flowId) {
  return fromSession.categoryMappingsChanged(
    state && state.session,
    integrationId,
    flowId
  );
}

export function categoryMappingSaveStatus(state, integrationId, flowId) {
  return fromSession.categoryMappingSaveStatus(
    state && state.session,
    integrationId,
    flowId
  );
}

export function pendingCategoryMappings(state, integrationId, flowId) {
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

export function categoryRelationshipData(state, integrationId, flowId) {
  return fromData.categoryRelationshipData(
    state && state.data,
    integrationId,
    flowId
  );
}

export function mappingsForVariation(state, integrationId, flowId, filters) {
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
}

export function mappingsForCategory(state, integrationId, flowId, filters) {
  const { sectionId } = filters;
  let mappings = emptySet;
  const { attributes = {}, mappingFilter = 'all' } =
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
}

export function integrationChildren(state, integrationId) {
  if (!state) return null;
  const children = [];
  const integration = resource(state, 'integrations', integrationId) || {};
  const childIntegrations = resourceList(state, {
    type: 'integrations',
    filter: { _parentId: integrationId },
  }).resources;

  children.push({ value: integrationId, label: integration.name });
  childIntegrations.forEach(ci => {
    children.push({ value: ci._id, label: ci.name, mode: ci.mode });
  });

  return children;
}

export function integrationAppSettings(state, id) {
  if (!state) return null;

  return fromData.integrationAppSettings(state.data, id);
}

export function suiteScriptIASettings(state, id, ssLinkedConnectionId) {
  return fromData.suiteScriptIASettings(state && state.data, id, ssLinkedConnectionId);
}
export function integrationAppLicense(state, id) {
  if (!state) return emptyObject;
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
    titleId: getTitleIdFromSection(sec),
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
  }
  if (Array.isArray(general)) {
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
    return emptyObject;
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
        getTitleIdFromSection(sec) === section
    ) || {};

  return selectedSection;
}


export function suiteScriptIASectionMetadata(
  state,
  integrationId,
  ssLinkedConnectionId,
  section,
) {
  if (!state) {
    return emptyObject;
  }

  const integrationResource = suiteScriptIASettings(
    state,
    integrationId,
    ssLinkedConnectionId
  );
  const {sections = [] } =
    integrationResource || {};
  const allSections = sections;


  const selectedSection =
    allSections.find(
      sec =>
        getTitleIdFromSection(sec) === section
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
        getTitleIdFromSection(sec) === section
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
    f =>
      !!((f.settings && f.settings.length) || (f.sections && f.sections.length))
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

  const visibleSteps = integrationInstallSteps.filter(s => s.type !== 'hidden');

  return visibleSteps.map(step => {
    if (step.isCurrentStep) {
      return { ...step, ...installStatus };
    }

    return step;
  });
}

const emptyStepsArr = [];
export function integrationUninstallSteps(state, { integrationId, isFrameWork2 }) {
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

  const modifiedSteps = produce(steps, (draft) => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });

  return { steps: modifiedSteps };
}

export function isIAV2UninstallComplete(state, { integrationId }) {
  const integration = fromData.integrationAppSettings(state.data, integrationId);
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
}

// FIXME: @ashu, we can refactor this later and completely remove
// the clone check once the functionality is clear and tested for all scenarios
export function isIntegrationAppVersion2(state, integrationId, skipCloneCheck) {
  const integration = resource(state, 'integrations', integrationId);
  if (!integration) return false;
  let isCloned = false;

  if (!skipCloneCheck) {
    isCloned =
    integration.install &&
    integration.install.find(step => step.isClone);
  }
  const isFrameWork2 =
    (
      integration.installSteps &&
      integration.installSteps.length) || (
      integration.uninstallSteps &&
        integration.uninstallSteps.length) ||
    isCloned;
  return isFrameWork2;
}

export function integrationAppChildIdOfFlow(state, integrationId, flowId) {
  if (!state || !integrationId) {
    return null;
  }
  const integration = fromData.resource(state.data, 'integrations', integrationId);
  if (integration?.settings?.supportsMultiStore) {
    const { stores } = integrationAppSettings(state, integrationId);
    if (!flowId && stores?.length) {
      return stores[0].value;
    }
    return stores.find(store => integrationAppFlowIds(state, integrationId, store?.value)?.includes(flowId))?.value;
  }
  if (isIntegrationAppVersion2(state, integrationId, true)) {
    if (!flowId) return integrationId;
    return fromData.resource(state.data, 'flows', flowId)?._integrationId;
  }
  return null;
}

// #end integrationApps Region

export function resourceReferences(state) {
  return fromSession.resourceReferences(state && state.session);
}

export function resourceDetailsMap(state) {
  return fromData.resourceDetailsMap(state.data);
}

export function exportNeedsRouting(state, id) {
  return fromData.exportNeedsRouting(state && state.data, id);
}

export function connectionHasAs2Routing(state, id) {
  return fromData.connectionHasAs2Routing(state && state.data, id);
}
// #endregion

// #region PUBLIC ACCOUNTS SELECTORS
export function platformLicense(state) {
  const preferences = userPreferences(state);

  return fromUser.platformLicense(state.user, preferences.defaultAShareId);
}

export function platformLicenseActionDetails(state) {
  let licenseActionDetails = {};
  const license = platformLicense(state);

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
export function platformLicenseWithMetadata(state) {
  const license = platformLicense(state);
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
}
export function isLicenseValidToEnableFlow(state) {
  const licenseDetails = { enable: true };
  const license = platformLicenseWithMetadata(state);

  if (!license) {
    return licenseDetails;
  }

  if (license.hasExpired) {
    licenseDetails.enable = false;
    licenseDetails.message = LICENSE_EXPIRED;
  }

  return licenseDetails;
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

export function userPermissionsOnConnection(state, connectionId) {
  const permissions = userPermissions(state);

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
    const connection = resource(state, 'connections', connectionId);

    return (
      (connection && connection._connectorId
        ? permissions.integrations.connectors
        : permissions.integrations.all) || {}
    ).connections;
  }
  if (USER_ACCESS_LEVELS.TILE === permissions.accessLevel) {
    const ioIntegrations = resourceList(state, {
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
}

export const resourcePermissions = (
  state,
  resourceType,
  resourceId,
  childResourceType
) => {
  //  when resourceType == connection and resourceID = connectionId, we fetch connection
  //  permission by checking for highest order connection permission under integrations
  if (resourceType === 'connections' && resourceId) {
    return userPermissionsOnConnection(state, resourceId) || emptyObject;
  }

  const permissions = userPermissions(state);

  if (!permissions) return emptyObject;

  // special case, where resourceType == integrations. Its childResource,
  // ie. connections, flows can be retrieved by passing childResourceType
  if (resourceType === 'integrations' && (childResourceType || resourceId)) {
    const resourceData =
      resourceId && resource(state, 'integrations', resourceId);

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

export function isFormAMonitorLevelAccess(state, integrationId) {
  const { accessLevel } = resourcePermissions(state);

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

export function formAccessLevel(state, integrationId, resource, disabled) {
  // if all forms is monitor level

  const isMonitorLevelAccess = isFormAMonitorLevelAccess(state, integrationId);

  if (isMonitorLevelAccess) return { disableAllFields: true };

  // check integration access level
  const { accessLevel: accessLevelIntegration } = resourcePermissions(
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
}

// TODO: @Ashu, we need to add tests for this once GA is done.  I extracted this
// logic from the DynaSettings component since it needed to be used in multiple
// places. Also, the logic below, now in one place could surely be cleaned up and made more
// readable...I left as-is to minimize risk of regressions.
export function canEditSettingsForm(state, resourceType, resourceId, integrationId) {
  const r = resource(state, resourceType, resourceId);
  const isIAResource = !!(r && r._connectorId);
  const {allowedToPublish, developer} = userProfile(state);
  const viewOnly = isFormAMonitorLevelAccess(state, integrationId);

  // if the resource belongs to an IA and the user cannot publish, then
  // a user can thus also not edit
  const visibleForUser = !isIAResource || allowedToPublish;
  return developer && !viewOnly && visibleForUser;
}

export function publishedConnectors(state) {
  const ioConnectors = resourceList(state, {
    type: 'published',
  }).resources;

  return ioConnectors.concat(SUITESCRIPT_CONNECTORS);
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

export function suiteScriptIntegrations(state, ssLinkedConnectionId) {
  return fromData.suiteScriptIntegrations(state.data, ssLinkedConnectionId);
}

export function suiteScriptTiles(state, ssLinkedConnectionId) {
  return fromData.suiteScriptTiles(state.data, ssLinkedConnectionId);
}

export function suiteScriptLinkedTiles(state) {
  const linkedConnections = suiteScriptLinkedConnections(state);
  let tiles = [];

  linkedConnections.forEach(connection => {
    tiles = tiles.concat(suiteScriptTiles(state, connection._id));
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
    integration = integrations.find((i) => i._id === t._integrationId) || {};

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
      connector = published.find((i) => i._id === t._connectorId) || {
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
}

export function resourceStatusModified(
  resourceState,
  networkCommState,
  origResourceType,
  resourceReqMethod = 'GET'
) {
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
}

export function allResourceStatus(
  resourceState,
  networkCommState,
  resourceTypes
) {
  return (typeof resourceTypes === 'string'
    ? resourceTypes.split(',')
    : resourceTypes
  ).map(resourceType =>
    resourceStatusModified(resourceState, networkCommState, resourceType.trim())
  );
}

export const makeAllResourceStatusSelector = () =>
  createSelector(
    resourcesState,
    networkCommState,
    (_, resourceTypes) => resourceTypes,
    (resourcesState, networkCommState, resourceTypes) =>
      allResourceStatus(resourcesState, networkCommState, resourceTypes)
  );

export function getAllResourceConflicts(state) {
  return fromSession.getAllResourceConflicts(state && state.session);
}

export function resourceDataModified(
  resourceIdState,
  stagedIdState,
  resourceType,
  id
) {
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
}

// fromResources.resourceIdState
// nothing but state && state.data && state.data.resources && state.data.resources.type
export const makeResourceDataSelector = () => {
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
      resourceDataModified(resourceIdState, stagedIdState, resourceType, id)
  );
};

// Please use makeResourceDataSelector in JSX as it is cached selector.
// For sagas we can use resourceData which points to cached selector.
export const resourceData = makeResourceDataSelector();

export function isEditorV2Supported(state, resourceId, resourceType) {
  const { merged: resource = {} } = resourceData(
    state,
    resourceType,
    resourceId
  );

  return [
    'HTTPImport',
    'HTTPExport',
    'RESTImport',
    'RESTExport',
    'FTPImport',
    'FTPExport',
    'AS2Import',
    'AS2Export',
    'S3Import',
    'S3Export',
  ].includes(resource.adaptorType);
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

export function auditLogs(
  state,
  resourceType,
  resourceId,
  filters,
  options = {}
) {
  let auditLogs = fromData.auditLogs(
    state.data,
    resourceType,
    resourceId,
    filters
  );

  const result = {
    logs: [],
    count: 0,
    totalCount: 0
  };

  if (options.storeId) {
    const {
      exports = [],
      imports = [],
      flows = [],
      connections = [],
    } = integrationAppResourceList(state, resourceId, options.storeId);
    const resourceIds = [
      ...exports,
      ...imports,
      ...flows,
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

export const makeOptionsFromMetadata = () => {
  const madeSelector = fromMetadata.makeOptionsFromMetadata();
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

export const preBuiltFileDefinitions = (state, format) =>
  fromData.preBuiltFileDefinitions(state && state.data, format);

export const fileDefinition = (state, definitionId, options) =>
  fromData.fileDefinition(state && state.data, definitionId, options);

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
    }) || emptyObject
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
    }) || emptyObject
  );
}

export function isValidatingNetsuiteUserRoles(state) {
  const commPath = commKeyGen('/netsuite/alluserroles', 'POST');

  return fromComms.isLoading(state.comms, commPath);
}

export function createdResourceId(state, tempId) {
  return fromSession.createdResourceId(state && state.session, tempId);
}

export function platformLicenseActionMessage(state) {
  return fromSession.platformLicenseActionMessage(state && state.session);
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

export const makeFlowJobs = () => createSelector(
  state => state?.data,
  (_1, options) => options,
  (data, options) => {
    const jobs = fromData.flowJobs(data, options);
    const resourceMap = fromData.resourceDetailsMap(data);

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
  });


export const makeFlowJob = () => {
  const cachedFlowJobsSelector = makeFlowJobs();
  return createSelector((state, ops) => cachedFlowJobsSelector(
    state, ops),
  (_1, ops) => ops,
  (jobList, ops) => jobList.find(j => j._id === ops?.jobId));
};

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

export function flowJobConnections(state, flowId) {
  const flow = resource(state, 'flows', flowId);
  const connections = [];
  const connectionIds = getAllConnectionIdsUsedInTheFlow(state, flow, {
    ignoreBorrowedConnections: true,
  });

  connectionIds.forEach(c => {
    const conn = resource(state, 'connections', c);

    connections.push({ id: conn._id, name: conn.name });
  });

  return connections;
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

// returns a list of import resources for a given flow,
// identified by flowId.
export function flowImports(state, id) {
  const flow = resource(state, 'flows', id);
  const imports = resourceList(state, { type: 'imports' }).resources;

  return getImportsFromFlow(flow, imports);
}

// TODO: The selector below should be deprecated and the above selector
// should be used instead.
export function getAllPageProcessorImports(state, pageProcessors) {
  const imports = resourceList(state, { type: 'imports' }).resources;

  return getPageProcessorImportsFromFlow(imports, pageProcessors);
}

export function integrationAppImportMetadata(state, importId) {
  return fromSession.integrationAppImportMetadata(
    state && state.session,
    importId
  );
}


export function getImportSampleData(state, resourceId, options = {}) {
  const { merged: resource } = resourceData(state, 'imports', resourceId);
  const { assistant, adaptorType, sampleData, _connectorId } = resource;
  const isIntegrationApp = !!_connectorId;

  if (assistant && assistant !== 'financialforce') {
    // get assistants sample data
    return assistantPreviewData(state, resourceId);
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

    const { data, status } = metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath,
      filterKey: 'suitescript-recordTypeDetail',
    });

    return { data, status };
  }
  if (adaptorType === 'SalesforceImport') {
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
  if (isIntegrationApp) {
    // handles incase of IAs
    return integrationAppImportMetadata(state, resourceId);
  }
  if (sampleData) {
    // Formats sample data into readable form
    return {
      data: processSampleData(sampleData, resource),
      status: 'received',
    };
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

export function flowConnections(state, flowId) {
  const flow = resource(state, 'flows', flowId);

  return flowConnectionList(state, flow);
}

export function flowReferencesForResource(state, resourceType, resourceId) {
  const flowsState = state && state.session && state.session.flowData;
  const exports = resourceList(state, {
    type: 'exports',
  }).resources;
  const imports = resourceList(state, {
    type: 'imports',
  }).resources;

  return getFlowReferencesForResource(
    flowsState,
    exports,
    imports,
    resourceType,
    resourceId
  );
}

/*
 * Given flowId, resourceId determines whether resource is a pg/pp
 */
export function isPageGenerator(state, flowId, resourceId, resourceType) {
  // If imports , straight forward not a pg
  if (resourceType === 'imports') return false;

  // Incase of new resource (export/lookup), flow doc does not have this resource yet
  // So, get staged resource and determine export/lookup based on isLookup flag
  const { merged: resource = {} } = resourceData(
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

export function getLastExportDateTime(state, flowId) {
  return fromSession.getLastExportDateTime(state && state.session, flowId);
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

export function isRestCsvMediaTypeExport(state, resourceId) {
  const { merged: resourceObj } = resourceData(state, 'exports', resourceId);
  const { adaptorType, _connectionId: connectionId } = resourceObj || {};

  // Returns false if it is not a rest export
  if (adaptorType !== 'RESTExport') {
    return false;
  }

  const connection = resource(state, 'connections', connectionId);

  // Check for media type 'csv' from connection object
  return connection && connection.rest && connection.rest.mediaType === 'csv';
}

export function isDataLoaderExport(state, resourceId, flowId) {
  if (isNewId(resourceId)) {
    if (!flowId) return false;
    const { merged: flowObj = {} } = resourceData(state, 'flows', flowId, 'value');
    return !!(flowObj.pageGenerators &&
              flowObj.pageGenerators[0] &&
              flowObj.pageGenerators[0].application === 'dataLoader');
  }
  const { merged: resourceObj = {} } = resourceData(
    state,
    'exports',
    resourceId,
    'value'
  );
  return resourceObj.type === 'simple';
}
/**
 * All the adaptors whose preview depends on connection
 * are disabled if their respective connections are offline
 * Any other criteria to disable preview panel can be added here
 */
export function isExportPreviewDisabled(state, resourceId, resourceType) {
  const { merged: resourceObj = {} } = resourceData(
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
    isRestCsvMediaTypeExport(state, resourceId)
  ) {
    return false;
  }
  // In all other cases, where preview depends on connection being online, return the same
  return isConnectionOffline(state, resourceObj._connectionId);
}

// Gives back supported stages of data flow based on resource type
export function getAvailableResourcePreviewStages(
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

  const isDataLoader = isDataLoaderExport(state, resourceId, flowId);
  const isRestCsvExport = isRestCsvMediaTypeExport(state, resourceId);

  return getAvailablePreviewStages(resourceObj, { isDataLoader, isRestCsvExport });
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
 * This Selector handles all Resource Type's Label in case of Stand alone / Flow Builder Context
 * Used at Resource Form's Title like 'Create/Edit Export' , at Bread Crumb level to show 'Add/Edit Export'
 */
export function getCustomResourceLabel(
  state,
  { resourceType, resourceId, flowId }
) {
  const isLookup = isLookUpExport(state, { flowId, resourceId, resourceType });
  const isDataloader = !!flowDetails(state, flowId).isSimpleImport;
  const isNewResource = isNewId(resourceId);
  const { merged: resource = {} } = resourceData(
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
  if (resourceType !== 'exports') return false;
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
  if (isDataLoaderExport(state, resourceId, flowId)) {
    return true;
  }
  // Preview panel is not shown for lookups
  if (
    resourceObj.isLookup ||
    isLookUpExport(state, { resourceId, flowId, resourceType })
  ) {
    return false;
  }

  return isPreviewPanelAvailable(resourceObj, resourceType, connectionObj);
}

// TODO @Raghu:  Revisit this selector once stabilized as it can be simplified
export const getSampleDataWrapper = createSelector(
  [
    // eslint-disable-next-line no-use-before-define
    (state, params) => getSampleDataContext(state, params),
    (state, params) => {
      if (['postMap', 'postSubmit'].includes(params.stage)) {
        return getSampleDataContext(state, { ...params, stage: 'preMap' });
      }

      return undefined;
    },
    (state, params) => {
      if (params.stage === 'postSubmit') {
        return getSampleDataContext(state, { ...params, stage: 'postMap' });
      }

      return undefined;
    },
    (state, { flowId }) => resource(state, 'flows', flowId) || emptyObject,
    (state, { flowId }) => {
      const flow = resource(state, 'flows', flowId) || emptyObject;

      return (
        resource(state, 'integrations', flow._integrationId) || emptyObject
      );
    },
    (state, { resourceId, resourceType }) =>
      resource(state, resourceType, resourceId) || emptyObject,
    (state, { resourceId, resourceType }) => {
      const res = resource(state, resourceType, resourceId) || emptyObject;

      return resource(state, 'connections', res._connectionId) || emptyObject;
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

      if (resource.type === 'delta') {
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

export function getUploadedFile(state, fileId) {
  return fromSession.getUploadedFile(state && state.session, fileId);
}

/*
 * The selector returns appropriate context for the JS Processor to run
 * For now, it supports contextType: hook
 * Other context types are 'settings' and 'setup'
 */
export const getScriptContext = createSelector(
  [
    (state, { contextType }) => contextType,
    (state, { flowId }) => {
      const flow = resource(state, 'flows', flowId) || emptyObject;

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
export function suiteScriptIAFlowSections(state, id, ssLinkedConnectionId) {
  const {sections = []} = suiteScriptIASettings(state, id, ssLinkedConnectionId);
  return sections.map(sec => ({
    ...sec,
    titleId: getTitleIdFromSection(sec),
    id: sec?.id?.charAt(0)?.toLowerCase() + sec?.id?.slice(1)
  }));
}

export function suiteScriptIASections(state, id, ssLinkedConnectionId) {
  const {sections = []} = suiteScriptIASettings(state, id, ssLinkedConnectionId);

  const {general } = suiteScriptIASettings(state, id, ssLinkedConnectionId);

  let selectedGeneral = general;
  if (Array.isArray(general)) {
    selectedGeneral = general.find(s => s.title === 'General');
  }

  return (selectedGeneral
    ? [{...selectedGeneral, id: 'genSettings', title: 'General'},
      ...sections] : sections).map(sec => ({
    ...sec,
    titleId: getTitleIdFromSection(sec),
    id: sec?.id?.charAt(0)?.toLowerCase() + sec?.id?.slice(1)
  }));
}

export function hasSuiteScriptData(
  state,
  {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
  }
) {
  return fromData.hasSuiteScriptData(state.data, {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
  });
}

export function suiteScriptResourceStatus(
  state,
  {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
    resourceReqMethod = 'GET',
  }
) {
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
}

export const suiteScriptResource = (
  state,
  { resourceType, id, ssLinkedConnectionId, integrationId }
) =>
  fromData.suiteScriptResource(state && state.data, {
    resourceType,
    id,
    ssLinkedConnectionId,
    integrationId,
  });

export function suiteScriptIAFeatureCheckState(
  state,
  { ssLinkedConnectionId, integrationId, featureName}
) {
  return fromSession.suiteScriptIAFeatureCheckState(state && state.session, { ssLinkedConnectionId, integrationId, featureName});
}
export const suiteScriptResourceData = (
  state,
  { resourceType, id, ssLinkedConnectionId, integrationId, scope }
) => {
  if (!state || !resourceType || !id || !ssLinkedConnectionId) {
    return emptyObject;
  }

  const master = suiteScriptResource(state, {
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


export const suiteScriptResourceList = (
  state,
  { resourceType, ssLinkedConnectionId, integrationId }
) =>
  fromData.suiteScriptResourceList(state && state.data, {
    resourceType,
    ssLinkedConnectionId,
    integrationId,
  });

export function suiteScriptFlowSettings(state, id, ssLinkedConnectionId, section) {
  if (!state) return emptyObject;

  const integrationResource =
    suiteScriptIASettings(state, id, ssLinkedConnectionId) || emptyObject;
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


  let flows = suiteScriptResourceList(state, {
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
}

export function suiteScriptFlowConnectionList(
  state,
  { ssLinkedConnectionId, flowId }
) {
  const flow = suiteScriptResource(state, {
    resourceType: 'flows',
    id: flowId,
    ssLinkedConnectionId,
  });
  const connections = suiteScriptResourceList(state, {
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
}

export function suiteScriptIntegrationConnectionList(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  const flows = suiteScriptResourceList(state, {
    resourceType: 'flows',
    ssLinkedConnectionId,
    integrationId,
  });
  const connections = suiteScriptResourceList(state, {
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
}

export function suiteScriptResourceFormState(
  state,
  { resourceType, resourceId, ssLinkedConnectionId, integrationId }
) {
  return fromSession.suiteScriptResourceFormState(state && state.session, {
    resourceType,
    resourceId,
    ssLinkedConnectionId,
    integrationId,
  });
}

export function suiteScriptTestConnectionCommState(
  state,
  resourceId,
  ssLinkedConnectionId
) {
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
}

export function suiteScriptResourceFormSaveProcessTerminated(
  state,
  { resourceType, resourceId, ssLinkedConnectionId, integrationId }
) {
  return fromSession.suiteScriptResourceFormSaveProcessTerminated(
    state && state.session,
    { resourceType, resourceId, ssLinkedConnectionId, integrationId }
  );
}

export function suiteScriptIAFormSaving(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  return fromSession.suiteScriptIAFormSaving(
    state && state.session,
    { ssLinkedConnectionId, integrationId }
  );
}


export function suiteScriptIAFormState(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  return fromSession.suiteScriptIAFormState(
    state && state.session,
    { ssLinkedConnectionId, integrationId }
  );
}
export function suiteScriptJobsPagingDetails(state) {
  return fromData.suiteScriptJobsPagingDetails(state.data);
}

export function suiteScriptJob(
  state,
  { ssLinkedConnectionId, integrationId, jobId, jobType }
) {
  const jobList = suiteScriptResourceList(state, {
    ssLinkedConnectionId,
    integrationId,
    resourceType: 'jobs',
  });

  return jobList.find(j => j._id === jobId && j.type === jobType);
}

export function suiteScriptJobErrors(state, { jobId, jobType }) {
  return fromData.suiteScriptJobErrors(state.data, { jobId, jobType });
}

// #endregion suiteScript

export function getJobErrorsPreview(state, jobId) {
  return fromSession.getJobErrorsPreview(state && state.session, jobId);
}

export function integrationAppClonedDetails(state, id) {
  return fromSession.integrationAppClonedDetails(state && state.session, id);
}

export function resourceErrors(state, { flowId, resourceId, options = {} }) {
  return fromSession.resourceErrors(state && state.session, {
    flowId,
    resourceId,
    options,
  });
}

// Given an errorId, gives back error doc
export function resourceError(state, { flowId, resourceId, options, errorId }) {
  const { errors = [] } = resourceErrors(state, {
    flowId,
    resourceId,
    options,
  });

  return errors.find(error => error.errorId === errorId);
}

export function selectedRetryIds(state, { flowId, resourceId, options = {} }) {
  const { errors } = resourceErrors(state, { flowId, resourceId, options });

  return errors
    .filter(({ selected, retryDataKey }) => selected && !!retryDataKey)
    .map(error => error.retryDataKey);
}

export function selectedErrorIds(state, { flowId, resourceId, options = {} }) {
  const { errors } = resourceErrors(state, { flowId, resourceId, options });

  return errors.filter(({ selected }) => selected).map(error => error.errorId);
}

export function isAllErrorsSelected(
  state,
  { flowId, resourceId, filterKey, defaultFilter, isResolved }
) {
  const errorFilter = filter(state, filterKey) || defaultFilter;
  const { errors = [] } = resourceErrors(state, {
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
}

export function errorMap(state, resourceId) {
  return fromSession.errorMap(state && state.session, resourceId);
}

export function errorActionsContext(
  state,
  { flowId, resourceId, actionType, errorType }
) {
  return fromSession.errorActionsContext(state && state.session, {
    flowId,
    resourceId,
    actionType,
    errorType,
  });
}

export function isAnyErrorActionInProgress(state, { flowId, resourceId }) {
  const isRetryInProgress =
    errorActionsContext(state, { flowId, resourceId, actionType: 'retry' })
      .status === 'requested';
  const isResolveInProgress =
    errorActionsContext(state, { flowId, resourceId, actionType: 'resolve' })
      .status === 'requested';

  return isRetryInProgress || isResolveInProgress;
}

export function customSettingsForm(state, resourceId) {
  return fromSession.customSettingsForm(state && state.session, resourceId);
}

export function flowResources(state, flowId) {
  const resources = [];
  const flow = fromData.resource(state && state.data, 'flows', flowId);

  resources.push({ _id: flowId, name: 'Flow-level' });

  if (flow._exportId) {
    const exportDoc = fromData.resource(
      state && state.data,
      'exports',
      flow._exportId
    );

    resources.push({ _id: flow._exportId, name: exportDoc.name });
  }

  if (flow._importId) {
    const importDoc = fromData.resource(
      state && state.data,
      'imports',
      flow._importId
    );

    resources.push({ _id: flow._exportId, name: importDoc.name });
  }

  if (flow.pageGenerators && flow.pageGenerators.length) {
    flow.pageGenerators.forEach(pg => {
      const exportDoc = fromData.resource(
        state && state.data,
        'exports',
        pg._exportId
      );

      resources.push({ _id: pg._exportId, name: exportDoc.name });
    });
  }

  if (flow.pageProcessors && flow.pageProcessors.length) {
    flow.pageProcessors.forEach(pp => {
      if (pp.type === 'import' && pp._importId) {
        const importDoc = fromData.resource(
          state && state.data,
          'imports',
          pp._importId
        );

        resources.push({ _id: pp._importId, name: importDoc.name });
      } else if (pp.type === 'export' && pp._exportId) {
        const exportDoc = fromData.resource(
          state && state.data,
          'exports',
          pp._exportId
        );

        resources.push({ _id: pp._exportId, name: exportDoc.name });
      }
    });
  }

  return resources;
}

export const redirectUrlToResourceListingPage = (
  state,
  resourceType,
  resourceId
) => {
  if (resourceType === 'integration') {
    return getRoutePath(`/integrations/${resourceId}/flows`);
  }

  if (resourceType === 'flow') {
    const flow = resource(state, 'flows', resourceId);

    if (flow) {
      return getRoutePath(
        `integrations/${flow._integrationId || 'none'}/flows`
      );
    }
  }

  return getRoutePath(RESOURCE_TYPE_SINGULAR_TO_PLURAL[resourceType]);
};

export const exportData = (state, identifier) =>
  fromSession.exportData(state && state.session, identifier);
export function httpAssistantSupportsMappingPreview(state, importId) {
  const importRes = resource(state, 'imports', importId);
  const { _integrationId, _connectionId, http } = importRes;

  if (_integrationId && http) {
    const connection = resource(state, 'connections', _connectionId);
    return (http.requestMediaType === 'xml' || connection?.http?.mediaType === 'xml');
  }

  return false;
}

export function mappingPreviewType(state, importId) {
  const importRes = resource(state, 'imports', importId);

  if (!importRes) return;
  const { adaptorType } = importRes;

  if (adaptorType === 'NetSuiteDistributedImport') {
    return 'netsuite';
  } if (adaptorType === 'SalesforceImport') {
    const masterRecordTypeInfo = getSalesforceMasterRecordTypeInfo(
      state,
      importId
    );

    if (masterRecordTypeInfo && masterRecordTypeInfo.data) {
      const { searchLayoutable } = masterRecordTypeInfo.data;

      if (searchLayoutable) {
        return 'salesforce';
      }
    }
  } else if (importRes.http) {
    const showHttpAssistant = httpAssistantSupportsMappingPreview(
      state,
      importId
    );

    if (showHttpAssistant) {
      return 'http';
    }
  }
}
export function retryDataContext(state, retryId) {
  return fromSession.retryDataContext(state && state.session, retryId);
}

export const rdbmsConnectionType = (state, connectionId) => {
  const connection = resource(state, 'connections', connectionId) || {};

  return connection.rdbms && connection.rdbms.type;
};

export function isSuiteScriptFlowOnOffInProgress(state, { ssLinkedConnectionId, _id }) {
  return fromSession.isSuiteScriptFlowOnOffInProgress(state && state.session, { ssLinkedConnectionId, _id });
}

export function netsuiteAccountHasSuiteScriptIntegrations(state, connectionId) {
  const connection = resource(state, 'connections', connectionId);

  if (!(connection && connection.netsuite && connection.netsuite.account)) {
    return false;
  }

  return fromSession.netsuiteAccountHasSuiteScriptIntegrations(
    state && state.session,
    connection.netsuite.account
  );
}

export function canLinkSuiteScriptIntegrator(state, connectionId) {
  const preferences = userPreferences(state);
  if (preferences && preferences.ssConnectionIds) {
    if (preferences.ssConnectionIds.includes(connectionId)) {
      return true;
    }

    const linkedAccounts = [];
    let connection = resource(state, 'connections', connectionId);
    if (!connection?.netsuite?.account || connection._connectorId) {
      return false;
    }
    const connectionAccount = connection.netsuite.account.toUpperCase();
    preferences.ssConnectionIds.forEach(connId => {
      connection = resource(state, 'connections', connId);
      if (connection && connection.netsuite && connection.netsuite.account) {
        linkedAccounts.push(connection.netsuite.account.toUpperCase());
      }
    });
    if (linkedAccounts.includes(connectionAccount)) {
      return false;
    }
  }

  return netsuiteAccountHasSuiteScriptIntegrations(state, connectionId);
}

export function suiteScriptIntegratorLinkedConnectionId(state, account) {
  const preferences = userPreferences(state);
  if (!preferences || !preferences.ssConnectionIds || !account) {
    return;
  }

  let linkedConnectionId;
  let connection;
  preferences.ssConnectionIds.forEach(connId => {
    connection = resource(state, 'connections', connId);
    if (
      connection?.netsuite?.account?.toUpperCase() === account.toUpperCase()
    ) {
      linkedConnectionId = connId;
    }
  });
  return linkedConnectionId;
}

const emptyArr = [];
export function suiteScriptIntegrationAppInstallerData(state, id) {
  if (!state) return null;
  const installer = fromSession.suiteScriptIntegrationAppInstallerData(state.session, id);
  const modifiedSteps = produce(installer.steps || emptyArr, (draft) => {
    const unCompletedStep = draft.find(s => !s.completed);

    if (unCompletedStep) {
      unCompletedStep.isCurrentStep = true;
    }
  });
  return {...installer, steps: modifiedSteps};
}

export function isSuiteScriptIntegrationAppInstallComplete(state, id) {
  if (!state) return null;
  let isInstallComplete = false;
  const installer = fromSession.suiteScriptIntegrationAppInstallerData(state.session, id);

  if (!installer || !installer.steps) return isInstallComplete;
  isInstallComplete =
    installer.steps.length &&
    !installer.steps.reduce((result, step) => result || !step.completed, false);

  return isInstallComplete;
}

export function userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId) {
  return !!resourcePermissions(state, 'connections', ssLinkedConnectionId)?.edit;
}
export function suiteScriptMappings(state) {
  return fromSession.suiteScriptMappings(state && state.session);
}
export function suitesciptMappingsChanged(state) {
  return fromSession.suitesciptMappingsChanged(state && state.session);
}
export function suiteScriptMappingsSaveStatus(state) {
  return fromSession.suiteScriptMappingsSaveStatus(state && state.session);
}


export function suiteScriptFlowDetail(state, {ssLinkedConnectionId, integrationId, flowId}) {
  const flows = suiteScriptResourceList(state, {
    resourceType: 'flows',
    integrationId,
    ssLinkedConnectionId,
  });
  return flows && flows.find(flow => flow._id === flowId);
}

export function suiteScriptNetsuiteMappingSubRecord(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}) {
  if (!subRecordMappingId) return emptyObject;
  const flow = suiteScriptFlowDetail(state, {
    integrationId,
    ssLinkedConnectionId,
    flowId
  });
  if (flow?.import?.netsuite?.subRecordImports?.length) {
    let selectedSubRecord = emptyObject;
    const iterateSubRecord = (subRecords) => {
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
}

export function suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId, options = {}}) {
  const flow = suiteScriptFlowDetail(state, {
    ssLinkedConnectionId,
    integrationId,
    flowId
  });
  if (!flow) { return emptyObject; }
  const { import: importConfig } = flow;
  const { type: importType, _connectionId } = importConfig;
  if (importType === 'netsuite') {
    const recordType = options.recordType || importConfig.netsuite?.recordType;
    const commMetaPath = `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;
    const { data, status } = metadataOptionsAndResources({
      state,
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
    const { data, status } = metadataOptionsAndResources({
      state,
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'suiteScriptSalesforce-sObjectCompositeMetadata',
    });

    return { data, status };
  }
  return fromSession.suiteScriptImportSampleDataContext(state && state.session, {ssLinkedConnectionId, integrationId, flowId});
}

export const suiteScriptGenerates = createSelector(
  [
    (state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId}) => {
      const options = {};
      if (subRecordMappingId) {
        const {recordType} = suiteScriptNetsuiteMappingSubRecord(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId});
        options.recordType = recordType;
      }
      return suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId, options});
    },
    (state, {ssLinkedConnectionId, integrationId, flowId}) => {
      const flow = suiteScriptFlowDetail(state, {
        integrationId,
        ssLinkedConnectionId,
        flowId
      });
      return flow?.import?.type;
    }

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


export function suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId}) {
  const flow = suiteScriptFlowDetail(state, {
    ssLinkedConnectionId,
    integrationId,
    flowId
  });
  if (!flow) { return emptyObject; }
  const { export: exportConfig } = flow;
  const { type: exportType, _connectionId } = exportConfig;
  if (exportConfig.netsuite && exportConfig.netsuite.type === 'realtime') {
    const {recordType} = exportConfig.netsuite.realtime;

    const commMetaPath = `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;

    const { data, status } = metadataOptionsAndResources({
      state,
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
    const { data, status } = metadataOptionsAndResources({
      state,
      connectionId: ssLinkedConnectionId,
      commMetaPath,
      filterKey: 'suiteScriptSalesforce-sObjectMetadata',
    });
    return { data, status };
  }
  return fromSession.suiteScriptFlowSampleDataContext(state && state.session, {ssLinkedConnectionId, integrationId, flowId});
}

export const suiteScriptExtracts = createSelector(
  [(state, {ssLinkedConnectionId, integrationId, flowId}) => suiteScriptFlowDetail(state, {ssLinkedConnectionId, integrationId, flowId}),
    (state, {ssLinkedConnectionId, integrationId, flowId}) => suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId})],
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
          name: extract.name || extract.label || extract.id
        });
        if (flow?.export?.netsuite?.type === 'restlet' && extract.type === 'select') {
          formattedFields.push({
            id: `${extract.id}.internalid`,
            name: `${extract.name} (InternalId)`
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

export function suiteScriptSalesforceMasterRecordTypeInfo(state, {ssLinkedConnectionId, integrationId, flowId}) {
  const flow = suiteScriptFlowDetail(state, {
    ssLinkedConnectionId,
    integrationId,
    flowId
  });
  if (!flow) { return emptyObject; }
  const { import: importConfig} = flow;

  const {type: importType, _connectionId, salesforce } = importConfig;

  if (importType !== 'salesforce') {
    return emptyObject;
  }
  const {sObjectType} = salesforce;

  const commMetaPath = `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`;
  return metadataOptionsAndResources({
    state,
    connectionId: ssLinkedConnectionId,
    commMetaPath,
    filterKey: 'salesforce-masterRecordTypeInfo',
  });
}

export function suiteScriptConnections(state, ssLinkedConnectionId) {
  return fromData.suiteScriptConnections(state && state.data, ssLinkedConnectionId);
}
/*
* Definition rules are fetched in 2 ways
* 1. In creation of an export, from FileDefinitions list based on 'definitionId' and 'format'
* 2. In Editing an existing export, from UserSupportedFileDefinitions based on userDefinitionId
* TODO @Raghu: Refactor this selector to be more clear
*/
export const fileDefinitionSampleData = (state, { userDefinitionId, resourceType, options }) => {
  const { resourcePath, definitionId, format } = options;
  let template;
  if (definitionId && format) {
    template = fileDefinition(state, definitionId, {
      format,
      resourceType,
    });
  } else if (userDefinitionId) {
    // selector to get that resource based on userDefId
    template = resource(state, 'filedefinitions', userDefinitionId);
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
export function fileSampleData(state, { resourceId, resourceType, fileType}) {
  const stage = fileType === 'xlsx' ? 'csv' : 'rawFile';
  const { data: rawData } = getResourceSampleDataWithStatus(
    state,
    resourceId,
    stage,
  );
  if (!rawData) {
    const resourceObj = resource(state, resourceType, resourceId);
    if (resourceObj?.file?.type === fileType) {
      return resourceObj.sampleData;
    }
  }
  return rawData?.body;
}
export function suiteScriptFileExportSampleData(state, { ssLinkedConnectionId, resourceType, resourceId}) {
  // const stage = fileType === 'xlsx' ? 'csv' : 'rawFile';
  const { data: rawData } = getResourceSampleDataWithStatus(
    state,
    resourceId,
    'rawFile',
  );
  if (!rawData) {
    const resourceObj = suiteScriptResource(state, {resourceType, id: resourceId, ssLinkedConnectionId});
    if (
      resourceObj?.export?.file?.csv
    ) {
      return resourceObj.export.sampleData;
    }
  }
  return rawData?.body;
}
export const getSuitescriptMappingSubRecordList = createSelector([
  (state, {integrationId,
    ssLinkedConnectionId,
    flowId}) => suiteScriptFlowDetail(state, {
    integrationId,
    ssLinkedConnectionId,
    flowId
  }),
], (flow) => {
  if (flow?.import?.netsuite?.subRecordImports?.length) {
    // recursively fetch subrecordMapping
    const subRecordList = [];
    const iterateSubRecord = (subRecords) => {
      if (subRecords?.length) {
        subRecords.forEach(_subRecordImp => {
          subRecordList.push({
            id: _subRecordImp.mappingId,
            name: `${_subRecordImp.recordType} (Subrecord)`
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

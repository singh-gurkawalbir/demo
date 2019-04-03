import { combineReducers } from 'redux';
import jsonPatch from 'fast-json-patch';
import app, * as fromApp from './app';
import data, * as fromData from './data';
import session, * as fromSession from './session';
import comms, * as fromComms from './comms';
import resourceDefaults from './resourceDefaults';
import auth from './authentication';
import user, * as fromUser from './user';
import actionTypes from '../actions/types';
import { changePasswordParams, changeEmailParams } from '../sagas/api/apiPaths';

const combinedReducers = combineReducers({
  app,
  session,
  data,
  user,
  auth,
  comms,
});
const rootReducer = (state, action) => {
  if (action.type === actionTypes.CLEAR_STORE) {
    const { app } = state;

    return { app };
  }

  return combinedReducers(state, action);
};

export default rootReducer;

// TODO: Do we realy need to proxy all selectors here?
// Instead, we could only have the selectors that cross
// state subdivisions (marked GLOBAL right now)
// This is a lot of boiler plate code to maintian for the
// sole purpose of abstracting the state "shape" completely.
// It may be just fine to directly reference the primary state
// subdivisions (data, session, comms) in order to simplify the code further...

// -------------------
// Following this pattern:
// https://hackernoon.com/selector-pattern-painless-redux-state-destructuring-bfc26b72b9ae

// #region app selectors
export function reloadCount(state) {
  return fromApp.reloadCount((state && state.app) || null);
}
// #endregion app selectors

// #region PUBLIC COMMS SELECTORS
export function allLoadingOrErrored(state) {
  return fromComms.allLoadingOrErrored(state.comms);
}

export function isLoadingAnyResource(state) {
  return fromComms.isLoadingAnyResource(state.comms);
}

export function isCommsBelowNetworkThreshold(state) {
  return fromComms.isCommsBelowNetworkThreshold(state.comms);
}

export function isAllLoadingCommsAboveThresold(state) {
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
export function filter(state, name) {
  return fromSession.filter(state.session, name);
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

export function userOrigPreferences(state) {
  return (state && state.data && state.data.preferences) || {};
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

// #region AUTHENTICATION SELECTORS
export function isAuthenticated(state) {
  return !!(state && state.auth && state.auth.authenticated);
}

export function isAuthInitialized(state) {
  return !!(state && state.auth && state.auth.initialized);
}

export function isAuthLoading(state) {
  return !!(state && state.auth && state.auth.loading);
}

export function isUserLoggedOut(state) {
  return !!(state && state.auth);
}

export function authenticationErrored(state) {
  return state && state.auth && state.auth.failure;
}

export function isSessionExpired(state) {
  return !!(state && state.auth && state.auth.sessionExpired);
}
// #endregion AUTHENTICATION SELECTORS

// #region PASSWORD & EMAIL update selectors for modals
export function changePasswordSuccess(state) {
  return (
    state &&
    state.comms &&
    state.comms[changePasswordParams.path] &&
    state.comms[changePasswordParams.path].status &&
    state.comms[changePasswordParams.path].status ===
      fromComms.COMM_STATES.SUCCESS
  );
}

export function changePasswordFailure(state) {
  return (
    state &&
    state.comms &&
    state.comms[changePasswordParams.path] &&
    state.comms[changePasswordParams.path].status &&
    state.comms[changePasswordParams.path].status ===
      fromComms.COMM_STATES.ERROR
  );
}

export function changePasswordMsg(state) {
  return (
    (state &&
      state.comms &&
      state.comms[changePasswordParams.path] &&
      state.comms[changePasswordParams.path].message) ||
    ''
  );
}

export function changeEmailFailure(state) {
  return (
    state &&
    state.comms &&
    state.comms[changeEmailParams.path] &&
    state.comms[changeEmailParams.path].status &&
    state.comms[changeEmailParams.path].status === fromComms.COMM_STATES.ERROR
  );
}

export function changeEmailSuccess(state) {
  return (
    state &&
    state.comms &&
    state.comms[changeEmailParams.path] &&
    state.comms[changeEmailParams.path].status &&
    state.comms[changeEmailParams.path].status === fromComms.COMM_STATES.SUCCESS
  );
}

export function changeEmailMsg(state) {
  return (
    (state &&
      state.comms &&
      state.comms[changeEmailParams.path] &&
      state.comms[changeEmailParams.path].message) ||
    ''
  );
}

// #endregion PASSWORD & EMAIL update selectors for modals

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

export function processors(state) {
  return fromData.processors(state.data);
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
      a => a._id !== 'own' && a.accepted && !a.disabled
    ).length > 0
  );
}

export function isValidSharedAccountId(state, _id) {
  return !!(
    state &&
    state.user &&
    state.user.org.accounts &&
    state.user.org.accounts.filter(
      a => a.accepted && !a.disabled && a._id === _id && a._id !== 'own'
    ).length > 0
  );
}

export function getOneValidSharedAccountId(state) {
  let _id;

  if (state && state.user && state.user.org && state.user.org.accounts) {
    const accepted = state.user.org.accounts.filter(
      a => a.accepted && !a.disabled && a._id !== 'own'
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
// #endregion

// #region PUBLIC GLOBAL SELECTORS
export function isProfileDataReady(state) {
  return !!(
    state &&
    hasProfile(state) &&
    !fromComms.isLoading(state.comms, '/profile')
  );
}

export function isProfileLoading(state) {
  return !!(state && fromComms.isLoading(state.comms, '/profile'));
}

export function isDataReady(state, resource) {
  return (
    fromData.hasData(state.data, resource) &&
    !fromComms.isLoading(state.comms, resource)
  );
}

// the keys for the comm's reducers require a forward slash before
// the resource name where as the keys for the data reducer don't
export function resourceStatus(state, origResourceType) {
  const resourceType = `/${origResourceType}`;
  const reqType = fromComms.commReqType(state.comms, resourceType);
  const hasData = fromData.hasData(state.data, origResourceType);
  const isLoading = fromComms.isLoading(state.comms, resourceType);
  const retryCount = fromComms.retryCount(state.comms, resourceType);
  const isReady = reqType !== 'GET' || (hasData && !isLoading);

  return {
    resourceType: origResourceType,
    hasData,
    isLoading,
    retryCount,
    reqType,
    isReady,
  };
}

export function resourceData(state, resourceType, id) {
  const master = resource(state, resourceType, id);

  if (!master) return {};

  const { patch, conflict } = fromSession.stagedResource(state.session, id);
  // console.log('patch:', patch);
  let merged = master;

  if (patch) {
    const patchResult = jsonPatch.applyPatch(
      jsonPatch.deepClone(master),
      patch
    );

    // console.log('patchResult', patchResult);
    merged = patchResult.newDocument;
  }

  const data = {
    master,
    patch,
    merged,
  };

  if (conflict) data.conflict = conflict;

  return data;
}

export function newResourceData(state, resourceType, id) {
  const master = resourceDefaults[resourceType];
  const { patch } = fromSession.stagedResource(state.session, id);
  // console.log('patch:', patch);
  let merged = master;

  if (patch) {
    const patchResult = jsonPatch.applyPatch(
      jsonPatch.deepClone(master),
      patch
    );

    // console.log('patchResult', patchResult);
    merged = patchResult.newDocument;
  }

  const data = {
    master,
    patch,
    merged,
  };

  return data;
}

// #endregion

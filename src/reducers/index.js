import { combineReducers } from 'redux';
// import reduceReducers from 'reduce-reducers';
import jsonPatch from 'fast-json-patch';
import data, * as fromData from './data';
import session, * as fromSession from './session';
import comms, * as fromComms from './comms';
import auth, * as fromAuth from './authentication';
import user, * as fromUser from './user';
import actionTypes from '../actions/types';

// const userDeletion = (state = null, action) => {
//   // TODO: Have to verify auth failure request
//   // Delete cookie
//   const patch = [{ op: 'remove', path: '/user/profile' }];

//   if (action.type === actionTypes.AUTH_FAILURE) {
//     const document = jsonPatch.deepClone(state);
//     const newState = jsonPatch.applyPatch(document, patch);

//     return newState.newDocument;
//   }

//   return state;
// };

const combinedReducers = combineReducers({
  session,
  data,
  user,
  auth,
  comms,
});
const rootReducer = (state, action) => {
  if (action.type === actionTypes.USER_LOGOUT) {
    return {};
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

// #region PUBLIC COMMS SELECTORS
export function allLoadingOrErrored(state) {
  return fromComms.allLoadingOrErrored(state.comms);
}

export function isLoadingAnyResource(state) {
  return fromComms.isLoadingAnyResource(state.comms);
}

export function isLoadingProfile(state) {
  return fromAuth.isProfileLoading(state.auth);
}

// #endregion

// #region PUBLIC SESSION SELECTORS
export function filter(state, name) {
  return fromSession.filter(state.session, name);
}

export function avatarUrl(state) {
  return fromUser.avatarUrl(state.user);
}

export function userProfile(state) {
  return state && state.user && state.user.profile;
}

export function userProfileEmail(state) {
  return state && state.user && state.user.profile && state.user.profile.email;
}

export function isAuthenticated(state) {
  return state && state.auth && state.auth.authenticated;
}

export function authenticationErrored(state) {
  return state && state.auth && state.auth.failure;
}

export function isSessionExpired(state) {
  return !!(state && state.auth && state.auth.sessionExpired);
}

export function themeName(state) {
  return state && state.user && state.user.themeName;
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
// #endregion

// #region PUBLIC GLOBAL SELECTORS
export function isProfileDataReady(state) {
  return !!(
    state &&
    hasProfile(state) &&
    !fromComms.isLoading(state.comms, 'profile')
  );
}

export function isDataReady(state, resource) {
  return (
    fromData.hasData(state.data, resource) &&
    !fromComms.isLoading(state.comms, resource)
  );
}

export function resourceStatus(state, resourceType) {
  const hasData = fromData.hasData(state.data, resourceType);
  const isLoading = fromComms.isLoading(state.comms, resourceType);
  const retryCount = fromComms.retryCount(state.comms, resourceType);
  const error = fromComms.error(state.comms, resourceType);
  const isReady = hasData && !isLoading;

  return {
    resourceType,
    hasData,
    isLoading,
    retryCount,
    isReady,
    error,
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
// #endregion

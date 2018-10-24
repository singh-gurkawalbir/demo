import { combineReducers } from 'redux';
import data, * as fromData from './data';
import session, * as fromSession from './session';
import comms, * as fromComms from './comms';

const rootReducer = combineReducers({
  session,
  data,
  comms,
});

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

export function isLoadingAllResources(state) {
  return fromComms.isLoadingAllResources(state.comms);
}

// #endregion

// #region PUBLIC SESSION SELECTORS
export function filter(state, name) {
  return fromSession.filter(state.session, name);
}

export function avatarUrl(state) {
  return fromSession.avatarUrl(state.session);
}

export function userProfile(state) {
  return state && state.session && state.session.profile;
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
  const r = resource(state, resourceType, id);

  if (!r) return null;

  const staged = fromSession.stagedResource(state.session, id);
  const merged = staged ? { ...r, ...staged.changes } : r;

  return {
    resource: r,
    staged,
    merged,
  };
}
// #endregion

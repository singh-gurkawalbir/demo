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

// PUBLIC DATA SELECTORS
// -------------------
// Following this pattern:
// https://hackernoon.com/selector-pattern-painless-redux-state-destructuring-bfc26b72b9ae
export function exportDetails(state) {
  return fromData.exportDetails(state.data);
}

export function importDetails(state) {
  return fromData.importDetails(state.data);
}

// PUBLIC SESSION SELECTORS
export function avatarUrl(state) {
  return fromSession.avatarUrl(state.session);
}

export function userProfile(state) {
  return state && state.session && state.session.profile;
}

export function hasProfile(state) {
  return !!userProfile(state);
}

// PUBLIC GLOBAL SELECTORS
export function isProfileDataReady(state) {
  return hasProfile(state) && !fromComms.isLoading(state.comms, 'profile');
}

export function isDataReady(state, resource) {
  return (
    fromData.haveData(state.data, resource) &&
    !fromComms.isLoading(state.comms, resource)
  );
}

export function resourceStatus(state, resource) {
  const hasData = fromData.haveData(state.data, resource);
  const isLoading = fromComms.isLoading(state.comms, resource);
  const retryCount = fromComms.retryCount(state.comms, resource);
  const error = fromComms.error(state.comms, resource);
  const isReady = hasData && !isLoading;

  return {
    name: resource,
    hasData,
    isLoading,
    retryCount,
    isReady,
    error,
  };
}

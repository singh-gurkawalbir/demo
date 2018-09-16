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

export function haveData(state, resource) {
  return fromData.haveData(state.data, resource);
}

// PUBLIC SESSION SELECTORS
export function haveProfile(state) {
  return fromSession.haveProfile(state.session);
}

// PUBLIC GLOBAL SELECTORS
export function isProfileDataReady(state) {
  return haveProfile(state) && !fromComms.isLoading(state.comms, 'profile');
}

export function isDataReady(state, resource) {
  return (
    fromData.haveData(state.data, resource) &&
    !fromComms.isLoading(state.comms, resource)
  );
}

import { combineReducers } from 'redux';
import data, * as fromData from './data';
import session from './session';
import comms from './comms';

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

export function haveExportsData(state) {
  return fromData.haveExportsData(state.data);
}

export function haveImportsData(state) {
  return fromData.haveImportsData(state.data);
}

export function haveConnectionsData(state) {
  return fromData.haveConnectionsData(state.data);
}

// PUBLIC GLOBAL SELECTORS
export function isProfileDataReady(state) {
  return !!(state.session.name && !state.comms.profile.loading);
}

export function isConnectionsDataReady(state) {
  return haveConnectionsData(state) && !state.comms.connections.loading;
}

export function isExportsDataReady(state) {
  return haveExportsData(state) && !state.comms.exports.loading;
}

export function isImportsDataReady(state) {
  return haveImportsData(state) && !state.comms.imports.loading;
}

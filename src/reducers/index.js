import { combineReducers } from 'redux';
import data, * as fromData from './data';
import session from './session';

const rootReducer = combineReducers({
  session,
  data,
});

export default rootReducer;

// PUBLIC SELECTORS
// -------------------
// Following this pattern:
// https://hackernoon.com/selector-pattern-painless-redux-store-destructuring-bfc26b72b9ae
export function exportDetails(store) {
  return fromData.exportDetails(store.data);
}

export function importDetails(store) {
  return fromData.importDetails(store.data);
}

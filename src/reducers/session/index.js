import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';

export default combineReducers({
  filters,
  editors,
  stage,
});

// #region PUBLIC SELECTORS
export function filter(state, name) {
  if (!state) return {};

  return fromFilters.filter(state.filters, name);
}

export function editor(state, id) {
  if (!state) return {};

  return fromEditors.editor(state.editors, id);
}

export function editorProcessorOptions(state, id) {
  if (!state) return {};

  return fromEditors.editorProcessorOptions(state.editors, id);
}

export function stagedResource(state, id) {
  if (!state) return {};

  return fromStage.stagedResource(state.stage, id);
}
// #endregion

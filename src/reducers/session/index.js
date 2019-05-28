import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';
import metadata, * as fromMetadata from './metadata';

export default combineReducers({
  filters,
  editors,
  stage,
  metadata,
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

export function processorRequestOptions(state, id) {
  if (!state) return {};

  return fromEditors.processorRequestOptions(state.editors, id);
}

export function stagedResource(state, id) {
  if (!state) return {};

  return fromStage.stagedResource(state.stage, id);
}

export function optionsFromMetadata(
  state,
  connectionId,
  applicationType,
  metadataType,
  mode
) {
  return fromMetadata.optionsFromMetadata(
    (state && state.metadata) || null,
    connectionId,
    applicationType,
    metadataType,
    mode
  );
}

// #endregion

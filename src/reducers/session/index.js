import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';
import metadata, * as fromMetadata from './metadata';
import resourceForm, * as fromResourceForm from './resourceForm';
import agentAccessTokens, * as fromAgentAccessTokens from './agentAccessTokens';

export default combineReducers({
  stage,
  filters,
  editors,
  metadata,
  resourceForm,
  agentAccessTokens,
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

export function resourceFormState(state, resourceType, resourceId) {
  return fromResourceForm.resourceFormState(
    state && state.resourceForm,
    resourceType,
    resourceId
  );
}

export function agentAccessToken(state, resourceId) {
  return fromAgentAccessTokens.agentAccessToken(
    state && state.agentAccessTokens,
    resourceId
  );
}
// #endregion

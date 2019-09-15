import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';
import metadata, * as fromMetadata from './metadata';
import connectors, * as fromConnectors from './connectors';
import resourceForm, * as fromResourceForm from './resourceForm';
import agentAccessTokens, * as fromAgentAccessTokens from './agentAccessTokens';
import stackSystemTokens, * as fromStackSystemTokens from './stackSystemTokens';
import connectionToken, * as fromConnectionToken from './connectionToken';
import netsuiteUserRole, * as fromNetsuiteUserRoles from './netsuiteUserRoles';
import sampleData, * as fromSampleData from './sampleData';
import fileDefinitions, * as fromFileDefinitions from './fileDefinitions';
import resource, * as fromResource from './resource';

export default combineReducers({
  stage,
  filters,
  editors,
  metadata,
  connectors,
  connectionToken,
  resourceForm,
  agentAccessTokens,
  stackSystemTokens,
  resource,
  netsuiteUserRole,
  sampleData,
  fileDefinitions,
});

// #region PUBLIC SELECTORS

export function netsuiteUserRoles(
  state,
  connectionId,
  netsuiteResourceType,
  env,
  acc
) {
  return fromNetsuiteUserRoles.netsuiteUserRoles(
    state && state.netsuiteUserRole,
    connectionId,
    netsuiteResourceType,
    env,
    acc
  );
}

export function connectionTokens(state, resourceId) {
  return fromConnectionToken.connectionTokens(
    state && state.connectionToken,
    resourceId
  );
}

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

export function stagedResource(state, id, scope) {
  if (!state) return {};

  return fromStage.stagedResource(state.stage, id, scope);
}

export function optionsFromMetadata(
  state,
  connectionId,
  applicationType,
  metadataType,
  mode,
  recordType,
  selectField
) {
  return fromMetadata.optionsFromMetadata(
    state && state.metadata,
    connectionId,
    applicationType,
    metadataType,
    mode,
    recordType,
    selectField
  );
}

export function optionsMapFromMetadata(
  state,
  connectionId,
  applicationType,
  recordType,
  selectField,
  optionsMap
) {
  return fromMetadata.optionsMapFromMetadata(
    state && state.metadata,
    connectionId,
    applicationType,
    recordType,
    selectField,
    optionsMap
  );
}

export const getSupportedFileDefinitions = (state, format) =>
  fromFileDefinitions.getSupportedFileDefinitions(
    state && state.fileDefinitions,
    format
  );

export const getUserSupportedFileDefinitions = (state, format) =>
  fromFileDefinitions.getUserSupportedFileDefinitions(
    state && state.fileDefinitions,
    format
  );

export const getDefinitionTemplate = (
  state,
  format,
  definitionId,
  resourceType
) =>
  fromFileDefinitions.getDefinitionTemplate(
    state && state.fileDefinitions,
    format,
    definitionId,
    resourceType
  );

export const getUserSupportedDefinition = (state, definitionId) =>
  fromFileDefinitions.getUserSupportedDefinition(
    state && state.fileDefinitions,
    definitionId
  );

export function resourceFormState(state, resourceType, resourceId) {
  return fromResourceForm.resourceFormState(
    state && state.resourceForm,
    resourceType,
    resourceId
  );
}

export function connectorMetadata(state, fieldName, id, _integrationId) {
  return fromConnectors.connectorMetadata(
    state && state.connectors,
    fieldName,
    id,
    _integrationId
  );
}

export function agentAccessToken(state, resourceId) {
  return fromAgentAccessTokens.agentAccessToken(
    state && state.agentAccessTokens,
    resourceId
  );
}

export function stackSystemToken(state, resourceId) {
  return fromStackSystemTokens.stackSystemToken(
    state && state.stackSystemTokens,
    resourceId
  );
}

export function getResourceSampleDataWithStatus(state, resourceId, stage) {
  return fromSampleData.getResourceSampleDataWithStatus(
    state && state.sampleData,
    resourceId,
    stage
  );
}

export function createdResourceId(state, tempId) {
  return fromResource.createdResourceId(state && state.resource, tempId);
}

export function resourceReferences(state) {
  return fromResource.resourceReferences(state && state.resource);
}

export function assistantData(state, { adaptorType, assistant }) {
  return fromMetadata.assistantData(state && state.metadata, {
    adaptorType,
    assistant,
  });
}
// #endregion

import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';
import metadata, * as fromMetadata from './metadata';
import connectors, * as fromConnectors from './connectors';
import resourceForm, * as fromResourceForm from './resourceForm';
import agentAccessTokens, * as fromAgentAccessTokens from './agentAccessTokens';
import stackSystemTokens, * as fromStackSystemTokens from './stackSystemTokens';
import apiAccessTokens, * as fromApiAccessTokens from './apiAccessTokens';
import connectionToken, * as fromConnectionToken from './connectionToken';
import netsuiteUserRole, * as fromNetsuiteUserRoles from './netsuiteUserRoles';
import sampleData, * as fromSampleData from './sampleData';
import flowData, * as fromFlowData from './sampleData/flows';
import integrationApps, * as fromIntegrationApps from './integrationApps';
import templates, * as fromTemplates from './templates';
import oAuthAuthorize, * as fromOAuthAuthorize from './oAuthAuthorize';
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
  apiAccessTokens,
  resource,
  netsuiteUserRole,
  sampleData,
  flowData,
  integrationApps,
  templates,
  oAuthAuthorize,
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

export function resourceFormState(state, resourceType, resourceId) {
  return fromResourceForm.resourceFormState(
    state && state.resourceForm,
    resourceType,
    resourceId
  );
}

export function previewTemplate(state, templateId) {
  return fromTemplates.previewTemplate(state && state.templates, templateId);
}

export function template(state, templateId) {
  return fromTemplates.template(state && state.templates, templateId);
}

export function templateInstallSteps(state, templateId) {
  return fromTemplates.templateInstallSteps(
    state && state.templates,
    templateId
  );
}

export function connectionMap(state, templateId) {
  return fromTemplates.connectionMap(state && state.templates, templateId);
}

export function isAuthorized(state, connectionId) {
  return fromOAuthAuthorize.isAuthorized(
    state && state.oAuthAuthorize,
    connectionId
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

export function getSampleData(
  state,
  flowId,
  resourceId,
  stage,
  isPageGenerator
) {
  return fromFlowData.getSampleData(
    state && state.flowData,
    flowId,
    resourceId,
    stage,
    isPageGenerator
  );
}

export function getSampleDataStatus(
  state,
  flowId,
  resourceId,
  stage,
  isPageGenerator
) {
  return fromFlowData.getSampleDataStatus(
    state && state.flowData,
    flowId,
    resourceId,
    stage,
    isPageGenerator
  );
}

export function getFlowReferencesForResource(state, resourceId) {
  return fromFlowData.getFlowReferencesForResource(
    state && state.flowData,
    resourceId
  );
}

export function getFlowDataState(state, flowId) {
  return fromFlowData.getFlowDataState(state && state.flowData, flowId);
}

export function apiAccessToken(state, resourceId) {
  return fromApiAccessTokens.apiAccessToken(
    state && state.apiAccessTokens,
    resourceId
  );
}

export function integrationAppsInstaller(state, id) {
  return fromIntegrationApps.integrationAppsInstaller(
    state && state.integrationApps,
    id
  );
}

export function uninstallSteps(state, id, storeId) {
  return fromIntegrationApps.uninstallSteps(
    state && state.integrationApps,
    id,
    storeId
  );
}

export function addNewStoreSteps(state, id) {
  return fromIntegrationApps.addNewStoreSteps(
    state && state.integrationApps,
    id
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

import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';
import metadata, * as fromMetadata from './metadata';
import connectors, * as fromConnectors from './connectors';
import connections, * as fromConnections from './connections';
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
import mappings, * as fromMappings from './mappings';

export default combineReducers({
  stage,
  filters,
  editors,
  metadata,
  connectors,
  connections,
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
  mappings,
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

export function mapping(state, id) {
  if (!state) return [];

  return fromMappings.mapping(state.mappings, id);
}

export function processorRequestOptions(state, id) {
  if (!state) return {};

  return fromEditors.processorRequestOptions(state.editors, id);
}

export function stagedResource(state, id, scope) {
  if (!state) return {};

  return fromStage.stagedResource(state.stage, id, scope);
}

export function optionsFromMetadata({
  state,
  connectionId,
  commMetaPath,
  filterKey,
}) {
  return fromMetadata.optionsFromMetadata({
    state: state && state.metadata,
    connectionId,
    commMetaPath,
    filterKey,
  });
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

export function resourceFormSaveProcessTerminated(
  state,
  resourceType,
  resourceId
) {
  return fromResourceForm.resourceFormSaveProcessTerminated(
    state && state.resourceForm,
    resourceType,
    resourceId
  );
}

export function previewTemplate(state, templateId) {
  return fromTemplates.previewTemplate(state && state.templates, templateId);
}

export function isFileUploaded(state) {
  return fromTemplates.isFileUploaded(state && state.templates);
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

export function getSampleData(state, flowId, resourceId, stage, options) {
  return fromFlowData.getSampleData(
    state && state.flowData,
    flowId,
    resourceId,
    stage,
    options
  );
}

export function getFlowDataState(state, flowId, resourceId, isPageGenerator) {
  return fromFlowData.getFlowDataState(
    state && state.flowData,
    flowId,
    resourceId,
    isPageGenerator
  );
}

export function apiAccessToken(state, resourceId) {
  return fromApiAccessTokens.apiAccessToken(
    state && state.apiAccessTokens,
    resourceId
  );
}

export function integrationAppSettingsFormState(state, integrationId, flowId) {
  return fromIntegrationApps.integrationAppSettingsFormState(
    state && state.integrationApps,
    integrationId,
    flowId
  );
}

export function integrationAppAddOnState(state, integrationId) {
  return fromIntegrationApps.integrationAppAddOnState(
    state && state.integrationApps,
    integrationId
  );
}

export function checkUpgradeRequested(state, licenseId) {
  return fromIntegrationApps.checkUpgradeRequested(
    state && state.integrationApps,
    licenseId
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

export function integratorLicenseActionMessage(state) {
  return fromResource.integratorLicenseActionMessage(state && state.resource);
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

export function assistantPreviewData(state, resourceId) {
  return fromMetadata.assistantPreviewData(state && state.metadata, resourceId);
}

export function debugLogs(state) {
  return fromConnections.debugLogs(state && state.connections);
}
// #endregion

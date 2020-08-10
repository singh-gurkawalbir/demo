import { combineReducers } from 'redux';
import stage, { selectors as fromStage } from './stage';
import filters, { selectors as fromFilters } from './filters';
import editors, { selectors as fromEditors } from './editors';
import metadata, { selectors as fromMetadata } from './metadata';
import editorSampleData, { selectors as fromEditorSampleData } from './editorSampleData';
import connectors, { selectors as fromConnectors } from './connectors';
import connections, { selectors as fromConnections } from './connections';
import resourceForm, { selectors as fromResourceForm } from './resourceForm';
import agentAccessTokens, { selectors as fromAgentAccessTokens } from './agentAccessTokens';
import stackSystemTokens, { selectors as fromStackSystemTokens } from './stackSystemTokens';
import apiAccessTokens, { selectors as fromApiAccessTokens } from './apiAccessTokens';
import connectionToken, { selectors as fromConnectionToken } from './connectionToken';
import netsuiteUserRole, { selectors as fromNetsuiteUserRoles } from './netsuiteUserRoles';
import sampleData, { selectors as fromSampleData } from './sampleData';
import importSampleData, { selectors as fromImportSampleData } from './sampleData/imports';
import flowData, { selectors as fromFlowData } from './sampleData/flows';
import integrationApps, { selectors as fromIntegrationApps } from './integrationApps';
import templates, { selectors as fromTemplates } from './templates';
import oAuthAuthorize, { selectors as fromOAuthAuthorize } from './oAuthAuthorize';
import resource, { selectors as fromResource } from './resource';
import flowMetrics, { selectors as fromFlowMetrics } from './flowMetrics';
import mappings, { selectors as fromMappings } from './mappings';
import searchCriteriaReducer, { selectors as fromSearchCriteria } from './searchCriteria';
import flows, { selectors as fromFlows } from './flows';
import transfers, { selectors as fromTransfers } from './transfers';
import responseMapping, { selectors as fromResponseMapping } from './responseMapping';
import fileUpload, { selectors as fromFileUpload } from './fileUpload';
import suiteScript, { selectors as fromSuiteScript } from './suiteScript';
import jobErrorsPreview, { selectors as fromJobErrorsPreview } from './jobErrorsPreview';
import errorManagement, { selectors as fromErrorManagement } from './errorManagement';
import exportDataReducer, { selectors as fromExportData } from './exportData';
import customSettings, { selectors as fromCustomSettings } from './customSettings';
import recycleBin, { selectors as fromRecycleBin } from './recycleBin';
import { genSelectors } from '../util';
import mappingV2 from './mappingV2';

export default combineReducers({
  recycleBin,
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
  importSampleData,
  flowData,
  flowMetrics,
  integrationApps,
  templates,
  oAuthAuthorize,
  mappings,
  searchCriteriaReducer,
  flows,
  transfers,
  responseMapping,
  fileUpload,
  suiteScript,
  jobErrorsPreview,
  errorManagement,
  customSettings,
  exportData: exportDataReducer,
  editorSampleData,
  mappingV2,
});

// #region PUBLIC SELECTORS
export const selectors = {};
const subSelectors = {
  stage: fromStage,
  filters: fromFilters,
  editors: fromEditors,
  metadata: fromMetadata,
  editorSampleData: fromEditorSampleData,
  connectors: fromConnectors,
  connections: fromConnections,
  resourceForm: fromResourceForm,
  agentAccessTokens: fromAgentAccessTokens,
  stackSystemTokens: fromStackSystemTokens,
  apiAccessTokens: fromApiAccessTokens,
  connectionToken: fromConnectionToken,
  netsuiteUserRole: fromNetsuiteUserRoles,
  sampleData: fromSampleData,
  importSampleData: fromImportSampleData,
  flowData: fromFlowData,
  integrationApps: fromIntegrationApps,
  templates: fromTemplates,
  oAuthAuthorize: fromOAuthAuthorize,
  resource: fromResource,
  flowMetrics: fromFlowMetrics,
  mappings: fromMappings,
  searchCriteriaReducer: fromSearchCriteria,
  flows: fromFlows,
  transfers: fromTransfers,
  responseMapping: fromResponseMapping,
  fileUpload: fromFileUpload,
  suiteScript: fromSuiteScript,
  jobErrorsPreview: fromJobErrorsPreview,
  errorManagement: fromErrorManagement,
  exportDataReducer: fromExportData,
  customSettings: fromCustomSettings,
  recycleBin: fromRecycleBin,
};

genSelectors(selectors, subSelectors);

selectors.stagedState = state => state && state.stage;

const lastExportDateTime = {};

selectors.getLastExportDateTime = (state, flowId) => (
  fromFlows.getLastExportDateTime(state && state.flows, flowId) ||
    lastExportDateTime
);

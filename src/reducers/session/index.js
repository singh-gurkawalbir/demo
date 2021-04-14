import { combineReducers } from 'redux';
import form, {selectors as fromForm} from './form';
import stage, { selectors as fromStage } from './stage';
import filters, { selectors as fromFilters } from './filters';
import editors, { selectors as fromEditors } from './editors';
import metadata, { selectors as fromMetadata } from './metadata';
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
import mapping, { selectors as fromMapping } from './mapping';
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
import logs, {selectors as fromLogs} from './logs';
import { genSelectors } from '../util';

export default combineReducers({
  form,
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
  mapping,
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
  logs,
});

// #region PUBLIC SELECTORS
export const selectors = {};
const subSelectors = {
  form: fromForm,
  stage: fromStage,
  filters: fromFilters,
  editors: fromEditors,
  metadata: fromMetadata,
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
  mapping: fromMapping,
  searchCriteriaReducer: fromSearchCriteria,
  flows: fromFlows,
  transfers: fromTransfers,
  responseMapping: fromResponseMapping,
  fileUpload: fromFileUpload,
  suiteScript: fromSuiteScript,
  jobErrorsPreview: fromJobErrorsPreview,
  errorManagement: fromErrorManagement,
  exportData: fromExportData,
  customSettings: fromCustomSettings,
  recycleBin: fromRecycleBin,
  logs: fromLogs,
};

genSelectors(selectors, subSelectors);

selectors.stagedState = state => state && state.stage;

const lastExportDateTime = {};

selectors.getLastExportDateTime = (state, flowId) => (
  fromFlows.getLastExportDateTime(state && state.flows, flowId) ||
    lastExportDateTime
);

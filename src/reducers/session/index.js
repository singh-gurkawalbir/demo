import { combineReducers } from 'redux';
import form, {selectors as fromForm} from './form';
import stage, { selectors as fromStage } from './stage';
import filters, { selectors as fromFilters } from './filters';
import editors, { selectors as fromEditors } from './editors';
import metadata, { selectors as fromMetadata } from './metadata';
import connectors, { selectors as fromConnectors } from './connectors';
import concur, { selectors as fromConcur } from './concur';
import connections, { selectors as fromConnections } from './connections';
import resourceForm, { selectors as fromResourceForm } from './resourceForm';
import agentAccessTokens, { selectors as fromAgentAccessTokens } from './agentAccessTokens';
import stackSystemTokens, { selectors as fromStackSystemTokens } from './stackSystemTokens';
import apiAccessTokens, { selectors as fromApiAccessTokens } from './apiAccessTokens';
import connectionToken, { selectors as fromConnectionToken } from './connectionToken';
import netsuiteUserRole, { selectors as fromNetsuiteUserRoles } from './netsuiteUserRoles';
import resourceFormSampleData, { selectors as fromResourceFormSampleData } from './sampleData/resourceForm';
import mockInput, { selectors as fromMockInput } from './sampleData/mockInput';
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
import sso, {selectors as fromSSO} from './sso';
import mfa, {selectors as fromMFA} from './mfa';
import bottomDrawer, {selectors as fromBottomDrawer} from './bottomDrawer';
import integrations, {selectors as fromIntegrations} from './integrations';
import asyncTask, {selectors as fromAsyncTask} from './asyncTask';
import lifeCycleManagement, {selectors as fromLifeCycleManagement} from './lifeCycleManagement';
import loadResources, { selectors as fromLoadResources } from './loadResources';
import aliases, {selectors as fromAliases} from './aliases';
import flowbuilder, { selectors as fromFlowbuilder } from './flowbuilder';
import uiFields, { selectors as fromUIFields } from './uiFields';
import httpConnector, { selectors as fromHttpConnector } from './httpConnector';
import { genSelectors } from '../util';

export default combineReducers({
  asyncTask,
  form,
  recycleBin,
  stage,
  filters,
  editors,
  metadata,
  concur,
  connectors,
  connections,
  connectionToken,
  resourceForm,
  agentAccessTokens,
  stackSystemTokens,
  apiAccessTokens,
  resource,
  netsuiteUserRole,
  importSampleData,
  flowData,
  flowMetrics,
  integrationApps,
  integrations,
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
  sso,
  mfa,
  bottomDrawer,
  resourceFormSampleData,
  mockInput,
  lifeCycleManagement,
  loadResources,
  aliases,
  flowbuilder,
  uiFields,
  httpConnector,
});

// #region PUBLIC SELECTORS
export const selectors = {};
const subSelectors = {
  asyncTask: fromAsyncTask,
  form: fromForm,
  stage: fromStage,
  filters: fromFilters,
  editors: fromEditors,
  metadata: fromMetadata,
  concur: fromConcur,
  connectors: fromConnectors,
  connections: fromConnections,
  resourceForm: fromResourceForm,
  agentAccessTokens: fromAgentAccessTokens,
  stackSystemTokens: fromStackSystemTokens,
  apiAccessTokens: fromApiAccessTokens,
  connectionToken: fromConnectionToken,
  netsuiteUserRole: fromNetsuiteUserRoles,
  importSampleData: fromImportSampleData,
  flowData: fromFlowData,
  integrationApps: fromIntegrationApps,
  integrations: fromIntegrations,
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
  sso: fromSSO,
  mfa: fromMFA,
  bottomDrawer: fromBottomDrawer,
  resourceFormSampleData: fromResourceFormSampleData,
  mockInput: fromMockInput,
  lifeCycleManagement: fromLifeCycleManagement,
  loadResources: fromLoadResources,
  aliases: fromAliases,
  flowbuilder: fromFlowbuilder,
  uiFields: fromUIFields,
  httpConnector: fromHttpConnector,
};

genSelectors(selectors, subSelectors);

selectors.stagedState = state => state && state.stage;

const lastExportDateTime = {};

selectors.getLastExportDateTime = (state, flowId) => (
  fromFlows.getLastExportDateTime(state && state.flows, flowId) ||
    lastExportDateTime
);

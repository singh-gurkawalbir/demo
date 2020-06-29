import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';
import flows, * as fromFlows from './flows';
import account, * as fromAccount from './account';
import installer, * as fromInstaller from './installer';
import mappings, * as fromMappings from './mappings';
import importSampleData, * as fromImportSampleData from './sampleData/import';
import flowSampleData, * as fromFlowSampleData from './sampleData/flow';

export default combineReducers({
  mappings,
  resourceForm,
  flows,
  account,
  installer,
  importSampleData,
  flowSampleData,
});

export function resourceFormState(
  state,
  { resourceType, resourceId, ssLinkedConnectionId, integrationId }
) {
  return fromResourceForm.resourceFormState(state && state.resourceForm, {
    resourceType,
    resourceId,
    ssLinkedConnectionId,
    integrationId,
  });
}

export function resourceFormSaveProcessTerminated(
  state,
  { resourceType, resourceId, ssLinkedConnectionId, integrationId }
) {
  return fromResourceForm.resourceFormSaveProcessTerminated(
    state && state.resourceForm,
    {
      resourceType,
      resourceId,
      ssLinkedConnectionId,
      integrationId,
    }
  );
}

export function isFlowOnOffInProgress(state, { ssLinkedConnectionId, _id }) {
  return fromFlows.isOnOffInProgress(
    state && state.flows,
    { ssLinkedConnectionId, _id }
  );
}

export function netsuiteAccountHasSuiteScriptIntegrations(state, account) {
  return fromAccount.hasIntegrations(state && state.account, account);
}

export function installerData(state, id) {
  return fromInstaller.installerData(state && state.installer, id);
}
export function mappingState(state) {
  return fromMappings.mappingState(state && state.mappings);
}
export function mappingsChanged(state) {
  return fromMappings.mappingsChanged(state && state.mappings);
}
export function mappingsSaveStatus(state) {
  return fromMappings.mappingsSaveStatus(state && state.mappings);
}

export function importSampleDataContext(state, {ssLinkedConnectionId, integrationId, flowId}) {
  return fromImportSampleData.importSampleDataContext(state && state.importSampleData, {ssLinkedConnectionId, integrationId, flowId});
}
export function flowSampleDataContext(state, {ssLinkedConnectionId, integrationId, flowId}) {
  return fromFlowSampleData.flowSampleDataContext(state && state.flowSampleData, {ssLinkedConnectionId, integrationId, flowId});
}

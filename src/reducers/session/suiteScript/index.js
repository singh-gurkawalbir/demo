import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';
import iaForm, * as fromIAForm from './iaForm';
import flows, * as fromFlows from './flows';
import featureCheck, * as fromFeatureCheck from './featureCheck';
import account, * as fromAccount from './account';
import installer, * as fromInstaller from './installer';
import mappings, * as fromMappings from './mappings';

export default combineReducers({
  mappings,
  resourceForm,
  iaForm,
  flows,
  featureCheck,
  account,
  installer,
});

export function suiteScriptIAFeatureCheckState(
  state,
  { ssLinkedConnectionId, integrationId, featureName}
) {
  return fromFeatureCheck.suiteScriptIAFeatureCheckState(state && state.featureCheck, { ssLinkedConnectionId, integrationId, featureName});
}


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

export function suiteScriptIAFormSaveProcessTerminated(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  return fromIAForm.suiteScriptIAFormSaveProcessTerminated(
    state && state.iaForm,
    { ssLinkedConnectionId, integrationId }
  );
}

export function suiteScriptIAFormState(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  return fromIAForm.suiteScriptIAFormState(
    state && state.iaForm,
    { ssLinkedConnectionId, integrationId }
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

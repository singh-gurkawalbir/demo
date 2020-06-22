import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';
import flows, * as fromFlows from './flows';
import account, * as fromAccount from './account';
import installer, * as fromInstaller from './installer';

export default combineReducers({
  resourceForm,
  flows,
  account,
  installer,
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
  return fromFlows.isOnOffInProgress(state && state.flows, {
    ssLinkedConnectionId,
    _id,
  });
}

export function netsuiteAccountHasSuiteScriptIntegrations(state, account) {
  return fromAccount.hasIntegrations(state && state.account, account);
}

export function installerData(state, id) {
  return fromInstaller.installerData(state && state.installer, id);
}

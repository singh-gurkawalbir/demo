import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';
import flows, * as fromFlows from './flows';
import sfInstaller, * as fromInstaller from './salesforce/installer';

export default combineReducers({
  resourceForm,
  flows,
  sfInstaller
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

export function sfInstallerData(state, id) {
  return fromInstaller.sfInstallerData(state && state.sfInstaller, id);
}

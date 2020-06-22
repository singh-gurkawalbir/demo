import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';
import iaForm, * as fromIAForm from './iaForm';
import flows, * as fromFlows from './flows';

export default combineReducers({
  resourceForm,
  iaForm,
  flows,
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

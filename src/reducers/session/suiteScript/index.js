import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';
import flowData, * as fromFlowData from './sampleData/flows';

export default combineReducers({
  resourceForm,
  flowData,
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

export function getSampleData(
  state,
  { flowId, resourceId, resourceType, stage }
) {
  return fromFlowData.getSampleData(state && state.flowData, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });
}

export function getSampleDataContext(
  state,
  { flowId, resourceId, resourceType, stage }
) {
  return fromFlowData.getSampleDataContext(state && state.flowData, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });
}

export function getFlowDataState(state, flowId, resourceId) {
  return fromFlowData.getFlowDataState(
    state && state.flowData,
    flowId,
    resourceId
  );
}

import { combineReducers } from 'redux';
import resourceForm, * as fromResourceForm from './resourceForm';

export default combineReducers({
  resourceForm,
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

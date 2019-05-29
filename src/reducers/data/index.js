import { combineReducers } from 'redux';
import resources, * as fromResources from './resources';
import integrationAShares, * as fromIntegrationAShares from './integrationAShares';
import audit, * as fromAudit from './audit';

export default combineReducers({
  resources,
  integrationAShares,
  audit,
});

// #region resource selectors
export function resource(state, resourceType, id) {
  return fromResources.resource(state.resources, resourceType, id);
}

export function resourceList(state, options) {
  return fromResources.resourceList(state.resources, options);
}

export function processors(state) {
  return fromResources.processors(state.resources);
}

export function hasData(state, resourceType) {
  return fromResources.hasData(state.resources, resourceType);
}
// #endregion

export function integrationUsers(state, integrationId) {
  return fromIntegrationAShares.integrationUsers(
    state.integrationAShares,
    integrationId
  );
}

export function auditLogs(state, resourceType, resourceId) {
  return fromAudit.auditLogs(state.audit, resourceType, resourceId);
}

export function affectedResourcesFromAuditLogs(
  state,
  resourceType,
  resourceId
) {
  return fromAudit.affectedResources(state.audit, resourceType, resourceId);
}

export function usersFromAuditLogs(state, resourceType, resourceId) {
  return fromAudit.users(state.audit, resourceType, resourceId);
}

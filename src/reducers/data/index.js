import { combineReducers } from 'redux';
import resources, * as fromResources from './resources';
import integrationAShares, * as fromIntegrationAShares from './integrationAShares';

export default combineReducers({
  resources,
  integrationAShares,
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

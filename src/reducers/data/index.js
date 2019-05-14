import { combineReducers } from 'redux';
import resources, * as fromResources from './resources';

export default combineReducers({
  resources,
});

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

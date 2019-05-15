import { combineReducers } from 'redux';
import resources, * as fromResources from './resources';
import scriptsContent, * as fromScriptsContent from './scriptsContent';

export default combineReducers({
  resources,
  scriptsContent,
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

export function scriptContent(state, id) {
  return fromScriptsContent.scriptContent(state.scriptsContent, id);
}

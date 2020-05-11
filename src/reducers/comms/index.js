import { combineReducers } from 'redux';
import networkComms, * as fromNetworkComms from './networkComms';
import ping, * as fromPing from './ping';
import suiteScript, * as fromSuiteScript from './suiteScript';

export default combineReducers({
  networkComms,
  ping,
  suiteScript,
});

export function testConnectionStatus(state, resourceId) {
  return fromPing.testConnectionStatus(state && state.ping, resourceId);
}

export function testConnectionMessage(state, resourceId) {
  return fromPing.testConnectionMessage(state && state.ping, resourceId);
}

export function networkCommState(state) {
  return fromNetworkComms.networkCommState(state && state.networkComms);
}

export function commReqType(state, resourceName) {
  return fromNetworkComms.commReqType(
    state && state.networkComms,
    resourceName
  );
}

export function isLoading(state, resourceName) {
  return fromNetworkComms.isLoading(state && state.networkComms, resourceName);
}

export function commStatus(state, resourceName) {
  return fromNetworkComms.commStatus(state && state.networkComms, resourceName);
}

export function requestMessage(state, resourceName) {
  return fromNetworkComms.requestMessage(
    state && state.networkComms,
    resourceName
  );
}

export function timestampComms(state, resourceName) {
  return fromNetworkComms.timestampComms(
    state && state.networkComms,
    resourceName
  );
}

export function retryCount(state, resourceName) {
  return fromNetworkComms.retryCount(state && state.networkComms, resourceName);
}

export function allLoadingOrErrored(state) {
  return fromNetworkComms.allLoadingOrErrored(state && state.networkComms);
}

export function isLoadingAnyResource(state) {
  return fromNetworkComms.isLoadingAnyResource(state && state.networkComms);
}

export function suiteScriptTestConnectionStatus(
  state,
  resourceId,
  ssLinkedConnectionId
) {
  return fromSuiteScript.testConnectionStatus(
    state && state.suiteScript,
    resourceId,
    ssLinkedConnectionId
  );
}

export function suiteScriptTestConnectionMessage(
  state,
  resourceId,
  ssLinkedConnectionId
) {
  return fromSuiteScript.testConnectionMessage(
    state && state.suiteScript,
    resourceId,
    ssLinkedConnectionId
  );
}

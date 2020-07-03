import { combineReducers } from 'redux';
import ping, * as fromPing from './ping';

export default combineReducers({
  ping,
});

export function testConnectionStatus(state, resourceId, ssLinkedConnectionId) {
  return fromPing.testConnectionStatus(
    state && state.ping,
    resourceId,
    ssLinkedConnectionId
  );
}

export function testConnectionMessage(state, resourceId, ssLinkedConnectionId) {
  return fromPing.testConnectionMessage(
    state && state.ping,
    resourceId,
    ssLinkedConnectionId
  );
}

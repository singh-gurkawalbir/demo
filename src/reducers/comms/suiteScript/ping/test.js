/* global describe, test, expect */
import reducer, {PING_STATES, selectors} from '.';
import actions from '../../../../actions';

const initialState = {
  3: {4: {status: PING_STATES.SUCCESS }},
};

const ssLinkedConnectionId = '1';
const resourceId = '2';

describe('reducer test cases', () => {
  test('should set status to loading when test action is dispatched ', () => {
    const values = {a: 1};
    const state = reducer(initialState,
      actions.suiteScript.resource.connections.test(resourceId, values, ssLinkedConnectionId));

    expect(state).toEqual({
      3: {4: {status: PING_STATES.SUCCESS }},
      1: {2: {status: PING_STATES.LOADING}}});
  });

  test('should set the ping state to errored when ping errored action is dispatched', () => {
    const errorMsg = 'Some error';
    const state = reducer(initialState,
      actions.suiteScript.resource.connections.testErrored(resourceId, errorMsg, ssLinkedConnectionId));

    expect(state).toEqual({
      3: {4: {status: PING_STATES.SUCCESS }},
      1: { 2: {status: PING_STATES.ERROR, message: errorMsg}}});
  });
  test('should set the ping state to success when ping successful action is dispatched', () => {
    const state = reducer(initialState,
      actions.suiteScript.resource.connections.testSuccessful(
        resourceId, ssLinkedConnectionId));

    expect(state).toEqual({
      3: {4: {status: PING_STATES.SUCCESS }},
      1: {2: {status: PING_STATES.SUCCESS}}});
  });
  test('should set the status to aborted when aborted action is dispatched ', () => {
    const message = 'abortMessage';
    const state = reducer(initialState,
      actions.suiteScript.resource.connections.testCancelled(
        resourceId, message, ssLinkedConnectionId));

    expect(state).toEqual({
      3: {4: {status: PING_STATES.SUCCESS}},
      1: {2: {
        status: PING_STATES.ABORTED,
        message,
      }}});
  });
  test('should clear the complete state when clear is dispatched', () => {
    let state = reducer(initialState,
      actions.suiteScript.resource.connections.testSuccessful(
        resourceId, ssLinkedConnectionId));

    state = reducer(
      initialState,
      actions.suiteScript.resource.connections.testClear(
        resourceId, null, ssLinkedConnectionId));

    expect(state).toEqual({
      3: { 4: {status: PING_STATES.SUCCESS}},
    });
    // check if it build up state
    state = reducer(
      initialState,
      actions.suiteScript.resource.connections.test(
        resourceId, null, ssLinkedConnectionId));

    expect(state).toEqual({
      3: { 4: {status: PING_STATES.SUCCESS}},
      1: { 2: {status: PING_STATES.LOADING}},
    });
  });
  test('should clear just the message and retain when clear is dispatched with retainStatus set to true', () => {
    const errorMsg = 'error message';
    let state = reducer(initialState,
      actions.suiteScript.resource.connections.testErrored(
        resourceId, errorMsg, ssLinkedConnectionId));

    state = reducer(
      state,
      actions.suiteScript.resource.connections.testClear(
        resourceId, true, ssLinkedConnectionId));

    expect(state).toEqual({
      3: {4: {status: PING_STATES.SUCCESS}},
      1: { 2: {status: PING_STATES.ERROR}}});
  });

  describe('workflow', () => {
    test('ping process of suiteScript form should indicate states correctly ', () => {
      let state = reducer(initialState,
        actions.suiteScript.resource.connections.test(resourceId, {a: 1}, ssLinkedConnectionId));

      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(PING_STATES.LOADING);
      state = reducer(state,
        actions.suiteScript.resource.connections.testSuccessful(resourceId, ssLinkedConnectionId));
      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(PING_STATES.SUCCESS);
      state = reducer(state,
        actions.suiteScript.resource.connections.testClear(resourceId, null, ssLinkedConnectionId));
      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(null);
    });
    test('save process failing of a suiteScript form should indicate states correctly', () => {
      let state = reducer(initialState,
        actions.suiteScript.resource.connections.test(resourceId, {a: '1'}, ssLinkedConnectionId));

      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(PING_STATES.LOADING);
      state = reducer(state,
        actions.suiteScript.resource.connections.testErrored(resourceId, 'some error', ssLinkedConnectionId));
      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(PING_STATES.ERROR);
      state = reducer(state,
        actions.suiteScript.resource.connections.testClear(resourceId, null, ssLinkedConnectionId));
      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(null);
    });
  });
});

describe('selectors', () => {
  const badInputs = [
    // ssLinkedConnectionId, integrationId
    ['a', null],
    ['', null],
    [undefined, null],
  ];
  const error = 'some error';
  const state = reducer(initialState,
    actions.suiteScript.resource.connections.testErrored(resourceId, error, ssLinkedConnectionId));

  describe('suiteScriptTestConnectionStatus', () => {
    test('should pick up the ping status correctly', () => {
      expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId))
        .toEqual(PING_STATES.ERROR);
    });
    test('should return null for non existent state', () => {
      expect(selectors.suiteScriptTestConnectionStatus(state, '5', '6')).toEqual(null);
    });
    test.each(badInputs)('should return null for bad inputs resourceId %s ssLinkedConnectionId %s',
      (resourceId, ssLinkedConnectionId) => {
        expect(selectors.suiteScriptTestConnectionStatus(state, resourceId, ssLinkedConnectionId)).toEqual(null);
      });
  });
  describe('suiteScriptTestConnectionMessage', () => {
    test('should pick up the ping status correctly', () => {
      const error = 'some error';

      expect(selectors.suiteScriptTestConnectionMessage(state, resourceId, ssLinkedConnectionId))
        .toEqual(error);
    });
    test('should return null for non existent state', () => {
      expect(selectors.suiteScriptTestConnectionMessage(state, '5', '6')).toEqual(null);
    });
    test.each(badInputs)('should return null for bad inputs resourceId %s ssLinkedConnectionId %s',
      (resourceId, ssLinkedConnectionId) => {
        expect(selectors.suiteScriptTestConnectionMessage(state, resourceId, ssLinkedConnectionId)).toEqual(null);
      });
  });
});

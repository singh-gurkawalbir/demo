/* global describe, test, expect */
import reducer, { PING_STATES, selectors } from '.';
import actions from '../../../actions';

const invalidInputs = [null, undefined, ''];

// fabricates a test vector table for each action and its corresponding invalid inputs
const generateTestData = allActions => allActions.map(act => invalidInputs.map(input => [act.name, input, act.action])).flat();
const initialState = {
  2: { status: PING_STATES.SUCCESS},
};

describe('ping reducer', () => {
  const resId = 1;

  describe('invalid action payloads should not make any changes to the state and return default state ', () => {
    const allActions = [
      { name: 'actions.resource.connections.test', action: actions.resource.connections.test},
      { name: 'actions.resource.connections.testSuccessful', action: actions.resource.connections.testSuccessful},
      { name: 'actions.resource.connections.testClear', action: actions.resource.connections.testClear},
      { name: 'actions.resource.connections.testErrored', action: actions.resource.connections.testErrored},
      { name: 'actions.resource.connections.testCancelled', action: actions.resource.connections.testCancelled},
    ];

    test.each(generateTestData(allActions))('for action %s with resourceID %s should return initial state', (actionName, input, action) => {
      // checking for invalid resourceId input
      const newState = reducer(initialState, action(input));

      expect(newState).toEqual(initialState);
    });
  });

  test('should show loading state', () => {
    const newState = reducer(initialState, actions.resource.connections.test(resId));

    expect(newState).toEqual({1: {
      status: PING_STATES.LOADING,
    },
    2: { status: PING_STATES.SUCCESS},
    });
  });

  test('should show success state', () => {
    const newState = reducer(initialState, actions.resource.connections.testSuccessful(resId));

    expect(newState).toEqual({1: {
      status: PING_STATES.SUCCESS,
    },
    2: { status: PING_STATES.SUCCESS},
    });
  });
  test('should show errored state', () => {
    const error = 'error msg';
    const newState = reducer(initialState, actions.resource.connections.testErrored(resId, error));

    expect(newState).toEqual({1: {
      status: PING_STATES.ERROR,
      message: error,
    },
    2: { status: PING_STATES.SUCCESS},
    });
  });
  test('should show aborted state', () => {
    const abortedMsg = 'aborted msg';
    const newState = reducer(initialState, actions.resource.connections.testCancelled(resId, abortedMsg));

    expect(newState).toEqual({1: {
      status: PING_STATES.ABORTED,
      message: abortedMsg,
    },
    2: { status: PING_STATES.SUCCESS},
    });
  });

  describe('clear test state', () => {
    test('should clear test state', () => {
      const error = 'error msg';
      let newState = reducer(initialState, actions.resource.connections.testErrored(resId, error));

      expect(newState).toEqual({1: {
        status: PING_STATES.ERROR,
        message: error,
      },
      2: { status: PING_STATES.SUCCESS},
      });

      newState = reducer(newState, actions.resource.connections.testClear(resId));

      expect(newState).toEqual({
        2: { status: PING_STATES.SUCCESS},
      });
    });

    test('should clear just test message', () => {
      const error = 'error msg';
      let newState = reducer(initialState, actions.resource.connections.testErrored(resId, error));

      expect(newState).toEqual({1: {
        status: PING_STATES.ERROR,
        message: error,
      },
      2: { status: PING_STATES.SUCCESS},
      });
      newState = reducer(newState, actions.resource.connections.testClear(resId, true));
      expect(newState).toEqual({
        1: {status: PING_STATES.ERROR },
        2: { status: PING_STATES.SUCCESS},
      });
    });
  });
});

describe('selectors', () => {
  const error = 'error msg';
  const resId = '1';
  const newState = reducer(initialState, actions.resource.connections.testErrored(resId, error));

  describe('testConnectionStatus', () => {
    test('should return errored state for a valid id', () => {
      expect(selectors.testConnectionStatus(newState, resId)).toEqual(PING_STATES.ERROR);
    });
    test('should return null for non valid resource Id', () => {
      expect(selectors.testConnectionStatus(newState, 'someother resourceId')).toEqual(null);
    });
    test('should return null for a null or undefined resource Id', () => {
      expect(selectors.testConnectionStatus(newState, undefined)).toEqual(null);
      expect(selectors.testConnectionStatus(newState, null)).toEqual(null);
    });
  });
  describe('testConnectionMessage', () => {
    test('should return errored message for a valid id', () => {
      expect(selectors.testConnectionMessage(newState, resId)).toEqual(error);
    });
    test('should return null for non valid resource Id', () => {
      expect(selectors.testConnectionMessage(newState, 'someother resourceId')).toEqual(null);
    });

    test('should return null for a null or undefined resource Id', () => {
      expect(selectors.testConnectionMessage(newState, undefined)).toEqual(null);
      expect(selectors.testConnectionMessage(newState, null)).toEqual(null);
    });
  });
});

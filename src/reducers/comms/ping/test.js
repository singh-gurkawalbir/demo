/* global describe, test, expect */
import reducer, { PING_STATES, selectors } from '.';
import actions from '../../../actions';

describe('ping reducer', () => {
  const resId = 1;

  test('should no make any changes to the state when resourceId is invalid', () => {
    let newState = reducer(undefined, actions.resource.connections.test(null));

    expect(newState).toEqual({});

    newState = reducer(undefined, actions.resource.connections.testClear(undefined));

    expect(newState).toEqual({});

    newState = reducer(undefined, actions.resource.connections.testSuccessful(''));

    expect(newState).toEqual({});
  });

  test('should show loading state', () => {
    const newState = reducer(undefined, actions.resource.connections.test(resId));

    expect(newState).toEqual({1: {
      status: PING_STATES.LOADING,
    },
    });
  });

  test('should show success state', () => {
    const newState = reducer(undefined, actions.resource.connections.testSuccessful(resId));

    expect(newState).toEqual({1: {
      status: PING_STATES.SUCCESS,
    },
    });
  });
  test('should show errored state', () => {
    const error = 'error msg';
    const newState = reducer(undefined, actions.resource.connections.testErrored(resId, error));

    expect(newState).toEqual({1: {
      status: PING_STATES.ERROR,
      message: error,
    },
    });
  });
  test('should show aborted state', () => {
    const abortedMsg = 'aborted msg';
    const newState = reducer(undefined, actions.resource.connections.testCancelled(resId, abortedMsg));

    expect(newState).toEqual({1: {
      status: PING_STATES.ABORTED,
      message: abortedMsg,
    },
    });
  });

  describe('clear test state', () => {
    test('should clear test state', () => {
      const error = 'error msg';
      let newState = reducer(undefined, actions.resource.connections.testErrored(resId, error));

      expect(newState).toEqual({1: {
        status: PING_STATES.ERROR,
        message: error,
      },
      });

      newState = reducer(newState, actions.resource.connections.testClear(resId));

      expect(newState).toEqual({});
    });

    test('should clear just test message', () => {
      const error = 'error msg';
      let newState = reducer(undefined, actions.resource.connections.testErrored(resId, error));

      expect(newState).toEqual({1: {
        status: PING_STATES.ERROR,
        message: error,
      },
      });
      newState = reducer(newState, actions.resource.connections.testClear(resId, true));
      expect(newState).toEqual({1: {status: PING_STATES.ERROR } });
    });
  });
});

describe('selectors', () => {
  const error = 'error msg';
  const resId = '1';
  const newState = reducer(undefined, actions.resource.connections.testErrored(resId, error));

  describe('testConnectionStatus', () => {
    test('should return errored state for a valid id', () => {
      expect(selectors.testConnectionStatus(newState, resId)).toEqual(PING_STATES.ERROR);
    });
    test('should return null for non valid resource Id', () => {
      expect(selectors.testConnectionStatus(newState, 'someother resourceId')).toEqual(null);
    });
  });
  describe('testConnectionMessage', () => {
    test('should return errored message for a valid id', () => {
      expect(selectors.testConnectionMessage(newState, resId)).toEqual(error);
    });
    test('should return null for non valid resource Id', () => {
      expect(selectors.testConnectionMessage(newState, 'someother resourceId')).toEqual(null);
    });
  });
});

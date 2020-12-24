// TODO: Figure out how to configure the linter to ignore warnings about global
// references introduced by JEST. Witout the below exclusion in every test file,
// the linter precommit step will fail. ...and the IDE doesnt like the globals
// either.
/* global describe, test, expect */
import reducer, { COMM_STATES as STATES, selectors } from './index';
import actions from '../../../actions';
import commKeyGenerator from '../../../utils/commKeyGenerator';

// Reference: JEST "matcher" doc: https://jestjs.io/docs/en/using-matchers

describe('comms reducers', () => {
  const path = '/test/path/';
  const method = 'GET';
  const commKey = commKeyGenerator(path, method);

  describe('clear comms action ', () => {
    test('clear the comms part of the redux store', () => {
      const newState = reducer(undefined, actions.api.request(path, method));
      let completedApiActionState = reducer(
        newState,
        actions.api.complete(path, method)
      );
      const failedApiResourcePath = '/sisnifdif';

      completedApiActionState = reducer(
        completedApiActionState,
        actions.api.failure(failedApiResourcePath, method)
      );

      // now wipe out the comms store
      const wipedOutCommsState = reducer(
        completedApiActionState,
        actions.clearComms()
      );

      expect(wipedOutCommsState).not.toMatchObject({
        failedApiResourcePath: { loading: false },
      });
    });
  });

  describe('request action', () => {
    test('should set loading flag', () => {
      const newState = reducer(undefined, actions.api.request(path, method));

      expect(newState[commKey].status).toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, method));

      expect(state[commKey].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, method));

      expect(newState[commKey].retry).toBeUndefined();
    });
  });

  describe('completed action', () => {
    test('should clear loading flag', () => {
      const state = reducer(undefined, actions.api.request(path, method));

      expect(state[commKey].status).toBe(STATES.LOADING);

      const newState = reducer(state, actions.api.complete(path, method));

      expect(newState[commKey].status).not.toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, method));

      expect(state[commKey].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, method));

      expect(newState[commKey].retry).toBeUndefined();
    });
  });

  describe('failure action', () => {
    test('should set error message', () => {
      const state = reducer(
        undefined,
        actions.api.failure(path, method, 'error')
      );

      expect(state[commKey].message).toEqual('error');
    });
    test('should default an error message if none is provided in the action', () => {
      const state = reducer(undefined, actions.api.failure(path, method));

      expect(state[commKey].message).toEqual('unknown error');
    });
    test('should clear loading and retry count', () => {
      let state = reducer(undefined, actions.api.request(path, method));

      state = reducer(state, actions.api.retry(path, method));
      expect(state[commKey].status).toBe(STATES.LOADING);
      expect(state[commKey].retry).toBe(1);

      state = reducer(state, actions.api.failure(path, method, 'error'));

      expect(state[commKey].status).toBe(STATES.ERROR);
      expect(state[commKey].retry).toBeUndefined();
    });
  });

  describe('retry action', () => {
    test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, method));

      expect(state[commKey].retry).toBe(1);

      let newState = reducer(state, actions.api.retry(path, method));

      expect(newState[commKey].retry).toBe(2);

      newState = reducer(newState, actions.api.retry(path, method));

      expect(newState[commKey].retry).toBe(3);
    });
  });

  describe('clear comm by key', () => {
    test('should not change the state when key not found', () => {
      const state = reducer(undefined, 'some action');
      const newState = reducer(state, actions.clearCommByKey('something'));

      expect(newState).toEqual(state);
    });
    test('should remove the key from state', () => {
      const state = reducer(
        {
          something: { test: 'something' },
          somethingelse: { test: 'somethingelse' },
        },
        'some action'
      );
      const newState = reducer(state, actions.clearCommByKey('something'));

      expect(newState).toEqual({ somethingelse: { test: 'somethingelse' } });
    });
  });
});

describe('comms selectors', () => {
  const path = '/test/path';
  const method = 'GET';
  const commKey = commKeyGenerator(path, method);

  describe('commStatusByKey', () => {
    test('should return correct status', () => {
      const state = reducer(
        {
          'GET:/test': { something: 'something' },
        },

        'some action'
      );

      expect(selectors.commStatusByKey(state, 'GET:/test')).toEqual({
        something: 'something',
      });
    });
    test('should return undefined if key not found', () => {
      const state = reducer(
        {
          comms: {
            networkComms: {
              'GET:/test': { something: 'something' },
            },
          },
        },
        'some action'
      );

      expect(selectors.commStatusByKey(state, 'GET:/something')).toEqual(
        undefined
      );
    });
    test('should return undefined if state is undefined', () => {
      const state = reducer(undefined, 'some action');

      expect(selectors.commStatusByKey(state, 'GET:/something')).toEqual(
        undefined
      );
    });
  });

  describe('isLoading', () => {
    test('should be false on initial state', () => {
      const isLoading = selectors.isLoading(undefined, commKey);

      expect(isLoading).toBe(false);
    });

    test('should be true after request action', () => {
      const state = reducer(undefined, actions.api.request(path, method));
      const isLoading = selectors.isLoading(state, commKey);

      expect(isLoading).toBe(true);
    });

    test('should be false after received action', () => {
      const state = reducer(undefined, actions.resource.received(path));
      const isLoading = selectors.isLoading(state, commKey);

      expect(isLoading).toBe(false);
    });
  });
  describe('retryCount', () => {
    test('should be 0 on initial state', () => {
      const count = selectors.retryCount(undefined, commKey);

      expect(count).toBe(0);
    });

    test('should be 1 after first retry action', () => {
      const state = reducer(undefined, actions.api.retry(path, method));
      const count = selectors.retryCount(state, commKey);

      expect(count).toBe(1);
    });

    test('should increase by 1 after each retry action', () => {
      let state;

      for (let i = 1; i < 5; i += 1) {
        state = reducer(state, actions.api.retry(path, method));
        const count = selectors.retryCount(state, commKey);

        expect(count).toBe(i);
      }
    });
  });
});

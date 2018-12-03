// TODO: Figure out ho to configure the linter to ignore warnings about global
// references introduced by JEST. Witout the below exclusion in every test file,
// the linter precommit step will fail. ...and the IDE doesnt like the globals
// either.
/* global describe, test, expect */
import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import reducer, * as selectors from './';
import actions from '../../actions';

// Reference: JEST "matcher" doc: https://jestjs.io/docs/en/using-matchers

describe('comms reducers', () => {
  const path = '/test/path/';

  describe(`clear comms action `, () => {
    test('clear the comms part of the redux store', () => {
      const newState = reducer(undefined, actions.api.request(path));
      let completedApiActionState = reducer(
        newState,
        actions.api.complete(path)
      );
      const failedApiResourcePath = '/sisnifdif';

      completedApiActionState = reducer(
        completedApiActionState,
        actions.api.failure(failedApiResourcePath)
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
  describe(`request action`, () => {
    test('should set loading flag', () => {
      const newState = reducer(undefined, actions.api.request(path));

      expect(newState[path].loading).toBe(true);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path));

      expect(state[path].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path));

      expect(newState[path].retry).toBeUndefined();
    });
  });

  describe(`completed action`, () => {
    test('should clear loading flag', () => {
      const state = reducer(undefined, actions.api.request(path));

      expect(state[path].loading).toBe(true);

      const newState = reducer(state, actions.api.complete(path));

      expect(newState[path].loading).toBe(false);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path));

      expect(state[path].retry).toBe(1);

      const newState = reducer(state, actions.api.complete(path));

      expect(newState[path].retry).toBeUndefined();
    });
  });

  describe(`failure action`, () => {
    test('should set error message', () => {
      const state = reducer(undefined, actions.api.failure(path, 'error'));

      expect(state[path].error).toEqual('error');
    });

    test('should default an error message if none is provided in the action', () => {
      const state = reducer(undefined, actions.api.failure(path));

      expect(state[path].error).toEqual('unknown error');
    });
    test('should clear loading and retry count', () => {
      let state = reducer(undefined, actions.api.request(path));

      state = reducer(state, actions.api.retry(path));
      expect(state[path].loading).toBe(true);
      expect(state[path].retry).toBe(1);

      state = reducer(state, actions.api.failure(path, 'error'));

      expect(state[path].loading).toBe(false);
      expect(state[path].retry).toBeUndefined();
    });
  });

  describe(`retry action`, () => {
    test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path));

      expect(state[path].retry).toBe(1);

      let newState = reducer(state, actions.api.retry(path));

      expect(newState[path].retry).toBe(2);

      newState = reducer(newState, actions.api.retry(path));

      expect(newState[path].retry).toBe(3);
    });
  });
});

describe('comms selectors', () => {
  const path = '/test/path';

  describe(`isLoading`, () => {
    test('should be false on initial state', () => {
      const isLoading = selectors.isLoading(undefined, path);

      expect(isLoading).toBe(false);
    });

    test('should be true after request action', () => {
      const state = reducer(undefined, actions.api.request(path));
      const isLoading = selectors.isLoading(state, path);

      expect(isLoading).toBe(true);
    });

    test('should be false after received action', () => {
      const state = reducer(undefined, actions.resource.received(path));
      const isLoading = selectors.isLoading(state, path);

      expect(isLoading).toBe(false);
    });
  });
  describe(`retryCount`, () => {
    test('should be 0 on initial state', () => {
      const count = selectors.retryCount(undefined, path);

      expect(count).toBe(0);
    });

    test('should be 1 after first retry action', () => {
      const state = reducer(undefined, actions.api.retry(path));
      const count = selectors.retryCount(state, path);

      expect(count).toBe(1);
    });

    test('should increase by 1 after each retry action', () => {
      let state;

      for (let i = 1; i < 5; i += 1) {
        state = reducer(state, actions.api.retry(path));
        const count = selectors.retryCount(state, path);

        expect(count).toBe(i);
      }
    });
  });
  describe('allLoadingOrErrored', () => {
    test('should return null on bad state', () => {
      let result;

      result = selectors.allLoadingOrErrored(undefined);
      expect(result).toBeNull();

      result = selectors.allLoadingOrErrored(null);
      expect(result).toBeNull();

      result = selectors.allLoadingOrErrored(123);
      expect(result).toBeNull();

      result = selectors.allLoadingOrErrored('hello world');
      expect(result).toBeNull();

      result = selectors.allLoadingOrErrored(true);
      expect(result).toBeNull();
    });

    test('should return null on valid state, with no resource network activity', () => {
      const result = selectors.allLoadingOrErrored([]);

      expect(result).toBeNull();
    });

    test('should return null on valid state, with resource network activity but no pending loading or errors.', () => {
      let state;

      // assign
      state = reducer(state, actions.api.request(path));
      state = reducer(state, actions.api.complete(path));

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toBeNull();
    });

    test('should return proper result when 1 resource is loading.', () => {
      // assign
      const state = reducer(
        undefined,
        actions.api.request('exports', 'Loading Exports')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          message: 'Loading Exports',
          error: undefined,
          isLoading: true,
          name: 'exports',
          retryCount: 0,
          timestamp: expect.any(Number),
        },
      ]);
    });

    test('should return proper result when several resources are loading.', () => {
      // assign
      const pathA = `${path}/123`;
      const pathB = `${path}/456`;
      let state;

      state = reducer(
        state,
        actions.api.request(pathA, 'Some msg indicating loading of Resource')
      );
      state = reducer(
        state,
        actions.api.request(pathB, 'Some msg indicating loading of Resource')
      );

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          message: 'Some msg indicating loading of Resource',
          error: undefined,
          isLoading: true,
          name: pathA,
          retryCount: 0,
          timestamp: expect.any(Number),
        },
        {
          message: 'Some msg indicating loading of Resource',
          error: undefined,
          isLoading: true,
          name: pathB,
          retryCount: 0,
          timestamp: expect.any(Number),
        },
      ]);
    });

    test('should return proper result when a resource network call errored.', () => {
      // assign
      const state = reducer(
        undefined,
        actions.api.failure(path, 'my nice error')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          message: '',
          error: 'my nice error',
          isLoading: false,
          name: path,
          retryCount: 0,
          timestamp: expect.any(Number),
        },
      ]);
    });

    test('isComms selector taking long should not show the component only if any comms msg is transiting less than the network threshold', () => {
      advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

      const state = reducer(undefined, actions.api.request(path));

      advanceBy(5);

      expect(selectors.isCommsBelowNetworkThreshold(state)).toBe(true);

      advanceBy(20000); // advance sufficiently large time

      expect(selectors.isCommsBelowNetworkThreshold(state)).toBe(false);
      clear();
    });

    test('verify isComms selector for multiple resources', () => {
      advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

      let state = reducer(undefined, actions.api.request(path));

      state = reducer(state, actions.api.request('someotherResource'));

      advanceBy(50);

      expect(selectors.isCommsBelowNetworkThreshold(state)).toBe(true);
      state = reducer(state, actions.api.complete(path));
      expect(selectors.isCommsBelowNetworkThreshold(state)).toBe(true);

      advanceBy(20000); // advance sufficiently large time

      expect(selectors.isCommsBelowNetworkThreshold(state)).toBe(false);
      clear();
    });
  });
});

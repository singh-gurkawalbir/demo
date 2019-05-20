// TODO: Figure out ho to configure the linter to ignore warnings about global
// references introduced by JEST. Witout the below exclusion in every test file,
// the linter precommit step will fail. ...and the IDE doesnt like the globals
// either.
/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../actions';
import commPathGenerator from '../../utils/comPathGenerator';

// Reference: JEST "matcher" doc: https://jestjs.io/docs/en/using-matchers
const STATES = selectors.COMM_STATES;

describe('comms reducers', () => {
  const path = '/test/path/';
  const reqType = 'GET';

  describe(`clear comms action `, () => {
    test('clear the comms part of the redux store', () => {
      const newState = reducer(undefined, actions.api.request(path, reqType));
      let completedApiActionState = reducer(
        newState,
        actions.api.complete(path, reqType)
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
      const newState = reducer(undefined, actions.api.request(path, reqType));
      const genPath = commPathGenerator(path, reqType);

      expect(newState[genPath].status).toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, reqType));
      const genPath = commPathGenerator(path, reqType);

      expect(state[genPath].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, reqType));

      expect(newState[genPath].retry).toBeUndefined();
    });
  });

  describe(`completed action`, () => {
    test('should clear loading flag', () => {
      const state = reducer(undefined, actions.api.request(path, reqType));

      expect(state[path].status).toBe(STATES.LOADING);

      const newState = reducer(state, actions.api.request(path, reqType));

      expect(newState[path].status).not.toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, reqType));

      expect(state[path].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, reqType));

      expect(newState[path].retry).toBeUndefined();
    });
  });

  describe(`failure action`, () => {
    test('should set error message', () => {
      const state = reducer(
        undefined,
        actions.api.failure(path, reqType, 'error')
      );

      expect(state[path].message).toEqual('error');
    });
    test('should default an error message if none is provided in the action', () => {
      const state = reducer(undefined, actions.api.failure(path, reqType));

      expect(state[path].message).toEqual('unknown error');
    });
    test('should clear loading and retry count', () => {
      let state = reducer(undefined, actions.api.request(path, reqType));

      state = reducer(state, actions.api.retry(path, reqType));
      expect(state[path].status).toBe(STATES.LOADING);
      expect(state[path].retry).toBe(1);

      state = reducer(state, actions.api.failure(path, reqType, 'error'));

      expect(state[path].status).toBe(STATES.ERROR);
      expect(state[path].retry).toBeUndefined();
    });
  });

  describe(`retry action`, () => {
    test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, reqType));

      expect(state[path].retry).toBe(1);

      let newState = reducer(state, actions.api.retry(path, reqType));

      expect(newState[path].retry).toBe(2);

      newState = reducer(newState, actions.api.retry(path, reqType));

      expect(newState[path].retry).toBe(3);
    });
  });
});

describe('comms selectors', () => {
  const path = '/test/path';
  const reqType = 'GET';

  describe(`isLoading`, () => {
    test('should be false on initial state', () => {
      const isLoading = selectors.isLoading(undefined, path);

      expect(isLoading).toBe(false);
    });

    test('should be true after request action', () => {
      const state = reducer(undefined, actions.api.request(path, reqType));
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
      const state = reducer(undefined, actions.api.retry(path, reqType));
      const count = selectors.retryCount(state, path);

      expect(count).toBe(1);
    });

    test('should increase by 1 after each retry action', () => {
      let state;

      for (let i = 1; i < 5; i += 1) {
        state = reducer(state, actions.api.retry(path, reqType));
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
      state = reducer(state, actions.api.request(path, reqType));
      state = reducer(state, actions.api.request(path, reqType));

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toBeNull();
    });

    test('should return proper result when 1 resource is loading.', () => {
      // assign
      const state = reducer(
        undefined,
        actions.api.request('exports', reqType, 'Loading Exports')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          isHidden: false,
          message: 'Loading Exports',
          status: STATES.LOADING,
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
        actions.api.request(
          pathA,
          reqType,
          'Some msg indicating loading of Resource'
        )
      );
      state = reducer(
        state,
        actions.api.request(
          pathB,
          reqType,
          'Some msg indicating loading of Resource'
        )
      );

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          isHidden: false,
          message: 'Some msg indicating loading of Resource',
          status: STATES.LOADING,
          name: pathA,
          retryCount: 0,
          timestamp: expect.any(Number),
        },
        {
          isHidden: false,
          message: 'Some msg indicating loading of Resource',
          status: STATES.LOADING,
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
        actions.api.failure(path, reqType, 'my nice error')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          isHidden: false,
          message: 'my nice error',
          status: STATES.ERROR,
          name: path,
          retryCount: 0,
          timestamp: expect.any(Number),
        },
      ]);
    });
  });
});

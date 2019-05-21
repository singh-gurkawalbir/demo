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
  const reqMethod = 'GET';
  const commPath = commPathGenerator(path, reqMethod);

  describe(`clear comms action `, () => {
    test('clear the comms part of the redux store', () => {
      const newState = reducer(undefined, actions.api.request(path, reqMethod));
      let completedApiActionState = reducer(
        newState,
        actions.api.complete(path, reqMethod)
      );
      const failedApiResourcePath = '/sisnifdif';

      completedApiActionState = reducer(
        completedApiActionState,
        actions.api.failure(failedApiResourcePath, reqMethod)
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
      const newState = reducer(undefined, actions.api.request(path, reqMethod));

      expect(newState[commPath].status).toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, reqMethod));

      expect(state[commPath].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, reqMethod));

      expect(newState[commPath].retry).toBeUndefined();
    });
  });

  describe(`completed action`, () => {
    test('should clear loading flag', () => {
      const state = reducer(undefined, actions.api.request(path, reqMethod));

      expect(state[commPath].status).toBe(STATES.LOADING);

      const newState = reducer(state, actions.api.complete(path, reqMethod));

      expect(newState[commPath].status).not.toBe(STATES.LOADING);
    });

    test('should reset retry flag', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, reqMethod));

      expect(state[commPath].retry).toBe(1);

      const newState = reducer(state, actions.api.request(path, reqMethod));

      expect(newState[commPath].retry).toBeUndefined();
    });
  });

  describe(`failure action`, () => {
    test('should set error message', () => {
      const state = reducer(
        undefined,
        actions.api.failure(path, reqMethod, 'error')
      );

      expect(state[commPath].message).toEqual('error');
    });
    test('should default an error message if none is provided in the action', () => {
      const state = reducer(undefined, actions.api.failure(path, reqMethod));

      expect(state[commPath].message).toEqual('unknown error');
    });
    test('should clear loading and retry count', () => {
      let state = reducer(undefined, actions.api.request(path, reqMethod));

      state = reducer(state, actions.api.retry(path, reqMethod));
      expect(state[commPath].status).toBe(STATES.LOADING);
      expect(state[commPath].retry).toBe(1);

      state = reducer(state, actions.api.failure(path, reqMethod, 'error'));

      expect(state[commPath].status).toBe(STATES.ERROR);
      expect(state[commPath].retry).toBeUndefined();
    });
  });

  describe(`retry action`, () => {
    test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
      // force the retry value to be set...
      const state = reducer(undefined, actions.api.retry(path, reqMethod));

      expect(state[commPath].retry).toBe(1);

      let newState = reducer(state, actions.api.retry(path, reqMethod));

      expect(newState[commPath].retry).toBe(2);

      newState = reducer(newState, actions.api.retry(path, reqMethod));

      expect(newState[commPath].retry).toBe(3);
    });
  });
});

describe('comms selectors', () => {
  const path = '/test/path';
  const reqMethod = 'GET';
  const commPath = commPathGenerator(path, reqMethod);

  describe(`isLoading`, () => {
    test('should be false on initial state', () => {
      const isLoading = selectors.isLoading(undefined, commPath);

      expect(isLoading).toBe(false);
    });

    test('should be true after request action', () => {
      const state = reducer(undefined, actions.api.request(path, reqMethod));
      const isLoading = selectors.isLoading(state, commPath);

      expect(isLoading).toBe(true);
    });

    test('should be false after received action', () => {
      const state = reducer(undefined, actions.resource.received(path));
      const isLoading = selectors.isLoading(state, commPath);

      expect(isLoading).toBe(false);
    });
  });
  describe(`retryCount`, () => {
    test('should be 0 on initial state', () => {
      const count = selectors.retryCount(undefined, commPath);

      expect(count).toBe(0);
    });

    test('should be 1 after first retry action', () => {
      const state = reducer(undefined, actions.api.retry(path, reqMethod));
      const count = selectors.retryCount(state, commPath);

      expect(count).toBe(1);
    });

    test('should increase by 1 after each retry action', () => {
      let state;

      for (let i = 1; i < 5; i += 1) {
        state = reducer(state, actions.api.retry(path, reqMethod));
        const count = selectors.retryCount(state, commPath);

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
      state = reducer(state, actions.api.request(path, reqMethod));
      // check this action
      state = reducer(state, actions.api.complete(path, reqMethod));

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toBeNull();
    });

    test('should return proper result when 1 resource is loading.', () => {
      // assign
      const state = reducer(
        undefined,
        actions.api.request('exports', reqMethod, 'Loading Exports')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          isHidden: false,
          message: 'Loading Exports',
          status: STATES.LOADING,
          name: commPathGenerator('exports', reqMethod),
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
          reqMethod,
          'Some msg indicating loading of Resource'
        )
      );
      state = reducer(
        state,
        actions.api.request(
          pathB,
          reqMethod,
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
          name: commPathGenerator(pathA, reqMethod),
          retryCount: 0,
          timestamp: expect.any(Number),
        },
        {
          isHidden: false,
          message: 'Some msg indicating loading of Resource',
          status: STATES.LOADING,
          name: commPathGenerator(pathB, reqMethod),
          retryCount: 0,
          timestamp: expect.any(Number),
        },
      ]);
    });

    test('should return proper result when a resource network call errored.', () => {
      // assign
      const state = reducer(
        undefined,
        actions.api.failure(path, reqMethod, 'my nice error')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          isHidden: false,
          message: 'my nice error',
          status: STATES.ERROR,
          name: commPath,
          retryCount: 0,
          timestamp: expect.any(Number),
        },
      ]);
    });
  });
});

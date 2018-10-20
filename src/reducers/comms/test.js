// TODO: Figure out ho to configure the linter to ignore warnings about global
// references introduced by JEST. Witout the below exclusion in every test file,
// the linter precommit step will fail. ...and the IDE doesnt like the globals
// either.
/* global describe, test, expect */
import reducer, * as selectors from './';
import actions, { availableResources } from '../../actions';

// Reference: JEST "matcher" doc: https://jestjs.io/docs/en/using-matchers

// comms reducers and seletors also operate on the profile netowrk call...
const resourceTypes = [...availableResources, 'profile'];

describe('comms reducers', () => {
  resourceTypes.forEach(type => {
    describe(`${type} request action`, () => {
      test('should set loading flag', () => {
        const newState = reducer(undefined, actions.resource.request(type));

        expect(newState[type].loading).toBe(true);
      });

      test('should reset retry flag', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions.resource.retry(type));

        expect(state[type].retry).toBe(1);

        const newState = reducer(state, actions.resource.request(type));

        expect(newState[type].retry).toBeUndefined();
      });
    });

    describe(`${type} received action`, () => {
      test('should clear loading flag', () => {
        const state = reducer(undefined, actions.resource.request(type));

        expect(state[type].loading).toBe(true);

        const newState = reducer(state, actions.resource.received(type));

        expect(newState[type].loading).toBe(false);
      });

      test('should reset retry flag', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions.resource.retry(type));

        expect(state[type].retry).toBe(1);

        const newState = reducer(state, actions.resource.received(type));

        expect(newState[type].retry).toBeUndefined();
      });
    });

    describe(`${type} failure action`, () => {
      test('should set error message', () => {
        const state = reducer(
          undefined,
          actions.resource.failure(type, 'error')
        );

        expect(state[type].error).toEqual('error');
      });

      test('should default an error message if none is provided in the action', () => {
        const state = reducer(undefined, actions.resource.failure(type));

        expect(state[type].error).toEqual('unknown error');
      });
      test('should clear loading and retry count', () => {
        let state = reducer(undefined, actions.resource.request(type));

        state = reducer(state, actions.resource.retry(type));
        expect(state[type].loading).toBe(true);
        expect(state[type].retry).toBe(1);

        state = reducer(state, actions.resource.failure(type, 'error'));

        expect(state[type].loading).toBe(false);
        expect(state[type].retry).toBeUndefined();
      });
    });

    describe(`${type} retry action`, () => {
      test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions.resource.retry(type));

        expect(state[type].retry).toBe(1);

        let newState = reducer(state, actions.resource.retry(type));

        expect(newState[type].retry).toBe(2);

        newState = reducer(newState, actions.resource.retry(type));

        expect(newState[type].retry).toBe(3);
      });
    });
  });
});

describe('comms selectors', () => {
  resourceTypes.forEach(type => {
    describe(`${type} isLoading`, () => {
      test('should be false on initial state', () => {
        const isLoading = selectors.isLoading(undefined, type);

        expect(isLoading).toBe(false);
      });

      test('should be true after request action', () => {
        const state = reducer(undefined, actions.resource.request(type));
        const isLoading = selectors.isLoading(state, type);

        expect(isLoading).toBe(true);
      });

      test('should be false after received action', () => {
        const state = reducer(undefined, actions.resource.received(type));
        const isLoading = selectors.isLoading(state, type);

        expect(isLoading).toBe(false);
      });
    });
    describe(`${type} retryCount`, () => {
      test('should be 0 on initial state', () => {
        const count = selectors.retryCount(undefined, type);

        expect(count).toBe(0);
      });

      test('should be 1 after first retry action', () => {
        const state = reducer(undefined, actions.resource.retry(type));
        const count = selectors.retryCount(state, type);

        expect(count).toBe(1);
      });

      test('should increase by 1 after each retry action', () => {
        let state;

        for (let i = 1; i < 5; i += 1) {
          state = reducer(state, actions.resource.retry(type));
          const count = selectors.retryCount(state, type);

          expect(count).toBe(i);
        }
      });
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
      state = reducer(state, actions.resource.request('exports'));
      state = reducer(state, actions.resource.received('exports'));

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toBeNull();
    });

    test('should return proper result when 1 resource is loading.', () => {
      // assign
      const state = reducer(undefined, actions.resource.request('exports'));
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          error: undefined,
          isLoading: true,
          name: 'exports',
          retryCount: 0,
        },
      ]);
    });

    test('should return proper result when several resources are loading.', () => {
      // assign
      let state;

      state = reducer(state, actions.resource.request('exports'));
      state = reducer(state, actions.resource.request('imports'));

      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          error: undefined,
          isLoading: true,
          name: 'exports',
          retryCount: 0,
        },
        {
          error: undefined,
          isLoading: true,
          name: 'imports',
          retryCount: 0,
        },
      ]);
    });

    test('should return proper result when a resource network call errored.', () => {
      // assign
      const state = reducer(
        undefined,
        actions.resource.failure('exports', 'my nice error')
      );
      // act
      const result = selectors.allLoadingOrErrored(state);

      // assert
      expect(result).toEqual([
        {
          error: 'my nice error',
          isLoading: false,
          name: 'exports',
          retryCount: 0,
        },
      ]);
    });
  });
});

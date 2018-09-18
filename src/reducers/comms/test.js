/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../actions';

// TODO: the vsCode "jest" extension does not understand the Neutrino
// configuration so the built in IDE features do not work... :(
// we need to manually create/configure babel config file to replicate what
// Neutrino has set-up

// "matcher" reference: https://jestjs.io/docs/en/using-matchers

// TODO: as more resource types come "online" in our app, we need to keep
// the below const up-to-date-. Maybe move this const to actions...
const resources = ['exports', 'imports', 'connections'];

describe('comms reducers', () => {
  resources.forEach(resource => {
    describe(`${resource} request action`, () => {
      test('should set loading flag', () => {
        const newState = reducer(undefined, actions[resource].request());

        expect(newState[resource].loading).toBe(true);
      });

      test('should reset retry flag', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions[resource].retry());

        expect(state[resource].retry).toBe(1);

        const newState = reducer(state, actions[resource].request());

        expect(newState[resource].retry).toBeUndefined();
      });
    });

    describe(`${resource} received action`, () => {
      test('should clear loading flag', () => {
        const state = reducer(undefined, actions[resource].request());

        expect(state[resource].loading).toBe(true);

        const newState = reducer(state, actions[resource].received());

        expect(newState[resource].loading).toBe(false);
      });

      test('should reset retry flag', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions[resource].retry());

        expect(state[resource].retry).toBe(1);

        const newState = reducer(state, actions[resource].received());

        expect(newState[resource].retry).toBeUndefined();
      });
    });

    describe(`${resource} received action`, () => {
      test('should clear loading flag', () => {
        const state = reducer(undefined, actions[resource].request());

        expect(state[resource].loading).toBe(true);

        const newState = reducer(state, actions[resource].received());

        expect(newState[resource].loading).toBe(false);
      });

      test('should reset retry flag', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions[resource].retry());

        expect(state[resource].retry).toBe(1);

        const newState = reducer(state, actions[resource].received());

        expect(newState[resource].retry).toBeUndefined();
      });
    });

    describe(`${resource} retry action`, () => {
      test('should start retryCount at 1 and increment by 1 for each subsequent call', () => {
        // force the retry value to be set...
        const state = reducer(undefined, actions[resource].retry());

        expect(state[resource].retry).toBe(1);

        let newState = reducer(state, actions[resource].retry());

        expect(newState[resource].retry).toBe(2);

        newState = reducer(newState, actions[resource].retry());

        expect(newState[resource].retry).toBe(3);
      });
    });
  });
});

describe('comms selectors', () => {
  resources.forEach(resource => {
    describe(`${resource} isLoading`, () => {
      test('should be false on initial state', () => {
        const isLoading = selectors.isLoading(undefined, resource);

        expect(isLoading).toBe(false);
      });

      test('should be true after request action', () => {
        const state = reducer(undefined, actions[resource].request());
        const isLoading = selectors.isLoading(state, resource);

        expect(isLoading).toBe(true);
      });

      test('should be false after received action', () => {
        const state = reducer(undefined, actions[resource].received());
        const isLoading = selectors.isLoading(state, resource);

        expect(isLoading).toBe(false);
      });
    });
    describe(`${resource} retryCount`, () => {
      test('should be 0 on initial state', () => {
        const count = selectors.retryCount(undefined, resource);

        expect(count).toBe(0);
      });

      test('should be 1 after first retry action', () => {
        const state = reducer(undefined, actions[resource].retry());
        const count = selectors.retryCount(state, resource);

        expect(count).toBe(1);
      });

      test('should increase by 1 after each retry action', () => {
        let state;

        for (let i = 1; i < 5; i += 1) {
          state = reducer(state, actions[resource].retry());
          const count = selectors.retryCount(state, resource);

          expect(count).toBe(i);
        }
      });
    });
  });
});

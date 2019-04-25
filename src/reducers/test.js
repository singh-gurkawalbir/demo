/* global describe, test, expect */
import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import reducer, * as selectors from './';
import actions from '../actions';

describe('global selectors', () => {
  describe(`isProfileDataReady`, () => {
    test('should return false on bad or empty state.', () => {
      expect(selectors.isProfileDataReady()).toBe(false);
      expect(selectors.isProfileDataReady({})).toBe(false);
      expect(selectors.isProfileDataReady({ session: {} })).toBe(false);
    });

    test('should return true when profile exists.', () => {
      const state = reducer(
        undefined,
        actions.resource.received('mock profile')
      );

      expect(selectors.isProfileDataReady(state)).toBe(true);
    });
  });

  describe('resourceData', () => {
    test('should return {} on bad state or args.', () => {
      expect(selectors.resourceData()).toEqual({});
      expect(selectors.resourceData({})).toEqual({});
      expect(selectors.resourceData({ data: {} })).toEqual({});
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        hash: -1092997807,
        merged: exports[0],
        staged: undefined,
        master: exports[0],
      });
    });

    test('should return correct data when staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        hash: 1201750584,
        merged: { _id: 1, name: 'patch X' },
        patch,
        master: exports[0],
      });
    });
  });
  describe('resourceStatus ', () => {
    describe('GET resource calls ', () => {
      test('should correctly indicate the resource is not Ready for a loading resource call', () => {
        const state = reducer(
          undefined,
          actions.api.request('/exports', 'some message')
        );

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is not Ready for a failed resource call', () => {
        let state = reducer(
          undefined,
          actions.api.request('/exports', 'some message')
        );

        state = reducer(state, actions.api.failure('/exports'));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is Ready for a success resource call and has data', () => {
        let state = reducer(
          undefined,
          actions.resource.receivedCollection('exports', { data: 'something' })
        );

        state = reducer(state, actions.api.request('/exports', 'some message'));
        state = reducer(state, actions.api.complete('/exports'));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
      });
    });
    test('should correctly indicate the resource is ready for a non-GET resource call', () => {
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', { data: 'something' })
      );

      state = reducer(
        state,
        actions.api.request('/exports', 'some message', true, 'POST')
      );
      state = reducer(state, actions.api.complete('/exports'));
      expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
    });
  });
});
describe('authentication selectors', () => {
  test('isAuthInitialized selector should be false when the app loads for the very first time and subsequently should be sucessfully set to true for auth failure or success', () => {
    const initiaizedState = reducer(undefined, { type: null });

    expect(selectors.isAuthInitialized(initiaizedState)).toBe(false);

    const authSucceededState = reducer(
      initiaizedState,
      actions.auth.complete()
    );

    expect(selectors.isAuthInitialized(authSucceededState)).toBe(true);
    const authFailedState = reducer(initiaizedState, actions.auth.failure());

    expect(selectors.isAuthInitialized(authFailedState)).toBe(true);
  });

  test('isUserLoggedIn selector should be set to false when the user logs out and for any other state it should be set to true ', () => {
    const initiaizedState = reducer(undefined, { type: null });

    expect(selectors.isUserLoggedIn(initiaizedState)).toBe(true);
    // the user logout saga ultimately disptaches a clear store action
    const loggedOutState = reducer(initiaizedState, actions.auth.clearStore());

    expect(selectors.isUserLoggedIn(loggedOutState)).toBe(false);
  });

  describe('isAuthStateStable selector', () => {
    //  when the app is intializing isAuthStateStable selctor
    // should be set to false but ultimately set to
    // true when authentication cookie test succeeds or fails
    test('should be false during app initialization but set to true after the auth test ', () => {
      const initiaizedState = reducer(undefined, { type: null });

      expect(selectors.isAuthStateStable(initiaizedState)).toBe(false);

      const authStateSucceeded = reducer(
        initiaizedState,
        actions.auth.complete()
      );

      expect(selectors.isAuthStateStable(authStateSucceeded)).toBe(true);

      const authStateFailed = reducer(initiaizedState, actions.auth.failure());

      expect(selectors.isAuthStateStable(authStateFailed)).toBe(true);
    });
    // when the user is logged out, that may falsely be construed as a loading
    // state hence signin route will never show up, so isAuthStateStable
    // should be true
    test('should be true whe the user is logged out', () => {
      const authStateSucceeded = reducer(undefined, actions.auth.complete());

      expect(selectors.isAuthStateStable(authStateSucceeded)).toBe(true);

      const userLogoutState = reducer(
        authStateSucceeded,
        actions.auth.logout()
      );

      // now signin route gets rendered
      expect(selectors.isAuthStateStable(userLogoutState)).toBe(true);
    });
  });
});
describe('Reducers in the root reducer', () => {
  test('should wipe out the redux store in a user logout action', () => {
    const someInitialState = {
      profile: { email: 'sds' },
    };
    const state = reducer(someInitialState, actions.auth.clearStore());

    expect(state).toEqual({});
  });
});

describe('Comm selector to verify comms exceeding threshold', () => {
  const path = '/somePath';

  test('selector taking long should not show the component only if any comms msg is transiting less than the network threshold', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    const state = reducer(undefined, actions.api.request(path));

    advanceBy(5);

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(true);
    clear();
  });
  test('verify comm selector for multiple resources', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    let state = reducer(undefined, actions.api.request(path));

    state = reducer(state, actions.api.request('someotherResource'));

    advanceBy(50);

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);
    state = reducer(state, actions.api.complete(path));
    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(true);
    clear();
  });
});

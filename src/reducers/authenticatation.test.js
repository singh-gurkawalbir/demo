/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';

describe('aunthentication region selector testcases', () => {
  describe('selectors.isAuthenticated test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAuthenticated()).toBe(false);
    });
  });

  describe('selectors.isDefaultAccountSet test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDefaultAccountSet(false)).toBe(false);
    });
  });

  describe('selectors.isAuthInitialized test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAuthInitialized(undefined, {})).toBe(false);
    });
    test('isAuthInitialized selector should be false when the app loads for the very first time and subsequently should be successfully set to true for auth failure or success', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.isAuthInitialized(initializedState)).toBe(false);

      const authSucceededState = reducer(
        initializedState,
        actions.auth.complete()
      );

      expect(selectors.isAuthInitialized(authSucceededState)).toBe(true);
      const authFailedState = reducer(initializedState, actions.auth.failure());

      expect(selectors.isAuthInitialized(authFailedState)).toBe(true);
    }); test('isAuthInitialized selector should be false when the app loads for the very first time and subsequently should be successfully set to true for auth failure or success', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.isAuthInitialized(initializedState)).toBe(false);

      const authSucceededState = reducer(
        initializedState,
        actions.auth.complete()
      );

      expect(selectors.isAuthInitialized(authSucceededState)).toBe(true);
      const authFailedState = reducer(initializedState, actions.auth.failure());

      expect(selectors.isAuthInitialized(authFailedState)).toBe(true);
    });
  });

  describe('selectors.isUserLoggedInDifferentTab test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isUserLoggedInDifferentTab()).toBe(false);
    });
  });

  describe('selectors.authenticationErrored test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.authenticationErrored(undefined, {})).toEqual();
    });
  });

  describe('selectors.isUserLoggedOut test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isUserLoggedOut()).toEqual(false);
    });
    test('isUserLoggedOut selector should be set to true when the user logs out and for any other state it should be set to false ', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.isUserLoggedOut(initializedState)).toBe(false);
      // the user logout saga ultimately dispatches a clear store action
      const loggedOutState = reducer(initializedState, actions.auth.clearStore());

      expect(selectors.isUserLoggedOut(loggedOutState)).toBe(true);
    });
  });

  describe('selectors.isDefaultAccountSetAfterAuth test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDefaultAccountSetAfterAuth(undefined, {})).toEqual(true);
    });
  });

  describe('selectors.shouldShowAppRouting test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.shouldShowAppRouting(undefined, {})).toEqual(true);
    });
    //  when the app is initalizing shouldShowAppRouting selector
    // should be set to false but ultimately set to
    // true when authentication cookie test succeeds or fails
    test('should be false during app initialization but set to true after a successful auth test success and after user account being set', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initializedState)).toBe(false);
      // let the app make auth request test
      const authStateLoading = reducer(
        initializedState,
        actions.auth.request()
      );

      // we are loading so lets hold of on rendering
      expect(selectors.shouldShowAppRouting(authStateLoading)).toBe(false);

      const authStateSucceeded = reducer(
        initializedState,
        actions.auth.complete()
      );

      // the user has been successfully authenticated but lets still hold off
      // rendering the app
      expect(selectors.shouldShowAppRouting(authStateSucceeded)).toBe(false);

      const defaultAccountSet = reducer(
        authStateSucceeded,
        actions.auth.defaultAccountSet()
      );

      expect(selectors.shouldShowAppRouting(defaultAccountSet)).toBe(true);
    });

    test('should be true after authentication failure test irrespective if account set or not', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initializedState)).toBe(false);

      const authStateFailed = reducer(initializedState, actions.auth.failure());

      expect(selectors.shouldShowAppRouting(authStateFailed)).toBe(true);
      // the state can never occur because of how it is sequenced in the saga
      // nevertheless we should still show something to the user
      const defaultAccountSet = reducer(
        authStateFailed,
        actions.auth.defaultAccountSet()
      );

      expect(selectors.shouldShowAppRouting(defaultAccountSet)).toBe(true);
    });
    // when the user is logged out, that may falsely be construed as a loading
    // state hence signin route will never show up, so shouldShowAppRouting
    // should be true
    test('should be true whe the user is logged out', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initializedState)).toBe(false);

      const authStateSucceeded = reducer(
        initializedState,
        actions.auth.complete()
      );
      const defaultAccountSet = reducer(
        authStateSucceeded,
        actions.auth.defaultAccountSet()
      );

      expect(selectors.shouldShowAppRouting(defaultAccountSet)).toBe(true);

      // In this test case the user saga ultimately dispatches
      // a clearStore action we are using that to emulate a logout
      const userLogoutState = reducer(
        authStateSucceeded,
        actions.auth.clearStore()
      );

      // now signin route gets rendered
      expect(selectors.shouldShowAppRouting(userLogoutState)).toBe(true);
    });
  });

  describe('selectors.isSessionExpired test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isSessionExpired(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.sessionValidTimestamp test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.sessionValidTimestamp()).toEqual();
    });
  });
});


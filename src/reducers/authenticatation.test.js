/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';

describe('aunthentication region selector testcases', () => {
  describe('selectors.isAuthenticated test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAuthenticated()).toBe(false);
    });
    test('should return true if authentication is complete', () => {
      const initializedState = reducer(undefined, { type: null });
      const state = reducer(initializedState, actions.auth.complete());

      expect(selectors.isAuthenticated(state)).toBe(true);
    });
    test('should return false if the app is being authenticated or authentication failed', () => {
      const initializedState = reducer(undefined, { type: null });
      const state1 = reducer(initializedState, actions.auth.request());

      expect(selectors.isAuthenticated(state1)).toBe(false);
      const state2 = reducer(state1, actions.auth.failure());

      expect(selectors.isAuthenticated(state2)).toBe(false);
    });
  });

  describe('selectors.isDefaultAccountSet test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDefaultAccountSet(false)).toBe(false);
    });
    test('should return true if defaultAccount is set in any other case is false', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.isDefaultAccountSet(initializedState)).toBe(false);
      const state1 = reducer(initializedState, actions.auth.complete());

      expect(selectors.isDefaultAccountSet(initializedState)).toBe(false);
      const state2 = reducer(state1, actions.auth.defaultAccountSet());

      expect(selectors.isDefaultAccountSet(state2)).toBe(true);
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
    test('should return true when already authenticated user tries to open app in different tab', () => {
      const initializedState = reducer(undefined, { type: null });
      const state1 = reducer(initializedState, actions.auth.complete());

      expect(selectors.isUserLoggedInDifferentTab(state1)).toBe(false);

      const state2 = reducer(state1, actions.auth.userAlreadyLoggedIn());

      expect(selectors.isUserLoggedInDifferentTab(state2)).toBe(true);
    });
  });

  describe('selectors.authenticationErrored test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.authenticationErrored(undefined, {})).toEqual();
    });
    test('should return true', () => {
      const state = {
        auth: {
          failure: true,
        },
      };

      expect(selectors.authenticationErrored(state)).toEqual(true);
    });
    test('should return false', () => {
      const state = {
        auth: {
          failure: false,
        },
      };

      expect(selectors.authenticationErrored(state)).toEqual(false);
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

    const authStateLoading = reducer(undefined, actions.auth.request());

    test('should return false if the app is being authenticated', () => {
      expect(selectors.isDefaultAccountSetAfterAuth(authStateLoading)).toEqual(false);
    });

    const authStateSucceeded = reducer(authStateLoading, actions.auth.complete());

    test('should return false if app is authenticated and default account is not set', () => {
      expect(selectors.isDefaultAccountSetAfterAuth(authStateSucceeded)).toEqual(false);
    });

    const defaultAccountSetState = reducer(authStateSucceeded, actions.auth.defaultAccountSet());

    test('should return true if app is authenticated and default account is set', () => {
      expect(selectors.isDefaultAccountSetAfterAuth(defaultAccountSetState)).toEqual(true);
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

    test('should return true only if the user is already authenticated and the app fails otherwise it is false', () => {
      const authStateLoading = reducer(undefined, actions.auth.request());

      expect(selectors.isSessionExpired(authStateLoading)).toEqual(false);

      const authStateSucceeded = reducer(authStateLoading, actions.auth.complete());

      expect(selectors.isSessionExpired(authStateSucceeded)).toEqual(false);
      const authStateFailed = reducer(authStateSucceeded, actions.auth.failure());

      expect(selectors.isSessionExpired(authStateFailed)).toEqual(true);
    });
  });

  describe('selectors.sessionValidTimestamp test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.sessionValidTimestamp()).toEqual(false);
    });
    test('should return false when there the authTimeStamp is not updated in state', () => {
      expect(selectors.sessionValidTimestamp({})).toEqual(false);
    });
    test('should return true when authTimeStamp is updated', () => {
      const state = reducer(undefined, actions.auth.sessionTimestamp());

      expect(selectors.sessionValidTimestamp(state)).toEqual(true);
    });
  });
});


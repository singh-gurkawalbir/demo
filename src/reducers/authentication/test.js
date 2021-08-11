/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../actions';
import { COMM_STATES } from '../comms/networkComms';

describe('authentication reducers', () => {
  test('any other action return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual({
      initialized: false,
      commStatus: COMM_STATES.LOADING,
    });
  });

  test('any other action return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  describe('authentication request', () => {
    test('should set commStatus to loading and authentication to false', () => {
      const newState = reducer(undefined, actions.auth.request());

      expect(newState).toEqual({
        initialized: false,
        commStatus: COMM_STATES.LOADING,
        authenticated: false,
      });
    });
  });

  describe('authentication successful', () => {
    test('should set the commStatus to success and authentication to true', () => {
      const newState = reducer(undefined, actions.auth.complete());

      expect(newState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.SUCCESS,
        authenticated: true,
      });
    });

    test('should generate the same exact state even after two complete auth actions', () => {
      const newState = reducer(undefined, actions.auth.complete());
      const finalState = reducer(newState, actions.auth.complete());

      expect(finalState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.SUCCESS,
        authenticated: true,
      });
    });

    test('if the sessionExpired modal shows up, subsequently going through a successful auth cycle should clear isSessionExpired', () => {
      const someFailureMsg = 'Error';
      // user is previously authenticated
      const authenticatedState = reducer(undefined, actions.auth.complete());
      // but due to an expired session comm's activity the modal shows up
      const authenticationFailureState = reducer(
        authenticatedState,
        actions.auth.failure(someFailureMsg)
      );
      // reauthentication
      const authRequestState = reducer(
        authenticationFailureState,
        actions.auth.request()
      );
      const successfulAuthenticatedState = reducer(
        authRequestState,
        actions.auth.complete()
      );

      expect(successfulAuthenticatedState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.SUCCESS,
        authenticated: true,
      });
    });
    test('in an authRequest action showAuthError property should get deleted through an authentication success cycle', () => {
      const state = reducer(undefined, actions.auth.request(null, null, true));

      expect(state).toEqual({
        initialized: false,
        commStatus: COMM_STATES.LOADING,
        authenticated: false,
        showAuthError: true,
      });
      const newState = reducer(
        state,
        actions.auth.complete()
      );

      expect(newState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.SUCCESS,
        authenticated: true,
      });
    });
  });

  describe('authentication failure', () => {
    test('should set commStatus to error and authentication to false', () => {
      const someFailureMsg = 'Error';
      const newState = reducer(undefined, actions.auth.failure(someFailureMsg));

      expect(newState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.ERROR,
        authenticated: false,
        failure: someFailureMsg,
      });
    });

    test('previously authenticated user should set authDialog to true when ever a auth failure is encountered ', () => {
      const someFailureMsg = 'Error';
      const authenticatedState = reducer(undefined, actions.auth.complete());
      const newState = reducer(
        authenticatedState,
        actions.auth.failure(someFailureMsg)
      );

      expect(newState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.ERROR,
        authenticated: false,
        sessionExpired: true,
        failure: someFailureMsg,
      });
    });

    test('in an authRequest action showAuthError property should propagate through an authentication failure cycle', () => {
      const someFailureMsg = 'Error';
      const state = reducer(undefined, actions.auth.request(null, null, true));

      const newState = reducer(
        state,
        actions.auth.failure(someFailureMsg)
      );

      expect(newState).toEqual({
        initialized: true,
        commStatus: COMM_STATES.ERROR,
        authenticated: false,
        showAuthError: true,
        failure: someFailureMsg,
      });
    });
  });
});

describe('auth selectors', () => {
  describe('isAuthLoading', () => {
    const state = reducer(undefined, actions.auth.request());

    test('should return true during an authentication request ', () => {
      expect(selectors.isAuthLoading(state)).toBe(true);
    });
    test('should return false during an authentication terminal state either failure or success', () => {
      const failureState = reducer(state, actions.auth.failure());

      expect(selectors.isAuthLoading(failureState)).toBe(false);

      const successState = reducer(state, actions.auth.complete());

      expect(selectors.isAuthLoading(successState)).toBe(false);
    });
  });

  describe('isAuthenticating', () => {
    const state = reducer(undefined, actions.auth.request());

    test('should return true during an authentication request ', () => {
      expect(selectors.isAuthenticating(state)).toBe(true);
    });

    describe('logout', () => {
      const logoutState = reducer(state, actions.auth.clearStore());

      test('should return false during a logout ', () => {
        expect(selectors.isAuthenticating(logoutState)).toBe(false);
      });

      test('should return true during authentication after logout ', () => {
        const authRequestState = reducer(logoutState, actions.auth.request());

        expect(selectors.isAuthenticating(authRequestState)).toBe(true);
      });
    });
    describe('session expiration modal', () => {
      const someFailureMsg = 'Error';

      // user is previously authenticated
      const authenticatedState = reducer(undefined, actions.auth.complete());
      // but due to an expired session comm's activity the modal shows up
      const authenticationFailureState = reducer(
        authenticatedState,
        actions.auth.failure(someFailureMsg)
      );
      // reauthentication
      const authRequestState = reducer(
        authenticationFailureState,
        actions.auth.request()
      );

      test('should return true during authentication after sessionExpiration ', () => {
        expect(selectors.isAuthenticating(authRequestState)).toBe(true);
      });

      test('should return false after authentication enters a terminal state during sessionExpiration', () => {
        const authenticationFailureState = reducer(
          authRequestState,
          actions.auth.failure(someFailureMsg)
        );

        expect(selectors.isAuthenticating(authenticationFailureState)).toBe(false);

        const authenticationCompleteState = reducer(
          authRequestState,
          actions.auth.complete()
        );

        expect(selectors.isAuthenticating(authenticationCompleteState)).toBe(false);
      });
    });
  });

  describe('showAuthError', () => {
    test('during an authenticaton failure cycle the showAuthError property should propagate all the way through', () => {
      const state = reducer(undefined, actions.auth.request(null, null, true));

      expect(selectors.showAuthError(state)).toBe(true);

      const failureState = reducer(
        state,
        actions.auth.failure()
      );

      expect(selectors.showAuthError(failureState)).toBe(true);
    });

    test('during an authenticaton success cycle the showAuthError property should be deleted as there will not be any error', () => {
      const state = reducer(undefined, actions.auth.request(null, null, true));

      expect(selectors.showAuthError(state)).toBe(true);

      const failureState = reducer(
        state,
        actions.auth.complete()
      );

      expect(selectors.showAuthError(failureState)).not.toBeTruthy();
    });
  });

  describe('showAuthError', () => {
    describe('warning state', () => {
      test('should return warning when auth warning action is dispatched', () => {
      // after auth completes
        let state = reducer(undefined, actions.auth.complete());

        // no status yet
        expect(selectors.showSessionStatus(state)).toBe(undefined);

        // after auth warning dispatched
        state = reducer(state, actions.auth.warning());

        expect(selectors.showSessionStatus(state)).toBe('warning');
      });
    });

    describe('expired state', () => {
      test('should return expired when session has expired ', () => {
      // after auth completes
        let state = reducer(undefined, actions.auth.complete());

        // no status yet
        expect(selectors.showSessionStatus(state)).toBe(undefined);

        // after auth warning dispatched
        state = reducer(state, actions.auth.failure());

        expect(selectors.showSessionStatus(state)).toBe('expired');
      });

      test('should ignore subsequent warning auth actions because user is no longer authenticated', () => {
      // after auth completes
        let state = reducer(undefined, actions.auth.complete());

        // no status yet
        expect(selectors.showSessionStatus(state)).toBe(undefined);

        // after auth warning dispatched
        state = reducer(state, actions.auth.failure());

        expect(selectors.showSessionStatus(state)).toBe('expired');
        state = reducer(state, actions.auth.warning());

        // should not show warning and ignore authentication warning action
        expect(selectors.showSessionStatus(state)).toBe('expired');
      });
    });
  });
});

/* global describe, test, expect */
import reducer from './';
import actions from '../../actions';

describe('authentication reducers', () => {
  test('any other action return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual({ loading: true });
  });

  test('any other action return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  describe('authentication request', () => {
    test('should set loading flag to true and authentication to false', () => {
      const newState = reducer(undefined, actions.auth.request());

      expect(newState).toEqual({
        loading: true,
        authenticated: false,
      });
    });
  });

  describe('authentication successful', () => {
    test('should set loading flag to false and authentication to true', () => {
      const newState = reducer(undefined, actions.auth.complete());

      expect(newState).toEqual({
        loading: false,
        authenticated: true,
      });
    });

    test('should generate the same exact state even after two complete auth actions', () => {
      const newState = reducer(undefined, actions.auth.complete());
      const finalState = reducer(newState, actions.auth.complete());

      expect(finalState).toEqual({
        loading: false,
        authenticated: true,
      });
    });

    test('and modal sessionExpired modal shows up then going through a successful auth cycle show clear isSessionExpired', () => {
      const someFailureMsg = 'Error';
      const authenticatedState = reducer(undefined, actions.auth.complete());
      const authenticationFailureState = reducer(
        authenticatedState,
        actions.auth.failure(someFailureMsg)
      );
      const authRequestState = reducer(
        authenticationFailureState,
        actions.auth.request()
      );
      const sucessfulAuthenticatedState = reducer(
        authRequestState,
        actions.auth.complete()
      );

      expect(sucessfulAuthenticatedState).toEqual({
        loading: false,
        authenticated: true,
      });
    });
  });

  describe('authentication failure', () => {
    test('should set loading flag to false and authentication to true', () => {
      const someFailureMsg = 'Error';
      const newState = reducer(undefined, actions.auth.failure(someFailureMsg));

      expect(newState).toEqual({
        loading: false,
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
        loading: false,
        authenticated: false,
        sessionExpired: true,
        failure: someFailureMsg,
      });
    });
  });
});

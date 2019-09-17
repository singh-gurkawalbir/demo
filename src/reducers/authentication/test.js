/* global describe, test, expect */
import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import reducer, * as selectors from './';
import actions from '../../actions';
import { COMM_STATES } from '../comms';

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
      const authRequestState = reducer(
        authenticationFailureState,
        actions.auth.request()
      );
      const sucessfulAuthenticatedState = reducer(
        authRequestState,
        actions.auth.complete()
      );

      expect(sucessfulAuthenticatedState).toEqual({
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
  });
});

describe('authentication selectors', () => {
  // 2 minutes prior interval
  process.env.SESSION_EXPIRATION_INTERVAL = 10;
  process.env.SESSION_WARNING_INTERVAL_PRIOR_TO_EXPIRATION = 3;
  // one hour expiration interval

  test('should return a `warning` when reaching the warning interval and subsequently an `expired` when exceeding the expiration interval ', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.
    let newState = reducer(undefined, actions.auth.complete());

    newState = reducer(newState, actions.auth.sessionTimestamp());

    expect(selectors.showSessionStatus(newState, Date.now())).toEqual();

    advanceBy(8);
    expect(selectors.showSessionStatus(newState, Date.now())).toEqual(
      'warning'
    );
    advanceBy(3);

    expect(selectors.showSessionStatus(newState, Date.now())).toEqual(
      'expired'
    );

    clear();
  });

  test('should return an `expired` when the session expires irrespective of the time state  ', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.
    let newState = reducer(undefined, actions.auth.complete());

    newState = reducer(newState, actions.auth.sessionTimestamp());

    expect(selectors.showSessionStatus(newState, Date.now())).toEqual();

    advanceBy(5);
    // suddenly session expires
    newState = reducer(newState, actions.auth.failure());

    expect(selectors.showSessionStatus(newState, Date.now())).toEqual(
      'expired'
    );
    advanceBy(3);

    expect(selectors.showSessionStatus(newState, Date.now())).toEqual(
      'expired'
    );

    clear();
  });
});

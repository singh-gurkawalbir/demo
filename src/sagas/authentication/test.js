/* global describe, test, expect */
import { call, put } from 'redux-saga/effects';
import { apiCallWithRetry } from '../';
import actions from '../../actions';
import { authParams, logoutParams } from '../api/apiPaths';
import { getResource } from '../resources';
import { status422 } from '../test';
import { auth, initializeApp, invalidateSession } from './';

describe('auth saga flow', () => {
  const authMessage = 'Authenticating User';

  test('action to set authentication to true when auth is successful', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const saga = auth({ email, password });
    const callEffect = saga.next().value;
    const payload = {
      ...authParams.opts,
      body: { email, password },
    };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, authParams.path, payload, authMessage)
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
  });

  test('should dispatch a delete profile action when authentication fails', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const saga = auth({ email, password });
    const callEffect = saga.next().value;
    const payload = {
      ...authParams.opts,
      body: { email, password },
    };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, authParams.path, payload, authMessage)
    );
    expect(saga.throw(status422).value).toEqual(
      put(actions.auth.failure('Authentication Failure'))
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.profile.delete()));
  });
});

describe('initialize app saga', () => {
  test('should set authentication flag true when the user successfuly makes a profile call when there is a valid user session ', () => {
    const saga = initializeApp();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(getResource, actions.profile.request(), 'Initializing application')
    );
    const mockResp = 'some response';
    const authCompletedEffect = saga.next(mockResp).value;

    expect(authCompletedEffect).toEqual(put(actions.auth.complete()));
  });

  test('should dispatch a user logout when the user does not get a response from the Profile call', () => {
    const saga = initializeApp();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(getResource, actions.profile.request(), 'Initializing application')
    );
    const authLogoutEffect = saga.next().value;

    expect(authLogoutEffect).toEqual(put(actions.auth.logout()));
  });

  test('should dispatch a user logout when the api call has failed', () => {
    const saga = initializeApp();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(getResource, actions.profile.request(), 'Initializing application')
    );
    expect(saga.throw(new Error('Some error')).value).toEqual(
      put(actions.auth.logout())
    );
  });
});

describe('invalidate session app', () => {
  test('Should invalidate session when user attempts to logout', () => {
    const saga = invalidateSession();
    const logOutUserEffect = saga.next().value;

    expect(logOutUserEffect).toEqual(
      call(
        apiCallWithRetry,
        logoutParams.path,
        logoutParams.opts,
        'Logging out user'
      )
    );

    const clearStoreEffect = saga.next().value;

    expect(clearStoreEffect).toEqual(put(actions.auth.clearStore()));
  });

  test('Should invalidate session when user attempts to logout irrespective of any api failure', () => {
    const saga = invalidateSession();
    const logOutUserEffect = saga.next().value;

    expect(logOutUserEffect).toEqual(
      call(
        apiCallWithRetry,
        logoutParams.path,
        logoutParams.opts,
        'Logging out user'
      )
    );

    const clearStoreEffect = saga.throw(new Error('Some error')).value;

    expect(clearStoreEffect).toEqual(put(actions.auth.clearStore()));
  });
});

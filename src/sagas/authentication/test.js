/* global describe, test, expect */
import { call, put, all, select } from 'redux-saga/effects';
import { apiCallWithRetry } from '../';
import actions from '../../actions';
import { authParams, logoutParams } from '../api/apiPaths';
import { getResource } from '../resources';
import { status422 } from '../test';
import * as selectors from '../../reducers';
import {
  auth,
  initializeApp,
  retrieveAppInitializationResources,
  retrievingUserDetails,
  getCSRFTokenBackend,
  invalidateSession,
} from './';
import { setCSRFToken, removeCSRFToken } from '../../utils/session';

describe('initialze all app relevant resources sagas', () => {
  describe('retrievingUserDetails sagas', () => {
    test('should retrieve user profile & preferences', () => {
      const saga = retrievingUserDetails();
      const getPreferencesEffect = put(
        actions.user.preferences.request("Retrieving user's preferences")
      );
      const getProfileEffect = put(
        actions.user.profile.request("Retrieving user's profile")
      );

      expect(saga.next().value).toEqual(
        all([getProfileEffect, getPreferencesEffect])
      );
    });
  });

  test('should intialize the app retrieving first the user details and then subsequently users ashares', () => {
    const saga = retrieveAppInitializationResources();
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(retrievingUserDetailsEffect);

    const retrievingUserAsharesEffect = put(
      actions.user.accounts.requestAshares(`Retrieving user's accounts`)
    );

    expect(saga.next().value).toEqual(retrievingUserAsharesEffect);
    const checkForAccountsEffect = select(selectors.hasAccounts);

    expect(saga.next().value).toEqual(checkForAccountsEffect);
    expect(saga.next('some asharedValue received').done).toEqual(true);
  });
  test('should intialize the app retrieving first the user details and then subsequently users shares/ashares if ashares isnt there', () => {
    const saga = retrieveAppInitializationResources();
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(retrievingUserDetailsEffect);

    const retrievingUserAsharesEffect = put(
      actions.user.accounts.requestAshares(`Retrieving user's accounts`)
    );

    expect(saga.next().value).toEqual(retrievingUserAsharesEffect);

    const checkForAccountsEffect = select(selectors.hasAccounts);

    expect(saga.next().value).toEqual(checkForAccountsEffect);
    const retrievingUserSharedAsharesEffect = put(
      actions.user.accounts.requestSharedAshares(
        `Retrieving Account Membership`
      )
    );

    expect(saga.next().value).toEqual(retrievingUserSharedAsharesEffect);
    expect(saga.next().done).toEqual(true);
  });
});
describe('auth saga flow', () => {
  const authMessage = 'Authenticating User';

  test('action to set authentication to true when auth is successful', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const _csrf = 'someCSRF';
    const _csrfAfterSignIn = 'someOtherCSRF';
    const saga = auth({ email, password });
    const payload = {
      ...authParams.opts,
      body: { email, password, _csrf },
    };
    const getCSRFBackend = saga.next().value;

    expect(getCSRFBackend).toEqual(call(getCSRFTokenBackend));

    const callEffect = saga.next(_csrf).value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path: authParams.path,
        opts: payload,
        message: authMessage,
      })
    );
    const setCSRFEffect = saga.next({ _csrf: _csrfAfterSignIn }).value;

    expect(setCSRFEffect).toEqual(call(setCSRFToken, _csrfAfterSignIn));

    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
  });

  test('should dispatch a delete profile action when authentication fails', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const _csrf = 'someCSRF';
    const saga = auth({ email, password });
    const getCSRFBackend = saga.next().value;

    expect(getCSRFBackend).toEqual(call(getCSRFTokenBackend));

    const callEffect = saga.next(_csrf).value;
    const payload = {
      ...authParams.opts,
      body: { email, password, _csrf },
    };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path: authParams.path,
        opts: payload,
        message: authMessage,
      })
    );
    expect(saga.throw(status422).value).toEqual(
      put(actions.auth.failure('Authentication Failure'))
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.user.profile.delete()));
  });
});

describe('initialize app saga', () => {
  test('should set authentication flag true when the user successfuly makes a profile call when there is a valid user session ', () => {
    const saga = initializeApp();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(
        getResource,
        actions.user.profile.request('Initializing application')
      )
    );
    const mockResp = 'some response';
    const getCSRFBackend = saga.next(mockResp).value;

    expect(getCSRFBackend).toEqual(call(getCSRFTokenBackend));

    const setCSRFEffect = saga.next({ _csrf: 'someCSRF' }).value;

    expect(setCSRFEffect).toEqual(call(setCSRFToken, 'someCSRF'));

    const authCompletedEffect = saga.next().value;

    expect(authCompletedEffect).toEqual(put(actions.auth.complete()));
  });

  test('should dispatch a user logout when the user does not get a response from the Profile call', () => {
    const saga = initializeApp();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(
        getResource,
        actions.user.profile.request('Initializing application')
      )
    );
    const authLogoutEffect = saga.next().value;

    expect(authLogoutEffect).toEqual(put(actions.auth.logout()));
  });

  test('should dispatch a user logout when the api call has failed', () => {
    const saga = initializeApp();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(
        getResource,
        actions.user.profile.request('Initializing application')
      )
    );
    expect(saga.throw(new Error('Some error')).value).toEqual(
      put(actions.auth.logout())
    );
  });
});

describe('invalidate session app', () => {
  test('Should invalidate session when user attempts to logout', () => {
    const saga = invalidateSession();
    const getCSRFTokenEffect = saga.next().value;

    expect(getCSRFTokenEffect).toEqual(expect.anything());

    const logOutUserEffect = saga.next('someCSRF1').value;

    expect(logOutUserEffect).toEqual(
      call(apiCallWithRetry, {
        path: logoutParams.path,
        opts: logoutParams.opts,
        message: 'Logging out user',
      })
    );

    const removeCSRFTokenEffect = saga.next().value;

    expect(removeCSRFTokenEffect).toEqual(call(removeCSRFToken));

    const clearStoreEffect = saga.next().value;

    expect(clearStoreEffect).toEqual(put(actions.auth.clearStore()));
  });

  test('Should invalidate session when user attempts to logout irrespective of any api failure', () => {
    const saga = invalidateSession();
    const getCSRFTokenEffect = saga.next().value;

    expect(getCSRFTokenEffect).toEqual(expect.anything());

    const logOutUserEffect = saga.next().value;

    expect(logOutUserEffect).toEqual(
      call(apiCallWithRetry, {
        path: logoutParams.path,
        opts: logoutParams.opts,
        message: 'Logging out user',
      })
    );
    const removeCSRFTokenEffect = saga.throw(new Error('Some error')).value;

    expect(removeCSRFTokenEffect).toEqual(call(removeCSRFToken));
    const clearStoreEffect = saga.next().value;

    expect(clearStoreEffect).toEqual(put(actions.auth.clearStore()));
  });
});

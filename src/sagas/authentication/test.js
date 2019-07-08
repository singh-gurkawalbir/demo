/* global describe, test, expect */
import { call, put, all, select } from 'redux-saga/effects';
import { apiCallWithRetry } from '../';
import actions from '../../actions';
import { authParams, logoutParams } from '../api/apiPaths';
import { getResource, getResourceCollection } from '../resources';
import { status422 } from '../test';
import * as selectors from '../../reducers';
import {
  auth,
  initializeApp,
  retrieveAppInitializationResources,
  retrievingOrgDetails,
  retrievingUserDetails,
  validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
  getCSRFTokenBackend,
  invalidateSession,
} from './';
import { setCSRFToken, removeCSRFToken } from '../../utils/session';
import { ACCOUNT_IDS } from '../../utils/constants';

describe('initialize all app relevant resources sagas', () => {
  describe('retrievingOrgDetails sagas', () => {
    test('should retrieve licenses, org users and accounts', () => {
      const saga = retrievingOrgDetails();
      const getLicensesEffect = call(
        getResourceCollection,
        actions.user.org.accounts.requestLicenses(`Retrieving licenses`)
      );
      const getOrgUsersEffect = call(
        getResourceCollection,
        actions.user.org.users.requestCollection(`Retrieving org users`)
      );
      const getOrgAccountsEffect = call(
        getResourceCollection,
        actions.user.org.accounts.requestCollection(
          `Retrieving user's accounts`
        )
      );

      expect(saga.next().value).toEqual(
        all([getLicensesEffect, getOrgUsersEffect, getOrgAccountsEffect])
      );
    });
  });
  describe('retrievingUserDetails sagas', () => {
    test('should retrieve user profile & preferences', () => {
      const saga = retrievingUserDetails();
      const getProfileEffect = call(
        getResource,
        actions.user.profile.request("Retrieving user's profile")
      );
      const getPreferencesEffect = call(
        getResource,
        actions.user.preferences.request("Retrieving user's preferences")
      );

      expect(saga.next().value).toEqual(
        all([getProfileEffect, getPreferencesEffect])
      );
    });
  });
  describe('validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid sagas', () => {
    test('should return the same AShareId for valid AShareId', () => {
      const aShareId = 'ashare1';
      const saga = validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid(
        aShareId
      );
      const callValidateAShareIdEffect = select(
        selectors.isValidSharedAccountId,
        aShareId
      );

      expect(saga.next().value).toEqual(callValidateAShareIdEffect);
      expect(saga.next(true).value).toEqual(aShareId);
      expect(saga.next(true).done).toEqual(true);
    });
    test('should return a new AShareId for invalid AShareId', () => {
      const aShareId = 'ashare1';
      const saga = validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid(
        aShareId
      );
      const callValidateAShareIdEffect = select(
        selectors.isValidSharedAccountId,
        aShareId
      );

      expect(saga.next().value).toEqual(callValidateAShareIdEffect);
      const callGetOneValidSharedAccountIdEffect = select(
        selectors.getOneValidSharedAccountId
      );

      expect(saga.next(false).value).toEqual(
        callGetOneValidSharedAccountIdEffect
      );
      expect(saga.next('ashare2').value).toEqual('ashare2');
      expect(saga.next(true).done).toEqual(true);
    });
  });
  test('should intialize the app retrieving first the org details and then subsequently user details, when user is an org owner', () => {
    const saga = retrieveAppInitializationResources();
    const retrievingOrgDetailsEffect = call(retrievingOrgDetails);

    expect(saga.next().value).toEqual(retrievingOrgDetailsEffect);
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(retrievingUserDetailsEffect);

    const checkForUserPreferencesEffect = select(selectors.userPreferences);

    expect(saga.next().value).toEqual(checkForUserPreferencesEffect);

    const selectHasAcceptedAccountsEffect = select(
      selectors.hasAcceptedAccounts
    );

    expect(saga.next({ defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual(
      selectHasAcceptedAccountsEffect
    );

    expect(saga.next().value).toEqual(put(actions.auth.defaultAccountSet()));

    expect(saga.next(false).done).toEqual(true);
  });
  test('should intialize the app retrieving first the org details and then subsequently user details, when user is org user with a valid defaultAshareId', () => {
    const saga = retrieveAppInitializationResources();
    const retrievingOrgDetailsEffect = call(retrievingOrgDetails);

    expect(saga.next().value).toEqual(retrievingOrgDetailsEffect);
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(retrievingUserDetailsEffect);

    const checkForUserPreferencesEffect = select(selectors.userPreferences);

    expect(saga.next().value).toEqual(checkForUserPreferencesEffect);

    const selectHasAcceptedAccountsEffect = select(
      selectors.hasAcceptedAccounts
    );

    expect(saga.next({ defaultAShareId: 'ashare1' }).value).toEqual(
      selectHasAcceptedAccountsEffect
    );

    const callValidateAndGetDefaultAShareIdEffect = call(
      validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
      'ashare1'
    );

    expect(saga.next(true).value).toEqual(
      callValidateAndGetDefaultAShareIdEffect
    );
    expect(saga.next('ashare1').value).toEqual(
      put(actions.auth.defaultAccountSet())
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should intialize the app retrieving first the org details and then subsequently user details, when user is org user with an invalid defaultAshareId', () => {
    const saga = retrieveAppInitializationResources();
    const retrievingOrgDetailsEffect = call(retrievingOrgDetails);

    expect(saga.next().value).toEqual(retrievingOrgDetailsEffect);
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(retrievingUserDetailsEffect);

    const checkForUserPreferencesEffect = select(selectors.userPreferences);

    expect(saga.next().value).toEqual(checkForUserPreferencesEffect);

    const selectHasAcceptedAccountsEffect = select(
      selectors.hasAcceptedAccounts
    );

    expect(saga.next({ defaultAShareId: 'ashare1' }).value).toEqual(
      selectHasAcceptedAccountsEffect
    );

    const callValidateAndGetDefaultAShareIdEffect = call(
      validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
      'ashare1'
    );

    expect(saga.next(true).value).toEqual(
      callValidateAndGetDefaultAShareIdEffect
    );

    expect(saga.next('ashare2').value).toEqual(
      put(
        actions.user.preferences.update({
          defaultAShareId: 'ashare2',
          environment: 'production',
        })
      )
    );
    expect(saga.next().value).toEqual(put(actions.auth.defaultAccountSet()));

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
        hidden: true,
      })
    );

    expect(
      saga.next({
        _csrf: _csrfAfterSignIn,
      }).value
    ).toEqual(select(selectors.isSessionExpired));

    const setCSRFEffect = saga.next().value;

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
        hidden: true,
      })
    );
    expect(saga.throw(status422).value).toEqual(
      put(actions.auth.failure('Authentication Failure'))
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.user.profile.delete()));
  });

  test('should remount the app when the session has expired and the user has been successfully authenticated', () => {
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
        hidden: true,
      })
    );

    expect(
      saga.next({
        _csrf: _csrfAfterSignIn,
      }).value
    ).toEqual(select(selectors.isSessionExpired));
    // pass in session expired returned value
    const setCSRFEffect = saga.next(true).value;

    expect(setCSRFEffect).toEqual(call(setCSRFToken, _csrfAfterSignIn));

    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
    expect(saga.next().value).toEqual(call(retrieveAppInitializationResources));
    expect(saga.next().value).toEqual(put(actions.reloadApp()));
  });
  test('shouldnt remount the app when the user is authenticating for the very first time', () => {
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
        hidden: true,
      })
    );

    expect(
      saga.next({
        _csrf: _csrfAfterSignIn,
      }).value
    ).toEqual(select(selectors.isSessionExpired));
    // pass in session expired returned value
    const setCSRFEffect = saga.next(false).value;

    expect(setCSRFEffect).toEqual(call(setCSRFToken, _csrfAfterSignIn));

    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
    expect(saga.next().value).toEqual(call(retrieveAppInitializationResources));

    expect(saga.next().done).toEqual(true);
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

    const setCSRFEffect = saga.next('someCSRF').value;

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

    expect(authLogoutEffect).toEqual(
      put(actions.auth.logout({ isExistingSessionInvalid: true }))
    );
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
  test('Should invalidate session when user attempts to logout ', () => {
    const saga = invalidateSession();
    const getCSRFTokenEffect = saga.next().value;

    expect(getCSRFTokenEffect).toEqual(expect.anything());

    const logOutUserEffect = saga.next('someCSRF1').value;
    const logoutOpts = { ...logoutParams.opts, body: { _csrf: 'someCSRF1' } };

    expect(logOutUserEffect).toEqual(
      call(apiCallWithRetry, {
        path: logoutParams.path,
        opts: logoutOpts,
        message: 'Logging out user',
      })
    );

    const removeCSRFTokenEffect = saga.next().value;

    expect(removeCSRFTokenEffect).toEqual(call(removeCSRFToken));

    const clearStoreEffect = saga.next().value;

    expect(clearStoreEffect).toEqual(put(actions.auth.clearStore()));
  });

  test('should invalid session but skip the signout call when the existing session is invalid', () => {
    const saga = invalidateSession({
      isExistingSessionInvalid: true,
    });
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

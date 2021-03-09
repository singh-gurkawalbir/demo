/* global describe, test, expect, jest,afterEach  */
import { call, put, all, select } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import setupLogRocketReact from 'logrocket-react';
import LogRocket from 'logrocket';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import { authParams, getCSRFParams, logoutParams } from '../api/apiPaths';
import { getResource, getResourceCollection } from '../resources';
import { selectors } from '../../reducers';
import {
  auth,
  initializeApp,
  initializeSession,
  retrieveAppInitializationResources,
  retrievingOrgDetails,
  retrievingUserDetails,
  retrievingAssistantDetails,
  validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
  getCSRFTokenBackend,
  setLastLoggedInLocalStorage,
  invalidateSession,
  identifyLogRocketSession,
  linkWithGoogle,
  reSignInWithGoogle,
  signInWithGoogle,
  initializeLogrocket,
  fetchUIVersion,
} from '.';
import { setCSRFToken, removeCSRFToken } from '../../utils/session';
import { ACCOUNT_IDS } from '../../utils/constants';

describe('initialize all app relevant resources sagas', () => {
  describe('retrievingOrgDetails sagas', () => {
    test('should retrieve licenses, org users and accounts', () => {
      const saga = retrievingOrgDetails();
      const getLicensesEffect = call(
        getResourceCollection,
        actions.user.org.accounts.requestLicenses('Retrieving licenses')
      );
      const getOrgUsersEffect = call(
        getResourceCollection,
        actions.user.org.users.requestCollection('Retrieving org users')
      );
      const getOrgAccountsEffect = call(
        getResourceCollection,
        actions.user.org.accounts.requestCollection(
          'Retrieving user\'s accounts'
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
    const retrievingUserDetailsEffect = call(retrievingUserDetails);
    const retrievingAssistantDetailsEffect = call(retrievingAssistantDetails);

    expect(saga.next().value).toEqual(
      retrievingUserDetailsEffect,
    );
    expect(saga.next().value).toEqual(
      all([
        retrievingOrgDetailsEffect,
        retrievingAssistantDetailsEffect,
      ])
    );
    expect(saga.next().value).toEqual(put(actions.app.fetchUiVersion()));

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
    const retrievingUserDetailsEffect = call(retrievingUserDetails);
    const retrievingAssistantDetailsEffect = call(retrievingAssistantDetails);

    expect(saga.next().value).toEqual(
      retrievingUserDetailsEffect,
    );
    expect(saga.next().value).toEqual(
      all([
        retrievingOrgDetailsEffect,
        retrievingAssistantDetailsEffect,
      ])
    );
    expect(saga.next().value).toEqual(put(actions.app.fetchUiVersion()));

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
    const retrievingUserDetailsEffect = call(retrievingUserDetails);
    const retrievingAssistantDetailsEffect = call(retrievingAssistantDetails);

    expect(saga.next().value).toEqual(
      retrievingUserDetailsEffect,
    );
    expect(saga.next().value).toEqual(
      all([
        retrievingOrgDetailsEffect,
        retrievingAssistantDetailsEffect,
      ])
    );
    expect(saga.next().value).toEqual(put(actions.app.fetchUiVersion()));
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

    expect(saga.next().value).toEqual(call(setLastLoggedInLocalStorage));
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
    expect(saga.throw().value).toEqual(
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

    expect(saga.next().value).toEqual(call(setLastLoggedInLocalStorage));

    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
    expect(saga.next().value).toEqual(call(initializeApp, { reload: true }));
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

    expect(saga.next().value).toEqual(call(setLastLoggedInLocalStorage));

    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
    expect(saga.next().value).toEqual(call(initializeApp, { reload: false }));
    expect(saga.next().done).toEqual(true);
  });
});

describe('initialize app saga', () => {
  test('should set authentication flag true when the user successfuly makes a profile call when there is a valid user session ', () => {
    const saga = initializeSession();
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
    expect(saga.next().value).toEqual(call(setLastLoggedInLocalStorage));

    const authCompletedEffect = saga.next().value;

    expect(authCompletedEffect).toEqual(put(actions.auth.complete()));
  });

  test('should dispatch a user logout when the user does not get a response from the Profile call', () => {
    const saga = initializeSession();
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
    const saga = initializeSession();
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

describe('getCSRFTokenBackend', () => {
  test('should make a call to retrieve the CSRF token return it', () =>
    expectSaga(getCSRFTokenBackend)
      .provide([
        [call(apiCallWithRetry, {
          path: getCSRFParams.path,
          message: 'Requesting CSRF token' }), {_csrf: 'someCSRFValue'}],
      ])
      .returns('someCSRFValue')
      .run()
  );
});

describe('setLastLoggedInLocalStorage', () => {
  const localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };

  Object.defineProperty(window, 'localStorage', { value: localStorage });

  test('should set latestUser id in local storage', () => {
    expectSaga(setLastLoggedInLocalStorage)
      .provide([
        [call(getResource,
          actions.user.profile.request('Retrieving user\'s Profile'), {id: 'someProfileId'}),
        ]])

      .run();

    expect(localStorage.setItem).toHaveBeenCalled();
  }
  );
});

describe('testcases with window dom setup', () => {
  const windowSpy = jest.spyOn(window.document, 'createElement');

  const appendChild = jest.spyOn(window.document.body, 'appendChild');
  const appendChildFn = jest.fn();

  appendChild.mockImplementation(appendChildFn);
  const removeChild = jest.spyOn(window.document.body, 'removeChild');
  const removeChildFn = jest.fn();

  removeChild.mockImplementation(removeChildFn);
  appendChild.mockImplementation(appendChildFn);

  const submit = jest.fn();
  const form = {
    submit,
  };

  windowSpy.mockImplementation(() => form);
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('linkWithGoogle', () => {
    test('should fabricate the link with google dom body correctly and call all of its mocks as well', () => {
      expectSaga(linkWithGoogle, {returnTo: 'someReturnTo'})
        .provide([
          [call(getCSRFTokenBackend), 'someCsrf',
          ]])

        .run();

      expect(form).toEqual({
        action: '/link/google?returnTo=someReturnTo',
        id: 'linkWithGoogle',
        innerHTML: '<input name="_csrf" value="someCsrf">',
        method: 'POST',
        submit,
      });
      expect(submit).toHaveBeenCalled();
      expect(appendChildFn).toHaveBeenCalled();
      expect(removeChildFn).toHaveBeenCalled();
    }
    );
  });

  describe('reSignInWithGoogle', () => {
    test('should fabricate the resignwithgoogle body correctly and call all of its mocks as well', () => {
      expectSaga(reSignInWithGoogle, {email: 'someEmail'})
        .provide([
          [call(getCSRFTokenBackend), 'someCsrf',
          ]])

        .run();

      expect(form).toEqual({
        action: '/reSigninWithGoogle',
        id: 'reSigninWithGoogle',
        innerHTML: '<input name="skipRedirect" value="false"><input name="login_hint" value="someEmail"><input name="_csrf" value="someCsrf">',
        method: 'POST',
        target: '_blank',
        submit,
      });
      expect(submit).toHaveBeenCalled();
      expect(appendChildFn).toHaveBeenCalled();
      expect(removeChildFn).toHaveBeenCalled();
    }
    );
  });
  describe('signInWithGoogle', () => {
    test('should fabricate the signInWithGoogle body correctly and call all of its mocks as well', () => {
      expectSaga(signInWithGoogle, {returnTo: 'something'})
        .provide([
          [call(getCSRFTokenBackend), 'someCsrf',
          ]])

        .run();

      expect(form).toEqual({
        action: '/auth/google?returnTo=something',
        id: 'signinWithGoogle',
        innerHTML: '<input name="_csrf" value="someCsrf">',
        method: 'POST',
        target: '_blank',
        submit,
      });
      expect(submit).toHaveBeenCalled();
      expect(appendChildFn).toHaveBeenCalled();
      expect(removeChildFn).toHaveBeenCalled();
    }
    );
  });
});

describe('initializeLogrocket', () => {
  test('should initialize logocket correctly', () => {
    expectSaga(initializeLogrocket).call(identifyLogRocketSession).run();
  });
});

describe('fetchUiVersion', () => {
  test('should make a network call to retrieve ui vesion and update ui version in state', () => {
    expectSaga(fetchUIVersion)
      .provide([[
        call(apiCallWithRetry, { path: '/ui/version?app=react'}), {version: 'uiVersion'},
      ]])
      .call(apiCallWithRetry, { path: '/ui/version?app=react'})
      .put(actions.app.updateUIVersion('uiVersion'))
      .run();
  });
  test('should not update ui version in state when version could not be retrieved due to a network call failure ', () => {
    expectSaga(fetchUIVersion)
      .provide([[
        call(apiCallWithRetry, { path: '/ui/version?app=react'}), throwError({someError: 'error'}),
      ]])
      .call(apiCallWithRetry, { path: '/ui/version?app=react'})
      .not.put(actions.app.updateUIVersion('uiVersion'))
      .run();
  });
});

describe('retrievingAssistantDetails', () => {
  const setItemMock = jest.spyOn(window.localStorage, 'setItem');
  const spyStringify = jest.spyOn(JSON, 'stringify');

  setItemMock.mockImplementation(() => {
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should make a network call to get assistant data and set it to localStorage', () => {
    expectSaga(retrievingAssistantDetails).provide([[
      call(
        getResourceCollection,
        actions.resource.requestCollection('ui/assistants'),
      ),
      {
        http: {
          applications: [
            {_id: 'activecampaign',
              name: 'someAssistant',
              export: 'someExport',
              import: 'someImport',
              helpURL: 'someURl'}],
        },
        rest: {

          applications: [
            {_id: 'nonWebookAssistant',
              name: 'someAssistant',
              export: 'someExport',
              import: 'someImport',
              helpURL: 'someURl'}],
        },
      },
    ]])
      .call(
        getResourceCollection,
        actions.resource.requestCollection('ui/assistants')
      )
      .run();

    expect(setItemMock).toHaveBeenCalled();
    // mock stringify method called when setting Item
    expect(spyStringify).toHaveBeenCalledWith(
      [{ id: 'activecampaign',
        name: 'someAssistant',
        type: 'http',
        assistant: 'activecampaign',
        export: 'someExport',
        import: 'someImport',
        helpURL: 'someURl',
        webhook: true },
      { id: 'nonWebookAssistant',
        name: 'someAssistant',
        type: 'rest',
        assistant: 'nonWebookAssistant',
        export: 'someExport',
        import: 'someImport',
        helpURL: 'someURl',
        webhook: false },
      { id: 'financialforce',
        name: 'FinancialForce',
        type: 'salesforce',
        assistant: 'financialforce',
        export: true,
        import: true }]
    );
  });

  test('should set assistantData of [] when network call fails', () => {
    expectSaga(retrievingAssistantDetails).provide([[
      call(
        getResourceCollection,
        actions.resource.requestCollection('ui/assistants'),
      ),
      // when network call fails we get undefined
      undefined,
    ]])
      .call(
        getResourceCollection,
        actions.resource.requestCollection('ui/assistants')
      )
      .run();

    expect(setItemMock).toHaveBeenCalled();
    // mock stringify method called when setting Item
    expect(spyStringify).toHaveBeenCalledWith([]);
  });
});

describe('initializeApp', () => {
  test('should abort all sagas and reinitialize logrocket when app is initialized for the first time', () => {
    const opts = {};

    testSaga(initializeApp, opts)
      .next()
      .put(actions.auth.abortAllSagasAndInitLR(opts))
      .next()
      .isDone();
  });
  test('should fetch app initialization resources update logrocket session identity when authenticating for the first time', () => {
    const opts = {};

    testSaga(initializeApp, opts)
      .next()
      .call(retrieveAppInitializationResources)
      .next()
      .call(identifyLogRocketSession)
      .next()
      .isDone();
  });
  test('should logout when unable to fetch app InitializationResources', () => {
    const opts = {};

    testSaga(initializeApp, opts)
      .next()
      .call(retrieveAppInitializationResources)
      .throw(new Error('some api error'))
      .put(actions.auth.logout())
      .next()
      .isDone();
  });
  test('should reload app when session has expired', () => {
    const opts = {reload: true};

    testSaga(initializeApp, opts)
      .next()
      .put(actions.app.deleteDataState())
      .next()
      .call(retrieveAppInitializationResources)
      .next()
      .put(actions.app.reload())
      .next()
      .call(identifyLogRocketSession)
      .next()
      .isDone();
  });
});

jest.mock('logrocket');
jest.mock('logrocket-react');
describe('initializeLogrocket', () => {
  test('should call Logrocket logrocketInitialize and setupLogrocketReact', () => {
    expectSaga(initializeLogrocket).call(identifyLogRocketSession).run();
    expect(setupLogRocketReact).toHaveBeenCalled();
    expect(LogRocket.init).toHaveBeenCalled();
  });
});

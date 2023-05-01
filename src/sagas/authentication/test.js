/* eslint-disable no-undef */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/no-jasmine-globals */

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
  retrievingHttpConnectorDetails,
  validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
  getCSRFTokenBackend,
  setLastLoggedInLocalStorage,
  invalidateSession,
  identifyLogRocketSession,
  linkWithGoogle,
  reSignInWithGoogle,
  signInWithGoogle,
  signUpWithGoogle,
  initializeLogrocket,
  fetchUIVersion,
  validateSession,
  checkAndUpdateDefaultSetId,
  submitAcceptInvite,
} from '.';
import { setCSRFToken, removeCSRFToken } from '../../utils/session';
import { ACCOUNT_IDS, AUTH_FAILURE_MESSAGE, POLLING_STATUS } from '../../constants';
import { pollApiRequests, POLL_SAMPLE_INTERVAL } from '../app';

describe('pollApiRequests', () => {
  // eslint-disable-next-line no-empty-function
  function* somePollSaga() {
  }
  const pollAction = {type: 'someAction'};
  const pollDuration = 100;

  describe('for pollAction', () => {
    test('should throw an error when both a pollAction and a poll saga provided', () => {
      const saga = pollApiRequests({pollAction: {type: 'someAction'}, pollSaga: somePollSaga, duration: pollDuration});

      try {
        saga.next();
        fail('should throw error for incorrect arguments');
      } catch (e) {
        expect(e).toEqual(new Error('Cannot have both pollAction and pollSaga provided, the pollApiRequests saga supports either one'));
      }
    });
    const pollOnceRegularly = saga => saga.select(selectors.pollingStatus)
      .next()
      .put(pollAction)
      .next()
      .delay(pollDuration);

    test('should keep polling when polling status is not stop', () => {
      const startThePolling = testSaga(pollApiRequests, {pollAction, duration: pollDuration});

      const afterPollingOnce = pollOnceRegularly(startThePolling.next());

      // poll again
      pollOnceRegularly(afterPollingOnce.next());
    });
    test('should stop polling when polling status is stop and should sample state to check for polling status', () => {
      const startThePolling = testSaga(pollApiRequests, {pollAction, duration: pollDuration});
      const afterPollingOnce = pollOnceRegularly(startThePolling.next());

      // stop polling inbetween
      afterPollingOnce.next().select(selectors.pollingStatus)
        .next(POLLING_STATUS.STOP)
        .delay(POLL_SAMPLE_INTERVAL)
        .next()
      // keep sampling when polling status is set to STOP
        .select(selectors.pollingStatus)
        .next(POLLING_STATUS.STOP)
        .delay(POLL_SAMPLE_INTERVAL);
    });
    test('should resume polling status when the polling status is set to resume from a stop status', () => {
      const startThePolling = testSaga(pollApiRequests, {pollAction, duration: pollDuration});
      const afterPollingOnce = pollOnceRegularly(startThePolling.next());

      // stop polling inbetween
      const stoppedPollingInbetween = afterPollingOnce.next().select(selectors.pollingStatus)
        .next(POLLING_STATUS.STOP)
        .delay(POLL_SAMPLE_INTERVAL);

      // resume polling from here
      const afterResumingPolling = stoppedPollingInbetween.next().select(selectors.pollingStatus)
        .next(POLLING_STATUS.RESUME)
        .put(pollAction)
        .next()
        .delay(pollDuration);

      // should continue to poll regularly
      pollOnceRegularly(afterResumingPolling.next());
    });
    test('should slow down polling by decreasing polling frequency by half when polling status is set to slow', () => {
      const startThePolling = testSaga(pollApiRequests, {pollAction, duration: pollDuration});
      const afterPollingOnce = pollOnceRegularly(startThePolling.next());

      // slow polling inbetween
      afterPollingOnce.next().select(selectors.pollingStatus)
        .next(POLLING_STATUS.SLOW)
        .put(pollAction)
        .next()
        .delay(pollDuration * 2)
        .next()
      // slow polling inbetween again
        .select(selectors.pollingStatus)
        .next(POLLING_STATUS.SLOW)
        .put(pollAction)
        .next()
        .delay(pollDuration * 2);
    });
    test('should resume polling with the regular polling frequency when polling status is set resume', () => {
      const startThePolling = testSaga(pollApiRequests, {pollAction, duration: pollDuration});
      const afterPollingOnce = pollOnceRegularly(startThePolling.next());

      // slow polling inbetween
      const afterPollingStatusSetToSlow = afterPollingOnce.next().select(selectors.pollingStatus)
        .next(POLLING_STATUS.SLOW)
        .put(pollAction)
        .next()
        .delay(pollDuration * 2);
        // resume polling inbetween
      const afterResumingPolling = afterPollingStatusSetToSlow
        .next()
        .select(selectors.pollingStatus)
        .next(POLLING_STATUS.RESUME)
        .put(pollAction)
        .next()
        .delay(pollDuration);

      // should be able to poll regularly
      pollOnceRegularly(afterResumingPolling.next());
    });
  });

  describe('for pollSaga', () => {
    const pollSagaArgs = {};
    const pollRegularly = saga => saga.select(selectors.pollingStatus)
      .next()
      .call(somePollSaga, pollSagaArgs)
      .next()
      .delay(pollDuration);

    test('should poll with the poll saga', () => {
      const startTheSaga = testSaga(pollApiRequests, {pollSaga: somePollSaga, pollSagaArgs, duration: pollDuration});

      const afterPollingOnce = pollRegularly(startTheSaga.next());

      // after polling again
      pollRegularly(afterPollingOnce.next());
    });
    test('should slow down polling when the polling status is slow', () => {
      const startTheSaga = testSaga(pollApiRequests, {pollSaga: somePollSaga, pollSagaArgs, duration: pollDuration});
      const afterPollingOnce = pollRegularly(startTheSaga.next());

      // poll again with the saga returning terminatePolling set to true
      afterPollingOnce.next()
        .select(selectors.pollingStatus)
        .next(POLLING_STATUS.SLOW)
        .call(somePollSaga, pollSagaArgs)
        .next()
        .delay(2 * pollDuration);
    });

    test('should ignore slow down polling when the polling status is slow and disableSlowPolling is set to true', () => {
      const startTheSaga = testSaga(pollApiRequests, {pollSaga: somePollSaga, pollSagaArgs, disableSlowPolling: true, duration: pollDuration});
      const afterPollingOnce = pollRegularly(startTheSaga.next());

      // poll again with the saga returning terminatePolling set to true
      afterPollingOnce.next()
        .select(selectors.pollingStatus)
        .next(POLLING_STATUS.SLOW)
        .call(somePollSaga, pollSagaArgs)
        .next()
        // continue polling with the regular polling duration
        .delay(pollDuration);
    });

    test('should terminate polling when the pollSaga return terminatePolling set to true', () => {
      const startTheSaga = testSaga(pollApiRequests, {pollSaga: somePollSaga, pollSagaArgs, duration: pollDuration});
      const afterPollingOnce = pollRegularly(startTheSaga.next());

      afterPollingOnce.next()
        .select(selectors.pollingStatus)
        .next()
        .call(somePollSaga, pollSagaArgs)
        .next({terminatePolling: true})
        // exit the saga
        .isDone();
    });
  });
});

describe('checkAndUpdateDefaultSetId test suite', () => {
  test('should not update preference when defaultAShareId is owner', () => {
    const saga = checkAndUpdateDefaultSetId();
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(
      retrievingUserDetailsEffect,
    );
    expect(saga.next().value).toEqual(
      call(getResourceCollection,
        actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
      )
    );

    const checkForUserPreferencesEffect = select(selectors.userPreferences);

    expect(saga.next().value).toEqual(checkForUserPreferencesEffect);

    const selectHasAcceptedAccountsEffect = select(
      selectors.hasAcceptedAccounts
    );

    expect(saga.next({ defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual(
      selectHasAcceptedAccountsEffect
    );
  });

  test('should update the default set id when we have invalid defaultAShareId', () => {
    const saga = checkAndUpdateDefaultSetId();
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(
      retrievingUserDetailsEffect,
    );
    expect(saga.next().value).toEqual(
      call(getResourceCollection,
        actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
      )
    );

    const checkForUserPreferencesEffect = select(selectors.userPreferences);

    expect(saga.next().value).toEqual(checkForUserPreferencesEffect);

    const selectHasAcceptedAccountsEffect = select(
      selectors.hasAcceptedAccounts
    );

    expect(saga.next({ defaultAShareId: 'ashare1' }).value).toEqual(
      selectHasAcceptedAccountsEffect
    );

    expect(saga.next(true).value).toEqual(
      call(
        validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
        'ashare1'
      )
    );

    expect(saga.next('ashare2').value).toEqual(
      put(
        actions.user.preferences.update({
          defaultAShareId: 'ashare2',
          environment: 'production',
        }, true)
      )
    );
  });

  test('should update the defaultAShareId to own when we have invalid defaultAShareId and no accepted account', () => {
    const saga = checkAndUpdateDefaultSetId();
    const retrievingUserDetailsEffect = call(retrievingUserDetails);

    expect(saga.next().value).toEqual(
      retrievingUserDetailsEffect,
    );
    expect(saga.next().value).toEqual(
      call(getResourceCollection,
        actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')
      )
    );

    const checkForUserPreferencesEffect = select(selectors.userPreferences);

    expect(saga.next().value).toEqual(checkForUserPreferencesEffect);

    const selectHasAcceptedAccountsEffect = select(
      selectors.hasAcceptedAccounts
    );

    expect(saga.next({ defaultAShareId: 'ashare1' }).value).toEqual(
      selectHasAcceptedAccountsEffect
    );

    expect(saga.next(true).value).toEqual(
      call(
        validateDefaultASharedIdAndGetOneIfTheExistingIsInvalid,
        'ashare1'
      )
    );

    expect(saga.next('own').value).toEqual(
      put(
        actions.user.preferences.update({
          defaultAShareId: 'own',
          environment: 'production',
        }, true)
      )
    );
  });
});

describe('initialize all app relevant resources sagas', () => {
  describe('retrievingOrgDetails sagas', () => {
    test('should retrieve licenses, org users and accounts', () => {
      const saga = retrievingOrgDetails();
      const getLicensesEffect = call(
        getResourceCollection,
        actions.license.requestLicenses('Retrieving licenses')
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
        all([getOrgUsersEffect, getOrgAccountsEffect])
      );
      const hasAcceptedAccountsEffects = select(
        selectors.hasAcceptedAccounts
      );

      expect(saga.next().value).toEqual(
        hasAcceptedAccountsEffects
      );
      const defaultAShareIdEffects = select(
        selectors.defaultAShareId
      );

      expect(saga.next().value).toEqual(
        defaultAShareIdEffects
      );
      expect(saga.next('own').value).toEqual(getLicensesEffect);
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
      expect(saga.next(true).done).toBe(true);
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
      expect(saga.next('ashare2').value).toBe('ashare2');
      expect(saga.next(true).done).toBe(true);
    });
  });
  test('should intialize the app retrieving first the org details and then subsequently user details, when user is an org owner', () => {
    const saga = retrieveAppInitializationResources();
    const isMFASetupIncompleteEffect = select(selectors.isMFASetupIncomplete);
    const retrievingOrgDetailsEffect = call(retrievingOrgDetails);
    const retrievingAssistantDetailsEffect = call(retrievingAssistantDetails);
    const retrievingHttpConnectorDetailsEffect = call(retrievingHttpConnectorDetails);

    expect(saga.next().value).toEqual(
      isMFASetupIncompleteEffect,
    );
    expect(saga.next().value).toEqual(put(actions.app.fetchUiVersion()));
    expect(saga.next().value).toEqual(call(checkAndUpdateDefaultSetId));

    expect(saga.next().value).toEqual(
      all([
        retrievingOrgDetailsEffect,
        retrievingAssistantDetailsEffect,
        retrievingHttpConnectorDetailsEffect,
      ])
    );
    expect(saga.next().value).toEqual(put(actions.auth.defaultAccountSet()));

    expect(saga.next(false).done).toBe(true);
  });
  test('should intialize the app retrieving first the org details and then subsequently user details, when user is org user with a valid defaultAshareId', () => {
    const saga = retrieveAppInitializationResources();
    const isMFASetupIncompleteEffect = select(selectors.isMFASetupIncomplete);
    const retrievingOrgDetailsEffect = call(retrievingOrgDetails);
    const retrievingAssistantDetailsEffect = call(retrievingAssistantDetails);
    const retrievingHttpConnectorDetailsEffect = call(retrievingHttpConnectorDetails);

    expect(saga.next().value).toEqual(
      isMFASetupIncompleteEffect,
    );
    expect(saga.next().value).toEqual(put(actions.app.fetchUiVersion()));
    expect(saga.next().value).toEqual(call(checkAndUpdateDefaultSetId));
    expect(saga.next('ashare1').value).toEqual(
      all([
        retrievingOrgDetailsEffect,
        retrievingAssistantDetailsEffect,
        retrievingHttpConnectorDetailsEffect,
      ])
    );
    expect(saga.next().value).toEqual(
      put(actions.auth.defaultAccountSet())
    );
    expect(saga.next().done).toBe(true);
  });
  test('should intialize the app retrieving first the org details and then subsequently user details, when user is org user with an invalid defaultAshareId', () => {
    const saga = retrieveAppInitializationResources();
    // const requestMFASessionInfoEffect = call(requestMFASessionInfo);
    const isMFASetupIncompleteEffect = select(selectors.isMFASetupIncomplete);
    const retrievingOrgDetailsEffect = call(retrievingOrgDetails);
    // const retrievingUserDetailsEffect = call(retrievingUserDetails);
    const retrievingAssistantDetailsEffect = call(retrievingAssistantDetails);
    const retrievingHttpConnectorDetailsEffect = call(retrievingHttpConnectorDetails);

    // expect(saga.next().value).toEqual(
    //   requestMFASessionInfoEffect,
    // );
    expect(saga.next().value).toEqual(
      isMFASetupIncompleteEffect,
    );
    expect(saga.next().value).toEqual(put(actions.app.fetchUiVersion()));
    expect(saga.next().value).toEqual(call(checkAndUpdateDefaultSetId));
    expect(saga.next().value).toEqual(
      all([
        retrievingOrgDetailsEffect,
        retrievingAssistantDetailsEffect,
        retrievingHttpConnectorDetailsEffect,
      ])
    );
    expect(saga.next().value).toEqual(put(actions.auth.defaultAccountSet()));

    expect(saga.next().done).toBe(true);
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
    const validateSessionEffect = saga.next({
      _csrf: _csrfAfterSignIn,
    }).value;

    expect(validateSessionEffect).toEqual(call(validateSession));
    expect(saga.next().value).toEqual(select(selectors.isSessionExpired));
    const setCSRFEffect = saga.next(false).value;

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
      put(actions.auth.failure(AUTH_FAILURE_MESSAGE))
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.user.profile.delete()));
  });

  test('should dispatch a setCSRFToken and mfaRequired action when auth is succesful but it needs mfa otp', () => {
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
    const authResponse = {
      success: true,
      mfaRequired: true,
      isAccountUser: true,
      _csrf,
    };

    expect(saga.next(authResponse).value).toEqual(call(setCSRFToken, _csrf));
    expect(saga.next().value).toEqual(call(getResourceCollection, actions.user.org.accounts.requestCollection('Retrieving user\'s accounts')));
    expect(saga.next().value).toEqual(put(actions.auth.mfaRequired(authResponse)));
  });

  test('should dispatch an auth failure action when authentication fails with a message from sign in api', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const _csrf = 'someCSRF';
    const SIGN_IN_ERROR_MESSAGE = 'Sign in failed. Sign in via SSO is required for this user.';
    const signInErrorResponse = { message: JSON.stringify({ errors: [{ code: '!user', message: SIGN_IN_ERROR_MESSAGE}]})};
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
    expect(saga.throw(signInErrorResponse).value).toEqual(
      put(actions.auth.failure(SIGN_IN_ERROR_MESSAGE))
    );
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
    const validateSessionEffect = saga.next({
      _csrf: _csrfAfterSignIn,
    }).value;

    expect(validateSessionEffect).toEqual(call(validateSession));

    expect(
      saga.next().value
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
    const validateSessionEffect = saga.next({
      _csrf: _csrfAfterSignIn,
    }).value;

    expect(validateSessionEffect).toEqual(call(validateSession));

    expect(
      saga.next().value
    ).toEqual(select(selectors.isSessionExpired));
    // pass in session expired returned value
    const setCSRFEffect = saga.next(false).value;

    expect(setCSRFEffect).toEqual(call(setCSRFToken, _csrfAfterSignIn));

    expect(saga.next().value).toEqual(call(setLastLoggedInLocalStorage));

    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
    expect(saga.next().value).toEqual(call(initializeApp, { reload: false }));
    expect(saga.next().done).toBe(true);
  });
});

describe('submitAcceptInvite saga', () => {
  test('should put the errror message in redux store when api call for accepr invite fails', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const payload = { email, password };
    const saga = submitAcceptInvite({payload});
    const {value} = saga.next();

    expect(value).toEqual(
      call(apiCallWithRetry, {
        path: '/accept-invite?no_redirect=true',
        opts: {
          body: payload,
          method: 'POST',
        },
        message: 'Accept invite',
        hidden: true,
      })
    );
    expect(saga.throw({errors: [{message: 'somemeesage'}]}).value).toEqual(
      put(actions.auth.acceptInvite.failure({message: ['somemeesage'], type: 'error'}))
    );
  });
  test('should put the response message in redux store when api call for accepr invite gets success', () => {
    const email = 'someUserEmail';
    const password = 'someUserPassword';
    const payload = { email, password };
    const response = {message: 'someMessage', success: true};
    const saga = submitAcceptInvite({payload});
    const {value} = saga.next();

    expect(value).toEqual(
      call(apiCallWithRetry, {
        path: '/accept-invite?no_redirect=true',
        opts: {
          body: payload,
          method: 'POST',
        },
        message: 'Accept invite',
        hidden: true,
      })
    );

    expect((saga.next(response)).value).toEqual(
      put(actions.auth.acceptInvite.success(response))
    );
    expect((saga.next()).value).toEqual(
      put(actions.auth.signupStatus('done', response.message))
    );
  });
});

describe('initialize app saga', () => {
  test('should set authentication flag true when the user successfuly makes a profile call when there is a valid user session', () => {
    expectSaga(initializeSession)
      .provide([
        [call(validateSession), {authenticated: true, mfaRequired: false}],
        [call(getCSRFTokenBackend), '1234'],
      ])
      .call(setCSRFToken, '1234')
      .call(setLastLoggedInLocalStorage)
      .put(actions.auth.complete())
      .call(initializeApp)
      .run();
  });

  test('should dispatch a user logout when the user does not get a response from the Profile call', () => {
    const saga = initializeSession();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(
        validateSession
      )
    );
    const authLogoutEffect = saga.next().value;

    expect(authLogoutEffect).toEqual(
      put(actions.auth.logout())
    );
  });

  test('should dispatch a user logout when the api call has failed', () => {
    const saga = initializeSession();
    const getProfileResourceEffect = saga.next().value;

    expect(getProfileResourceEffect).toEqual(
      call(
        validateSession,
      )
    );
    expect(saga.throw(new Error('Some error')).value).toEqual(
      put(actions.auth.logout())
    );
  });

  test('should dispatch mfaRequired when the user switch accounts mfa setup in complete', () => {
    const validationRes = { authenticated: true, mfaRequired: true, mfaVerified: false };

    expectSaga(initializeSession, { opts: { switchAcc: true } })
      .provide([
        [call(validateSession), validationRes],
        [select(selectors.isMFASetupIncomplete), true],
        [call(getCSRFTokenBackend), '1234'],
      ])
      .call(setCSRFToken, '1234')
      .put(actions.auth.mfaRequired({...validationRes, isAccountUser: true, dontAllowTrustedDevices: true}))
      .call(retrieveAppInitializationResources)
      .run();
  });

  test('should dispatch mfaRequired when the user switch accounts mfa setup not in complete', () => {
    const validationRes = { authenticated: true, mfaRequired: true, mfaVerified: false };

    expectSaga(initializeSession, { opts: { switchAcc: true } })
      .provide([
        [call(validateSession), validationRes],
        [select(selectors.isMFASetupIncomplete), false],
        [call(getCSRFTokenBackend), '1234'],
      ])
      .call(setCSRFToken, '1234')
      .put(actions.auth.mfaRequired({...validationRes, isAccountUser: true, dontAllowTrustedDevices: true}))
      .not.call(retrieveAppInitializationResources)
      .run();
  });
});

describe('invalidate session app', () => {
  test('Should invalidate session when user attempts to logout', () => {
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
    expect(saga.next().value).toEqual(expect.anything());

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
          actions.user.profile.request('Retrieving user\'s Profile')), {id: 'someProfileId'}]])

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
  describe('signUpWithGoogle', () => {
    test('should fabricate the signUpWithGoogle body correctly and call all of its mocks as well', () => {
      expectSaga(signUpWithGoogle, {returnTo: 'something'})
        .provide([
          [call(getCSRFTokenBackend), 'someCsrf',
          ]])

        .run();

      expect(form).toEqual({
        action: '/auth/google?returnTo=something',
        id: 'signinWithGoogle',
        innerHTML: '<input name="_csrf" value="someCsrf">',
        method: 'POST',
        submit,
        target: '_blank',
      });
      expect(submit).toHaveBeenCalled();
      expect(appendChildFn).toHaveBeenCalled();
      expect(removeChildFn).toHaveBeenCalled();
    }
    );
    test('should fabricate the signUpWithGoogle body correctly and call all of its mocks as well and with UTM params', () => {
      expectSaga(signUpWithGoogle, {returnTo: 'something', utmParams: {key: 'value'}})
        .provide([
          [call(getCSRFTokenBackend), 'someCsrf',
          ]])

        .run();

      expect(form).toEqual({
        action: '/auth/google?returnTo=something',
        id: 'signinWithGoogle',
        innerHTML: '<input name="_csrf" value="someCsrf"><input name="key" value="value">',
        method: 'POST',
        submit,
        target: '_blank',
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
  test('should not update ui version in state when version could not be retrieved due to a network call failure', () => {
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
describe('initializeLogrocket 1', () => {
  test('should call Logrocket logrocketInitialize and setupLogrocketReact', () => {
    expectSaga(initializeLogrocket).call(identifyLogRocketSession).run();
    expect(setupLogRocketReact).toHaveBeenCalled();
    expect(LogRocket.init).toHaveBeenCalled();
  });
});

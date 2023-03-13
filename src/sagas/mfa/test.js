
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import {
  requestAccountSettings, updateAccountSettings, resetOwnerMFA,
} from '.';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import { MFA_ACCOUNT_SETTINGS_ASYNC_KEY, MFA_OWNER_RESET_ASYNC_KEY } from '../../constants';

describe('requestAccountSettings saga', () => {
  const path = '/accountSettings';

  test('should dispatch mfa receivedAccountSettings action if api call is a success', () => {
    const response = {
      mfa: {
        dontAllowTrustedDevices: false,
        trustDeviceForPeriod: 30,
      },
    };

    expectSaga(requestAccountSettings)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
        }), response],
      ])
      .call(apiCallWithRetry, {
        path,
        opts: {
          method: 'GET',
        },
      })
      .put(actions.mfa.receivedAccountSettings(response?.mfa))
      .run();
  });
  test('should return undefined if api call fails', () => {
    const error = new Error('error');

    expectSaga(requestAccountSettings)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .not.put(actions.mfa.receivedAccountSettings())
      .returns(undefined)
      .run();
  });
});

describe('updateAccountSettings saga', () => {
  const path = '/accountSettings';

  test('should call requestAccountSettings and dispatch async success action if api call is a success for a given accountSettings1', () => {
    const accountSettings = {
      dontAllowTrustedDevices: true,
      trustDeviceForPeriod: 30,
    };
    const payload = {
      dontAllowTrustedDevices: true,
    };

    expectSaga(updateAccountSettings, {accountSettings})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            body: payload,
            method: 'PATCH',
          },
        })],
        [call(requestAccountSettings)],
      ])
      .put(actions.asyncTask.start(MFA_ACCOUNT_SETTINGS_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          body: payload,
          method: 'PATCH',
        },
      })
      .call(requestAccountSettings)
      .put(actions.asyncTask.success(MFA_ACCOUNT_SETTINGS_ASYNC_KEY))
      .run();
  });
  test('should call requestAccountSettings and dispatch async success action if api call is a success for a given accountSettings2', () => {
    const accountSettings = {
      dontAllowTrustedDevices: false,
      trustDeviceForPeriod: 30,
    };
    const payload = {
      dontAllowTrustedDevices: false,
      trustDeviceForPeriod: 30,
    };

    expectSaga(updateAccountSettings, {accountSettings})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            body: payload,
            method: 'PATCH',
          },
        })],
        [call(requestAccountSettings)],
      ])
      .put(actions.asyncTask.start(MFA_ACCOUNT_SETTINGS_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          body: payload,
          method: 'PATCH',
        },
      })
      .call(requestAccountSettings)
      .put(actions.asyncTask.success(MFA_ACCOUNT_SETTINGS_ASYNC_KEY))
      .run();
  });
  test('should not call requestAccountSettings and dispatch async failed action if api call fails', () => {
    const accountSettings = {
      dontAllowTrustedDevices: false,
      trustDeviceForPeriod: 30,
    };
    const payload = {
      dontAllowTrustedDevices: false,
      trustDeviceForPeriod: 30,
    };

    const error = new Error('error');

    expectSaga(updateAccountSettings, {accountSettings})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            body: payload,
            method: 'PATCH',
          },
        }), throwError(error)],
      ])
      .put(actions.asyncTask.start(MFA_ACCOUNT_SETTINGS_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          body: payload,
          method: 'PATCH',
        },
      })
      .not.call(requestAccountSettings)
      .put(actions.asyncTask.failed(MFA_ACCOUNT_SETTINGS_ASYNC_KEY))
      .run();
  });
});

describe('resetOwnerMFA saga', () => {
  test('should dispatch asyncTask success action and refetch shared ashares if api call is a success', () => {
    const path = '/owner/mfa/reset';

    expectSaga(resetOwnerMFA)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'POST',
          },
        })],
      ])
      .put(actions.asyncTask.start(MFA_OWNER_RESET_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
        },
      })
      .put(actions.asyncTask.success(MFA_OWNER_RESET_ASYNC_KEY))
      .put(actions.user.org.accounts.requestCollection())
      .run();
  });
  test('should dispatch asyncTask failed action if api call fails', () => {
    const path = '/owner/mfa/reset';
    const error = new Error('error');

    expectSaga(resetOwnerMFA)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'POST',
          },
        }), throwError(error)],
      ])
      .put(actions.asyncTask.start(MFA_OWNER_RESET_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
        },
      })
      .put(actions.asyncTask.failed(MFA_OWNER_RESET_ASYNC_KEY))
      .run();
  });
});

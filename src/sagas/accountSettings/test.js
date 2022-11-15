/* global describe, test */
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import {
  requestAccountSettings, updateAccountSettings,
} from '.';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import { ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY } from '../../constants';

describe('requestAccountSettings saga', () => {
  const path = '/accountSettings';

  test('should dispatch accountSettings received action if api call is a success', () => {
    const response = {
      dataRetentionPeriod: 90,
    };

    return expectSaga(requestAccountSettings)
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
      .put(actions.accountSettings.received(response))
      .run();
  });
  test('should return undefined if api call fails', () => {
    const error = new Error('error');

    return expectSaga(requestAccountSettings)
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .not.put(actions.accountSettings.received())
      .returns(undefined)
      .run();
  });
});

describe('updateAccountSettings saga', () => {
  const path = '/accountSettings';

  test('should call requestAccountSettings and dispatch async success action if api call is a success for a given accountSettings', () => {
    const accountSettings = {
      dataRetentionPeriod: 60,
    };

    return expectSaga(updateAccountSettings, {accountSettings})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            body: accountSettings,
            method: 'PATCH',
          },
        })],
        [call(requestAccountSettings)],
      ])
      .put(actions.asyncTask.start(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          body: accountSettings,
          method: 'PATCH',
        },
      })
      .call(requestAccountSettings)
      .put(actions.asyncTask.success(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY))
      .run();
  });
  test('should not call requestAccountSettings and dispatch async failed action if api call fails', () => {
    const accountSettings = {
      dataRetentionPeriod: 60,
    };

    const error = new Error('error');

    return expectSaga(updateAccountSettings, {accountSettings})
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            body: accountSettings,
            method: 'PATCH',
          },
        }), throwError(error)],
      ])
      .put(actions.asyncTask.start(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY))
      .call(apiCallWithRetry, {
        path,
        opts: {
          body: accountSettings,
          method: 'PATCH',
        },
      })
      .not.call(requestAccountSettings)
      .put(actions.asyncTask.failed(ACCOUNT_SETTINGS_DATA_RETENTION_ASYNC_KEY))
      .run();
  });
});

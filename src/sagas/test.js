/* global describe, test, expect, fail,beforeEach,afterEach */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..
import { call, take, race, put } from 'redux-saga/effects';
import { sendRequest } from 'redux-saga-requests';
import actionsTypes from '../actions/types';
import actions from '../actions';
import { apiCallWithRetry } from './';
import { APIException } from './api';
import * as apiConsts from './api/apiPaths';
import { netsuiteUserRoles } from './resourceForm/connections';

// todo : should be moved to a seperate test file
describe('netsuiteUserRoles', () => {
  describe('request payload generation', () => {
    test('should utilize the connection id to retrieve userRoles when no form values provided  ', () => {
      const saga = netsuiteUserRoles({ connectionId: '123', values: null });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path: '/netsuite/alluserroles',
          opts: { body: { _connectionId: '123' }, method: 'POST' },
          hidden: true,
        })
      );
    });
    test('should utilize the form values to retrieve userRoles when form values are provided ', () => {
      const email = 'some email';
      const password = 'some password';
      const saga = netsuiteUserRoles({
        connectionId: '123',
        values: {
          '/netsuite/email': email,
          '/netsuite/password': password,
        },
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path: '/netsuite/alluserroles',
          opts: {
            body: {
              email,
              password,
            },
            method: 'POST',
          },
          hidden: true,
        })
      );
    });
  });

  describe('netsuite api call response behavior for an existing connection', () => {
    let saga;
    const connectionId = '123';

    beforeEach(() => {
      saga = netsuiteUserRoles({ connectionId, values: null });

      // skipping the api call
      saga.next();
    });

    afterEach(() => {
      expect(saga.next().done).toEqual(true);
    });
    test('should check the response for errors on a successful call and subsequently dispatch an error if all the environments fail', () => {
      const failedResp = {
        production: { accounts: {}, success: false },
        sandbox: { accounts: {}, success: false },
      };

      expect(saga.next(failedResp).value).toEqual(
        put(
          actions.resource.connections.netsuite.requestUserRolesFailed(
            connectionId,
            'Invalid netsuite credentials provided'
          )
        )
      );
    });

    test('should check the response for errors on a successful call and subsequently dispatch a successful netsuite userRoles if any of the environments succeeded', () => {
      const oneEnvfailedResp = {
        production: { accounts: {}, success: true },
        sandbox: { accounts: {}, success: false },
      };

      expect(saga.next(oneEnvfailedResp).value).toEqual(
        put(
          actions.resource.connections.netsuite.receivedUserRoles(
            connectionId,
            oneEnvfailedResp
          )
        )
      );
    });
    test('should save the userRoles on a successful call', () => {
      const successResp = {
        production: { accounts: {}, success: true },
      };

      expect(saga.next(successResp).value).toEqual(
        put(
          actions.resource.connections.netsuite.receivedUserRoles(
            connectionId,
            successResp
          )
        )
      );
    });

    test('should dispatch an Error action when the api call has failed and an exception is thrown ', () => {
      const errorException = {
        message: JSON.stringify({ errors: [{ message: 'Some error' }] }),
      };

      expect(saga.throw(errorException).value).toEqual(
        put(
          actions.resource.connections.netsuite.requestUserRolesFailed(
            connectionId,
            'Some error'
          )
        )
      );
    });
  });
  describe('netsuite api call response behavior for an new connection', () => {
    test('should save only all success netsuite environments', () => {
      const email = 'some email';
      const password = 'some password';
      const saga = netsuiteUserRoles({
        connectionId: '123',
        values: {
          '/netsuite/email': email,
          '/netsuite/password': password,
        },
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path: '/netsuite/alluserroles',
          opts: {
            body: {
              email,
              password,
            },
            method: 'POST',
          },
          hidden: true,
        })
      );
      const oneEnvfailedResp = {
        production: { accounts: {}, success: true },
        sandbox: { accounts: {}, success: false },
      };

      expect(saga.next(oneEnvfailedResp).value).toEqual(
        put(
          actions.resource.connections.netsuite.receivedUserRoles('123', {
            production: { accounts: {}, success: true },
          })
        )
      );
    });
  });
});

describe(`apiCallWithRetry saga`, () => {
  const path = '/somePath';
  const opts = {};
  const _400Exception = new APIException({
    status: 400,
    message: 'Session Expired',
  });

  describe('non signout requests', () => {
    test('Any successful non signout request return the response back to the parent saga ', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const apiRequestAction = {
        type: 'API_WATCHER',
        request: { url: path, args },
      };
      const raceBetweenApiCallAndLogoutEffect = race({
        apiResp: call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        logout: take(actionsTypes.USER_LOGOUT),
      });
      // if an effect does not succeeds in a race...we get an undefined
      const resp = {
        apiResp: { response: { data: 'some response' } },
        logout: undefined,
      };

      expect(saga.next().value).toEqual(raceBetweenApiCallAndLogoutEffect);
      expect(saga.next(resp).value).toEqual('some response');
      expect(saga.next().done).toBe(true);
    });

    test('Any failed non signout request return should bubble the exception to parent ', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const apiRequestAction = {
        type: 'API_WATCHER',
        request: { url: path, args },
      };
      const raceBetweenApiCallAndLogoutEffect = race([
        call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        take(actionsTypes.USER_LOGOUT),
      ]);

      try {
        expect(saga.throw(_400Exception).value).toEqual(
          raceBetweenApiCallAndLogoutEffect
        );
        // should not reach statement
        fail('It should throw an exception');
      } catch (e) {
        expect(e).toEqual(_400Exception);
      }

      expect(saga.next().done).toBe(true);
    });

    test('Any non signout request with a logout action should return null', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const apiRequestAction = {
        type: 'API_WATCHER',
        request: { url: path, args },
      };
      const raceBetweenApiCallAndLogoutEffect = race({
        apiResp: call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        logout: take(actionsTypes.USER_LOGOUT),
      });

      // How can we inject a logout action to resolve
      // the race between two effects
      expect(saga.next().value).toEqual(raceBetweenApiCallAndLogoutEffect);

      const resp = { apiResp: undefined, logout: { something: 'dsd' } };

      expect(saga.next(resp).value).toEqual(null);

      expect(saga.next().done).toBe(true);
    });

    test('Any non signout request with a logout action should return null', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const apiRequestAction = {
        type: 'API_WATCHER',
        request: { url: path, args },
      };
      const raceBetweenApiCallAndLogoutEffect = race({
        apiResp: call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        logout: take(actionsTypes.USER_LOGOUT),
      });

      // How can we inject a logout action
      // to resolve the race between two effects
      expect(saga.next().value).toEqual(raceBetweenApiCallAndLogoutEffect);
      // if an effect does not succeeds in a race...we get an undefined
      const resp = { apiResp: undefined, logout: { something: 'dsd' } };

      expect(saga.next(resp).value).toEqual(null);

      expect(saga.next().done).toBe(true);
    });

    test('In the event of a 204 response apiCallWithRetry saga should return undefined to the parent saga', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const apiRequestAction = {
        type: 'API_WATCHER',
        request: { url: path, args },
      };
      const raceBetweenApiCallAndLogoutEffect = race({
        apiResp: call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        logout: take(actionsTypes.USER_LOGOUT),
      });

      // to resolve the race between two effects
      expect(saga.next().value).toEqual(raceBetweenApiCallAndLogoutEffect);
      // if an effect does not succeeds in a race...we get an undefined

      // we expect an undefined data in the response
      const resp = {
        apiResp: { response: { data: undefined } },
        logout: undefined,
      };

      expect(saga.next(resp).value).toEqual(undefined);

      expect(saga.next().done).toBe(true);
    });
  });
  describe('signout request', () => {
    test('Any successful non signout request return the response back to the parent saga ', () => {
      const logoutPath = apiConsts.logoutParams.path;
      const args = {
        path: logoutPath,
        opts,
        hidden: undefined,
        message: undefined,
      };
      const saga = apiCallWithRetry(args);
      const apiRequestAction = {
        type: 'API_WATCHER',
        request: { url: logoutPath, args },
      };
      const sendRequestEffect = call(sendRequest, apiRequestAction, {
        dispatchRequestAction: true,
      });
      const resp = { response: { data: 'some response' } };

      expect(saga.next().value).toEqual(sendRequestEffect);
      expect(saga.next(resp).value).toEqual('some response');
      expect(saga.next().done).toBe(true);
    });
  });
});

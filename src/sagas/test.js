/* global describe, test, expect, fail */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..

import { call, take, race } from 'redux-saga/effects';
import { sendRequest } from 'redux-saga-requests';
import actionsTypes from '../actions/types';
import { apiCallWithRetry } from './';
import { APIException } from './api';
import * as apiConsts from './api/apiPaths';

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
      const resp = { apiResp: { response: 'some response' }, logout: null };

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

      const resp = { apiResp: null, logout: { something: 'dsd' } };

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

      const resp = { apiResp: null, logout: { something: 'dsd' } };

      expect(saga.next(resp).value).toEqual(null);

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
      const resp = { response: 'some response' };

      expect(saga.next().value).toEqual(sendRequestEffect);
      expect(saga.next(resp).value).toEqual('some response');
      expect(saga.next().done).toBe(true);
    });
  });
});

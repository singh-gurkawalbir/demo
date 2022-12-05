/* global describe, test, expect, fail,beforeEach,afterEach, jest, beforeAll, afterAll */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..
import {
  call,
  take,
  race,
  put,
  delay,
  cancelled,
  select,
  fork,
  spawn,
} from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import rootSaga, { apiCallWithRetry, requestCleanup, CANCELLED_REQ, allSagas, apiCallWithPaging } from './index';
import actionsTypes from '../actions/types';
import actions from '../actions';
import { APIException } from './api/requestInterceptors/utils';
import * as apiConsts from './api/apiPaths';
import { netsuiteUserRoles } from './resourceForm/connections';
import { selectors } from '../reducers';
import { COMM_STATES } from '../reducers/comms/networkComms';
import { initializeLogrocket, invalidateSession } from './authentication';
import { sendRequest } from './api';
import { getAsyncKey } from '../utils/saveAndCloseButtons';

// todo : should be moved to a seperate test file
describe('netsuiteUserRoles', () => {
  const connectionId = '123';
  const asyncKey = getAsyncKey('connections', connectionId);

  describe('request payload generation', () => {
    test('should utilize the connection id to retrieve userRoles when no form values provided  ', () => {
      const saga = netsuiteUserRoles({ connectionId: '123', values: null });

      expect(saga.next().value).toEqual(put(actions.asyncTask.start(asyncKey)));
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

      expect(saga.next().value).toEqual(put(actions.asyncTask.start(asyncKey)));

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
    const someFormValues = {a: 'b' };
    const parentContext = {b: 'c'};

    const asyncKey = getAsyncKey('connections', connectionId);

    describe('when shouldPingConnection is false', () => {
      beforeEach(() => {
        saga = netsuiteUserRoles({ connectionId,
          values: someFormValues,
          parentContext,
        });

        // skipping async start task
        saga.next();
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
        expect(saga.next(failedResp).value).toEqual(
          put(
            actions.resource.connections.testErrored(
              connectionId,
              'Invalid netsuite credentials provided'
            )
          )
        );
        expect(saga.next().value).toEqual(put(actions.asyncTask.failed(asyncKey)));
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
              { production: { accounts: {}, success: true }},

            )
          )
        );
        expect(saga.next(oneEnvfailedResp).value).toEqual(
          put(
            actions.resource.connections.testSuccessful(
              connectionId
            )
          )
        );
        expect(saga.next().value).toEqual(put(actions.asyncTask.success(asyncKey)));
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
        expect(saga.next(successResp).value).toEqual(
          put(
            actions.resource.connections.testSuccessful(
              connectionId
            )
          )
        );
        expect(saga.next(successResp).value).toEqual(put(actions.asyncTask.success(asyncKey)));
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
        expect(saga.next(errorException).value).toEqual(
          put(
            actions.resource.connections.testErrored(
              connectionId,
              'Some error'
            )
          )
        );
        expect(saga.next().value).toEqual(put(actions.asyncTask.failed(asyncKey)));
      });
    });
    describe('when shouldPingConnection is true', () => {
      beforeEach(() => {
        saga = netsuiteUserRoles({ connectionId,
          values: someFormValues,
          parentContext,
          shouldPingConnection: true,
        });

        // skipping async start task
        saga.next();
        // skipping the api call
        saga.next();
      });

      afterEach(() => {
        expect(saga.next().done).toEqual(true);
      });
      test('should ping the netsuite connection when the netsuiteUser roles has been fetched ', () => {
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
        expect(saga.next(successResp).value).toEqual(
          put(
            actions.resource.connections.testSuccessful(
              connectionId
            )
          )
        );
        expect(saga.next().value).toEqual(put(actions.asyncTask.success(asyncKey)));

        expect(saga.next().value).toEqual(put(actions.resource.connections.test(connectionId, someFormValues, parentContext)));
      });
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

      expect(saga.next().value).toEqual(put(actions.asyncTask.start(asyncKey)));

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

describe('apiCallWithRetry saga', () => {
  const path = '/somePath';
  const opts = {method: 'GET'};
  const _400Exception = new APIException({
    status: 400,
    message: 'Session expired',
  });

  describe('non signout requests', () => {
    test('Any successful non signout request return the response back to the parent saga ', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const request = { url: path, args };
      const raceBetweenApiCallAndTimeoutEffect = race({
        apiResp: call(sendRequest, request),
        timeoutEffect: delay(2 * 60 * 1000),
      });
      // if an effect does not succeeds in a race...we get an undefined
      const resp = {
        apiResp: { response: { data: 'some response' } },
        logout: undefined,
      };

      expect(saga.next().value).toEqual(raceBetweenApiCallAndTimeoutEffect);
      expect(saga.next(resp).value).toEqual(cancelled());

      expect(saga.next().value).toEqual('some response');
      expect(saga.next().done).toBe(true);
    });

    test('Any failed non signout request return should bubble the exception to parent ', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const request = { url: path, args };

      const raceBetweenApiCallAndTimeoutEffect = race([
        call(sendRequest, request),
        take(actionsTypes.AUTH.USER.LOGOUT),
      ]);

      try {
        expect(saga.throw(_400Exception).value).toEqual(
          raceBetweenApiCallAndTimeoutEffect
        );
        // should not reach statement
        fail('It should throw an exception');
      } catch (e) {
        expect(e).toEqual(_400Exception);
      }

      expect(saga.next().done).toBe(true);
    });

    test('In the event of a 204 response apiCallWithRetry saga should return undefined to the parent saga', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const request = { url: path, args };

      const raceBetweenApiCallAndTimeoutEffect = race({
        apiResp: call(sendRequest, request),
        timeoutEffect: delay(120000),
      });

      // to resolve the race between two effects
      expect(saga.next(false).value).toEqual(raceBetweenApiCallAndTimeoutEffect);
      // if an effect does not succeeds in a race...we get an undefined

      // we expect an undefined data in the response
      const resp = {
        apiResp: { response: { data: undefined } },
        logout: undefined,
      };

      expect(saga.next(resp).value).toEqual(cancelled());

      expect(saga.next().value).toEqual(undefined);

      expect(saga.next().done).toBe(true);
    });

    test('timed out non-logout requests should perform request cleanup and subsequently throw a timed out exception', () => {
      const args = { path, opts, hidden: undefined, message: undefined };
      const saga = apiCallWithRetry(args);
      const request = { url: path, args };

      const raceBetweenApiCallAndTimeoutEffect = race({
        apiResp: call(sendRequest, request),
        timeoutEffect: delay(120000),
      });

      expect(saga.next().value).toEqual(raceBetweenApiCallAndTimeoutEffect);
      // emulate a race with a request timed out
      const resp = { timeoutEffect: {something: 'something'} };

      expect(saga.next(resp).value).toEqual(call(requestCleanup, path, opts?.method));
      saga.next(false);

      try {
        expect(saga.next().done).toBe(true);
        fail('should have thrown an error');
      } catch (e) {
        expect(e).toEqual(CANCELLED_REQ);
      }
    });

    describe('apiCallWithRetry saga gets canceled by a parent saga ', () => {
      test('should successfully cleanup and complete any incomplete requests when the saga cancels', () => {
        const args = {
          path,
          opts,
          method: 'GET',
          hidden: undefined,
          message: undefined,
        };
        const saga = apiCallWithRetry(args);
        const request = { url: path, args };

        const raceBetweenApiCallAndTimeoutEffect = race({
          apiResp: call(sendRequest, request),
          timeoutEffect: delay(2 * 60 * 1000),
        });
        // if an effect does not succeeds in a race...we get an undefined
        const resp = {
          apiResp: { response: { data: 'some response' } },
          logout: undefined,
        };

        expect(saga.next().value).toEqual(raceBetweenApiCallAndTimeoutEffect);
        expect(saga.next(resp).value).toEqual(cancelled());

        expect(saga.next(true).value).toEqual(call(requestCleanup, path, 'GET'));

        expect(saga.next().done).toBe(true);
      });

      test('should successfully cleanup and not resend the (abort)completed action again', () => {
        const args = {
          path,
          opts,
          method: 'GET',
          hidden: undefined,
          message: undefined,
        };
        const saga = apiCallWithRetry(args);
        const request = { url: path, args };

        const raceBetweenApiCallAndTimeoutEffect = race({
          apiResp: call(sendRequest, request),
          timeoutEffect: delay(2 * 60 * 1000),
        });
        // if an effect does not succeeds in a race...we get an undefined
        const resp = {
          apiResp: { response: { data: 'some response' } },
          logout: undefined,
        };

        expect(saga.next().value).toEqual(raceBetweenApiCallAndTimeoutEffect);
        expect(saga.next(resp).value).toEqual(cancelled());
        expect(saga.next(true).value).toEqual(call(requestCleanup, path, 'GET'));
        expect(saga.next().done).toBe(true);
      });
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
      const request = { url: logoutPath, args };

      const sendRequestEffect = call(sendRequest, request);
      const resp = { response: { data: 'some response' } };

      expect(saga.next().value).toEqual(sendRequestEffect);
      expect(saga.next(resp).value).toEqual(cancelled());

      expect(saga.next().value).toEqual('some response');
      expect(saga.next().done).toBe(true);
    });
  });

  describe('requestCleanup', () => {
    const path = '/somePath';
    const method = 'GET';

    test('should execute an api complete action for any stale loading requests', () => {
      const saga = requestCleanup(path, method);

      expect(saga.next(true).value).toEqual(delay(0));
      const resourceStatusEffect = select(
        selectors.commStatusPerPath,
        path,
        'GET'
      );

      expect(saga.next().value).toEqual(resourceStatusEffect);
      expect(saga.next(COMM_STATES.LOADING).value).toEqual(
        put(actions.api.complete(path, method, 'Request Aborted'))
      );
      expect(saga.next().done).toBe(true);
    });

    test('should not execute an api complete action for a successful api request', () => {
      const saga = requestCleanup(path, method);

      expect(saga.next(true).value).toEqual(delay(0));
      const resourceStatusEffect = select(
        selectors.commStatusPerPath,
        path,
        'GET'
      );

      expect(saga.next().value).toEqual(resourceStatusEffect);
      expect(saga.next(COMM_STATES.SUCCESS).done).toBe(true);
    });
  });
});

describe('apiCallWithPaging saga', () => {
  const path = '/someResource';
  const opts = {method: 'GET'};
  const responseData = [
    {
      _id: 1,
      name: 'Test1',
    },
    {
      _id: 2,
      name: 'Test2',
    },
  ];
  const secondPageData = [
    {
      _id: 3,
      name: 'Test3',
    },
    {
      _id: 4,
      name: 'Test4',
    },
  ];
  const lastPageData = [
    {
      _id: 5,
      name: 'Test5',
    },
  ];
  const totalCollection = [
    {
      _id: 1,
      name: 'Test1',
    },
    {
      _id: 2,
      name: 'Test2',
    },
    {
      _id: 3,
      name: 'Test3',
    },
    {
      _id: 4,
      name: 'Test4',
    },
    {
      _id: 5,
      name: 'Test5',
    },
  ];
  const totalCollectionWithoutLastPageData = [
    {
      _id: 1,
      name: 'Test1',
    },
    {
      _id: 2,
      name: 'Test2',
    },
    {
      _id: 3,
      name: 'Test3',
    },
    {
      _id: 4,
      name: 'Test4',
    },
  ];
  const prevLink = '<http://qa.staging.integrator.io/api/connections?after=wteyd>; rel=prev';
  const nextLink = '<http://qa.staging.integrator.io/api/connections?after=xxxx>; rel=next';
  const lastLink = '<http://qa.staging.integrator.io/api/connections?after=yyyy>; rel=next';

  const _500Exception = new APIException({
    status: 500,
    message: 'unexpected error',
  });

  beforeAll(() => {
    process.env.API_ENDPOINT = 'http://qa.staging.integrator.io';
  });

  afterAll(() => {
    process.env.API_ENDPOINT = '';
  });

  test('should call apiCallWithRetry with args and requireHeaders true', () => expectSaga(apiCallWithPaging, {path, opts})
    .provide([
      [call(apiCallWithRetry, {path, opts, requireHeaders: true}), undefined],
    ])
    .call(apiCallWithRetry, {path, opts, requireHeaders: true})
    .run());

  test('should return the response from apiCallWithRetry if its not truthy', () => expectSaga(apiCallWithPaging, {path, opts})
    .provide([
      [call(apiCallWithRetry, {path, opts, requireHeaders: true}), null],
    ])
    .call(apiCallWithRetry, {path, opts, requireHeaders: true})
    .returns(null)
    .run());

  test('should not call apiCallWithPaging if response headers are empty', () => expectSaga(apiCallWithPaging, {path, opts})
    .provide([
      [call(apiCallWithRetry, {path, opts, requireHeaders: true}), {data: responseData}],
    ])
    .call(apiCallWithRetry, {path, opts, requireHeaders: true})
    .not.call.fn(apiCallWithPaging)
    .returns(responseData)
    .run());

  describe('paginated resources', () => {
    test('should not call apiCallWithPaging if response headers do not contain link header', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}), {data: responseData,
          headers: {
            get: jest.fn(() => null), // mocking headers get function to not return a response
          }}],
      ])
      .call(apiCallWithRetry, {path, opts, requireHeaders: true})
      .not.call.fn(apiCallWithPaging)
      .returns(responseData)
      .run());

    test('should not call apiCallWithPaging if link header is not of string type', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}), {data: responseData,
          headers: {
            get: jest.fn(() => {}),
          }}],
      ])
      .call(apiCallWithRetry, {path, opts, requireHeaders: true})
      .not.call.fn(apiCallWithPaging)
      .returns(responseData)
      .run());

    test('should not call apiCallWithPaging if link header does not contain "next" relation', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}), {data: responseData,
          headers: {
            get: jest.fn(() => prevLink),
          }}],
      ])
      .call(apiCallWithRetry, {path, opts, requireHeaders: true})
      .not.call.fn(apiCallWithPaging)
      .returns(responseData)
      .run());

    test('should not call apiCallWithPaging with next url if "next" link header exists if path is /audit and return the data with next link', () => expectSaga(apiCallWithPaging, {path: '/audit', opts})
      .provide([
        [call(apiCallWithRetry, {path: '/audit', opts, requireHeaders: true}),
          {
            data: responseData,
            headers: {
              get: jest.fn(() => nextLink),
            }}],
      ])
      .returns({data: responseData, nextLinkPath: '/connections?after=xxxx'})
      .run());

    test('should recursively call apiCallWithPaging with next url if "next" link header exists and return the total data', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}),
          {
            data: responseData,
            headers: {
              get: jest.fn(() => nextLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=xxxx', requireHeaders: true}),
          {
            data: secondPageData,
            headers: {
              get: jest.fn(() => lastLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=yyyy', requireHeaders: true}),
          {
            data: lastPageData,
            headers: {
              get: jest.fn(() => ''),
            }}],
      ])
      .returns(totalCollection)
      .run());

    test('should return total data collected so far in case of exception', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}),
          {
            data: responseData,
            headers: {
              get: jest.fn(() => nextLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=xxxx', requireHeaders: true}),
          {
            data: secondPageData,
            headers: {
              get: jest.fn(() => lastLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=yyyy', requireHeaders: true}),
          throwError(_500Exception)],
      ])
      .returns(totalCollectionWithoutLastPageData)
      .run());

    test('should return total data collected so far in case of link header exception', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}),
          {
            data: responseData,
            headers: {
              get: jest.fn(() => nextLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=xxxx', requireHeaders: true}),
          {
            data: secondPageData,
            headers: {
              get: jest.fn(() => 'invalid link'),
            }}],
      ])
      .returns(totalCollectionWithoutLastPageData)
      .run());

    test('should return total data collected so far (without garbage data) in case next page data returned is garbage', () => expectSaga(apiCallWithPaging, {path, opts})
      .provide([
        [call(apiCallWithRetry, {path, opts, requireHeaders: true}),
          {
            data: responseData,
            headers: {
              get: jest.fn(() => nextLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=xxxx', requireHeaders: true}),
          {
            data: secondPageData,
            headers: {
              get: jest.fn(() => lastLink),
            }}],
        [call(apiCallWithRetry, {opts, path: '/connections?after=yyyy', requireHeaders: true}),
          {
            data: '<some garbage values />',
            headers: {
              get: jest.fn(() => {}),
            }}],
      ])
      .returns(totalCollectionWithoutLastPageData)
      .run());
  });
});

describe('rootSaga', () => {
  describe('testing restart behaviors', () => {
    let saga;

    beforeEach(() => {
      saga = rootSaga();
    });

    test('should initialize logrocket when the logrocket action races', () => {
      const forkEffect = fork(allSagas);

      expect(saga.next().value).toEqual(
        forkEffect
      );
      const forkEffectRes = {
        cancel: jest.fn(),
      };

      expect(saga.next(forkEffectRes).value).toEqual(
        race({
          logrocket: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_INIT_LR),
          logout: take(actionsTypes.AUTH.USER.LOGOUT),
          switchAcc: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_SWITCH_ACC
          )})
      );
      expect(saga.next({logrocket: {opts: {prop1: 'someOptsz'}}}).value).toEqual(call(initializeLogrocket));
      expect(forkEffectRes.cancel).toHaveBeenCalled();
      expect(saga.next().value).toEqual(spawn(rootSaga));
      expect(saga.next().value).toEqual(put(actions.auth.abortAllSagasAndInitLR()));
      expect(saga.next().done).toBe(true);
    });

    test('should invalidate session clear store and respawn rootSaga during logout', () => {
      const forkEffect = fork(allSagas);

      expect(saga.next().value).toEqual(
        forkEffect
      );
      const forkEffectRes = {
        cancel: jest.fn(),
      };

      expect(saga.next(forkEffectRes).value).toEqual(
        race({
          logrocket: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_INIT_LR),
          logout: take(actionsTypes.AUTH.USER.LOGOUT),
          switchAcc: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_SWITCH_ACC
          )})
      );
      expect(saga.next({ logout: { isExistingSessionInvalid: undefined } }).value)
        .toEqual(call(invalidateSession, { isExistingSessionInvalid: undefined }));
      expect(forkEffectRes.cancel).toHaveBeenCalled();

      expect(saga.next().value)
        .toEqual(spawn(rootSaga));

      expect(saga.next().done).toBe(true);
    });
    test('should update preferences and subsequently reinitialize session during switching account ', () => {
      const forkEffect = fork(allSagas);

      expect(saga.next().value).toEqual(
        forkEffect
      );
      const forkEffectRes = {
        cancel: jest.fn(),
      };

      expect(saga.next(forkEffectRes).value).toEqual(
        race({
          logrocket: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_INIT_LR),
          logout: take(actionsTypes.AUTH.USER.LOGOUT),
          switchAcc: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_SWITCH_ACC
          )})
      );
      const account = 'another account';

      expect(saga.next({switchAcc: {accountToSwitchTo: account}}).value)
        .toEqual(spawn(rootSaga));
      expect(forkEffectRes.cancel).toHaveBeenCalled();

      expect(saga.next().value)
        .toEqual(put(actions.user.preferences.update({
          defaultAShareId: account,
          environment: 'production',
        })));
      expect(saga.next().value).toEqual(
        put(actions.auth.clearStore())
      );
      expect(saga.next().value).toEqual(
        put(actions.auth.initSession())
      );

      expect(saga.next().done).toBe(true);
    });
  });
});


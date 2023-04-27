/* eslint-disable no-undef */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/no-jasmine-globals */

import { put, call, select, delay } from 'redux-saga/effects';
import {
  onRequestSaga,
  onSuccessSaga,
  onErrorSaga,
  isCurrentUserAndLatestUserTheSame,
} from '.';
import {
  APIException,
  throwExceptionUsingTheResponse,
  checkToThrowSessionValidationException,
  isCsrfExpired,
} from './utils';
import * as apiConsts from '../apiPaths';
import { unauthenticateAndDeleteProfile } from '../..';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { sendRequest } from '..';
import { handleLicenseErrors } from '../../handleLicenseErrors';

const status401 = new APIException({
  status: 401,
  message: 'Session expired',
});

describe('request interceptors...testing the various stages of an api request on how it is handled', () => {
  process.env.NODE_ENV = 'development';
  const jsonRespBody = JSON.stringify({ failure: 'some failure' });
  const textRespBody = "[{ failure: 'some failure' }]";
  const path = '/somePath';
  const method = 'GET';
  const protocol = 'someProtocol:';
  const host = 'someHost';
  const regular200Response = {
    status: 200,
    data: jsonRespBody,
  };
  const regular204Response = {
    status: 204,
    data: '',
  };
  const sessionError200Response = {
    status: 200,
    url: `${protocol}//${host}/signin`,
  };
  const some400Response = {
    status: 400,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    data: jsonRespBody,
  };
  const some500Response = {
    status: 500,
    headers: new Map([['content-type', 'application/text; charset=utf-8']]),
    data: textRespBody,
  };
  /*
  const some401Response = {
    status: 401,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    data: jsonRespBody,
  };
  */
  const some403Response = {
    status: 403,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    data: JSON.stringify({ message: 'Bad_Request_CSRF' }),
  };
  const actionWithMetaProxiedFromRequestAction = {
    request: {
      meta: {
        path,
        method,
      },
    },
  };

  describe('onRequestSaga', () => {
    const csrf = 'some value';

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn().mockImplementation(() => csrf),
      },
      writable: true,
    });

    test('default behavior: should make the api comm activity show up and the message of the comm activity being the path and request to "GET" if not defined', () => {
      const path = '/somePath';
      const opts = {};
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(call(isCurrentUserAndLatestUserTheSame));

      expect(saga.next(true).value).toEqual(select(selectors.resourceStatus, path, method));
      // defaults to a api request action with
      // message defaulting to the path
      // and comm activity not hidden
      // method is defaulted to get as well
      expect(saga.next({ retryCount: 0 }).value).toEqual(
        put(actions.api.request(path, 'GET', path, false, false))
      );
    });

    test('should introduce network latency in all requests', () => {
      const path = '/somePath';
      const opts = {};
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(call(isCurrentUserAndLatestUserTheSame));

      expect(saga.next(true).value).toEqual(select(selectors.resourceStatus, path, method));

      expect(saga.next({ retryCount: 0 }).value).toEqual(
        put(actions.api.request(path, 'GET', path, false, false))
      );
      expect(saga.next().value).toEqual(select(selectors.accountShareHeader, path));
    });

    test('should skip dispatching an apiRequest action when retrying', () => {
      const path = '/somePath';
      const opts = {};
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(call(isCurrentUserAndLatestUserTheSame));

      expect(saga.next(true).value).toEqual(select(selectors.resourceStatus, path, method));

      expect(saga.next({ retryCount: 1 }).value).toEqual(
        select(selectors.accountShareHeader, path)
      );
    });

    test('should create a request payload which should have match the redux saga request specification and responseType being text', () => {
      const path = '/somePath';
      const opts = { headers: { header1: 'something' }, method: 'POST' };
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(call(isCurrentUserAndLatestUserTheSame));

      expect(saga.next(true).value).toEqual(select(selectors.resourceStatus, path, 'POST'));

      expect(saga.next({ retryCount: 0 }).value).toEqual(
        put(actions.api.request(path, 'POST', path, false, false))
      );
      expect(saga.next().value).toEqual(select(selectors.accountShareHeader, path));

      // All request types are text
      const finalRequestPayload = {
        url: `/api${path}`,
        method: 'POST',
        responseType: 'text',
        credentials: 'same-origin',

        headers: {
          'x-csrf-token': csrf,
          header1: 'something',
          'Content-Type': 'application/json; charset=utf-8',
        },
        meta: {
          path,
          method: 'POST',
          origReq: request,
          shouldNotUpdateAuthTimestamp: false,
        },
      };

      expect(saga.next().value).toEqual(finalRequestPayload);
    });

    test('should create a request payload which should have match the redux saga request specification and responseType being text and with additional headers', () => {
      const path = '/somePath';
      const opts = {
        headers: { header1: 'something' },
        method: 'POST',
        body: { name: 'something', description: 'something else' },
      };
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(call(isCurrentUserAndLatestUserTheSame));
      expect(saga.next(true).value).toEqual(select(selectors.resourceStatus, path, 'POST'));

      expect(saga.next({ retryCount: 0 }).value).toEqual(
        put(actions.api.request(path, 'POST', path, false, false))
      );

      expect(saga.next().value).toEqual(select(selectors.accountShareHeader, path));
      const additionalHeaders = {
        'integrator-ashareid': 'some-ashare-id',
        'integrator-something': 'something else',
      };
      // All request types are text
      const finalRequestPayload = {
        url: `/api${path}`,
        method: 'POST',
        responseType: 'text',
        credentials: 'same-origin',

        headers: {
          'x-csrf-token': csrf,
          header1: 'something',
          'Content-Type': 'application/json; charset=utf-8',
          ...additionalHeaders,
        },
        body: JSON.stringify(opts.body),
        meta: {
          path,
          method: 'POST',
          origReq: request,
          shouldNotUpdateAuthTimestamp: false,
        },
      };

      expect(saga.next(additionalHeaders).value).toEqual(finalRequestPayload);
    });
  });
  describe('onSuccessSaga', () => {
    describe('session expired', () => {
      test('should throw a sessionExpired exception for 200 response with the signin uri', () => {
        apiConsts.getHostAndProtocol = jest.fn().mockImplementation(() => ({
          host,
          protocol,
        }));

        try {
          checkToThrowSessionValidationException(sessionError200Response);
          fail('It should throw an exception');
        } catch (e) {
          // TODO: wanted to do this `expect(e).toEqual(status401);`
          // but the node env isn't being injected correactly
          // resorting to verifying the status code and not the message
          expect(e.status).toBe(401);
        }
      });
      test('should not throw a sessionExpired exception for a non 200 response with the signin uri', () => {
        apiConsts.getHostAndProtocol = jest.fn().mockImplementation(() => ({
          host,
          protocol,
        }));

        checkToThrowSessionValidationException({
          ...sessionError200Response,
          status: 201,
        });
      });
    });

    describe('isCsrfExpired', () => {
      test('should return true for a valid CSRF message body', () => {
        expect(isCsrfExpired(some403Response)).toBe(true);
      });

      test('should return false for a invalid CSRF message body', () => {
        expect(isCsrfExpired(null)).toBe(false);
        expect(isCsrfExpired({})).toBe(false);
        expect(isCsrfExpired(some400Response)).toBe(false);
      });
    });

    describe('throwExceptionUsingTheResponse', () => {
      test('should throw an exception for a 400 level response with the json message stringified', () => {
        try {
          throwExceptionUsingTheResponse(some400Response);
          fail('It should throw an exception');
        } catch (e) {
          expect(e).toEqual({
            status: 400,
            message: jsonRespBody,
          });
        }
      });

      test('should throw an exception for a 500 level responses', () => {
        try {
          throwExceptionUsingTheResponse(some500Response);
          fail('It should throw an exception');
        } catch (e) {
          expect(e).toEqual({
            status: 500,
            message: textRespBody,
          });
        }
      });
    });
    test('If there is a session validation error in the response compose and throw an exception', () => {
      // since it would be a 200 level response we should handle it here
      apiConsts.getHostAndProtocol = jest.fn().mockImplementation(() => ({
        host,
        protocol,
      }));
      const saga = onSuccessSaga(
        sessionError200Response,
        actionWithMetaProxiedFromRequestAction
      );

      expect(saga.next().value).toEqual(
        call(checkToThrowSessionValidationException, sessionError200Response)
      );
      expect(saga.throw(status401).value).toEqual(
        call(unauthenticateAndDeleteProfile)
      );
      const apiCompleteEffect = put(actions.api.complete(path, method));

      expect(saga.next().value).toEqual(apiCompleteEffect);

      try {
        // after this effect an exception is thrown
        saga.next();
        // should not reach this effect
        fail('should throw an exception to the parent');
      } catch (e) {
        expect(e).toEqual(status401);
      }

      expect(saga.next().done).toBe(true);
    });

    test('if there is a successful response with a 204 status code it should respond with an undefined', () => {
      // all requests are of the type text this is because
      // redux saga requests cannot handle the parsing of
      // an empty response 204 status code

      const saga = onSuccessSaga(
        regular204Response,
        actionWithMetaProxiedFromRequestAction
      );

      expect(saga.next().value).toEqual(
        call(checkToThrowSessionValidationException, regular204Response)
      );
      const apiCompleteEffect = put(actions.api.complete(path, method));

      expect(saga.next().value).toEqual(apiCompleteEffect);
      expect(saga.next().value).toEqual(put(actions.auth.sessionTimestamp()));

      expect(saga.next().value).toEqual({ data: undefined, status: 204 });
    });

    test('if there is a successful response with a a 200 status code it should respond with a JSON object of the resp', () => {
      // all requests are of the type text this is because
      // redux saga requests cannot handle the parsing of
      // an empty response 204 status code

      const saga = onSuccessSaga(
        regular200Response,
        actionWithMetaProxiedFromRequestAction
      );

      expect(saga.next().value).toEqual(
        call(checkToThrowSessionValidationException, regular200Response)
      );
      const apiCompleteEffect = put(actions.api.complete(path, method));

      expect(saga.next().value).toEqual(apiCompleteEffect);
      expect(saga.next().value).toEqual(put(actions.auth.sessionTimestamp()));

      expect(saga.next().value).toEqual({ data: JSON.parse(jsonRespBody), status: 200 });
    });
  });

  describe('onErrorSaga', () => {
    describe('400 level errors', () => {
      // eslint-disable-next-line jest/no-commented-out-tests
      /*
      test('401 errors  should unauthenticate and delete', () => {
        const saga = onErrorSaga(
          some401Response,
          actionWithMetaProxiedFromRequestAction
        );
        const hidden = true;

        // complete the api request
        expect(saga.next().value).toEqual(call(unauthenticateAndDeleteProfile));
        expect(saga.next().value).toEqual(
          put(
            actions.api.failure(
              path,
              method,
              JSON.stringify(some401Response.data),
              hidden
            )
          )
        );

        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some401Response)
        );

        expect(saga.next().done).toBe(true);
      });
      */
      test('CSRF expiration errors(403 status code) should unauthenticate and delete', () => {
        const saga = onErrorSaga(
          some403Response,
          actionWithMetaProxiedFromRequestAction
        );
        const hidden = true;

        // complete the api request
        expect(saga.next().value).toEqual(call(unauthenticateAndDeleteProfile));
        expect(saga.next().value).toEqual(
          put(
            actions.api.failure(
              path,
              method,
              some403Response.data,
              hidden
            )
          )
        );

        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some403Response)
        );

        expect(saga.next().done).toBe(true);
      });

      test('for any other 400 level response just compose and throw an exception to the parent', () => {
        const saga = onErrorSaga(
          some400Response,
          actionWithMetaProxiedFromRequestAction
        );

        // complete the api request
        expect(saga.next().value).toEqual(
          put(
            actions.api.failure(
              path,
              method,
              some400Response.data
            )
          )
        );

        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some400Response)
        );

        expect(saga.next().done).toBe(true);
      });
    });
    describe('500 level errors', () => {
      const retryInterval = 2000;

      process.env.REATTEMPT_INTERVAL = retryInterval;
      test('should retry when the retry count is less than 3', () => {
        const path = '/somePath';
        const method = 'POST';
        const hidden = true;
        const message = 'some message';
        const someRequestBody = { a: 1 };
        const opts = {
          method,
          body: someRequestBody,
        };
        const request = { url: path, args: { path, opts, hidden, message } };
        const some500ResponseCreatingRequest = {
          request: {
            path,
            hidden,
            message,
            opts: {
              method,
              body: JSON.stringify(someRequestBody),
            },
            meta: {
              path,
              method,
              origReq: request,
            },
          },
        };
        const saga = onErrorSaga(
          some500Response,
          some500ResponseCreatingRequest
        );

        expect(saga.next().value).toEqual(select(selectors.resourceStatus, path, method));

        expect(saga.next({ retryCount: undefined }).value).toEqual(
          delay(retryInterval)
        );

        expect(saga.next().value).toEqual(put(actions.api.retry(path, method)));

        expect(saga.next().value).toEqual(
          call(
            sendRequest,
            request)
        );
        expect(saga.next().done).toBe(true);
      });

      test('should give up when the retry count exceeds the retry count limit and let the parent saga handle the exception', () => {
        const saga = onErrorSaga(
          some500Response,
          actionWithMetaProxiedFromRequestAction
        );

        expect(saga.next().value).toEqual(select(selectors.resourceStatus, path, method));

        expect(saga.next({ retryCount: 3 }).value).toEqual(
          put(actions.api.failure(path, method, some500Response.data))
        );
        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some500Response)
        );

        expect(saga.next().done).toBe(true);
      });
    });
    describe('onErrorSaga when it includes license code', () => {
      test('should test onErrorSage when the code includes entitlement_reached', () => {
        const code = ['entitlement_reached'];
        const message = ['You have reached the maximum number of trading partners for your subscription. Please contact sales to request an upgrade.'];
        const action = {
          request: {
            meta: {
              path: '/testPath',
              method: 'put',
            },
          },
        };
        const error = {
          data: '{"errors":[{"field":"_id","code":"entitlement_reached","message":"You have reached the maximum number of trading partners for your subscription. Please contact sales to request an upgrade."}]}',
        };

        const saga = onErrorSaga(
          error,
          action
        );

        expect(saga.next().value).toEqual(call(handleLicenseErrors, error, action.request.meta.path, action.request.meta.method, code, message));
      });
      test('should test onErrorSage when the code includes subscription_required', () => {
        const code = ['subscription_required'];
        const message = ['Subscription Required'];
        const action = {
          request: {
            meta: {
              path: '/testPath',
              method: 'put',
            },
          },
        };
        const error = {
          data: '{"errors":[{"field":"_id","code":"subscription_required","message":"Subscription Required"}]}',
        };

        const saga = onErrorSaga(
          error,
          action
        );

        expect(saga.next().value).toEqual(call(handleLicenseErrors, error, action.request.meta.path, action.request.meta.method, code, message));
      });
    });
  });
});

/* global describe, test, expect, jest */

import { put, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { sendRequest } from 'redux-saga-requests';
import {
  onRequestSaga,
  onSuccessSaga,
  onErrorSaga,
} from './requestInterceptors';
import {
  APIException,
  introduceNetworkLatency,
  throwExceptionUsingTheResponse,
  checkToThrowSessionValidationException,
} from './index';
import * as apiConsts from '../api/apiPaths';
import { unauthenticateAndDeleteProfile } from '..';
import actions from '../../actions';
import { resourceStatus } from '../../reducers';

const status401 = new APIException({
  status: 401,
  message: 'Session Expired',
});

describe('request interceptors...testing the various stages of an api request on how it is handled  ', () => {
  process.env.NODE_ENV = `development`;
  const jsonRespBody = { failure: 'some failure' };
  const textRespBody = "[{ failure: 'some failure' }]";
  const path = '/somePath';
  const protocol = 'someProtocol:';
  const host = 'someHost';
  const regular200Response = {
    status: 200,
    data: JSON.stringify(jsonRespBody),
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
  const some401Response = {
    status: 401,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    data: jsonRespBody,
  };
  const some403Response = {
    status: 403,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    data: jsonRespBody,
  };
  const actionWithMetaProxiedFromRequestAction = {
    request: {
      meta: {
        path,
      },
    },
  };

  describe('onRequestSaga', () => {
    window.sessionStorage = {};
    window.sessionStorage.getItem = jest.fn().mockImplementationOnce(() => {});

    test(`default behavior: should make the api comm activity show up and the message of the comm activity being the path and request to "GET" if not defined`, () => {
      const path = '/somePath';
      const opts = {};
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      // defaults to a api request action with
      // message defaulting to the path
      // and comm activity not hidden
      // method is defaulted to get as well
      expect(saga.next().value).toEqual(
        put(actions.api.request(path, path, false, 'GET'))
      );
    });

    test(`should introduce network latency in all requests`, () => {
      const path = '/somePath';
      const opts = {};
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(
        put(actions.api.request(path, path, false, 'GET'))
      );
      expect(saga.next().value).toEqual(call(introduceNetworkLatency));
    });

    test(`should create a request payload which should have match the redux saga request specification and responseType being text`, () => {
      const path = '/somePath';
      const opts = { headers: { header1: 'something' }, method: 'POST' };
      const args = { path, opts, hidden: undefined, message: undefined };
      const request = { url: path, args };
      const saga = onRequestSaga(request);

      expect(saga.next().value).toEqual(
        put(actions.api.request(path, path, false, 'POST'))
      );
      expect(saga.next().value).toEqual(call(introduceNetworkLatency));

      // All request types are text
      const finalRequestPayload = {
        url: `/api${path}`,
        method: 'POST',
        responseType: 'text',
        credentials: 'same-origin',

        headers: {
          'x-csrf-token': undefined,
          header1: 'something',
          'Content-Type': 'application/json; charset=utf-8',
        },
        meta: {
          path,
        },
      };

      expect(saga.next().value).toEqual(finalRequestPayload);
    });
  });
  describe('onSuccessSaga', () => {
    describe('session expired ', () => {
      test('should throw a sessionExpired exception for 200 response with the signin uri ', () => {
        apiConsts.getHostAndProtocol = jest.fn().mockImplementation(() => ({
          host,
          protocol,
        }));
        // TODO:this test case i have to force the env to run it
        // check why
        process.env.NODE_ENV = `development`;

        try {
          checkToThrowSessionValidationException(sessionError200Response);
          expect(true).toBe(false);
        } catch (e) {
          // TODO: I wanted to do this but its behaving erratically
          expect(e).toEqual(status401);
        }
      });
      test('should not throw a sessionExpired exception for a non 200 response with the signin uri ', () => {
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

    describe('throwExceptionUsingTheResponse', () => {
      test('throwExceptionUsingTheResponse test for 400 level responses', () => {
        try {
          throwExceptionUsingTheResponse(some400Response);
          expect(true).toEqual(false);
        } catch (e) {
          expect(e).toEqual({
            status: 400,
            message: JSON.stringify(jsonRespBody),
          });
        }
      });

      test('throwExceptionUsingTheResponse test for 500 level responses', () => {
        try {
          throwExceptionUsingTheResponse(some500Response);
          expect(true).toEqual(false);
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
      const apiCompleteEffect = put(actions.api.complete(path));

      expect(saga.next().value).toEqual(apiCompleteEffect);

      // dont like this try

      // TODO: I should better this test case
      try {
        expect(saga.throw(status401).value).toEqual(
          call(checkToThrowSessionValidationException, sessionError200Response)
        );

        expect(true).toBe(false);
      } catch (e) {
        // Check to see the parent saga receives an exception
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
      const apiCompleteEffect = put(actions.api.complete(path));

      expect(saga.next().value).toEqual(apiCompleteEffect);

      expect(saga.next().value).toEqual(
        call(checkToThrowSessionValidationException, regular204Response)
      );

      expect(saga.next().value).toBe(undefined);
    });

    test('if there is a successful response with a a 200 status code it should respond with a JSON object of the resp', () => {
      // all requests are of the type text this is because
      // redux saga requests cannot handle the parsing of
      // an empty response 204 status code

      const saga = onSuccessSaga(
        regular200Response,
        actionWithMetaProxiedFromRequestAction
      );
      const apiCompleteEffect = put(actions.api.complete(path));

      expect(saga.next().value).toEqual(apiCompleteEffect);

      expect(saga.next().value).toEqual(
        call(checkToThrowSessionValidationException, regular200Response)
      );

      expect(saga.next().value).toEqual(jsonRespBody);
    });
  });

  describe('onErrorSaga', () => {
    describe('400 level errors', () => {
      test('401 errors  should unauthenticate and delete', () => {
        const saga = onErrorSaga(
          some401Response,
          actionWithMetaProxiedFromRequestAction
        );

        // complete the api request
        expect(saga.next().value).toEqual(put(actions.api.complete(path)));
        expect(saga.next().value).toEqual(call(unauthenticateAndDeleteProfile));

        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some401Response)
        );

        expect(saga.next().done).toBe(true);
      });
      test('CSRF expiration errors(403 status code) should unauthenticate and delete', () => {
        const saga = onErrorSaga(
          some403Response,
          actionWithMetaProxiedFromRequestAction
        );

        // complete the api request
        expect(saga.next().value).toEqual(put(actions.api.complete(path)));
        expect(saga.next().value).toEqual(call(unauthenticateAndDeleteProfile));

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
        expect(saga.next().value).toEqual(put(actions.api.complete(path)));

        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some400Response)
        );

        expect(saga.next().done).toBe(true);
      });
    });
    describe('500 level errors', () => {
      test('should retry when the retry count is less than 3', () => {
        const saga = onErrorSaga(
          some500Response,
          actionWithMetaProxiedFromRequestAction
        );

        expect(saga.next().value).toEqual(select(resourceStatus, path));

        expect(saga.next({ retryCount: undefined }).value).toEqual(
          call(delay, 2000)
        );

        expect(saga.next().value).toEqual(put(actions.api.retry(path)));
        // resend the request ..silent false meta allows the
        // sendRequest to dispatch redux actions
        // otherwise its defaulted to true in an interceptor
        expect(saga.next().value).toEqual(
          call(sendRequest, actionWithMetaProxiedFromRequestAction, {
            silent: false,
          })
        );
        expect(saga.next().done).toBe(true);
      });

      test('should give up when the retry count exceeds the retry count limit and let the parent saga handle the exception', () => {
        const saga = onErrorSaga(
          some500Response,
          actionWithMetaProxiedFromRequestAction
        );

        expect(saga.next().value).toEqual(select(resourceStatus, path));

        expect(saga.next({ retryCount: 3 }).value).toEqual(
          put(actions.api.failure(path, some500Response.data))
        );
        expect(saga.next().value).toEqual(
          call(throwExceptionUsingTheResponse, some500Response)
        );

        expect(saga.next().done).toBe(true);
      });
    });
  });
});

/* global describe, test, jest ,beforeAll , afterAll, expect */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, cancelled} from 'redux-saga/effects';
import { extractResponse, sendRequest } from '.';
import { onRequestSaga, onSuccessSaga, onErrorSaga, onAbortSaga } from './requestInterceptors';
import { APIException } from './requestInterceptors/utils';

describe('sendRequest saga', () => {
  const request = {url: '/somePath', args: {method: 'GET'}};
  const fetchMock = jest.fn();
  const unmockedFetch = global.fetch;
  const onRequestGeneratedPayload = {
    url: '/somePath',
    method: 'GET',
    meta: {
      path: '/somePath',
      method: 'GET',
    },
  };

  beforeAll(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock;
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test('should call first onRequest saga to generate a requestPayload', () => {
    expectSaga(sendRequest, request)
      .provide([
        [call(onRequestSaga, request), onRequestGeneratedPayload],
      ])
      .call(onRequestSaga, request).run();
  });

  test('should call the onErrorSaga and bubble API exception when the response is in between a status code of 400 to 599', () => {
    const someErrorResp = {data: 'someErroredResponse',
      status: 401,
      url: '/somePath',
      method: 'GET' };
    const errorResponseException = new APIException({status: 401, message: 'someErroredResponse'});

    return expectSaga(sendRequest, request)
      .provide([
        [call(onRequestSaga, request), onRequestGeneratedPayload],
        [matchers.call.fn(fetch), someErrorResp],
        [matchers.call.fn(extractResponse), someErrorResp],
        [matchers.call.fn(onErrorSaga), throwError(errorResponseException)],

      ]).call.fn(onErrorSaga).throws(errorResponseException).silentRun();
  });

  test('should call the onErrorSaga when the fetch API throws an error in cases like the network connection is done', () => {
    // in cases like this it will try to retry until failure
    const fetchApiException = new Error('some fetch api error');

    return expectSaga(sendRequest, request)
      .provide([
        [call(onRequestSaga, request), onRequestGeneratedPayload],
        [matchers.call.fn(fetch), throwError(fetchApiException)],

      ]).call.fn(onErrorSaga).silentRun();
  });

  test('should call the onSuccessSaga and return the parsed data when the response is in between a status code is not 400 to 599', () => {
    const someSuccessResponse = {
      status: '201',
      url: '/somePath',
      method: 'GET',
      data: JSON.stringify({a: 'something'}),
    };

    const parsedSuccessResponse = {...someSuccessResponse, data: JSON.parse(someSuccessResponse.data)};

    return expectSaga(sendRequest, request)
      .provide([
        [call(onRequestSaga, request), onRequestGeneratedPayload],
        [matchers.call.fn(fetch), someSuccessResponse],
        [matchers.call.fn(extractResponse), someSuccessResponse],
        [matchers.call.fn(onSuccessSaga), parsedSuccessResponse],
      ]).call.fn(onSuccessSaga).returns({response: parsedSuccessResponse}).run();
  });

  test('should call the abort saga when the saga gets cancelled by the parent saga', () => {
    const saga = sendRequest(request);
    const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

    expect(saga.next().value).toEqual(call(onRequestSaga, request));
    expect(saga.next(onRequestGeneratedPayload).value).toEqual(call(fetch, '/somePath', expect.anything()));

    expect(saga.return().value).toEqual(cancelled());
    expect(saga.next(true).value).toEqual(call(onAbortSaga, expect.anything()));

    expect(saga.next().done).toBe(true);

    expect(abortSpy).toBeCalledTimes(1);
    abortSpy.mockRestore();
  });
});

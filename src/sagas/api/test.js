/* global describe, test, expect, jest, fail ,beforeAll , afterAll */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { extractResponse, sendRequest, onErrorSaga } from '.';
import { onRequestSaga, onSuccessSaga } from './requestInterceptors';

describe('sendRequest saga', () => {
  const request = {url: '/somePath', args: {method: 'GET'}};
  const mock = jest.fn();
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
    global.fetch = mock;
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  test('should call first onRequest saga to generate a requestPayload', () => {
    expectSaga(sendRequest, request)
      .call(onRequestSaga, request).run();
  });

  test('should call the onErrorSaga when the response is in between a status code of 400 to 599', () => expectSaga(sendRequest, request)
    .provide([

      [matchers.call.fn(onRequestSaga), onRequestGeneratedPayload],
      // return something
      [matchers.call.fn(fetch), {}],
      [matchers.call.fn(extractResponse), {data: 'someErroredResponse',
        status: '401',
        url: '/somePath',
        method: 'GET' }],
    ]).call.fn(onErrorSaga).run());

  test('should call the onSuccessSaga when the response is in between a status code is Not 400 to 599', () => expectSaga(sendRequest, request)
    .provide([

      [matchers.call.fn(onRequestSaga), onRequestGeneratedPayload],
      // return something
      [matchers.call.fn(fetch), {}],
      [matchers.call.fn(extractResponse), {data: 'someSuccessResponse',
        status: '201',
        url: '/somePath',
        method: 'GET' }],
    ]).call.fn(onSuccessSaga).run());
});

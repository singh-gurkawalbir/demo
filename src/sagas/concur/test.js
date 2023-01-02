
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call } from 'redux-saga/effects';
import { concurConnect } from '.';
// eslint-disable-next-line no-unused-vars
import { apiCallWithRetry } from '..';

import actions from '../../actions';
import { APIException } from '../api/requestInterceptors/utils';
import { getCSRFTokenBackend } from '../authentication';

describe('concur connect sagas', () => {
  test('should trigger success action correctly', () => expectSaga(concurConnect, { module: 'expense', id: 'id', requestToken: '123' })
    .provide([
      [call(getCSRFTokenBackend), 'someCsrf'],
      [call(apiCallWithRetry, {
        path: '/concurconnect/expense?id=id&requestToken=123',
        message: 'Validate concur module authentication',
        opts: {
          method: 'POST',
          body: {
            _csrf: 'someCsrf',
          },
        },
        hidden: true }), {sample: 'response'}],
    ])
    .call(getCSRFTokenBackend)
    .call(apiCallWithRetry, {
      path: '/concurconnect/expense?id=id&requestToken=123',
      message: 'Validate concur module authentication',
      opts: {
        method: 'POST',
        body: {
          _csrf: 'someCsrf',
        },
      },
      hidden: true })
    .put(actions.concur.connectSuccess({sample: 'response'}))
    .run());

  test('should trigger error action correctly', () => expectSaga(concurConnect, { module: 'expense', id: 'id', requestToken: '123' })
    .provide([
      [call(getCSRFTokenBackend), 'someCsrf'],
      [call(apiCallWithRetry, {
        path: '/concurconnect/expense?id=id&requestToken=123',
        message: 'Validate concur module authentication',
        opts: {
          method: 'POST',
          body: {
            _csrf: 'someCsrf',
          },
        },
        hidden: true }), throwError(new APIException({
        status: 422,
        message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
      }))],
    ])
    .call(getCSRFTokenBackend)
    .call(apiCallWithRetry, {
      path: '/concurconnect/expense?id=id&requestToken=123',
      message: 'Validate concur module authentication',
      opts: {
        method: 'POST',
        body: {
          _csrf: 'someCsrf',
        },
      },
      hidden: true })
    .put(actions.concur.connectError(['Invalid or Missing Field: time_lte']))
    .run());
});

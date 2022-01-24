/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { call } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { cancel, preview, create } from '.';

describe('cancel saga', () => {
  const id = 'J1';

  test('should able to cancel trasfer successfully', () => {
    const cancelResponce = {status: '200'};

    return expectSaga(cancel, { id })
      .provide([
        [matchers.call.fn(apiCallWithRetry), cancelResponce],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.transfer.canceledTransfer(id))
      .run();
  });
  test('should handle api error properly', () => {
    const error = new Error('error');
    const path = `/transfers/${id}/cancel`;

    return expectSaga(cancel, { id })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.api.failure(path, 'PUT', error, false))
      .run();
  });
});

describe('preview saga', () => {
  test('should able to get preview successfully if there are _integrationIds in data', () => {
    const data = {_integrationIds: ['123', '456'], email: 'abc@celigo.com'};
    const args = {
      path: `/transfers/preview?email=${encodeURIComponent(data.email)}&_integrationIds=${JSON.stringify(data._integrationIds)}`,
      opts: { method: 'GET' },
      hidden: true,
    };
    const response = {_integrationIds: ['123', '456']};

    return expectSaga(preview, { data })
      .provide([
        [call(apiCallWithRetry, args), response],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.transfer.receivedPreview({ response }))
      .run();
  });
  test('should handle error properly if _integrationIds of data cannot be stringified', () => {
    const data = { email: 'abc@celigo.com', _integrationIds: {x: 2n} };
    const path = `/transfers/preview?email=${encodeURIComponent(data.email)}`;
    const error = TypeError('Do not know how to serialize a BigInt');

    return expectSaga(preview, { data })
      .put(actions.api.failure(path, 'GET', error, false))
      .not.call.fn(apiCallWithRetry)
      .returns(true)
      .run();
  });
  test('should able to get preview successfully if there are no _integrationIds in data', () => {
    const data = { email: 'abc@celigo.com' };
    const response = {_integrationIds: []};
    const args = {
      path: `/transfers/preview?email=${encodeURIComponent(data.email)}`,
      opts: { method: 'GET' },
      hidden: true,
    };

    return expectSaga(preview, { data })
      .provide([
        [call(apiCallWithRetry, args), response],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.transfer.receivedPreview({ response }))
      .run();
  });
  test('should able to get preview successfully if there is no data', () => {
    const data = undefined;
    const response = {_integrationIds: []};
    const args = {
      path: '/transfers/preview',
      opts: { method: 'GET' },
      hidden: true,
    };

    return expectSaga(preview, { data })
      .provide([
        [call(apiCallWithRetry, args), response],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.transfer.receivedPreview({ response }))
      .run();
  });
  test('should handle api error properly', () => {
    const data = {_integrationIds: ['123', '456'], email: 'abc@celigo.com'};
    const args = {
      path: `/transfers/preview?email=${encodeURIComponent(data.email)}&_integrationIds=${JSON.stringify(data._integrationIds)}`,
      opts: { method: 'GET' },
      hidden: true,
    };
    const error = new Error('error');

    return expectSaga(preview, { data })
      .provide([
        [call(apiCallWithRetry, args), throwError(error)],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.transfer.receivedPreview({ error }))
      .run();
  });
});

describe('create saga', () => {
  const data = { _transferId: 'j1', something: 'some thing' };

  test('should able to create transfer successfully', () => {
    const transferResponse = { _transferId: 'j1', something: 'some thing' };

    return expectSaga(create, { data })
      .provide([
        [matchers.call.fn(apiCallWithRetry), transferResponse],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.resource.received('transfers', transferResponse))
      .run();
  });

  test('should handle api error properly', () => {
    const error = new Error();
    const path = '/transfers/invite';

    return expectSaga(create, { data })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.api.failure(path, 'POST', error, false))
      .run();
  });
});

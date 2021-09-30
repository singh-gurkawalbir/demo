/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
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
  const data = {_integrationIds: ['123', '456'], email: 'abc@celigo.com'};

  test('should able to get preview successfully', () => {
    const response = {_integrationIds: ['123', '456']};

    return expectSaga(preview, { data })
      .provide([
        [matchers.call.fn(apiCallWithRetry), response],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.transfer.receivedPreview({ response }))
      .run();
  });
  test('should handle api error properly', () => {
    const error = new Error('error');

    return expectSaga(preview, { data })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(apiCallWithRetry)
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

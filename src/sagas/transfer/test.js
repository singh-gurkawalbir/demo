/* global describe, test, expect */

import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
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
    const saga = cancel({ id });

    const path = `/transfers/${id}/cancel`;
    const opts = { method: 'PUT' };
    const error = new Error();

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path, opts })
    );
    expect(saga.throw(error).value).toEqual(
      put(actions.api.failure(path, 'PUT', error, false))
    );
    expect(saga.next().done).toEqual(true);
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
    const saga = preview({ data });

    const opts = { method: 'GET' };
    let path = '/transfers/preview';

    if (data) {
      path += `?email=${encodeURIComponent(data.email)}`;

      if (data._integrationIds) {
        path += `&_integrationIds=${JSON.stringify(data._integrationIds)}`;
      }
    }
    const error = new Error();

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path, opts, hidden: true})
    );
    expect(saga.throw(error).value).toEqual(
      put(actions.transfer.receivedPreview({ error }))
    );
    expect(saga.next().done).toEqual(true);
  });
});

describe('create saga', () => {
  const data = { _transferId: 'j1', something: 'some thing' };

  test('should able to create trasfer successfully', () => {
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
    const path = '/transfers/invite';
    const data = { _transferId: 'j1', something: 'some thing' };
    const opts = {
      method: 'POST',
      body: data,
    };
    const saga = create({ data });

    const error = new Error();

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path, opts })
    );
    expect(saga.throw(error).value).toEqual(
      put(actions.api.failure(path, 'POST', error, false))
    );
    expect(saga.next().done).toEqual(true);
  });
});

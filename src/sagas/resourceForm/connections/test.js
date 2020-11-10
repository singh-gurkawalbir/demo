/* global describe, test, expect */

import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {newIAFrameWorkPayload} from '../index';
import inferErrorMessage from '../../../utils/inferErrorMessage';
import { requestIClients, pingAndUpdateConnection, pingConnection, createPayload } from '.';
import { pingConnectionParams } from '../../api/apiPaths';

describe('ping and update connection saga', () => {
  const connectionId = 'C1';

  test('should able to ping and update connection successfully', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionResourcePath = `/connections/${connectionId}`;
    const mockResourceReferences =
      { name: 'connection1', id: 1};

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionResourcePath, hidden: true })
    );
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(
      put(actions.resource.received('connections', mockResourceReferences))
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionResourcePath = `/connections/${connectionId}`;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionResourcePath, hidden: true })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});
describe('ping connection saga', () => {
  const resourceId = 'C1';

  const values = {name: 'conn1'};

  test('should able to ping connection successfully ', () => {
    const connectionPayload = { name: 'new Connection' };
    const response = {status: 'success'};

    return expectSaga(pingConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), response],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(
        actions.resource.connections.testSuccessful(
          resourceId,
          'Connection is working fine!'
        )
      )
      .run();
  });

  test('should able to throw error message if any', () => {
    const connectionPayload = { name: 'new Connection' };
    const resp = {errors: ['Errors']};

    return expectSaga(pingConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), resp],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(
        actions.resource.connections.testErrored(
          resourceId,
          inferErrorMessage(resp)
        )
      )
      .run();
  });
  test('should handle api error properly', () => {
    const saga = pingConnection({ resourceId, values });

    expect(saga.next().value).toEqual(
      call(createPayload, {
        values,
        resourceType: 'connections',
        resourceId,
      })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path: pingConnectionParams.path,
        opts: {
          body: undefined,
          ...pingConnectionParams.opts,
        },
        hidden: true,
      })
    );
    const error = new Error();

    expect(saga.throw(error).value).toEqual(
      put(actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessage(error?.message)
      ))
    );
  });
});
describe('request IClients saga', () => {
  const connectionId = 'C1';

  test('should able to to get IClients successfully', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = `/connections/${connectionId}/iclients`;

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = `/connections/${connectionId}/iclients`;

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

/* global describe, test, expect */

import { call, put } from 'redux-saga/effects';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {newIAFrameWorkPayload} from '../index';
import { requestIClients, pingAndUpdateConnection } from '.';

describe('ping saga', () => {
  const connectionId = 'C1';

  test('should able to ping and update connection successfully', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionReourcePath = `/connections/${connectionId}`;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionReourcePath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.received('connections', undefined))
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionReourcePath = `/connections/${connectionId}`;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionReourcePath, hidden: true })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

describe('request IClients saga', () => {
  const connectionId = 'C1';

  test('should able to ping and update connection successfully', () => {
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

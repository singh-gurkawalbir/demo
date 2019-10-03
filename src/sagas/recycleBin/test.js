/* global describe, test, expect */
import { call, put, all } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { restore, purge } from './';
import { recycleBinDependencies } from '../../constants/resource';

describe('restore saga', () => {
  const resourceType = 'exports';
  const resourceId = '123';
  const path = `/recycleBinTTL/${resourceType}/${resourceId}/doCascadeRestore`;

  test('should succeed on successful api call', () => {
    const saga = restore({ resourceType, resourceId });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: {},
        },
      })
    );
    expect(saga.next().value).toEqual(
      all(
        recycleBinDependencies[resourceType].map(resources =>
          put(actions.resource.requestCollection(resources))
        )
      )
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('recycleBinTTL'))
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = restore({ resourceType, resourceId });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: {},
        },
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});
describe('purge saga', () => {
  const resourceType = 'imports';
  const resourceId = '456';
  const path = `/recycleBinTTL/${resourceType}/${resourceId}`;

  test('should succeed on successful api call', () => {
    const saga = purge({ resourceType, resourceId });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'DELETE',
        },
      })
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('recycleBinTTL'))
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = purge({ resourceType, resourceId });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'DELETE',
        },
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

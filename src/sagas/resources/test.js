/* global describe, test, expect */
import { call, put, select } from 'redux-saga/effects';
import actions, { availableResources } from '../../actions';
import {
  commitStagedChanges,
  getResource,
  getResourceCollection,
  getRequestOptions,
} from './';
import { apiCallWithRetry } from '../';
import { status500 } from '../test';
import * as selectors from '../../reducers';
import { ACCOUNT_IDS } from '../../utils/constants';

describe('getRequestOptions saga', () => {
  describe('checks for org owner.', () => {
    test('should not add integrator-ashareid header for paths that do not need it.', () => {
      const saga = getRequestOptions('/licenses');

      expect(saga.next().value).toEqual({
        headers: {},
      });
      expect(saga.next().done).toEqual(true);
    });
    test('should not add integrator-ashareid header for paths that do need it for org users.', () => {
      const saga = getRequestOptions('/exports');

      expect(saga.next().value).toEqual(select(selectors.userPreferences));
      expect(saga.next({ defaultAShareId: ACCOUNT_IDS.OWN }).value).toEqual({
        headers: {},
      });
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('checks for org users.', () => {
    test('should not add integrator-ashareid header for paths that do not need it.', () => {
      const saga = getRequestOptions('/licenses');

      expect(saga.next().value).toEqual({
        headers: {},
      });
      expect(saga.next().done).toEqual(true);
    });
    test('should add integrator-ashareid header for paths that need it.', () => {
      const saga = getRequestOptions('/exports');

      expect(saga.next().value).toEqual(select(selectors.userPreferences));
      expect(saga.next({ defaultAShareId: 'ashare1' }).value).toEqual({
        headers: {
          'integrator-ashareid': 'ashare1',
        },
      });
      expect(saga.next().done).toEqual(true);
    });
  });
});

describe('commitStagedChanges saga', () => {
  const id = 1;
  const resourceType = 'dogs';

  test('should do nothing if no staged changes exist.', () => {
    const saga = commitStagedChanges({ resourceType, id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(
      select(selectors.resourceData, resourceType, id)
    );

    const effect = saga.next({});

    expect(effect.done).toEqual(true);
  });

  describe('update existing resource', () => {
    test('should complete with dispatch of conflict and received actions when origin does not match master.', () => {
      const saga = commitStagedChanges({ resourceType, id });
      const selectEffect = saga.next().value;

      expect(selectEffect).toEqual(
        select(selectors.resourceData, resourceType, id)
      );

      expect(
        saga.next({ master: { lastModified: 50 }, patch: true }).value
      ).toEqual(call(getRequestOptions, `/${resourceType}/${id}`));

      expect(saga.next({ headers: {} }).value).toEqual(
        call(apiCallWithRetry, {
          path: `/${resourceType}/${id}`,
          opts: { headers: {} },
        })
      );

      const origin = { id, lastModified: 100 };
      const putEffect = saga.next(origin).value;
      const conflict = [
        {
          op: 'add',
          path: '/id',
          value: 1,
        },
      ];

      expect(putEffect).toEqual(
        put(actions.resource.commitConflict(id, conflict))
      );

      expect(saga.next().value).toEqual(
        put(actions.resource.received(resourceType, origin))
      );

      const finalEffect = saga.next();

      expect(finalEffect).toEqual({ done: true, value: undefined });
    });

    test('should complete with dispatch of received and clear stage actions when commit succeeds.', () => {
      const saga = commitStagedChanges({ resourceType, id });
      const selectEffect = saga.next().value;

      expect(selectEffect).toEqual(
        select(selectors.resourceData, resourceType, id)
      );

      const origin = { id, lastModified: 100 };
      const merged = { id, lastModified: 100 };
      const path = `/${resourceType}/${id}`;
      const requestOptions = {
        headers: {
          'integrator-ashareid': 'ashare1',
        },
      };
      const getCallEffect = saga.next({
        master: { lastModified: 100 },
        merged,
        patch: true,
      }).value;

      expect(getCallEffect).toEqual(call(getRequestOptions, path));
      expect(saga.next(requestOptions).value).toEqual(
        call(apiCallWithRetry, { path, opts: requestOptions })
      );

      const putCallEffect = saga.next(merged, origin).value;

      expect(putCallEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
            headers: requestOptions.headers,
          },
        })
      );

      const updated = { id: 1 };
      const putEffect = saga.next(updated).value;

      expect(putEffect).toEqual(
        put(actions.resource.received(resourceType, updated))
      );

      expect(saga.next().value).toEqual(put(actions.resource.clearStaged(id)));

      const finalEffect = saga.next();

      expect(finalEffect).toEqual({ done: true, value: undefined });
    });
  });

  describe('create new resource', () => {
    test('should complete with dispatch of received+created resource actions.', () => {
      const tempId = 'new-123';
      const newResource = { name: 'bob' };
      const saga = commitStagedChanges({ resourceType, id: tempId });
      const selectEffect = saga.next().value;

      expect(selectEffect).toEqual(
        select(selectors.resourceData, resourceType, tempId)
      );

      const getCallEffect = saga.next({
        master: null,
        merged: newResource,
        patch: true,
      }).value;
      const requestOptions = {
        headers: {
          'integrator-ashareid': 'ashare1',
        },
      };
      const path = `/${resourceType}`;

      expect(getCallEffect).toEqual(call(getRequestOptions, path));
      expect(saga.next(requestOptions).value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            ...requestOptions,
            method: 'post',
            body: newResource,
          },
        })
      );

      const updated = { _id: 1 };
      const putEffect = saga.next(updated).value;

      expect(putEffect).toEqual(
        put(actions.resource.received(resourceType, updated))
      );

      expect(saga.next().value).toEqual(
        put(actions.resource.clearStaged(tempId))
      );

      expect(saga.next().value).toEqual(
        put(actions.resource.created(updated._id, tempId))
      );

      const finalEffect = saga.next();

      expect(finalEffect).toEqual({ done: true, value: undefined });
    });
  });
});

availableResources.forEach(type => {
  describe(`getResource("${type}", id) saga`, () => {
    const id = 123;

    test('should succeed on successful api call', () => {
      // assign

      const saga = getResource(actions.resource.request(type, id));
      const path = `/${type}/${id}`;
      const mockResource = { id: 1, name: 'bob' };
      // act
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(getRequestOptions, path));
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));

      const effect = saga.next(mockResource).value;

      expect(effect).toEqual(
        put(actions.resource.received(type, mockResource))
      );

      const final = saga.next();

      expect(final.done).toBe(true);
      expect(final.value).toEqual(mockResource);
    });

    test('should return undefined if api call fails', () => {
      // assign
      const saga = getResource(actions.resource.request(type, id));
      const path = `/${type}/${id}`;
      // act
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(getRequestOptions, path));
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));

      const final = saga.throw(status500);

      expect(final.done).toBe(true);
      expect(final.value).toBeUndefined();
    });
  });

  describe(`getResourceCollection("${type}") saga`, () => {
    test('should succeed on successful api call', () => {
      const saga = getResourceCollection(
        actions.resource.requestCollection(type)
      );
      const path = `/${type}`;
      const mockCollection = [{ id: 1 }, { id: 2 }];
      // next() of generator functions always return:
      // { done: [true|false], value: {[right side of yield]} }
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(getRequestOptions, path));
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));

      const effect = saga.next(mockCollection).value;

      expect(effect).toEqual(
        put(actions.resource.receivedCollection(type, mockCollection))
      );

      const final = saga.next();

      expect(final.done).toBe(true);
      expect(final.value).toEqual(mockCollection);
    });

    test('should return undefined if api call fails', () => {
      const saga = getResourceCollection(
        actions.resource.requestCollection(type)
      );
      const path = `/${type}`;
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(getRequestOptions, path));
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));

      const final = saga.throw(status500);

      expect(final.done).toBe(true);
      expect(final.value).toBeUndefined();
    });
  });
});

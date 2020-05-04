/* global describe, test, expect, beforeEach */
import { call, put, select } from 'redux-saga/effects';
import actions, { availableResources } from '../../actions';
import {
  commitStagedChanges,
  getResource,
  getResourceCollection,
  deleteResource,
  requestReferences,
  requestDeregister,
  normalizeFlow,
  resourceConflictDetermination,
} from './';
import { apiCallWithRetry } from '../';
import { status500 } from '../test';
import * as selectors from '../../reducers';
import { SCOPES } from '../resourceForm';
import { APIException } from '../api';
import { resourceConflictResolution } from '../utils';

describe('commitStagedChanges saga', () => {
  const id = '1';
  const resourceType = 'dogs';
  const path = '/dogs/1';

  test('should do nothing if no staged changes exist.', () => {
    const saga = commitStagedChanges({ resourceType, id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.userPreferences));

    expect(saga.next().value).toEqual(
      select(selectors.resourceData, resourceType, id, undefined)
    );

    const effect = saga.next({});

    expect(effect.done).toEqual(true);
  });

  describe('update existing resource', () => {
    test('the commitStagedChanges saga should exit when the resourceConflictDetermination reports an error or a conflict ', () => {
      const saga = commitStagedChanges({ resourceType, id });
      const selectEffect = saga.next().value;

      expect(selectEffect).toEqual(select(selectors.userPreferences));

      expect(saga.next().value).toEqual(
        select(selectors.resourceData, resourceType, id, undefined)
      );
      const merged = { lastModified: 50 };

      expect(saga.next({ merged, patch: true }).value).toEqual(
        call(resourceConflictDetermination, {
          path,
          merged,
          id,
          scope: undefined,
          resourceType,
        })
      );

      const finalEffect = saga.next({ conflict: true });

      expect(finalEffect).toEqual({ done: true, value: { conflict: true } });
    });

    test('should complete with dispatch of received and clear stage actions when commit succeeds.', () => {
      const saga = commitStagedChanges({ resourceType, id });
      const selectEffect = saga.next().value;

      expect(selectEffect).toEqual(select(selectors.userPreferences));

      expect(saga.next().value).toEqual(
        select(selectors.resourceData, resourceType, id, undefined)
      );

      const merged = { id, lastModified: 100 };
      const path = `/${resourceType}/${id}`;
      const master = { lastModified: 100 };
      const getCallEffect = saga.next({
        master,
        merged,
        patch: true,
      }).value;

      expect(getCallEffect).toEqual(
        call(resourceConflictDetermination, {
          path,
          merged,
          id,
          scope: undefined,
          resourceType,
          master,
        })
      );

      const putCallEffect = saga.next({ merged, conflict: false }).value;

      expect(putCallEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
          },
        })
      );

      const updated = { _id: 1 };
      const putEffect = saga.next(updated).value;

      expect(putEffect).toEqual(
        put(actions.resource.received(resourceType, updated))
      );

      expect(saga.next().value).toEqual(
        put(
          actions.resource.updated(
            resourceType,
            updated._id,
            { lastModified: 100 },
            true
          )
        )
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

      expect(selectEffect).toEqual(select(selectors.userPreferences));

      expect(saga.next().value).toEqual(
        select(selectors.resourceData, resourceType, tempId, undefined)
      );

      const path = `/${resourceType}`;

      expect(
        saga.next({
          master: null,
          merged: newResource,
          patch: true,
        }).value
      ).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
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
        put(actions.resource.created(updated._id, tempId, resourceType))
      );

      const finalEffect = saga.next();

      expect(finalEffect).toEqual({ done: true, value: undefined });
    });
  });

  describe('resourceConflictDetermination saga', () => {
    const _400Exception = new APIException({
      status: 400,
      message: 'Session Expired',
    });
    const path = '/somePath';
    const someMaster = {
      lastModified: '12',
      someProp: 'def',
      commonProp1: 'a',
      commonProp2: 'b',
    };
    const someMerged = {
      lastModified: '12',
      someProp: 'abc',
      commonProp1: 'a',
      commonProp2: 'b',
    };
    const someOrigin = {
      lastModified: '15',
      commonProp1: 'a',
      commonProp2: 'c',
    };
    const id = '123';
    const scope = SCOPES.VALUE;
    const resourceType = 'someResourceType';
    const someConflicts = [
      { path: '/a', value: 'abcddfdfd', operation: 'replace' },
    ];
    let saga;

    beforeEach(() => {
      saga = resourceConflictDetermination({
        path,
        merged: someMerged,
        id,
        scope,
        resourceType,
        master: someMaster,
      });
    });

    test('should report a conflict when the resourceConflictResolution determines a conflict', () => {
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));
      expect(saga.next(someOrigin).value).toEqual(
        put(actions.resource.received(resourceType, someOrigin))
      );

      expect(saga.next().value).toEqual(
        resourceConflictResolution({
          merged: someMerged,
          master: someMaster,
          origin: someOrigin,
        })
      );

      expect(
        saga.next({ conflict: someConflicts, merged: someMerged }).value
      ).toEqual(put(actions.resource.commitConflict(id, someConflicts, scope)));
      expect(saga.next()).toEqual({
        done: true,
        value: { merged: someMerged, conflict: true },
      });
    });

    test('should not report a conflict when the resourceConflictResolution determines there isn`t any conflict ', () => {
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));
      expect(saga.next(someOrigin).value).toEqual(
        put(actions.resource.received(resourceType, someOrigin))
      );

      expect(saga.next().value).toEqual(
        resourceConflictResolution({
          merged: someMerged,
          master: someMaster,
          origin: someOrigin,
        })
      );

      expect(saga.next({ conflict: null, merged: someMerged })).toEqual({
        done: true,
        value: { merged: someMerged, conflict: false },
      });
    });

    test('should exit the saga and return an error when the call to origin fails', () => {
      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path }));
      expect(saga.throw(_400Exception)).toEqual({
        done: true,
        value: {
          error: {
            status: 400,
            message: 'Session Expired',
          },
        },
      });
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

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

      if (type === 'flows') {
        expect(saga.next(mockResource).value).toEqual(
          call(normalizeFlow, mockResource)
        );
      }

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

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

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
      let mockCollection = [{ id: 1 }, { id: 2 }];
      let mockSharedStacks = [{ id: 3 }, { id: 4 }];
      let effect;
      // next() of generator functions always return:
      // { done: [true|false], value: {[right side of yield]} }
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

      if (type === 'stacks') {
        expect(saga.next(mockCollection).value).toEqual(
          call(apiCallWithRetry, { path: '/shared/stacks' })
        );
        mockSharedStacks = mockSharedStacks.map(stack => ({
          ...stack,
          shared: true,
        }));
        mockCollection = [...mockCollection, ...mockSharedStacks];
        effect = saga.next(mockSharedStacks).value;
      } else {
        effect = saga.next(mockCollection).value;
      }

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

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

      const final = saga.throw(status500);

      expect(final.done).toBe(true);
      expect(final.value).toBeUndefined();
    });
  });

  describe(`deleteResource("${type}", id) saga`, () => {
    const id = 123;

    test('should succeed to delete for empty references', () => {
      // assign
      const resourceReferences = {};
      const saga = deleteResource(actions.resource.delete(type, id));
      const path = `/${type}/${id}`;

      expect(saga.next().value).toEqual(
        call(requestReferences, {
          resourceType: type,
          id,
        })
      );

      const callEffect = saga.next(resourceReferences).value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'DELETE',
          },
          message: `Deleting ${type}`,
        })
      );

      const effect = saga.next().value;

      expect(effect).toEqual(put(actions.resource.deleted(type, id)));

      const final = saga.next();

      expect(final.done).toBe(true);
    });
    test('should fail to delete for non-empty references', () => {
      // assign

      const resourceReferences = { exports: [{ _id: '1' }, { _id: '2' }] };
      const saga = deleteResource(actions.resource.delete(type, id));

      expect(saga.next().value).toEqual(
        call(requestReferences, {
          resourceType: type,
          id,
        })
      );
      const final = saga.next(resourceReferences);

      expect(final.value).toEqual(undefined);

      expect(final.done).toBe(true);
    });

    test('should return undefined if api call fails', () => {
      // assign
      const resourceReferences = {};
      const saga = deleteResource(actions.resource.delete(type, id));
      const path = `/${type}/${id}`;
      // act

      expect(saga.next().value).toEqual(
        call(requestReferences, {
          resourceType: type,
          id,
        })
      );
      const callEffect = saga.next(resourceReferences).value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'DELETE',
          },
          message: `Deleting ${type}`,
        })
      );

      const final = saga.throw(new Error('some API exception'));

      expect(final.done).toBe(true);
    });
  });
  describe(`requestReferences("${type}", id) saga`, () => {
    const id = 123;

    test('should succeed on successful api call', () => {
      // assign

      const saga = requestReferences(
        actions.resource.requestReferences(type, id)
      );
      const path = `/${type}/${id}/dependencies`;
      const mockResourceReferences = {
        // eslint-disable-next-line prettier/prettier
        imports: [{ name: 'import1', id: 1 }, { name: 'import2', id: 2 }],
        // eslint-disable-next-line prettier/prettier
        exports: [{ name: 'export1', id: 1 }, { name: 'export2', id: 2 }]
      };
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, { path, hidden: false })
      );

      const effect = saga.next(mockResourceReferences).value;

      expect(effect).toEqual(
        put(actions.resource.receivedReferences(mockResourceReferences))
      );

      const final = saga.next();

      expect(final.done).toBe(true);
    });

    test('should return undefined if api call fails', () => {
      // assign
      const saga = requestReferences(
        actions.resource.requestReferences(type, id)
      );
      const path = `/${type}/${id}/dependencies`;
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, { path, hidden: false })
      );

      const final = saga.throw(new Error('some API exception'));

      expect(final.done).toBe(true);
    });
  });
});

describe(`Deregister connection Saga`, () => {
  const integrationId = 143;
  const connectionId = 123;

  test('should succeed on successful api call', () => {
    const saga = requestDeregister(
      actions.connection.requestDeregister(connectionId, integrationId)
    );
    const path = `/integrations/${integrationId}/connections/${connectionId}/register`;
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'DELETE',
        },
        message: `Deregistering Connection`,
      })
    );

    const effect = saga.next().value;

    expect(effect).toEqual(
      put(actions.connection.completeDeregister(connectionId, integrationId))
    );

    const final = saga.next();

    expect(final.done).toBe(true);
  });

  test('should return undefined if api call fails', () => {
    const saga = requestDeregister(
      actions.connection.requestDeregister(connectionId, integrationId)
    );
    const path = `/integrations/${integrationId}/connections/${connectionId}/register`;
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'DELETE',
        },
        message: `Deregistering Connection`,
      })
    );

    const final = saga.throw(new Error('some API exception'));

    expect(final.done).toBe(true);
  });
});

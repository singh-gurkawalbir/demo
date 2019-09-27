/* global describe, test, expect */
import { call, put, select, delay } from 'redux-saga/effects';
import actions, { availableResources } from '../../actions';
import {
  commitStagedChanges,
  getResource,
  getResourceCollection,
  deleteResource,
  requestReferences,
  displayToken,
  generateToken,
  requestDeregister,
} from './';
import { apiCallWithRetry } from '../';
import { status500 } from '../test';
import * as selectors from '../../reducers';
import getRequestOptions from '../../utils/requestOptions';
import actionTypes from '../../actions/types';

describe('commitStagedChanges saga', () => {
  const id = '1';
  const resourceType = 'dogs';

  test('should do nothing if no staged changes exist.', () => {
    const saga = commitStagedChanges({ resourceType, id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(
      select(selectors.resourceData, resourceType, id, undefined)
    );

    const effect = saga.next({});

    expect(effect.done).toEqual(true);
  });

  describe('update existing resource', () => {
    test('should complete with dispatch of conflict and received actions when origin does not match master.', () => {
      const saga = commitStagedChanges({ resourceType, id });
      const selectEffect = saga.next().value;

      expect(selectEffect).toEqual(
        select(selectors.resourceData, resourceType, id, undefined)
      );

      expect(
        saga.next({ master: { lastModified: 50 }, patch: true }).value
      ).toEqual(
        call(apiCallWithRetry, {
          path: `/${resourceType}/${id}`,
        })
      );

      const origin = { id, lastModified: 100 };
      const putEffect = saga.next(origin).value;
      const conflict = [
        {
          op: 'add',
          path: '/id',
          value: id,
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
        select(selectors.resourceData, resourceType, id, undefined)
      );

      const origin = { id, lastModified: 100 };
      const merged = { id, lastModified: 100 };
      const path = `/${resourceType}/${id}`;
      const getCallEffect = saga.next({
        master: { lastModified: 100 },
        merged,
        patch: true,
      }).value;

      expect(getCallEffect).toEqual(call(apiCallWithRetry, { path }));

      const putCallEffect = saga.next(merged, origin).value;

      expect(putCallEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
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

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

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
        imports: [{ name: 'import1', id: 1 }, { name: 'import2', id: 2 }],
        exports: [{ name: 'export1', id: 1 }, { name: 'export2', id: 2 }],
      };
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

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

      expect(callEffect).toEqual(call(apiCallWithRetry, { path }));

      const final = saga.throw(new Error('some API exception'));

      expect(final.done).toBe(true);
    });
  });
});

describe('displayToken saga', () => {
  test('should display token successfully', () => {
    const tokenId = 'something';
    const tokenInPlainText = 'token in plain text';
    const saga = displayToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Getting Token',
      })
    );
    expect(saga.next({ _id: tokenId, token: tokenInPlainText }).value).toEqual(
      put(
        actions.accessToken.tokenReceived({
          _id: tokenId,
          token: tokenInPlainText,
        })
      )
    );
    expect(saga.next().value).toEqual(
      delay(process.env.MASK_SENSITIVE_INFO_DELAY)
    );
    expect(saga.next().value).toEqual(
      put(
        actions.accessToken.maskToken({
          _id: tokenId,
        })
      )
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly while displaying token', () => {
    const tokenId = 'something';
    const saga = displayToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Getting Token',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});

describe('generateToken saga', () => {
  test('should generate token successfully', () => {
    const tokenId = 'something';
    const tokenInPlainText = 'token in plain text';
    const saga = generateToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Generating Token',
      })
    );
    expect(saga.next({ _id: tokenId, token: tokenInPlainText }).value).toEqual(
      put(
        actions.accessToken.tokenReceived({
          _id: tokenId,
          token: tokenInPlainText,
        })
      )
    );
    expect(saga.next().value).toEqual(
      delay(process.env.MASK_SENSITIVE_INFO_DELAY)
    );
    expect(saga.next().value).toEqual(
      put(
        actions.accessToken.maskToken({
          _id: tokenId,
        })
      )
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly while generating token', () => {
    const tokenId = 'something';
    const saga = generateToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Generating Token',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
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

/* global describe, test, expect, beforeEach, jest */
import { call, put, select, take, race, fork, cancel, delay } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { createMockTask } from '@redux-saga/testing-utils';
import { throwError } from 'redux-saga-test-plan/providers';
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
  pollForResourceCollection,
  startPollingForResourceCollection,
} from '.';
import { apiCallWithRetry } from '..';
import { selectors } from '../../reducers';
import { SCOPES } from '../resourceForm';
import { APIException } from '../api';
import { resourceConflictResolution } from '../utils';
import {
  getNetsuiteOrSalesforceMeta,
  getNetsuiteOrSalesforceBundleInstallStatus,
  getNetsuiteOrSalesforceMetaTakeLatestPerAction,
  requestAssistantMetadata,
} from './meta';
import actionTypes from '../../actions/types';
import commKeyGenerator from '../../utils/commKeyGenerator';
import { COMM_STATES } from '../../reducers/comms/networkComms';

describe('commitStagedChanges saga', () => {
  const id = '1';
  const resourceType = 'dogs';
  const path = '/dogs/1';
  const somePatch = [{ path: '/a', value: 'someValue' }];

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

      expect(saga.next({ merged, patch: somePatch }).value).toEqual(
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
        patch: somePatch,
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

      expect(saga.next(updated).value).toEqual(put(actions.resource.clearStaged(id)));
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
            somePatch
          )
        )
      );

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
          patch: somePatch,
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

      expect(saga.next(updated).value).toEqual(
        put(actions.resource.clearStaged(tempId))
      );

      const putEffect = saga.next().value;

      expect(putEffect).toEqual(
        put(actions.resource.received(resourceType, updated))
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

      const final = saga.throw();

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

      const final = saga.throw();

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

describe('pollForResourceCollection saga', () => {
  test('should call getResourceCollection after 5 seconds delay continously', () => {
    const saga = pollForResourceCollection({resourceType: 'connections'});

    expect(saga.next().value).toEqual(call(getResourceCollection, {resourceType: 'connections'}));
    expect(saga.next().value).toEqual(delay(5000));
    expect(saga.next().done).toEqual(false);
  });
});
describe('startPollingForResourceCollection saga', () => {
  test('cancel poll effect should race ahead when stop connection poll action is called ', () => expectSaga(
    startPollingForResourceCollection, { resourceType: 'connections' })
    .provide(
      [
        // delay(5) stimulates an api delay that pollForResourceCollection makes
        [call(pollForResourceCollection, {resourceType: 'connections'}), delay(5)],
      ]
    )
    .dispatch({ type: actionTypes.RESOURCE.STOP_COLLECTION_POLL, resourceType: 'connections'})
    .returns(({cancelPoll: {type: actionTypes.RESOURCE.STOP_COLLECTION_POLL, resourceType: 'connections' }}))
    .run());
  test('cancel poll effect should not race ahead when stop exports poll action is called since the resourceType does not match ', () => expectSaga(
    startPollingForResourceCollection, { resourceType: 'connections' })
    .provide(
      [
        //  delay(5) stimulates an api delay that pollForResourceCollection makes
        [call(pollForResourceCollection, {resourceType: 'connections'}), delay(5)],
      ]
    )
    .dispatch({ type: actionTypes.RESOURCE.STOP_COLLECTION_POLL, resourceType: 'exports'})
    .not.returns(({cancelPoll: {type: actionTypes.RESOURCE.STOP_COLLECTION_POLL, resourceType: 'connections' }}))
    .run());
  test('cancel poll effect should not race ahead when pollForResourceCollection saga completes  ', () => expectSaga(
    startPollingForResourceCollection, { resourceType: 'connections' })
    .provide(
      [
        //  delay(5) stimulates an api delay that pollForResourceCollection makes
        [call(pollForResourceCollection, {resourceType: 'connections'}), delay(5)],
      ]
    )
    .dispatch('waitForData')
    .not.returns(({cancelPoll: {type: actionTypes.RESOURCE.STOP_COLLECTION_POLL, resourceType: 'connections' }}))
    .run());
  test('pollForResourceCollections should complete when no action is dispatched ', () => expectSaga(
    startPollingForResourceCollection, { resourceType: 'connections' })
    .provide(
      [
        //  delay(5) stimulates an api delay that pollForResourceCollection makes
        [call(pollForResourceCollection, {resourceType: 'connections'}), delay(5)],
      ]
    )
    .not.returns(({cancelPoll: {type: actionTypes.RESOURCE.STOP_COLLECTION_POLL, resourceType: 'connections' }}))
    .run());
});

describe('Deregister connection Saga', () => {
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
        message: 'Deregistering connection',
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
        message: 'Deregistering connection',
      })
    );

    const final = saga.throw(new Error('some API exception'));

    expect(final.done).toBe(true);
  });
});

describe('tests for metadata sagas', () => {
  describe('getNetsuiteOrSalesforceMeta saga tests', () => {
    const connId = '123';
    const metaPath = 'recordTypes';
    const bundleURL = 'ns/distributed';

    test('should call setRequestStatus action if metadata status is not requested', () => expectSaga(getNetsuiteOrSalesforceMeta, {connectionId: connId, commMetaPath: metaPath})
      .provide([
        [select(selectors.metadataOptionsAndResources, {connectionId: connId,
          commMetaPath: metaPath}), {
          status: 'refreshed',
        }],
      ])
      .put(actions.metadata.setRequestStatus(connId, metaPath))
      .run()
    );

    test('should check if bundle is installed or not if bundlePath is provided as additional argument', () => expectSaga(getNetsuiteOrSalesforceMeta, {
      connectionId: connId,
      commMetaPath: metaPath,
      addInfo: {
        bundlePath: bundleURL,
      },
    })
      .provide([
        [select(selectors.metadataOptionsAndResources, {connectionId: connId,
          commMetaPath: metaPath}), {
          status: 'requested',
        }],
      ])
      .call(apiCallWithRetry, {
        path: `/${bundleURL}`,
        opts: {},
        hidden: true,
      })
      .run());

    test('should throw validation error if bundle is not installed', () => expectSaga(getNetsuiteOrSalesforceMeta, {
      connectionId: connId,
      commMetaPath: metaPath,
      addInfo: {
        bundlePath: bundleURL,
        bundleUrlHelp: 'please install bundle BUNDLE_URL',
      },
    })
      .provide([
        [select(selectors.metadataOptionsAndResources, {connectionId: connId,
          commMetaPath: metaPath}), {
          status: 'requested',
        }],
        [call(apiCallWithRetry, {
          path: `/${bundleURL}`,
          opts: {},
          hidden: true,
        }), {
          success: false,
          bundleURL: 'ns/installationURL',
        }],
      ])
      .call(apiCallWithRetry, {
        path: `/${bundleURL}`,
        opts: {},
        hidden: true,
      })
      .put(actions.metadata.validationError(
        'please install bundle ns/installationURL',
        connId,
        metaPath
      ))
      .not.call(apiCallWithRetry, {
        path: metaPath,
        opts: {},
        message: 'Loading',
      })
      .run());

    test('should call action received Collection if metadata call is successful', () => {
      const metadata = [{
        id: 'salesorder',
        doesNotSupportCreate: false,
      }, {
        id: 'customer',
        doesNotSupportCreate: false,
      }];

      return expectSaga(getNetsuiteOrSalesforceMeta, {
        connectionId: connId,
        commMetaPath: metaPath,
      })
        .provide([
          [select(selectors.metadataOptionsAndResources, {connectionId: '123',
            commMetaPath: metaPath}), {
            status: 'requested',
          }],
          [call(apiCallWithRetry, {
            path: `/${metaPath}`,
            opts: {},
            message: 'Loading',
          }), metadata],
        ])
        .call(apiCallWithRetry, {
          path: `/${metaPath}`,
          opts: {},
          message: 'Loading',
        })
        .put(actions.metadata.receivedCollection(
          metadata,
          connId,
          metaPath
        ))
        .run();
    });

    test('should form the path correctly and make api call if provided additional params', () => {
      const metadata = [{
        id: 'salesorder',
        doesNotSupportCreate: false,
      }, {
        id: 'customer',
        doesNotSupportCreate: false,
      }];

      const query = 'select id,name from account';
      const newpath = `/${metaPath}?refreshCache=true&q=${encodeURIComponent(query)}`;

      return expectSaga(getNetsuiteOrSalesforceMeta, {
        connectionId: connId,
        commMetaPath: metaPath,
        addInfo: {
          refreshCache: true,
          query,
        },
      })
        .provide([
          [select(selectors.metadataOptionsAndResources, {connectionId: '123',
            commMetaPath: metaPath}), {
            status: 'requested',
          }],
          [call(apiCallWithRetry, {
            path: newpath,
            opts: {},
            message: 'Loading',
          }), metadata],
        ])
        .call(apiCallWithRetry, {
          path: newpath,
          opts: {},
          message: 'Loading',
        })
        .put(actions.metadata.receivedCollection(
          metadata,
          connId,
          metaPath
        ))
        .run();
    });

    test('should call action receivedError if metadata contains error', () => {
      const metadata = {
        errors: [
          {
            message: 'Request limits exceeded',
          },
        ],
      };

      return expectSaga(getNetsuiteOrSalesforceMeta, {
        connectionId: connId,
        commMetaPath: metaPath,
      })
        .provide([
          [select(selectors.metadataOptionsAndResources, {connectionId: '123',
            commMetaPath: metaPath}), {
            status: 'requested',
          }],
          [call(apiCallWithRetry, {
            path: `/${metaPath}`,
            opts: {},
            message: 'Loading',
          }), metadata],
        ])
        .call(apiCallWithRetry, {
          path: `/${metaPath}`,
          opts: {},
          message: 'Loading',
        })
        .put(actions.metadata.receivedError(
          metadata.errors[0].message,
          connId,
          metaPath
        ))
        .run();
    });

    test('should call action receivedError if exception is thrown', () => expectSaga(getNetsuiteOrSalesforceMeta, {
      connectionId: connId,
      commMetaPath: metaPath,
    })
      .provide([
        [select(selectors.metadataOptionsAndResources, {connectionId: '123',
          commMetaPath: metaPath}), {
          status: 'requested',
        }],
        [call(apiCallWithRetry, {
          path: `/${metaPath}`,
          opts: {},
          message: 'Loading',
        }), throwError({status: 404, message: '[{"message":"error msg"}]'})],
      ])
      .call(apiCallWithRetry, {
        path: `/${metaPath}`,
        opts: {},
        message: 'Loading',
      })
      .put(actions.metadata.receivedError(
        'error msg',
        connId,
        metaPath
      ))
      .run());
  });

  describe('getNetsuiteOrSalesforceBundleInstallStatus saga tests', () => {
    const connId = '123';
    const metaPath = `connections/${connId}/distributedApps`;

    test('should call action receivedCollection if bundleVerify is successful', () => {
      const bundleInstallResponse = {
        bundle: {
          success: true,
        },
        suiteapp: {
          success: false,
        },
      };

      return expectSaga(getNetsuiteOrSalesforceBundleInstallStatus, {
        connectionId: connId,
      })
        .provide([
          [call(apiCallWithRetry, {
            path: `/${metaPath}`,
            opts: {},
            hidden: true,
          }), bundleInstallResponse],
        ])
        .put(actions.metadata.setRequestStatus(connId, metaPath))
        .call(apiCallWithRetry, {
          path: `/${metaPath}`,
          opts: {},
          hidden: true,
        })
        .put(actions.metadata.receivedCollection(
          bundleInstallResponse,
          connId,
          metaPath
        ))
        .run();
    });

    test('should call action receivedError if call returns error in the response', () => {
      const bundleInstallResponse = {
        errors: [
          {
            message: 'unexpected error',
          },
        ],
      };

      return expectSaga(getNetsuiteOrSalesforceBundleInstallStatus, {
        connectionId: connId,
      })
        .provide([
          [call(apiCallWithRetry, {
            path: `/${metaPath}`,
            opts: {},
            hidden: true,
          }), bundleInstallResponse],
        ])
        .put(actions.metadata.setRequestStatus(connId, metaPath))
        .call(apiCallWithRetry, {
          path: `/${metaPath}`,
          opts: {},
          hidden: true,
        })
        .put(actions.metadata.receivedError(
          'unexpected error',
          connId,
          metaPath
        ))
        .run();
    });

    test('should call action receivedError if error is thrown', () => expectSaga(getNetsuiteOrSalesforceBundleInstallStatus, {
      connectionId: connId,
    })
      .provide([
        [call(apiCallWithRetry, {
          path: `/${metaPath}`,
          opts: {},
          hidden: true,
        }), throwError({status: 404, message: '[{"message":"error msg"}]'})],
      ])
      .put(actions.metadata.setRequestStatus(connId, metaPath))
      .call(apiCallWithRetry, {
        path: `/${metaPath}`,
        opts: {},
        hidden: true,
      })
      .put(actions.metadata.receivedError(
        'error msg',
        connId,
        metaPath
      ))
      .run());
  });

  describe('getNetsuiteOrSalesforceMetaTakeLatestPerAction saga tests', () => {
    const params = {
      connectionId: '123',
      commMetaPath: '/recordTypes',
    };

    test('should call race effect to complete first getMetadata and abort other reqs', () => {
      const saga = getNetsuiteOrSalesforceMetaTakeLatestPerAction(params);
      const raceBetweenApiCallAndAbort = race({
        getMetadata: call(getNetsuiteOrSalesforceMeta, params),
        abortMetadata: take(
          action =>
            action.type === actionTypes.METADATA.REFRESH &&
          action.connectionId === params.connectionId &&
          action.commMetaPath === params.commMetaPath,
        )});

      expect(JSON.stringify(saga.next().value)).toEqual(
        JSON.stringify(raceBetweenApiCallAndAbort)
      );
    });
  });

  describe('requestAssistantMetadata saga tests', () => {
    const assistant = 'zendesk';
    const adaptorType = 'http';

    test('should return undefined if assistants already loaded or loading', () => expectSaga(requestAssistantMetadata, {
      adaptorType, assistant,
    })
      .provide([
        [select(
          selectors.commStatusByKey,
          commKeyGenerator(`/ui/assistants/http/${assistant}`, 'GET')
        ), {
          status: COMM_STATES.SUCCESS,
        }],
      ])
      .returns(undefined)
      .run());

    test('should return assistant metadata if assistants isn\'t loaded previously', () => {
      const metadata = {
        recordType: 'order',
      };

      return expectSaga(requestAssistantMetadata, {
        adaptorType, assistant,
      })
        .provide([
          [select(
            selectors.commStatusByKey,
            commKeyGenerator(`/ui/assistants/http/${assistant}`, 'GET')
          ), {
            status: COMM_STATES.ERROR,
          }],
          [call(apiCallWithRetry, { path: `/ui/assistants/http/${assistant}`, opts: { method: 'GET'} }), metadata],
        ])
        .call(apiCallWithRetry, { path: `/ui/assistants/http/${assistant}`, opts: { method: 'GET'} })
        .put(actions.assistantMetadata.received({
          adaptorType,
          assistant,
          metadata,
        }))
        .returns(metadata)
        .run();
    });

    test('should return undefined if assistants call throws error', () =>
      expectSaga(requestAssistantMetadata, {
        adaptorType, assistant,
      })
        .provide([
          [select(
            selectors.commStatusByKey,
            commKeyGenerator(`/ui/assistants/http/${assistant}`, 'GET')
          ), {
            status: COMM_STATES.ERROR,
          }],
          [call(apiCallWithRetry, {
            path: `/ui/assistants/http/${assistant}`,
            opts: {
              method: 'GET',
            },
          }), throwError(
            {status: 404, message: '[{"message":"error msg"}]'}
          )]])
        .call(apiCallWithRetry, { path: `/ui/assistants/http/${assistant}`, opts: { method: 'GET'} })
        .returns(undefined)
        .run());
  });
});

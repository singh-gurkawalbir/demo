/* global describe, test, expect, beforeEach, jest */
import { call, put, select, take, race, delay } from 'redux-saga/effects';
import * as matchers from 'redux-saga-test-plan/matchers';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import actions, { availableResources } from '../../actions';
import {
  isDataLoaderFlow,
  resourceConflictDetermination,
  linkUnlinkSuiteScriptIntegrator,
  requestRevoke,
  commitStagedChanges,
  downloadFile,
  normalizeFlow,
  getResource,
  getResourceCollection,
  deleteResource,
  requestReferences,
  updateIntegrationSettings,
  patchResource,
  deleteIntegration,
  validateResource,
  updateTileNotifications,
  updateFlowNotification,
  requestRegister,
  requestDeregister,
  updateTradingPartner,
  receivedResource,
  authorizedConnection,
  refreshConnectionStatus,
  requestQueuedJobs,
  cancelQueuedJob,
  replaceConnection,
  eventReportCancel,
  downloadReport,
  pollForResourceCollection,
  startPollingForResourceCollection,
} from '.';
import { apiCallWithRetry } from '..';
import { selectors } from '../../reducers';
import { SCOPES, updateFlowDoc } from '../resourceForm';
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

const apiError = throwError(new APIException({
  status: 401,
  message: '{"message":"invalid", "code":"code"}',
}));

describe('isDataLoaderFlow saga', () => {
  const flow = {
    _id: 'f1',
    pageGenerators: [],
  };
  const exportFlow = {
    _id: 'f1',
    pageGenerators: [
      {
        _exportId: 'e1',
      },
    ],
  };

  test('should return false if passed flow is undefined', () => expectSaga(isDataLoaderFlow)
    .returns(false)
    .run());
  test('should return false if export is undefined', () => expectSaga(isDataLoaderFlow, flow)
    .returns(false)
    .run());
  test('should return true if export type is simple', () => expectSaga(isDataLoaderFlow, exportFlow)
    .provide([
      [select(selectors.resourceData, 'exports', 'e1'), {merged: {_id: 'e1', type: 'simple'}}],
    ])
    .returns(true)
    .run());
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

describe('linkUnlinkSuiteScriptIntegrator saga', () => {
  const userPreferences = {
    defaultAShareId: 'own',
    ssConnectionIds: ['conn1', 'conn2'],
  };

  test('should return undefined without any put actions if link flag is not boolean', async () => {
    const {effects} = await expectSaga(linkUnlinkSuiteScriptIntegrator, {connectionId: '123', link: 'true'})
      .returns(undefined)
      .run();

    expect(effects.put).toBeUndefined();
  });
  test('should dispatch preference update action with passed connectionId if it is not already linked and link is true (owner/admin user)', () => expectSaga(linkUnlinkSuiteScriptIntegrator, {connectionId: 'conn3', link: true})
    .provide([
      [select(selectors.userPreferences), userPreferences],
      [select(selectors.isAccountOwnerOrAdmin), true],
    ])
    .put(
      actions.user.preferences.update({
        ssConnectionIds: ['conn1', 'conn2', 'conn3'],
      })
    )
    .run());
  test('should dispatch preference update action and remove passed connectionId if link is false and it is already linked (owner/admin user)', () => expectSaga(linkUnlinkSuiteScriptIntegrator, {connectionId: 'conn2', link: false})
    .provide([
      [select(selectors.userPreferences), userPreferences],
      [select(selectors.isAccountOwnerOrAdmin), true],
    ])
    .put(
      actions.user.preferences.update({
        ssConnectionIds: ['conn1'],
      })
    )
    .run());
  test('should dispatch addLinkedConnectionId action with passed connectionId if it is not already linked and link is true (not owner/admin user)', () => expectSaga(linkUnlinkSuiteScriptIntegrator, {connectionId: 'conn3', link: true})
    .provide([
      [select(selectors.userPreferences), userPreferences],
      [select(selectors.isAccountOwnerOrAdmin), false],
    ])
    .put(actions.user.org.accounts.addLinkedConnectionId('conn3'))
    .run());
  test('should dispatch deleteLinkedConnectionId action with passed connectionId if link is false and connection is already linked (not owner/admin user)', () => expectSaga(linkUnlinkSuiteScriptIntegrator, {connectionId: 'conn2', link: false})
    .provide([
      [select(selectors.userPreferences), userPreferences],
      [select(selectors.isAccountOwnerOrAdmin), false],
    ])
    .put(actions.user.org.accounts.deleteLinkedConnectionId('conn2'))
    .run());
});

describe('requestRevoke saga', () => {
  test('should dispatch api failure action if response contains any errors', () => expectSaga(requestRevoke, { connectionId: 'conn1' })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {errors: {code: 100}}],
    ])
    .call(apiCallWithRetry, {
      path: '/connection/conn1/revoke',
      hidden: false,
      opts: {
        method: 'GET',
      },
      message: 'Revoking Connection',
    })
    .put(actions.api.failure('/connection/conn1/revoke', 'GET', JSON.stringify({code: 100}), false))
    .run());
  test('should do nothing and returns undefined if api call fails with exception', () => expectSaga(requestRevoke, { connectionId: 'conn1', hideNe: true})
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .not.put.actionType('API_FAILURE')
    .returns(undefined)
    .run());
});

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
});

describe('downloadFile saga', () => {
  test('should make api call and open window with the signedURl if call was successful', async () => {
    const path = '/flows/123/template';

    window.open = jest.fn().mockReturnValue(true);
    await expectSaga(downloadFile, { resourceType: 'flows', id: '123' })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {signedURL: 'someurl', options: {}}],
      ])
      .call(apiCallWithRetry, {
        path,
        opts: undefined,
        message: 'Download Zip File',
      })
      .run();

    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('someurl', 'target=_blank', {}, false);
  });
  test('should return true and not open window in case API call fails', async () => {
    const path = '/flows/123/template';

    window.open = jest.fn().mockReturnValue(true);
    await expectSaga(downloadFile, { resourceType: 'flows', id: '123' })
      .provide([
        [matchers.call.fn(apiCallWithRetry), apiError],
      ])
      .call(apiCallWithRetry, {
        path,
        opts: undefined,
        message: 'Download Zip File',
      })
      .returns(true)
      .run();

    expect(window.open).not.toBeCalled();
  });
});

describe('normalizeFlow saga', () => {
  test('should return original flow if its not a data loader type', () => {
    const flow = {
      _id: 'f1',
      _exportId: 'e1',
    };

    return expectSaga(normalizeFlow, flow)
      .provide([
        [call(isDataLoaderFlow, flow), false],
      ])
      .returns(flow)
      .run();
  });
  test('should correctly normalize flow structure with pageProcessors and pageGenerators', () => {
    const flow = {
      _id: 'f1',
      _exportId: 'e1',
      _importId: 'i1',
    };

    return expectSaga(normalizeFlow, flow)
      .provide([
        [call(isDataLoaderFlow, flow), true],
      ])
      .returns({
        _id: 'f1',
        pageGenerators: [{ _exportId: 'e1' }],
        pageProcessors: [{ _importId: 'i1', type: 'import' }],
      })
      .run();
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

describe('updateIntegrationSettings saga', () => {
  const childId = 'childId';
  const integrationId = 'int-123';
  const values = {
    '/general_childId_autoAssignInventoryDetail': true,
    '/general_childId_itemGroupWorkFlow': '',
  };
  const flowId = 'flow-123';
  const sectionId = 'Inventory';
  const path = `/integrations/${integrationId}/settings/persistSettings`;

  test('should get childId from selector if not passed and make api call for persistSettings', () => {
    const payload = {
      pending: {
        childId: {
          general_childId_autoAssignInventoryDetail: true,
          general_childId_itemGroupWorkFlow: '',
        },
      },
    };

    return expectSaga(updateIntegrationSettings, {
      integrationId,
      values,
      flowId,
      sectionId,
    })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
        [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
        [matchers.call.fn(apiCallWithRetry), {}],
      ])
      .call(apiCallWithRetry, {
        path,
        opts: {
          method: 'put',
          body: payload,
        },
        hidden: false,
        message: 'Saving integration settings',
      })
      .run();
  });
  test('should dispatch isOnOffActionInprogress along with submitFailed action if API call fails and options action is flowEnableDisable', () => expectSaga(updateIntegrationSettings, {
    integrationId,
    values,
    flowId,
    sectionId,
    options: {action: 'flowEnableDisable'},
  })
    .provide([
      [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
      [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call.fn(apiCallWithRetry)
    .put(actions.flow.isOnOffActionInprogress(false, flowId))
    .put(
      actions.integrationApp.settings.submitFailed({
        childId,
        integrationId,
        response: undefined,
        flowId,
        sectionId,
      })
    )
    .run());
  test('should dispatch submitFailed and not isOnOffActionInprogress action if API call fails and options action is not flowEnableDisable', () => expectSaga(updateIntegrationSettings, {
    integrationId,
    values,
    flowId,
    sectionId,
  })
    .provide([
      [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
      [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call.fn(apiCallWithRetry)
    .not.put(actions.flow.isOnOffActionInprogress(false, flowId))
    .put(
      actions.integrationApp.settings.submitFailed({
        childId,
        integrationId,
        response: undefined,
        flowId,
        sectionId,
      })
    )
    .run());
  test('should call updateFlowDoc if API succeeds and options action is not flowEnableDisable', () => expectSaga(updateIntegrationSettings, {
    integrationId,
    values,
    flowId,
    sectionId,
  })
    .provide([
      [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
      [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
      [matchers.call.fn(apiCallWithRetry), {}],
    ])
    .call.fn(apiCallWithRetry)
    .call(updateFlowDoc, { flowId, resourceType: 'integrations', resourceId: integrationId })
    .run());
  test('should dispatch requestCollection and redirectTo actions if API succeeds and response has settings and flow id', () => expectSaga(updateIntegrationSettings, {
    integrationId,
    values,
    flowId,
    sectionId,
    options: {action: 'flowEnableDisable'},
  })
    .provide([
      [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
      [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
      [matchers.call.fn(apiCallWithRetry), {settings: {}, _flowId: 'flow-123'}],
    ])
    .call.fn(apiCallWithRetry)
    .put(actions.resource.requestCollection('exports'))
    .put(actions.resource.requestCollection('flows'))
    .put(actions.resource.integrations.redirectTo(integrationId, 'dashboard'))
    .run());
  test('should dispatch patch and commit actions if response is a success and options action is flowEnableDisable', () => {
    const patchSet = [
      {
        op: 'replace',
        path: '/disabled',
        value: values['/disabled'],
      },
    ];

    return expectSaga(updateIntegrationSettings, {
      integrationId,
      values,
      flowId,
      sectionId,
      options: {action: 'flowEnableDisable'},
    })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
        [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
        [select(selectors.resource, 'flows', flowId), {disabled: true}],
        [matchers.call.fn(apiCallWithRetry), {success: true}],
      ])
      .call.fn(apiCallWithRetry)
      .call(getResource, { resourceType: 'flows', id: flowId })
      .put(actions.resource.patchStaged(flowId, patchSet, 'value'))

      .put(actions.resource.commitStaged('flows', flowId, 'value'))
      .run();
  });
  test('should dispatch requestCollection actions if response exists and options action is not flowEnableDisable', () => expectSaga(updateIntegrationSettings, {
    integrationId,
    values,
    flowId,
    sectionId,
  })
    .provide([
      [select(selectors.resource, 'integrations', integrationId), {settings: {supportsMultiStore: true}}],
      [select(selectors.integrationAppChildIdOfFlow, integrationId, flowId), childId],
      [matchers.call.fn(apiCallWithRetry), {success: true}],
    ])
    .call.fn(apiCallWithRetry)
    .put(actions.resource.requestCollection('imports'))
    .put(actions.resource.requestCollection('exports'))
    .put(
      actions.integrationApp.settings.submitComplete({
        childId: undefined,
        integrationId,
        response: {success: true},
        flowId,
        sectionId,
      })
    )
    .run());
});

describe('patchResource saga', () => {
  test('should do nothing and returns undefined if patchSet is empty or if new resource', () => {
    const noPatch = expectSaga(patchResource, { id: '123'})
      .not.call.fn(apiCallWithRetry)
      .returns(undefined)
      .run();
    const newId = expectSaga(patchResource, { id: 'new-123', patchSet: {}})
      .not.call.fn(apiCallWithRetry)
      .returns(undefined)
      .run();

    return noPatch && newId;
  });
  test('should make api call and dispatch resource received action if doNotRefetch is false', () => expectSaga(patchResource, { resourceType: 'exports', id: '123', patchSet: {}, options: {doNotRefetch: false} })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {}],
      [select(selectors.resource, 'exports', '123'), {}],
    ])
    .call.fn(apiCallWithRetry)
    .put(actions.resource.received('exports', {}))
    .run());
  test('should make api call and dispatch resource request action if doNotRefetch is true', () => expectSaga(patchResource, { resourceType: 'exports', id: '123', patchSet: {}, options: {doNotRefetch: true} })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {}],
      [select(selectors.resource, 'exports', '123'), {}],
    ])
    .call.fn(apiCallWithRetry)
    .put(actions.resource.request('integrations', '123'))
    .run());
  test('should not dispatch any action and do nothing if api call fails', () => expectSaga(patchResource, { resourceType: 'exports', id: '123', patchSet: {}, options: {doNotRefetch: true} })
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call.fn(apiCallWithRetry)
    .not.put(actions.resource.received('exports', {}))
    .not.put(actions.resource.request('integrations', '123'))
    .run());
});

describe('deleteIntegration saga', () => {
  test('should do nothing and return undefined if integration has _connectorId', () => expectSaga(deleteIntegration, {integrationId: '123'})
    .provide([
      [select(selectors.resource, 'integrations', '123'), {_connectorId: 'someId'}],
    ])
    .not.call.fn(deleteResource)
    .returns(undefined)
    .run());
  test('should call deleteResource and dispatch request collection actions if integration does not have _connectorId', () => expectSaga(deleteIntegration, {integrationId: '123'})
    .provide([
      [select(selectors.resource, 'integrations', '123'), {_id: '123'}],
    ])
    .call(deleteResource, {resourceType: 'integrations', id: '123'})
    .put(actions.resource.requestCollection('integrations', null, true))
    .put(actions.resource.requestCollection('tiles', null, true))
    .put(actions.resource.requestCollection('scripts', null, true))
    .put(actions.resource.integrations.redirectTo('123', 'dashboard'))
    .run());
});

describe('validateResource saga', () => {
  const resourceType = 'exports';
  const resourceId = '123';

  test('should return undefined and not call getResource if type or id is undefined or resource is not empty', () => {
    const emptyResource = expectSaga(validateResource, { resourceType, resourceId })
      .provide([
        [select(selectors.resource, resourceType, resourceId), {_id: '123'}],
      ])
      .not.call.fn(getResource)
      .returns(undefined)
      .run();

    const emptyType = expectSaga(validateResource, { resourceId })
      .provide([
        [select(selectors.resource, resourceType, resourceId), {}],
      ])
      .not.call.fn(getResource)
      .returns(undefined)
      .run();

    const emptyId = expectSaga(validateResource, { resourceType })
      .provide([
        [select(selectors.resource, resourceType, resourceId), {}],
      ])
      .not.call.fn(getResource)
      .returns(undefined)
      .run();

    return emptyResource && emptyType && emptyId;
  });
  test('should call getResource to validate', () => expectSaga(validateResource, { resourceType, resourceId })
    .provide([
      [select(selectors.resource, resourceType, resourceId), {}],
    ])
    .call(getResource, {resourceType, id: resourceId, hidden: true})
    .run());
});

describe('updateTileNotifications saga', () => {
  const resourcesToUpdate = {
    subscribedConnections: ['conn1', 'conn2'],
    subscribedFlows: ['flow-123'],
  };
  const integrationId = 'int-123';
  const childId = 'child-123';
  const userEmail = 'abc@celigo.com';

  test('should make notification API call with notifications array and dispatch requestCollection action is call succeeds', () => {
    const selectorResponse = {
      flows: [{_id: 'f1'}, {_id: 'flow-123'}],
      connections: [{_id: 'conn1'}],
    };
    const notifications = [
      {
        _integrationId: integrationId,
        subscribed: false,
        subscribedByUserEmail: userEmail,
      },
      {
        _flowId: 'f1',
        subscribed: false,
        subscribedByUserEmail: userEmail,
      },
      {
        _flowId: 'flow-123',
        subscribed: true,
        subscribedByUserEmail: userEmail,
      },
      {
        _connectionId: 'conn1',
        subscribed: true,
        subscribedByUserEmail: userEmail,
      },
    ];

    return expectSaga(updateTileNotifications, { resourcesToUpdate, integrationId, childId, userEmail })
      .provide([
        [select(selectors.integrationNotificationResources, integrationId, { childId, userEmail }), selectorResponse],
        [matchers.call.fn(apiCallWithRetry), {success: true}],
      ])
      .call(apiCallWithRetry, {
        path: '/notifications',
        opts: {
          body: notifications,
          method: 'put',
        },
        message: 'Updating notifications',
      })
      .put(actions.resource.requestCollection('notifications'))
      .run();
  });
  test('should make notification API call with notifications array and not dispatch action if API fails', () => {
    const selectorResponse = {
      flows: [{_id: 'f1'}, {_id: 'flow-123'}],
      connections: [{_id: 'conn1'}],
    };

    return expectSaga(updateTileNotifications, { resourcesToUpdate, integrationId, childId, userEmail })
      .provide([
        [select(selectors.integrationNotificationResources, integrationId, { childId, userEmail }), selectorResponse],
        [matchers.call.fn(apiCallWithRetry), apiError],
      ])
      .call.fn(apiCallWithRetry)
      .not.put.actionType('RESOURCE_REQUEST_COLLECTION')
      .returns(undefined)
      .run();
  });
});

describe('updateFlowNotification saga', () => {
  const flowId = 'flow-123';
  const flow = {
    _id: 'flow-123',
    _integrationId: 'int-123',
  };
  const selectorResponse = {
    flowValues: [
      'int-123',
      {_id: 'f1',
        _integrationId: 'int-123',
      },
      {_id: 'flow-123',
        _integrationId: 'int-123',
      }],
  };

  test('should do nothing and not make api call if all flows for the integration are already subscribed', () => expectSaga(updateFlowNotification, { flowId, isSubscribed: true })
    .provide([
      [select(selectors.resource, 'flows', flowId), flow],
      [select(selectors.integrationNotificationResources, 'int-123'), selectorResponse],
    ])
    .not.call.fn(apiCallWithRetry)
    .not.put.actionType('RESOURCE_REQUEST_COLLECTION')
    .returns(undefined)
    .run());

  test('should make notification API call with notifications array and dispatch requestCollection action is call succeeds', () => {
    const notifications = [
      {
        _integrationId: 'int-123',
        subscribed: false,
      },
      {
        _flowId: 'f1',
        subscribed: true,
      },
      {
        _flowId: 'flow-123',
        subscribed: false,
      },
    ];

    return expectSaga(updateFlowNotification, { flowId })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [select(selectors.integrationNotificationResources, 'int-123'), selectorResponse],
        [matchers.call.fn(apiCallWithRetry), {success: true}],
      ])
      .call(apiCallWithRetry, {
        path: '/notifications',
        opts: {
          body: notifications,
          method: 'put',
        },
        message: 'Updating notifications',
      })
      .put(actions.resource.requestCollection('notifications'))
      .run();
  });
  test('should make notification API call with notifications array and not dispatch action if API fails', () => expectSaga(updateFlowNotification, { flowId })
    .provide([
      [select(selectors.resource, 'flows', flowId), flow],
      [select(selectors.integrationNotificationResources, 'int-123'), selectorResponse],
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call.fn(apiCallWithRetry)
    .not.put.actionType('RESOURCE_REQUEST_COLLECTION')
    .returns(undefined)
    .run());
});

describe('requestRegister saga', () => {
  const connectionIds = ['conn1', 'conn2'];
  const integrationId = '123';

  test('should make api call and dispatch completeRegister action if call succeeds', () => expectSaga(requestRegister, { connectionIds, integrationId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {}],
    ])
    .call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/connections/register`,
      opts: {
        method: 'PUT',
        body: connectionIds,
      },
      message: 'Registering connections',
    })
    .put(actions.connection.completeRegister(connectionIds, integrationId))
    .run());
  test('should return undefined and not dispatch completeRegister action if api fails', () => expectSaga(requestRegister, { connectionIds, integrationId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/connections/register`,
      opts: {
        method: 'PUT',
        body: connectionIds,
      },
      message: 'Registering connections',
    })
    .not.put.actionType('REGISTER_COMPLETE')
    .returns(undefined)
    .run());
});

describe('requestDeregister saga', () => {
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

describe('updateTradingPartner saga', () => {
  test('should make api call and dispatch completeTradingPartner action if call succeeds', () => expectSaga(updateTradingPartner, { connectionId: 'conn1' })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {_connectionIds: ['conn2']}],
    ])
    .call(apiCallWithRetry, {
      path: '/connections/conn1/tradingPartner',
      opts: {
        method: 'PUT',
      },
      message: 'Updating trading partner',
    })
    .put(actions.connection.completeTradingPartner(['conn2']))
    .run());
  test('should return undefined and not dispatch completeTradingPartner action if api fails', () => expectSaga(updateTradingPartner, { connectionId: 'conn1' })
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, {
      path: '/connections/conn1/tradingPartner',
      opts: {
        method: 'PUT',
      },
      message: 'Updating trading partner',
    })
    .not.put.actionType('TRADING_PARTNER_UPDATE_COMPLETE')
    .returns(undefined)
    .run());
});

describe('receivedResource saga', () => {
  test('should dispatch madeOnline action only if resource type is connections and it is online', () => expectSaga(receivedResource, { resourceType: 'connections', resource: {_id: 'conn1', offline: false} })
    .put(actions.connection.madeOnline('conn1'))
    .run());
  test('should not dispatch madeOnline action for other types or if connection is offline', () => {
    const invalidType = expectSaga(receivedResource, { resourceType: 'exports', resource: {_id: 'conn1'} })
      .not.put.actionType('CONNECTION_MADE_ONLINE')
      .run();

    const offline = expectSaga(receivedResource, { resourceType: 'connections', resource: {_id: 'conn1', offline: true} })
      .not.put.actionType('CONNECTION_MADE_ONLINE')
      .run();

    return invalidType && offline;
  });
});

describe('authorizedConnection saga', () => {
  const connectionId = 'conn1';

  test('should dispatch resource request action if connection type is netsuite or salesforce', () => expectSaga(authorizedConnection, { connectionId })
    .provide([
      [select(
        selectors.resourceData,
        'connections',
        connectionId
      ), {merged: {type: 'netsuite'}}],
    ])
    .put(actions.connection.madeOnline(connectionId))
    .put(actions.resource.request('connections', connectionId))
    .run());
  test('should dispatch resource request action if oauth connection is offline', () => {
    expectSaga(authorizedConnection, { connectionId })
      .provide([
        [select(
          selectors.resourceData,
          'connections',
          connectionId
        ), {merged: {offline: true, rest: {authType: 'oauth'}}}],
      ])
      .put(actions.connection.madeOnline(connectionId))
      .put(actions.resource.request('connections', connectionId))
      .run();
  });
});

describe('refreshConnectionStatus saga', () => {
  test('should dispatch updateStatus action if api call succeeds', () => expectSaga(refreshConnectionStatus, { integrationId: '123' })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {success: true}],
    ])
    .call(apiCallWithRetry, {
      path: '/integrations/123/connections?fetchQueueSize=true',
      hidden: true,
    })
    .put(actions.resource.connections.updateStatus({success: true}))
    .run());
  test('should return undefined and not dispatch action if api call fails', () => expectSaga(refreshConnectionStatus, {})
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, {
      path: '/connections?fetchQueueSize=true',
      hidden: true,
    })
    .not.put.actionType('CONNECTION_UPDATE_STATUS')
    .returns(undefined)
    .run());
});

describe('requestQueuedJobs saga', () => {
  const connectionId = 'conn1';

  test('should dispatch receivedQueuedJobs action if api call succeeds', () => expectSaga(requestQueuedJobs, { connectionId})
    .provide([
      [matchers.call.fn(apiCallWithRetry), {success: true}],
    ])
    .call(apiCallWithRetry, { path: `/connections/${connectionId}/jobs` })
    .put(actions.connection.receivedQueuedJobs({success: true}, connectionId))
    .run());
  test('should return undefined and not dispatch action if api call fails', () => expectSaga(requestQueuedJobs, { connectionId})
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, { path: `/connections/${connectionId}/jobs` })
    .not.put.actionType('QUEUED_JOBS_RECEIVED')
    .returns(undefined)
    .run());
});

describe('cancelQueuedJob saga', () => {
  const jobId = '123';

  test('should make api call and not dispatch any action if api succeeds', () => expectSaga(cancelQueuedJob, { jobId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {}],
    ])
    .call(apiCallWithRetry, {
      path: `/jobs/${jobId}/cancel`,
      opts: {
        body: {},
        method: 'PUT',
      },
    })
    .not.put.actionType('API_FAILURE')
    .run());
  test('should dispatch api failure action if call fails', () => expectSaga(cancelQueuedJob, { jobId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, {
      path: `/jobs/${jobId}/cancel`,
      opts: {
        body: {},
        method: 'PUT',
      },
    })
    .put(actions.api.failure(`/jobs/${jobId}/cancel`, 'PUT', '{"message":"invalid", "code":"code"}', false))
    .run());
});

describe('replaceConnection saga', () => {
  const _resourceId = '123';
  const _connectionId = 'old';
  const _newConnectionId = 'new';

  test('should dispatch request collection actions if api call succeeds', () => expectSaga(replaceConnection, { _resourceId, _connectionId, _newConnectionId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), {}],
    ])
    .call(apiCallWithRetry, {
      path: `/flows/${_resourceId}/replaceConnection`,
      opts: {
        body: {_connectionId, _newConnectionId},
        method: 'PUT',
      },
    })
    .put(actions.resource.requestCollection('flows', null, true))
    .put(actions.resource.requestCollection('exports', null, true))
    .put(actions.resource.requestCollection('imports', null, true))
    .run());
  test('should dispatch api failure action and not request collections if call fails', () => expectSaga(replaceConnection, { _resourceId, _connectionId, _newConnectionId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, {
      path: `/flows/${_resourceId}/replaceConnection`,
      opts: {
        body: {_connectionId, _newConnectionId},
        method: 'PUT',
      },
    })
    .put(actions.api.failure(`/flows/${_resourceId}/replaceConnection`, 'PUT', '{"message":"invalid", "code":"code"}', false))
    .not.put(actions.resource.requestCollection('flows', null, true))
    .not.put(actions.resource.requestCollection('exports', null, true))
    .not.put(actions.resource.requestCollection('imports', null, true))
    .run());
});

describe('eventReportCancel saga', () => {
  const reportId = '123';

  test('should dispatch resource request action if api call succeeds', () => expectSaga(eventReportCancel, {reportId})
    .provide([
      [matchers.call.fn(apiCallWithRetry), {}],
    ])
    .call(apiCallWithRetry, {
      path: `/eventreports/${reportId}/cancel`,
      opts: {
        method: 'PUT',
      },
    })
    .put(actions.resource.request('eventreports', reportId))
    .run());
  test('should do nothing if API call fails', () => expectSaga(eventReportCancel, {reportId})
    .provide([
      [matchers.call.fn(apiCallWithRetry), apiError],
    ])
    .call(apiCallWithRetry, {
      path: `/eventreports/${reportId}/cancel`,
      opts: {
        method: 'PUT',
      },
    })
    .not.put.actionType('RESOURCE_REQUEST')
    .run());
});

describe('downloadReport saga', () => {
  const reportId = '123';

  test('should make api call and open window with the signedURL if call was successful', async () => {
    const path = `/eventreports/${reportId}/signedURL`;

    window.open = jest.fn().mockReturnValue(true);
    await expectSaga(downloadReport, { reportId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {signedURL: 'https://someurl'}],
      ])
      .call(apiCallWithRetry, {
        path,
      })
      .run();

    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('https://someurl', 'target=_blank', 'noopener,noreferrer');
  });
  test('should do nothing and not open window in case API call fails', async () => {
    const path = `/eventreports/${reportId}/signedURL`;

    window.open = jest.fn().mockReturnValue(true);
    await expectSaga(downloadReport, { reportId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), apiError],
      ])
      .call(apiCallWithRetry, {
        path,
      })
      .run();

    expect(window.open).not.toBeCalled();
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

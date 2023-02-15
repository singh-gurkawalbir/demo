/* eslint-disable jest/no-test-return-statement */

import { select } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import { loadFlowResourceUIFields, onFlowUpdate, requestFlowResources, loadResourceUIFields } from '.';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { getResource } from '../resources';

const flowResources = {
  imports: [{
    mockResponse: { test: 'test3' },
    _id: 'i1',
  }, {
    mockResponse: { test: 'test4' },
    _id: 'i2',
  }],
  exports: [{
    mockOutput: { test: 'test1' },
    _id: 'e1',
  }, {
    mockOutput: { test: 'test2' },
    _id: 'e2',
  }],
};

describe('requestFlowResources saga', () => {
  const flowId = 'flow-123';

  test('should make api call and dispatch received call on success', () => expectSaga(requestFlowResources, { flowId })
    .provide([
      [matchers.call.fn(apiCallWithRetry), flowResources],
    ])
    .put(actions.uiFields.receivedFlowLevel(flowId, flowResources))
    .run());
  test('should do nothing incase of api failure', () => {
    const error = new Error('error');

    expectSaga(requestFlowResources, { flowId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .not.put(actions.uiFields.receivedFlowLevel(flowId, undefined))
      .run();
  });
});
describe('loadResourceUIFields saga', () => {
  test('should do nothing if resourceId or resourceType is not present', () => {
    const resourceId = 'resource-123';
    const resourceType = 'exports';

    expectSaga(loadResourceUIFields, {})
      .not.call(getResource, { resourceType, id: resourceId })
      .run();
  });
  test('should do nothing if resourceUIFields are already loaded', () => {
    const resourceId = 'resource-123';
    const resourceType = 'exports';

    expectSaga(loadResourceUIFields, { resourceId, resourceType })
      .provide([
        [select(selectors.resourceUIFields, resourceId), { mockOutput: { users: [] }}],
      ])
      .not.call(getResource, { resourceType, id: resourceId })
      .run();
  });
  test('should call getResource if resourceUIFields are not loaded', () => {
    const resourceId = 'resource-123';
    const resourceType = 'exports';

    expectSaga(loadResourceUIFields, { resourceId, resourceType })
      .provide([
        [select(selectors.resourceUIFields, resourceId), undefined],
      ])
      .call(getResource, { resourceType, id: resourceId })
      .run();
  });
});
describe('loadFlowResourceUIFields saga', () => {
  test('should do nothing if the flowId is invalid', () => {
    expectSaga(loadFlowResourceUIFields, { flowId: undefined })
      .not.put(actions.uiFields.requestFlowLevel(undefined))
      .not.take(actionTypes.UI_FIELDS.FLOW_LEVEL.RECEIVED)
      .run();
  });
  test('should dispatch requestFlowLevel when all resources for the flowId are not loaded', () => {
    const flowId = 'flow-123';
    const resourceIds = ['e1', 'e2', 'i1', 'i2'];

    expectSaga(loadFlowResourceUIFields, { flowId })
      .provide([
        [select(selectors.flowResourceIds, flowId), resourceIds],
        [select(selectors.hasLoadedAllResourceUIFields, resourceIds), false],
      ])
      .put(actions.uiFields.requestFlowLevel(flowId))
      .take(actionTypes.UI_FIELDS.FLOW_LEVEL.RECEIVED)
      .run();
  });
  test('should not dispatch requestFlowLevel when resources are not loaded but the request is already made', () => {
    const flowId = 'flow-123';
    const resourceIds = ['e1', 'e2', 'i1', 'i2'];

    expectSaga(loadFlowResourceUIFields, { flowId })
      .provide([
        [select(selectors.flowResourceIds, flowId), resourceIds],
        [select(selectors.hasLoadedAllResourceUIFields, resourceIds), false],
        [select(selectors.flowResourcesStatus, flowId), 'requested'],
      ])
      .not.put(actions.uiFields.requestFlowLevel(flowId))
      .not.take(actionTypes.UI_FIELDS.FLOW_LEVEL.RECEIVED)
      .run();
  });
});
describe('onFlowUpdate saga', () => {
  const resourceId = 'flow-123';
  const resourceType = 'flows';
  const resourceIds = ['e1', 'e2', 'i1', 'i2'];
  const [exportId, importId] = ['e1', 'i1'];

  test('should do nothing if the resourceType updated is not flow', () => {
    const resourceType = 'imports';

    expectSaga(onFlowUpdate, { resourceType })
      .not.call.fn(loadResourceUIFields)
      .not.put(actions.uiFields.updateFlowResources(undefined, []))
      .run();
  });
  test('should do nothing when the flow changes are not related to pg or pp', () => {
    const resourceId = 'flow-123';
    const resourceType = 'flows';
    const nameChangePatch = [{
      op: 'replace',
      path: '/name',
      value: 'flow1',
    }];
    const flowEnablePatch = [{
      op: 'replace',
      path: '/disabled',
      value: 'false',
    }];

    expectSaga(onFlowUpdate, { resourceId, resourceType, patch: nameChangePatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), []],
      ])
      .not.put(actions.uiFields.updateFlowResources(resourceId, []))
      .not.call.fn(loadResourceUIFields)
      .run();
    expectSaga(onFlowUpdate, { resourceId, resourceType, patch: flowEnablePatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), []],
      ])
      .not.put(actions.uiFields.updateFlowResources(resourceId, []))
      .not.call.fn(loadResourceUIFields)
      .run();
  });
  test('should call loadResourceUIFields and also dispatch updateFlowResources when the patches for the flow has PG or PP added for the first time', () => {
    const ppPatch = [{
      op: 'add',
      path: '/pageProcessors',
      value: [{
        type: 'import',
        _importId: 'i1',
      }],
    }];
    const pgPatch = [{
      op: 'add',
      path: '/pageGenerators',
      value: [{
        _exportId: 'e1',
      }],
    }];

    const test1 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: ppPatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, importId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test2 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: pgPatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, exportId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();

    return test1 && test2;
  });
  test('should not call loadResourceUIFields but dispatch updateFlowResources when the patches for the flow has PG or PP removed', () => {
    const removeRouterPatch = [ // remove router with node
      {op: 'remove', path: '/routers'},
      {
        op: 'add',
        path: '/pageProcessors',
        value: [{responseMapping: {fields: [], lists: []}, type: 'import', _importId: 'i1', id: 'i1'}],
      },
    ];
    const removeLinearNodePatch = [{op: 'remove', path: '/pageProcessors/0'}];
    const removeLinearPGPatch = [{ op: 'remove', path: '/pageGenerators/0' }];

    const test1 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: removeRouterPatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
      ])
      .not.call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test2 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: removeLinearNodePatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
      ])
      .not.call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test3 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: removeLinearPGPatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
      ])
      .not.call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();

    return test1 && test2 && test3;
  });
  test('should call loadResourceUIFields and also dispatch updateFlowResources when the patches for the Linear flow has PG or PP added', () => {
    const addLinearNodePatch = [
      {op: 'add', path: '/pageProcessors', value: [{type: 'import', _importId: 'i1'}]},
    ];
    const addLinearNodePatch2 = [
      {op: 'add', path: '/pageProcessors/1', value: {type: 'export', _exportId: 'e1'}},
    ];
    const addLinearNodeMiddlePatch = [
      {op: 'remove', path: '/pageProcessors/1/_exportId'},
      {op: 'replace', path: '/pageProcessors/1/type', value: 'import'},
      {op: 'remove', path: '/pageProcessors/1/responseMapping'},
      {op: 'add', path: '/pageProcessors/1/_importId', value: 'i1'},
      {op: 'add', path: '/pageProcessors/2', value: {responseMapping: {fields: [], lists: []}, type: 'export', _exportId: 'e1'}},
    ];

    const dragChangePatch = [
      {op: 'remove', path: '/pageProcessors/2/_exportId'},
      {op: 'replace', path: '/pageProcessors/2/type', value: 'import'},
      {op: 'add', path: '/pageProcessors/2/_importId', value: 'i1'},
      {op: 'remove', path: '/pageProcessors/1/_importId'},
      {op: 'replace', path: '/pageProcessors/1/type', value: 'export'},
      {op: 'add', path: '/pageProcessors/1/_exportId', value: 'e1'},
    ];

    const test1 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: addLinearNodePatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, importId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test2 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: addLinearNodePatch2 })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, importId), {}],
        [select(selectors.resourceUIFields, exportId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test3 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: addLinearNodeMiddlePatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, importId), {}],
        [select(selectors.resourceUIFields, exportId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test4 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: dragChangePatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, importId), {}],
        [select(selectors.resourceUIFields, exportId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();

    return test1 && test2 && test3 && test4;
  });
  test('should call loadResourceUIFields and also dispatch updateFlowResources when the patches for the Branched flow has PG or PP added', () => {
    const ppPatch = [ // add node in branching
      {
        op: 'add',
        path: '/routers/0/branches/0/pageProcessors/1',
        value: {type: 'import', _importId: 'i1'},
      },
    ];
    const pgPatch = [
      {op: 'add', path: '/pageGenerators/2', value: {_exportId: 'e1'}},
    ];

    const test1 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: ppPatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, importId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
    const test2 = expectSaga(onFlowUpdate, { resourceId, resourceType, patch: pgPatch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
        [select(selectors.resourceUIFields, exportId), {}],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();

    return test1 && test2;
  });
});


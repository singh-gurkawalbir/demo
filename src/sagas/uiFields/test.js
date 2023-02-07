
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
  test('should not call loadResourceUIFields but dispatch updateFlowResources when the patches for the flow has PG or PP removed', () => {
    const patch = [{
      op: 'remove',
      path: '/pageGenerators/0',
    }];
    const resourceId = 'flow-123';
    const resourceType = 'flows';
    const resourceIds = ['e1', 'e2', 'i1', 'i2'];

    expectSaga(onFlowUpdate, { resourceId, resourceType, patch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
      ])
      .not.call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
  });
  test('should call loadResourceUIFields and also dispatch updateFlowResources when the patches for the flow has PG or PP removed', () => {
    const patch = [{
      op: 'add',
      path: '/pageProcessors',
      value: [{
        type: 'import',
        _importId: 'i1',
      }],
    }];
    const resourceId = 'flow-123';
    const resourceType = 'flows';
    const resourceIds = ['e1', 'e2', 'i1', 'i2'];

    expectSaga(onFlowUpdate, { resourceId, resourceType, patch })
      .provide([
        [select(selectors.flowResourceIds, resourceId), resourceIds],
      ])
      .call.fn(loadResourceUIFields)
      .put(actions.uiFields.updateFlowResources(resourceId, resourceIds))
      .run();
  });
});


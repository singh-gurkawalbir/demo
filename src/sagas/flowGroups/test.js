/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  patchIntegrationChanges,
  updateFlowsWithFlowGroupId,
  updateIntegrationFlowGroups,
  deleteFlowGroup,
  createOrUpdateFlowGroup,
  flowGroupsShiftOrder,
  addFlowGroup,
  editFlowGroup,
} from '.';
import { APIException } from '../api/requestInterceptors/utils';
import { getResourceCollection, patchResource } from '../resources';

const apiError = new APIException({
  status: 401,
  message: '{"message":"invalid", "code":"code"}',
});

describe('patchIntegrationChanges saga', () => {
  const integrationId = 'i1';
  const flowGroupings = [
    {
      name: 'flow group 1',
      _id: 'fg1',
    },
    {
      name: 'flow group 2',
      _id: 'fg2',
    },
  ];
  const patchSet = [
    {
      op: 'replace',
      path: '/flowGroupings',
      value: flowGroupings,
    },
  ];
  const response = {
    someKey: 'something',
  };

  test('should call patchResource and return undefined if there is no response', () =>
    expectSaga(patchIntegrationChanges, { integrationId, flowGroupings })
      .provide([[call(patchResource, {
        resourceType: 'integrations',
        id: integrationId,
        patchSet,
      })]])
      .call(patchResource, {
        resourceType: 'integrations',
        id: integrationId,
        patchSet,
      })
      .returns(undefined)
      .run()
  );

  test('should call patchResource and return response', () =>
    expectSaga(patchIntegrationChanges, { integrationId, flowGroupings })
      .provide([[call(patchResource, {
        resourceType: 'integrations',
        id: integrationId,
        patchSet,
      }), response]])
      .call(patchResource, {
        resourceType: 'integrations',
        id: integrationId,
        patchSet,
      })
      .returns(response)
      .run()
  );
});

describe('updateFlowsWithFlowGroupId saga', () => {
  const flowIds = ['f1', 'f2'];
  const flowGroupId = 'fg1';
  const args = {
    path: '/flows/updateFlowGrouping',
    opts: {
      method: 'PUT',
      body: {
        _flowIds: flowIds,
        _flowGroupingId: flowGroupId,
      },
    },
    hidden: false,
    message: 'Updating flow group',
  };

  test('On successful api call, should dispatch resourceCollection action for flows', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .provide([
        [call(apiCallWithRetry, args)],
        [call(getResourceCollection, { resourceType: 'flows', refresh: true })],
      ])
      .call(apiCallWithRetry, args)
      .call(getResourceCollection, { resourceType: 'flows', refresh: true })
      .run()
  );
  test('if api call fails should return the error', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .provide([[call(apiCallWithRetry, args), throwError(apiError)]])
      .call(apiCallWithRetry, args)
      .returns({error: apiError})
      .run()
  );
});

describe('updateIntegrationFlowGroups saga', () => {
  const integrationId = 'i1';
  const payload = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'flow group 1',
        _id: 'fg1',
      },
    ],
  };
  const args = {
    path: `/integrations/${integrationId}`,
    opts: {
      method: 'PUT',
      body: payload,
    },
    hidden: false,
    message: 'Updating flow groups',
  };
  const response = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'flow group 1',
        _id: 'fg1',
      },
    ],
  };

  test('On successful api call, should disaptch resource received action for integrations', () =>
    expectSaga(updateIntegrationFlowGroups, { integrationId, payload })
      .provide([[call(apiCallWithRetry, args), response]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .returns(response)
      .run()
  );
  test('if api call fails should return the error', () =>
    expectSaga(updateIntegrationFlowGroups, { integrationId, payload })
      .provide([[call(apiCallWithRetry, args), throwError(apiError)]])
      .call(apiCallWithRetry, args)
      .returns({error: apiError})
      .run()
  );
});

describe('addFlowGroup saga', () => {
  const integrationId = 'i1';
  const groupName = 'group1';
  const flowGroupId = 'fg1';
  const flowIds = ['f1', 'f2'];
  const formKey = 'something';
  const integration = {
    _id: integrationId,
    flowGroupings: [],
  };
  const payload = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'group1',
      },
    ],
  };
  const response = {
    _id: integrationId,
    flowGroupings: [
      {
        name: groupName,
        _id: 'fg1',
      },
    ],
  };

  test('If there is no response on calling updateIntegrationFlowGroups, should not call updateFlowsWithFlowGroupId', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload })],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload })
      .not.call.fn(updateFlowsWithFlowGroupId)
      .put(actions.asyncTask.success(formKey))
      .run()
  );

  test('If there is a response on calling updateIntegrationFlowGroups but there are no flowIds, should not call updateFlowsWithFlowGroupId', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload }), response],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload })
      .put(actions.asyncTask.success(formKey))
      .run()
  );

  test('If there is a response on calling updateIntegrationFlowGroups and there are flowIds, should call updateFlowsWithFlowGroupId', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload }), response],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload })
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .put(actions.asyncTask.success(formKey))
      .run()
  );

  test('If updateIntegrationFlowGroups returns an error, should not call updateFlowsWithFlowGroupId and dispatch createOrUpdate and asyncTask failed actions', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload }), {error: apiError}],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload })
      .not.call.fn(updateFlowsWithFlowGroupId)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(integrationId, apiError))
      .put(actions.asyncTask.failed(formKey))
      .not.put(actions.asyncTask.success(formKey))
      .run()
  );

  test('If updateFlowsWithFlowGroupId returns an error, should dispatch createOrUpdate and asyncTask failed action', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload }), response],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId }), {error: apiError}],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload })
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(integrationId, apiError))
      .put(actions.asyncTask.failed(formKey))
      .not.put(actions.asyncTask.success(formKey))
      .run()
  );
});

describe('editFlowGroup saga', () => {
  const integrationId = 'i1';
  const groupName = 'group1';
  const newGroupName = 'group2';
  const flowGroupId = 'fg1';
  const flowIds = ['f1', 'f2'];
  const deSelectedFlowIds = ['f3'];
  const formKey = 'something';
  const integration = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'group1',
        _id: 'fg1',
      },
    ],
  };
  const flowGroupings = [
    {
      name: 'group2',
      _id: 'fg1',
    },
  ];

  test('should call patchIntegrationChanges if the groupname is changed and not call updateFlowsWithFlowGroupId if no flows are added or removed from flow group', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds: [], deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(patchIntegrationChanges, { integrationId, flowGroupings })],
      ])
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .not.call.fn(updateFlowsWithFlowGroupId)
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('if patchIntegrationChanges returns response with error, should not call updateFlowsWithFlowGroupId and dispatch createOrupdate and asynctask failed actions', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds: [], deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(patchIntegrationChanges, { integrationId, flowGroupings }), {error: apiError}],
      ])
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .not.call.fn(updateFlowsWithFlowGroupId)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(integrationId, apiError))
      .put(actions.asyncTask.failed(formKey))
      .not.put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should not call patchIntegrationChanges if groupName is not changed and call updateFlowsWithFlowGroupId if flows are added to the flow group', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds, deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })],
      ])
      .not.call.fn(patchIntegrationChanges)
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should not call patchIntegrationChanges if groupName is not changed and call updateFlowsWithFlowGroupId if flows are deSelected from flowGroup', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds: [], deSelectedFlowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined })],
      ])
      .not.call.fn(patchIntegrationChanges)
      .call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('if updateFlowsWithFlowGroupId returns an error when flows are being added to flowGroup, should not call updateFlowsWithFlowGroupId if deSlected flows are present', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds, deSelectedFlowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId }), {error: apiError}],
      ])
      .not.call.fn(patchIntegrationChanges)
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .not.call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined })
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(integrationId, apiError))
      .put(actions.asyncTask.failed(formKey))
      .not.put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should call patchIntegrationChanges if the groupname is changed and call updateFlowsWithFlowGroupId if flows are added and deSelected from flow group', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds, deSelectedFlowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(patchIntegrationChanges, { integrationId, flowGroupings })],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })],
        [call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined })],
      ])
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId })
      .call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should not call patchIntegrationChanges and updateFlowsWithFlowGroupId if groupname is not changed and flows have not been added or deSelected from flow group', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds: [], deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
      ])
      .not.call(patchIntegrationChanges, { integrationId, flowGroupings })
      .not.call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })
      .not.call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
});

describe('createOrUpdateFlowGroup saga', () => {
  const integrationId = 'i1';
  const flowGroupId = 'fg1';
  const formKey = 'something';
  const flowsTiedToIntegrations = [
    {
      _id: 'f1',
      _flowGroupingId: 'fg1',
    },
    {
      _id: 'f2',
      _flowGroupingId: 'fg2',
    },
    {
      _id: 'f3',
      _flowGroupingId: 'fg1',
    },
  ];
  const formState = {
    fields: {
      name: {
        value: 'group1',
      },
      _flowIds: {
        value: ['f1', 'f2'],
      },
    },
  };
  const flowIds = ['f1', 'f2'];
  const selectedFlowIds = ['f2'];
  const deSelectedFlowIds = ['f3'];

  test('should call addFlowGroup with correct args if flowGroupId is not present', () =>
    expectSaga(createOrUpdateFlowGroup, { integrationId, flowGroupId: undefined, formKey})
      .provide([
        [select(selectors.allFlowsTiedToIntegrations, integrationId), flowsTiedToIntegrations],
        [select(selectors.formState, formKey), formState],
        [call(addFlowGroup, { integrationId, groupName: 'group1', flowIds, formKey })],
      ])
      .call(addFlowGroup, { integrationId, groupName: 'group1', flowIds, formKey })
      .run()
  );
  test('should call editFlowGroup with correct args if flowGroupId is present', () =>
    expectSaga(createOrUpdateFlowGroup, { integrationId, flowGroupId, formKey})
      .provide([
        [select(selectors.allFlowsTiedToIntegrations, integrationId), flowsTiedToIntegrations],
        [select(selectors.formState, formKey), formState],
        [call(editFlowGroup, { integrationId, flowGroupId, groupName: 'group1', flowIds: selectedFlowIds, deSelectedFlowIds, formKey })],
      ])
      .call(editFlowGroup, { integrationId, flowGroupId, groupName: 'group1', flowIds: selectedFlowIds, deSelectedFlowIds, formKey })
      .run()
  );
});

describe('deleteFlowGroup saga', () => {
  const integrationId = 'i1';
  const flowGroupId = 'fg1';
  const flowIds = ['f1', 'f2'];
  const integration = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'group1',
        _id: 'fg1',
      },
      {
        name: 'group2',
        _id: 'fg2',
      },
    ],
  };
  const flowGroupings = [
    {
      name: 'group2',
      _id: 'fg2',
    },
  ];

  test('Should call deleteFlowGroupIdFromFlow api call for every Flow and call patchIntegrationChanges', () =>
    expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flowIds})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds })],
        [call(patchIntegrationChanges, { integrationId, flowGroupings })],
      ])
      .call(updateFlowsWithFlowGroupId, { flowIds })
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .run()
  );

  test('If patchIntegrationChanges returns response with error, should dispatch flowGroups deleteFailed action', () =>
    expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flowIds})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds })],
        [call(patchIntegrationChanges, { integrationId, flowGroupings }), {error: apiError}],
      ])
      .call(updateFlowsWithFlowGroupId, { flowIds })
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .put(actions.resource.integrations.flowGroups.deleteFailed(integrationId, apiError))
      .run()
  );

  test('If updateFlowsWithFlowGroupId returns response with error, should not call patchIntegrationChanges and dispatch flowGroups deleteFailed action', () =>
    expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flowIds})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds }), {error: apiError}],
      ])
      .call(updateFlowsWithFlowGroupId, { flowIds })
      .not.call.fn(patchIntegrationChanges)
      .put(actions.resource.integrations.flowGroups.deleteFailed(integrationId, apiError))
      .run()
  );
});

describe('flowGroupsShiftOrder saga', () => {
  const integrationId = 'i1';
  const flowGroupId = 'fg1';
  const newIndex = 1;
  const integration = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'group1',
        _id: 'fg1',
      },
      {
        name: 'group2',
        _id: 'fg2',
      },
    ],
  };
  const flowGroupings = [
    {
      name: 'group2',
      _id: 'fg2',
    },
    {
      name: 'group1',
      _id: 'fg1',
    },
  ];

  test('should call patchIntegrationChanges with new flowGroupings order and should not dispatch any action if there is no response', () =>
    expectSaga(flowGroupsShiftOrder, {integrationId, flowGroupId, newIndex})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(patchIntegrationChanges, { integrationId, flowGroupings })],
      ])
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .not.put(actions.resource.integrations.flowGroups.createOrUpdateFailed(integrationId, apiError))
      .run()
  );
  test('If patchIntegrationChanges call returns response with error, should dispatch flowGroups createOrUpdateFailed action', () =>
    expectSaga(flowGroupsShiftOrder, {integrationId, flowGroupId, newIndex})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(patchIntegrationChanges, { integrationId, flowGroupings }), {error: apiError}],
      ])
      .call(patchIntegrationChanges, { integrationId, flowGroupings })
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(integrationId, apiError))
      .run()
  );
});

/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { getResourceCollection } from '../resources';
import {
  updateFlowsWithFlowGroupId,
  deleteFlowGroup,
  updateIntegrationFlowGroups,
  createOrUpdateFlowGroup,
  flowGroupsShiftOrder,
  addFlowGroup,
  editFlowGroup,
} from '.';

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
  const error = {
    code: 200,
    message: 'something',
  };
  const formKey = 'something';

  test('On successful api call, should call getResourceCollection api for flows', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })
      .provide([
        [call(apiCallWithRetry, args)],
        [call(getResourceCollection, { resourceType: 'flows'})],
      ])
      .call(apiCallWithRetry, args)
      .call(getResourceCollection, { resourceType: 'flows' })
      .run()
  );
  test('if api call fails should dispatch flowGroups createOrUpdateFailed action', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })
      .provide([[call(apiCallWithRetry, args), throwError(error)]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .put(actions.asyncTask.failed(formKey))
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
  const error = {
    code: '200',
    message: 'something',
  };
  const formKey = 'something';

  test('On successful api call, should disaptch resource received action for integrations', () =>
    expectSaga(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .provide([[call(apiCallWithRetry, args), response]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .returns(response)
      .run()
  );
  test('if api call fails should dispatch flowGroups createOrUpdateFailed action', () =>
    expectSaga(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .provide([[call(apiCallWithRetry, args), throwError(error)]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .put(actions.asyncTask.failed(formKey))
      .returns(undefined)
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
        [call(updateIntegrationFlowGroups, { integrationId, payload, formKey })],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );

  test('If there is a response on calling updateIntegrationFlowGroups but there are no flowIds, should not call updateFlowsWithFlowGroupId', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload, formKey }), response],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );

  test('If there is a response on calling updateIntegrationFlowGroups and there are flowIds, should call updateFlowsWithFlowGroupId', () =>
    expectSaga(addFlowGroup, { integrationId, groupName, flowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload, formKey }), response],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })
      .put(actions.asyncTask.success(formKey))
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
  const payload = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'group2',
        _id: 'fg1',
      },
    ],
  };

  test('should call updateIntegrationFlowGroups if the groupname is changed', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds: [], deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload, formKey })],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should call updateFlowsWithFlowGroupId if flowIds are present', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds, deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })],
      ])
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should call updateFlowsWithFlowGroupId if deSelectedFlowIds are present', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds: [], deSelectedFlowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined, formKey })],
      ])
      .call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should call updateIntegrationFlowGroups if the groupname is changed and call updateIntegrationFlowgroups if both flowIds and deSelectedFlowIds are present', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds, deSelectedFlowIds, formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateIntegrationFlowGroups, { integrationId, payload, formKey })],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })],
        [call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined, formKey })],
      ])
      .call(updateIntegrationFlowGroups, { integrationId, payload, formKey })
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey })
      .call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined, formKey })
      .put(actions.asyncTask.success(formKey))
      .run()
  );
  test('should not call updateIntegrationFlowGroups if the groupname is not changed and not call updateIntegrationFlowgroups if both flowIds and deSelectedFlowIds are not present', () =>
    expectSaga(editFlowGroup, { integrationId, flowGroupId, groupName, flowIds: [], deSelectedFlowIds: [], formKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
      ])
      .not.call(updateIntegrationFlowGroups, { integrationId, payload, formKey })
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
  const args = {
    path: `/integrations/${integrationId}`,
    opts: {
      method: 'put',
      body: {
        _id: integrationId,
        flowGroupings: [
          {
            name: 'group2',
            _id: 'fg2',
          },
        ],
      },
    },
    hidden: false,
    message: 'Delete flow group',
  };
  const response = {
    _id: integrationId,
    flowGroupings: [
      {
        name: 'group2',
        _id: 'fg2',
      },
    ],
  };
  const error = {
    code: '200',
    message: 'something',
  };

  test('Should call deleteFlowGroupIdFromFlow api call for every Flow and call apiCallWithRetry with new payload', () =>
    expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flowIds})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, { flowIds })],
        [call(apiCallWithRetry, args), response],
      ])
      .call(updateFlowsWithFlowGroupId, { flowIds })
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .run()
  );

  test('If apiCallWithRetry fails, should dispatch flowGroups deleteFailed action', () =>
    expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flowIds})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(updateFlowsWithFlowGroupId, {flowIds})],
        [call(apiCallWithRetry, args), throwError(error)],
      ])
      .call(updateFlowsWithFlowGroupId, {flowIds})
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.deleteFailed(error))
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
  const args = {
    path: `/integrations/${integrationId}`,
    opts: {
      method: 'put',
      body: {
        _id: 'i1',
        flowGroupings: [
          {
            name: 'group2',
            _id: 'fg2',
          },
          {
            name: 'group1',
            _id: 'fg1',
          },
        ],
      },
    },
    hidden: false,
    message: 'Shift flow groups order',
  };
  const response = {
    _id: 'i1',
    flowGroupings: [
      {
        name: 'group2',
        _id: 'fg2',
      },
      {
        name: 'group1',
        _id: 'fg1',
      },
    ],
  };
  const error = {
    code: '200',
    message: 'something',
  };

  test('On Successful api call, should dispatch resource resource action for integrations', () =>
    expectSaga(flowGroupsShiftOrder, {integrationId, flowGroupId, newIndex})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(apiCallWithRetry, args), response],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .run()
  );
  test('If api call fails, should dispatch flowGroups createOrUpdateFailed action', () =>
    expectSaga(flowGroupsShiftOrder, {integrationId, flowGroupId, newIndex})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(apiCallWithRetry, args), throwError(error)],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .run()
  );
});

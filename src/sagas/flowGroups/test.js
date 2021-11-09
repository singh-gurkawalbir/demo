/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  updateFlowsWithFlowGroupId,
  deleteFlowGroup,
  deleteFlowGroupIdFromFlow,
  createOrUpdateFlowGroup,
  flowGroupsShiftOrder,
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
  const response = {};
  const error = {};
  const asyncKey = 'something';

  test('pass', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, asyncKey })
      .provide([[call(apiCallWithRetry, args), response]])
      .call(apiCallWithRetry, args)
      .run()
  );
  test('fail', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, asyncKey })
      .provide([[call(apiCallWithRetry, args), throwError(error)]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .put(actions.asyncTask.failed(asyncKey))
      .run()
  );
});

describe('deleteFlowGroupIdFromFlow saga', () => {
  const flow = {
    _id: 'f1',
    _flowGroupingId: 'fg1',
  };
  const payload = {
    _id: 'f1',
  };
  const args = {
    path: `/flows/${flow._id}`,
    opts: {
      method: 'put',
      body: payload,
    },
    hidden: false,
    message: 'Updating flow group',
  };
  const response = { ...payload };
  const error = {};

  test('pass', () =>
    expectSaga(deleteFlowGroupIdFromFlow, { flow })
      .provide([[call(apiCallWithRetry, args), response]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('flows', response))
      .run()
  );
  test('fail', () =>
    expectSaga(deleteFlowGroupIdFromFlow, { flow })
      .provide([[call(apiCallWithRetry, args), throwError(error)]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.deleteFailed(error))
      .run()
  );
});

describe('createOrUpdateFlowGroup saga', () => {
  const integrationId = 'id1';
  const groupName = 'group1';
  const flowIds = ['f1', 'f2'];
  const deSelectedFlows = [
    {
      _id: 'f3',
      _flowGroupingId: 'fg1',
    },
  ];
  const asyncKey = 'something';
  const integrationWithoutFlowGropings = {
    _id: integrationId,
    flowGroupings: [],
  };
  const args = {
    path: `/integrations/${integrationId}`,
    opts: {
      method: 'PUT',
      body: {
        _id: integrationId,
        flowGroupings: [
          {
            name: groupName,
          },
        ],
      },
    },
    hidden: false,
    message: 'Updating flow groups',
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
  const error = {};

  test('pass', () =>
    expectSaga(createOrUpdateFlowGroup, { integrationId, groupName, flowIds, deSelectedFlows, asyncKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integrationWithoutFlowGropings],
        [call(apiCallWithRetry, args), response],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg1', asyncKey })],
      ])
      .put(actions.asyncTask.start(asyncKey))
      .call(apiCallWithRetry, args)
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg1', asyncKey })
      .put(actions.resource.received('integrations', response))
      .put(actions.asyncTask.success(asyncKey))
      .run()
  );

  test('pass 2', () => {
    const integrationId2 = 'i2';
    const groupName2 = 'group2';
    const intgegrationWithFlowGroupings = {
      _id: 'integrationId2',
      flowGroupings: [
        {
          name: groupName2,
          _id: 'fg2',
        },
      ],
    };

    const saga = expectSaga(createOrUpdateFlowGroup, { integrationId: integrationId2, groupName: groupName2, flowIds, deSelectedFlows, asyncKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId2), intgegrationWithFlowGroupings],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg2', asyncKey })],
        ...deSelectedFlows.map(flow => [call(deleteFlowGroupIdFromFlow, {flow})]),
      ])
      .put(actions.asyncTask.start(asyncKey))
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg2', asyncKey });

    deSelectedFlows.map(flow => saga.call(deleteFlowGroupIdFromFlow, { flow }));

    return saga.put(actions.asyncTask.success(asyncKey)).run();
  });
  test('error', () =>
    expectSaga(createOrUpdateFlowGroup, { integrationId, groupName, flowIds, deSelectedFlows, asyncKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integrationWithoutFlowGropings],
        [call(apiCallWithRetry, args), throwError(error)],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .put(actions.asyncTask.failed(asyncKey))
      .run()
  );
});

describe('deleteFlowGroup saga', () => {
  const integrationId = 'i1';
  const groupName = 'group1';
  const flows = [
    {
      _id: 'f1',
      _flowGroupingId: 'fg1',
    },
    {
      _id: 'f2',
      _flowGroupingId: 'fg1',
    }];
  const integration = {
    _id: integrationId,
    flowGroupings: [
      {
        name: groupName,
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
  const error = {};

  test('pass', () => {
    const saga = expectSaga(deleteFlowGroup, {integrationId, groupName, flows})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(apiCallWithRetry, args), response],
        ...flows.map(flow => [call(deleteFlowGroupIdFromFlow, {flow})]),
      ]);

    flows.forEach(flow => saga.call(deleteFlowGroupIdFromFlow, { flow }));

    return saga
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .run();
  });

  test('fail', () => {
    const saga = expectSaga(deleteFlowGroup, {integrationId, groupName, flows})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(apiCallWithRetry, args), throwError(error)],
        ...flows.map(flow => [call(deleteFlowGroupIdFromFlow, {flow})]),
      ]);

    flows.map(flow => saga.call(deleteFlowGroupIdFromFlow, {flow}));

    return saga
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.deleteFailed(error))
      .run();
  });
});

describe('flowGroupsShiftOrder saga', () => {
  const integrationId = 'i1';
  const groupName = 'group1';
  const newIndex = 1;
  const integration = {
    _id: integrationId,
    flowGroupings: [
      {
        name: groupName,
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
            name: groupName,
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
        name: groupName,
        _id: 'fg1',
      },
    ],
  };
  const error = {};

  test('pass', () =>
    expectSaga(flowGroupsShiftOrder, {integrationId, groupName, newIndex})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(apiCallWithRetry, args), response],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .run()
  );
  test('fail', () =>
    expectSaga(flowGroupsShiftOrder, {integrationId, groupName, newIndex})
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integration],
        [call(apiCallWithRetry, args), throwError(error)],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .run()
  );
});

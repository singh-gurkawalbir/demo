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
  updateIntegration,
  createOrUpdateFlowGroup,
  deleteFlowGroupIdFromFlow,
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
  const error = {
    code: 200,
    message: 'something',
  };
  const asyncKey = 'something';

  test('On successful api call, should call getResourceCollection api for flows', () =>
    expectSaga(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, asyncKey })
      .provide([
        [call(apiCallWithRetry, args)],
        [call(getResourceCollection, { resourceType: 'flows'})],
      ])
      .call(apiCallWithRetry, args)
      .call(getResourceCollection, { resourceType: 'flows' })
      .run()
  );
  test('if api call fails should dispatch flowGroups createOrUpdateFailed action', () =>
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
  const error = {
    code: 200,
    message: 'something',
  };

  test('On successful api call, should dispatch resource received action for flows', () =>
    expectSaga(deleteFlowGroupIdFromFlow, { flow })
      .provide([[call(apiCallWithRetry, args), response]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('flows', response))
      .run()
  );
  test('if api call fails should dispatch flowGroups deleteFailed action', () =>
    expectSaga(deleteFlowGroupIdFromFlow, { flow })
      .provide([[call(apiCallWithRetry, args), throwError(error)]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.deleteFailed(error))
      .run()
  );
});

describe('updateIntegration saga', () => {
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
  const asyncKey = 'something';

  test('On successful api call, should disaptch resource received action for integrations', () =>
    expectSaga(updateIntegration, { integrationId, payload, asyncKey })
      .provide([[call(apiCallWithRetry, args), response]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.received('integrations', response))
      .returns(response)
      .run()
  );
  test('if api call fails should dispatch flowGroups createOrUpdateFailed action', () =>
    expectSaga(updateIntegration, { integrationId, payload, asyncKey })
      .provide([[call(apiCallWithRetry, args), throwError(error)]])
      .call(apiCallWithRetry, args)
      .put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error))
      .put(actions.asyncTask.failed(asyncKey))
      .run()
  );
});

describe('createOrUpdateFlowGroup saga', () => {
  const integrationId = 'id1';
  const groupName = 'group1';
  let flowGroupId;
  const flowIds = ['f1', 'f2'];
  const deSelectedFlows = [
    {
      _id: 'f3',
      _flowGroupingId: 'fg1',
    },
  ];
  const asyncKey = 'something';
  const integrationWithoutFlowGroupings = {
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

  test('if flowGroupId is not present should call updateIntegration and updateFlowsWithFlowGroupId api calls', () =>
    expectSaga(createOrUpdateFlowGroup, { integrationId, groupName, flowGroupId, flowIds, deSelectedFlows, asyncKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId), integrationWithoutFlowGroupings],
        [call(updateIntegration, { integrationId, payload, asyncKey}), response],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg1', asyncKey })],
      ])
      .put(actions.asyncTask.start(asyncKey))
      .call(updateIntegration, { integrationId, payload, asyncKey})
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg1', asyncKey })
      .put(actions.asyncTask.success(asyncKey))
      .run()
  );

  test('if flowGroup is present and corresponding groupName is different to the name present in flowGroupings, should call updateIntegration, updateFlowsWithFlowGroupId and updateFlowsWithFlowGroupId', () => {
    flowGroupId = 'fg2';
    const integrationId2 = 'i2';
    const groupName2 = 'newGroupName';
    const intgegrationWithFlowGroupings = {
      _id: 'integrationId2',
      flowGroupings: [
        {
          name: 'group2',
          _id: 'fg2',
        },
      ],
    };
    const payload = {
      _id: 'integrationId2',
      flowGroupings: [
        {
          name: groupName2,
          _id: 'fg2',
        },
      ],
    };

    const saga = expectSaga(createOrUpdateFlowGroup, { integrationId: integrationId2, groupName: groupName2, flowGroupId, flowIds, deSelectedFlows, asyncKey })
      .provide([
        [select(selectors.resource, 'integrations', integrationId2), intgegrationWithFlowGroupings],
        [call(updateIntegration, {integrationId, payload, asyncKey})],
        [call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg2', asyncKey })],
        ...deSelectedFlows.map(flow => [call(deleteFlowGroupIdFromFlow, {flow})]),
      ])
      .put(actions.asyncTask.start(asyncKey))
      .call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId: 'fg2', asyncKey });

    deSelectedFlows.map(flow => saga.call(deleteFlowGroupIdFromFlow, { flow }));

    return saga.put(actions.asyncTask.success(asyncKey)).run();
  });

  test('if flowGroup is present and corresponding groupName is same as the name present in flowGroupings, should call updateFlowsWithFlowGroupId and updateFlowsWithFlowGroupId', () => {
    flowGroupId = 'fg2';
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

    const saga = expectSaga(createOrUpdateFlowGroup, { integrationId: integrationId2, groupName: groupName2, flowGroupId, flowIds, deSelectedFlows, asyncKey })
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
});

describe('deleteFlowGroup saga', () => {
  const integrationId = 'i1';
  const flowGroupId = 'fg1';
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

  test('Should call deleteFlowGroupIdFromFlow api call for every Flow and call apiCallWithRetry with new payload', () => {
    const saga = expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flows})
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

  test('If apiCallWithRetry fails, should dispatch flowGroups deleteFailed action', () => {
    const saga = expectSaga(deleteFlowGroup, {integrationId, flowGroupId, flows})
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

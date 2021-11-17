import { call, put, all, takeEvery, select } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { getResourceCollection } from '../resources';

export function* updateFlowsWithFlowGroupId({ flowIds, flowGroupId, asyncKey }) {
  try {
    yield call(apiCallWithRetry, {
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
    });

    yield call(getResourceCollection, { resourceType: 'flows' });
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error));
    yield put(actions.asyncTask.failed(asyncKey));
  }
}

export function* deleteFlowGroupIdFromFlow({ flow }) {
  const path = `/flows/${flow?._id}`;
  const payload = { ...flow };

  delete payload._flowGroupingId;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Updating flow group',
    });

    yield put(actions.resource.received('flows', response));
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.deleteFailed(error));
  }
}
export function* updateIntegration({ integrationId, payload, asyncKey }) {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}`,
      opts: {
        method: 'PUT',
        body: payload,
      },
      hidden: false,
      message: 'Updating flow groups',
    });
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error));
    yield put(actions.asyncTask.failed(asyncKey));

    return;
  }

  yield put(actions.resource.received('integrations', response));

  return response;
}
export function* createOrUpdateFlowGroup({ integrationId, groupName, flowGroupId, flowIds, deSelectedFlows, asyncKey }) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);

  yield put(actions.asyncTask.start(asyncKey));

  if (!flowGroupId) {
    const updatedFlowGroupings = [...integration.flowGroupings];

    updatedFlowGroupings.push({
      name: groupName,
    });
    const payload = { ...integration, flowGroupings: updatedFlowGroupings };
    const response = yield call(updateIntegration, { integrationId, payload, asyncKey});

    if (response) {
      const { _id: flowGroupId } = response.flowGroupings?.find(flowGroup => flowGroup.name === groupName);

      yield call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, asyncKey });
      yield put(actions.resource.received('integrations', response));
    }
  } else {
    const isGroupNameChanged = integration.flowGroupings.find(flowGroup => flowGroup._id === flowGroupId)?.name !== groupName;

    if (isGroupNameChanged) {
      const updatedFlowGroupings = [...integration.flowGroupings].map(flowGroup => {
        if (flowGroup._id === flowGroupId) {
          return {
            _id: flowGroupId,
            name: groupName,
          };
        }

        return flowGroup;
      });
      const payload = { ...integration, flowGroupings: updatedFlowGroupings };

      yield call(updateIntegration, { integrationId, payload, asyncKey});
    }

    yield call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, asyncKey});
    yield all(deSelectedFlows.map(flow => call(deleteFlowGroupIdFromFlow, { flow })));
  }

  yield put(actions.asyncTask.success(asyncKey));
}
export function* deleteFlowGroup({ integrationId, flowGroupId, flows }) {
  if (flows) {
    yield all(flows?.map(flow => call(deleteFlowGroupIdFromFlow, {flow})));
  }

  const integration = yield select(selectors.resource, 'integrations', integrationId);
  const path = `/integrations/${integrationId}`;
  const updatedFlowGroupings = integration?.flowGroupings.filter(flowGroup => flowGroup._id !== flowGroupId);

  const payload = { ...integration, flowGroupings: updatedFlowGroupings };

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Delete flow group',
    });

    yield put(actions.resource.received('integrations', response));
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.deleteFailed(error));
  }
}

export function* flowGroupsShiftOrder({ integrationId, flowGroupId, newIndex}) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);
  const path = `/integrations/${integrationId}`;

  const updatedFlowGroupings = [...integration.flowGroupings];

  const flowGroupIndex = updatedFlowGroupings.findIndex(flowGroup => flowGroup._id === flowGroupId);
  const [removed] = updatedFlowGroupings.splice(flowGroupIndex, 1);

  updatedFlowGroupings.splice(newIndex, 0, removed);
  const payload = { ...integration, flowGroupings: updatedFlowGroupings };

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Shift flow groups order',
    });

    yield put(actions.resource.received('integrations', response));
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.createOrUpdateFailed(error));
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE, createOrUpdateFlowGroup),
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.DELETE, deleteFlowGroup),
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.SHIFT_ORDER, flowGroupsShiftOrder),
];

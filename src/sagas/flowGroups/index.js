import { call, put, all, takeEvery } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import actionTypes from '../../actions/types';

export function* updateResource({ flow, flowGroupId, asyncKey }) {
  const path = `/flows/${flow?._id}`;
  const payload = {
    ...flow,
    _flowGroupingId: flowGroupId,
  };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Updating flow group',
    });
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.createFailed(error));
    yield put(actions.asyncTask.failed(asyncKey));
  }
}
export function* deleteFlowGroupFromFlow({ flow }) {
  const path = `/flows/${flow?._id}`;
  const payload = { ...flow };

  delete payload._flowGroupingId;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Updating flow group',
    });
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.deleteFailed(error));
  }
}
export function* createOrUpdateFlowGroup({ integration, groupName, flows, deSelectedFlows, asyncKey }) {
  const groupId = integration.flowGroupings.find(flowGroup => flowGroup.name === groupName)?._id;

  yield put(actions.asyncTask.start(asyncKey));

  if (!groupId) {
    const path = `/integrations/${integration._id}`;
    const payload = { ...integration };
    let response;

    payload.flowGroupings.push({ name: groupName});

    try {
      response = yield call(apiCallWithRetry, {
        path,
        opts: {
          method: 'put',
          body: payload,
        },
        hidden: false,
        message: 'Updating flow group',
      });
    } catch (error) {
      yield put(actions.resource.integrations.flowGroups.createFailed(error));
      yield put(actions.asyncTask.failed(asyncKey));
    }

    if (response) {
      const { _id: flowGroupId } = response.flowGroupings?.find(flowGroup => flowGroup.name === groupName);

      yield all(flows.map(flow => call(updateResource, { flow, flowGroupId, asyncKey })));
    }
  } else {
    const addGroupIdToFlows = flows.filter(flow => !flow._flowGroupingId);

    yield all(addGroupIdToFlows.map(flow => call(updateResource, { flow, flowGroupId: groupId, asyncKey})));
    yield all(deSelectedFlows.map(flow => call(deleteFlowGroupFromFlow, { flow })));
  }

  yield put(actions.asyncTask.success(asyncKey));
}
export function* deleteFlowGroup({ integration, groupName, flows }) {
  yield all(flows.map(flow => call(deleteFlowGroupFromFlow, {flow})));

  const path = `/integrations/${integration._id}`;
  const payload = { ...integration };
  const newFlowGroups = integration.flowGroupings.filter(flowGroup => flowGroup.name !== groupName);

  payload.flowGroupings = { ...newFlowGroups };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'put',
        body: payload,
      },
      hidden: false,
      message: 'Delete flow group',
    });
  } catch (error) {
    yield put(actions.resource.integrations.flowGroups.deleteFailed(error));
  }
}
export default [
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE, createOrUpdateFlowGroup),
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.DELETE, deleteFlowGroup),
];

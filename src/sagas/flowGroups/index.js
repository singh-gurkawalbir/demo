import { call, put, all, takeEvery } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import actionTypes from '../../actions/types';

export function* updateResource({ flow, flowGroupId }) {
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
  }
}
export function* createOrUpdateFlowGroup({ integration, groupName, flows }) {
  if (!integration) {
    return;
  }
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
  }

  if (response) {
    const { _id: flowGroupId } = response.flowGroupings?.find(flowGroup => flowGroup.name === groupName);

    yield all(flows.map(flow => call(updateResource, { flow, flowGroupId })));
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE, createOrUpdateFlowGroup),
];

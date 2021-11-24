import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { getResourceCollection } from '../resources';

export function* updateFlowsWithFlowGroupId({ flowIds, flowGroupId, formKey }) {
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

    if (formKey) {
      yield put(actions.asyncTask.failed(formKey));
    }
  }
}

export function* updateIntegrationFlowGroups({ integrationId, payload, formKey }) {
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
    yield put(actions.asyncTask.failed(formKey));

    return;
  }

  yield put(actions.resource.received('integrations', response));

  return response;
}
export function* addFlowGroup({ integrationId, groupName, flowIds, formKey }) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);
  const updatedFlowGroupings = [...integration.flowGroupings];

  updatedFlowGroupings.push({
    name: groupName,
  });
  const payload = { ...integration, flowGroupings: updatedFlowGroupings };
  const response = yield call(updateIntegrationFlowGroups, { integrationId, payload, formKey});

  if (response && flowIds.length) {
    const { _id: flowGroupId } = response.flowGroupings?.find(flowGroup => flowGroup.name === groupName);

    yield call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey });
  }
  yield put(actions.asyncTask.success(formKey));
}
export function* editFlowGroup({ integrationId, flowGroupId, groupName, flowIds, deSelectedFlowIds, formKey }) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);
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

    yield call(updateIntegrationFlowGroups, { integrationId, payload, formKey});
  }

  if (flowIds.length) {
    yield call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId, formKey});
  }

  if (deSelectedFlowIds.length) {
    yield call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined, formKey});
  }
  yield put(actions.asyncTask.success(formKey));
}
export function* createOrUpdateFlowGroup({ integrationId, flowGroupId, formKey }) {
  const flowsTiedToIntegrations = yield select(selectors.allFlowsTiedToIntegrations, integrationId);
  const flowsWithSelectedGroupId = flowsTiedToIntegrations.filter(flow => flow._flowGroupingId === flowGroupId);
  const formState = yield select(selectors.formState, formKey);
  const { fields: formFields } = formState || {};

  const newGroupName = formFields?.name?.value;
  const flowIds = formFields?._flowIds?.value;

  yield put(actions.asyncTask.start(formKey));

  if (!flowGroupId) {
    yield call(addFlowGroup, { integrationId, groupName: newGroupName, flowIds, formKey });
  } else {
    const selectedFlowIds = flowIds.filter(flowId => !flowsWithSelectedGroupId.some(flow => flow._id === flowId));
    const deSelectedFlowIds = flowsWithSelectedGroupId.filter(flow => !flowIds.some(flowId => flowId === flow._id)).map(flow => flow._id);

    yield call(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds: selectedFlowIds, deSelectedFlowIds, formKey });
  }
}
export function* deleteFlowGroup({ integrationId, flowGroupId, flowIds }) {
  if (flowIds.length) {
    yield call(updateFlowsWithFlowGroupId, { flowIds });
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

  const oldFlowGroupIndex = updatedFlowGroupings.findIndex(flowGroup => flowGroup._id === flowGroupId);
  const [removed] = updatedFlowGroupings.splice(oldFlowGroupIndex, 1);

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
  takeLatest(actionTypes.INTEGRATION.FLOW_GROUPS.SHIFT_ORDER, flowGroupsShiftOrder),
];

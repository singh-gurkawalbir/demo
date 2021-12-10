import { call, put, takeEvery, takeLatest, select, putResolve } from 'redux-saga/effects';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { patchResource } from '../resources';

export function* patchIntegrationChanges({ integrationId, flowGroupings}) {
  const patchSet = [
    {
      op: 'replace',
      path: '/flowGroupings',
      value: flowGroupings,
    },
  ];

  const response = yield call(patchResource, {
    resourceType: 'integrations',
    id: integrationId,
    patchSet,
  });

  return response;
}

export function* updateFlowsWithFlowGroupId({ flowIds, flowGroupId }) {
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

    yield putResolve(actions.resource.requestCollection('flows'));
  } catch (error) {
    return {error};
  }
}

export function* updateIntegrationFlowGroups({ integrationId, payload }) {
  try {
    const response = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}`,
      opts: {
        method: 'PUT',
        body: payload,
      },
      hidden: false,
      message: 'Updating flow groups',
    });

    yield put(actions.resource.received('integrations', response));

    return response;
  } catch (error) {
    return {error};
  }
}
export function* addFlowGroup({ integrationId, groupName, flowIds, formKey }) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);
  const updatedFlowGroupings = [...integration.flowGroupings];

  updatedFlowGroupings.push({
    name: groupName,
  });
  const payload = { ...integration, flowGroupings: updatedFlowGroupings };
  let response = yield call(updateIntegrationFlowGroups, { integrationId, payload });

  if (response && !response.error && flowIds.length) {
    const { _id: flowGroupId } = response.flowGroupings?.find(flowGroup => flowGroup.name === groupName);

    response = yield call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId });
  }

  if (response?.error) {
    yield put(actions.resource.integrations.flowGroups.createOrUpdateFailed(response.error));
    yield put(actions.asyncTask.failed(formKey));

    return;
  }

  yield put(actions.asyncTask.success(formKey));
}

export function* editFlowGroup({ integrationId, flowGroupId, groupName, flowIds, deSelectedFlowIds, formKey }) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);
  const isGroupNameChanged = integration.flowGroupings.find(flowGroup => flowGroup._id === flowGroupId)?.name !== groupName;
  let response;

  if (isGroupNameChanged) {
    // replace the name of the selected flow group with new value 'groupName'
    const updatedFlowGroupings = [...integration.flowGroupings].map(flowGroup => {
      if (flowGroup._id === flowGroupId) {
        return {
          _id: flowGroupId,
          name: groupName,
        };
      }

      return flowGroup;
    });

    response = yield call(patchIntegrationChanges, { integrationId, flowGroupings: updatedFlowGroupings });
  }

  if (!response?.error && flowIds.length) {
    response = yield call(updateFlowsWithFlowGroupId, { flowIds, flowGroupId });
  }

  if (!response?.error && deSelectedFlowIds.length) {
    response = yield call(updateFlowsWithFlowGroupId, { flowIds: deSelectedFlowIds, flowGroupId: undefined });
  }

  if (response?.error) {
    yield put(actions.resource.integrations.flowGroups.createOrUpdateFailed(response.error));
    yield put(actions.asyncTask.failed(formKey));

    return;
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
    // find the flowIds of the flows which are newly added to the Form and do not belong to flowsWithSelectedGroupId array
    const selectedFlowIds = flowIds.filter(flowId => !flowsWithSelectedGroupId.some(flow => flow._id === flowId));
    // find the flowid's of flows which belong to flowsWithSelectedGroupId array but are removed from Form
    const deSelectedFlowIds = flowsWithSelectedGroupId.filter(flow => !flowIds.some(flowId => flowId === flow._id)).map(flow => flow._id);

    yield call(editFlowGroup, { integrationId, flowGroupId, groupName: newGroupName, flowIds: selectedFlowIds, deSelectedFlowIds, formKey });
  }
}

export function* deleteFlowGroup({ integrationId, flowGroupId, flowIds }) {
  let response;

  // remove _flowGroupingId from every flow belonging to the flowGroup with id as flowGroupId
  if (flowIds.length) {
    response = yield call(updateFlowsWithFlowGroupId, { flowIds });
  }

  if (!response?.error) {
    const integration = yield select(selectors.resource, 'integrations', integrationId);
    // remove the flow group with id as flowGroupId from flowGroupings of integration
    const updatedFlowGroupings = integration?.flowGroupings.filter(flowGroup => flowGroup._id !== flowGroupId);

    response = yield call(patchIntegrationChanges, { integrationId, flowGroupings: updatedFlowGroupings });
  }

  if (response?.error) {
    yield put(actions.resource.integrations.flowGroups.deleteFailed(response.error));
  }
}

export function* flowGroupsShiftOrder({ integrationId, flowGroupId, newIndex}) {
  const integration = yield select(selectors.resource, 'integrations', integrationId);

  const updatedFlowGroupings = [...integration.flowGroupings];

  const oldFlowGroupIndex = updatedFlowGroupings.findIndex(flowGroup => flowGroup._id === flowGroupId);
  // removing the group which is to be shifted from flowGroupings
  const [removed] = updatedFlowGroupings.splice(oldFlowGroupIndex, 1);

  // adding the removed group to the flowGroupings at new index
  updatedFlowGroupings.splice(newIndex, 0, removed);

  const response = yield call(patchIntegrationChanges, { integrationId, flowGroupings: updatedFlowGroupings });

  if (response?.error) {
    yield put(actions.resource.integrations.flowGroups.createOrUpdateFailed(response.error));
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE, createOrUpdateFlowGroup),
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.DELETE, deleteFlowGroup),
  takeLatest(actionTypes.INTEGRATION.FLOW_GROUPS.SHIFT_ORDER, flowGroupsShiftOrder),
];

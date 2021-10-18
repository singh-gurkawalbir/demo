import { call, put, all, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { SCOPES } from '../resourceForm';
import { commitStagedChanges } from '../resources';

export function* createOrUpdateFlowGroup({ integration, groupName, flowIds }) {
  if (!integration) {
    return;
  }
  const { _id: integrationId, flowGroupings = [] } = integration;

  const isGroupPresent = flowGroupings.find(flowGroup => flowGroup.name === groupName);

  if (!isGroupPresent) {
    const patchSet = [{
      op: 'replace',
      path: '/flowGroupings',
      value: [
        ...flowGroupings,
        {
          name: groupName,
        },
      ],
    }];

    yield put(actions.resource.patchStaged(integrationId, patchSet, SCOPES.VALUE));

    const resp = yield call(commitStagedChanges, {
      resourceType: 'integrations',
      id: integrationId,
      scope: SCOPES.VALUE,
    });

    if (resp?.error) {
      yield put(actions.resource.integrations.flowGroups.createFailed(resp.error));
    }
  }

  const updatedIntegration = yield select(selectors.resource, 'integrations', integrationId);

  if (updatedIntegration) {
    const { _id: flowGroupId } = updatedIntegration.flowGroupings?.find(flowGroup => flowGroup.name === groupName);

    try {
      yield all(flowIds.map(flowId => {
        const patchSet = [{
          op: 'replace',
          path: '/_flowGroupingId',
          value: flowGroupId,
        }];

        put(actions.resource.patchStaged(flowId, patchSet, SCOPES.VALUE));

        return call(commitStagedChanges, {
          resourceType: 'flows',
          id: flowId,
          scope: SCOPES.VALUE,
        });
      }));
    } catch (error) {
      console.log(error);
    }
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE, createOrUpdateFlowGroup),
];

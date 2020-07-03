import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { getFlowIdAndTypeFromUniqueId } from '../../../utils/suiteScript';

export function* runFlow({ ssLinkedConnectionId, integrationId, flowId, _id }) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows/${_id
      .replace('e', '')
      .replace('i', '')}/run`,
    opts: {
      method: 'POST',
    },
  };
  let job;

  try {
    job = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(
    actions.suiteScript.job.received({
      job: {
        type: job.type,
        _id: job._jobId,
        status: 'queued',
        _integrationId: integrationId,
        _flowId: flowId,
      },
    })
  );
  yield put(
    actions.suiteScript.job.requestInProgressJobStatus({
      ssLinkedConnectionId,
      integrationId,
    })
  );
}

export function* enableFlow({ ssLinkedConnectionId, integrationId, _id }) {
  const {flowType, flowId} = getFlowIdAndTypeFromUniqueId(_id);
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows/${flowId}/enable`,
    opts: {
      method: 'PUT',
      body: {type: flowType}
    },
  };
  let flow;

  try {
    flow = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(
    actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, 'flows', flow)
  );
  yield put(actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId, _id}));
}

export function* disableFlow({ ssLinkedConnectionId, integrationId, _id }) {
  const {flowType, flowId} = getFlowIdAndTypeFromUniqueId(_id);
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows/${flowId}/disable`,
    opts: {
      method: 'PUT',
      body: {type: flowType}
    },
  };
  let flow;

  try {
    flow = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(
    actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, 'flows', flow)
  );
  yield put(actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId, _id}));
}

export function* deleteFlow({ ssLinkedConnectionId, integrationId, _id }) {
  const {flowType, flowId} = getFlowIdAndTypeFromUniqueId(_id);
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows/${flowId}?type=${flowType}`,
    opts: {
      method: 'DELETE',
    },
  };
  try {
    yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(
    actions.suiteScript.resource.deleted('flows', _id, ssLinkedConnectionId)
  );
}

export const flowSagas = [
  takeEvery(actionTypes.SUITESCRIPT.FLOW.RUN, runFlow),
  takeEvery(actionTypes.SUITESCRIPT.FLOW.ENABLE, enableFlow),
  takeEvery(actionTypes.SUITESCRIPT.FLOW.DISABLE, disableFlow),
  takeEvery(actionTypes.SUITESCRIPT.FLOW.DELETE, deleteFlow),
];

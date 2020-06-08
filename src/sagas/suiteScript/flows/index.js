import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

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

export const flowSagas = [takeEvery(actionTypes.SUITESCRIPT.FLOW.RUN, runFlow)];

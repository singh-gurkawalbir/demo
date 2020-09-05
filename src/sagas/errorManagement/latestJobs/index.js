import { put, takeLatest, fork, take, call, delay, cancel } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

function* requestLatestJobs({ integrationId }) {
  try {
    const integrationLatestJobs = yield apiCallWithRetry({
      path: `/integrations/${integrationId}/jobs/latest`,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(
      actions.errorManager.integrationLatestJobs.received({
        integrationId,
        latestJobs: integrationLatestJobs,
      })
    );
  } catch (error) {
    yield put(
      actions.errorManager.integrationLatestJobs.error({
        integrationId,
      })
    );
  }
}

function* pollForLatestJobs({ integrationId }) {
  yield put(actions.errorManager.integrationLatestJobs.request({ integrationId }));
  while (true) {
    yield call(requestLatestJobs, { integrationId });
    yield delay(5 * 1000);
  }
}

function* startPollingForLatestJobs({ integrationId }) {
  const watcher = yield fork(pollForLatestJobs, { integrationId });

  yield take(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL);
  yield cancel(watcher);
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.REQUEST,
    requestLatestJobs
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.REQUEST_FOR_POLL,
    startPollingForLatestJobs
  ),
];

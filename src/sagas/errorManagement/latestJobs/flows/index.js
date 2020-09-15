import { put, takeLatest, all, call, delay, fork, take, cancel, select } from 'redux-saga/effects';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import { apiCallWithRetry } from '../../../index';
import getRequestOptions from '../../../../utils/requestOptions';
import { selectors } from '../../../../reducers';

export function* getJobFamily({ flowId, jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_FAMILY, { resourceId: jobId }
  );
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.errorManager.latestFlowJobs.receivedJobFamily({flowId, job }));
  } catch (error) {
    //  handle errors
  }
}

export function* getInProgressJobsStatus({ flowId }) {
  const inProgressJobs = yield select(selectors.getInProgressLatestJobs, flowId);

  if (!inProgressJobs.length) {
    yield put(actions.errorManager.latestFlowJobs.noInProgressJobs());

    return;
  }
  yield all(
    inProgressJobs.map(
      jobId =>
        call(getJobFamily, {flowId, jobId})
    )
  );
}

export function* pollForInProgressJobs({ flowId }) {
  while (true) {
    yield delay(5 * 1000);

    yield call(getInProgressJobsStatus, { flowId });
  }
}

export function* startPollingForInProgressJobs({ flowId }) {
  const watcher = yield fork(pollForInProgressJobs, {flowId});

  yield take([
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CLEAR,
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CANCEL,
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST,
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.NO_IN_PROGRESS_JOBS,
  ]);
  yield cancel(watcher);
}

function* requestLatestJobs({ flowId }) {
  try {
    const latestFlowJobs = yield apiCallWithRetry({
      path: `/flows/${flowId}/jobs/latest`,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(
      actions.errorManager.latestFlowJobs.received({
        flowId,
        latestJobs: latestFlowJobs,
      })
    );
    yield all(
      latestFlowJobs.map(
        latestJob =>
          call(getJobFamily, {flowId, jobId: latestJob._id})
      )
    );
    yield put(actions.errorManager.latestFlowJobs.requestInProgressJobsPoll({ flowId }));
    if (latestFlowJobs.length > 1) {
      // Only incase of multiple PGs
      const inProgressJobs = yield select(selectors.getInProgressLatestJobs, flowId);

      if (inProgressJobs.length) {
        yield delay(10 * 1000);
        yield call(requestLatestJobs, { flowId});
      }
    }
  } catch (error) {
    // handle errors
  }
}

// TODO: @Raghu Remove this once we have the latest Jobs API implementation inplace
export function* cancelJob({ jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.CANCEL, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }
}

function* cancelLatestJobs({ flowId, jobIds = [] }) {
  yield all(jobIds.map(jobId => call(cancelJob, { jobId })));
  yield put(actions.errorManager.latestFlowJobs.request({ flowId }));
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST,
    requestLatestJobs
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST_IN_PROGRESS_JOBS_POLL,
    startPollingForInProgressJobs
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CANCEL,
    cancelLatestJobs
  ),
];

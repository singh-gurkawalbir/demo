import { put, takeLatest, all, call, fork, take, cancel, select } from 'redux-saga/effects';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import { apiCallWithRetry } from '../../../index';
import getRequestOptions from '../../../../utils/requestOptions';
import { selectors } from '../../../../reducers';
import { JOB_STATUS } from '../../../../utils/constants';
import { pollApiRequests } from '../../../app';

const FINISHED_JOB_STATUSES = [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED];
const IN_PROGRESS_JOB_STATUSES = [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING];

export function* refreshForMultipleFlowJobs({ flowId, job, latestJobs }) {
  const exportChildJob = job.children?.find(cJob => cJob?.type === 'export') || {};
  const prevStateOfJob = latestJobs.find(prevJob => prevJob._id === job._id) || {};
  const prevStateOfExportChildJob = prevStateOfJob.children?.find(cJob => cJob?.type === 'export') || {};

  // if the export job is not completed or this job is the last pg job, no need to refresh
  if (!FINISHED_JOB_STATUSES.includes(exportChildJob.status) || prevStateOfJob.__lastPageGeneratorJob) {
    return;
  }
  // if export job is finished and previously in progress,
  // then request as we can assume one more job is to be running for another PG
  if (IN_PROGRESS_JOB_STATUSES.includes(prevStateOfExportChildJob.status)) {
    yield put(actions.errorManager.latestFlowJobs.request({ flowId }));
  }
}
export function* getJobFamily({ flowId, jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_FAMILY, { resourceId: jobId }
  );
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts, hidden: true });
    const latestJobsState = yield select(selectors.latestFlowJobsList, flowId) || {};

    yield put(actions.errorManager.latestFlowJobs.receivedJobFamily({flowId, job }));
    yield call(refreshForMultipleFlowJobs, {flowId, job, latestJobs: latestJobsState.data || []});
  } catch (error) {
    //  handle errors
    // TODO @Raghu: Check how to handle errors if exist
  }
}

export function* getInProgressJobsStatus({ flowId }) {
  const inProgressJobs = yield select(selectors.getInProgressLatestJobs, flowId, true);

  if (!inProgressJobs.length) {
    return yield put(actions.errorManager.latestFlowJobs.noInProgressJobs());
  }
  yield all(
    inProgressJobs.map(
      jobId =>
        call(getJobFamily, {flowId, jobId})
    )
  );
}

export function* pollForInProgressJobs({ flowId }) {
  yield call(pollApiRequests, {pollSaga: getInProgressJobsStatus, pollSagaArgs: {flowId}, duration: 5 * 1000});
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

export function* requestLatestJobs({ flowId }) {
  try {
    const latestFlowJobs = yield call(apiCallWithRetry, {
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
  } catch (error) {
    // handle errors
    // TODO @Raghu: Check how to handle errors if exist
  }
}

export function* cancelJob({ jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.CANCEL, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    // TODO @Raghu: Check how to handle errors if exist
  }
}

export function* cancelLatestJobs({ flowId, jobIds = [] }) {
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

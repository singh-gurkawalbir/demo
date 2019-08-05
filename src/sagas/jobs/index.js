import {
  call,
  put,
  cancel,
  take,
  takeEvery,
  delay,
  select,
  all,
  fork,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import getRequestOptions from '../../utils/requestOptions';
import openExternalUrl from '../../utils/util';
import { JOB_TYPES } from '../../utils/constants';

export function* getJobFamily({ jobId, type }) {
  const requestOptions = getRequestOptions(
    type === JOB_TYPES.BULK_RETRY
      ? actionTypes.JOB.REQUEST
      : actionTypes.JOB.REQUEST_FAMILY,
    {
      resourceId: jobId,
    }
  );
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.job.receivedFamily({ job }));

    return job;
  } catch (error) {
    return undefined;
  }
}

export function* getInProgressJobsStatus({ integrationId, flowId }) {
  const inProgressJobIds = yield select(
    selectors.inProgressJobIds,
    integrationId,
    flowId
  );

  if (
    inProgressJobIds.flowJobs.length === 0 &&
    inProgressJobIds.bulkRetryJobs.length === 0
  ) {
    yield put(actions.job.noInProgressJobs({ integrationId, flowId }));

    return true;
  }

  yield all(
    inProgressJobIds.flowJobs.map(jobId => call(getJobFamily, { jobId }))
  );
  yield all(
    inProgressJobIds.bulkRetryJobs.map(jobId =>
      call(getJobFamily, { jobId, type: JOB_TYPES.BULK_RETRY })
    )
  );
}

export function* pollForInProgressJobs({ integrationId, flowId }) {
  while (true) {
    yield delay(5 * 1000);

    yield call(getInProgressJobsStatus, { integrationId, flowId });
  }
}

export function* startPollingForInProgressJobs({ integrationId, flowId }) {
  const watcher = yield fork(pollForInProgressJobs, { integrationId, flowId });

  yield take([
    actionTypes.JOB.CLEAR,
    actionTypes.JOB.NO_IN_PROGRESS_JOBS,
    actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
  ]);
  yield cancel(watcher);
}

export function* requestJobCollection({
  integrationId,
  flowId = undefined,
  filters = {},
}) {
  const requestOptions = getRequestOptions(actionTypes.JOB.REQUEST_COLLECTION);
  const { path, opts } = requestOptions;
  let queryString = '';
  const jobFilters = { ...filters, integrationId };

  if (flowId) {
    jobFilters.flowId = flowId;
  }

  Object.keys(jobFilters).forEach(p => {
    if (jobFilters[p]) {
      if (queryString) {
        queryString += '&';
      }

      queryString += `${
        ['integrationId', 'flowId'].includes(p) ? '_' : ''
      }${p}=${encodeURIComponent(jobFilters[p])}`;
    }
  });

  ['flow', 'retry', 'bulk_retry'].forEach((val, idx) => {
    if (queryString) {
      queryString += '&';
    }

    queryString += `type_in[${idx}]=${encodeURIComponent(val)}`;
  });

  try {
    const collection = yield call(apiCallWithRetry, {
      path: `${path}?${queryString}`,
      opts,
    });

    yield put(
      actions.job.receivedCollection({ collection, integrationId, flowId })
    );
    yield put(
      actions.job.getInProgressJobStatus({
        integrationId,
        flowId,
      })
    );
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it
    return undefined;
  }
}

export function* getJobCollection(options) {
  const watcher = yield fork(requestJobCollection, options);

  yield take(actionTypes.JOB.CLEAR);
  yield cancel(watcher);
}

export function* downloadDiagnosticsFile({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL,
    {
      resourceId: jobId,
    }
  );
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
    openExternalUrl({ url: response.signedURL });
  } catch (e) {
    return true;
  }
}

export function* cancelJob({ jobId, flowJobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.CANCEL, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts });

    if (flowJobId) {
      yield call(getJobFamily, { jobId: flowJobId });
    } else {
      yield put(actions.job.receivedFamily({ job }));
    }
  } catch (error) {
    return undefined;
  }
}

export function* resolveCommit({ jobs = [] }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.RESOLVE_COMMIT);
  const { path, opts } = requestOptions;

  opts.body = jobs.map(job => job._id);

  try {
    yield call(apiCallWithRetry, { path, opts });
    const uniqueParentJobIds = [];

    jobs.forEach(job => {
      const pJobId = job._flowJobId || job._id;

      if (!uniqueParentJobIds.includes(pJobId)) {
        uniqueParentJobIds.push(pJobId);
      }
    });

    yield all(uniqueParentJobIds.map(jobId => call(getJobFamily, { jobId })));
  } catch (error) {
    return undefined;
  }
}

export function* resolveAllCommit({ flowId, integrationId }) {
  const requestOptions = getRequestOptions(
    flowId
      ? actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT
      : actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
    {
      resourceId: flowId || integrationId,
    }
  );
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return undefined;
  }
}

export function* resolveSelected({ jobs }) {
  yield put(actions.job.resolveAllPending());

  yield all(
    jobs.map(job =>
      put(
        actions.job.resolveInit({ jobId: job._id, parentJobId: job._flowJobId })
      )
    )
  );
  const undoOrCommitAction = yield take([
    actionTypes.JOB.RESOLVE_COMMIT,
    actionTypes.JOB.RESOLVE_UNDO,
    actionTypes.JOB.RESOLVE_ALL_PENDING,
  ]);

  if (
    [
      actionTypes.JOB.RESOLVE_COMMIT,
      actionTypes.JOB.RESOLVE_ALL_PENDING,
    ].includes(undoOrCommitAction.type)
  ) {
    yield call(resolveCommit, { jobs });
  }
}

export function* resolveAll({ flowId, integrationId }) {
  yield put(actions.job.resolveAllPending());

  yield put(actions.job.resolveAllInit());
  const undoOrCommitAction = yield take([
    actionTypes.JOB.RESOLVE_ALL_COMMIT,
    actionTypes.JOB.RESOLVE_ALL_UNDO,
    actionTypes.JOB.RESOLVE_ALL_PENDING,
  ]);

  if (
    [
      actionTypes.JOB.RESOLVE_ALL_COMMIT,
      actionTypes.JOB.RESOLVE_ALL_PENDING,
    ].includes(undoOrCommitAction.type)
  ) {
    yield call(resolveAllCommit, { flowId, integrationId });
  }
}

export function* retryCommit({ jobs = [] }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.RETRY_COMMIT);
  const { path, opts } = requestOptions;

  opts.body = jobs.map(job => job._id);

  try {
    yield call(apiCallWithRetry, { path, opts });
    const uniqueParentJobIds = [];

    jobs.forEach(job => {
      const pJobId = job._flowJobId || job._id;

      if (!uniqueParentJobIds.includes(pJobId)) {
        uniqueParentJobIds.push(pJobId);
      }
    });

    yield all(uniqueParentJobIds.map(jobId => call(getJobFamily, { jobId })));
    yield put(actions.job.getInProgressJobStatus({}));
  } catch (error) {
    return undefined;
  }
}

export function* retrySelected({ jobs }) {
  // yield put(actions.job.resolveAllPending());

  const flowJobIds = [];

  jobs.forEach(job => {
    const flowJobId = job._flowJobId || job._id;

    if (!flowJobIds.includes(flowJobId)) {
      flowJobIds.push(flowJobId);
    }
  });

  yield all(
    jobs.map(job =>
      put(
        actions.job.retryInit({ jobId: job._id, parentJobId: job._flowJobId })
      )
    )
  );
  const undoOrCommitAction = yield take([
    actionTypes.JOB.RETRY_COMMIT,
    actionTypes.JOB.RETRY_UNDO,
    actionTypes.JOB.RETRY_ALL_PENDING,
    actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
  ]);

  if (
    [
      actionTypes.JOB.RETRY_COMMIT,
      actionTypes.JOB.RETRY_ALL_PENDING,
      actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
    ].includes(undoOrCommitAction.type)
  ) {
    yield call(retryCommit, { jobs });
  }
}

export function* retryFlowJob({ jobId }) {
  let job = yield select(selectors.job, { type: JOB_TYPES.FLOW, jobId });

  if (!job) {
    return false;
  }

  if (!job.children || job.children.length === 0) {
    yield call(getJobFamily, { jobId });
    job = yield select(selectors.job, { type: JOB_TYPES.FLOW, jobId });
  }

  const jobsToRetry = [];

  job.children &&
    job.children.forEach(cJob => {
      if (cJob.retriable) {
        jobsToRetry.push({ _id: cJob._id, _flowJobId: jobId });
      }
    });

  if (jobsToRetry.length === 0) {
    return false;
  }

  yield call(retrySelected, { jobs: jobsToRetry });
}

export function* retryAllCommit({ flowId, integrationId }) {
  const requestOptions = getRequestOptions(
    flowId
      ? actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT
      : actionTypes.JOB.RETRY_ALL_IN_INTEGRATION_COMMIT,
    {
      resourceId: flowId || integrationId,
    }
  );
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.job.receivedFamily({ job }));
    yield put(actions.job.getInProgressJobStatus({}));
  } catch (error) {
    return undefined;
  }
}

export function* retryAll({ flowId, integrationId }) {
  // yield put(actions.job.resolveAllPending());

  yield put(actions.job.retryAllInit());
  const undoOrCommitAction = yield take([
    actionTypes.JOB.RETRY_ALL_COMMIT,
    actionTypes.JOB.RETRY_ALL_UNDO,
    actionTypes.JOB.RETRY_ALL_PENDING,
    actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
  ]);

  if (
    [
      actionTypes.JOB.RETRY_ALL_COMMIT,
      actionTypes.JOB.RETRY_ALL_PENDING,
      actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
    ].includes(undoOrCommitAction.type)
  ) {
    yield call(retryAllCommit, { flowId, integrationId });
  }
}

export function* requestRetryObjectCollection({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_RETRY_OBJECT_COLLECTION,
    {
      resourceId: jobId,
    }
  );
  const { path, opts } = requestOptions;

  try {
    const collection = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.job.receivedRetryObjects({ collection, jobId }));
  } catch (error) {
    return undefined;
  }
}

export function* requestJobErrorCollection({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.ERROR.REQUEST_COLLECTION,
    {
      resourceId: jobId,
    }
  );
  const { path, opts } = requestOptions;

  try {
    const collection = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.job.receivedErrors({ collection, jobId }));
  } catch (error) {
    return undefined;
  }
}

export function* requestRetryObjectAndJobErrorCollection({ jobId }) {
  yield call(requestRetryObjectCollection, { jobId });
  yield call(requestJobErrorCollection, { jobId });
}

export function* getJobErrors({ jobType, jobId, parentJobId }) {
  const watcher = yield fork(requestRetryObjectAndJobErrorCollection, {
    jobType,
    jobId,
    parentJobId,
  });

  yield take(actionTypes.JOB.ERROR.CLEAR);
  yield cancel(watcher);
}

export function* downloaErrorFile({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_ERROR_FILE_URL,
    {
      resourceId: jobId,
    }
  );
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
    openExternalUrl({ url: response.signedURL });
  } catch (e) {
    return true;
  }
}

export const jobSagas = [
  takeEvery(actionTypes.JOB.REQUEST_COLLECTION, getJobCollection),
  takeEvery(actionTypes.JOB.REQUEST_FAMILY, getJobFamily),
  takeEvery(
    actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
    startPollingForInProgressJobs
  ),
  takeEvery(actionTypes.JOB.DOWNLOAD_DIAGNOSTICS_FILE, downloadDiagnosticsFile),
  takeEvery(actionTypes.JOB.CANCEL, cancelJob),
  takeEvery(actionTypes.JOB.RESOLVE_SELECTED, resolveSelected),
  takeEvery(actionTypes.JOB.RESOLVE_ALL, resolveAll),
  takeEvery(actionTypes.JOB.RETRY_SELECTED, retrySelected),
  takeEvery(actionTypes.JOB.RETRY_FLOW_JOB, retryFlowJob),
  takeEvery(actionTypes.JOB.RETRY_ALL, retryAll),
  takeEvery(actionTypes.JOB.ERROR.REQUEST_COLLECTION, getJobErrors),
  takeEvery(actionTypes.JOB.DOWNLOAD_ERROR_FILE, downloaErrorFile),
];

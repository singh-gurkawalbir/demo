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

export function* getJobFamily({ jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.REQUEST_FAMILY, {
    resourceId: jobId,
  });
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

  if (!inProgressJobIds.length) {
    yield put(actions.job.noInProgressJobs({ integrationId, flowId }));

    return true;
  }

  yield all(inProgressJobIds.map(jobId => call(getJobFamily, { jobId })));
}

export function* pollForInProgressJobs({ integrationId, flowId }) {
  while (true) {
    yield delay(5 * 1000);

    yield call(getInProgressJobsStatus, { integrationId, flowId });
  }
}

export function* startPollingForInProgressJobs({ integrationId, flowId }) {
  const watcher = yield fork(pollForInProgressJobs, { integrationId, flowId });

  yield take([actionTypes.JOB.CLEAR, actionTypes.JOB.NO_IN_PROGRESS_JOBS]);
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

export function* cancelJob({ jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.CANCEL, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.job.receivedFamily({ job }));

    return job;
  } catch (error) {
    return undefined;
  }
}

export function* resolveCommit({ jobId, parentJobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.RESOLVE_COMMIT, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, { path, opts });

    yield call(getJobFamily, { jobId: parentJobId || jobId });
  } catch (error) {
    return undefined;
  }
}

export function* resolve({ jobId, parentJobId }) {
  yield put(actions.job.resolveAllPending());
  yield put(actions.job.resolveInit({ jobId, parentJobId }));
  const undoOrCommitAction = yield take([
    actionTypes.JOB.RESOLVE_COMMIT,
    actionTypes.JOB.RESOLVE_UNDO,
    actionTypes.JOB.RESOLVE_ALL_PENDING,
  ]);

  if (undoOrCommitAction.type === actionTypes.JOB.RESOLVE_COMMIT) {
    if (undoOrCommitAction.jobId === jobId) {
      yield call(resolveCommit, { jobId, parentJobId });
    }
  } else if (undoOrCommitAction.type === actionTypes.JOB.RESOLVE_ALL_PENDING) {
    yield call(resolveCommit, { jobId, parentJobId });
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
  // takeEvery(actionTypes.JOB.RESOLVE_COMMIT, resolve),
  takeEvery(actionTypes.JOB.RESOLVE, resolve),
];

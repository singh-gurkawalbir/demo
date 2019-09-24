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
import openExternalUrl from '../../utils/window';
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
  let job;

  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  yield put(actions.job.receivedFamily({ job }));
}

export function* getInProgressJobsStatus() {
  const inProgressJobIds = yield select(selectors.inProgressJobIds);

  if (
    inProgressJobIds.flowJobs.length === 0 &&
    inProgressJobIds.bulkRetryJobs.length === 0
  ) {
    yield put(actions.job.noInProgressJobs());

    return true;
  }

  if (inProgressJobIds.flowJobs.length > 0) {
    yield all(
      inProgressJobIds.flowJobs.map(jobId => call(getJobFamily, { jobId }))
    );
  }

  if (inProgressJobIds.bulkRetryJobs.length > 0) {
    yield all(
      inProgressJobIds.bulkRetryJobs.map(jobId =>
        call(getJobFamily, { jobId, type: JOB_TYPES.BULK_RETRY })
      )
    );
  }
}

export function* pollForInProgressJobs() {
  while (true) {
    yield delay(5 * 1000);

    yield call(getInProgressJobsStatus);
  }
}

export function* startPollingForInProgressJobs() {
  const watcher = yield fork(pollForInProgressJobs);

  yield take([
    actionTypes.JOB.CLEAR,
    actionTypes.JOB.NO_IN_PROGRESS_JOBS,
    actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
  ]);
  yield cancel(watcher);
}

export function* requestJobCollection({ integrationId, flowId, filters = {} }) {
  const jobFilters = { ...filters, integrationId };

  if (flowId) {
    jobFilters.flowId = flowId;
  }

  const requestOptions = getRequestOptions(actionTypes.JOB.REQUEST_COLLECTION, {
    filters: jobFilters,
  });
  const { path, opts } = requestOptions;
  let collection;

  try {
    collection = yield call(apiCallWithRetry, {
      path: `${path}`,
      opts,
    });
  } catch (error) {
    return true;
  }

  yield put(actions.job.receivedCollection({ collection }));
  yield put(actions.job.requestInProgressJobStatus());
}

export function* getJobCollection({ integrationId, flowId, filters = {} }) {
  const watcher = yield fork(requestJobCollection, {
    integrationId,
    flowId,
    filters,
  });

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
  } catch (e) {
    return true;
  }

  if (response.signedURL) {
    yield call(openExternalUrl, { url: response.signedURL });
  }
}

export function* downloadFiles({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_DOWNLOAD_FILES_URL,
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
  } catch (e) {
    return true;
  }

  if (response.signedURL) {
    yield call(openExternalUrl, { url: response.signedURL });
  } else if (response.signedURLs) {
    yield all(response.signedURLs.map(url => call(openExternalUrl, { url })));
  }
}

export function* cancelJob({ jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.CANCEL, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;
  let job;

  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  if (job._flowJobId) {
    yield call(getJobFamily, { jobId: job._flowJobId });
  } else {
    yield put(actions.job.receivedFamily({ job }));
  }
}

export function* resolveCommit({ jobs = [] }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.RESOLVE_COMMIT);
  const { path, opts } = requestOptions;

  opts.body = jobs.map(job => job._id);

  try {
    yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  const uniqueParentJobIds = [];

  jobs.forEach(job => {
    const parentJobId = job._flowJobId || job._id;

    if (!uniqueParentJobIds.includes(parentJobId)) {
      uniqueParentJobIds.push(parentJobId);
    }
  });

  yield all(uniqueParentJobIds.map(jobId => call(getJobFamily, { jobId })));
}

export function* resolveAllCommit({ flowId, integrationId }) {
  const { path, opts } = getRequestOptions(
    flowId
      ? actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT
      : actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
    {
      resourceId: flowId || integrationId,
    }
  );

  try {
    yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }
}

export function* resolveSelected({ jobs }) {
  yield put(actions.job.resolveAllPending());

  yield all(
    jobs.map(job =>
      put(
        actions.job.resolveInit({
          parentJobId: job._flowJobId || job._id,
          childJobId: job._flowJobId ? job._id : null,
        })
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
  } catch (error) {
    return true;
  }

  const uniqueParentJobIds = [];

  jobs.forEach(job => {
    const pJobId = job._flowJobId || job._id;

    if (!uniqueParentJobIds.includes(pJobId)) {
      uniqueParentJobIds.push(pJobId);
    }
  });

  yield all(uniqueParentJobIds.map(jobId => call(getJobFamily, { jobId })));
  yield put(actions.job.requestInProgressJobStatus());
}

export function* retrySelected({ jobs }) {
  yield put(actions.job.retryAllPending());

  yield all(
    jobs.map(job =>
      put(
        actions.job.retryInit({
          parentJobId: job._flowJobId || job._id,
          childJobId: job._flowJobId ? job._id : null,
        })
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
    return true;
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
    return true;
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
  let job;

  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  yield put(actions.job.receivedFamily({ job }));
  yield put(actions.job.requestInProgressJobStatus());
}

export function* retryAll({ flowId, integrationId }) {
  yield put(actions.job.retryAllPending());

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
  const { path, opts } = getRequestOptions(
    actionTypes.JOB.REQUEST_RETRY_OBJECT_COLLECTION,
    {
      resourceId: jobId,
    }
  );
  let collection;

  try {
    collection = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  yield put(actions.job.receivedRetryObjects({ collection, jobId }));
}

export function* requestJobErrorCollection({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.ERROR.REQUEST_COLLECTION,
    {
      resourceId: jobId,
    }
  );
  const { path, opts } = requestOptions;
  let collection;

  try {
    collection = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  yield put(actions.job.receivedErrors({ collection, jobId }));
}

export function* requestRetryObjectAndJobErrorCollection({ jobId }) {
  yield call(requestRetryObjectCollection, { jobId });
  yield call(requestJobErrorCollection, { jobId });
}

export function* getJobErrors({ jobId }) {
  const watcher = yield fork(requestRetryObjectAndJobErrorCollection, {
    jobId,
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
  } catch (e) {
    return true;
  }

  if (response && response.signedURL) {
    yield call(openExternalUrl, { url: response.signedURL });
  }
}

export function* resolveSelectedErrors({ jobId, flowJobId, selectedErrorIds }) {
  const { path, opts } = getRequestOptions(
    actionTypes.JOB.ERROR.RESOLVE_SELECTED,
    {
      resourceId: jobId,
    }
  );

  yield put(
    actions.job.resolveSelectedErrorsInit({
      selectedErrorIds,
    })
  );
  const jobErrors = yield select(selectors.jobErrors, jobId);
  const updatedJobErrors = [];

  jobErrors.forEach(je => {
    const { _id, createdAtAsString, retryObject, similarErrors, ...rest } = je;

    updatedJobErrors.push({ ...rest });

    if (similarErrors && similarErrors.length > 0) {
      similarErrors.forEach(sje => {
        const {
          _id,
          createdAtAsString,
          retryObject,
          similarErrors,
          ...rest
        } = sje;

        updatedJobErrors.push({ ...rest });
      });
    }
  });

  opts.body = updatedJobErrors;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }

  yield call(getJobFamily, { jobId: flowJobId });
}

export function* retrySelectedRetries({ jobId, flowJobId, selectedRetryIds }) {
  const { path, opts } = getRequestOptions(
    actionTypes.JOB.ERROR.RETRY_SELECTED,
    {
      resourceId: jobId,
    }
  );

  opts.body = selectedRetryIds;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }

  yield call(getJobFamily, { jobId: flowJobId });
}

export function* requestRetryData({ retryId }) {
  const { path, opts } = getRequestOptions(
    actionTypes.JOB.ERROR.REQUEST_RETRY_DATA,
    {
      resourceId: retryId,
    }
  );
  let retryData;

  try {
    retryData = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }

  yield put(actions.job.receivedRetryData({ retryData, retryId }));
}

export function* updateRetryData({ retryId, retryData }) {
  const { path, opts } = getRequestOptions(
    actionTypes.JOB.ERROR.UPDATE_RETRY_DATA,
    {
      resourceId: retryId,
    }
  );

  opts.body = retryData;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }

  yield put(actions.job.receivedRetryData({ retryData, retryId }));
}

export const jobSagas = [
  takeEvery(actionTypes.JOB.REQUEST_COLLECTION, getJobCollection),
  takeEvery(actionTypes.JOB.REQUEST_FAMILY, getJobFamily),
  takeEvery(
    actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
    startPollingForInProgressJobs
  ),
  takeEvery(actionTypes.JOB.DOWNLOAD_DIAGNOSTICS_FILE, downloadDiagnosticsFile),
  takeEvery(actionTypes.JOB.DOWNLOAD_FILES, downloadFiles),
  takeEvery(actionTypes.JOB.CANCEL, cancelJob),
  takeEvery(actionTypes.JOB.RESOLVE_SELECTED, resolveSelected),
  takeEvery(actionTypes.JOB.RESOLVE_ALL, resolveAll),
  takeEvery(actionTypes.JOB.RETRY_SELECTED, retrySelected),
  takeEvery(actionTypes.JOB.RETRY_FLOW_JOB, retryFlowJob),
  takeEvery(actionTypes.JOB.RETRY_ALL, retryAll),
  takeEvery(actionTypes.JOB.ERROR.REQUEST_COLLECTION, getJobErrors),
  takeEvery(actionTypes.JOB.DOWNLOAD_ERROR_FILE, downloaErrorFile),
  takeEvery(actionTypes.JOB.ERROR.RESOLVE_SELECTED, resolveSelectedErrors),
  takeEvery(actionTypes.JOB.ERROR.RETRY_SELECTED, retrySelectedRetries),
  takeEvery(actionTypes.JOB.ERROR.REQUEST_RETRY_DATA, requestRetryData),
  takeEvery(actionTypes.JOB.ERROR.UPDATE_RETRY_DATA, updateRetryData),
];

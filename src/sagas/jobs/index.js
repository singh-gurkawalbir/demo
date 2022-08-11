import {
  call,
  put,
  cancel,
  take,
  takeLatest,
  takeEvery,
  delay,
  select,
  all,
  fork,
} from 'redux-saga/effects';
import { map } from 'lodash';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import getRequestOptions from '../../utils/requestOptions';
import openExternalUrl from '../../utils/window';
import { JOB_TYPES, STANDALONE_INTEGRATION } from '../../constants';
import {FILTER_KEYS_AD} from '../../utils/accountDashboard';
import { pollApiRequests } from '../app';

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

  // console.log(path, opts);
  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  yield put(actions.job.receivedFamily({ job }));
}
export function* getDashboardJobFamily({ inProgressJobIds }) {
  const requestOptions = {path: '/jobs/family', opts: { method: 'POST' } };

  requestOptions.opts.body = [...inProgressJobIds];

  let jobs;

  try {
    jobs = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(actions.job.dashboard.running.receivedFamily({ collection: jobs }));
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
export function* getDasboardInProgressJobsStatus() {
  const inProgressJobIds = yield select(selectors.dashboardInProgressJobIds);

  if (
    inProgressJobIds.length === 0
  ) {
    return yield put(actions.job.dashboard.running.noInProgressJobs());
  }

  return yield call(getDashboardJobFamily, { inProgressJobIds });
}
export function* pollForInProgressJobs() {
  yield call(pollApiRequests, {pollSaga: getInProgressJobsStatus, pollSagaArgs: {}, duration: 5 * 1000});
}

export function* pollForDashboardInProgressJobs() {
  while (true) {
    yield delay(10 * 1000);

    yield call(getDasboardInProgressJobsStatus);
  }
}

export function* getJobDetails({ jobId }) {
  const path = `/jobs/${jobId}/family`;
  const opts = { method: 'GET' };
  let job;

  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return undefined;
  }

  return job;
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

export function* startPollingForDashboardInProgressJobs() {
  const watcher = yield fork(pollForDashboardInProgressJobs);

  yield take([
    actionTypes.JOB.DASHBOARD.RUNNING.CLEAR,
    actionTypes.JOB.DASHBOARD.RUNNING.NO_IN_PROGRESS_JOBS,
    actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_IN_PROGRESS_JOBS_STATUS,
  ]);
  yield cancel(watcher);
}

export function* requestJobCollection({ integrationId, flowId, filters = {}, options = {} }) {
  const jobFilters = { ...filters, integrationId };
  let requestedJob;

  if (flowId) {
    jobFilters.flowId = flowId;
  }

  if (!jobFilters.flowId) {
    if (jobFilters.childId) {
      const flowIds = yield select(
        selectors.integrationAppFlowIds,
        integrationId,
        jobFilters.childId
      );

      jobFilters.flowIds = flowIds;
    } else if (integrationId === STANDALONE_INTEGRATION.id) {
      /**
       * For Standalone integration, we need to send the list of flow ids filtered by environment.
       * Otherwise, backend returns jobs from both production & sandbox environments.
       */
      const { resources = [] } = yield select(selectors.resourceList, {
        type: 'flows',
        filter: {
          $where() {
            return !this._integrationId;
          },
        },
      });

      if (resources.length > 0) {
        jobFilters.flowIds = map(resources, '_id');
      }
    }
  }

  delete jobFilters.childId;
  delete jobFilters.refreshAt;

  switch (jobFilters.status) {
    case 'all':
      delete jobFilters.status;
      break;
    case 'error':
      jobFilters.numError_gte = 1;
      delete jobFilters.status;
      break;
    case 'resolved':
      jobFilters.numResolved_gte = 1;
      delete jobFilters.status;
      break;
    default:
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

  if (!Array.isArray(collection)) {
    // the jobs collection must be an array
    collection = [];
  }

  // flowJobId is sent in options when user clicks a error notification email and jobId is in url request parameters
  // If user requested job is not in first 1000 results, fetch particular job and merge it in collection.
  if (options.flowJobId && !collection.find(j => j._id === options.flowJobId)) {
    try {
      requestedJob = yield call(getJobDetails, { jobId: options.flowJobId });
    // eslint-disable-next-line no-empty
    } catch (e) {}
    if (requestedJob && requestedJob._id && Array.isArray(collection)) {
      // Push if valid job is returned
      collection.push(requestedJob);
    }
  }

  yield put(actions.job.receivedCollection({ collection }));
  yield put(actions.job.requestInProgressJobStatus());
}

export function* requestCompletedJobCollection({nextPageURL, integrationId}) {
  let collection;

  const reqOptions = yield select(
    selectors.requestOptionsOfDashboardJobs,
    {filterKey: FILTER_KEYS_AD.COMPLETED, nextPageURL, integrationId}
  );
  const {path, opts} = reqOptions || {};

  try {
    collection = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (error) {
    return yield put(actions.job.dashboard.completed.error());
  }

  if (!Array.isArray(collection?.stats)) {
    collection = [];
  }

  yield put(actions.job.dashboard.completed.receivedCollection({ collection: collection?.stats, nextPageURL: collection.nextPageURL, loadMore: !!nextPageURL }));
}

export function* requestRunningJobCollection({nextPageURL, integrationId}) {
  let collection;

  const reqOptions = yield select(
    selectors.requestOptionsOfDashboardJobs,
    {filterKey: FILTER_KEYS_AD.RUNNING, nextPageURL, integrationId}
  );
  const {path, opts} = reqOptions || {};

  try {
    collection = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (error) {
    return yield put(actions.job.dashboard.running.error());
  }
  if (!Array.isArray(collection?.jobs)) {
    collection = [];
  }
  yield put(actions.job.dashboard.running.receivedCollection({ collection: collection.jobs, nextPageURL: collection.nextPageURL, loadMore: !!nextPageURL}));
  yield put(actions.job.dashboard.running.requestInProgressJobStatus());
}
export function* getJobCollection({ integrationId, flowId, filters = {}, options = {} }) {
  const watcher = yield fork(requestJobCollection, {
    integrationId,
    flowId,
    filters,
    options,
  });

  yield take(actionTypes.JOB.CLEAR);
  yield cancel(watcher);
}
export function* getDashboardRunningJobCollection({nextPageURL, integrationId}) {
  const watcher = yield fork(requestRunningJobCollection, {nextPageURL, integrationId});

  yield take(actionTypes.JOB.DASHBOARD.RUNNING.CLEAR);
  yield cancel(watcher);
}
export function* getDashboardCompletedJobCollection({nextPageURL, integrationId}) {
  const watcher = yield fork(requestCompletedJobCollection, {nextPageURL, integrationId});

  yield take(actionTypes.JOB.DASHBOARD.COMPLETED.CLEAR);
  yield cancel(watcher);
}

export function* downloadFiles({ jobId, fileType, fileIds = [] }) {
  let action;

  switch (fileType) {
    case 'diagnostics':
      action = actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL;
      break;
    case 'errors':
      action = actionTypes.JOB.REQUEST_ERROR_FILE_URL;
      break;
    default:
      action = actionTypes.JOB.REQUEST_DOWNLOAD_FILES_URL;
  }

  const requestOptions = getRequestOptions(action, {
    resourceId: jobId,
  });
  const { path } = requestOptions;
  const { opts } = requestOptions;
  let response;

  if (!fileType && fileIds.length > 0) {
    opts.body = {
      fileIds,
    };
  }

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }

  /**
   * Backend is returning 204 some times, one usecase is downloading error file when
   * the parent job is cancelled (by user) and children are yet to cancel (by the backend).
   */
  if (!response) {
    return true;
  }

  let signedURLs = [];

  if (response.signedURL) {
    signedURLs = [response.signedURL];
  } else if (response.signedURLs) {
    ({ signedURLs } = response);
  }

  if (signedURLs.length > 0) {
    yield all(
      signedURLs.map((url, index) => call(openExternalUrl, { url, index }))
    );
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
  if (job._flowJobId || job._parentJobId) {
    yield call(getJobFamily, { jobId: job._parentJobId || job._flowJobId });
  } else {
    yield put(actions.job.receivedFamily({ job }));
  }
}
export function* cancelDashboardJob({ jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.CANCEL, {
    resourceId: jobId,
  });
  const { path, opts } = requestOptions;

  try {
    yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }
  yield put(actions.job.dashboard.running.canceled({ jobId }));
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
    const parentJobId = job._parentJobId || job._flowJobId || job._id;

    if (!uniqueParentJobIds.includes(parentJobId)) {
      uniqueParentJobIds.push(parentJobId);
    }
  });

  yield all(uniqueParentJobIds.map(jobId => call(getJobFamily, { jobId })));
}

export function* resolveAllCommit({ flowId, childId, integrationId, filteredJobsOnly }) {
  let flowIds = [];
  let jobIds = [];

  if (filteredJobsOnly) {
    const filteredJobs = yield select(selectors.allJobs, { type: 'flowJobs' });

    jobIds = filteredJobs.filter(j => j?.__original?.numError > 0).map(j => j._id);
  } else if (flowId) {
    flowIds.push(flowId);
  } else if (childId) {
    flowIds = yield select(
      selectors.integrationAppFlowIds,
      integrationId,
      childId
    );
  }

  let requestOptions;

  if (jobIds.length > 0) {
    requestOptions = getRequestOptions(actionTypes.JOB.RESOLVE_COMMIT);
    requestOptions.opts.body = jobIds;
  } else {
    requestOptions = getRequestOptions(
      flowIds.length > 0
        ? actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT
        : actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
      {
        resourceId: flowIds.length > 0 ? flowIds : integrationId,
      }
    );
  }

  try {
    yield call(apiCallWithRetry, requestOptions);
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
          parentJobId: job._parentJobId || job._flowJobId || job._id,
          childJobId: job._parentJobId || job._flowJobId ? job._id : null,
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

export function* resolveAll({ flowId, childId, integrationId, filteredJobsOnly }) {
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
    yield call(resolveAllCommit, { flowId, childId, integrationId, filteredJobsOnly });
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
    const pJobId = job._parentJobId || job._flowJobId || job._id;

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
          parentJobId: job._parentJobId || job._flowJobId || job._id,
          childJobId: job._parentJobId || job._flowJobId ? job._id : null,
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

    job?.children?.forEach(cJob => {
      if (cJob.retriable) {
        jobsToRetry.push({ _id: cJob._id, _flowJobId: jobId });
      }
    });

    if (jobsToRetry.length === 0) {
      if (!job) {
        yield put(actions.api.failure('JOBS', 'PUT', 'Retry operation failed.', false));
      }

      return true;
    }

    yield call(retrySelected, { jobs: jobsToRetry });
}

export function* retryAllCommit({ flowIds }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
    {
      resourceId: flowIds,
    }
  );
  const { path, opts } = requestOptions;
  let job;

  try {
    const response = yield call(apiCallWithRetry, { path, opts });

    job = response.find(j => j.statusCode === 202);
    job = job?.job;
  } catch (error) {
    return true;
  }

  if (job) {
    yield put(actions.patchFilter('jobs', {refreshAt: job._id}));
  }
}

export function* retryAll({ flowId, childId, integrationId }) {
  yield put(actions.job.retryAllPending());

  let flowIds = [];

  if (flowId) {
    flowIds.push(flowId);
  } else {
    const allFlows = yield select(selectors.resourceList, { type: 'flows' });

    if (allFlows?.resources) {
      if (childId) {
        const childFlowIds = yield select(selectors.integrationAppFlowIds, integrationId, childId);

        flowIds = allFlows.resources.filter(f => childFlowIds.includes(f._id) && !f.disabled).map(f => f._id);
      } else {
        flowIds = allFlows.resources.filter(f => (integrationId === 'none' ? !f._integrationId : (f._integrationId === integrationId)) && !f.disabled).map(f => f._id);
      }
    }
  }

  yield put(actions.job.retryAllInit({ flowIds }));
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
    yield call(retryAllCommit, { flowIds });
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
    const { _id, retryObject, similarErrors, ...rest } = je;

    updatedJobErrors.push({ ...rest });

    if (similarErrors && similarErrors.length > 0) {
      similarErrors.forEach(sje => {
        const { _id, retryObject, similarErrors, ...rest } = sje;

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
  yield put(actions.job.requestInProgressJobStatus());
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

export function* updateRetryData({ retryId, retryData, asyncKey }) {
  if (asyncKey) yield put(actions.asyncTask.start(asyncKey));
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
    if (asyncKey) yield put(actions.asyncTask.failed(asyncKey));

    return true;
  }
  if (asyncKey) yield put(actions.asyncTask.success(asyncKey));

  yield put(actions.job.receivedRetryData({ retryData, retryId }));
}

export function* downloadRetryData({ retryId }) {
  let response;
  const { path, opts } = getRequestOptions(
    actionTypes.JOB.ERROR.DOWNLOAD_RETRY_DATA,
    {
      resourceId: retryId,
    }
  );

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }
  if (response?.signedURL) {
    openExternalUrl({url: response?.signedURL});
  }
}

export function* retryProcessedErrors({ jobId, flowJobId, errorFileId }) {
  try {
    const body = { errorFile: { host: 's3', id: errorFileId } };

    // Retries the job with the error file uploaded at s3 with errorFileId
    yield call(apiCallWithRetry, {
      path: `/jobs/${jobId}/retries/retry`,
      opts: {
        method: 'POST',
        body,
      },
    });
    // Triggers polling to update the jobs list once the job is retried
    yield call(getJobFamily, { jobId: flowJobId });
    yield put(actions.job.requestInProgressJobStatus());
  } catch (e) {
    //  Error handler
  }
}

export const jobSagas = [
  takeEvery(actionTypes.JOB.REQUEST_COLLECTION, getJobCollection),
  takeLatest(actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_COLLECTION, getDashboardRunningJobCollection),
  takeLatest(actionTypes.JOB.DASHBOARD.COMPLETED.REQUEST_COLLECTION, getDashboardCompletedJobCollection),
  takeEvery(actionTypes.JOB.REQUEST_FAMILY, getJobFamily),
  takeEvery(
    actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
    startPollingForInProgressJobs
  ),
  takeLatest(actionTypes.JOB.DASHBOARD.RUNNING.REQUEST_IN_PROGRESS_JOBS_STATUS, startPollingForDashboardInProgressJobs),
  takeEvery(actionTypes.JOB.DOWNLOAD_FILES, downloadFiles),
  takeEvery(actionTypes.JOB.CANCEL, cancelJob),
  takeLatest(actionTypes.JOB.DASHBOARD.RUNNING.CANCEL, cancelDashboardJob),
  takeEvery(actionTypes.JOB.RESOLVE_SELECTED, resolveSelected),
  takeEvery(actionTypes.JOB.RESOLVE_ALL, resolveAll),
  takeEvery(actionTypes.JOB.RETRY_SELECTED, retrySelected),
  takeEvery(actionTypes.JOB.RETRY_FLOW_JOB, retryFlowJob),
  takeEvery(actionTypes.JOB.RETRY_ALL, retryAll),
  takeEvery(actionTypes.JOB.ERROR.REQUEST_COLLECTION, getJobErrors),
  takeEvery(actionTypes.JOB.ERROR.RESOLVE_SELECTED, resolveSelectedErrors),
  takeEvery(actionTypes.JOB.ERROR.RETRY_SELECTED, retrySelectedRetries),
  takeEvery(actionTypes.JOB.ERROR.REQUEST_RETRY_DATA, requestRetryData),
  takeEvery(actionTypes.JOB.ERROR.UPDATE_RETRY_DATA, updateRetryData),
  takeLatest(actionTypes.JOB.ERROR.DOWNLOAD_RETRY_DATA, downloadRetryData),
  takeEvery(actionTypes.JOB.ERROR.RETRY_PROCESSED_ERRORS, retryProcessedErrors),
];

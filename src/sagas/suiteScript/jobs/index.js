import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import moment from 'moment';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import getRequestOptions from '../../../utils/requestOptions';
import { apiCallWithRetry } from '../../index';
import * as selectors from '../../../reducers';

export function* getJob({
  ssLinkedConnectionId,
  integrationId,
  jobId,
  jobType,
}) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${jobId}?type=${jobType}`,
    opts: {
      method: 'GET',
    },
  };
  let job;

  try {
    job = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(actions.suiteScript.job.received({ job }));
}

export function* requestJobCollection({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  filters = {},
}) {
  const jobFilters = { ...filters, ssLinkedConnectionId, integrationId };

  if (flowId) {
    jobFilters.flowId = flowId;
  }

  delete jobFilters.refreshAt;

  switch (jobFilters.status) {
    case 'all':
      delete jobFilters.status;
      break;
    case 'error':
      jobFilters.numError_gte = 1;
      delete jobFilters.status;
      break;
    default:
  }

  const requestOptions = getRequestOptions(
    actionTypes.SUITESCRIPT.JOB.REQUEST_COLLECTION,
    {
      filters: jobFilters,
    }
  );
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

  yield put(actions.suiteScript.job.receivedCollection({ collection }));
  yield put(
    actions.suiteScript.job.requestInProgressJobStatus({
      ssLinkedConnectionId,
      integrationId,
    })
  );
}

export function* getJobCollection({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  filters = {},
}) {
  const watcher = yield fork(requestJobCollection, {
    ssLinkedConnectionId,
    integrationId,
    flowId,
    filters,
  });

  yield take(actionTypes.SUITESCRIPT.JOB.CLEAR);
  yield cancel(watcher);
}

export function* requestJobErrorCollection({
  ssLinkedConnectionId,
  integrationId,
  jobId,
  jobType,
}) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${jobId}/errors?type=${jobType}`,
    opts: { method: 'GET' },
  };
  let collection;

  try {
    collection = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield put(
    actions.suiteScript.job.receivedErrors({
      collection,
      ssLinkedConnectionId,
      integrationId,
      jobId,
      jobType,
    })
  );
}

export function* getJobErrors({
  ssLinkedConnectionId,
  integrationId,
  jobId,
  jobType,
}) {
  const watcher = yield fork(requestJobErrorCollection, {
    ssLinkedConnectionId,
    integrationId,
    jobId,
    jobType,
  });

  yield take(actionTypes.SUITESCRIPT.JOB.ERROR.CLEAR);
  yield cancel(watcher);
}

export function* getInProgressJobsStatus({
  ssLinkedConnectionId,
  integrationId,
}) {
  const jobs = yield select(selectors.suiteScriptResourceList, {
    resourceType: 'jobs',
  });
  const inProgressJobs =
    jobs && jobs.filter(j => ['queued', 'running'].includes(j.status));

  if (!inProgressJobs || inProgressJobs.length === 0) {
    yield put(actions.suiteScript.job.noInProgressJobs());

    return true;
  }

  if (inProgressJobs && inProgressJobs.length > 0) {
    yield all(
      inProgressJobs.map(job =>
        call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: job._id,
          jobType: job.type,
        })
      )
    );
  }
}

export function* pollForInProgressJobs({
  ssLinkedConnectionId,
  integrationId,
}) {
  while (true) {
    yield delay(5 * 1000);

    yield call(getInProgressJobsStatus, {
      ssLinkedConnectionId,
      integrationId,
    });
  }
}

export function* startPollingForInProgressJobs({
  ssLinkedConnectionId,
  integrationId,
}) {
  const watcher = yield fork(pollForInProgressJobs, {
    ssLinkedConnectionId,
    integrationId,
  });

  yield take([
    actionTypes.SUITESCRIPT.JOB.CLEAR,
    actionTypes.SUITESCRIPT.JOB.NO_IN_PROGRESS_JOBS,
    actionTypes.SUITESCRIPT.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
  ]);
  yield cancel(watcher);
}

export function* resolveSelectedErrors({
  ssLinkedConnectionId,
  integrationId,
  jobId,
  jobType,
  selectedErrorIds,
}) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${jobId}/resolve`,
    opts: {
      method: 'PUT',
    },
  };

  yield put(
    actions.suiteScript.job.resolveSelectedErrorsInit({
      selectedErrorIds,
    })
  );

  requestOptions.opts.body = {
    celigo_method: 'resolveJobErrors',
    type: jobType,
    errorIdsToResolve: selectedErrorIds,
  };

  try {
    yield call(apiCallWithRetry, requestOptions);
  } catch (e) {
    return true;
  }

  yield call(getJob, { ssLinkedConnectionId, integrationId, jobId, jobType });
}

export function* resolveJobExports({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  jobIdsToResolve,
}) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/exports/resolve`,
    opts: {
      method: 'PUT',
    },
  };

  requestOptions.opts.body = {
    celigo_method: 'resolveIntegrationJobExports',
    flowId,
    jobIdsToResolve,
    resolveAll: !jobIdsToResolve || jobIdsToResolve.length === 0,
    createdOnOrBefore: moment()
      .toDate()
      .getTime(),
  };

  try {
    yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield all(
    jobIdsToResolve.map(jobId =>
      call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId,
        jobType: 'export',
      })
    )
  );
}

export function* resolveJobImports({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  jobIdsToResolve,
}) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/imports/resolve`,
    opts: {
      method: 'PUT',
    },
  };

  requestOptions.opts.body = {
    celigo_method: 'resolveIntegrationJobImports',
    flowId,
    jobIdsToResolve,
    resolveAll: !jobIdsToResolve || jobIdsToResolve.length === 0,
    createdOnOrBefore: moment()
      .toDate()
      .getTime(),
  };

  try {
    yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  yield all(
    jobIdsToResolve.map(jobId =>
      call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId,
        jobType: 'import',
      })
    )
  );
}

export function* resolveLogs({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  parentLogIds,
}) {
  const requestOptions = {
    path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/logs/resolve`,
    opts: {
      method: 'PUT',
    },
  };

  requestOptions.opts.body = {
    celigo_method: 'resolveIntegrationLogs',
    flowId,
    parentLogIds,
    createdOnOrBefore: moment()
      .toDate()
      .getTime(),
  };

  try {
    yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }
}

export function* resolveCommit({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  jobs = [],
}) {
  const exportJobIds = [];
  const importJobIds = [];
  const parentLogIds = [];

  jobs.forEach(j => {
    if (j.log) {
      parentLogIds.push(j.log);
    }

    if (j.jobType === 'export') {
      exportJobIds.push(j.jobId);
    } else if (j.jobType === 'import') {
      importJobIds.push(j.jobId);
    }
  });

  if (
    jobs.length === 0 ||
    (exportJobIds.length > 0 && importJobIds.length > 0)
  ) {
    yield all([
      call(resolveJobExports, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobIdsToResolve: exportJobIds,
      }),
      call(resolveJobImports, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobIdsToResolve: importJobIds,
      }),
      call(resolveLogs, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        parentLogIds,
      }),
    ]);
  } else {
    yield all([
      call(exportJobIds.length > 0 ? resolveJobExports : resolveJobImports, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobIdsToResolve: exportJobIds.length > 0 ? exportJobIds : importJobIds,
      }),
      call(resolveLogs, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        parentLogIds,
      }),
    ]);
  }
}

export function* resolveSelected({
  ssLinkedConnectionId,
  integrationId,
  flowId,
  jobs,
}) {
  yield put(actions.suiteScript.job.resolveAllPending());

  yield all(jobs.map(job => put(actions.suiteScript.job.resolveInit(job))));
  const undoOrCommitAction = yield take([
    actionTypes.SUITESCRIPT.JOB.RESOLVE_COMMIT,
    actionTypes.SUITESCRIPT.JOB.RESOLVE_UNDO,
    actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
  ]);

  if (
    [
      actionTypes.SUITESCRIPT.JOB.RESOLVE_COMMIT,
      actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
    ].includes(undoOrCommitAction.type)
  ) {
    yield call(resolveCommit, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      jobs,
    });
  }
}

export const jobSagas = [
  takeEvery(actionTypes.SUITESCRIPT.JOB.REQUEST_COLLECTION, getJobCollection),
  takeEvery(actionTypes.SUITESCRIPT.JOB.REQUEST, getJob),
  takeEvery(
    actionTypes.SUITESCRIPT.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
    startPollingForInProgressJobs
  ),
  takeEvery(actionTypes.SUITESCRIPT.JOB.ERROR.REQUEST_COLLECTION, getJobErrors),
  takeEvery(
    actionTypes.SUITESCRIPT.JOB.ERROR.RESOLVE_SELECTED,
    resolveSelectedErrors
  ),
  takeEvery(actionTypes.SUITESCRIPT.JOB.RESOLVE_SELECTED, resolveSelected),
];

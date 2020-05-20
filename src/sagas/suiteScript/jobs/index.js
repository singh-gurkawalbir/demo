import { call, cancel, fork, put, take, takeEvery } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import getRequestOptions from '../../../utils/requestOptions';
import { apiCallWithRetry } from '../../index';

export function getJob() {}

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
  yield put(actions.suiteScript.job.requestInProgressJobStatus());
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

export const jobSagas = [
  takeEvery(actionTypes.SUITESCRIPT.JOB.REQUEST_COLLECTION, getJobCollection),
  takeEvery(actionTypes.SUITESCRIPT.JOB.REQUEST, getJob),
  takeEvery(actionTypes.SUITESCRIPT.JOB.ERROR.REQUEST_COLLECTION, getJobErrors),
];

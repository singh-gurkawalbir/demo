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

export function* getJobFamily({ jobId }) {
  const path = `/jobs/${jobId}/family`;

  try {
    const job = yield call(apiCallWithRetry, { path });

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
  let path = '/jobs';
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

  if (queryString) {
    path = `${path}?${queryString}`;
  }

  try {
    const collection = yield call(apiCallWithRetry, { path });

    yield put(
      actions.job.receivedCollection({ collection, integrationId, flowId })
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

export const jobSagas = [
  takeEvery(actionTypes.JOB.REQUEST_COLLECTION, getJobCollection),
  takeEvery(actionTypes.JOB.REQUEST_FAMILY, getJobFamily),
  takeEvery(actionTypes.JOB.RECEIVED_COLLECTION, startPollingForInProgressJobs),
];

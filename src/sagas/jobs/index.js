import { call, put, takeEvery, delay, select, all } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';

export function* getJobCollection(
  filters = { integrationId: undefined, flowId: undefined }
) {
  let path = '/jobs';
  let queryString = '';

  ['integrationId', 'flowId'].forEach(p => {
    if (filters[p]) {
      if (queryString) {
        queryString += '&';
      }

      queryString += `_${p}=${encodeURIComponent(filters[p])}`;
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
    const { integrationId, flowId } = filters;

    yield put(
      actions.job.receivedCollection(collection, { integrationId, flowId })
    );
    yield delay(10 * 1000);
    yield put(actions.job.getInProgressJobStatus({ integrationId, flowId }));
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it
    return undefined;
  }
}

export function* getJobFamily({ jobId }) {
  const path = `/jobs/${jobId}/family`;

  try {
    const job = yield call(apiCallWithRetry, { path });

    yield put(actions.job.receivedFamily({ job }));

    return job;
  } catch (error) {
    // generic message to the user that the
    // saga failed and services team working on it
    return undefined;
  }
}

export function* getInProgressJobsStatus({ integrationId, flowId }) {
  /** TODO
   *  Need to stop this when user navigates away from jobs dashbaord.
   */
  const inProgressJobIds = yield select(
    selectors.inProgressJobIds,
    integrationId,
    flowId
  );

  yield all(inProgressJobIds.map(jobId => call(getJobFamily, { jobId })));
  yield delay(10 * 1000);
  yield put(actions.job.getInProgressJobStatus({ integrationId, flowId }));
}

export const jobSagas = [
  takeEvery(actionTypes.JOB.REQUEST_COLLECTION, getJobCollection),
  takeEvery(actionTypes.JOB.REQUEST_FAMILY, getJobFamily),
  takeEvery(
    actionTypes.JOB.GET_IN_PROGRESS_JOBS_STATUS,
    getInProgressJobsStatus
  ),
];

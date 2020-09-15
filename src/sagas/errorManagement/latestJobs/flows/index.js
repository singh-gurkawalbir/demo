import { put, takeLatest, all, call } from 'redux-saga/effects';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import { apiCallWithRetry } from '../../../index';
import getRequestOptions from '../../../../utils/requestOptions';

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
          put(actions.errorManager.latestFlowJobs.requestJobFamily({flowId, jobId: latestJob._id}))
      )
    );
  } catch (error) {
    // handle errors
  }
}

export function* getJobFamily({ flowId, jobId }) {
  const requestOptions = getRequestOptions(actionTypes.JOB.REQUEST_FAMILY, { resourceId: jobId });
  const { path, opts } = requestOptions;

  try {
    const job = yield call(apiCallWithRetry, { path, opts });

    yield put(actions.errorManager.latestFlowJobs.receivedJobFamily({flowId, job }));
  } catch (error) {
    //  handle errors
  }
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST,
    requestLatestJobs
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST_JOB_FAMILY,
    getJobFamily
  ),
];

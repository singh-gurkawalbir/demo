import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import * as selectors from '../../reducers';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';

export function* run({ flowId }) {
  const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
    resourceId: flowId,
  });
  let job;

  try {
    job = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return true;
  }

  const additionalProps = {
    _id: job._jobId,
    _flowId: flowId,
    type: JOB_TYPES.FLOW,
    status: JOB_STATUS.QUEUED,
  };
  const flow = yield select(selectors.resource, 'flows', flowId);

  if (flow) {
    additionalProps._integrationId = flow._integrationId;
  }

  yield put(
    actions.job.receivedFamily({ job: { ...job, ...additionalProps } })
  );
  yield put(actions.job.requestInProgressJobStatus());
}

export function* downloadZipFile({ flowId }) {
  const { path, opts } = getRequestOptions(actionTypes.FLOW.DOWNLOAD_ZIP_FILE, {
    resourceId: flowId,
  });
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Download Zip File',
    });
    window.open(response.signedURL, 'target=_blank', response.options, false);
  } catch (e) {
    return true;
  }
}

export const flowSagas = [
  takeEvery(actionTypes.FLOW.RUN, run),
  takeEvery(actionTypes.FLOW.DOWNLOAD_ZIP_FILE, downloadZipFile),
];

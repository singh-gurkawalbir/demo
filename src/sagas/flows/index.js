import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import * as selectors from '../../reducers';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';

export function* run({ flowId, customStartDate }) {
  const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
    resourceId: flowId,
    customStartDate,
  });
  let job;

  if (customStartDate) {
    opts.body = {
      export: { startDate: customStartDate },
    };
  }

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

export function* getLastExportDateTime({ flowId }) {
  const path = `/flows/${flowId}/lastExportDateTime`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    });
  } catch (error) {
    return undefined;
  }

  if (response) {
    yield put(actions.flow.lastExportDateTimeUpdate(flowId, response));
  }
}

export const flowSagas = [
  takeEvery(actionTypes.FLOW.RUN, run),
  takeEvery(
    actionTypes.FLOW.REQUEST_LAST_EXPORT_DATE_TIME,
    getLastExportDateTime
  ),
];

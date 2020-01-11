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
  });

  if (customStartDate) {
    opts.body = {
      export: { startDate: customStartDate },
    };
  }

  const flow = yield select(selectors.resource, 'flows', flowId);

  if (!flow) return true;

  // Handle Data loader flows...
  if (flow && flow.pageGenerators && flow.pageGenerators.length) {
    const exportId = flow.pageGenerators[0]._exportId;
    const exp = yield select(selectors.resource, 'exports', exportId);

    if (exp && exp.type === 'simple') {
      if (!exp.rawData) {
        console.log(
          'We have a data loader flow, but no runKey. Prompt user to upload a file.'
        );

        return true;
      }

      opts.body = {
        // for now we store the runKey associated with the initial uploaded file
        // in the rawData field of DL (simple) exports.
        runKey: exp.rawData,
      };
    }
  }

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

  additionalProps._integrationId = flow._integrationId;

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
    yield put(actions.api.failure(path, 'GET', error && error.message, false));
    yield put(actions.flow.receivedLastExportDateTime(flowId));

    return undefined;
  }

  if (response) {
    yield put(actions.flow.receivedLastExportDateTime(flowId, response));
  }
}

export const flowSagas = [
  takeEvery(actionTypes.FLOW.RUN, run),
  takeEvery(
    actionTypes.FLOW.REQUEST_LAST_EXPORT_DATE_TIME,
    getLastExportDateTime
  ),
];

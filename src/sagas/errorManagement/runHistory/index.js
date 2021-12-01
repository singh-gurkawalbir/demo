import { put, takeLatest, select, call } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import getRequestOptions from '../../../utils/requestOptions';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import { selectors } from '../../../reducers';

export function* getJobFamily({ jobId }) {
  const requestOptions = getRequestOptions(
    actionTypes.JOB.REQUEST_FAMILY,
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

  yield put(actions.errorManager.runHistory.receivedFamily({ job }));
}
export function* requestRunHistory({ flowId }) {
  const filters = yield select(selectors.filter, FILTER_KEYS.RUN_HISTORY);
  const flow = yield select(selectors.resource, 'flows', flowId);
  const integrationId = flow?._integrationId || 'none';
  const requestOptions = getRequestOptions(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, {
    flowId,
    integrationId,
    filters,
  });
  const { path, opts } = requestOptions;

  try {
    const runHistory = yield call(apiCallWithRetry, {
      path,
      opts,
      hidden: true,
    });

    yield put(
      actions.errorManager.runHistory.received({ flowId, runHistory })
    );
  } catch (error) {
    // handle errors
    // TODO @Raghu: Check how to handle errors if exist
  }
}
export default [
  takeLatest(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, requestRunHistory),
  takeLatest(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST_FAMILY, getJobFamily),

];

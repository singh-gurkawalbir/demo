import { put, takeLatest, call, select, takeEvery } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';

export function* getRetryJobCollection({flowId, resourceId}) {
  let resourceType = 'exports';
  const importResource = yield select(selectors.resource, 'imports', resourceId);
  const flow = yield select(selectors.resource, 'flows', flowId);
  const integrationId = flow?._integrationId || 'none';

  if (importResource) {
    resourceType = 'imports';
  }
  const path = `/jobs?_integrationId=${integrationId}&_flowId=${flowId}&type=retry&${resourceType === 'exports' ? '_exportId' : '_importId'}=${resourceId}`;

  try {
    const retryList = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(
      actions.errorManager.retries.received({
        flowId,
        resourceId,
        retries: retryList,
      })
    );
  } catch (e) {
    // errors
  }
}
export function* cancelRetry({flowId, resourceId, jobId}) {
  const path = `/jobs/${jobId}/cancel`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
      },
    });

    yield call(getRetryJobCollection, {flowId, resourceId});
  } catch (error) {
    // errors
  }
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRIES.REQUEST,
    getRetryJobCollection
  ),
  takeEvery(
    actionTypes.ERROR_MANAGER.RETRIES.CANCEL.REQUEST,
    cancelRetry
  ),
];

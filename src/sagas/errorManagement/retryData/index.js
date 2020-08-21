import { put, takeLatest, take, call, delay, fork, cancel, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';

function* requestRetryData({ flowId, resourceId, retryId }) {
  try {
    const retryDataResponse = yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/${retryId}/data`,
      opts: {
        method: 'GET',
      },
    });

    yield put(
      actions.errorManager.retryData.received({
        flowId,
        resourceId,
        retryId,
        retryData: retryDataResponse && retryDataResponse.data,
      })
    );
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const error = JSON.parse(e.message);

      yield put(
        actions.errorManager.retryData.receivedError({
          flowId,
          resourceId,
          retryId,
          error,
        })
      );
    }
  }
}

export function* updateRetryData({ flowId, resourceId, retryId, retryData }) {
  try {
    yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/${retryId}/data`,
      opts: {
        method: 'PUT',
        body: retryData,
      },
    });

    yield put(
      actions.errorManager.retryData.received({
        flowId,
        resourceId,
        retryId,
        retryData,
      })
    );
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const error = JSON.parse(e.message);

      yield put(
        actions.errorManager.retryData.receivedError({
          flowId,
          resourceId,
          retryId,
          error,
        })
      );
    }
  }
}

function* requestRetryStatus({ flowId, resourceId }) {
  let resourceType = 'exports';
  const importResource = yield select(selectors.resource, 'imports', resourceId);

  if (importResource) {
    resourceType = 'imports';
  }

  const path = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&${resourceType === 'exports' ? '_exportId' : '_importId'}=${resourceId}`;

  try {
    const pendingRetryList = yield apiCallWithRetry({
      path,
      opts: {
        method: 'GET',
      },
    });
    // TODO @Raghu: Revisit this status update based on the requirement
    const status = pendingRetryList?.length ? 'retrying' : 'completed';

    yield put(actions.errorManager.retryStatus.received({ flowId, resourceId, status}));
  } catch (e) {
    // errors
  }
}

function* pollForRetryStatus({ flowId, resourceId }) {
  yield put(actions.errorManager.retryStatus.request({ flowId, resourceId }));
  while (true) {
    yield call(requestRetryStatus, { flowId, resourceId });
    yield delay(5 * 1000);
  }
}

function* startPollingForRetryStatus({ flowId, resourceId }) {
  const watcher = yield fork(pollForRetryStatus, { flowId, resourceId });

  yield take(actionTypes.ERROR_MANAGER.RETRY_STATUS.CANCEL_POLL);
  yield cancel(watcher);
}

export default [
  takeLatest(actionTypes.ERROR_MANAGER.RETRY_DATA.REQUEST, requestRetryData),
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST_FOR_POLL,
    startPollingForRetryStatus
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRY_DATA.UPDATE_REQUEST,
    updateRetryData
  ),
];

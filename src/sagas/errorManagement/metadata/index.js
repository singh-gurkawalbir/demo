import { deepClone } from 'fast-json-patch';
import { put, takeLatest, take, call, delay, fork, cancel, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import { getMockHttpErrorDoc } from '../../../utils/errorManagement';
import { safeParse } from '../../../utils/string';

export function* downloadRetryData({flowId, resourceId, retryDataKey}) {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: `/flows/${flowId}/${resourceId}/${retryDataKey}/signedURL`,
      opts: {
        method: 'GET',
      },
    });
  } catch (e) {
    return undefined;
  }
  if (response?.signedURL) {
    openExternalUrl({url: response?.signedURL});
  }
}

export function* requestRetryData({ flowId, resourceId, retryId }) {
  try {
    const retryDataResponse = yield call(apiCallWithRetry, {
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
        retryData: retryDataResponse,
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
  const { data: retryDataInfo } = yield select(selectors.retryDataContext, retryId);
  const updatedRetryDataInfo = deepClone(retryDataInfo);

  updatedRetryDataInfo.data = retryData;
  try {
    yield call(apiCallWithRetry, {
      path: `/flows/${flowId}/${resourceId}/${retryId}/data`,
      opts: {
        method: 'PUT',
        body: updatedRetryDataInfo,
      },
    });
    yield put(
      actions.errorManager.retryData.received({
        flowId,
        resourceId,
        retryId,
        retryData: updatedRetryDataInfo,
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

export function* _requestRetryStatus({ flowId, resourceId }) {
  let resourceType = 'exports';
  const importResource = yield select(selectors.resource, 'imports', resourceId);

  if (importResource) {
    resourceType = 'imports';
  }

  const path = `/jobs?_flowId=${flowId}&type=retry&status=queued&status=running&${resourceType === 'exports' ? '_exportId' : '_importId'}=${resourceId}`;

  try {
    const pendingRetryList = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });
    const prevStatus = yield select(selectors.retryStatus, flowId, resourceId);
    let status;

    if (pendingRetryList?.length) {
      status = 'inProgress';
    } else if (prevStatus) {
      status = 'completed';
    }

    yield put(actions.errorManager.retryStatus.received({ flowId, resourceId, status}));
  } catch (e) {
    // errors
  }
}

function* pollForRetryStatus({ flowId, resourceId }) {
  yield put(actions.errorManager.retryStatus.request({ flowId, resourceId }));
  while (true) {
    yield call(_requestRetryStatus, { flowId, resourceId });
    yield delay(5 * 1000);
  }
}

function* startPollingForRetryStatus({ flowId, resourceId }) {
  const watcher = yield fork(pollForRetryStatus, { flowId, resourceId });

  yield take(actionTypes.ERROR_MANAGER.RETRY_STATUS.STOP_POLL);
  yield cancel(watcher);
}

export function* requestFilterMetadata() {
  try {
    const metadata = yield call(apiCallWithRetry, {
      path: '/errors/filterMetadata',
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.errorManager.filterMetadata.received(metadata?.filters));
  } catch (e) {
    // handle errors
  }
}

export function* requestErrorHttpDocument({ flowId, resourceId, reqAndResKey }) {
  try {
    const errorHttpDoc = yield call(apiCallWithRetry, {
      path: `/flows/${flowId}/${resourceId}/requests/${reqAndResKey}`,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(actions.errorManager.errorHttpDoc.received(reqAndResKey, getMockHttpErrorDoc() || errorHttpDoc));
  } catch (e) {
    if (e.status >= 400 && e.status < 500) {
      const errJSON = safeParse(e.message);
      const errorMsg = errJSON?.errors?.[0]?.message;

      if (errorMsg) {
        yield put(actions.errorManager.errorHttpDoc.error(reqAndResKey, errorMsg));
      }
    }
  }
}

export function* downloadBlobDocument({ flowId, resourceId, s3BlobKey }) {
  try {
    const response = yield call(apiCallWithRetry, {
      path: `/flows/${flowId}/${resourceId}/${s3BlobKey}/signedURL`,
      opts: {
        method: 'GET',
      },
    });

    if (response?.signedURL) {
      yield call(openExternalUrl, { url: response.signedURL });
    }
  // eslint-disable-next-line no-empty
  } catch (e) {}
}

export default [
  takeLatest(actionTypes.ERROR_MANAGER.RETRY_DATA.REQUEST, requestRetryData),
  takeLatest(actionTypes.ERROR_MANAGER.RETRY_DATA.DOWNLOAD, downloadRetryData),
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRY_STATUS.REQUEST_FOR_POLL,
    startPollingForRetryStatus
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRY_DATA.UPDATE_REQUEST,
    updateRetryData
  ),
  takeLatest(actionTypes.ERROR_MANAGER.FILTER_METADATA.REQUEST, requestFilterMetadata),
  takeLatest(actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, requestErrorHttpDocument),
  takeLatest(actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.DOWNLOAD_BLOB_DOC, downloadBlobDocument),
];

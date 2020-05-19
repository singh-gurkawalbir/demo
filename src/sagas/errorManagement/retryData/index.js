import { put, takeLatest } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

function* requestRetryData({ flowId, resourceId, retryId }) {
  try {
    const retryData = yield apiCallWithRetry({
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

function* updateRetryData({ flowId, resourceId, retryId, retryData }) {
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

export default [
  takeLatest(actionTypes.ERROR_MANAGER.RETRY_DATA.REQUEST, requestRetryData),
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRY_DATA.UPDATE_REQUEST,
    updateRetryData
  ),
];

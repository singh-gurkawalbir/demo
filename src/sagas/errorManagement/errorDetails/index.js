import { put, takeLatest, select, takeEvery, call } from 'redux-saga/effects';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { updateRetryData } from '../metadata';
import getRequestOptions from '../../../utils/requestOptions';
import openExternalUrl from '../../../utils/window';
import { FILTER_KEYS } from '../../../utils/errorManagement';

function* requestErrorDetails({
  flowId,
  resourceId,
  loadMore = false,
  isResolved = false,
}) {
  try {
    const errorType = isResolved ? 'resolvedErrors' : 'openErrors';
    const filters = yield select(selectors.filter, errorType);

    let nextPageURL;

    if (loadMore) {
      const errors = yield select(selectors.resourceErrors, {
        flowId,
        resourceId,
        options: { isResolved },
      });

      nextPageURL = errors?.nextPageURL;

      if (!nextPageURL) return;
    }

    const requestOptions = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
      { flowId, resourceId, isResolved, filters, nextPageURL }
    );
    const { path, opts } = requestOptions;

    const errorDetails = yield apiCallWithRetry({
      path,
      opts,
    });

    yield put(
      actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails,
        loadMore,
        isResolved,
      })
    );
  } catch (error) {
    actions.errorManager.flowErrorDetails.error({
      flowId,
      error,
      isResolved,
    });
  }
}

function* selectAllErrorDetails({ flowId, resourceId, checked, isResolved }) {
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;
  const errorFilter = yield select(selectors.filter, filterKey);

  const { errors = [] } = yield select(selectors.resourceErrors, {
    flowId,
    resourceId,
    options: { ...errorFilter, isResolved },
  });
  const errorIds = errors.map(error => error.errorId);

  yield put(
    actions.errorManager.flowErrorDetails.selectErrors({
      flowId,
      resourceId,
      errorIds,
      checked,
      isResolved,
    })
  );
}

function* retryErrors({ flowId, resourceId, retryIds = [], isResolved }) {
  let retryDataKeys = retryIds;

  if (!retryIds.length) {
    const retryIdList = yield select(selectors.selectedRetryIds, {
      flowId,
      resourceId,
      options: { isResolved },
    });

    retryDataKeys = retryIdList;
  }

  const { errors } = yield select(selectors.resourceErrors, {
    flowId,
    resourceId,
    options: { isResolved },
  });
  const errorIds = errors
    .filter(error => retryDataKeys.includes(error.retryDataKey))
    .map(error => error.errorId);

  try {
    const response = yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/retry`,
      opts: {
        method: 'POST',
        body: {
          retryDataKeys,
        },
      },
      hidden: true,
    });

    yield put(
      actions.errorManager.flowErrorDetails.retryReceived({
        flowId,
        resourceId,
        response,
        retryCount: retryDataKeys.length,
      })
    );

    if (isResolved) {
      return yield put(
        actions.errorManager.flowErrorDetails.selectErrors({
          flowId,
          resourceId,
          errorIds,
          checked: false,
          isResolved,
        })
      );
    }
    yield put(
      actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
        isResolved,
        errorIds,
      })
    );
    const traceKeyList = errors
      .filter(({errorId, traceKey }) => !!(errorIds.includes(errorId) && traceKey))
      .map(error => error.traceKey);

    if (traceKeyList.length) {
      yield put(actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId,
        resourceId,
        traceKeys: traceKeyList,
      }));
    }
  } catch (e) {
    // console.log('error');
  }
}

function* resolveErrors({ flowId, resourceId, errorIds = [] }) {
  let errors = errorIds;

  if (!errorIds.length) {
    const errorIdList = yield select(selectors.selectedErrorIds, {
      flowId,
      resourceId,
    });

    errors = errorIdList;
  }

  try {
    yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/resolved`,
      opts: {
        method: 'PUT',
        body: {
          errors,
        },
      },
      hidden: true,
    });
    yield put(
      actions.errorManager.flowErrorDetails.resolveReceived({
        flowId,
        resourceId,
        resolveCount: errors.length,
      })
    );
    yield put(
      actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
        errorIds: errors,
      })
    );
  } catch (e) {
    // console.log(e)
  }
}

function* saveAndRetryError({ flowId, resourceId, retryId, retryData }) {
  try {
    yield call(updateRetryData, { flowId, resourceId, retryId, retryData });
    yield put(actions.errorManager.flowErrorDetails.retry({ flowId, resourceId, retryIds: [retryId]}));
  } catch (e) {
    //  error
  }
}

function* downloadErrors({ flowId, resourceId, isResolved, filters }) {
  const requestOptions = getRequestOptions(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
    { flowId, resourceId, isResolved, filters }
  );
  const { path, opts } = requestOptions;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts,
    });

    if (response.signedURL) {
      yield call(openExternalUrl, { url: response.signedURL });
    }
  } catch (e) {
  //  Handle errors
  }
}

export default [
  takeEvery(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.SAVE_AND_RETRY,
    saveAndRetryError),
  takeEvery(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
    requestErrorDetails
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ALL_ERRORS,
    selectAllErrorDetails
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.REQUEST,
    retryErrors
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST,
    resolveErrors
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
    downloadErrors
  ),
];

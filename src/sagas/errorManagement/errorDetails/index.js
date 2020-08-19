import { put, takeLatest, select, takeEvery, call } from 'redux-saga/effects';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { updateRetryData } from '../retryData';

function* requestErrorDetails({
  flowId,
  resourceId,
  loadMore = false,
  isResolved = false,
}) {
  try {
    let path = `/flows/${flowId}/${resourceId}/${
      isResolved ? 'resolved' : 'errors'
    }`;

    if (loadMore) {
      const { nextPageURL } = yield select(selectors.resourceErrors, {
        flowId,
        resourceId,
        options: { isResolved },
      });

      if (!nextPageURL) return;
      path = nextPageURL.replace('/api', '');
    }

    const errorDetails = yield apiCallWithRetry({
      path,
      opts: {
        method: 'GET',
      },
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

function* selectAllErrorDetails({ flowId, resourceId, checked, options }) {
  const { filterKey, defaultFilter, isResolved } = options || {};
  const errorFilter = yield select(selectors.filter, filterKey) || defaultFilter;
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
    });

    yield put(
      actions.errorManager.flowErrorDetails.retryReceived({
        flowId,
        resourceId,
        response,
        retryCount: retryDataKeys.length,
      })
    );

    yield put(
      actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
        isResolved,
        errorIds,
      })
    );
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
];

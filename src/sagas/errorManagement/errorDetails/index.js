import { put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import {
  resourceErrors,
  filter,
  selectedRetryIds,
  selectedErrorIds,
} from '../../../reducers';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

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
      const { nextPageURL } = yield select(resourceErrors, {
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
  const errorFilter = yield select(filter, filterKey) || defaultFilter;
  const { errors = [] } = yield select(resourceErrors, {
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

function* retryErrors({ flowId, resourceId, retryIds = [] }) {
  let retryIdList;

  if (!retryIds.length) {
    retryIdList = yield select(selectedRetryIds, {
      flowId,
      resourceId,
    });
  }

  try {
    yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/retry`,
      opts: {
        method: 'POST',
        body: {
          retryDataKeys: retryIdList || retryIds,
        },
      },
    });

    // console.log(retryResponse);
  } catch (e) {
    // console.log('error');
  }
}

function* resolveErrors({ flowId, resourceId, errorIds = [] }) {
  let errorIdList;

  if (!errorIds.length) {
    errorIdList = yield select(selectedErrorIds, {
      flowId,
      resourceId,
    });
  }

  try {
    yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/resolved`,
      opts: {
        method: 'PUT',
        body: {
          errors: errorIdList || errorIds,
        },
      },
    });

    // console.log(resolveResponse);
  } catch (e) {
    // console.log('error');
  }
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
    requestErrorDetails
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ALL_ERRORS,
    selectAllErrorDetails
  ),
  takeLatest(actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RETRY, retryErrors),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RESOLVE,
    resolveErrors
  ),
];

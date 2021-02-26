import { put, takeLatest, select, takeEvery, call } from 'redux-saga/effects';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { updateRetryData } from '../metadata';
import getRequestOptions from '../../../utils/requestOptions';
import openExternalUrl from '../../../utils/window';
import { FILTER_KEYS, MAX_ERRORS_TO_RETRY_OR_RESOLVE } from '../../../utils/errorManagement';

export function* _formatErrors({ errors = [], resourceId }) {
  const application = yield select(selectors.applicationName, resourceId);

  const formattedErrors = errors.map(e => ({
    ...e,
    source: (e.source === 'application' && application) ? application : e.source,
  }));

  return formattedErrors;
}
export function* requestErrorDetails({
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

    const errorDetails = yield call(apiCallWithRetry, {
      path,
      opts,
    });

    const errorKey = isResolved ? 'resolved' : 'errors';

    errorDetails[errorKey] = yield call(_formatErrors, { resourceId, errors: errorDetails[errorKey] });

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
    // handle errors
  }
}

export function* selectAllErrorDetailsInCurrPage({ flowId, resourceId, checked, isResolved }) {
  const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

  const errors = yield select(selectors.resourceErrorsInCurrPage, {
    flowId,
    resourceId,
    options: { filterKey, isResolved },
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

export function* deselectAllErrors({ flowId, resourceId, isResolved }) {
  const errorIds = yield select(selectors.selectedErrorIds, {
    flowId,
    resourceId,
    options: { isResolved },
  });

  if (errorIds.length) {
    yield put(
      actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        errorIds,
        checked: false,
        isResolved,
      })
    );
  }
}

export function* retryErrors({ flowId, resourceId, retryIds = [], isResolved, retryAll = false }) {
  let retryDataKeys = retryIds;

  const { errors: allErrors } = yield select(selectors.resourceErrors, {
    flowId,
    resourceId,
    options: { isResolved },
  });

  if (!retryIds.length) {
    if (retryAll) {
      retryDataKeys = allErrors
        .filter(error => !!error.retryDataKey)
        .map(error => error.retryDataKey)
        .slice(0, MAX_ERRORS_TO_RETRY_OR_RESOLVE);
    } else {
      const retryIdList = yield select(selectors.selectedRetryIds, {
        flowId,
        resourceId,
        options: { isResolved },
      });

      retryDataKeys = retryIdList;
    }
  }

  const errorIds = allErrors
    .filter(error => retryDataKeys.includes(error.retryDataKey))
    .map(error => error.errorId);

  try {
    yield call(apiCallWithRetry, {
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
    const traceKeyList = allErrors
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

export function* resolveErrors({ flowId, resourceId, errorIds = [], resolveAll = false }) {
  let errors = errorIds;

  if (!errorIds.length) {
    if (resolveAll) {
      const { errors: allErrors = [] } = yield select(selectors.resourceErrors, { flowId, resourceId });

      errors = allErrors.map(error => error.errorId).slice(0, MAX_ERRORS_TO_RETRY_OR_RESOLVE);
    } else {
      const errorIdList = yield select(selectors.selectedErrorIds, {
        flowId,
        resourceId,
      });

      errors = errorIdList;
    }
  }

  try {
    yield call(apiCallWithRetry, {
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

export function* saveAndRetryError({ flowId, resourceId, retryId, retryData }) {
  try {
    yield call(updateRetryData, { flowId, resourceId, retryId, retryData });
    yield put(actions.errorManager.flowErrorDetails.retry({ flowId, resourceId, retryIds: [retryId]}));
  } catch (e) {
    //  error
  }
}

export function* downloadErrors({ flowId, resourceId, isResolved, filters }) {
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
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DESELECT_ALL_ERRORS,
    deselectAllErrors
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ALL_ERRORS_IN_CURR_PAGE,
    selectAllErrorDetailsInCurrPage
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

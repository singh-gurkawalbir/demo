import { put, takeLatest, select, fork, take, call, cancel, all } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';
import {getErrorMapWithTotal, getErrorCountDiffMap} from '../../../utils/errorManagement';

import {pollApiRequests} from '../../app';

export function* _notifyErrorListOnUpdate({ flowId, newFlowErrors }) {
  const prevOpenErrorsDetails = yield select(selectors.openErrorsDetails, flowId);

  if (!prevOpenErrorsDetails) return;

  const prevFlowOpenErrorsMap = yield select(selectors.openErrorsMap, flowId);
  const currFlowOpenErrorsMap = getErrorMapWithTotal(newFlowErrors?.flowErrors, '_expOrImpId').data;
  const resourceIdsErrorCountMap = getErrorCountDiffMap(prevFlowOpenErrorsMap, currFlowOpenErrorsMap);
  const resourceIds = Object.keys(resourceIdsErrorCountMap);

  // notifies all the resources whose error details are to be updated
  yield all(
    resourceIds.map(
      resourceId =>
        put(actions.errorManager.flowErrorDetails.notifyUpdate(
          {
            flowId,
            resourceId,
            diff: resourceIdsErrorCountMap[resourceId],
          }
        ))
    )
  );
}

export function* _requestFlowOpenErrors({ flowId }) {
  try {
    const flowOpenErrors = yield call(apiCallWithRetry, {
      path: `/flows/${flowId}/errors`,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield call(_notifyErrorListOnUpdate, { flowId, newFlowErrors: flowOpenErrors});
    yield put(
      actions.errorManager.openFlowErrors.received({
        flowId,
        openErrors: flowOpenErrors,
      })
    );
  } catch (error) {
    // console.log(1, error);
  }
}

export function* _requestIntegrationErrors({ integrationId }) {
  const userPreferences = yield select(selectors.userPreferences);

  const isSandbox = userPreferences?.environment === 'sandbox';
  const path = `/integrations/${integrationId}/errors${
    isSandbox ? '?sandbox=true' : ''
  }`;

  try {
    const integrationErrors = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(
      actions.errorManager.integrationErrors.received({
        integrationId,
        integrationErrors,
      })
    );
  } catch (error) {
    // console.log(1, error);
  }
}

export function* _pollForIntegrationErrors({ integrationId }) {
  yield put(actions.errorManager.integrationErrors.request({ integrationId }));
  yield call(pollApiRequests, {pollSaga: _requestIntegrationErrors, pollSagaArgs: {integrationId}, duration: 5 * 1000});
}
export function* _pollForOpenErrors({ flowId }) {
  yield put(actions.errorManager.openFlowErrors.request({ flowId }));

  yield call(pollApiRequests, {pollSaga: _requestFlowOpenErrors, pollSagaArgs: { flowId }, duration: 5 * 1000});
}

export function* startPollingForOpenErrors({ flowId }) {
  const watcher = yield fork(_pollForOpenErrors, { flowId });

  yield take(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL);
  yield cancel(watcher);
}
export function* startPollingForIntegrationErrors({ integrationId }) {
  const watcher = yield fork(_pollForIntegrationErrors, { integrationId });

  yield take(actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.CANCEL_POLL);
  yield cancel(watcher);
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST_FOR_POLL,
    startPollingForOpenErrors
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST_FOR_POLL,
    startPollingForIntegrationErrors
  ),
];

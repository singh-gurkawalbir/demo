import { put, takeLatest, select, fork, take, call, delay, cancel, all } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';
import {getErrorMapWithTotal, getErrorCountDiffMap} from '../../../utils/errorManagement';

function* notifyErrorListOnUpdate({ flowId, newFlowErrors }) {
  const {data: prevFlowOpenErrorsMap} = yield select(selectors.errorMap, flowId);
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

function* requestFlowOpenErrors({ flowId }) {
  try {
    const flowOpenErrors = yield apiCallWithRetry({
      path: `/flows/${flowId}/errors`,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield call(notifyErrorListOnUpdate, { flowId, newFlowErrors: flowOpenErrors});
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

function* requestIntegrationErrors({ integrationId }) {
  const { environment } = yield select(selectors.userPreferences) || {};
  const isSandbox = environment === 'sandbox';
  const path = `/integrations/${integrationId}/errors${
    isSandbox ? '?sandbox=true' : ''
  }`;

  try {
    const integrationErrors = yield apiCallWithRetry({
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

function* pollForIntegrationErrors({ integrationId }) {
  yield put(actions.errorManager.integrationErrors.request({ integrationId }));
  while (true) {
    yield call(requestIntegrationErrors, { integrationId });
    yield delay(5 * 1000);
  }
}
function* pollForOpenErrors({ flowId }) {
  yield put(actions.errorManager.openFlowErrors.request({ flowId }));
  while (true) {
    yield call(requestFlowOpenErrors, { flowId });
    // Reduced delay from 5 sec to 2 sec to make it more responsive to user
    // TODO @Raghu: Check if this impacts performance... this call happens when user is inside drawer
    yield delay(2 * 1000);
  }
}

function* startPollingForOpenErrors({ flowId }) {
  const watcher = yield fork(pollForOpenErrors, { flowId });

  yield take(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL);
  yield cancel(watcher);
}
function* startPollingForIntegrationErrors({ integrationId }) {
  const watcher = yield fork(pollForIntegrationErrors, { integrationId });

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

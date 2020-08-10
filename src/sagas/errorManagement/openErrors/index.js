import { put, takeLatest, select, fork, take, call, delay, cancel } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';

function* requestFlowOpenErrors({ flowId }) {
  try {
    const flowOpenErrors = yield apiCallWithRetry({
      path: `/flows/${flowId}/errors`,
      opts: {
        method: 'GET',
      },
    });

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

function* pollForOpenErrors({ flowId }) {
  yield put(actions.errorManager.openFlowErrors.request({ flowId }));
  while (true) {
    yield call(requestFlowOpenErrors, { flowId });
    yield delay(2000);
  }
}

function* startPollingForOpenErrors({ flowId }) {
  const watcher = yield fork(pollForOpenErrors, { flowId });

  yield take(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL);
  yield cancel(watcher);
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST_FOR_POLL,
    startPollingForOpenErrors
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST,
    requestIntegrationErrors
  ),
];

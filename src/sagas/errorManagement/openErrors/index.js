import { put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { userPreferences } from '../../../reducers';

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
  const { environment } = yield select(userPreferences) || {};
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

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST,
    requestFlowOpenErrors
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST,
    requestIntegrationErrors
  ),
];

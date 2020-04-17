import { put, takeLatest } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

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

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST,
    requestFlowOpenErrors
  ),
];

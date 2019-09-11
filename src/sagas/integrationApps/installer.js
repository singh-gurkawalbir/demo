import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* installStep({ integrationId, installerFunction }) {
  const path = `/integrations/${integrationId}/installer/${installerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'PUT' },
      message: `Installing`,
    });
  } catch (error) {
    yield put(
      actions.integrationApps.installer.failedStepInstall(
        integrationId,
        installerFunction
      )
    );

    return undefined;
  }

  if (stepCompleteResponse.success) {
    yield put(
      actions.integrationApps.installer.stepInstallComplete(
        stepCompleteResponse,
        integrationId,
        installerFunction
      )
    );
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION_APPS.INSTALLER.STEP_INSTALL, installStep),
];

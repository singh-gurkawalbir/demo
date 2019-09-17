import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* installStep({ id, installerFunction }) {
  const path = `/integrations/${id}/installer/${installerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'PUT' },
      message: `Installing`,
    });
  } catch (error) {
    yield put(
      actions.integrationApps.installer.updateStep(
        id,
        installerFunction,
        'failed'
      )
    );

    return undefined;
  }

  if (stepCompleteResponse.success) {
    yield put(
      actions.integrationApps.installer.completedStepInstall(
        stepCompleteResponse,
        id,
        installerFunction
      )
    );
  }
}

export default [
  takeEvery(
    actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.REQUEST,
    installStep
  ),
];

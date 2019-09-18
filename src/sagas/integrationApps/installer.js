import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
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

export function* addNewStore({ id }) {
  const path = `/integrations/${id}/installer/addNewStore`;
  let steps;

  try {
    steps = yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'PUT' },
      message: `Installing`,
    });
  } catch (error) {
    return undefined;
  }

  if (steps) {
    yield put(actions.integrationApps.store.receivedNewStoreSteps(id, steps));
  }
}

export default [
  takeEvery(
    actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.REQUEST,
    installStep
  ),
  takeLatest(actionTypes.INTEGRATION_APPS.STORE.ADD, addNewStore),
];

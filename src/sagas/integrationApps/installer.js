import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* installStep({ id, installerFunction, storeId, addOnId }) {
  const path = `/integrations/${id}/installer/${installerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: { storeId, addOnId }, method: 'PUT' },
      hidden: true,
    }) || {};
  } catch (error) {
    yield put(
      actions.integrationApp.installer.updateStep(
        id,
        installerFunction,
        'failed'
      )
    );
    yield put(actions.api.failure(path, 'PUT', error.message, false));

    return undefined;
  }

  if (stepCompleteResponse && stepCompleteResponse.success) {
    yield put(
      actions.integrationApp.installer.completedStepInstall(
        stepCompleteResponse,
        id,
        installerFunction
      )
    );

    if (addOnId) {
      yield put(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
      );
    }
  } else if (
    stepCompleteResponse &&
    !stepCompleteResponse.success &&
    (stepCompleteResponse.resBody || stepCompleteResponse.message)
  ) {
    yield put(
      actions.api.failure(
        path,
        'PUT',
        stepCompleteResponse.resBody || stepCompleteResponse.message,
        false
      )
    );
  }
}

export function* installStoreStep({ id, installerFunction }) {
  const path = `/integrations/${id}/installer/${installerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: {}, method: 'PUT' },
      hidden: true,
      message: `Installing`,
    }) || {};
  } catch (error) {
    yield put(
      actions.integrationApp.store.updateStep(id, installerFunction, 'failed')
    );
    yield put(actions.api.failure(path, 'PUT', error, false));

    return undefined;
  }

  if (stepCompleteResponse && stepCompleteResponse.success) {
    yield put(
      actions.integrationApp.store.completedStepInstall(
        id,
        installerFunction,
        stepCompleteResponse.stepsToUpdate
      )
    );
  } else if (
    stepCompleteResponse &&
    !stepCompleteResponse.success &&
    (stepCompleteResponse.resBody || stepCompleteResponse.message)
  ) {
    yield put(
      actions.api.failure(
        path,
        'PUT',
        stepCompleteResponse.resBody || stepCompleteResponse.message,
        false
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
      hidden: true,
      message: `Installing`,
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'PUT', error && error.message, false));
    yield put(
      actions.integrationApp.store.failedNewStoreSteps(id, error.message)
    );

    return undefined;
  }

  if (steps) {
    yield put(actions.resource.requestCollection('connections'));
    yield put(actions.integrationApp.store.receivedNewStoreSteps(id, steps));
  }
}

export default [
  takeEvery(actionTypes.INTEGRATION_APPS.INSTALLER.STEP.REQUEST, installStep),
  takeLatest(actionTypes.INTEGRATION_APPS.STORE.ADD, addNewStore),
  takeLatest(actionTypes.INTEGRATION_APPS.STORE.INSTALL, installStoreStep),
];

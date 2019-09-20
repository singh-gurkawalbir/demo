import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* preUninstall({ storeId, id }) {
  const path = `/integrations/${id}/uninstaller/preUninstallFunction`;
  let uninstallSteps;

  try {
    uninstallSteps = yield call(apiCallWithRetry, {
      path,
      opts: { body: { storeId }, method: 'PUT' },
      message: `Fetching Uninstall steps`,
    });
  } catch (error) {
    return undefined;
  }

  yield put(
    actions.integrationApp.uninstaller.receivedUninstallSteps(
      uninstallSteps,
      storeId,
      id
    )
  );
}

export function* uninstallStep({ storeId, id, uninstallerFunction }) {
  const path = `/integrations/${id}/uninstaller/${uninstallerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      opts: { body: { storeId }, method: 'PUT' },
      message: `Uninstalling`,
    });
  } catch (error) {
    yield put(
      actions.integrationApp.uninstaller.updateStep(
        id,
        uninstallerFunction,
        'failed'
      )
    );

    return undefined;
  }

  if (stepCompleteResponse.success) {
    yield put(
      actions.integrationApp.uninstaller.updateStep(
        id,
        uninstallerFunction,
        'completed'
      )
    );
  }
}

export function* uninstallIntegration({ integrationId }) {
  const path = `/integrations/${integrationId}/install`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: { body: {}, method: 'DELETE' },
      message: `Uninstalling`,
    });
  } catch (error) {
    return undefined;
  }

  yield put(actions.resource.deleted('integrations', integrationId));
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL,
    preUninstall
  ),
  takeLatest(
    actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.REQUEST,
    uninstallStep
  ),
  takeLatest(
    actionTypes.INTEGRATION_APPS.UNINSTALLER.DELETE_INTEGRATION,
    uninstallIntegration
  ),
];

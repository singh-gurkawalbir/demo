import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { getResource } from '../resources';

export function* preUninstall({ storeId, id }) {
  const path = `/integrations/${id}/uninstaller/preUninstallFunction`;
  let uninstallSteps;

  try {
    uninstallSteps = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: { storeId }, method: 'PUT' },
      message: 'Loading',
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'PUT', error && error.message, false));
    yield put(
      actions.integrationApp.uninstaller.failedUninstallSteps(
        id,
        error.message || 'Failed to fetch Uninstall Steps.'
      )
    );

    return undefined;
  }

  yield call(getResource, { resourceType: 'integrations', id });
  yield put(
    actions.integrationApp.uninstaller.receivedUninstallSteps(
      uninstallSteps,
      storeId,
      id
    )
  );
}

export function* uninstallStep({ storeId, id, uninstallerFunction, addOnId }) {
  const path = `/integrations/${id}/uninstaller/${uninstallerFunction}`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: { storeId, addOnId }, method: 'PUT' },
      message: 'Uninstalling',
    }) || {};
  } catch (error) {
    if (addOnId) {
      yield put(
        actions.integrationApp.isAddonInstallInprogress(false, addOnId)
      );
    }

    yield put(
      actions.integrationApp.uninstaller.updateStep(
        id,
        uninstallerFunction,
        'failed'
      )
    );

    return undefined;
  }

  if (stepCompleteResponse && stepCompleteResponse.success) {
    // After successful completion of step IA could update integration in the BE. Need to get updated doc.
    yield call(getResource, {
      resourceType: 'integrations',
      id,
    });
    yield put(
      actions.integrationApp.uninstaller.updateStep(
        id,
        uninstallerFunction,
        'completed'
      )
    );

    if (addOnId) {
      yield put(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(id)
      );
      yield put(
        actions.integrationApp.isAddonInstallInprogress(false, addOnId)
      );
    }
  }
}

export function* uninstallIntegration({ integrationId }) {
  const path = `/integrations/${integrationId}/install`;

  try {
    yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: {}, method: 'DELETE' },
      message: 'Uninstalling',
    });
  } catch (error) {
    return undefined;
  }

  yield put(actions.resource.requestCollection('integrations'));
  yield put(actions.resource.requestCollection('tiles'));
  yield put(actions.resource.requestCollection('licenses'));
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

import { call, put, takeEvery } from 'redux-saga/effects';
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
    actions.integrationApps.uninstaller.receivedUninstallSteps(
      uninstallSteps,
      storeId,
      id
    )
  );
}

export function* uninstallStep({ id, uninstallerFunction }) {
  const path = `/integrations/${id}/uninstaller/${uninstallerFunction}`;
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
        id,
        uninstallerFunction
      )
    );

    return undefined;
  }

  if (stepCompleteResponse.success) {
    yield put(
      actions.integrationApps.uninstaller.uninstalledStep(
        stepCompleteResponse,
        id,
        uninstallerFunction
      )
    );
  }
}

export default [
  takeEvery(
    actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL,
    preUninstall
  ),
];

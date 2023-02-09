import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* initUninstall({ id }) {
  const path = `/integrations/${id}/initUninstall`;

  try {
    yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { method: 'POST' },
      message: 'Init uninstall',
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'POST', error?.message, false));
    yield put(
      actions.integrationApp.uninstaller2.failed(
        id,
        error.message || 'Failed to initialize uninstall'
      )
    );

    return undefined;
  }

  // once init is complete, BE will update mode to 'uninstall' so need to get updated doc
  yield put(actions.resource.request('integrations', id));
}

export function* uninstallStep({ id, formVal }) {
  const path = `/integrations/${id}/uninstallSteps`;
  let stepCompleteResponse;

  try {
    stepCompleteResponse = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { body: formVal, method: 'POST' },
      message: 'Uninstalling step',
    });
  } catch (error) {
    yield put(
      actions.integrationApp.uninstaller2.updateStep(
        id,
        'reset'
      )
    );

    return undefined;
  }

  if (!stepCompleteResponse) {
    yield put(
      actions.integrationApp.uninstaller2.updateStep(
        id,
        'completed'
      )
    );
    yield put(actions.resource.requestCollection('integrations'));
    yield put(actions.license.refreshCollection());

    // once all steps are done, mark state as complete
    return yield put(
      actions.integrationApp.uninstaller2.complete(
        id
      )
    );
  }
  yield put(
    actions.integrationApp.uninstaller2.receivedSteps(
      id,
      stepCompleteResponse,
    )
  );
}

export function* requestSteps({ id }) {
  const path = `/integrations/${id}/uninstallSteps`;
  let uninstallSteps;

  try {
    uninstallSteps = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { method: 'GET' },
      message: 'Loading',
    });
  } catch (error) {
    yield put(actions.api.failure(path, 'GET', error?.message, false));
    yield put(
      actions.integrationApp.uninstaller2.failed(
        id,
        error.message || 'Failed to get uninstall steps'
      )
    );

    return undefined;
  }

  yield put(
    actions.integrationApp.uninstaller2.receivedSteps(
      id,
      uninstallSteps,
    )
  );

  const visibleSteps = uninstallSteps.filter(s => !s.completed);

  if (!visibleSteps || visibleSteps.length === 0) {
    return yield call(uninstallStep, { id });
  }
}

export function* clearCollection({ integrationId }) {
  yield put(actions.resource.clearCollection('integrations'));
  yield put(actions.resource.clearCollection('flows', integrationId));
  yield put(actions.resource.clearCollection('exports', integrationId));
  yield put(actions.resource.clearCollection('imports', integrationId));
  yield put(actions.resource.clearCollection('connections', integrationId));
  yield put(actions.resource.clearCollection('asynchelpers'));
  yield put(actions.resource.clearCollection('scripts'));
  yield put(actions.resource.clearCollection('tree/metadata', integrationId));
  yield put(actions.license.refreshCollection());
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.UNINSTALLER2.INIT,
    initUninstall
  ),
  takeLatest(actionTypes.INTEGRATION_APPS.UNINSTALLER2.REQUEST_STEPS, requestSteps),
  takeEvery(actionTypes.INTEGRATION_APPS.UNINSTALLER2.STEP.UNINSTALL, uninstallStep),
  takeEvery(actionTypes.INTEGRATION_APPS.UNINSTALLER2.CLEAR_COLLECTION, clearCollection),
];

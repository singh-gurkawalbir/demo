import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestSteps({ id }) {
  const path = `/integrations/${id}/uninstallSteps`;
  let uninstallSteps;

  try {
    uninstallSteps = yield call(apiCallWithRetry, {
      path,
      timeout: 5 * 60 * 1000,
      opts: { method: 'GET' },
      message: 'Fetching uninstall steps',
    })
  } catch (error) {
    yield put(actions.api.failure(path, 'GET', error && error.message, false));
    yield put(
      actions.integrationApp.uninstaller2.failed(
        id,
        error.message || 'Failed to get uninstall steps'
      )
    );

    return undefined;
  }

  return yield put(
    actions.integrationApp.uninstaller2.receivedSteps(
      id,
      uninstallSteps,
    )
  );
}

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
    yield put(actions.api.failure(path, 'POST', error && error.message, false));
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
      actions.integrationApp.uninstaller2.failed(
        id,
        error.message || 'Failed to post steps'
      )
    );

    return undefined;
  }

  if (!stepCompleteResponse) {
    // to clear session state
    yield put(
      actions.integrationApp.uninstaller2.clearSteps(
        id
      )
    );

    return yield put(actions.resource.requestCollection('integrations'));
  }

  yield put(
    actions.integrationApp.uninstaller2.updateStep(
      id,
      'completed'
    )
  );
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.UNINSTALLER2.INIT,
    initUninstall
  ),
  takeEvery(actionTypes.INTEGRATION_APPS.UNINSTALLER2.REQUEST_STEPS, requestSteps),
  takeEvery(actionTypes.INTEGRATION_APPS.UNINSTALLER2.STEP.UNINSTALL, uninstallStep),
];

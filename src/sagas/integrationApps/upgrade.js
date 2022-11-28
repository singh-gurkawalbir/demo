import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* changeEdition({ integrationId }) {
  yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'inProgress' }));
  const path = `/integrations/${integrationId}/changeEdition`;
  const body = {};

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: { body, method: 'POST' },
      // hidden: true,
      message: 'Requesting change edition',
    }) || {};
  } catch (error) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'error' }));

    // error handling;
    return;
  }
  yield put(actions.resource.request('integrations', integrationId));
  yield put(actions.integrationApp.upgrade.getSteps(integrationId));
}
export function* getSteps({ integrationId }) {
  yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'inProgress' }));
  const path = `/integrations/${integrationId}/changeEditionSteps`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'GET' },
      // hidden: true,
      message: 'Requesting edition steps',
    }) || {};
  } catch (error) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'error' }));

    // error handling;
    return;
  }

  if (response.showWizard === false) {
    yield put(actions.integrationApp.upgrade.postChangeEditonSteps(integrationId));
  }

  const obj = {
    steps: response.steps,
    showWizard: response.showWizard,
  };

  yield put(actions.integrationApp.upgrade.setStatus(integrationId, obj));
}
export function* postChangeEditionSteps({ integrationId }) {
  yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'inProgress' }));
  const path = `/integrations/${integrationId}/changeEditionSteps`;
  const body = {};
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: { body, method: 'POST' },
      // hidden: true,
      message: 'Posting edition steps',
    }) || {};
  } catch (error) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'error' }));
    // error handling;
  }
  if (response?.done === true) {
    yield put(actions.integrationApp.upgrade.setStatus(integrationId, { status: 'done' }));
    yield put(actions.resource.request('integrations', integrationId));
    yield put(actions.resource.requestCollection('flows', null, true, integrationId));
    yield put(actions.resource.requestCollection('exports', null, true, integrationId));
    yield put(actions.resource.requestCollection('imports', null, true, integrationId));
    yield put(actions.resource.requestCollection('connections', null, true, integrationId));
    yield put(actions.resource.requestCollection('asynchelpers', null, true, integrationId));
  }
  const obj = {
    steps: response?.steps,
  };

  yield put(actions.integrationApp.upgrade.setStatus(integrationId, obj));
}

export default [
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.V2.UPGRADE, changeEdition),
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.V2.GET_STEPS, getSteps),
  takeLatest(actionTypes.INTEGRATION_APPS.SETTINGS.V2.POST_CHANGE_EDITION_STEPS, postChangeEditionSteps),
];

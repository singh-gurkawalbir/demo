import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestIntegrations({ clientId }) {
  const path = `/iclients/${clientId}/integrations`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    }) || {};
  } catch {
    return undefined;
  }

  if (Array.isArray(response?.integrations)) {
    yield put(
      actions.integrationApp.landingPage.receivedIntegrations({ integrations: response.integrations })
    );
  }
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.LANDING_PAGE.REQUEST_INTEGRATIONS,
    requestIntegrations
  ),
];

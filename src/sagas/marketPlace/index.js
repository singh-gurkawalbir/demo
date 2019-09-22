import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestConnectors() {
  const path = '/published';
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Requesting Connectors',
    });
  } catch (e) {
    return;
  }

  yield put(actions.marketplace.receivedConnectors({ connectors: response }));
}

export function* requestTemplates() {
  const path = '/templates/published';
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Requesting Templates',
    });
  } catch (e) {
    return;
  }

  yield put(actions.marketplace.receivedTemplates({ templates: response }));
}

export function* installConnector({ connectorId, sandbox }) {
  const path = `/integrations/${connectorId}/install`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { sandbox },
      },
    });
  } catch (e) {
    return;
  }

  yield put(actions.resource.requestCollection('integrations'));
}

export function* contactSales({ connectorName, _connectorId }) {
  const path = '/licenses/request';

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { connectorName, _connectorId },
      },
    });
  } catch (e) {
    return true;
  }
}

export const marketplaceSagas = [
  takeEvery(actionTypes.MARKETPLACE.CONNECTORS_REQUEST, requestConnectors),
  takeEvery(actionTypes.MARKETPLACE.TEMPLATES_REQUEST, requestTemplates),
  takeEvery(actionTypes.MARKETPLACE.CONNECTOR_INSTALL, installConnector),
  takeEvery(actionTypes.MARKETPLACE.SALES_CONTACT, contactSales),
];

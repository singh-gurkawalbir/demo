import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';

export function* requestConnectors() {
  const path = '/published';
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Requesting integration apps',
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

export function* installConnector({ connectorId, sandbox, tag }) {
  const integrationAppList = yield select(selectors.integrationAppList);
  let path = `/integrations/${connectorId}/install`;
  const connector =
    integrationAppList && integrationAppList.find(ia => ia._id === connectorId);

  if (connector && connector.framework === 'twoDotZero') {
    path = `/connectors/${connectorId}/install`;
  }

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { sandbox, tag },
      },
    });
  } catch (e) {
    return;
  }

  yield put(actions.resource.requestCollection('integrations'));
  yield put(actions.resource.requestCollection('tiles'));
  yield put(actions.resource.requestCollection('connections'));
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

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
    return true;
  }

  yield put(actions.marketPlace.receivedConnectors({ connectors: response }));
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
    return true;
  }

  yield put(actions.marketPlace.receivedTemplates({ templates: response }));
}

export const marketPlaceSagas = [
  takeEvery(actionTypes.MARKETPLACE.CONNECTORS_REQUEST, requestConnectors),
  takeEvery(actionTypes.MARKETPLACE.TEMPLATES_REQUEST, requestTemplates),
];

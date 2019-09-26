import { call, takeEvery } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* generateZip({ integrationId }) {
  const path = `/integrations/${integrationId}/template`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Generating zip',
    });
  } catch (e) {
    return;
  }

  window.open(response.signedURL, 'target=_blank', response.options, false);
}

export const templateSagas = [
  takeEvery(actionTypes.TEMPLATE.ZIP_GENERATE, generateZip),
];

import { call, takeEvery } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* downloadZip({ id }) {
  const path = `/templates/${id}/download/signedURL`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      message: 'Downloading zip',
    });
  } catch (e) {
    return;
  }

  window.open(response.signedURL, 'target=_blank', response.options, false);
}

export const templateSagas = [
  takeEvery(actionTypes.TEMPLATE.ZIP_DOWNLOAD, downloadZip),
];

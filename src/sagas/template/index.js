import { call, takeEvery, put } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
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

export function* publish({ item, resourceType }) {
  const path = `/templates/${item._id}`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: { ...item, published: !item.published },
      },
    });
  } catch (e) {
    return;
  }

  yield put(
    actions.resource.update(resourceType, item._id, {
      published: !item.published,
    })
  );
}

export const templateSagas = [
  takeEvery(actionTypes.TEMPLATE.ZIP_DOWNLOAD, downloadZip),
  takeEvery(actionTypes.TEMPLATE.PUBLISH, publish),
];

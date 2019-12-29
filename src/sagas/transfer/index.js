import { call, takeEvery, put } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* cancel({ id }) {
  const path = `/transfers/${id}/cancel`;
  const opts = { method: 'PUT' };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return true;
  }

  yield put(actions.resource.requestCollection('transfers'));
}

export function* create({ data }) {
  const path = `/transfers/invite`;
  const opts = {
    method: 'POST',
    body: data,
  };

  try {
    yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    yield put(actions.api.failure(path, 'POST', e, false));

    return true;
  }

  yield put(actions.resource.requestCollection('transfers'));
}

export function* preview({ data }) {
  let path = `/transfers/preview`;
  const opts = { method: 'GET' };

  if (data) {
    path += `?email=${data.email}`;

    if (data._integrationIds) {
      try {
        path += `&_integrationIds=${JSON.stringify(data._integrationIds)}`;
      } catch (e) {
        yield put(actions.api.failure(path, 'GET', e, false));

        return true;
      }
    }
  }

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts,
      hidden: true,
    });

    yield put(actions.transfer.updatePreview({ response }));
  } catch (error) {
    yield put(actions.transfer.updatePreview({ error }));

    return true;
  }
}

export const transferSagas = [
  takeEvery(actionTypes.TRANSFER.CANCEL, cancel),
  takeEvery(actionTypes.TRANSFER.PREVIEW, preview),
  takeEvery(actionTypes.TRANSFER.CREATE, create),
];

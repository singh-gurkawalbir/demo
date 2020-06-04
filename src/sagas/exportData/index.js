import { takeLatest, put, call } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';

// technically BigInt and Symbol are now also primitives but not yet applicable in this specific case
const isPrimitive = p =>
  p == null ||
  typeof p === 'boolean' ||
  typeof p === 'number' ||
  typeof p === 'string';

function* getData({ kind, identifier: id, resource }) {
  let path;
  let method;
  let body;

  if (kind === 'virtual') {
    path = '/exports/preview';
    method = 'POST';
    body = { ...resource };

    // special handling for exports/preview
    // in case the input does not set test.limit
    // set it to max which is 100
    if (
      !body.test ||
      !body.test.limit ||
      body.test.limit == null ||
      body.test.limit <= 0
    ) {
      body.test = body.test || {};
      body.test.limit = 100;
    }
  } else {
    // unreachable
  }

  try {
    const res = yield call(apiCallWithRetry, {
      path,
      opts: { method, body },
      message: `Fetching ${kind} export`,
      hidden: true,
    });

    if (!res) throw new Error('no export response');

    if (res.errors && res.errors.length) throw res.errors[0];

    const { data } = res;

    if (!data || !Array.isArray(data)) throw new Error('expecting array. try transform?');

    // if array of primitives, covert to object of label/value
    for (let i = 0; i < data.length; i += 1) {
      if (isPrimitive(data[i])) {
        const t = data[i];

        data[i] = { label: String(t), value: t };
      }
    }

    yield put(actions.exportData.receive(kind, id, data));
  } catch (e) {
    if (e.status === 403 || e.status === 401) return;

    if (e.status >= 400 && e.status < 500) {
      let parsedError;

      try {
        parsedError = JSON.parse(e.message);
      } catch (ex) {
        parsedError = String(e.message);
      }

      yield put(actions.exportData.receiveError(kind, id, parsedError));

      return;
    }

    yield put(actions.exportData.receiveError(kind, id, e.message));
  }
}

export default [takeLatest(actionTypes.EXPORTDATA.REQUEST, getData)];

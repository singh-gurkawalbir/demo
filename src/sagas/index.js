import { all, call, takeLatest, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';

const { profile, exports, imports, connections } = actions;
const tryCount = 3;

function* fetchResource(action, path) {
  // console.log('fetchResource: ', path);

  for (let i = 0; i < tryCount; i += 1) {
    try {
      const data = yield call(api, `/${path}`);

      // console.log(('data from fetchResource:', data));

      yield put(action.received(data));
    } catch (error) {
      if (i < tryCount - 1) {
        yield call(delay, 2000);
        yield put(action.retry());
      } else {
        // attempts failed after 'tryCount' attempts
        // this time yield an error...
        yield put(action.failure(error.message));
      }
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionTypes.PROFILE.REQUEST, fetchResource, profile, 'profile'),
    takeLatest(actionTypes.EXPORTS.REQUEST, fetchResource, exports, 'exports'),
    takeLatest(actionTypes.IMPORTS.REQUEST, fetchResource, imports, 'imports'),
    takeLatest(
      actionTypes.CONNECTIONS.REQUEST,
      fetchResource,
      connections,
      'connections'
    ),
  ]);
}

import { all, call, takeLatest, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';

const { profile, exports, imports, connections } = actions;
const tryCount = 3;

export function* fetchResource(action, path) {
  for (let i = 0; i < tryCount; i += 1) {
    try {
      const data = yield call(api, `/${path}`);

      // console.log(('data from fetchResource:', data));

      return yield put(action.received(data));
    } catch (error) {
      // TODO: analyze error and dispatch(put) different actions as need.
      // for example, if we get a 401, we should dispatch a redirect action
      // to the login page. Possibly some 4xx errors could also have custom
      // behavior, etc..
      if (i < tryCount - 1) {
        yield call(delay, 2000);
        yield put(action.retry());
      } else {
        // attempts failed after 'tryCount' attempts
        // this time yield an error...
        return yield put(action.failure(error.message));
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

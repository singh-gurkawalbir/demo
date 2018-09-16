import { all, call, takeLatest, put } from 'redux-saga/effects';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';

const { profile, exports, imports, connections } = actions;

function* fetchResource(action, path) {
  // console.log('fetchResource: ', path);

  try {
    const data = yield call(api, `/${path}`);

    // console.log(('data from fetchResource:', data));

    yield put(action.received(data));
  } catch (error) {
    yield put(action.failure(error.message));
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

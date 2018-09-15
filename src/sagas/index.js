import { all, call, takeLatest, put } from 'redux-saga/effects';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';

function* fetchResource(name) {
  // console.log('fetchResource: ', name);

  try {
    const data = yield call(api, `/${name}`);

    yield put(actions.receivedResource(name, data));
  } catch (error) {
    yield put(actions.receivedResource(name, null));
  }
}

function* fetchProfile() {
  try {
    const data = yield call(api, '/profile');

    yield put(actions.profileReceived(data));
  } catch (error) {
    yield put(actions.profileReceived(null));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionTypes.PROFILE_REQUEST, fetchProfile),
    takeLatest('EXPORTS_REQUEST', fetchResource, 'exports'),
    takeLatest('IMPORTS_REQUEST', fetchResource, 'imports'),
    takeLatest('CONNECTIONS_REQUEST', fetchResource, 'connections'),
  ]);
}

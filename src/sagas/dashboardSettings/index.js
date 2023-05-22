import {
  call,
  put,
  takeLatest,
  select,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '..';
import { selectors } from '../../reducers';

export function* getPreference() {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: '/accountInsights/api/dashboards',
      opts: {
        method: 'GET',
      },
    });
  } catch (e) {
    return;
  }
  // console.log(response);

  yield put(actions.dashboard.received(response));
}

export function* postPreference({ layouts, graphTypes}) {
  try {
    const data = yield select(selectors.getData);

    // console.log(graphTypes);
    const response = yield call(apiCallWithRetry, {
      path: '/accountInsights/api/dashboards/6459cc9397dc8aa42f85ec60',
      opts: {
        body: {...data, layouts, graphTypes},
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      },
    });
    // console.log({...data, layouts});

    // yield call(getPreference);

    // Dispatch a success action if needed
    yield put(actions.dashboard.preferencePosted(response));
  } catch (error) {
    // Dispatch a failure action if needed
    yield put(actions.dashboard.preferencePostFailed(error));
  }
}

export default [
  takeLatest(actionTypes.DASHBOARD.REQUEST, getPreference),
  takeLatest(actionTypes.DASHBOARD.POST_PREFERENCE, postPreference),
];

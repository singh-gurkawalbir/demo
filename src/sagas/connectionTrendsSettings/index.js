import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '..';

export function* request(startDateString) {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: `/accountInsights/api/connectionsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValConnection}`,
      opts: {
        method: 'GET',
      },
    });
  } catch (error) {
    yield put(actions.connectionTrends.failed(error));

    return;
  }

  yield put(actions.connectionTrends.received(response));
}

export default [
  takeLatest(actionTypes.CONNECTIONTRENDS.REQUEST, request),
];

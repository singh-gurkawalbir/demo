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
      path: `/accountInsights/api/flowsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterValFlow}`,
      opts: {
        method: 'GET',
      },
    });
  } catch (e) {
    return;
  }
  yield put(actions.flowTrends.received(response));
}
export default [
  takeLatest(actionTypes.FLOWTRENDS.REQUEST, request),
];

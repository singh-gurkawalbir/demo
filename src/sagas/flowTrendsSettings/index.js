import {
  call,
  put,
  // takeEvery,
  takeLatest,
  // select,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '..';
// import { selectors } from '../../reducers';

export function* request(startDateString) {
  let response;

  // console.log(`/accountInsights/api/flowsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=enabled`);
  try {
    response = yield call(apiCallWithRetry, {
      path: `/accountInsights/api/flowsTrend?from=${startDateString.startDateString}&to=${startDateString.endDateString}&type=${startDateString.filterVal}`,
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

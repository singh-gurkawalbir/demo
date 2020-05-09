import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import { getFlowMetricsQuery } from '../../utils/flowMetrics';

export function* requestFlowMetrics({ flowId, filters }) {
  let response;
  const path = '/stats/tsdb';
  const user = yield select(selectors.userProfile);
  const query = getFlowMetricsQuery(flowId, user._id, filters);
  const body = { query };

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body,
        method: 'POST',
      },
      message: 'Fetching Graph Data.',
    });
  } catch (e) {
    return undefined;
  }

  if (response) {
    yield put(actions.resource.requestCollection('notifications'));
  }
}

export const flowMetricSagas = [
  takeEvery(actionTypes.FLOW_METRICS.REQUEST, requestFlowMetrics),
];

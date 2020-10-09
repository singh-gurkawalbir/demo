import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as d3 from 'd3';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  getFlowMetricsQuery,
  parseFlowMetricsJson,
} from '../../utils/flowMetrics';

function* requestMetric({query}) {
  let csvResponse;
  const path = '/stats/tsdb';

  try {
    csvResponse = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {query},
        method: 'POST',
      },
      message: 'Loading',
    });

    return d3.csvParse(csvResponse);
  } catch (e) {
    return [];
  }
}

export function* requestFlowMetrics({ flowId, filters }) {
  const userId = yield select(selectors.ownerUserId);
  const query = getFlowMetricsQuery(flowId, userId, filters);

  try {
    const data = yield call(requestMetric, { query });

    yield put(actions.flowMetrics.received(flowId, parseFlowMetricsJson(data)));
  } catch (e) {
    yield put(actions.flowMetrics.failed(e));

    return undefined;
  }
}

export const flowMetricSagas = [
  takeEvery(actionTypes.FLOW_METRICS.REQUEST, requestFlowMetrics),
];

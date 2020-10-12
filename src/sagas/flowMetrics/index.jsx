import { call, put, takeLatest, select } from 'redux-saga/effects';
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

export function* requestFlowMetrics({ resourceId, resourceType, filters }) {
  const userId = yield select(selectors.ownerUserId);
  let flowIds = [];

  if (resourceType === 'integrations') {
    flowIds = yield select(selectors.integrationEnabledFlowIds, resourceId);
    // eslint-disable-next-line no-param-reassign
    filters.selectedResources = flowIds;
  }
  const query = getFlowMetricsQuery(resourceId, resourceType, userId, filters);

  try {
    const data = yield call(requestMetric, { query });

    yield put(actions.flowMetrics.received(resourceId, parseFlowMetricsJson(data)));
  } catch (e) {
    yield put(actions.flowMetrics.failed(e));

    return undefined;
  }
}

export const flowMetricSagas = [
  takeLatest(actionTypes.FLOW_METRICS.REQUEST, requestFlowMetrics),
];

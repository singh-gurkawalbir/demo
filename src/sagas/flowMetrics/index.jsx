import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  getFlowMetricsQuery,
  getFlowMetricsAttQuery,
  parseFlowMetricsJson,
} from '../../utils/flowMetrics';
import { invokeProcessor } from '../editor';

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

    if (csvResponse) {
      const json = yield call(invokeProcessor, {
        processor: 'csvParser',
        body: {
          rules: {
            columnDelimiter: ',',
            hasHeaderRow: true,
            trimSpaces: true,
            rowsToSkip: 0,
          },
          data: csvResponse,
          options: { includeEmptyValues: true },
        },
      });

      return json;
    }
  } catch (e) {
    return undefined;
  }
}

export function* requestFlowMetrics({ flowId, filters }) {
  const user = yield select(selectors.userProfile);
  const seiQuery = getFlowMetricsQuery(flowId, user._id, filters);
  const attQuery = getFlowMetricsAttQuery(flowId, user._id, filters);

  try {
    const seiData = yield call(requestMetric, {query: seiQuery});
    const attData = yield call(requestMetric, {query: attQuery});
    let data = [];

    if (seiData && seiData.data) {
      data = [...data, ...seiData.data];
    }
    if (attData && attData.data) {
      data = [...data, ...attData.data];
    }

    const parsedJson = parseFlowMetricsJson(data);

    yield put(actions.flowMetrics.received(flowId, parsedJson));
  } catch (e) {
    yield put(actions.flowMetrics.failed(e));

    return undefined;
  }
}

export const flowMetricSagas = [
  takeEvery(actionTypes.FLOW_METRICS.REQUEST, requestFlowMetrics),
];

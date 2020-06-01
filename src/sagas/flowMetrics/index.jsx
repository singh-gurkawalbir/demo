import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import {
  getFlowMetricsQuery,
  parseFlowMetricsJson,
} from '../../utils/flowMetrics';
import { invokeProcessor } from '../editor';

export function* requestFlowMetrics({ flowId, filters }) {
  let csvResponse;
  const path = '/stats/tsdb';
  const user = yield select(selectors.userProfile);
  const query = getFlowMetricsQuery(flowId, user._id, filters);
  const body = { query };

  try {
    csvResponse = yield call(apiCallWithRetry, {
      path,
      opts: {
        body,
        method: 'POST',
      },
      message: 'Fetching graph data.',
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
      const parsedJson = parseFlowMetricsJson(json);

      yield put(actions.flowMetrics.received(flowId, parsedJson));
    }
  } catch (e) {
    yield put(actions.flowMetrics.failed(e));

    return undefined;
  }
}

export const flowMetricSagas = [
  takeEvery(actionTypes.FLOW_METRICS.REQUEST, requestFlowMetrics),
];

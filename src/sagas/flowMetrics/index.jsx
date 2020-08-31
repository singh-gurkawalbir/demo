import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as d3 from 'd3';
import mean from 'lodash/mean';
import compact from 'lodash/compact';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  getFlowMetricsQuery,
  getFlowMetricsAttQuery,
  parseFlowMetricsJson,
} from '../../utils/flowMetrics';

function* requestMetric({query, isAtt}) {
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
    const json = d3.csvParse(csvResponse);

    const flows = json.reduce((acc, cur) => {
      const item = acc.find(i => i.time === cur.time);

      if (item) {
        if (isAtt) {
          item.attValues.push(Math.floor(cur.averageTimeTaken) || 0);
          item.averageTimeTaken = mean(compact(item.attValues));
        } else {
          item.success += (+cur.success || 0);
          item.error += (+cur.error || 0);
          item.ignored += (+cur.ignored || 0);
        }
      } else {
        acc.push({
          ...cur,
          ...(!isAtt && { success: +cur.success || 0 }),
          ...(!isAtt && { error: +cur.error || 0 }),
          ...(!isAtt && { ignored: +cur.ignored || 0 }),
          ...(isAtt && { averageTimeTaken: Math.floor(cur.averageTimeTaken) || 0 }),
          ...(isAtt && { attValues: [Math.floor(cur.averageTimeTaken) || 0] }),
          resourceId: cur.flowId,
          type: 'flow',
        });
      }

      return acc;
    }, []);

    return [...json, ...flows];
  } catch (e) {
    return [];
  }
}

export function* requestFlowMetrics({ flowId, filters }) {
  const user = yield select(selectors.userProfile);
  const seiQuery = getFlowMetricsQuery(flowId, user._id, filters);
  const attQuery = getFlowMetricsAttQuery(flowId, user._id, filters);

  try {
    const seiData = yield call(requestMetric, {query: seiQuery});
    const attData = yield call(requestMetric, {query: attQuery, isAtt: true});

    const data = seiData.reduce((acc, cur) => {
      const item = attData.find(i => i.time === cur.time && i.resourceId === cur.resourceId);

      acc.push({
        ...cur,
        ...(item && {averageTimeTaken: Math.floor(item.averageTimeTaken) || 0}),
        ...(!item && {averageTimeTaken: 0}),
      });

      return acc;
    }, []);

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

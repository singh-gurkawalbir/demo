import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as d3 from 'd3';
import moment from 'moment';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { getFlowMetricsQuery, getRoundedDate } from '../../utils/flowMetrics';

export function* requestMetric({query}) {
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

    return d3.csvParse(csvResponse, d3.autoType);
  } catch (e) {
    return [];
  }
}

export function* requestFlowMetrics({resourceType, resourceId, filters }) {
  const userId = yield select(selectors.ownerUserId);
  const timezone = yield select(selectors.userTimezone);
  let flowIds = [];

  if (resourceType === 'integrations') {
    flowIds = yield select(selectors.integrationEnabledFlowIds, resourceId === 'none' ? undefined : resourceId);
    if (!flowIds || !flowIds.length) {
      yield put(actions.flowMetrics.received(resourceId, []));

      return;
    }
    if (filters.selectedResources?.includes?.(resourceId)) {
      // eslint-disable-next-line no-param-reassign
      filters.selectedResources = flowIds;
    }
  }
  if (filters?.range?.preset === 'lastrun' && resourceType === 'flows') {
    const flow = yield select(selectors.resource, 'flows', resourceId);
    const latestJobDetails = yield select(selectors.latestJobMap, flow?._integrationId);
    const latestJob = latestJobDetails?.data ? latestJobDetails.data.find(job => job._flowId === resourceId) : undefined;

    if (latestJob) {
      const startDate = getRoundedDate(new Date(latestJob.createdAt), 1, true);
      const endDate = getRoundedDate(latestJob.endedAt ? new Date(latestJob.endedAt) : new Date(), 1);

      // we aggregate data per hour when range is greater than 4 hours or run period is more than 7 days ago,
      // so the actual flow start and end may miss the aggregate window.
      // hence add -1 and +1 hour to actual flow run range
      if (moment().diff(moment(startDate), 'days') > 7 ||
       moment(endDate).diff(moment(startDate), 'hours') > 4) {
        startDate.setHours(startDate.getHours() - 1);
        endDate.setHours(endDate.getHours() + 1);
      } else {
        // Add -1 and +1 minute range if flow run is less than 4 hours and in last 7 days

        startDate.setMinutes(startDate.getMinutes() - 2);
        endDate.setMinutes(endDate.getMinutes() + 2);
      }
      // eslint-disable-next-line no-param-reassign
      filters.range = { startDate, endDate, preset: 'lastrun' };
    }
  }
  const query = getFlowMetricsQuery(resourceType, resourceId, userId, {...filters, timezone});

  try {
    const data = yield call(requestMetric, { query });

    yield put(actions.flowMetrics.received(resourceId, data));
  } catch (e) {
    yield put(actions.flowMetrics.failed(resourceId));

    return undefined;
  }
}

export const flowMetricSagas = [
  takeLatest(actionTypes.FLOW_METRICS.REQUEST, requestFlowMetrics),
];

/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import { addDays, addMinutes } from 'date-fns';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { requestMetric, requestFlowMetrics } from '.';
import { getFlowMetricsQuery, getRoundedDate } from '../../utils/flowMetrics';

describe('flowMetrics saga', () => {
  describe('requestMetrics generator', () => {
    const query = 'someQuery';
    const csvResponse = 'Year,Make,Model,Length\n1997,Ford,E350,2.34\n2000,Mercury,Cougar,2.38';
    const data = [
      { Length: 2.34, Make: 'Ford', Model: 'E350', Year: 1997 },
      { Length: 2.38, Make: 'Mercury', Model: 'Cougar', Year: 2000 },
    ];
    const args = {
      path: '/stats/tsdb',
      opts: {
        body: {query},
        method: 'POST',
      },
      message: 'Loading',
    };

    test('should return parsed response on successful api call', () =>
      expectSaga(requestMetric, { query })
        .provide([[call(apiCallWithRetry, args), csvResponse]])
        .call(apiCallWithRetry, args)
        .returns(data)
        .run());

    test('should return empty array, if api call fails', () =>
      expectSaga(requestMetric, { query })
        .provide([[call(apiCallWithRetry, args), throwError([])]])
        .call(apiCallWithRetry, args)
        .returns([])
        .run());
  });
  describe('requestFlowMetrics saga', () => {
    describe('if resource is an integration', () => {
      const resourceType = 'integrations';
      const resourceId = 'i1';
      const filters = {
        range: {
          preset: 'yesterday',
          startDate: addDays(new Date(), -7),
          endDate: addDays(new Date(), -6),
        },
        selectedResources: [],
      };
      const userId = 'u1';
      const timeZone = '';

      test('should dispatch received action with corresponding data, if there are some flowIds and requestMetric call is successful', () => {
        const flowIds = ['f1', 'f2'];

        filters.selectedResources = ['i1'];
        const data = [{ dummy: 'dummy' }];
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, { ...filters, selectedResources: flowIds, timeZone }),
        };

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
            [call(requestMetric, args), data],
          ])
          .call(requestMetric, args)
          .put(actions.flowMetrics.received(resourceId, data))
          .run();
      });
      test('should dispatch received action with empty data, if there are no flowIds and integration is a standalone integration', () => {
        const resourceId2 = 'none';
        const flowIds = [];

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId: resourceId2,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [select(selectors.integrationEnabledFlowIds, undefined), flowIds],
          ])
          .put(actions.flowMetrics.received(resourceId2, []))
          .not.call.fn(requestMetric)
          .run();
      });
      test('should dispatch flowmetrics failed action, if the requestMetric call failed', () => {
        const flowIds = ['f1', 'f2'];

        filters.selectedResources = ['i2'];
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, { ...filters, timeZone }),
        };
        const e = new Error();

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
            [call(requestMetric, args), throwError(e)],
          ])
          .call(requestMetric, args)
          .put(actions.flowMetrics.failed(resourceId))
          .run();
      });
    });
    describe('if resource is a flow', () => {
      const resourceType = 'flows';
      const resourceId = 'f1';
      const filters = {
        range: {
          preset: 'lastrun',
        },
        selectedResources: [],
      };
      const userId = 'u1';
      const timeZone = '';
      const apiCallArgs = {
        path: `/flows/${resourceId}/jobs/latest`,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };

      test('should call apiCallWithRetry and get latestJobs if filters preset is lastrun and if latestjobs are present then update with new startDate and endDate and call requestMetric', () => {
        const flowJobResponse = [
          {
            createdAt: addDays(new Date(), -7),
            endedAt: addDays(new Date(), -6),
          },
          {
            createdAt: addDays(new Date(), -2),
            endedAt: addDays(new Date(), -1),
          },
        ];
        const data = [{ dummy: 'dummy' }];

        const latestJob = flowJobResponse[0];
        const startDate = getRoundedDate(new Date(latestJob.createdAt), 1, true);
        const endDate = getRoundedDate(latestJob.endedAt ? new Date(latestJob.endedAt) : new Date(), 1);

        startDate.setHours(startDate.getHours() - 1);
        endDate.setHours(endDate.getHours() + 1);
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, { ...filters, range: { startDate, endDate, preset: 'lastrun' }, timeZone }),
        };

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [call(apiCallWithRetry, apiCallArgs), flowJobResponse],
            [call(requestMetric, args), data],
          ])
          .call(apiCallWithRetry, apiCallArgs)
          .put(actions.flowMetrics.updateLastRunRange(resourceId, startDate, endDate))
          .call(requestMetric, args)
          .put(actions.flowMetrics.received(resourceId, data))
          .run();
      });
      test('should call apiCallWithRetry and get latestJobs if filters preset is lastrun and if latestjobs are present and firstJob is created before 1 hour then update with new startDate and endDate and call requestMetric', () => {
        const flowJobResponse = [
          {
            createdAt: addMinutes(new Date(), -60),
          },
        ];
        const data = [{ dummy: 'dummy' }];

        const latestJob = flowJobResponse[0];
        const startDate = getRoundedDate(new Date(latestJob.createdAt), 1, true);
        const endDate = getRoundedDate(latestJob.endedAt ? new Date(latestJob.endedAt) : new Date(), 1);

        startDate.setMinutes(startDate.getMinutes() - 2);
        endDate.setMinutes(endDate.getMinutes() + 2);
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, { ...filters, range: { startDate, endDate, preset: 'lastrun' }, timeZone }),
        };

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [call(apiCallWithRetry, apiCallArgs), flowJobResponse],
            [call(requestMetric, args), data],
          ])
          .call(apiCallWithRetry, apiCallArgs)
          .put(actions.flowMetrics.updateLastRunRange(resourceId, startDate, endDate))
          .call(requestMetric, args)
          .put(actions.flowMetrics.received(resourceId, data))
          .run();
      });
      test('should call apiCallWithRetry and get latestJobs if filters preset is lastrun and is there are no latestJobs should call requestMetric with corresponding data', () => {
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, { ...filters, timeZone }),
        };
        const flowJobResponse = undefined;
        const data = [{ dummy: 'dummy' }];

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [call(apiCallWithRetry, apiCallArgs), flowJobResponse],
            [call(requestMetric, args), data],
          ])
          .call(apiCallWithRetry, apiCallArgs)
          .not.put(actions.flowMetrics.updateLastRunRange(resourceId, '', ''))
          .call(requestMetric, args)
          .put(actions.flowMetrics.received(resourceId, data))
          .run();
      });
      test('should call apiCallWithRetry if filters preset is lastrun and latestJobs will be an empty array if api call fails, call requestMetric with corresponding data', () => {
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, { ...filters, timeZone }),
        };
        const data = [{ dummy: 'dummy' }];

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [call(apiCallWithRetry, apiCallArgs), throwError()],
            [call(requestMetric, args), data],
          ])
          .call(apiCallWithRetry, apiCallArgs)
          .not.put(actions.flowMetrics.updateLastRunRange(resourceId, '', ''))
          .call(requestMetric, args)
          .put(actions.flowMetrics.received(resourceId, data))
          .run();
      });
      test('should not call apiCallWithRetry if filters preset is not lastrun and dispatch flowMetrics received action if requestMetric call is successful', () => {
        filters.range.preset = 'something';
        const data = [{ dummy: 'dummy' }];
        const args = {
          query: getFlowMetricsQuery(resourceType, resourceId, userId, filters),
        };

        return expectSaga(requestFlowMetrics, {
          resourceType,
          resourceId,
          filters,
        })
          .provide([
            [select(selectors.ownerUserId), userId],
            [select(selectors.userTimezone), timeZone],
            [call(requestMetric, args), data],
          ])
          .not.call(apiCallWithRetry, apiCallArgs)
          .call(requestMetric, args)
          .put(actions.flowMetrics.received(resourceId, data))
          .run();
      });
    });
  });
});

/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { requestMetric, requestFlowMetrics } from '.';
import { getFlowMetricsQuery } from '../../utils/flowMetrics';

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
    const resourceId = 'dummyResourceId';
    const filters = {
      range: {
        preset: 'yesterday',
        startDate: new Date('05 October 2011 14:48 UTC'),
        endDate: new Date('06 October 2011 14:48 UTC'),
      },
      selectedResources: [],
    };
    const userId = '123';

    test('should dispatch received action with corresponding data, if resource is an integration with some flowIds and api call is successful', () => {
      const resourceType = 'integrations';
      const flowIds = ['dummyId'];

      filters.selectedResources = flowIds;
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
          [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
          [call(requestMetric, args), data],
        ])
        .call(requestMetric, args)
        .put(actions.flowMetrics.received(resourceId, data))
        .run();
    });
    test('should dispatch received action with corresponding data, if resource is not an integration and api call is successful', () => {
      const resourceType = 'notIntegrations';
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
          [call(requestMetric, args), data],
        ])
        .call(requestMetric, args)
        .put(actions.flowMetrics.received(resourceId, data))
        .run();
    });
    test('should dispatch received action with empty data, if resource is an integration without flowIds and api call is successful', () => {
      const resourceType = 'integrations';
      const flowIds = [];

      return expectSaga(requestFlowMetrics, {
        resourceType,
        resourceId,
        filters,
      })
        .provide([
          [select(selectors.ownerUserId), userId],
          [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
        ])
        .not.call.fn(requestMetric)
        .put(actions.flowMetrics.received(resourceId, []))
        .run();
    });
    test('should dispatch failed action, if the api call failed', () => {
      const resourceType = 'integrations';
      const flowIds = ['dummyId'];

      filters.selectedResources = flowIds;
      const args = {
        query: getFlowMetricsQuery(resourceType, resourceId, userId, filters),
      };
      const e = new Error();

      return expectSaga(requestFlowMetrics, {
        resourceType,
        resourceId,
        filters,
      })
        .provide([
          [select(selectors.ownerUserId), userId],
          [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
          [call(requestMetric, args), throwError(e)],
        ])
        .call(requestMetric, args)
        .put(actions.flowMetrics.failed(resourceId))
        .run();
    });
  });
});

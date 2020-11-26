/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { select } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import { requestMetric, requestFlowMetrics } from '.';

describe('flowMetrics saga', () => {
  describe('requestMetrics generator', () => {
    const query = 'someQuery';
    const csvResponse = 'Year,Make,Model,Length\n1997,Ford,E350,2.34\n2000,Mercury,Cougar,2.38';
    const data = [
      { Length: 2.34, Make: 'Ford', Model: 'E350', Year: 1997 },
      { Length: 2.38, Make: 'Mercury', Model: 'Cougar', Year: 2000 },
    ];

    test('should return parsed response on successful api call', () =>
      expectSaga(requestMetric, { query })
        .provide([[matchers.call.fn(apiCallWithRetry), csvResponse]])
        .call.fn(apiCallWithRetry)
        .returns(data)
        .run());

    test('should return empty array, if api call fails', () => expectSaga(requestMetric, { query })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError([])]])
      .call.fn(apiCallWithRetry)
      .returns([])
      .run());
  });
  describe('requestFlowMetrics saga', () => {
    const resourceId = 'dummyResourceId';
    const filters = {
      selectedResources: [],
    };
    const userId = '123';

    test('should dispatch received action with corresponding data, if resource is an integration with some flowIds and api call is successful', () => {
      const resourceType = 'integrations';
      const flowIds = ['dummyId'];
      const data = 'dummyData';

      return expectSaga(requestFlowMetrics, {
        resourceType,
        resourceId,
        filters,
      })
        .provide([
          [select(selectors.ownerUserId), userId],
          [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
          [matchers.call.fn(requestMetric), data],
        ])
        .call.fn(requestMetric)
        .put(actions.flowMetrics.received(resourceType, resourceId, data))
        .run();
    });
    test('should dispatch received action with corresponding data, if resource is not an integration and api call is successful', () => {
      const resourceType = 'notIntegrations';
      const data = 'dummyData';

      return expectSaga(requestFlowMetrics, {
        resourceType,
        resourceId,
        filters,
      })
        .provide([
          [select(selectors.ownerUserId), userId],
          [matchers.call.fn(requestMetric), data],
        ])
        .call.fn(requestMetric)
        .put(actions.flowMetrics.received(resourceType, resourceId, data))
        .run();
    });
    test('should dispatch received action with empty data, if resource is an integration without flowIds and api call is successful', () => {
      const resourceType = 'integrations';
      const flowIds = null;

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
        .put(actions.flowMetrics.received(resourceType, resourceId, []))
        .run();
    });
    test('should dispatch failed action, if the api call failed', () => {
      const resourceType = 'integrations';
      const flowIds = ['dummyId'];
      const e = new Error();

      return expectSaga(requestFlowMetrics, {
        resourceType,
        resourceId,
        filters,
      })
        .provide([
          [select(selectors.ownerUserId), userId],
          [select(selectors.integrationEnabledFlowIds, resourceId), flowIds],
          [matchers.call.fn(requestMetric), throwError(e)],
        ])
        .call.fn(requestMetric)
        .put(actions.flowMetrics.failed(e))
        .run();
    });
  });
});

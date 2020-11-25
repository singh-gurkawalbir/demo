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
    const query = 'dummyQuery';
    const csvResponse = 'dummyResponse';

    test('should parse the response on successful api call', () => expectSaga(requestMetric, { query })
      .provide([[matchers.call.fn(apiCallWithRetry), csvResponse]])
      .call.fn(apiCallWithRetry)
      .run());

    test('should return empty array, if api call fails', () => expectSaga(requestMetric, { query })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError([])]])
      .call.fn(apiCallWithRetry)
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

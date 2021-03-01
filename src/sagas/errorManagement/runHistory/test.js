/* global describe, test */

import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import { requestRunHistory } from '.';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import getRequestOptions from '../../../utils/requestOptions';

const flowId = 'flow-123';

const flow = {
  _id: flowId,
  _integrationId: 'integration-123',
  pageGenerators: [],
  pageProcessors: [],
};

const sampleHistory = [
  {type: 'flow', _exportId: 'id1', _flowId: flowId, status: 'completed'},
  {type: 'flow', _exportId: 'id2', _flowId: flowId, status: 'failed'},
  {type: 'flow', _exportId: 'id2', _flowId: flowId, status: 'cancelled'},
];

describe('requestRunHistory saga test cases', () => {
  test('should have updated url with request params if there are filters and make api request to get runHistory', () => {
    const filters = {
      range: {
        startDate: new Date(),
        endDate: new Date(),
      },
    };
    const { path, opts } = getRequestOptions(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, {
      flowId,
      integrationId: 'integration-123',
      filters,
    });

    return expectSaga(requestRunHistory, { flowId })
      .provide([
        [select(selectors.filter, FILTER_KEYS.RUN_HISTORY), filters],
        [select(selectors.resource, 'flows', flowId), flow],
        [call(apiCallWithRetry, {
          path,
          opts,
          hidden: true,
        }), sampleHistory],
      ])
      .call(apiCallWithRetry, {
        path,
        opts,
        hidden: true,
      })
      .put(
        actions.errorManager.runHistory.received({ flowId, runHistory: sampleHistory })
      )
      .run();
  });
  test('should make api request without filters and dispatch received action with response', () => {
    const { path, opts } = getRequestOptions(actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, {
      flowId,
      integrationId: 'integration-123',
    });

    return expectSaga(requestRunHistory, { flowId })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [call(apiCallWithRetry, {
          path,
          opts,
          hidden: true,
        }), sampleHistory],
      ])
      .call(apiCallWithRetry, {
        path,
        opts,
        hidden: true,
      })
      .put(
        actions.errorManager.runHistory.received({ flowId, runHistory: sampleHistory })
      )
      .run();
  });
  test('should do nothing if the api throws error', () => {
    const error = { code: 422, message: 'error in retrieving history ' };

    return expectSaga(requestRunHistory, { flowId })
      .provide([
        [select(selectors.resource, 'flows', flowId), flow],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .not.put(
        actions.errorManager.runHistory.received({ flowId, runHistory: sampleHistory })
      )
      .run();
  });
});

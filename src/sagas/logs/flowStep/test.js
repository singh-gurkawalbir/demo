/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable jest/valid-expect-in-promise */

import { select, call, fork, delay, take, cancel, race } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../..';
import actionTypes from '../../../actions/types';
import {
  fetchNewLogs,
  pollForLatestLogs,
  startPollingForRequestLogs,
  putReceivedAction,
  retryToFetchRequests,
  requestLogs,
  requestLogDetails,
  toggleDebug,
  removeLogs,
} from './index';
import { FILTER_KEY } from '../../../utils/flowStepLogs';
import { pollApiRequests } from '../../app';
import { APIException } from '../../api/requestInterceptors/utils';

const flowId = 'flow-123';
const resourceId = 'exp-123';

function get1000Logs() {
  const logs = [{key: 'key1', others: {}}];

  for (let i = 0; i < 1001; i += 1) {
    logs.push({key: 'key1', others: {}});
  }

  return logs;
}

describe('Flow step logs sagas', () => {
  describe('fetchNewLogs saga', () => {
    test('should make api call with time_gt equal to passed arg', () => {
      const timeGt = 123456;

      expectSaga(fetchNewLogs, { flowId, resourceId, timeGt})
        .run()
        .then(result => {
          const { effects } = result;
          const options = {
            path: expect.stringContaining(`time_gt=${timeGt}`),
            opts: {
              method: 'GET',
            } };

          expect(effects.call[0]).toEqual(call(apiCallWithRetry, options));
        });
    });
    test('should dispatch stop poll action if API returned a response', () => {
      const response = {
        requests: [
          {
            key: 'key1',
            time: 1615807924879,
            method: 'GET',
            statusCode: '200',
          },
        ],
      };

      expectSaga(fetchNewLogs, { flowId, resourceId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .put(
          actions.logs.flowStep.stopLogsPoll(
            resourceId,
            true,
          )
        )
        .run();
    });
    test('should do nothing in case of error', () => expectSaga(fetchNewLogs, { flowId, resourceId})
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .not.put(
        actions.logs.flowStep.stopLogsPoll(
          resourceId,
          true,
        )
      )
      .returns(undefined)
      .run());
  });

  describe('pollForLatestLogs saga', () => {
    test('should call fetchNewLogs with timeGt as passed in the args', () => expectSaga(pollForLatestLogs, { flowId, resourceId, timeGt: 1234 })
      .silentRun()
      .then(result => {
        const { effects } = result;

        expect(effects.call[0]).toEqual(call(fetchNewLogs, { flowId, resourceId, timeGt: 1234 }));
      }));
    test('should make pollApiRequests call without abort if stop action is not triggered', () => {
      const saga = pollForLatestLogs({ flowId, resourceId });
      const raceBetweenApiCallAndStop = race({
        pollApiRequests: call(pollApiRequests, {pollSaga: fetchNewLogs, pollSagaArgs: { flowId, resourceId }, disableSlowPolling: true, duration: 15000}),
        abortPoll: take(actionTypes.APP.POLLING.STOP),
      });

      expect(saga.next().value).toEqual(
        call(fetchNewLogs, { flowId, resourceId })
      );
      expect(saga.next().value).toEqual(
        delay(15000)
      );
      expect(JSON.stringify(saga.next().value)).toEqual(
        JSON.stringify(raceBetweenApiCallAndStop)
      );
    });
    test('should be able to race between pollApiRequests and stop action and abort api call', () => {
      const saga = pollForLatestLogs({ flowId, resourceId });
      const response = {abortPoll: true};
      const raceBetweenApiCallAndStop = race({
        pollApiRequests: call(pollApiRequests, {pollSaga: fetchNewLogs, pollSagaArgs: { flowId, resourceId }, disableSlowPolling: true, duration: 15000}),
        abortPoll: take(actionTypes.APP.POLLING.STOP),
      });

      expect(saga.next().value).toEqual(
        call(fetchNewLogs, { flowId, resourceId })
      );
      expect(saga.next().value).toEqual(
        delay(15000)
      );
      expect(JSON.stringify(saga.next().value)).toEqual(
        JSON.stringify(raceBetweenApiCallAndStop)
      );
      const pollingLastStoppedAt = Date.now();

      expect(saga.next(response).value).toEqual(
        take(actionTypes.APP.POLLING.RESUME)
      );
      expect(saga.next(response).value).toEqual(
        call(pollForLatestLogs, { flowId, resourceId, timeGt: pollingLastStoppedAt })
      );
    });
    test.todo('should call pollForLatestLogs if poll resume action is dispatch with last stop time');
  });

  describe('startPollingForRequestLogs saga', () => {
    test('should fork pollForLatestLogs, waits for applicable action and then cancels pollForLatestLogs', () => {
      const mockTask = createMockTask();

      const saga = startPollingForRequestLogs({flowId, resourceId});

      saga.next();

      expect(saga.next([{time: 1234}]).value).toEqual(fork(pollForLatestLogs, {flowId, resourceId, timeGt: 1234}));

      expect(saga.next(mockTask).value).toEqual(
        take([
          actionTypes.LOGS.FLOWSTEP.DEBUG.STOP,
          actionTypes.LOGS.FLOWSTEP.STOP_POLL,
          actionTypes.LOGS.FLOWSTEP.CLEAR,
        ])
      );
      expect(saga.next({type: actionTypes.LOGS.FLOWSTEP.CLEAR}).value).toEqual(cancel(mockTask));
      expect(saga.next().done).toBe(true);
    });
    test('should call fetchNewLogs if the cancelled action type is of stop debug', () => {
      const mockTask = createMockTask();

      const saga = startPollingForRequestLogs({flowId, resourceId});

      saga.next();

      expect(saga.next([{time: 1234}]).value).toEqual(fork(pollForLatestLogs, {flowId, resourceId, timeGt: 1234}));

      expect(saga.next(mockTask).value).toEqual(
        take([
          actionTypes.LOGS.FLOWSTEP.DEBUG.STOP,
          actionTypes.LOGS.FLOWSTEP.STOP_POLL,
          actionTypes.LOGS.FLOWSTEP.CLEAR,
        ])
      );
      expect(saga.next({type: actionTypes.LOGS.FLOWSTEP.DEBUG.STOP}).value).toEqual(cancel(mockTask));
      expect(saga.next().value).toEqual(call(fetchNewLogs, {flowId, resourceId}));
      expect(saga.next().done).toBe(true);
    });
  });

  describe('retryToFetchRequests saga', () => {
    test('should return empty object in case of error', () => expectSaga(retryToFetchRequests, { fetchRequestsPath: '/somepath' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .returns({})
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and exit from saga if there is no nextPageURL', () => expectSaga(retryToFetchRequests, {fetchRequestsPath: '/somepath', resourceId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          requests: [{key: 'key1', others: {}}],
        }],
      ])
      .put(
        actions.logs.flowStep.setFetchStatus(
          resourceId,
          'completed'
        )
      )
      .call(putReceivedAction, {resourceId, requests: [{key: 'key1', others: {}}], loadMore: true})
      .not.call.fn(retryToFetchRequests)
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and exit from saga if total logs count is more than 1000', () => expectSaga(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/somepath', resourceId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          requests: get1000Logs(),
          nextPageURL: '/nexturl1',
        }],
      ])
      .put(
        actions.logs.flowStep.setFetchStatus(
          resourceId,
          'paused'
        )
      )
      .call(putReceivedAction, {resourceId, requests: get1000Logs(), nextPageURL: '/nexturl1', loadMore: false})
      .not.call.fn(retryToFetchRequests)
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and continue to retryToFetchRequests if total logs count is less than 1000', () => expectSaga(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/somepath', resourceId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          requests: [],
          nextPageURL: '/nexturl1',
        }],
        [call(apiCallWithRetry, {
          path: '/nexturl1',
        }), {
          requests: [],
        }],
      ])
      .put(
        actions.logs.flowStep.setFetchStatus(
          resourceId,
          'inProgress'
        )
      )
      .call(putReceivedAction, {resourceId, nextPageURL: '/nexturl1', loadMore: false, requests: []})
      .call(retryToFetchRequests, {count: 0, fetchRequestsPath: '/nexturl1', loadMore: undefined, resourceId })
      .run());
  });

  describe('requestLogs saga', () => {
    test('should call retryToFetchRequests saga', () => expectSaga(requestLogs, { flowId, resourceId })
      .provide([
        [select(selectors.flowStepLogs, resourceId), {nextPageURL: '/nexturl1'}],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), {}],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/flows/flow-123/exp-123/requests', loadMore: undefined, resourceId})
      .not.call.fn(startPollingForRequestLogs)
      .run());
    test('should call startPollingForRequestLogs if debugOn is set and hasNewLogs is false', () => expectSaga(requestLogs, { flowId, resourceId })
      .provide([
        [select(selectors.flowStepLogs, resourceId), {debugOn: true, nextPageURL: '/nexturl1'}],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), {}],
        [matchers.call.fn(startPollingForRequestLogs), undefined],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/flows/flow-123/exp-123/requests', loadMore: undefined, resourceId})
      .call(startPollingForRequestLogs, {flowId, resourceId})
      .run());
    test('should not call startPollingForRequestLogs if hasNewLogs is true and loadMore is true', () => expectSaga(requestLogs, { flowId, resourceId, loadMore: true })
      .provide([
        [select(selectors.flowStepLogs, resourceId), {debugOn: true, hasNewLogs: true, nextPageURL: '/nexturl1'}],
        [select(selectors.hasNewLogs, resourceId), true],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
        [matchers.call.fn(startPollingForRequestLogs), undefined],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/nexturl1', loadMore: true, resourceId})
      .not.call.fn(startPollingForRequestLogs)
      .run());
    test('should continue poll and call startPollingForRequestLogs if hasNewLogs was true but logs received action is dispatched with loadMore as false', () => expectSaga(requestLogs, { flowId, resourceId })
      .provide([
        [select(selectors.flowStepLogs, resourceId), {debugOn: true, nextPageURL: '/nexturl1', hasNewLogs: true}],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), {}],
        [matchers.call.fn(startPollingForRequestLogs), undefined],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/flows/flow-123/exp-123/requests', loadMore: undefined, resourceId})
      .call(startPollingForRequestLogs, {flowId, resourceId})
      .run());
  });

  describe('requestLogDetails saga', () => {
    const logKey = '123';

    test('should do nothing and return if log details already exist', () => expectSaga(requestLogDetails, { flowId, resourceId, logKey })
      .provide([
        [select(selectors.logDetails, resourceId, logKey), {key: logKey}],
      ])
      .not.call.fn(apiCallWithRetry)
      .returns(undefined)
      .run());
    test('should call apiCallWithRetry and dispatch log received action if log details do not exist', () => {
      const logDetails = { key: '123',
        id: 'a27751bdc2e143cb94988b39ea8aede9' };

      expectSaga(requestLogDetails, { flowId, resourceId, logKey })
        .provide([
          [select(selectors.logDetails, resourceId, logKey), {}],
          [matchers.call.fn(apiCallWithRetry), logDetails],
        ])
        .call(apiCallWithRetry, { path: `/flows/${flowId}/${resourceId}/requests/${logKey}` })
        .put(
          actions.logs.flowStep.receivedLogDetails(
            resourceId,
            logKey,
            logDetails
          )
        )
        .run();
    });
    test('should not dispatch received action in case of error', () => expectSaga(requestLogDetails, { flowId, resourceId, logKey })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .not.put(
        actions.logs.flowStep.receivedLogDetails(
          resourceId,
          logKey,
          {}
        )
      )
      .returns(undefined)
      .run());
  });

  describe('toggleDebug saga', () => {
    test('should dispatch resource patch action with the debugUntil patch set', () => {
      const minutes = '30';

      expectSaga(toggleDebug, { flowId, resourceId, minutes })
        .provide([
          [select(selectors.isDebugEnabled, resourceId), false],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          const patchSet = [
            {
              op: minutes !== '0' ? 'replace' : 'remove',
              path: '/debugUntil',
              value: expect.any(String),
            },
          ];

          expect(effects.put[0]).toHaveProperty('payload.action.patchSet', patchSet);
          expect(effects.call).toBeUndefined();
        });
    });
    test('should call startPollingForRequestLogs if debugOn is true and hasNewLogs is false', () => {
      const minutes = '30';

      expectSaga(toggleDebug, { flowId, resourceId, minutes })
        .provide([
          [select(selectors.isDebugEnabled, resourceId), true],
          [matchers.call.fn(startPollingForRequestLogs), undefined],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          const patchSet = [
            {
              op: minutes !== '0' ? 'replace' : 'remove',
              path: '/debugUntil',
              value: expect.any(String),
            },
          ];

          expect(effects.put[0]).toHaveProperty('payload.action.patchSet', patchSet);
          expect(effects.call[0]).toEqual(call(startPollingForRequestLogs, {flowId, resourceId}));
        });
    });
    test('should not call startPollingForRequestLogs if hasNewLogs is true', () => {
      const minutes = '30';

      expectSaga(toggleDebug, { flowId, resourceId, minutes })
        .provide([
          [select(selectors.isDebugEnabled, resourceId), true],
          [select(selectors.hasNewLogs, resourceId), true],
          [matchers.call.fn(startPollingForRequestLogs), undefined],
        ])
        .run()
        .then(result => {
          const { effects } = result;

          const patchSet = [
            {
              op: minutes !== '0' ? 'replace' : 'remove',
              path: '/debugUntil',
              value: expect.any(String),
            },
          ];

          expect(effects.put[0]).toHaveProperty('payload.action.patchSet', patchSet);
          expect(effects.call).toBeUndefined();
        });
    });
  });

  describe('removeLogs saga', () => {
    test('should do nothing and return if there are no logs to remove', () => {
      const logsToRemove = [];

      expectSaga(removeLogs, { flowId, resourceId, logsToRemove })
        .not.call.fn(apiCallWithRetry)
        .returns(undefined)
        .run();
    });
    test('should call apiCallWithRetry and dispatch log deleted action with the first log from response', () => {
      const logsToRemove = ['key1'];

      expectSaga(removeLogs, { flowId, resourceId, logsToRemove })
        .provide([
          [matchers.call.fn(apiCallWithRetry), {deleted: ['key1']}],
        ])
        .call(apiCallWithRetry, { path: `/flows/${flowId}/${resourceId}/requests`,
          opts: {
            method: 'DELETE',
            body: {
              keys: logsToRemove,
            },
          } })
        .put(actions.logs.flowStep.logDeleted(resourceId, 'key1'))
        .run();
    });
    test('should dispatch failed action if there are errors in the response', () => {
      const logsToRemove = ['key1'];

      expectSaga(removeLogs, { flowId, resourceId, logsToRemove })
        .provide([
          [matchers.call.fn(apiCallWithRetry), {deleted: [], errors: [{key: 'key1', error: 'NoSuchKey'}]}],
        ])
        .call(apiCallWithRetry, { path: `/flows/${flowId}/${resourceId}/requests`,
          opts: {
            method: 'DELETE',
            body: {
              keys: logsToRemove,
            },
          } })
        .put(actions.logs.flowStep.logDeleted(resourceId, undefined))
        .put(actions.logs.flowStep.failed(resourceId, {key: 'key1', error: 'NoSuchKey'}))
        .run();
    });
  });
});

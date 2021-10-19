/* global describe, test, expect */
import { select, call, fork, delay, take, cancel } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../..';
import { APIException } from '../../api';
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
import { FILTER_KEY } from '../../../utils/listenerLogs';
import { pollApiRequests } from '../../app';

const flowId = 'flow-123';
const exportId = 'exp-123';

function get1000Logs() {
  const logs = [{key: 'key1', others: {}}];

  for (let i = 0; i < 1001; i += 1) {
    logs.push({key: 'key1', others: {}});
  }

  return logs;
}

describe('Listener logs sagas', () => {
  describe('fetchNewLogs saga', () => {
    test('should make api call with time_gt equal to passed arg', () => {
      const timeGt = 123456;

      return expectSaga(fetchNewLogs, { flowId, exportId, timeGt})
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

      return expectSaga(fetchNewLogs, { flowId, exportId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .put(
          actions.logs.listener.stopLogsPoll(
            exportId,
            true,
          )
        )
        .run();
    });
    test('should do nothing in case of error', () => expectSaga(fetchNewLogs, { flowId, exportId})
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .not.put(
        actions.logs.listener.stopLogsPoll(
          exportId,
          true,
        )
      )
      .returns(undefined)
      .run());
  });

  describe('pollForLatestLogs saga', () => {
    test('should call fetchNewLogs with timeGt as latest log time for the first time', () => expectSaga(pollForLatestLogs, { flowId, exportId })
      .provide([
        [select(selectors.logsSummary, exportId), [{time: 45678}, {time: 45670}]],
      ])
      .silentRun()
      .then(result => {
        const { effects } = result;

        expect(effects.call[0]).toEqual(call(fetchNewLogs, { flowId, exportId, timeGt: 45678 }));
      }));

    test('should call fetchNewLogs within pollApiRequests with a 15 second polling duration', () => {
      const saga = pollForLatestLogs({ flowId, exportId });

      saga.next();
      expect(saga.next([{time: ''}]).value).toEqual(call(fetchNewLogs, { flowId, exportId, timeGt: '' }));
      expect(saga.next().value).toEqual(delay(15000));
      expect(saga.next().value).toEqual(call(pollApiRequests, {pollSaga: fetchNewLogs, pollSagaArgs: { flowId, exportId }, duration: 15000}));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('startPollingForRequestLogs saga', () => {
    test('should fork pollForLatestLogs, waits for applicable action and then cancels pollForLatestLogs', () => {
      const mockTask = createMockTask();

      const saga = startPollingForRequestLogs({flowId, exportId});

      expect(saga.next().value).toEqual(fork(pollForLatestLogs, {flowId, exportId}));

      expect(saga.next(mockTask).value).toEqual(
        take([
          actionTypes.LOGS.LISTENER.DEBUG.STOP,
          actionTypes.LOGS.LISTENER.STOP_POLL,
          actionTypes.LOGS.LISTENER.CLEAR,
        ])
      );
      expect(saga.next({type: actionTypes.LOGS.LISTENER.CLEAR}).value).toEqual(cancel(mockTask));
      expect(saga.next().done).toEqual(true);
    });
    test('should call fetchNewLogs if the cancelled action type is of stop debug', () => {
      const mockTask = createMockTask();

      const saga = startPollingForRequestLogs({flowId, exportId});

      expect(saga.next().value).toEqual(fork(pollForLatestLogs, {flowId, exportId}));

      expect(saga.next(mockTask).value).toEqual(
        take([
          actionTypes.LOGS.LISTENER.DEBUG.STOP,
          actionTypes.LOGS.LISTENER.STOP_POLL,
          actionTypes.LOGS.LISTENER.CLEAR,
        ])
      );
      expect(saga.next({type: actionTypes.LOGS.LISTENER.DEBUG.STOP}).value).toEqual(cancel(mockTask));
      expect(saga.next().value).toEqual(call(fetchNewLogs, {flowId, exportId}));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('retryToFetchRequests saga', () => {
    test('should return empty object in case of error', () => expectSaga(retryToFetchRequests, { fetchRequestsPath: '/somepath' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
          opts: {
            method: 'GET',
          },
        }), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .returns({})
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and exit from saga if there is no nextPageURL', () => expectSaga(retryToFetchRequests, {fetchRequestsPath: '/somepath', exportId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          requests: [{key: 'key1', others: {}}],
        }],
      ])
      .put(
        actions.logs.listener.setFetchStatus(
          exportId,
          'completed'
        )
      )
      .call(putReceivedAction, {exportId, requests: [{key: 'key1', others: {}}], loadMore: true})
      .not.call.fn(retryToFetchRequests)
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and exit from saga if total logs count is more than 1000', () => expectSaga(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/somepath', exportId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          requests: get1000Logs(),
          nextPageURL: '/nexturl1',
        }],
      ])
      .put(
        actions.logs.listener.setFetchStatus(
          exportId,
          'paused'
        )
      )
      .call(putReceivedAction, {exportId, requests: get1000Logs(), nextPageURL: '/nexturl1', loadMore: false})
      .not.call.fn(retryToFetchRequests)
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and continue to retryToFetchRequests if total logs count is less than 1000', () => expectSaga(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/somepath', exportId})
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
        actions.logs.listener.setFetchStatus(
          exportId,
          'inProgress'
        )
      )
      .call(putReceivedAction, {exportId, nextPageURL: '/nexturl1', loadMore: false, requests: []})
      .call(retryToFetchRequests, {count: 0, fetchRequestsPath: '/nexturl1', loadMore: undefined, exportId })
      .run());
  });

  describe('requestLogs saga', () => {
    test('should call retryToFetchRequests saga', () => expectSaga(requestLogs, { flowId, exportId })
      .provide([
        [select(selectors.listenerLogs, exportId), {nextPageURL: '/nexturl1'}],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), {}],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/flows/flow-123/exp-123/requests', loadMore: undefined, exportId})
      .not.call.fn(startPollingForRequestLogs)
      .run());
    test('should call startPollingForRequestLogs if debugOn is set and hasNewLogs is false', () => expectSaga(requestLogs, { flowId, exportId })
      .provide([
        [select(selectors.listenerLogs, exportId), {debugOn: true, nextPageURL: '/nexturl1'}],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), {}],
        [matchers.call.fn(startPollingForRequestLogs), undefined],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/flows/flow-123/exp-123/requests', loadMore: undefined, exportId})
      .call(startPollingForRequestLogs, {flowId, exportId})
      .run());
    test('should not call startPollingForRequestLogs if hasNewLogs is true and loadMore is true', () => expectSaga(requestLogs, { flowId, exportId, loadMore: true })
      .provide([
        [select(selectors.listenerLogs, exportId), {debugOn: true, hasNewLogs: true, nextPageURL: '/nexturl1'}],
        [select(selectors.hasNewLogs, exportId), true],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
        [matchers.call.fn(startPollingForRequestLogs), undefined],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/nexturl1', loadMore: true, exportId})
      .not.call.fn(startPollingForRequestLogs)
      .run());
    test('should continue poll and call startPollingForRequestLogs if hasNewLogs was true but logs received action is dispatched with loadMore as false', () => expectSaga(requestLogs, { flowId, exportId })
      .provide([
        [select(selectors.listenerLogs, exportId), {debugOn: true, nextPageURL: '/nexturl1', hasNewLogs: true}],
        [select(selectors.filter, FILTER_KEY), {time: {}}],
        [matchers.call.fn(apiCallWithRetry), {}],
        [matchers.call.fn(startPollingForRequestLogs), undefined],
      ])
      .call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: '/flows/flow-123/exp-123/requests', loadMore: undefined, exportId})
      .call(startPollingForRequestLogs, {flowId, exportId})
      .run());
  });

  describe('requestLogDetails saga', () => {
    const logKey = '123';

    test('should do nothing and return if log details already exist', () => expectSaga(requestLogDetails, { flowId, exportId, logKey })
      .provide([
        [select(selectors.logDetails, exportId, logKey), {key: logKey}],
      ])
      .not.call.fn(apiCallWithRetry)
      .returns(undefined)
      .run());
    test('should call apiCallWithRetry and dispatch log received action if log details do not exist', () => {
      const logDetails = { key: '123',
        id: 'a27751bdc2e143cb94988b39ea8aede9' };

      return expectSaga(requestLogDetails, { flowId, exportId, logKey })
        .provide([
          [select(selectors.logDetails, exportId, logKey), {}],
          [matchers.call.fn(apiCallWithRetry), logDetails],
        ])
        .call(apiCallWithRetry, { path: `/flows/${flowId}/${exportId}/requests/${logKey}` })
        .put(
          actions.logs.listener.receivedLogDetails(
            exportId,
            logKey,
            logDetails
          )
        )
        .run();
    });
    test('should not dispatch received action in case of error', () => expectSaga(requestLogDetails, { flowId, exportId, logKey })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .not.put(
        actions.logs.listener.receivedLogDetails(
          exportId,
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

      return expectSaga(toggleDebug, { flowId, exportId, minutes })
        .provide([
          [select(selectors.isDebugEnabled, exportId), false],
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

      return expectSaga(toggleDebug, { flowId, exportId, minutes })
        .provide([
          [select(selectors.isDebugEnabled, exportId), true],
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
          expect(effects.call[0]).toEqual(call(startPollingForRequestLogs, {flowId, exportId}));
        });
    });
    test('should not call startPollingForRequestLogs if hasNewLogs is true', () => {
      const minutes = '30';

      return expectSaga(toggleDebug, { flowId, exportId, minutes })
        .provide([
          [select(selectors.isDebugEnabled, exportId), true],
          [select(selectors.hasNewLogs, exportId), true],
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

      return expectSaga(removeLogs, { flowId, exportId, logsToRemove })
        .not.call.fn(apiCallWithRetry)
        .returns(undefined)
        .run();
    });
    test('should call apiCallWithRetry and dispatch log deleted action with the first log from response', () => {
      const logsToRemove = ['key1'];

      return expectSaga(removeLogs, { flowId, exportId, logsToRemove })
        .provide([
          [matchers.call.fn(apiCallWithRetry), {deleted: ['key1']}],
        ])
        .call(apiCallWithRetry, { path: `/flows/${flowId}/${exportId}/requests`,
          opts: {
            method: 'DELETE',
            body: {
              keys: logsToRemove,
            },
          } })
        .put(actions.logs.listener.logDeleted(exportId, 'key1'))
        .run();
    });
    test('should dispatch failed action if there are errors in the response', () => {
      const logsToRemove = ['key1'];

      return expectSaga(removeLogs, { flowId, exportId, logsToRemove })
        .provide([
          [matchers.call.fn(apiCallWithRetry), {deleted: [], errors: [{key: 'key1', error: 'NoSuchKey'}]}],
        ])
        .call(apiCallWithRetry, { path: `/flows/${flowId}/${exportId}/requests`,
          opts: {
            method: 'DELETE',
            body: {
              keys: logsToRemove,
            },
          } })
        .put(actions.logs.listener.logDeleted(exportId, undefined))
        .put(actions.logs.listener.failed(exportId, {key: 'key1', error: 'NoSuchKey'}))
        .run();
    });
  });
});

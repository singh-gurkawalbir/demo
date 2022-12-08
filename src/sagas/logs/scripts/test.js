/* global describe, test, jest */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select, take } from 'redux-saga/effects';
import moment from 'moment';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { requestReferences } from '../../resources';
import actionTypes from '../../../actions/types';
import {
  putReceivedAction,
  getScriptDependencies,
  retryToFetchLogs,
  requestScriptLogs,
  startDebug,
  requestLogsWithCancel,
  requestAllLogs,
  purgeLogs,
} from '.';
import { apiCallWithRetry } from '../..';
import { APIException } from '../../api/requestInterceptors/utils';

function get1000Logs() {
  const logs = [{key: 'key1', others: {}}];

  for (let i = 0; i < 1001; i += 1) {
    logs.push({key: 'key1', others: {}});
  }

  return logs;
}

describe('Scripts logs sagas', () => {
  describe('getScriptDependencies saga', () => {
    test('should dispatch setDependency action after fetching depedencies', () => {
      const scriptId = 's1';

      return expectSaga(getScriptDependencies, { scriptId })
        .provide([
          [call(requestReferences, {
            resourceType: 'scripts',
            id: scriptId,
          }), {
            exports: [
              {id: 'e1', name: 'ne1'},
              {id: 'e2', name: 'ne2'},
            ],
            imports: [
              {id: 'i1', name: 'ni1'},
              {id: 'i2', name: 'ni2'},
            ],
            flows: [
              {id: 'f1', name: 'nf1'},
              {id: 'f2', name: 'nf2'},
            ],
          }],
        ]).put(actions.logs.scripts.setDependency({
          scriptId,
          flowId: '',
          resourceReferences: [
            {id: 'e1', name: 'ne1', type: 'export'},
            {id: 'e2', name: 'ne2', type: 'export'},
            {id: 'i1', name: 'ni1', type: 'import'},
            {id: 'i2', name: 'ni2', type: 'import'},
            {id: 'f1', name: 'nf1', type: 'flow'},
            {id: 'f2', name: 'nf2', type: 'flow'},
          ],
        }))
        .run();
    });

    test('should dispatch setDependency action after fetching depedency for particular flowId', () => {
      const flowId = 'f1';
      const scriptId = 's1';

      return expectSaga(getScriptDependencies, { flowId, scriptId })
        .provide([
          [call(requestReferences, {
            resourceType: 'scripts',
            id: scriptId,
          }), {
            exports: [
              {id: 'e1', name: 'ne1'},
              {id: 'e2', name: 'ne2'},
            ],
            imports: [
              {id: 'i1', name: 'ni1'},
              {id: 'i2', name: 'ni2'},
            ],
            flows: [
              {id: 'f1', name: 'nf1'},
              {id: 'f2', name: 'nf2'},
            ],
          }],
          [call(requestReferences, {
            resourceType: 'scripts',
            id: scriptId,
          }), {
            exports: [
              {id: 'e1', name: 'ne1'},
              {id: 'e2', name: 'ne2'},
              {id: 'e3', name: 'ne3'},
            ],
            imports: [
              {id: 'i1', name: 'ni1'},
              {id: 'i2', name: 'ni2'},
            ],
            flows: [
              {id: 'f1', name: 'nf1'},
              {id: 'f2', name: 'nf2'},
            ],
          }],
          [select(selectors.resource, 'flows', flowId),
            {
              pageGenerators: [
                {_exportId: 'e1', type: 'export'},
              ],
              pageProcessors: [
                {_exportId: 'e2', type: 'export'},
                {_importId: 'i2', type: 'import'},

              ],
            },
          ],
        ]).put(actions.logs.scripts.setDependency({
          scriptId,
          flowId,
          resourceReferences: [
            {id: 'e1', name: 'ne1', type: 'export'},
            {id: 'e2', name: 'ne2', type: 'export'},
            {id: 'i2', name: 'ni2', type: 'import'},
          ],
        }))
        .run();
    });
    test('should return if request references returns error', () => expectSaga(getScriptDependencies, {scriptId: 1})
      .provide([
        [call(requestReferences, {resourceType: 'scripts', id: 1 }), throwError({error: 123})],
      ])
      .run()
    );
  });

  describe('retryToFetchLogs saga', () => {
    const scriptId = 's1';
    const flowId = 'f1';

    test('should return error message in case of error', () => expectSaga(retryToFetchLogs, { fetchLogsPath: '/somepath' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), throwError(new APIException({
          status: 422,
          message: '{"message":"Invalid or Missing Field: time_lte", "code":"invalid_or_missing_field"}',
        }))],
      ])
      .returns({
        errorMsg: 'Request failed',
      })
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and exit from saga if there is no nextPageURL', () => expectSaga(retryToFetchLogs, {fetchLogsPath: '/somepath', scriptId, flowId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          logs: [{message: 'text', time: '2020-10-10 10:10:10.100', other: 'something'}],
        }],
      ])
      .put(
        actions.logs.scripts.setFetchStatus(
          {scriptId, flowId, fetchStatus: 'completed'}
        )
      )
      .call(putReceivedAction, {scriptId, flowId, logs: [{message: 'text', time: '2020-10-10 10:10:10.100', other: 'something'}]})
      .not.call.fn(retryToFetchLogs)
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and exit from saga if total logs count is more than 1000', () => expectSaga(retryToFetchLogs, {fetchLogsPath: '/somepath', scriptId, flowId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          logs: get1000Logs(),
          nextPageURL: '/nexturl1',
        }],
      ])
      .put(
        actions.logs.scripts.setFetchStatus(
          {scriptId, flowId, fetchStatus: 'paused'}
        )
      )
      .call(putReceivedAction, {scriptId, flowId, logs: get1000Logs(), nextPageURL: '/nexturl1'})
      .not.call.fn(retryToFetchLogs)
      .run());
    test('should dispatch setFetchStatus action and call putReceivedAction and continue to retryToFetchLogs if total logs count is less than 1000', () => expectSaga(retryToFetchLogs, {fetchLogsPath: '/somepath', scriptId, flowId})
      .provide([
        [call(apiCallWithRetry, {
          path: '/somepath',
        }), {
          logs: [],
          nextPageURL: '/nexturl1',
        }],
        [call(apiCallWithRetry, {
          path: '/nexturl1',
        }), {
          logs: [],
        }],
      ])
      .put(
        actions.logs.scripts.setFetchStatus(
          {scriptId, flowId, fetchStatus: 'inProgress'}
        )
      )
      .call(putReceivedAction, {scriptId, flowId, nextPageURL: '/nexturl1', logs: []})
      .call(retryToFetchLogs, {count: 0, fetchLogsPath: '/nexturl1', scriptId, flowId })
      .run());
  });

  describe('requestScriptLogs saga', () => {
    test('should not fetch logs if case logLevel field is changed', () => expectSaga(requestScriptLogs, { field: 'logLevel'})
      .not.call(retryToFetchLogs, {fetchLogsPath: 'something'})
      .run());

    test('should fetch logs and call putReceivedAction on success', () => {
      const scriptId = 's1';
      const flowId = 'f1';

      return expectSaga(requestScriptLogs, { scriptId, flowId, fetchNextPage: true })
        .provide([
          [select(selectors.scriptLog, {
            flowId,
            scriptId,
          }), {
            nextPageURL: '/nextPage1',
          }],
          [call(retryToFetchLogs, {
            scriptId,
            flowId,
            fetchNextPage: true,
            fetchLogsPath: '/nextPage1',
          }), {
            logs: [{message: 'text', time: '2020-10-10 10:10:10.100', other: 'something'}],
            nextPageURL: '/nextPage2',
          }],
        ])
        .call(putReceivedAction, {scriptId, flowId, logs: [{message: 'text', time: '2020-10-10 10:10:10.100', other: 'something'}], nextPageURL: '/nextPage2'})
        .run();
    });
    test('should call getDependency incase of init', () => {
      const scriptId = 's1';
      const flowId = 'f1';

      return expectSaga(requestScriptLogs, { scriptId, flowId, isInit: true })
        .put(actions.logs.scripts.getDependency({
          scriptId,
          flowId,
        }))
        .run();
    });
    test('should trigger SCRIPT_LOGS_FAILED action in case of error while fetching logs', () => {
      const scriptId = 's1';
      const flowId = 'f1';

      return expectSaga(requestScriptLogs, { scriptId, flowId, fetchNextPage: true })
        .provide([
          [select(selectors.scriptLog, {
            flowId,
            scriptId,
          }), {
            nextPageURL: '/nextPage1',
          }],
          [matchers.call.fn(retryToFetchLogs), {errorMsg: 'Request failed'}],
        ]).put(actions.logs.scripts.requestFailed({
          scriptId,
          flowId,
          errorMsg: 'Request failed',
        }))
        .run();
    });
  });
  describe('requestLogsWithCancel saga', () => {
    const params = {name: 123};

    test('should call requestScriptLogs with params', () => {
      expectSaga(requestLogsWithCancel, params)
        .race({
          callAPI: call(requestScriptLogs, params),
          cancelCallAPI: take(action =>
            action.type === actionTypes.LOGS.SCRIPTS.CLEAR ||
          action.type === actionTypes.LOGS.SCRIPTS.PAUSE_FETCH
          ),
        });
    });
  });
  describe('startDebug saga', () => {
    test('should remove debugUntil if debug value = 0', () => {
      const now = new Date();
      const mock = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => now);

      mock.mockReturnValue(now);

      expectSaga(startDebug, { scriptId: 's1', value: '0'})
        .put(actions.resource.patch('scripts', 's1',
          [
            {
              op: 'remove',
              path: '/debugUntil',
              value: moment(new Date()).add('0', 'm').toISOString(),
            },
          ]
        ))
        .run();
      mock.mockRestore();
    });
    test('should set debugUntil correctly', () => {
      const now = new Date();
      const newDebugDate = moment(now).add('30', 'm').toISOString();

      const mock = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => now);

      mock.mockReturnValue(now);

      expectSaga(startDebug, { scriptId: 's1', value: '30'})
        .put(actions.resource.patch('scripts', 's1',
          [
            {
              op: 'replace',
              path: '/debugUntil',
              value: newDebugDate,
            },
          ]
        ))
        .run();
      mock.mockRestore();
    });
  });
  describe('requestAllLogs saga', () => {
    test('should dispatch receivedAllLogs action with isPurgeAvailable as true if api call is successful and response has logs', () => {
      const scriptId = 's1';
      const flowId = 'f1';
      const path = `/scripts/${scriptId}/logs`;
      const opts = { method: 'GET' };
      const response = {
        logs: [
          {message: 'm1', logLevel: 'WARN' },
          {message: 'm2', logLevel: 'DEBUG' },
          {message: 'm3', logLevel: 'DEBUG' },
        ],
      };

      return expectSaga(requestAllLogs, {scriptId, flowId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(apiCallWithRetry, { path, opts })
        .put(actions.logs.scripts.receivedAllLogs({scriptId, flowId, isPurgeAvailable: true}))
        .run();
    });
    test('should dispatch receivedAllLogs action with isPurgeAvailable as false if api call is successful and response has empty logs', () => {
      const scriptId = 's1';
      const flowId = 'f1';
      const path = `/scripts/${scriptId}/logs`;
      const opts = { method: 'GET' };
      const response = {
        logs: [],
      };

      return expectSaga(requestAllLogs, {scriptId, flowId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), response],
        ])
        .call(apiCallWithRetry, { path, opts })
        .put(actions.logs.scripts.receivedAllLogs({scriptId, flowId, isPurgeAvailable: false}))
        .run();
    });
    test('should do nothing if api call fails', () => {
      const scriptId = 's1';
      const flowId = 'f1';
      const path = `/scripts/${scriptId}/logs`;
      const opts = { method: 'GET' };
      const error = new Error();

      return expectSaga(requestAllLogs, {scriptId, flowId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call(apiCallWithRetry, { path, opts })
        .not.put(actions.logs.scripts.receivedAllLogs({scriptId, flowId, isPurgeAvailable: true}))
        .run();
    });
  });
  describe('purgeLogs saga', () => {
    test('should dispatch purge success action if api call is successful', () => {
      const scriptId = 's1';
      const flowId = 'f1';
      const path = `/scripts/${scriptId}/logs`;
      const opts = { method: 'DELETE' };

      return expectSaga(purgeLogs, {scriptId, flowId})
        .provide([
          [matchers.call.fn(apiCallWithRetry)],
        ])
        .call(apiCallWithRetry, { path, opts })
        .put(actions.logs.scripts.purge.success({scriptId, flowId}))
        .run();
    });
    test('should do nothing if api call fails', () => {
      const scriptId = 's1';
      const flowId = 'f1';
      const path = `/scripts/${scriptId}/logs`;
      const opts = { method: 'DELETE' };
      const error = new Error();

      return expectSaga(purgeLogs, {scriptId, flowId})
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call(apiCallWithRetry, { path, opts })
        .not.put(actions.logs.scripts.purge.success({scriptId, flowId}))
        .run();
    });
  });
});

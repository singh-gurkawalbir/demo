/* global describe, test, jest */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import moment from 'moment';
// import { addMinutes } from 'date-fns';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { requestReferences } from '../../resources';
import {
  // fetchScriptLogs,
  getScriptDependencies,
  retryToFetchLogs,
  requestScriptLogs,
  startDebug,
} from '.';
import { apiCallWithRetry } from '../..';

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
  });

  describe('retryToFetchLogs saga', () => {
    test('should retry fetching logs maximum of 4 times if there is a response', () => expectSaga(retryToFetchLogs, { fetchLogsPath: '/somePath' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/somePath',
          opts: {
            method: 'GET',
          },
        }), {
          logs: [],
          nextPageURL: '/nextURL2',
        }],
        [call(apiCallWithRetry, {
          path: '/nextURL2',
          opts: {
            method: 'GET',
          },
        }), {
          logs: [],
          nextPageURL: '/nextURL3',
        }],
        [call(apiCallWithRetry, {
          path: '/nextURL3',
          opts: {
            method: 'GET',
          },
        }), {
          logs: [],
          nextPageURL: '/nextURL4',
        }],
        [call(apiCallWithRetry, {
          path: '/nextURL4',
          opts: {
            method: 'GET',
          },
        }), {
          logs: [],
          nextPageURL: '/nextURL5',
        }],
      ])
      .call(retryToFetchLogs, {retryCount: 1, fetchLogsPath: '/nextURL2'})
      .call(retryToFetchLogs, {retryCount: 2, fetchLogsPath: '/nextURL3'})
      .call(retryToFetchLogs, {retryCount: 3, fetchLogsPath: '/nextURL4'})
      .call(retryToFetchLogs, {retryCount: 4, fetchLogsPath: '/nextURL5'})
      .run());

    test('should stop retying fetching logs if logs are found', () => expectSaga(retryToFetchLogs, { fetchLogsPath: '/somePath' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/somePath',
          opts: {
            method: 'GET',
          },
        }), {
          logs: [],
          nextPageURL: '/nextURL2',
        }],
        [call(apiCallWithRetry, {
          path: '/nextURL2',
          opts: {
            method: 'GET',
          },
        }), {
          logs: [{message: 'xyz', others: {}}],
          nextPageURL: '/nextURL3',
        }],

      ])
      .call(retryToFetchLogs, {retryCount: 1, fetchLogsPath: '/nextURL2'})
      .run());
  });
  describe('requestScriptLogs saga', () => {
    test('should not fetch logs if case logLevel field is changed', () => expectSaga(requestScriptLogs, { field: 'logLevel'})
      .not.call(retryToFetchLogs, {fetchLogsPath: 'something'})
      .run());

    test('should fetch logs and trigger SCRIPT_LOGS_RECEIVED action on success', () => {
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
        ]).put(actions.logs.scripts.received({
          scriptId,
          flowId,
          logs: [
            {message: 'text', time: '2020-10-10T10:10:10.100Z', other: 'something'},
          ],
          nextPageURL: '/nextPage2',
        }))
        .run();
    });
    test('should call getDepedency incase of init', () => {
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
        ]).put(actions.logs.scripts.requestFailed({
          scriptId,
          flowId,
          errorMsg: 'Request failed',
        }))
        .run();
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
});


import reducer, { selectors } from '.';
import actions from '../../../../actions';

const flowId = 'flow-123';
const resourceId = 'exp-123';
const logKey = 'mock-key';
const logDetails = {
  time: 1615807924879,
  request: {
    headers: {
      host: 'api.localhost.io:5000',
      'user-agent': 'insomnia/2021.1.1',
      'content-type': 'application/json',
      authorization: 'Bearer 5309c90cfdfd44699c0632a97e40867e',
      accept: '*/*',
      'content-length': '8',
    },
    body: logKey,
    httpVersion: '1.1',
    method: 'POST',
    url: '/v1/shopify/exports/60486a72e285921bc32283d4/data',
    clientAddress: '::ffff:127.0.0.1',
    size: 16,
  },
  response: {
    statusCode: 401,
    status: 'there',
    body: 'Unauthorized',
  },
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-401-POST',
  id: 'a27751bdc2e143cb94988b39ea8aede9',
};

const logsSummary = [{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-401-POST',
  time: 1615807924879,
  method: 'POST',
  statusCode: '401',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-200-GET',
  time: 1615807924879,
  method: 'GET',
  statusCode: '200',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-201-GET',
  time: 1615807924879,
  method: 'GET',
  statusCode: '201',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-201-PUT',
  time: 1615807924879,
  method: 'PUT',
  statusCode: '201',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-200-POST',
  time: 1615807924879,
  method: 'POST',
  statusCode: '200',
},
];

describe('Flow step logs reducer', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toBe(oldState);
  });

  describe('FLOWSTEP.REQUEST action', () => {
    test('should not throw error if the flow step state does not exist and set status as requested', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.request({flowId, resourceId})
      );
      const expectedState = {
        [resourceId]: {
          logsStatus: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should update existing state with logsStatus as requested status if loadMore is false', () => {
      const initialState = {
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.request({flowId, resourceId})
      );
      const expectedState = {
        [resourceId]: {
          logsStatus: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should update existing state with loadMoreStatus as requested status if loadMore is true', () => {
      const initialState = {
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.request({flowId, resourceId, loadMore: true})
      );
      const expectedState = {
        [resourceId]: {
          logsStatus: 'received',
          loadMoreStatus: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
          error: {key: 123},
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.request({flowId, resourceId})
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.RECEIVED action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.received({resourceId})
      );

      expect(newState).toEqual({});
    });
    test('should correctly replace the state with logs if loadMore is false', () => {
      const initialState = {
        [resourceId]: {
          logsStatus: 'requested',
          logsSummary: [{key: 1}, {key: 2}],
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.flowStep.request({flowId, resourceId})
      );
      const newState = reducer(
        tempState,
        actions.logs.flowStep.received({resourceId, logs: logsSummary, nextPageURL: '/api/url'})
      );
      const expectedState = {
        [resourceId]: {
          logsStatus: 'received',
          loadMoreStatus: 'received',
          hasNewLogs: false,
          nextPageURL: '/api/url',
          logsSummary,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should correctly add the logs to existing logs if loadMore is true', () => {
      const initialState = {
        [resourceId]: {
          logsStatus: 'requested',
          logsSummary: [{key: 1}, {key: 2}],
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.flowStep.request({flowId, resourceId})
      );
      const newState = reducer(
        tempState,
        actions.logs.flowStep.received({resourceId,
          logs: logsSummary,
          nextPageURL: '/api/url',
          loadMore: true})
      );
      const expectedState = {
        [resourceId]: {
          logsStatus: 'received',
          loadMoreStatus: 'received',
          nextPageURL: '/api/url',
          logsSummary: [{key: 1}, {key: 2}, ...logsSummary],
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.received({
          resourceId,
          logs: [],
          nextPageURL: '/api/url'})
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.LOG.REQUEST action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.requestLogDetails(flowId, resourceId)
      );

      expect(newState).toEqual({});
    });
    test('should do nothing if log details already exist', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {}},
          logsStatus: 'received',
          logsSummary: [],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.requestLogDetails(flowId, resourceId, '5642310475121')
      );

      expect(newState).toBe(initialState);
    });
    test('should set log key status as requested', () => {
      const initialState = {
        [resourceId]: {
          logsStatus: 'requested',
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.flowStep.received({
          resourceId,
          logs: logsSummary,
          nextPageURL: '/v1(api)/flows/:_flowId',
          loadMore: true})
      );
      const newState = reducer(
        tempState,
        actions.logs.flowStep.requestLogDetails(flowId, resourceId, '5642310475121')
      );
      const expectedState = {
        [resourceId]: {
          logsDetails: {5642310475121: {status: 'requested'}},
          logsStatus: 'received',
          loadMoreStatus: 'received',
          logsSummary,
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.requestLogDetails(flowId, resourceId, '5642310475121')
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.LOG.RECEIVED action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.receivedLogDetails(resourceId, logKey, logDetails)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the state with log details', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: logKey, time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.flowStep.requestLogDetails(flowId, resourceId, logKey)
      );

      const newState = reducer(
        tempState,
        actions.logs.flowStep.receivedLogDetails(resourceId, logKey, logDetails)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {[logKey]: {
            status: 'received',
            ...logDetails,
          }},
          logsStatus: 'received',
          logsSummary: [{key: logKey, time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.receivedLogDetails(resourceId, logKey, logDetails)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.ACTIVE_LOG action', () => {
    const activeLogKey = '98765';

    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.setActiveLog(resourceId, activeLogKey)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the state with active log key', () => {
      const initialState = {
        [resourceId]: {
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: 123, time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.setActiveLog(resourceId, activeLogKey)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey,
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: 123, time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.setActiveLog(resourceId, activeLogKey)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.LOG.DELETED action', () => {
    const deletedLogKey = '200-POST';

    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.logDeleted(resourceId, deletedLogKey)
      );

      expect(newState).toEqual({});
    });
    test('should not modify the state if deleted log key is not present', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.logDeleted(resourceId, deletedLogKey)
      );

      expect(newState).toBe(initialState);
    });
    test('should modify the state and remove deleted log key from summary and details', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          },
          '200-POST': {
            status: 'received',
            request: {},
            response: {},
          },
          },
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}, {key: '200-POST', time: 3453}, {key: '200-GET', time: 3453}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.logDeleted(resourceId, deletedLogKey)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          },
          },
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}, {key: '200-GET', time: 3453}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should modify the state and remove deleted log key from active key also if it matches deleted key', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '200-POST',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          },
          '200-POST': {
            status: 'received',
            request: {},
            response: {},
          },
          },
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}, {key: '200-POST', time: 3453}, {key: '200-GET', time: 3453}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.logDeleted(resourceId, deletedLogKey)
      );
      const expectedState = {
        [resourceId]: {
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          },
          },
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}, {key: '200-GET', time: 3453}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.logDeleted(resourceId, deletedLogKey)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.DEBUG.START action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.startDebug(flowId, resourceId, '15')
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with debugOn as true', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.startDebug(flowId, resourceId, '15')
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          debugOn: true,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.startDebug(flowId, resourceId, '15')
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.DEBUG.STOP action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.stopDebug(flowId, resourceId)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with debugOn as false', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.stopDebug(flowId, resourceId)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          debugOn: false,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.stopDebug(flowId, resourceId)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.START.POLL action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.startLogsPoll(flowId, resourceId)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with debugOn as true', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.startLogsPoll(flowId, resourceId)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          debugOn: true,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.startLogsPoll(flowId, resourceId)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.STOP_POLL action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.stopLogsPoll(resourceId, true)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with passed hasNewLogs prop', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.stopLogsPoll(resourceId, true)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          hasNewLogs: true,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.stopLogsPoll(resourceId, true)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.FAILED action', () => {
    const error = {key: '200-POST', error: 'NoSuchKey'};

    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.failed(resourceId, error)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the state with the error and change identifier', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.failed(resourceId, error)
      );
      const expectedState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          error: {
            changeIdentifier: 1,
            ...error,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.failed(resourceId, error)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.FETCH_STATUS action', () => {
    test('should exit and not throw error if the flow step state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.flowStep.setFetchStatus(resourceId, 'paused')
      );

      expect(newState).toEqual({});
    });
    test('should update the state with fetch status', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.flowStep.setFetchStatus(resourceId, 'inProgress')
      );

      expect(newState).toHaveProperty('exp-123.fetchStatus', 'inProgress');
    });
    test('should correctly set the currQueryTime equal to nextPageURL time_lte', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}, {key: '56423104751214', time: 1089}],
          nextPageURL: '/api/flows/6059c78dfddc8259d92362d5/6059c79ffddc8259d92362d9/requests?time_gt=3333&time_lte=9898',
        },
      };

      const newState1 = reducer(
        initialState,
        actions.logs.flowStep.setFetchStatus(resourceId, 'inProgress')
      );

      expect(newState1).toHaveProperty('exp-123.currQueryTime', 9898);
    });
    test('should correctly set the currQueryTime as last log time if nextPageURL does not have time_lte', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}, {key: '56423104751214', time: 1089}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const newState2 = reducer(
        initialState,
        actions.logs.flowStep.setFetchStatus(resourceId, 'inProgress')
      );

      expect(newState2).toHaveProperty('exp-123.currQueryTime', 1089);
    });
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.setFetchStatus(resourceId, 'inProgress')
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('FLOWSTEP.CLEAR action', () => {
    test('should clear the flow step reference from the state', () => {
      const initialState = {
        [resourceId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: '123', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
        },
      };

      const tempState = reducer(
        initialState,
        actions.logs.flowStep.receivedLogDetails(resourceId, '123', {})
      );
      const newState = reducer(
        tempState,
        actions.logs.flowStep.clear(resourceId)
      );

      expect(newState).not.toHaveProperty(resourceId);
    });
    test('should not alter any other flow step state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [resourceId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.flowStep.clear(resourceId)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
});

describe('Flow step logs selectors', () => {
  const initialState = {
    [resourceId]: {
      activeLogKey: '5642310475121',
      hasNewLogs: false,
      logsStatus: 'received',
      logsSummary: [{key: logKey, time: 1234}],
      nextPageURL: '/v1(api)/flows/:_flowId',
      error: {key: logKey},
    },
  };
  const tempState = reducer(
    initialState,
    actions.logs.flowStep.requestLogDetails(flowId, resourceId, logKey)
  );

  const newState = reducer(
    tempState,
    actions.logs.flowStep.receivedLogDetails(resourceId, logKey, logDetails)
  );

  describe('flowStepLogs', () => {
    test('should return empty object when no match found', () => {
      expect(selectors.flowStepLogs(undefined, resourceId)).toEqual({});
      expect(selectors.flowStepLogs({}, resourceId)).toEqual({});
      expect(selectors.flowStepLogs({123: {}}, resourceId)).toEqual({});
    });
    test('should return correct flow step state when a match is found', () => {
      const expectedOutput = {
        activeLogKey: '5642310475121',
        hasNewLogs: false,
        logsStatus: 'received',
        logsDetails: {[logKey]: {status: 'received', ...logDetails}},
        logsSummary: [{key: logKey, time: 1234}],
        nextPageURL: '/v1(api)/flows/:_flowId',
        error: {key: logKey},
      };

      expect(selectors.flowStepLogs(newState, resourceId)).toEqual(expectedOutput);
    });
  });
  describe('logsSummary', () => {
    test('should return empty array when no match found or logs are undefined', () => {
      expect(selectors.logsSummary(undefined, resourceId)).toEqual([]);
      expect(selectors.logsSummary({}, resourceId)).toEqual([]);
      expect(selectors.logsSummary({[resourceId]: {logsStatus: 'received'}}, resourceId)).toEqual([]);
    });
    test('should return correct flow step state logs when a match is found', () => {
      const expectedOutput = [{key: logKey, time: 1234}];

      expect(selectors.logsSummary(newState, resourceId)).toEqual(expectedOutput);
    });
  });
  describe('logsStatus', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.logsStatus(undefined, resourceId)).toBeUndefined();
      expect(selectors.logsStatus({}, resourceId)).toBeUndefined();
      expect(selectors.logsStatus({[resourceId]: {}}, resourceId)).toBeUndefined();
    });
    test('should return correct status when a match is found', () => {
      expect(selectors.logsStatus(newState, resourceId)).toBe('received');
    });
  });
  describe('hasNewLogs', () => {
    test('should return false when no match found', () => {
      expect(selectors.hasNewLogs(undefined, resourceId)).toBe(false);
      expect(selectors.hasNewLogs({}, resourceId)).toBe(false);
      expect(selectors.hasNewLogs({[resourceId]: {}}, resourceId)).toBe(false);
    });
    test('should return correct state prop when a match is found', () => {
      expect(selectors.hasNewLogs(newState, resourceId)).toBe(false);
      const finalState = reducer(
        newState,
        actions.logs.flowStep.stopLogsPoll(resourceId, true)
      );

      expect(selectors.hasNewLogs(finalState, resourceId)).toBe(true);
    });
  });
  describe('logDetails', () => {
    test('should return empty object when no match found', () => {
      expect(selectors.logDetails(undefined, resourceId, logKey)).toEqual({});
      expect(selectors.logDetails({}, resourceId, logKey)).toEqual({});
      expect(selectors.logDetails({[resourceId]: {logDetails: {}}}, resourceId, logKey)).toEqual({});
    });
    test('should return correct log details when a match is found', () => {
      const expectedOutput = {status: 'received', ...logDetails};

      expect(selectors.logDetails(newState, resourceId, logKey)).toEqual(expectedOutput);
    });
  });
  describe('isDebugEnabled', () => {
    test('should return false when no match found', () => {
      expect(selectors.isDebugEnabled(undefined, resourceId)).toBe(false);
      expect(selectors.isDebugEnabled({}, resourceId)).toBe(false);
      expect(selectors.isDebugEnabled({[resourceId]: {}}, resourceId)).toBe(false);
    });
    test('should return correct state prop when a match is found', () => {
      const finalState = reducer(
        newState,
        actions.logs.flowStep.startDebug(flowId, resourceId, '15')
      );

      expect(selectors.isDebugEnabled(finalState, resourceId)).toBe(true);
    });
  });
  describe('activeLogKey', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.activeLogKey(undefined, resourceId)).toBeUndefined();
      expect(selectors.activeLogKey({}, resourceId)).toBeUndefined();
      expect(selectors.activeLogKey({[resourceId]: {}}, resourceId)).toBeUndefined();
    });
    test('should return correct active key when a match is found', () => {
      expect(selectors.activeLogKey(newState, resourceId)).toBe('5642310475121');
    });
  });
  describe('flowStepErrorMsg', () => {
    test('should return empty object when no match found', () => {
      expect(selectors.flowStepErrorMsg(undefined, resourceId)).toEqual({});
      expect(selectors.flowStepErrorMsg({}, resourceId)).toEqual({});
      expect(selectors.flowStepErrorMsg({[resourceId]: {}}, resourceId)).toEqual({});
    });
    test('should return correct state error when a match is found', () => {
      const finalState = reducer(
        newState,
        actions.logs.flowStep.failed(resourceId, {key: '200-POST', error: 'NoSuchKey'})
      );

      expect(selectors.flowStepErrorMsg(finalState, resourceId)).toEqual({changeIdentifier: 1, key: '200-POST', error: 'NoSuchKey'});
    });
  });
});

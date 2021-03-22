/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import { getMockRequests, getMockLogDetails } from '../../../../utils/listenerLogs';

const flowId = 'flow-123';
const exportId = 'exp-123';
const logKey = 'mock-key';
const logDetails = getMockLogDetails(logKey);
const logsSummary = getMockRequests();

describe('Listener logs reducer', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toBe(oldState);
  });

  describe('LISTENER.REQUEST action', () => {
    test('should not throw error if the listener state does not exist and set status as requested', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.request(flowId, exportId)
      );
      const expectedState = {
        [exportId]: {
          logsStatus: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should update existing state with requested status and delete any error references', () => {
      const initialState = {
        [exportId]: {
          logsStatus: 'received',
          error: {key: 123},
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.request(flowId, exportId)
      );
      const expectedState = {
        [exportId]: {
          logsStatus: 'requested',
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
        [exportId]: {
          logsStatus: 'received',
          error: {key: 123},
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.request(flowId, exportId)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.RECEIVED action', () => {
    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.received(exportId)
      );

      expect(newState).toEqual({});
    });
    test('should correctly replace the state with logs if loadMore is false', () => {
      const initialState = {
        [exportId]: {
          logsStatus: 'requested',
          logsSummary: [{key: 1}, {key: 2}],
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.listener.request(flowId, exportId)
      );
      const newState = reducer(
        tempState,
        actions.logs.listener.received(exportId, logsSummary, '/api/url')
      );
      const expectedState = {
        [exportId]: {
          logsStatus: 'received',
          hasNewLogs: false,
          nextPageURL: '/api/url',
          logsSummary,
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should correctly add the logs to existing logs if loadMore is true', () => {
      const initialState = {
        [exportId]: {
          logsStatus: 'requested',
          logsSummary: [{key: 1}, {key: 2}],
          error: [{key: 1}],
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.listener.request(flowId, exportId)
      );
      const newState = reducer(
        tempState,
        actions.logs.listener.received(exportId, logsSummary, '/api/url', true)
      );
      const expectedState = {
        [exportId]: {
          logsStatus: 'received',
          hasNewLogs: false,
          nextPageURL: '/api/url',
          logsSummary: [...logsSummary, {key: 1}, {key: 2}],
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.received(exportId, [], '/api/url')
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.LOG.REQUEST action', () => {
    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.requestLogDetails(flowId, exportId)
      );

      expect(newState).toEqual({});
    });
    test('should do nothing if log details already exist', () => {
      const initialState = {
        [exportId]: {
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
        actions.logs.listener.requestLogDetails(flowId, exportId, '5642310475121')
      );

      expect(newState).toBe(initialState);
    });
    test('should set log key status as requested', () => {
      const initialState = {
        [exportId]: {
          logsStatus: 'requested',
          error: {key: 123},
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.listener.received(exportId, logsSummary, '/v1(api)/flows/:_flowId', true)
      );
      const newState = reducer(
        tempState,
        actions.logs.listener.requestLogDetails(flowId, exportId, '5642310475121')
      );
      const expectedState = {
        [exportId]: {
          hasNewLogs: false,
          logsDetails: {5642310475121: {status: 'requested'}},
          logsStatus: 'received',
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.requestLogDetails(flowId, exportId, '5642310475121')
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.LOG.RECEIVED action', () => {
    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.receivedLogDetails(exportId, logKey, logDetails)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the state with log details', () => {
      const initialState = {
        [exportId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: logKey, time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          error: {key: 123},
        },
      };
      const tempState = reducer(
        initialState,
        actions.logs.listener.requestLogDetails(flowId, exportId, logKey)
      );

      const newState = reducer(
        tempState,
        actions.logs.listener.receivedLogDetails(exportId, logKey, logDetails)
      );
      const expectedState = {
        [exportId]: {
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.receivedLogDetails(exportId, logKey, logDetails)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.ACTIVE_LOG action', () => {
    const activeLogKey = '98765';

    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.setActiveLog(exportId, activeLogKey)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the state with active log key', () => {
      const initialState = {
        [exportId]: {
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: 123, time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          error: {key: 123},
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.listener.setActiveLog(exportId, activeLogKey)
      );
      const expectedState = {
        [exportId]: {
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.setActiveLog(exportId, activeLogKey)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.LOG.DELETED action', () => {
    const deletedLogs = ['200-POST'];

    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.logDeleted(exportId, deletedLogs)
      );

      expect(newState).toEqual({});
    });
    test('should not modify the state if deleted log key is not present and there is no existing error', () => {
      const initialState = {
        [exportId]: {
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
        actions.logs.listener.logDeleted(exportId, deletedLogs)
      );

      expect(newState).toBe(initialState);
    });
    test('should modify the state and remove deleted log key from summary and details', () => {
      const initialState = {
        [exportId]: {
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
          error: {key: 89},
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.listener.logDeleted(exportId, deletedLogs)
      );
      const expectedState = {
        [exportId]: {
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
    test('should not alter any other sibling state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.logDeleted(exportId, deletedLogs)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.DEBUG.START action', () => {
    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.startDebug(flowId, exportId, '15')
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with debugOn as true', () => {
      const initialState = {
        [exportId]: {
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
          error: {},
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.listener.startDebug(flowId, exportId, '15')
      );
      const expectedState = {
        [exportId]: {
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.startDebug(flowId, exportId, '15')
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.DEBUG.STOP action', () => {
    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.stopDebug(flowId, exportId)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with debugOn as false', () => {
      const initialState = {
        [exportId]: {
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
          error: {},
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.listener.stopDebug(flowId, exportId)
      );
      const expectedState = {
        [exportId]: {
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.stopDebug(flowId, exportId)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.STOP_POLL action', () => {
    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.stopLogsPoll(exportId, true)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the exiting state with passed hasNewLogs prop', () => {
      const initialState = {
        [exportId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          error: {},
        },
      };

      const newState = reducer(
        initialState,
        actions.logs.listener.stopLogsPoll(exportId, true)
      );
      const expectedState = {
        [exportId]: {
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.stopLogsPoll(exportId, true)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.FAILED action', () => {
    const error = {key: '200-POST', error: 'NoSuchKey'};

    test('should exit and not throw error if the listener state does not exist', () => {
      const newState = reducer(
        undefined,
        actions.logs.listener.failed(exportId, error)
      );

      expect(newState).toEqual({});
    });
    test('should correctly update the state with the error', () => {
      const initialState = {
        [exportId]: {
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
        actions.logs.listener.failed(exportId, error)
      );
      const expectedState = {
        [exportId]: {
          activeLogKey: '5642310475121',
          logsDetails: {5642310475121: {
            status: 'received',
            request: {},
            response: {},
          }},
          logsStatus: 'received',
          logsSummary: [{key: '5642310475121', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          error,
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
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.failed(exportId, error)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
  describe('LISTENER.CLEAR action', () => {
    test('should clear the listener reference from the state', () => {
      const initialState = {
        [exportId]: {
          activeLogKey: '5642310475121',
          hasNewLogs: false,
          logsStatus: 'received',
          logsSummary: [{key: '123', time: 1234}],
          nextPageURL: '/v1(api)/flows/:_flowId',
          error: {key: 123},
        },
      };

      const tempState = reducer(
        initialState,
        actions.logs.listener.receivedLogDetails(exportId, '123', {})
      );
      const newState = reducer(
        tempState,
        actions.logs.listener.clear(exportId)
      );

      expect(newState).not.toHaveProperty(exportId);
    });
    test('should not alter any other editor state', () => {
      const initialState = {
        'sibling-export': {
          logsStatus: 'received',
          error: {key: 123},
        },
        [exportId]: {
          logsStatus: 'received',
        },
      };
      const newState = reducer(
        initialState,
        actions.logs.listener.clear(exportId)
      );

      expect(newState).toHaveProperty('sibling-export', {
        logsStatus: 'received',
        error: {key: 123},
      });
    });
  });
});

describe('Listener logs selectors', () => {
  const initialState = {
    [exportId]: {
      activeLogKey: '5642310475121',
      hasNewLogs: false,
      logsStatus: 'received',
      logsSummary: [{key: logKey, time: 1234}],
      nextPageURL: '/v1(api)/flows/:_flowId',
      error: {key: logKey},
    },
  };

  const newState = reducer(
    initialState,
    actions.logs.listener.receivedLogDetails(exportId, logKey, logDetails)
  );

  describe('listenerLogs', () => {
    test('should return empty object when no match found', () => {
      expect(selectors.listenerLogs(undefined, exportId)).toEqual({});
      expect(selectors.listenerLogs({}, exportId)).toEqual({});
      expect(selectors.listenerLogs({123: {}}, exportId)).toEqual({});
    });
    test('should return correct listener state when a match is found', () => {
      const expectedOutput = {
        activeLogKey: '5642310475121',
        hasNewLogs: false,
        logsStatus: 'received',
        logsDetails: {[logKey]: {status: 'received', ...logDetails}},
        logsSummary: [{key: logKey, time: 1234}],
        nextPageURL: '/v1(api)/flows/:_flowId',
      };

      expect(selectors.listenerLogs(newState, exportId)).toEqual(expectedOutput);
    });
  });
  describe('logsSummary', () => {
    test('should return empty array when no match found or logs are undefined', () => {
      expect(selectors.logsSummary(undefined, exportId)).toEqual([]);
      expect(selectors.logsSummary({}, exportId)).toEqual([]);
      expect(selectors.logsSummary({[exportId]: {logsStatus: 'received'}}, exportId)).toEqual([]);
    });
    test('should return correct listener state logs when a match is found', () => {
      const expectedOutput = [{key: logKey, time: 1234}];

      expect(selectors.logsSummary(newState, exportId)).toEqual(expectedOutput);
    });
  });
  describe('logsStatus', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.logsStatus(undefined, exportId)).toBeUndefined();
      expect(selectors.logsStatus({}, exportId)).toBeUndefined();
      expect(selectors.logsStatus({[exportId]: {}}, exportId)).toBeUndefined();
    });
    test('should return correct status when a match is found', () => {
      expect(selectors.logsStatus(newState, exportId)).toEqual('received');
    });
  });
  describe('hasNewLogs', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.hasNewLogs(undefined, exportId)).toBeUndefined();
      expect(selectors.hasNewLogs({}, exportId)).toBeUndefined();
      expect(selectors.hasNewLogs({[exportId]: {}}, exportId)).toBeUndefined();
    });
    test('should return correct state prop when a match is found', () => {
      expect(selectors.hasNewLogs(newState, exportId)).toEqual(false);
      const finalState = reducer(
        newState,
        actions.logs.listener.stopLogsPoll(exportId, true)
      );

      expect(selectors.hasNewLogs(finalState, exportId)).toEqual(true);
    });
  });
  describe('logDetails', () => {
    test('should return empty object when no match found', () => {
      expect(selectors.logDetails(undefined, exportId, logKey)).toEqual({});
      expect(selectors.logDetails({}, exportId, logKey)).toEqual({});
      expect(selectors.logDetails({[exportId]: {logDetails: {}}}, exportId, logKey)).toEqual({});
    });
    test('should return correct log details when a match is found', () => {
      const expectedOutput = {status: 'received', ...logDetails};

      expect(selectors.logDetails(newState, exportId, logKey)).toEqual(expectedOutput);
    });
  });
  describe('isDebugEnabled', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.isDebugEnabled(undefined, exportId)).toBeUndefined();
      expect(selectors.isDebugEnabled({}, exportId)).toBeUndefined();
      expect(selectors.isDebugEnabled({[exportId]: {}}, exportId)).toBeUndefined();
    });
    test('should return correct state prop when a match is found', () => {
      const finalState = reducer(
        newState,
        actions.logs.listener.startDebug(flowId, exportId, '15')
      );

      expect(selectors.isDebugEnabled(finalState, exportId)).toEqual(true);
    });
  });
  describe('activeLogKey', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.activeLogKey(undefined, exportId)).toBeUndefined();
      expect(selectors.activeLogKey({}, exportId)).toBeUndefined();
      expect(selectors.activeLogKey({[exportId]: {}}, exportId)).toBeUndefined();
    });
    test('should return correct active key when a match is found', () => {
      expect(selectors.activeLogKey(newState, exportId)).toEqual('5642310475121');
    });
  });
  describe('listenerErrorMsg', () => {
    test('should return undefined when no match found', () => {
      expect(selectors.listenerErrorMsg(undefined, exportId)).toBeUndefined();
      expect(selectors.listenerErrorMsg({}, exportId)).toBeUndefined();
      expect(selectors.listenerErrorMsg({[exportId]: {}}, exportId)).toBeUndefined();
    });
    test('should return correct state error when a match is found', () => {
      const finalState = reducer(
        newState,
        actions.logs.listener.failed(exportId, {key: '200-POST', error: 'NoSuchKey'})
      );

      expect(selectors.listenerErrorMsg(finalState, exportId)).toEqual({key: '200-POST', error: 'NoSuchKey'});
    });
  });
});

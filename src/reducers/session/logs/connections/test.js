/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('Connections logs reducer', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('CONNECTIONS_LOGS_REQUEST should initialise connections object if not initialized', () => {
    const connectionId = 's123';
    const state = reducer(undefined, actions.logs.connections.request(connectionId));

    expect(state.connections).toBeDefined();
    expect(state.connections[connectionId]).toBeDefined();
  });
  test('CONNECTIONS_LOGS_REQUEST should set status = loading', () => {
    const connectionId = 's123';
    const state = reducer(undefined, actions.logs.connections.request(connectionId));

    expect(state.connections[connectionId].status).toEqual('loading');
  });
  test('CONNECTIONS_LOGS_RECEIVED should not modify state if log state corresponding to particular connectionId is not found', () => {
    const connectionId = 's123';
    const initialState = {
      connections: {
        otherConn: {
          status: 'loading',
        },
      },
    };
    const logs = 'some log text';
    const state = reducer(initialState, actions.logs.connections.received(connectionId, logs));

    expect(state).toEqual(initialState);
  });
  test('CONNECTIONS_LOGS_RECEIVED should set status = success', () => {
    const connectionId = 's123';
    const initialState = {
      connections: {
        s123: {
          status: 'loading',
        },
      },
    };
    const state = reducer(initialState, actions.logs.connections.received(connectionId, ''));

    expect(state.connections[connectionId].status).toEqual('success');
  });
  test('CONNECTIONS_LOGS_RECEIVED should set logs correctly', () => {
    const connectionId = 's123';
    const initialState = {
      connections: {
        s123: {
          status: 'loading',
        },
      },
    };
    const logs = 'some log text';
    const state = reducer(initialState, actions.logs.connections.received(connectionId, logs));

    expect(state.connections[connectionId].logs).toEqual(logs);
  });
  test('CONNECTIONS_LOGS_REQUEST_FAILED should not modify state if log state corresponding to particular connectionId is not found', () => {
    const connectionId = 's123';
    const initialState = {
      connections: {
        otherConn: {
          status: 'loading',
        },
      },
    };
    const logs = 'some log text';
    const state = reducer(initialState, actions.logs.connections.received(connectionId, logs));

    expect(state).toEqual(initialState);
  });
  test('CONNECTIONS_LOGS_REQUEST_FAILED should set status to error', () => {
    const connectionId = 's123';
    const initialState = {
      connections: {
        s123: {
          status: 'loading',
        },
      },
    };
    const state = reducer(initialState, actions.logs.connections.requestFailed(connectionId));

    expect(state.connections[connectionId].status).toEqual('error');
  });
  test('CONNECTIONS_LOGS_CLEAR should not do anything if state.connections is not defined', () => {
    const connectionId = 's123';
    const initialState = {};
    const state = reducer(initialState, actions.logs.connections.clear({connectionId}));

    expect(state).toEqual(initialState);
  });
  test('CONNECTIONS_LOGS_CLEAR should delete state completely when clearAllLogs = true', () => {
    const initialState = {
      connections: {
        s123: {
          status: 'success',
          logs: '',
        },
        s78: {
          status: 'success',
          logs: '',
        },
      },
    };
    const state = reducer(initialState, actions.logs.connections.clear({clearAllLogs: true}));

    expect(state).toEqual({});
  });
  test('CONNECTIONS_LOGS_CLEAR should delete state corresponding to connectionId when connectionId is passed', () => {
    const initialState = {
      connections: {
        s123: {
          status: 'success',
          logs: '',
        },
        s78: {
          status: 'success',
          logs: '',
        },
      },
    };
    const state = reducer(initialState, actions.logs.connections.clear({connectionId: 's123'}));

    expect(state).toEqual({
      connections: {
        s78: {
          status: 'success',
          logs: '',
        },
      },
    });
  });
  test('CONNECTIONS_LOGS_DELETE should not do anything if state.connections is not defined', () => {
    const connectionId = 's123';
    const initialState = {};
    const state = reducer(initialState, actions.logs.connections.delete(connectionId));

    expect(state).toEqual(initialState);
  });
  test('CONNECTIONS_LOGS_DELETE should remove logs if present', () => {
    const connectionId = 's123';
    const initialState = {
      connections: {
        s123: {
          status: 'success',
          logs: '',
        },
        s78: {
          status: 'success',
          logs: '',
        },
      },
    };
    const state = reducer(initialState, actions.logs.connections.delete(connectionId));

    expect(state).toEqual({
      connections: {
        s123: {
          status: 'success',
        },
        s78: {
          status: 'success',
          logs: '',
        },
      },
    });
  });
});

describe('Connections logs selectors', () => {
  test('selectors[allConnectionsLogs] should return empty object if state is not defined', () => {
    const connectionLog = selectors.allConnectionsLogs(undefined, {});

    expect(connectionLog).toEqual({});
  });
  test('selectors[allConnectionsLogs] should return correct state', () => {
    const state = {
      connections: {
        c1: {status: 'error'},
        c2: {status: 'success', logs: 'some logs'},
      },
    };
    const connectionLog = selectors.allConnectionsLogs(state, {});

    expect(connectionLog).toEqual({
      c1: {status: 'error'},
      c2: {status: 'success', logs: 'some logs'},
    });
  });
});

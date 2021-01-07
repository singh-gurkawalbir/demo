/* global describe, test, expect, jest */

import { addMinutes } from 'date-fns';
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('Script reducer', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('should set status=requested, initialise dateRange to 15 minutes by default', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const now = new Date();
    const mock = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => now);

    mock.mockReturnValue(now);

    const state = reducer(undefined, actions.logs.scripts.request({
      flowId,
      scriptId,
    }));

    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          dateRange: {
            startDate: addMinutes(now, -15),
            endDate: now,
            preset: 'last15minutes',
          },
          status: 'requested',
        },
      },
    };

    mock.mockRestore();
    expect(state).toEqual(expectedState);
  });

  test('should set status=error in case of request failure', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          status: 'requested',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.requestFailed({
      flowId,
      scriptId,
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          status: 'error',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('should not remove already loaded logs in case new log request fails', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [{a: 1}],
          status: 'success',
          nextPageURL: 'abc',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.requestFailed({
      flowId,
      scriptId,
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [{a: 1}],
          status: 'error',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('LOGS_RECEIVED action should set state properly', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          status: 'requested',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.received({
      flowId,
      scriptId,
      logs: [{a: 1}],
      nextPageURL: 'abc',
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [{a: 1, index: 0}],
          nextPageURL: 'abc',
          status: 'success',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('should add logs to array in case of LOGS_RECEIVED action if logs already present', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          status: 'success',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.received({
      flowId,
      scriptId,
      logs: [{a: 3}, {a: 4}],
      nextPageURL: 'abc',
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
            {a: 3, index: 2},
            {a: 4, index: 3},
          ],
          nextPageURL: 'abc',
          status: 'success',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('SET_DEPENDENCY action should set script dependency correctly', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          status: 'success',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.setDependency({
      flowId,
      scriptId,
      resourceReferences: [{id: 'a', type: 'flow'}, {id: 'a', type: 'export'}],
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          resourceReferences: [{id: 'a', type: 'flow'}, {id: 'a', type: 'export'}],
          status: 'success',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('PATCH_FILTER action should patch filter correctly', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          status: 'success',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.patchFilter({
      flowId,
      scriptId,
      field: 'functionType',
      value: 'xyz',
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          functionType: 'xyz',
          status: 'success',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('PATCH_FILTER action should patch filter correctly in case field = logLevel', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          nextPageURL: 'abc',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          status: 'success',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.patchFilter({
      flowId,
      scriptId,
      field: 'logLevel',
      value: 'DEBUG',
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logLevel: 'DEBUG',
          nextPageURL: 'abc',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          status: 'success',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('LOGS_REFRESH action should remove existing log and set status accordingly', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          nextPageURL: 'abc',
          status: 'success',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.refresh({
      flowId,
      scriptId,
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          status: 'requested',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  // TODO add test cases
  // test('LOGS_CLEAR action should delete state correctly', () => {
  //   const flowId = 'f123';
  //   const scriptId = 's123';
  //   const currentState = {
  //     scripts: {
  //       's123-f123': {
  //         scriptId: 's123',
  //         flowId: 'f123',
  //         logs: [
  //           {a: 1, index: 0},
  //           {a: 2, index: 1},
  //         ],
  //         nextPageURL: 'abc',
  //         status: 'success',
  //       },
  //     },
  //   };
  //   const state = reducer(currentState, actions.logs.scripts.clear({
  //     flowId,
  //     scriptId,
  //   }));
  //   const expectedState = {
  //   };

  //   expect(state).toEqual(expectedState);
  // });

  test('LOGS_LOAD_MORE action should set status correctly', () => {
    const flowId = 'f123';
    const scriptId = 's123';
    const currentState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          nextPageURL: 'abc',
          status: 'success',
        },
      },
    };
    const state = reducer(currentState, actions.logs.scripts.loadMore({
      flowId,
      scriptId,
    }));
    const expectedState = {
      scripts: {
        's123-f123': {
          scriptId: 's123',
          flowId: 'f123',
          logs: [
            {a: 1, index: 0},
            {a: 2, index: 1},
          ],
          nextPageURL: 'abc',
          status: 'requested',
        },
      },
    };

    expect(state).toEqual(expectedState);
  });

  test('should not alter state in case script with particular scriptId is not present in state', () => {
    const originalState = {
      scripts: {
        's1-f1': {
          a: 1,
        },
      },
    };

    let expectedState = reducer(originalState, actions.logs.scripts.requestFailed({
      flowId: 'f2',
      scriptId: 's1',
    }));

    expect(expectedState).toEqual(originalState);

    expectedState = reducer(originalState, actions.logs.scripts.received({
      flowId: 'f2',
      scriptId: 's1',
    }));

    expect(expectedState).toEqual(originalState);
    /// //
    expectedState = reducer(originalState, actions.logs.scripts.setDependency({
      flowId: 'f2',
      scriptId: 's1',
    }));

    expect(expectedState).toEqual(originalState);

    expectedState = reducer(originalState, actions.logs.scripts.patchFilter({
      flowId: 'f2',
      scriptId: 's1',
    }));

    expect(expectedState).toEqual(originalState);
    expectedState = reducer(originalState, actions.logs.scripts.refresh({
      flowId: 'f2',
      scriptId: 's1',
    }));

    expect(expectedState).toEqual(originalState);
    expectedState = reducer(originalState, actions.logs.scripts.loadMore({
      flowId: 'f2',
      scriptId: 's1',
    }));

    expect(expectedState).toEqual(originalState);
  });
});

describe('script selector', () => {
  test('selector[scriptLog] should return empty state in case state is not initialized', () => {
    const scriptLog = selectors.scriptLog(undefined, {});

    expect({}).toEqual(scriptLog);
  });

  test('selector[scriptLog] should return empty state in case script is not initalised for particular scriptId', () => {
    const state = {scripts: {'s1-f1': {a: 1}}};
    const scriptLog = selectors.scriptLog(state, {scriptId: 's2', flowId: 'f2'});

    expect({}).toEqual(scriptLog);
  });

  test('selector[scriptLog] should return state correctly', () => {
    const state = {scripts: {'s1-f1': {
      scriptId: 's1',
      flowId: 'f1',
      logs: [
        {message: 'm1', logLevel: 'WARN' },
        {message: 'm2', logLevel: 'DEBUG' },
        {message: 'm3', logLevel: 'DEBUG' },
      ],
    }}};
    const scriptLog = selectors.scriptLog(state, {scriptId: 's1', flowId: 'f1'});

    expect({
      scriptId: 's1',
      flowId: 'f1',
      logs: [
        {message: 'm1', logLevel: 'WARN' },
        {message: 'm2', logLevel: 'DEBUG' },
        {message: 'm3', logLevel: 'DEBUG' },
      ],
    }).toEqual(scriptLog);
  });

  test('selector[scriptLog] should return filtered logs correctly', () => {
    const state = {scripts: {'s1-f1': {
      scriptId: 's1',
      flowId: 'f1',
      logs: [
        {message: 'm1', logLevel: 'WARN' },
        {message: 'm2', logLevel: 'DEBUG' },
        {message: 'm3', logLevel: 'DEBUG' },
      ],
    }}};
    const newState = reducer(state, actions.logs.scripts.patchFilter({
      flowId: 'f1',
      scriptId: 's1',
      field: 'logLevel',
      value: 'DEBUG',
    }));
    const scriptLog = selectors.scriptLog(newState, {scriptId: 's1', flowId: 'f1'});

    expect({
      scriptId: 's1',
      flowId: 'f1',
      logs: [
        {message: 'm2', logLevel: 'DEBUG' },
        {message: 'm3', logLevel: 'DEBUG' },
      ],
      logLevel: 'DEBUG',
    }).toEqual(scriptLog);
  });

  test('selector[flowExecutionLogScripts] should all script log for a particular flow', () => {
    const state = {scripts: {
      's1-f1': {
        scriptId: 's1',
        flowId: 'f1',
        logs: [
          {message: 'm1', logLevel: 'WARN' },
          {message: 'm2', logLevel: 'DEBUG' },
          {message: 'm3', logLevel: 'DEBUG' },
        ],
      },
      's2-f1': {
        scriptId: 's2',
        flowId: 'f1',
        logs: [
          {message: 'm4', logLevel: 'WARN' },
          {message: 'm5', logLevel: 'DEBUG' },
          {message: 'm6', logLevel: 'DEBUG' },
        ],
      },
      's3-f2': {
        scriptId: 's3',
        flowId: 'f2',
        logs: [
          {message: 'm7', logLevel: 'WARN' },
          {message: 'm8', logLevel: 'DEBUG' },
          {message: 'm9', logLevel: 'DEBUG' },
        ],
      },
    },
    };
    const scriptLog = selectors.flowExecutionLogScripts(state, 'f1');

    expect([
      {
        scriptId: 's1',
        flowId: 'f1',
        logs: [
          {message: 'm1', logLevel: 'WARN' },
          {message: 'm2', logLevel: 'DEBUG' },
          {message: 'm3', logLevel: 'DEBUG' },
        ],
      },
      {
        scriptId: 's2',
        flowId: 'f1',
        logs: [
          {message: 'm4', logLevel: 'WARN' },
          {message: 'm5', logLevel: 'DEBUG' },
          {message: 'm6', logLevel: 'DEBUG' },
        ],
      },
    ]).toEqual(scriptLog);
  });

  test('selector[flowExecutionLogScripts] should all empty set when script logs for particular flow is not present', () => {
    const state = {scripts: {
      's1-f1': {
        scriptId: 's1',
        flowId: 'f1',
        logs: [
          {message: 'm1', logLevel: 'WARN' },
          {message: 'm2', logLevel: 'DEBUG' },
          {message: 'm3', logLevel: 'DEBUG' },
        ],
      },
      's2-f1': {
        scriptId: 's2',
        flowId: 'f1',
        logs: [
          {message: 'm4', logLevel: 'WARN' },
          {message: 'm5', logLevel: 'DEBUG' },
          {message: 'm6', logLevel: 'DEBUG' },
        ],
      },
      's3-f2': {
        scriptId: 's3',
        flowId: 'f2',
        logs: [
          {message: 'm7', logLevel: 'WARN' },
          {message: 'm8', logLevel: 'DEBUG' },
          {message: 'm9', logLevel: 'DEBUG' },
        ],
      },
    },
    };
    const scriptLog = selectors.flowExecutionLogScripts(state, 'f3');

    expect([]).toEqual(scriptLog);
  });
  test('selector[flowExecutionLogScripts] should all empty set when no flowId is passed', () => {
    const state = {scripts: {
      's1-f1': {
        scriptId: 's1',
        flowId: 'f1',
        logs: [
          {message: 'm1', logLevel: 'WARN' },
          {message: 'm2', logLevel: 'DEBUG' },
          {message: 'm3', logLevel: 'DEBUG' },
        ],
      },
    },
    };
    const scriptLog = selectors.flowExecutionLogScripts(state);

    expect([]).toEqual(scriptLog);
  });
});

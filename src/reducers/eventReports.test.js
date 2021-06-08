/* global describe, expect, test */
import produce from 'immer';
import { selectors } from '.';

const state = {
  data: {
    resources: {
      eventreports: [
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '2', type: 'flow_events', _flowIds: ['flow1'], startTime: '2021-03-14T18:30:00.000Z', endTime: '2021-03-16T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T14:43:09.823Z', startedAt: '2021-03-16T14:43:11.733Z', endedAt: '2021-03-16T14:43:40.961Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '4', type: 'flow_events', _flowIds: ['flow4'], startTime: '2021-03-10T18:30:00.000Z', endTime: '2021-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2021-03-17T04:04:32.417Z', startedAt: '2021-03-17T04:04:34.000Z', endedAt: '2021-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},
        {_id: '5', type: 'flow_events', _flowIds: ['flow5'], startTime: '2020-03-10T18:30:00.000Z', endTime: '2020-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2020-03-17T04:04:32.417Z', startedAt: '2020-03-17T04:04:34.000Z', endedAt: '2020-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},
      ],
      flows: [
        {_id: 'flow1', name: 'flow1', _integrationId: 'int1'},
        {_id: 'flow2', name: 'flow2', _integrationId: 'int1'},
        {_id: 'flow3', name: 'flow3', _integrationId: 'int2'},
        {_id: 'flow4', name: 'flow4', _integrationId: 'int2'},
        {_id: 'flow5', name: 'flow4', _integrationId: 'int3', sandbox: true},

      ],
      integrations: [
        {_id: '5', name: 'int1', _integrationId: 'int1'},
        {_id: '7', name: 'int2', _integrationId: 'int2'},
        {_id: '8', name: 'int3', _integrationId: 'int3', sandbox: true },

      ],
    },
  },
};

describe('selectors.mkEventReportsFiltered', () => {
  const eventReportsSelector = selectors.mkEventReportsFiltered();

  describe('filterbyEnvironment', () => {
    test('should return sandbox reports', () => {
      const updatedState = {...state,
        user: {
          preferences: {
            environment: 'sandbox',
          },
        }};

      const result = eventReportsSelector(updatedState, { type: 'eventreports' });

      expect(result.count).toEqual(1);
      expect(result.resources).toEqual([{_id: '5', type: 'flow_events', _flowIds: ['flow5'], startTime: '2020-03-10T18:30:00.000Z', endTime: '2020-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2020-03-17T04:04:32.417Z', startedAt: '2020-03-17T04:04:34.000Z', endedAt: '2020-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}}]);
    });
    test('should return production reports', () => {
      const updatedState = {...state,
        user: {
          preferences: {
            environment: 'production',
          },
        }};

      const result = eventReportsSelector(updatedState, { type: 'eventreports' });

      expect(result.count).toEqual(4);
      expect(result.resources).toEqual([
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '2', type: 'flow_events', _flowIds: ['flow1'], startTime: '2021-03-14T18:30:00.000Z', endTime: '2021-03-16T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T14:43:09.823Z', startedAt: '2021-03-16T14:43:11.733Z', endedAt: '2021-03-16T14:43:40.961Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '4', type: 'flow_events', _flowIds: ['flow4'], startTime: '2021-03-10T18:30:00.000Z', endTime: '2021-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2021-03-17T04:04:32.417Z', startedAt: '2021-03-17T04:04:34.000Z', endedAt: '2021-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},

      ]);
    });

    test('should not return a report after its corresponding flow is deleted ', () => {
      const stateWithDeletedflow3 = produce(state, draft => {
        draft.data.resources.flows.splice(2, 1);
      });
      const updatedState = {...stateWithDeletedflow3,
        user: {
          preferences: {
            environment: 'production',
          },
        }};

      const result = eventReportsSelector(updatedState, { type: 'eventreports' });

      expect(result.count).toEqual(3);
      expect(result.resources).toEqual([
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '2', type: 'flow_events', _flowIds: ['flow1'], startTime: '2021-03-14T18:30:00.000Z', endTime: '2021-03-16T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T14:43:09.823Z', startedAt: '2021-03-16T14:43:11.733Z', endedAt: '2021-03-16T14:43:40.961Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '4', type: 'flow_events', _flowIds: ['flow4'], startTime: '2021-03-10T18:30:00.000Z', endTime: '2021-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2021-03-17T04:04:32.417Z', startedAt: '2021-03-17T04:04:34.000Z', endedAt: '2021-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},
      ]);
    });
    test('should return a multiflow report if atleast one flow not deleted', () => {
      const stateWithDeletedflow2 = produce(state, draft => {
        draft.data.resources.flows.splice(1, 1);
      });
      const updatedState = {...stateWithDeletedflow2,
        user: {
          preferences: {
            environment: 'production',
          },
        }};

      const result = eventReportsSelector(updatedState, { type: 'eventreports' });

      expect(result.count).toEqual(4);
      expect(result.resources).toEqual([
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '2', type: 'flow_events', _flowIds: ['flow1'], startTime: '2021-03-14T18:30:00.000Z', endTime: '2021-03-16T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T14:43:09.823Z', startedAt: '2021-03-16T14:43:11.733Z', endedAt: '2021-03-16T14:43:40.961Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '4', type: 'flow_events', _flowIds: ['flow4'], startTime: '2021-03-10T18:30:00.000Z', endTime: '2021-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2021-03-17T04:04:32.417Z', startedAt: '2021-03-17T04:04:34.000Z', endedAt: '2021-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},
      ]);
    });
    test('should not return a multiflow report if all flows are deleted', () => {
      const stateWithDeletedflow2 = produce(state, draft => {
        draft.data.resources.flows.splice(0, 2);
      });
      const updatedState = {...stateWithDeletedflow2,
        user: {
          preferences: {
            environment: 'production',
          },
        }};

      const result = eventReportsSelector(updatedState, { type: 'eventreports' });

      expect(result.count).toEqual(2);
      expect(result.resources).toEqual([
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '4', type: 'flow_events', _flowIds: ['flow4'], startTime: '2021-03-10T18:30:00.000Z', endTime: '2021-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2021-03-17T04:04:32.417Z', startedAt: '2021-03-17T04:04:34.000Z', endedAt: '2021-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},
      ]);
    });
  });
  test('should return filtered int1 reports when integration filter is provided', () => {
    const filterConfig = {
      type: 'eventreports',
      integrationId: ['int1']};
    const result = eventReportsSelector(state, filterConfig);

    expect(result.count).toEqual(2);
    expect(result.resources).toEqual(
      [
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '2', type: 'flow_events', _flowIds: ['flow1'], startTime: '2021-03-14T18:30:00.000Z', endTime: '2021-03-16T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T14:43:09.823Z', startedAt: '2021-03-16T14:43:11.733Z', endedAt: '2021-03-16T14:43:40.961Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
      ]
    );
  });
  test('should return filtered int1 reports belonging to flow2 when integration and flow filter is provided', () => {
    const filterConfig = {
      type: 'eventreports',
      integrationId: ['int1'],
      flowIds: ['flow2'],
    };
    const result = eventReportsSelector(state, filterConfig);

    expect(result.count).toEqual(1);
    expect(result.resources).toEqual(
      [
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
      ]
    );
  });

  test('should return reports belonging to a valid start range', () => {
    const filterConfig = {
      type: 'eventreports',
      startDate: {
        startDate: '2021-03-08T00:00:00.000Z',
        endDate: '2021-03-10T00:00:00.000Z',
      },
    };
    const result = eventReportsSelector(state, filterConfig);

    expect(result.count).toEqual(1);
    expect(result.resources).toEqual(
      [
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
      ]
    );
  });
  test('should return reports belonging to a valid end range', () => {
    const filterConfig = {
      type: 'eventreports',
      endDate: {
        startDate: '2021-03-12T00:00:00.000Z',
        endDate: '2021-03-13T00:00:00.000Z',
      },
    };
    const result = eventReportsSelector(state, filterConfig);

    expect(result.count).toEqual(1);
    expect(result.resources).toEqual(
      [
        {_id: '4', type: 'flow_events', _flowIds: ['flow4'], startTime: '2021-03-10T18:30:00.000Z', endTime: '2021-03-12T18:29:59.999Z', status: 'failed', reportGenerationErrors: [], createdAt: '2021-03-17T04:04:32.417Z', startedAt: '2021-03-17T04:04:34.000Z', endedAt: '2021-03-17T04:04:58.744Z', requestedByUser: {name: 'def', email: 'def@gmail.com'}},
      ]
    );
  });
  test('should return reports belonging to a completed status', () => {
    const filterConfig = {
      type: 'eventreports',
      status: 'completed',
    };
    const result = eventReportsSelector(state, filterConfig);

    expect(result.count).toEqual(3);
    expect(result.resources).toEqual(
      [
        {_id: '1', type: 'flow_events', _flowIds: ['flow1', 'flow2'], startTime: '2021-03-11T18:30:00.000Z', endTime: '2021-03-13T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T04:53:56.156Z', startedAt: '2021-03-16T04:53:57.129Z', endedAt: '2021-03-16T04:54:24.920Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '2', type: 'flow_events', _flowIds: ['flow1'], startTime: '2021-03-14T18:30:00.000Z', endTime: '2021-03-16T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-16T14:43:09.823Z', startedAt: '2021-03-16T14:43:11.733Z', endedAt: '2021-03-16T14:43:40.961Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}},
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}}]
    );
  });
  test('should paginate reports belonging to a completed status and a pagination range ', () => {
    const filterConfig = {
      type: 'eventreports',
      status: 'completed',
      paging: {
        rowsPerPage: 2,
        currPage: 1,
      },
    };
    const result = eventReportsSelector(state, filterConfig);

    expect(result.count).toEqual(3);
    // there are three results matching completed status
    // since rows per page are 2 when providing currPage 1 we get the second page of a result which has one in it.
    expect(result.resources).toEqual(
      [
        {_id: '3', type: 'flow_events', _flowIds: ['flow3'], startTime: '2021-03-09T18:30:00.000Z', endTime: '2021-03-11T18:29:59.999Z', status: 'completed', reportGenerationErrors: [], createdAt: '2021-03-17T03:38:05.950Z', startedAt: '2021-03-17T03:38:07.704Z', endedAt: '2021-03-17T03:38:37.195Z', requestedByUser: {name: 'abc', email: 'abc@gmail.com'}}]
    );
  });
});

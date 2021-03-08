/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';
import { COMM_STATES } from '../../comms/networkComms';

describe('Connections API', () => {
  describe('activeConnection', () => {
    describe('reducer', () => {
      test('should properly store active connection when given an id', () => {
        const id = 'conn123';
        const state = reducer(undefined, actions.connection.setActive(id));

        expect(state.activeConnection).toEqual(id);
      });

      test('should properly clear active connection when given no value', () => {
        const state = reducer(undefined, actions.connection.setActive());

        expect(state.activeConnection).toEqual(undefined);
      });

      test('should update offline flag of connection once connection is authorized', () => {
        const prevState = {
          status: [{
            _id: '1',
            offline: true,
            type: 'ns',
          }, {
            _id: '2',
            offline: true,
            type: 'sf',
          }],
        };

        const nextState = reducer(prevState, actions.resource.connections.authorized('1'));

        expect(nextState).toEqual({
          status: [{
            _id: '1',
            offline: false,
            type: 'ns',
          }, {
            _id: '2',
            offline: true,
            type: 'sf',
          }],
        });
      });

      test('should correctly update iclients for the given connection when multiple connections iclients present', () => {
        const prevState = {
          iClients: {
            1: ['iclientId1'],
            2: ['iclientId2'],
            3: ['iclientId3'],
          },
        };

        const nextState = reducer(prevState, actions.connection.updateIClients(['iclientId1', 'iclientId11'], '1'));

        expect(nextState).toEqual({
          iClients: {
            1: ['iclientId1', 'iclientId11'],
            2: ['iclientId2'],
            3: ['iclientId3'],
          },
        });
      });

      test('should correctly update queued jobs for the given connection when multiple connections queued jobs present', () => {
        const prevState = {
          queuedJobs: {
            1: ['queuedjob1'],
            2: ['queuedjob2'],
            3: ['queuedjob3'],
          },
        };

        const nextState = reducer(prevState, actions.connection.receivedQueuedJobs(['queuedjob1', 'queuedjob11'], '1'));

        expect(nextState).toEqual({
          queuedJobs: {
            1: ['queuedjob1', 'queuedjob11'],
            2: ['queuedjob2'],
            3: ['queuedjob3'],
          },
        });
      });

      test('should add connection with status as loading if trading partner connections are requested if prevState is undefined', () => {
        const state = reducer(
          undefined,
          actions.resource.connections.requestTradingPartnerConnections('conn3')
        );

        expect(state).toEqual({
          tradingPartnerConnections: {
            conn3: {
              status: 'loading',
            },
          },
        });
      });

      test('should add connection with status as loading if trading partner connections are requested', () => {
        const prevState = {
          tradingPartnerConnections: {
            conn1: {
              connections: ['c1', 'c2'],
              status: COMM_STATES.SUCCESS,
            },
            conn2: {
              connections: ['c3'],
              status: COMM_STATES.SUCCESS,
            },
          },
        };

        const nextState = reducer(
          prevState,
          actions.resource.connections.requestTradingPartnerConnections('conn3')
        );

        expect(nextState).toEqual({
          tradingPartnerConnections: {
            conn1: {
              connections: [
                'c1',
                'c2',
              ],
              status: 'success',
            },
            conn2: {
              connections: [
                'c3',
              ],
              status: 'success',
            },
            conn3: {
              status: 'loading',
            },
          },
        });
      });

      test('should add tradingPartner connections for the given connection to the state when prev state is undefined', () => {
        const state = reducer(undefined, actions.connection.receivedTradingPartnerConnections('c1', ['c2', 'c3', 'c4']));

        expect(state).toEqual({
          tradingPartnerConnections: {
            c1: {
              connections: ['c2', 'c3', 'c4'],
              status: COMM_STATES.SUCCESS,
            },
          },
        });
      });

      test('should correctly update the state with received tradingPartner connections when connections exists in prev state', () => {
        const prevState = {
          tradingPartnerConnections: {
            conn1: {
              status: COMM_STATES.SUCCESS,
              connections: ['c1'],
            },
            conn2: {
              status: COMM_STATES.SUCCESS,
              connections: ['c2'],
            },
          },
        };
        const state = reducer(prevState, actions.connection.receivedTradingPartnerConnections('conn3', ['c3']));

        expect(state).toEqual({
          tradingPartnerConnections: {
            conn1: {
              status: COMM_STATES.SUCCESS,
              connections: ['c1'],
            },
            conn2: {
              status: COMM_STATES.SUCCESS,
              connections: ['c2'],
            },
            conn3: {
              status: COMM_STATES.SUCCESS,
              connections: ['c3'],
            },
          },
        });
      });
    });

    describe('selector', () => {
      test('should return undefined when no active connection is present', () => {
        expect(selectors.activeConnection()).toBeUndefined();
        expect(selectors.activeConnection({})).toBeUndefined();
        expect(selectors.activeConnection({activeConnection: undefined})).toBeUndefined();
      });

      test('should return active connection when present', () => {
        const id = 'new-123';
        const state = reducer(undefined, actions.connection.setActive(id));

        expect(selectors.activeConnection(state)).toEqual(id);
      });

      test('should return null for debugLogs for empty state', () => {
        expect(selectors.debugLogs(undefined)).toEqual(null);
      });

      test('should return empty array for iclients for empty state', () => {
        expect(selectors.iClients(undefined)).toEqual([]);
      });

      test('should return empty array for queuedjobs for empty state', () => {
        expect(selectors.queuedJobs(undefined)).toEqual([]);
      });

      test('should return empty object for tradingPartner connections for empty state', () => {
        expect(selectors.tradingPartnerConnections(undefined)).toEqual({});
      });

      test('should return debugLogs when present', () => {
        const state = {
          debugLogs: {
            1: 'test log message',
            2: 'test message',
            3: 'request sent',
          },
        };

        expect(selectors.debugLogs(state)).toEqual(state.debugLogs);
      });

      test('should return iclients when present', () => {
        const state = {
          iClients: {
            1: ['iclientId1', 'iclientId11'],
            2: ['iclientId2'],
            3: ['iclientId3'],
          },
        };

        expect(selectors.iClients(state, '1')).toEqual(['iclientId1', 'iclientId11']);
        expect(selectors.iClients(state, '2')).toEqual(['iclientId2']);
      });

      test('should return queuedJobs when present', () => {
        const state = {
          queuedJobs: {
            1: ['queuedjob1', 'queuedjob11'],
            2: ['queuedjob2'],
            3: ['queuedjob3'],
          },
        };

        expect(selectors.queuedJobs(state, '1')).toEqual(['queuedjob1', 'queuedjob11']);
        expect(selectors.queuedJobs(state, '2')).toEqual(['queuedjob2']);
      });

      test('should return trading partner connections for the provided connection id when present', () => {
        let state = reducer(
          undefined,
          actions.connection.receivedTradingPartnerConnections('conn1', ['c1'])
        );

        state = reducer(
          state,
          actions.connection.receivedTradingPartnerConnections('conn2', ['c2'])
        );

        state = reducer(
          state,
          actions.connection.receivedTradingPartnerConnections('conn3', ['c3'])
        );

        state = reducer(
          state,
          actions.resource.connections.requestTradingPartnerConnections('conn4')
        );

        expect(selectors.tradingPartnerConnections(state, 'conn1')).toEqual({
          connections: [
            'c1',
          ],
          status: COMM_STATES.SUCCESS,
        });

        expect(selectors.tradingPartnerConnections(state, 'conn4')).toEqual({
          status: COMM_STATES.LOADING,
        });
      });
    });
  });
});


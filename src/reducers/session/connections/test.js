/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

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

      test('should set debug logs for the connection once received', () => {
        const prevState = {

        };

        const nextState = reducer(prevState, actions.connection.receivedDebugLogs('test log message', 'connId'));

        expect(nextState).toEqual({
          debugLogs: {
            connId: 'test log message',
          },
        });
      });

      test('should correctly update debug logs for the given connection when multiple connections debug logs are present', () => {
        const prevState = {
          debugLogs: {
            1: 'test log message',
            2: 'test message',
            3: 'request sent',
          },
        };

        const nextState = reducer(prevState, actions.connection.receivedDebugLogs('updated log message', '1'));

        expect(nextState).toEqual({
          debugLogs: {
            1: 'updated log message',
            2: 'test message',
            3: 'request sent',
          },
        });
      });

      test('should clear debug logs for the given connection', () => {
        const prevState = {
          debugLogs: {
            1: 'test log message',
            2: 'test message',
          },
        };

        const nextState = reducer(prevState, actions.connection.clearDebugLogs('1'));

        expect(nextState).toEqual({
          debugLogs: {
            2: 'test message',
          },
        });
      });

      test('should have state same as previous state when invoked with invalid connection id', () => {
        const prevState = {
          debugLogs: {
            1: 'test log message',
            2: 'test message',
          },
        };

        const nextState = reducer(prevState, actions.connection.clearDebugLogs('invalidId'));

        expect(nextState).toEqual({
          debugLogs: {
            1: 'test log message',
            2: 'test message',
          },
        });
      });

      test('should set iclients for the given connection once received', () => {
        const prevState = {

        };

        const nextState = reducer(prevState, actions.connection.updateIClients(['iclientId1'], 'connId'));

        expect(nextState).toEqual({
          iClients: {
            connId: ['iclientId1'],
          },
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

      test('should set queued jobs for the given connection once received', () => {
        const prevState = {

        };

        const nextState = reducer(prevState, actions.connection.receivedQueuedJobs(['queuedjob1'], 'connId'));

        expect(nextState).toEqual({
          queuedJobs: {
            connId: ['queuedjob1'],
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
    });
  });
});


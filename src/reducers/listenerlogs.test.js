/* global describe, expect, beforeEach, test */
import { selectors } from '.';
import { FILTER_KEY, getMockRequests} from '../utils/listenerLogs';

describe('Listener request logs region selectors test cases', () => {
  const exportId = 'exp-123';
  const flowId = 'flow-123';
  let state;

  beforeEach(() => {
    state = {
      user: {
        org: {
          accounts: [
            {_id: 'own', accessLevel: 'owner'},
            {
              _id: 'shareId',
              accepted: true,
              integrationAccessLevel: [{
                accessLevel: 'manage',
                _integrationId: 'int-123',
              }, {
                accessLevel: 'monitor',
                _integrationId: 'int-456',
              }],
            }],
        },
        preferences: { defaultAShareId: 'shareId' },
        profile: {
          developer: true,
        },
      },
      data: {
        resources: {
          exports: [{
            _id: exportId,
            name: 'webhook export',
            type: 'webhook',
          },
          {
            _id: 'exp-456',
            name: 'NS realtime export',
            type: 'distributed',
            _connectionId: 'conn-123',
          },
          {
            _id: 'exp-999',
            name: 'NS realtime export',
            type: 'distributed',
            _connectionId: 'conn-999',
          },
          {
            _id: '789',
            name: 'FTP export',
            adaptorType: 'FTPExport',
          },
          {
            _id: '1234',
            name: 'NS export',
            adaptorType: 'NetSuiteExport',
          }],
          flows: [{
            _id: flowId,
            name: 'DIY flow',
            _integrationId: 'int-123',
          },
          {
            _id: 'flow-456',
            name: 'DIY flow',
            _integrationId: 'int-456',
          }],
          integrations: [{
            _id: 'int-456',
            name: 'DIY integration',
            _registeredConnectionIds: ['conn-123', 'conn-999'],
          },
          {
            _id: 'int-123',
            name: 'DIY integration123',
            _registeredConnectionIds: ['conn-999'],
          }],
        },
      },
    };
  });
  describe('selectors.hasLogsAccess test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasLogsAccess()).toEqual(false);
    });
    test('should return false if resource type is not exports', () => {
      expect(selectors.hasLogsAccess(state, exportId, 'imports')).toEqual(false);
    });
    test('should return false if resource is not a realtime export', () => {
      expect(selectors.hasLogsAccess(state, '789', 'exports')).toEqual(false);
      expect(selectors.hasLogsAccess(state, '1234', 'exports')).toEqual(false);
    });
    test('should return true if resource is a realtime export and isNew is false', () => {
      expect(selectors.hasLogsAccess(state, exportId, 'exports')).toEqual(true);
    });
    test('should return false if resource is a realtime export and isNew is true', () => {
      expect(selectors.hasLogsAccess(state, exportId, 'exports', true)).toEqual(false);
    });
  });
  describe('selectors.canEnableDebug test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.canEnableDebug()).toEqual(false);
    });
    test('should return true if user has non-monitor access on the integration', () => {
      expect(selectors.canEnableDebug(state, exportId, flowId)).toEqual(true);
    });
    test('should return false if export is a webhook type and user has monitor access on the integration', () => {
      expect(selectors.canEnableDebug(state, exportId, 'flow-456')).toEqual(false);
    });
    test('should return false if export is non webhook and user does not have edit permission on the connection', () => {
      expect(selectors.canEnableDebug(state, 'exp-456', 'flow-456')).toEqual(false);
    });
    test('should return true if export is non webhook and user has edit permission on the connection', () => {
      expect(selectors.canEnableDebug(state, 'exp-999', 'flow-456')).toEqual(true);
    });
  });
  describe('selectors.logsInCurrPageSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.logsInCurrPageSelector()).toEqual([]);
    });
    test('should return empty array incase of no logs', () => {
      const state = {
        session: {
          logs: {
            listener: {
              [exportId]: {
                logsStatus: 'received',
                logsSummary: [],
                hasNewLogs: false,
              },
            },
          },
        },
      };

      expect(selectors.logsInCurrPageSelector(state, exportId)).toEqual([]);
    });
    test('should return empty array in case of no logs on the current page', () => {
      const state = {
        session: {
          filters: {
            [FILTER_KEY]: {
              paging: {
                currPage: 5,
              },
            },
          },
          logs: {
            listener: {
              [exportId]: {
                logsStatus: 'received',
                logsSummary: getMockRequests(),
                hasNewLogs: false,
              },
            },
          },
        },
      };

      expect(selectors.logsInCurrPageSelector(state, exportId)).toEqual([]);
    });
    test('should return correct logs list for the current page', () => {
      const state = {
        session: {
          filters: {
            [FILTER_KEY]: {
              paging: {
                currPage: 2,
              },
            },
          },
          logs: {
            listener: {
              [exportId]: {
                logsStatus: 'received',
                logsSummary: getMockRequests(),
                hasNewLogs: false,
              },
            },
          },
        },
      };

      expect(selectors.logsInCurrPageSelector(state, exportId)).toEqual([{
        key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-200-POST',
        time: 1615807924879,
        method: 'POST',
        statusCode: '200',
      }]);
    });
  });
});

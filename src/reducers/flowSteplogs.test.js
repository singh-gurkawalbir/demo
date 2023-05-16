
import { selectors } from '.';
import { FILTER_KEY } from '../utils/flowStepLogs';
import * as constants from '../utils/flowStepLogs';

const getMockRequests = () => [{
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

describe('Flow step request logs region selectors test cases', () => {
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
          connections: [{
            _id: 'conn-124',
            isHTTP: true,
            type: 'rest',
          },
          {
            _id: 'conn-125',
            isHTTP: false,
            type: 'rest',
          },
          ],
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
            _id: 'exp-125',
            name: 'GDrive',
            http: {
              type: 'file',
            },
            _connectionId: 'conn-123',
          },
          {
            _id: 'exp-126',
            name: 'HTTP Export',
            _connectionId: 'conn-123',
            adaptorType: 'HTTPExport',
          },
          {
            _id: 'exp-127',
            name: 'REST Export',
            _connectionId: 'conn-124',
            adaptorType: 'RESTExport',
          },
          {
            _id: 'exp-128',
            name: 'REST Export',
            _connectionId: 'conn-125',
            adaptorType: 'RESTExport',
          },
          {
            _id: 'exp-129',
            name: 'Van Listener',
            _connectionId: 'conn-125',
            adaptorType: 'VANExport',
          },
          {
            _id: 'exp-130',
            name: 'AS2 Listener',
            _connectionId: 'conn-125',
            adaptorType: 'AS2Export',
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
          imports: [
            {
              _id: 'imp-126',
              name: 'HTTP Import',
              _connectionId: 'conn-123',
              adaptorType: 'HTTPImport',
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
      expect(selectors.hasLogsAccess()).toBe(false);
    });
    test('should return false if resource type is HTTP export file provider', () => {
      expect(selectors.hasLogsAccess(state, 'exp-125', 'exports', false, flowId)).toBe(false);
    });
    test('should return true if resource type is HTTP export', () => {
      expect(selectors.hasLogsAccess(state, 'exp-126', 'exports', false, flowId)).toBe(true);
    });
    test('should return true if resource type is HTTP import', () => {
      expect(selectors.hasLogsAccess(state, 'imp-126', 'imports', false, flowId)).toBe(true);
    });
    test('should return false if resource is not a realtime export and not generic export', () => {
      expect(selectors.hasLogsAccess(state, '789', 'exports')).toBe(false);
      expect(selectors.hasLogsAccess(state, '1234', 'exports')).toBe(false);
    });
    test('should return true if resource is a realtime export and isNew is false', () => {
      expect(selectors.hasLogsAccess(state, exportId, 'exports', false, '123')).toBe(true);
    });
    test('should return false if resource is a realtime export, isNew is false and flow id is not set', () => {
      expect(selectors.hasLogsAccess(state, exportId, 'exports', false)).toBe(false);
    });
    test('should return false if resource is a realtime export and isNew is true', () => {
      expect(selectors.hasLogsAccess(state, exportId, 'exports', true, '123')).toBe(false);
    });
    test('should return true if resource is a rest export and isHTTP set to true in connection', () => {
      expect(selectors.hasLogsAccess(state, 'exp-127', 'exports', false, flowId)).toBe(true);
    });
    test('should return false if resource is a rest export and isHTTP set to false in connection', () => {
      expect(selectors.hasLogsAccess(state, 'exp-128', 'exports', false, flowId)).toBe(false);
    });
    test('should return false when adaptorType of export is VANExport', () => {
      expect(selectors.hasLogsAccess(state, 'exp-129', 'exports', false, flowId)).toBe(false);
    });
    test('should return false when adaptorType of export is AS2Export', () => {
      expect(selectors.hasLogsAccess(state, 'exp-130', 'exports', false, flowId)).toBe(false);
    });
  });
  describe('selectors.canEnableDebug test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.canEnableDebug()).toBe(false);
    });
    test('should return true if user has non-monitor user access', () => {
      state.user.org.accounts = [
        {_id: 'own', accessLevel: 'owner'},
        {
          _id: 'shareId',
          accepted: true,
          accessLevel: 'manage',
          integrationAccessLevel: [],
        }];
      expect(selectors.canEnableDebug(state, exportId, flowId)).toBe(true);
    });
    test('should return true if user has tile level permissions but has manage access on integration', () => {
      expect(selectors.canEnableDebug(state, exportId, flowId)).toBe(true);
    });
    test('should return false for monitor access', () => {
      expect(selectors.canEnableDebug(state, 'exp-456', 'flow-456')).toBe(false);
    });
  });
  describe('selectors.mkLogsInCurrPageSelector test cases', () => {
    const selector = selectors.mkLogsInCurrPageSelector();

    test('should not throw any exception for invalid arguments', () => {
      expect(selector()).toEqual([]);
    });
    test('should return empty array incase of no logs', () => {
      const state = {
        session: {
          logs: {
            flowStep: {
              [exportId]: {
                logsStatus: 'received',
                logsSummary: [],
                hasNewLogs: false,
              },
            },
          },
        },
      };

      expect(selector(state, exportId)).toEqual([]);
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
            flowStep: {
              [exportId]: {
                logsStatus: 'received',
                logsSummary: getMockRequests(),
                hasNewLogs: false,
              },
            },
          },
        },
      };

      expect(selector(state, exportId)).toEqual([]);
    });
    test('should return correct logs list for the current page', () => {
      constants.DEFAULT_ROWS_PER_PAGE = 2;
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
            flowStep: {
              [exportId]: {
                logsStatus: 'received',
                logsSummary: getMockRequests(),
                hasNewLogs: false,
              },
            },
          },
        },
      };

      expect(selector(state, exportId)).toEqual([{
        key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-200-POST',
        time: 1615807924879,
        method: 'POST',
        statusCode: '200',
      }]);
    });
  });
});

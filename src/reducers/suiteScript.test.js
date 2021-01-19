/* global describe, expect, test */
import each from 'jest-each';
import reducer, { selectors } from '.';
import actions from '../actions';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  SUITESCRIPT_CONNECTORS,
  TILE_STATUS,
} from '../utils/constants';

/**
 * TODO: Ignoring SS tests for sometime and Shiva needs to fix these.
 */

describe('suiteScriptLinkedConnections selector', () => {
  const data = {
    resources: {
      integrations: [
        { _id: 'i1', _registeredConnectionIds: ['c1'] },
        { _id: 'i2', sandbox: false, _registeredConnectionIds: ['c2', 'c3'] },
        { _id: 'i3_SB', sandbox: true, _registeredConnectionIds: ['c5'] },
        { _id: 'i4' },
        { _id: 'i5', sandbox: true },
      ],
      connections: [
        { _id: 'c1' },
        { _id: 'c2', sandbox: false },
        { _id: 'c3', sandbox: false },
        { _id: 'c4' },
        { _id: 'c5_SB', sandbox: true },
        { _id: 'c6_SB', sandbox: true },
      ],
    },
  };
  const ownerUser = {
    preferences: {
      defaultAShareId: ACCOUNT_IDS.OWN,
      ssConnectionIds: ['c1', 'c2', 'c5_SB'],
    },
    org: {
      accounts: [
        {
          _id: ACCOUNT_IDS.OWN,
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        },
      ],
    },
  };
  const orgUser = {
    preferences: {
      ssConnectionIds: ['c1'],
    },
    org: {
      accounts: [
        {
          _id: 'aShare1',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        },
        {
          _id: 'aShare2',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
        },
        {
          _id: 'aShare3',
          accessLevel: USER_ACCESS_LEVELS.TILE,
          integrationAccessLevel: [
            {
              _integrationId: 'i1',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
            },
            {
              _integrationId: 'i2',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
          ],
        },
        {
          _id: 'aShare4',
          accessLevel: USER_ACCESS_LEVELS.TILE,
          integrationAccessLevel: [
            {
              _integrationId: 'i1',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
            {
              _integrationId: 'i2',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
          ],
        },
        {
          _id: 'aShare5',
          accessLevel: USER_ACCESS_LEVELS.TILE,
          integrationAccessLevel: [
            {
              _integrationId: 'i4',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
            },
            {
              _integrationId: 'i5_SB',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
          ],
        },
      ],
    },
  };
  const testCases = [
    ['should return [] when state is undefined', undefined, {}, []],
    [
      'should return correct results for account owner (in production environment)',
      ownerUser,
      {},
      [
        {
          _id: 'c1',
          permissions: { accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER },
        },
        {
          _id: 'c2',
          sandbox: false,
          permissions: { accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER },
        },
      ],
    ],
    [
      'should return correct results for account owner (in sandbox environment)',
      ownerUser,
      { environment: 'sandbox' },
      [
        {
          _id: 'c5_SB',
          sandbox: true,
          permissions: { accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER },
        },
      ],
    ],
    [
      'should return correct results for account level manage user',
      orgUser,
      { defaultAShareId: 'aShare1' },
      [
        {
          _id: 'c1',
          permissions: { accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE },
        },
      ],
    ],
    [
      'should return correct results for account level monitor user',
      orgUser,
      { defaultAShareId: 'aShare2' },
      [
        {
          _id: 'c1',
          permissions: { accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR },
        },
      ],
    ],
    [
      'should return correct results for tile level manage user',
      orgUser,
      { defaultAShareId: 'aShare3' },
      [
        {
          _id: 'c1',
          permissions: {
            accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
          },
        },
      ],
    ],
    [
      'should return correct results for tile level monitor user',
      orgUser,
      { defaultAShareId: 'aShare4' },
      [
        {
          _id: 'c1',
          permissions: {
            accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
          },
        },
      ],
    ],
    [
      'should return [] for tile level user (when the linked connection is not registered on any integrations that the user has access to)',
      orgUser,
      { defaultAShareId: 'aShare5' },
      [],
    ],
  ];

  each(testCases).test('%s', (name, userState, preferences, expected) => {
    const user = { ...userState };

    user.preferences = { ...user.preferences, ...preferences };
    const newState = reducer({ user, data }, 'some action');

    expect(selectors.suiteScriptLinkedConnections(newState)).toEqual(expected);
  });
});

describe('suiteScriptIntegrations selector', () => {
  const data = {
    suiteScript: {
      connection1: {
        tiles: [
          { _integrationId: 'i1', name: 'i one' },
          { _integrationId: 'i2', name: 'i two' },
          {
            _integrationId: 'i3',
            name: SUITESCRIPT_CONNECTORS[0].name,
            mode: 'install',
          },
        ],
      },
      connection2: {
        tiles: [
          { _integrationId: 'i3', name: 'i three' },
          {
            _integrationId: 'i4',
            name: SUITESCRIPT_CONNECTORS[1].name,
            mode: 'settings',
          },
        ],
      },
    },
  };
  const testCases = [
    [
      'should return [] for a connection on which user has no permissions',
      { _id: 'some connection' },
      [],
    ],
    [
      'should return correct results for a connection on which user has manage permissions',
      { _id: 'connection1', permissions: { accessLevel: 'manage' } },
      [
        {
          _id: 'i1',
          name: 'i one',
          displayName: 'i one',
          isNotEditable: false,
        },
        {
          _id: 'i2',
          name: 'i two',
          displayName: 'i two',
          isNotEditable: false,
        },
        {
          _id: 'i3',
          _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
          name: SUITESCRIPT_CONNECTORS[0].name,
          displayName: SUITESCRIPT_CONNECTORS[0].name,
          isNotEditable: false,
          mode: 'install',
          urlName: 'sfns',
        },
      ],
    ],
    [
      'should return correct results for a connection on which user has monitor permissions',
      { _id: 'connection2', permissions: { accessLevel: 'monitor' } },
      [
        {
          _id: 'i3',
          name: 'i three',
          displayName: 'i three',
          isNotEditable: false,
        },
        {
          _id: 'i4',
          _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
          name: SUITESCRIPT_CONNECTORS[1].name,
          displayName: SUITESCRIPT_CONNECTORS[1].name,
          isNotEditable: false,
          mode: 'settings',
          urlName: 'svbns',
        },
      ],
    ],
  ];
  const state = reducer({}, 'some action');
  const tilesReceivedAction = actions.resource.receivedCollection(
    'suitescript/connections/connection1/tiles',
    data.suiteScript.connection1.tiles
  );
  const newState = reducer(state, tilesReceivedAction);
  const tilesReceivedAction2 = actions.resource.receivedCollection(
    'suitescript/connections/connection2/tiles',
    data.suiteScript.connection2.tiles
  );
  const newState2 = reducer(newState, tilesReceivedAction2);

  each(testCases).test('%s', (name, connection, expected) => {
    expect(selectors.suiteScriptIntegrations(newState2, connection._id)).toEqual(expected);
  });
});

describe('suiteScriptTiles selector', () => {
  const data = {
    resources: {},
    suiteScript: {
      connection1: {
        tiles: [
          { _integrationId: 'i1', name: 'i one' },
          { _integrationId: 'i2', name: 'i two', numError: 10 },
          {
            _integrationId: 'i3',
            name: SUITESCRIPT_CONNECTORS[0].name,
            mode: 'install',
          },
        ],
      },
      connection2: {
        tiles: [
          { _integrationId: 'i3', name: 'i three' },
          {
            _integrationId: 'i4',
            name: SUITESCRIPT_CONNECTORS[1].name,
            mode: 'settings',
          },
        ],
      },
    },
  };
  const testCases = [
    [
      'should return [] for a connection on which user has no permissions',
      { _id: 'some connection' },
      [],
    ],
    [
      'should return correct results for a connection on which user has manage permissions',
      {
        _id: 'connection1',
        netsuite: { account: 'NSAccount1' },
        permissions: { accessLevel: 'manage' },
      },
      [
        {
          ssLinkedConnectionId: 'connection1',
          _integrationId: 'i1',
          name: 'i one',
          displayName: 'i one',
          status: TILE_STATUS.SUCCESS,
        },
        {
          ssLinkedConnectionId: 'connection1',
          _integrationId: 'i2',
          name: 'i two',
          displayName: 'i two',
          status: TILE_STATUS.HAS_ERRORS,
          numError: 10,
        },
        {
          ssLinkedConnectionId: 'connection1',
          _integrationId: 'i3',
          name: SUITESCRIPT_CONNECTORS[0].name,
          displayName: SUITESCRIPT_CONNECTORS[0].name,
          status: TILE_STATUS.IS_PENDING_SETUP,
          _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
          mode: 'install',
          urlName: SUITESCRIPT_CONNECTORS[0].urlName,
        },
      ],
    ],
    [
      'should return correct results for a connection on which user has monitor permissions',
      {
        _id: 'connection2',
        netsuite: { account: 'NSAccount2' },
        permissions: { accessLevel: 'monitor' },
      },
      [
        {
          ssLinkedConnectionId: 'connection2',
          _integrationId: 'i3',
          name: 'i three',
          displayName: 'i three',
          status: TILE_STATUS.SUCCESS,
        },
        {
          ssLinkedConnectionId: 'connection2',
          _integrationId: 'i4',
          name: SUITESCRIPT_CONNECTORS[1].name,
          displayName: SUITESCRIPT_CONNECTORS[1].name,
          status: TILE_STATUS.SUCCESS,
          _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
          mode: 'settings',
          urlName: SUITESCRIPT_CONNECTORS[1].urlName,
        },
      ],
    ],
  ];
  const state = reducer({}, 'some action');
  const tilesReceivedAction = actions.resource.receivedCollection(
    'suitescript/connections/connection1/tiles',
    data.suiteScript.connection1.tiles
  );
  const newState = reducer(state, tilesReceivedAction);
  const tilesReceivedAction2 = actions.resource.receivedCollection(
    'suitescript/connections/connection2/tiles',
    data.suiteScript.connection2.tiles
  );
  const newState2 = reducer(newState, tilesReceivedAction2);

  each(testCases).test('%s', (name, connection, expected) => {
    expect(selectors.suiteScriptTiles(newState2, connection._id)).toEqual(expected);
  });
});

describe('suiteScriptLinkedTiles selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptLinkedTiles(undefined, {})).toEqual([]);
  });
});

describe('makeSuiteScriptIAFlowSections selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    const selector = selectors.makeSuiteScriptIAFlowSections();

    expect(selector(undefined, {})).toEqual([]);
  });
});

describe('makeSuiteScriptIASections selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    const selector = selectors.makeSuiteScriptIASections();

    expect(selector(undefined, {})).toEqual([]);
  });
});

describe('suiteScriptResourceStatus selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptResourceStatus(undefined, {})).toEqual({
      hasData: false,
      isLoading: false,
      method: 'GET',
      isReady: false,
      retryCount: 0,
    });
    expect(selectors.suiteScriptResourceStatus({}, {})).toEqual({
      hasData: false,
      isLoading: false,
      method: 'GET',
      isReady: false,
      retryCount: 0,
    });
  });
  test('should return correct resource status if resource has no data and is loading', () => {
    const integrationId = 'int-id-123';
    const ssLinkedConnectionId = 'linked-ns-id';
    const state = {
      comms: {
        networkComms: {
          'GET:/suitescript/connections/linked-ns-id/integrations/int-id-123/flows': {
            status: 'loading',
            retry: 2,
          },
        },
      },
      data: {
        suiteScript: {
          'linked-ns-id': {
          },
        },
      },
    };
    const expectedOutput = {
      resourceType: 'flows',
      hasData: false,
      isLoading: true,
      retryCount: 2,
      method: 'GET',
      isReady: false,
    };

    expect(selectors.suiteScriptResourceStatus(state, {
      resourceType: 'flows',
      ssLinkedConnectionId,
      integrationId })).toEqual(expectedOutput);
  });
  test('should return correct resource status if resource is loaded and ready', () => {
    const integrationId = 'int-id-123';
    const ssLinkedConnectionId = 'linked-ns-id';
    const state = {
      comms: {
        networkComms: {
          'GET:/suitescript/connections/linked-ns-id/integrations/int-id-123/flows': {
            status: 'loading',
            retry: 2,
          },
          'PUT:/suitescript/connections/linked-ns-id/integrations': {
            status: 'success',
          },
        },
      },
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: '201'}],
          },
        },
      },
    };
    const expectedOutput = {
      resourceType: 'integrations',
      hasData: true,
      isLoading: false,
      retryCount: 0,
      method: 'PUT',
      isReady: true,
    };

    expect(selectors.suiteScriptResourceStatus(state, {
      resourceType: 'integrations',
      ssLinkedConnectionId,
      integrationId,
      resourceReqMethod: 'PUT' })).toEqual(expectedOutput);
  });
});

describe('suiteScriptResourceData selector', () => {
  const resourceType = 'flows';
  const id = 'ri3401';
  const ssLinkedConnectionId = 'linked-ns-id';
  const integrationId = 'int-id-456';
  const suiteScriptResourceKey = 'linked-ns-id-flows-ri3401';

  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptResourceData(undefined, {})).toEqual({});
    expect(selectors.suiteScriptResourceData({}, {})).toEqual({});
  });
  test('should return empty merged object if both resource and its patch does not exist', () => {
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_id: integrationId, _connectorId: 'suitescript-salesforce-netsuite'}],
            flows: [{
              name: 'Salesforce Account to Customer',
              _id: 'ri3408',
              _integrationId: integrationId,
            }],
          },
        },
      },
      session: {
        stage: {},
      },
    };

    const expectedOutput = {
      merged: {},
    };

    expect(selectors.suiteScriptResourceData(state, {resourceType, id, ssLinkedConnectionId, integrationId, scope: 'value'})).toEqual(expectedOutput);
  });
  test('should return original resource data if no patch exists', () => {
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_id: integrationId, _connectorId: 'suitescript-salesforce-netsuite'}],
            flows: [{
              name: 'Salesforce Account to Customer',
              _id: 'ri3401',
              _integrationId: integrationId,
            }],
          },
        },
      },
      session: {
        stage: {},
      },
    };

    const expectedOutput = {
      master: {
        name: 'Salesforce Account to Customer',
        _id: 'ri3401',
        _integrationId: integrationId,
      },
      merged: {
        name: 'Salesforce Account to Customer',
        _id: 'ri3401',
        _integrationId: integrationId,
      },
    };

    expect(selectors.suiteScriptResourceData(state, {resourceType, id, ssLinkedConnectionId, integrationId, scope: 'value'})).toEqual(expectedOutput);
  });
  test('should return original, patched and merged data along with lastChange if patch exists', () => {
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_id: integrationId, _connectorId: 'suitescript-salesforce-netsuite'}],
            flows: [{
              name: 'Salesforce Account to Customer',
              ssLinkedConnectionId,
              type: 'REALTIME_IMPORT',
              _flowId: '24',
              _id: 'ri3401',
              _integrationId: integrationId,
              import: {
                netsuite: {
                  recordType: 'customer',
                  subRecordImports: [],
                },
              },
            }],
          },
        },
      },
      session: {
        stage: {
          [suiteScriptResourceKey]: {
            patch: [
              {op: 'replace',
                path: '/import/netsuite/subRecordImports',
                scope: 'value',
                timestamp: 123455,
                value: [
                  {
                    operation: 'add',
                    recordType: 'account',
                    referenceFieldId: 'contact',
                  },
                ],
              },
            ],
          },
        },
      },
    };

    const expectedOutput = {
      master: {
        name: 'Salesforce Account to Customer',
        ssLinkedConnectionId,
        type: 'REALTIME_IMPORT',
        _flowId: '24',
        _id: 'ri3401',
        _integrationId: integrationId,
        import: {
          netsuite: {
            recordType: 'customer',
            subRecordImports: [],
          },
        },
      },
      patch: [
        {op: 'replace',
          path: '/import/netsuite/subRecordImports',
          scope: 'value',
          timestamp: 123455,
          value: [
            {
              operation: 'add',
              recordType: 'account',
              referenceFieldId: 'contact',
            },
          ],
        },
      ],
      lastChange: 123455,
      merged: {
        name: 'Salesforce Account to Customer',
        ssLinkedConnectionId,
        type: 'REALTIME_IMPORT',
        _flowId: '24',
        _id: 'ri3401',
        _integrationId: integrationId,
        import: {
          netsuite: {
            recordType: 'customer',
            subRecordImports: [{
              operation: 'add',
              recordType: 'account',
              referenceFieldId: 'contact',
            }],
          },
        } },
    };

    expect(selectors.suiteScriptResourceData(state, {resourceType, id, ssLinkedConnectionId, integrationId, scope: 'value'})).toEqual(expectedOutput);
  });
});

describe('suiteScriptIASettings selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptIASettings(undefined, {})).toEqual(null);
  });
});

describe('suiteScriptFlowSettings selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFlowSettings(undefined, {})).toEqual({});
  });
});

describe('suiteScriptFlowConnectionList selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFlowConnectionList(undefined, {})).toEqual([]);
    expect(selectors.suiteScriptFlowConnectionList({}, {})).toEqual([]);
  });
  test('should not include ACTIVITY_STREAM connection id in the returned list', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const flowId = 'flow-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: '201'}],
            connections: [{id: 'ACTIVITY_STREAM', name: 'Activity Stream', type: 'ftp'}],
          },
        },
      },
    };

    expect(selectors.suiteScriptFlowConnectionList(state, { ssLinkedConnectionId, flowId })).toEqual([]);
  });
  test('should return JAVA connection id if its a Java flow', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const flowId = 'flow-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: '201'}],
            flows: [{_id: 'flow-123', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}}],
            connections: [
              {id: 'ACTIVITY_STREAM', name: 'Activity Stream', type: 'ftp'},
              {id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION', name: 'NetSuite Connection', type: 'netsuite'},
              {id: 'abc', name: 'Export conn id'},
            ],
          },
        },
      },
    };
    const expectedConnections = [
      {id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION', name: 'NetSuite Connection', type: 'netsuite'},
      {id: 'abc', name: 'Export conn id'},
    ];

    expect(selectors.suiteScriptFlowConnectionList(state, { ssLinkedConnectionId, flowId })).toEqual(expectedConnections);
  });
  test('should return all exports and imports connections', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const flowId = 'flow-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: '201'}],
            flows: [{_id: 'flow-123', export: {_connectionId: 'abc'}, import: {_connectionId: 'def'}}],
            connections: [
              {id: 'ACTIVITY_STREAM', name: 'Activity Stream', type: 'ftp'},
              {id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION', name: 'NetSuite Connection', type: 'netsuite'},
              {id: 'abc', name: 'Export conn id'},
              {id: 'def', name: 'Import conn id'},
            ],
          },
        },
      },
    };
    const expectedConnections = [
      {id: 'abc', name: 'Export conn id'},
      {id: 'def', name: 'Import conn id'},
    ];

    expect(selectors.suiteScriptFlowConnectionList(state, { ssLinkedConnectionId, flowId })).toEqual(expectedConnections);
  });
});

describe('suiteScriptIntegrationConnectionList selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptIntegrationConnectionList(undefined, {})).toEqual([]);
    expect(selectors.suiteScriptIntegrationConnectionList({}, {})).toEqual([]);
  });
  test('should return connections list if no integration id is passed and not include ACTIVITY_STREAM connection', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: '201'}],
            connections: [{id: 'ACTIVITY_STREAM', name: 'Activity Stream', type: 'ftp'}],
          },
        },
      },
    };

    expect(selectors.suiteScriptIntegrationConnectionList(state, { ssLinkedConnectionId })).toEqual([]);
  });
  test('should return exports and imports connections for all flows if integration id is passed', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            flows: [
              {
                import: {_connectionId: 'SALESFORCE_CONNECTION', type: 'salesforce'},
                name: 'Assembly Item To Salesforce Product',
                ssLinkedConnectionId: 'linked-ns-id',
                type: 'REALTIME_EXPORT',
                _flowId: '1',
                _id: 're2001',
                _integrationId: 'int-123',
              },
              {
                export: {_connectionId: 'NETSUITE_CONNECTION', type: 'netsuite'},
                name: 'SO import',
                ssLinkedConnectionId: 'linked-ns-id',
                type: 'EXPORT',
                _flowId: '3',
                _id: 're2003',
                _integrationId: 'int-123'},
            ],
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: '201'}],
            connections: [
              {id: 'ACTIVITY_STREAM', name: 'Activity Stream', type: 'ftp'},
              {id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION', name: 'NetSuite Connection', type: 'netsuite'},
              {id: 'SALESFORCE_CONNECTION', name: 'Export conn id'},
              {id: 'NETSUITE_CONNECTION', name: 'Import conn id'},
            ],
          },
        },
      },
    };
    const expectedConnections = [
      {id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION', name: 'NetSuite Connection', type: 'netsuite'},
      {id: 'SALESFORCE_CONNECTION', name: 'Export conn id'},
      {id: 'NETSUITE_CONNECTION', name: 'Import conn id'},
    ];

    expect(selectors.suiteScriptIntegrationConnectionList(state, { ssLinkedConnectionId, integrationId })).toEqual(expectedConnections);
  });
});

describe('suiteScriptTestConnectionCommState selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptTestConnectionCommState(undefined)).toEqual({commState: null, message: null});
    expect(selectors.suiteScriptTestConnectionCommState({})).toEqual({commState: null, message: null});
  });
  test('should return correct comm status and message', () => {
    const ssLinkedConnectionId = 'ns-linked-id';
    const resourceId = 'flow-123';
    const state = {
      comms: {
        suiteScript: {
          ping: {
            'ns-linked-id': {
              'flow-123': {
                status: 'aborted',
                message: 'Call Aborted',
              },
            },
            'ns-linked-id2': {},
          },
        },
      },
    };
    const expectedOutput = {
      commState: 'aborted',
      message: 'Call Aborted',
    };

    expect(selectors.suiteScriptTestConnectionCommState(state, resourceId, ssLinkedConnectionId)).toEqual(expectedOutput);
    expect(selectors.suiteScriptTestConnectionCommState(state, 'someid', 'ns-linked-id2')).toEqual({commState: null, message: null});
  });
});

describe('suiteScriptJob selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptJob(undefined, {})).toEqual();
  });
});

describe('netsuiteAccountHasSuiteScriptIntegrations selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.netsuiteAccountHasSuiteScriptIntegrations(undefined, {})).toEqual(false);
  });
});

describe('canLinkSuiteScriptIntegrator selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.canLinkSuiteScriptIntegrator(undefined, {})).toEqual(false);
  });
});

describe('suiteScriptIntegratorLinkedConnectionId selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptIntegratorLinkedConnectionId(undefined, {})).toEqual();
  });
});

describe('suiteScriptIntegrationAppInstallerData selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptIntegrationAppInstallerData(undefined, {})).toEqual(null);
    expect(selectors.suiteScriptIntegrationAppInstallerData({}, {})).toEqual({steps: []});
  });
  test('should correctly update the current step flag on install steps', () => {
    const integrationId = 'sf-ns';
    const state = {
      session: {
        suiteScript: {
          installer: {
            'sf-ns': {
              steps: [{
                name: 'NetSuite Connection',
                type: 'connection',
                completed: true,
                __index: 1,
              },
              {
                completed: false,
                name: 'Integrator Bundle',
                type: 'integrator-bundle',
                __index: 2,
              }],
            },
          },
        },
      },
    };
    const expectedOutput = {
      steps: [{
        name: 'NetSuite Connection',
        type: 'connection',
        completed: true,
        __index: 1,
      },
      {
        completed: false,
        name: 'Integrator Bundle',
        type: 'integrator-bundle',
        __index: 2,
        isCurrentStep: true,
      }],
    };

    expect(selectors.suiteScriptIntegrationAppInstallerData(state, integrationId)).toEqual(expectedOutput);
    expect(selectors.suiteScriptIntegrationAppInstallerData(state, 'dummyid')).toEqual({steps: []});
  });
});

describe('isSuiteScriptIntegrationAppInstallComplete selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.isSuiteScriptIntegrationAppInstallComplete(undefined, {})).toEqual(null);
    expect(selectors.isSuiteScriptIntegrationAppInstallComplete({}, {})).toEqual(false);
  });
  test('should return false if install steps are empty or undefined', () => {
    const integrationId = 'sf-ns';
    const state = {
      session: {
        suiteScript: {
          installer: {
            'sf-ns': {
              steps: [],
            },
            'svb-ns': {},
          },
        },
      },
    };

    expect(selectors.isSuiteScriptIntegrationAppInstallComplete(state, integrationId)).toEqual(false);
    expect(selectors.isSuiteScriptIntegrationAppInstallComplete(state, 'svb-ns')).toEqual(false);
  });
  test('should return false if any step is incomplete', () => {
    const integrationId = 'sf-ns';
    const state = {
      session: {
        suiteScript: {
          installer: {
            'sf-ns': {
              steps: [{
                name: 'NetSuite Connection',
                type: 'connection',
                completed: true,
                __index: 1,
              },
              {
                completed: false,
                name: 'Integrator Bundle',
                type: 'integrator-bundle',
                __index: 2,
              }],
            },
          },
        },
      },
    };

    expect(selectors.isSuiteScriptIntegrationAppInstallComplete(state, integrationId)).toEqual(false);
  });
  test('should return true if all steps are completed', () => {
    const integrationId = 'sf-ns';
    const state = {
      session: {
        suiteScript: {
          installer: {
            'sf-ns': {
              steps: [{
                name: 'NetSuite Connection',
                type: 'connection',
                completed: true,
                __index: 1,
              },
              {
                completed: true,
                name: 'Integrator Bundle',
                type: 'integrator-bundle',
                __index: 2,
              }],
            },
          },
        },
      },
    };

    expect(selectors.isSuiteScriptIntegrationAppInstallComplete(state, integrationId)).toEqual(true);
  });
});

describe('userHasManageAccessOnSuiteScriptAccount selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.userHasManageAccessOnSuiteScriptAccount(undefined, {})).toEqual(false);
  });
});

describe('suiteScriptFlowDetail selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFlowDetail(undefined, {})).toEqual();
    expect(selectors.suiteScriptFlowDetail({}, {})).toEqual();
  });
  test('should return undefined if flows list is empty', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int-123';
    const flowId = 'flow-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_id: integrationId, _connectorId: 'suitescript-salesforce-netsuite'}],
          },
        },
      },
    };

    expect(selectors.suiteScriptFlowDetail(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual(undefined);
  });
  test('should return undefined if requested flow does not exist in flows list', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int-123';
    const flowId = 'flow-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_id: integrationId, _connectorId: 'suitescript-salesforce-netsuite'}],
            flows: [
              {_id: 'flow-768', type: 'REALTIME_IMPORT', ssLinkedConnectionId, _integrationId: integrationId},
              {_id: 'flow-456', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}, ssLinkedConnectionId, _integrationId: integrationId},
            ],
          },
        },
      },
    };

    expect(selectors.suiteScriptFlowDetail(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual(undefined);
  });
  test('should return requested flow details from flows list', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int-123';
    const flowId = 'flow-123';
    const state = {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_id: integrationId, _connectorId: 'suitescript-salesforce-netsuite'}],
            flows: [
              {_id: 'flow-768', type: 'REALTIME_IMPORT', ssLinkedConnectionId, _integrationId: integrationId},
              {_id: 'flow-123', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}, ssLinkedConnectionId, _integrationId: integrationId},
            ],
          },
        },
      },
    };
    const expectedFlow = {_id: 'flow-123', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}, ssLinkedConnectionId, _integrationId: integrationId};

    expect(selectors.suiteScriptFlowDetail(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedFlow);
  });
});

describe('suiteScriptNetsuiteMappingSubRecord selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptNetsuiteMappingSubRecord(undefined, {})).toEqual({data: undefined, status: undefined});
  });
});

describe('suiteScriptImportSampleData selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptImportSampleData(undefined, {})).toEqual({data: undefined, status: undefined});
  });
});

describe('suiteScriptGenerates selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptGenerates(undefined, {})).toEqual({data: undefined, status: undefined});
  });
});

describe('suiteScriptFlowSampleData selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFlowSampleData(undefined, {})).toEqual({data: undefined, status: undefined});
  });
});

describe('suiteScriptExtracts selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptExtracts(undefined, {})).toEqual({data: undefined, status: undefined});
  });
});

describe('suiteScriptSalesforceMasterRecordTypeInfo selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptSalesforceMasterRecordTypeInfo(undefined, {})).toEqual({data: undefined, status: undefined});
  });
});

describe('suiteScriptFileExportSampleData selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFileExportSampleData(undefined, {})).toEqual();
  });
});

describe('getSuitescriptMappingSubRecordList selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.getSuitescriptMappingSubRecordList(undefined, {})).toEqual([]);
  });
});

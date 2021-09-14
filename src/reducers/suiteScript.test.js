/* global describe, expect, test, beforeEach */
import each from 'jest-each';
import reducer, { selectors } from '.';
import actions from '../actions';
import suitescriptActions from '../actions/suiteScript';
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
  test('should return empty object if there are no sections availabele', () => {
    const selector = selectors.makeSuiteScriptIAFlowSections();

    expect(selector({}, {})).toEqual([]);
  });
  test('should return correct object if sections are available', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int1';
    const settings = {
      general: {
        description: 'general settings',
        id: 'gensettings',
      },
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
          fields: ['something'],
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [{
            id: 'lineitemSync',
          }],
        },
      ],
    };
    const state = reducer({
      data: {
        suiteScript: {
          'linked-ns-id': {
            settings: {},
          },
        },
      },
    }, suitescriptActions.resource.received(ssLinkedConnectionId, integrationId, 'settings', settings));
    const selector = selectors.makeSuiteScriptIAFlowSections();

    expect(selector(state, integrationId, ssLinkedConnectionId)).toEqual([
      {
        id: 'accountsync',
        title: 'Account Sync',
        fields: ['something'],
        titleId: 'AccountSync',
      },
      {
        id: 'opportunitysync',
        title: 'Opportunity Sync',
        titleId: 'OpportunitySync',
        sections: [{
          id: 'lineitemSync',
          title: 'Common',
        }],
      },
    ]);
  });
});

describe('makeSuiteScriptIASections selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    const selector = selectors.makeSuiteScriptIASections();

    expect(selector(undefined, {})).toEqual([]);
  });
  test('should return empty array when there are no sections defined', () => {
    const selector = selectors.makeSuiteScriptIASections();

    expect(selector({}, {})).toEqual([]);
  });
  test('should return correct object when sections are avialable and general settings is not available', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int1';
    const settings = {
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
          fields: ['something'],
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [{
            id: 'lineitemSync',
          }],
        },
      ],
    };
    const state = reducer({
      data: {
        suiteScript: {
          'linked-ns-id': {
            settings: {},
          },
        },
      },
    }, suitescriptActions.resource.received(ssLinkedConnectionId, integrationId, 'settings', settings));
    const selector = selectors.makeSuiteScriptIASections();

    expect(selector(state, integrationId, ssLinkedConnectionId)).toEqual([
      {
        id: 'accountsync',
        title: 'Account Sync',
        fields: ['something'],
        titleId: 'AccountSync',
      },
      {
        id: 'opportunitysync',
        title: 'Opportunity Sync',
        titleId: 'OpportunitySync',
        sections: [{
          id: 'lineitemSync',
          title: 'Common',
        }],
      },
    ]);
  });
  test('should return correct object when both sections and general settings are avialable', () => {
    const ssLinkedConnectionId = 'linked-ns-id';
    const integrationId = 'int1';
    const settings = {
      general: {
        description: 'general settings',
        id: 'gensettings',
        title: 'General',
      },
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
          fields: ['something'],
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [{
            id: 'lineitemSync',
          }],
        },
      ],
    };
    const state = reducer({
      data: {
        suiteScript: {
          'linked-ns-id': {
            settings: {},
          },
        },
      },
    }, suitescriptActions.resource.received(ssLinkedConnectionId, integrationId, 'settings', settings));
    const selector = selectors.makeSuiteScriptIASections();

    expect(selector(state, integrationId, ssLinkedConnectionId)).toEqual([
      {
        description: 'general settings',
        id: 'genSettings',
        title: 'General',
        titleId: 'General',
      },
      {
        id: 'accountsync',
        title: 'Account Sync',
        fields: ['something'],
        titleId: 'AccountSync',
      },
      {
        id: 'opportunitysync',
        title: 'Opportunity Sync',
        titleId: 'OpportunitySync',
        sections: [{
          id: 'lineitemSync',
          title: 'Common',
        }],
      },
    ]);
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
  test('should return correct object', () => {
    const settings = {
      general: {
        description: 'general settings',
        id: 'gensettings',
      },
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [{
            id: 'lineitemSync',
          }],
        },
      ],
    };
    const state = reducer({
      data: {
        suiteScript: {
          connId: {
            settings: {

            },
          },
        },
      },
    }, suitescriptActions.resource.received('connId', 'int1', 'settings', settings));

    expect(selectors.suiteScriptIASettings(state, 'int1', 'connId')).toEqual({
      general: {
        description: 'general settings',
        id: 'gensettings',
      },
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [
            {
              id: 'lineitemSync',
              title: 'Common',
            },
          ],
        },
      ],
      settings: {

      },
    });
  });
});

describe('suiteScriptFlowSettings selector', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFlowSettings(undefined, {})).toEqual({});
  });
  const ssLinkedConnectionId = 'linked-ns-id';
  const integrationId = 'int1';
  const state = reducer(
    {
      data: {
        suiteScript: {
          'linked-ns-id': {
            integrations: [{_connectorId: 'suitescript-salesforce-netsuite', _id: integrationId}],
            flows: [
              {_id: 'flow-768', flowGUID: 'flow-768', type: 'REALTIME_IMPORT', ssLinkedConnectionId, _integrationId: integrationId},
              {_id: 'flow-123', flowGUID: 'flow-123', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}, ssLinkedConnectionId, _integrationId: integrationId},
            ],
            connections: [
              {id: 'ACTIVITY_STREAM', name: 'Activity Stream', type: 'ftp'},
              {id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION', name: 'NetSuite Connection', type: 'netsuite'},
              {id: 'abc', name: 'Export conn id'},
            ],
            settings: {},
          },
        },
      },
    },
    'some-action'
  );
  const settings = {
    general: {
      description: 'general settings',
      id: 'gensettings',
    },
    sections: [
      {
        id: 'accountsync',
        title: 'Account Sync',
        fields: ['something'],
        flows: [{_id: 'flow-123', flowGUID: 'flow-123', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}, ssLinkedConnectionId, _integrationId: integrationId}],
      },
      {
        id: 'opportunitysync',
        title: 'Opportunity Sync',
        flows: [
          {_id: 'flow-768', type: 'REALTIME_IMPORT', ssLinkedConnectionId, _integrationId: integrationId},
        ],
        sections: [{
          id: 'lineitemSync',
        }],
      },
    ],
  };
  const state1 = reducer(state, suitescriptActions.resource.received(ssLinkedConnectionId, integrationId, 'settings', settings));

  test('should return correct object for given section which contains subsections', () => {
    expect(selectors.suiteScriptFlowSettings(state1, integrationId, ssLinkedConnectionId, 'OpportunitySync')).toEqual(
      {
        fields: undefined,
        flows: [{_id: 'flow-768', flowGUID: 'flow-768', type: 'REALTIME_IMPORT', ssLinkedConnectionId, _integrationId: integrationId}],
        sections: [{
          id: 'lineitemSync',
          title: 'Common',
        }],
      }
    );
  });
  test('should return correct object for given section which does not contains subsections', () => {
    expect(selectors.suiteScriptFlowSettings(state1, integrationId, ssLinkedConnectionId, 'AccountSync')).toEqual(
      {
        fields: ['something'],
        flows: [{_id: 'flow-123', flowGUID: 'flow-123', type: 'REALTIME_EXPORT', export: {_connectionId: 'abc'}, ssLinkedConnectionId, _integrationId: integrationId}],
        sections: undefined,
      }
    );
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
    expect(selectors.suiteScriptNetsuiteMappingSubRecord(undefined, {})).toEqual({});
  });
  test('should return empty object if no sub record mapping id is passed', () => {
    expect(selectors.suiteScriptNetsuiteMappingSubRecord({}, {})).toEqual({});
  });
  test('should return empty object if sub record mapping id is not available in the import doc', () => {
    const ssLinkedConnectionId = 'ss-id';
    const integrationId = '201';
    const flowId = 're2001';
    const state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {
                netsuite: {
                  subRecordImports: [
                    {mappingId: '1'},
                  ],
                },
              },
              export: {},
            }],
          },
        },
      },
    };

    expect(selectors.suiteScriptNetsuiteMappingSubRecord(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId: '3'})).toEqual({});
  });
  test('should return sub record doc from the import doc matching the mapping id', () => {
    const ssLinkedConnectionId = 'ss-id';
    const integrationId = '201';
    const flowId = 're2001';
    const state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {
                netsuite: {
                  subRecordImports: [
                    {
                      mappingId: '3',
                      recordType: 'subRecordType',
                      mapping: {
                        fields: [
                          {mappingId: 'xyz', something: 'else'},
                        ],
                        lists: [],
                      },
                      lookups: []},
                  ],
                },
              },
              export: {},
            }],
          },
        },
      },
    };

    expect(selectors.suiteScriptNetsuiteMappingSubRecord(state, {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId: '3'})).toEqual({
      mappingId: '3',
      recordType: 'subRecordType',
      mapping: {
        fields: [
          {mappingId: 'xyz', something: 'else'},
        ],
        lists: [],
      },
      lookups: []});
  });
});

describe('suiteScriptImportSampleData selector', () => {
  let state;
  const ssLinkedConnectionId = 'ss-id';
  const integrationId = '201';
  const flowId = 're2001';

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {
                type: 'netsuite',
                _connectionId: 'conn-123',
                netsuite: {
                  recordType: 'customer',
                },
              },
              export: {},
            },
            {
              _flowId: '2',
              _id: 're2002',
              _integrationId: '201',
              import: {
                type: 'salesforce',
                _connectionId: 'SALESFORCE_CONNECTION',
                salesforce: {
                  sObjectType: 'Account',
                },
              },
              export: {},
            }],
          },
        },
      },
      session: {
        metadata: {
          application: {
            [ssLinkedConnectionId]: {
              [`netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/customer`]: {
                status: 'received',
                data: [{id: 'name', name: 'Full name', type: 'text'}],
              },
              [`suitescript/connections/${ssLinkedConnectionId}/connections/SALESFORCE_CONNECTION/sObjectTypes/Account`]: {
                status: 'received',
                data: {
                  fields: [{name: 'Id', label: 'Account Id'}],
                },
              },
            },
          },
        },
      },
    };
  });
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptImportSampleData(undefined, {})).toEqual({});
  });
  test('should return empty object if flow not found', () => {
    expect(selectors.suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId: 'test' })).toEqual({});
  });
  test('should return netsuite related data and status if import type is netsuite', () => {
    expect(selectors.suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId })).toEqual({
      status: 'received',
      data: [{value: 'name', label: 'Full name', type: 'text'}],
    });
  });
  test('should return salesforce related data and status if import type is salesforce', () => {
    expect(selectors.suiteScriptImportSampleData(state, {ssLinkedConnectionId, integrationId, flowId: 're2002' })).toEqual({
      status: 'received',
      data: [{
        label: 'Account Id',
        value: 'Id' }],
    });
  });
});

describe('suiteScriptGenerates selector', () => {
  let state;
  const ssLinkedConnectionId = 'ss-id';
  const integrationId = '201';
  const flowId = 're2001';

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {
                type: 'netsuite',
                _connectionId: 'conn-123',
                netsuite: {
                  recordType: 'customer',
                },
              },
              export: {},
            }],
          },
        },
      },
      session: {
        metadata: {
          application: {
            [ssLinkedConnectionId]: {
              [`netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/customer`]: {
                status: 'received',
                data: [{id: 'name', name: 'Full name', type: 'text'},
                  {id: 'id', name: 'Customer Id', type: 'text'}],
              },
            },
          },
        },
      },
    };
  });
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptGenerates(undefined, {})).toEqual({data: undefined, status: undefined});
  });
  test('should return status if data does not exist', () => {
    delete state.session.metadata.application;
    expect(selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual({data: undefined, status: undefined});
  });
  test('should return generate fields with the status', () => {
    expect(selectors.suiteScriptGenerates(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual(
      {data: [
        {
          id: 'id',
          name: 'Customer Id',
          type: 'text',
        },
        {
          id: 'name',
          name: 'Full name',
          type: 'text',
        },
      ],
      status: 'received'}
    );
  });
});

describe('suiteScriptFlowSampleData selector', () => {
  let state;
  const ssLinkedConnectionId = 'ss-id';
  const integrationId = '201';
  const flowId = 're2001';

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              export: {
                type: 'netsuite',
                _connectionId: 'conn-123',
                netsuite: {
                  type: 'realtime',
                  realtime: {
                    recordType: 'customer',
                  },
                },
              },
              import: {},
            },
            {
              _flowId: '2',
              _id: 're2002',
              _integrationId: '201',
              export: {
                type: 'salesforce',
                _connectionId: 'SALESFORCE_CONNECTION',
                salesforce: {
                  sObjectType: 'Account',
                },
              },
              import: {},
            }],
          },
        },
      },
      session: {
        metadata: {
          application: {
            [ssLinkedConnectionId]: {
              [`netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/customer`]: {
                status: 'received',
                data: [{id: 'name', name: 'Full name', type: 'text'}],
              },
              [`suitescript/connections/${ssLinkedConnectionId}/connections/SALESFORCE_CONNECTION/sObjectTypes/Account`]: {
                status: 'received',
                data: {
                  fields: [{name: 'Id', label: 'Account Id'}],
                },
              },
            },
          },
        },
      },
    };
  });
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFlowSampleData(undefined, {})).toEqual({});
  });
  test('should return empty object if flow not found', () => {
    expect(selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId: 'test' })).toEqual({});
  });
  test('should return netsuite related data and status if export type is realtime netsuite', () => {
    expect(selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId })).toEqual({
      status: 'received',
      data: [{id: 'name', name: 'Full name', type: 'text'}],
    });
  });
  test('should return salesforce related data and status if export type is salesforce', () => {
    expect(selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId: 're2002' })).toEqual({
      status: 'received',
      data: [{
        label: 'Account Id',
        value: 'Id' }],
    });
  });
});

describe('suiteScriptExtracts selector', () => {
  let state;
  const ssLinkedConnectionId = 'ss-id';
  const integrationId = '201';
  const flowId = 're2001';

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              export: {
                type: 'netsuite',
                _connectionId: 'conn-123',
                netsuite: {
                  type: 'restlet',
                  restlet: {
                    recordType: 'customer',
                  },
                },
              },
              import: {},
            },
            {
              _flowId: '2',
              _id: 're2002',
              _integrationId: '201',
              export: {
                type: 'salesforce',
                _connectionId: 'SALESFORCE_CONNECTION',
                salesforce: {
                  sObjectType: 'Account',
                },
              },
              import: {},
            }],
          },
        },
      },
      session: {
        metadata: {
          application: {
            [ssLinkedConnectionId]: {
              [`suitescript/connections/${ssLinkedConnectionId}/connections/SALESFORCE_CONNECTION/sObjectTypes/Account`]: {
                status: 'received',
                data: {
                  fields: [{name: 'name', label: 'Fist name'},
                    {name: 'Id', label: 'Account Id'},
                  ],
                },
              },
            },
          },
        },
        suiteScript: {
          flowSampleData: {
            [`${ssLinkedConnectionId}-${integrationId}-${flowId}`]: {
              status: 'received',
              data: [{id: 'name', name: 'Full name', type: 'text'},
                {id: 'currency', name: 'Currency', type: 'select'}],
            },
          },
        },
      },
    };
  });

  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptExtracts(undefined, {})).toEqual({});
  });
  test('should return empty object if flow sample data does not exist', () => {
    expect(selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId: 'test'})).toEqual({});
  });
  test('should return the extract fields with suffix as internal id for restlet and select type fields', () => {
    expect(selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual(
      {data: [
        {
          id: 'currency',
          name: 'Currency',
        },
        {
          id: 'currency.internalid',
          name: 'Currency (InternalId)',
        },
        {
          id: 'name',
          name: 'Full name',
        },
      ],
      status: 'received'}
    );
  });
  test('should return sorted fields list', () => {
    expect(selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId: 're2002'})).toEqual(
      {data: [{id: 'Id', name: 'Account Id'}, {id: 'name', name: 'Fist name'}], status: 'received'}
    );
  });
});

describe('suiteScriptSalesforceMasterRecordTypeInfo selector', () => {
  let state;
  const ssLinkedConnectionId = 'ss-id';
  const integrationId = '201';
  const flowId = 're2001';

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {
                type: 'netsuite',
                _connectionId: 'conn-123',
                netsuite: {
                  type: 'restlet',
                  restlet: {
                    recordType: 'customer',
                  },
                },
              },
              export: {},
            },
            {
              _flowId: '2',
              _id: 're2002',
              _integrationId: '201',
              import: {
                type: 'salesforce',
                _connectionId: 'SALESFORCE_CONNECTION',
                salesforce: {
                  sObjectType: 'Account',
                },
              },
              export: {},
            }],
          },
        },
      },
      session: {
        metadata: {
          application: {
            [ssLinkedConnectionId]: {
              [`suitescript/connections/${ssLinkedConnectionId}/connections/SALESFORCE_CONNECTION/sObjectTypes/Account`]: {
                status: 'received',
                data: {
                  fields: [{name: 'name', label: 'Fist name'},
                    {name: 'Id', label: 'Account Id'},
                  ],
                  searchLayoutable: true,
                },
                changeIdentifier: 2,
              },
            },
          },
        },
      },
    };
  });
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptSalesforceMasterRecordTypeInfo(undefined, {})).toEqual({data: undefined, status: undefined});
  });
  test('should return empty object if flow does not exist', () => {
    expect(selectors.suiteScriptSalesforceMasterRecordTypeInfo(state, {ssLinkedConnectionId, integrationId, flowId: 'test'})).toEqual({});
  });
  test('should return empty object if import type is not salesforce', () => {
    expect(selectors.suiteScriptSalesforceMasterRecordTypeInfo(state, {ssLinkedConnectionId, integrationId, flowId})).toEqual({});
  });
  test('should return salesforce options metadata correctly', () => {
    expect(selectors.suiteScriptSalesforceMasterRecordTypeInfo(state, {ssLinkedConnectionId, integrationId, flowId: 're2002'})).toEqual(
      {changeIdentifier: 2, data: {recordTypeId: undefined, searchLayoutable: true}, errorMessage: undefined, status: 'received', validationError: undefined}
    );
  });
});

describe('suiteScriptFileExportSampleData selector', () => {
  let state;
  const ssLinkedConnectionId = 'ss-id';
  const resourceId = 're2001';
  const resourceType = 'exports';

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {},
              export: {},
            }],
          },
        },
      },
      session: {
      },
    };
  });
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.suiteScriptFileExportSampleData(undefined, {})).toEqual();
  });
  test('should return undefined if sample data does not exist on the resource', () => {
    expect(selectors.suiteScriptFileExportSampleData(state, { ssLinkedConnectionId, resourceType, resourceId})).toBeUndefined();
  });
  test('should return undefined if sample data does not exist for csv resource', () => {
    state.data.suiteScript[ssLinkedConnectionId].flows[0].export = {
      file: {
        xml: {},
      },
      sampleData: '<xml></xml>',
    };
    expect(selectors.suiteScriptFileExportSampleData(state, { ssLinkedConnectionId, resourceType, resourceId})).toBeUndefined();
  });
  test('should return saved resource csv sample data if does not exist in state', () => {
    state.data.suiteScript[ssLinkedConnectionId].flows[0].export = {
      file: {
        csv: {delimiter: '|'},
      },
      sampleData: 'NAME|AGE\nTest|30',
    };

    expect(selectors.suiteScriptFileExportSampleData(state, { ssLinkedConnectionId, resourceType, resourceId})).toEqual('NAME|AGE\nTest|30');
  });
  test('should return state sample data if exists', () => {
    state.data.suiteScript[ssLinkedConnectionId].flows[0].export = {
      file: {
        csv: {delimiter: '|'},
      },
      sampleData: 'NAME|AGE\nTest|30',
    };
    state.session.resourceFormSampleData = {
      [resourceId]: {
        data: {
          raw: 'CUSTOMER|ID|TYPE\nDummy|123|Retail',
        },
      },
    };
    expect(selectors.suiteScriptFileExportSampleData(state, { ssLinkedConnectionId, resourceType, resourceId})).toEqual('CUSTOMER|ID|TYPE\nDummy|123|Retail');
  });
});

describe('getSuitescriptMappingSubRecordList selector', () => {
  const ssLinkedConnectionId = 'ss-id';
  const integrationId = '201';
  const flowId = 're2001';
  let state;

  beforeEach(() => {
    state = {
      data: {
        suiteScript: {
          [ssLinkedConnectionId]: {
            flows: [{
              _flowId: '1',
              _id: 're2001',
              _integrationId: '201',
              import: {
                type: 'netsuite',
                netsuite: {
                  subRecordImports: [
                    {mappingId: '1',
                      recordType: 'inventorydetail'},
                  ],
                },
              },
              export: {},
            },
            {
              _flowId: '2',
              _id: 're2002',
              _integrationId: '201',
              import: {
                type: 'salesforce',
                _connectionId: 'SALESFORCE_CONNECTION',
                salesforce: {
                  sObjectType: 'Account',
                },
              },
              export: {},
            }],
          },
        },
      },
    };
  });
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.getSuitescriptMappingSubRecordList(undefined, {})).toEqual([]);
  });
  test('should return empty array if flow does not exist', () => {
    expect(selectors.getSuitescriptMappingSubRecordList(state, {integrationId, ssLinkedConnectionId, flowId: 'test'})).toEqual([]);
  });
  test('should return empty array if import is not of netsuite type or does not contain subrecords', () => {
    expect(selectors.getSuitescriptMappingSubRecordList(state, {integrationId, ssLinkedConnectionId, flowId: 're2002'})).toEqual([]);
  });
  test('should return subrecords list with (Subrecord) suffix', () => {
    expect(selectors.getSuitescriptMappingSubRecordList(state, {integrationId, ssLinkedConnectionId, flowId})).toEqual(
      [{id: '__parent', name: 'Netsuite'},
        {id: '1', name: 'inventorydetail (Subrecord)'}]
    );
  });
});

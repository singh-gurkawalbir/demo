/* global describe, expect */
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

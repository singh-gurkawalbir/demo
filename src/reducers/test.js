/* global describe, test, expect */
import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import reducer, * as selectors from './';
import actions from '../actions';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  TILE_STATUS,
} from '../utils/constants';

describe('global selectors', () => {
  describe(`isProfileDataReady`, () => {
    test('should return false on bad or empty state.', () => {
      expect(selectors.isProfileDataReady()).toBe(false);
      expect(selectors.isProfileDataReady({})).toBe(false);
      expect(selectors.isProfileDataReady({ session: {} })).toBe(false);
    });

    test('should return true when profile exists.', () => {
      const state = reducer(
        undefined,
        actions.resource.received('mock profile')
      );

      expect(selectors.isProfileDataReady(state)).toBe(true);
    });
  });

  describe('resourceData', () => {
    test('should return {} on bad state or args.', () => {
      expect(selectors.resourceData()).toEqual({});
      // expect(selectors.resourceData({})).toEqual({});
      expect(selectors.resourceData({ data: {} })).toEqual({});
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        hash: -1092997807,
        merged: exports[0],
        staged: undefined,
        master: exports[0],
      });
    });

    test('should return correct data when staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        hash: 1201750584,
        merged: { _id: 1, name: 'patch X' },
        patch,
        master: exports[0],
      });
    });
  });
  describe('resourceStatus ', () => {
    describe('GET resource calls ', () => {
      test('should correctly indicate the resource is not Ready for a loading resource call', () => {
        const state = reducer(
          undefined,
          actions.api.request('/exports', 'some message')
        );

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is not Ready for a failed resource call', () => {
        let state = reducer(
          undefined,
          actions.api.request('/exports', 'some message')
        );

        state = reducer(state, actions.api.failure('/exports'));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is Ready for a success resource call and has data', () => {
        let state = reducer(
          undefined,
          actions.resource.receivedCollection('exports', { data: 'something' })
        );

        state = reducer(state, actions.api.request('/exports', 'some message'));
        state = reducer(state, actions.api.complete('/exports'));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
      });
    });
    test('should correctly indicate the resource is ready for a non-GET resource call', () => {
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', { data: 'something' })
      );

      state = reducer(
        state,
        actions.api.request('/exports', 'some message', true, 'POST')
      );
      state = reducer(state, actions.api.complete('/exports'));
      expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
    });
  });
});
describe('authentication selectors', () => {
  test('isAuthInitialized selector should be false when the app loads for the very first time and subsequently should be sucessfully set to true for auth failure or success', () => {
    const initiaizedState = reducer(undefined, { type: null });

    expect(selectors.isAuthInitialized(initiaizedState)).toBe(false);

    const authSucceededState = reducer(
      initiaizedState,
      actions.auth.complete()
    );

    expect(selectors.isAuthInitialized(authSucceededState)).toBe(true);
    const authFailedState = reducer(initiaizedState, actions.auth.failure());

    expect(selectors.isAuthInitialized(authFailedState)).toBe(true);
  });

  test('isUserLoggedIn selector should be set to false when the user logs out and for any other state it should be set to true ', () => {
    const initiaizedState = reducer(undefined, { type: null });

    expect(selectors.isUserLoggedIn(initiaizedState)).toBe(true);
    // the user logout saga ultimately disptaches a clear store action
    const loggedOutState = reducer(initiaizedState, actions.auth.clearStore());

    expect(selectors.isUserLoggedIn(loggedOutState)).toBe(false);
  });

  describe('shouldShowAppRouting selector', () => {
    //  when the app is intializing shouldShowAppRouting selctor
    // should be set to false but ultimately set to
    // true when authentication cookie test succeeds or fails
    test('should be false during app initialization but set to true after a successfult auth test success and after user account being set', () => {
      const initiaizedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initiaizedState)).toBe(false);
      // let the app make auth request test
      const authStateLoading = reducer(initiaizedState, actions.auth.request());

      // we are loading so lets hold of on rendering
      expect(selectors.shouldShowAppRouting(authStateLoading)).toBe(false);

      const authStateSucceeded = reducer(
        initiaizedState,
        actions.auth.complete()
      );

      // the user has been successfully authenticated but lets still hold off
      // rendering the app
      expect(selectors.shouldShowAppRouting(authStateSucceeded)).toBe(false);

      const defaultAccountSet = reducer(
        authStateSucceeded,
        actions.auth.defaultAccountSet()
      );

      expect(selectors.shouldShowAppRouting(defaultAccountSet)).toBe(true);
    });

    test('should be true after autherntication failure test irrespective if account set or not', () => {
      const initiaizedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initiaizedState)).toBe(false);

      const authStateFailed = reducer(initiaizedState, actions.auth.failure());

      expect(selectors.shouldShowAppRouting(authStateFailed)).toBe(true);
      // the state can never occur because of how it is sequenced in the saga
      // nevertheless we should still show something to the user
      const defaultAccountSet = reducer(
        authStateFailed,
        actions.auth.defaultAccountSet()
      );

      expect(selectors.shouldShowAppRouting(defaultAccountSet)).toBe(true);
    });
    // when the user is logged out, that may falsely be construed as a loading
    // state hence signin route will never show up, so shouldShowAppRouting
    // should be true
    test('should be true whe the user is logged out', () => {
      const initiaizedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initiaizedState)).toBe(false);

      const authStateSucceeded = reducer(
        initiaizedState,
        actions.auth.complete()
      );
      const defaultAccountSet = reducer(
        authStateSucceeded,
        actions.auth.defaultAccountSet()
      );

      expect(selectors.shouldShowAppRouting(defaultAccountSet)).toBe(true);

      // In this test case the user saga ultimately dispatches
      // a clearStore action we are using that to emulate a logout
      const userLogoutState = reducer(
        authStateSucceeded,
        actions.auth.clearStore()
      );

      // now signin route gets rendered
      expect(selectors.shouldShowAppRouting(userLogoutState)).toBe(true);
    });
  });
});
describe('Reducers in the root reducer', () => {
  test('should wipe out the redux store in a user logout action', () => {
    const someInitialState = {
      profile: { email: 'sds' },
    };
    const state = reducer(someInitialState, actions.auth.clearStore());

    expect(state).toEqual({});
  });
});

describe('Comm selector to verify comms exceeding threshold', () => {
  const path = '/somePath';

  test('selector taking long should not show the component only if any comms msg is transiting less than the network threshold', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    const state = reducer(undefined, actions.api.request(path));

    advanceBy(5);

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(true);
    clear();
  });
  test('verify comm selector for multiple resources', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    let state = reducer(undefined, actions.api.request(path));

    state = reducer(state, actions.api.request('someotherResource'));

    advanceBy(50);

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);
    state = reducer(state, actions.api.complete(path));
    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThresold(state)).toBe(true);
    clear();
  });
});

describe('tiles', () => {
  const published = [
    {
      _id: 'connector1',
      name: 'Connector 1',
      user: { name: 'User 1', company: 'Company 1' },
    },
    {
      _id: 'connector2',
      name: 'Connector 2',
      user: { name: 'User 2' },
    },
  ];
  const integrations = [
    {
      _id: 'integration1',
    },
    {
      _id: 'integration2',
    },
    {
      _id: 'integration3',
    },
    {
      _id: 'integration4',
    },
    {
      _id: 'integration5',
      mode: 'settings',
    },
    {
      _id: 'integration6',
      mode: 'settings',
    },
    {
      _id: 'integration7',
      mode: 'settings',
    },
    {
      _id: 'integration8',
      mode: 'install',
    },
    {
      _id: 'integration9',
      mode: 'install',
    },
  ];
  const tilesCollection = [
    {
      _integrationId: 'integration1',
      name: 'Integration One',
      numError: 0,
      numFlows: 2,
    },
    {
      _integrationId: 'integration2',
      name: 'Integration Two',
      numError: 4,
      numFlows: 3,
    },
    {
      _integrationId: 'integration3',
      name: 'Integration Three',
      numError: 9,
      offlineConnections: ['conn1', 'conn2'],
      numFlows: 4,
    },
    {
      _integrationId: 'integration4',
      name: 'Integration Four',
      numError: 0,
      offlineConnections: ['conn1', 'conn2'],
      numFlows: 5,
    },
    {
      _integrationId: 'integration5',
      _connectorId: 'connector1',
      name: 'Connector 1',
      numFlows: 6,
    },
    {
      _integrationId: 'integration6',
      _connectorId: 'connector1',
      tag: 'tag 1',
      name: 'Connector 1',
      numError: 36,
      numFlows: 7,
    },
    {
      _integrationId: 'integration7',
      _connectorId: 'connector1',
      tag: 'tag 2',
      name: 'Connector 1',
      numError: 49,
      offlineConnections: ['conn1'],
      numFlows: 8,
    },
    {
      _integrationId: 'integration8',
      _connectorId: 'connector2',
      name: 'Connector 2',
      numFlows: 9,
    },
    {
      _integrationId: 'integration9',
      _connectorId: 'connector2',
      name: 'Connector 2',
      tag: 'test tag',
      numFlows: 10,
      offlineConnections: ['conn1', 'conn2'],
    },
  ];
  const standaloneTiles = [
    {
      _integrationId: 'none',
      name: 'Standalone Flows',
      numError: 0,
      offlineConnections: ['conn1', 'conn2'],
      numFlows: 5,
    },
  ];

  test('should return correct tiles info for account owner', () => {
    const state = reducer(
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
              },
            ],
            users: [],
          },
        },
        data: {
          resources: {
            published,
            integrations,
          },
        },
      },
      actions.resource.receivedCollection('tiles', [
        ...standaloneTiles,
        ...tilesCollection,
      ])
    );
    const tiles = selectors.tiles(state);
    const expectedIntegrationPermissions = {
      accessLevel: INTEGRATION_ACCESS_LEVELS.OWNER,
      connections: {
        edit: true,
      },
    };
    const expected = [
      {
        _integrationId: 'none',
        name: 'Standalone Flows',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
        integration: {
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration1',
        name: 'Integration One',
        numError: 0,
        numFlows: 2,
        integration: {
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.SUCCESS,
      },
      {
        _integrationId: 'integration2',
        name: 'Integration Two',
        numError: 4,
        numFlows: 3,
        integration: {
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration3',
        name: 'Integration Three',
        numError: 9,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 4,
        integration: {
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration4',
        name: 'Integration Four',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
        integration: {
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration5',
        _connectorId: 'connector1',
        name: 'Connector 1',
        numFlows: 6,
        connector: {
          owner: 'Company 1',
        },
        integration: {
          mode: 'settings',
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.SUCCESS,
      },
      {
        _integrationId: 'integration6',
        _connectorId: 'connector1',
        tag: 'tag 1',
        name: 'Connector 1',
        numError: 36,
        numFlows: 7,
        connector: {
          owner: 'Company 1',
        },
        integration: {
          mode: 'settings',
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration7',
        _connectorId: 'connector1',
        tag: 'tag 2',
        name: 'Connector 1',
        numError: 49,
        numFlows: 8,
        offlineConnections: ['conn1'],
        connector: {
          owner: 'Company 1',
        },
        integration: {
          mode: 'settings',
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration8',
        _connectorId: 'connector2',
        name: 'Connector 2',
        numFlows: 9,
        connector: {
          owner: 'User 2',
        },
        integration: {
          mode: 'install',
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.IS_PENDING_SETUP,
      },
      {
        _integrationId: 'integration9',
        _connectorId: 'connector2',
        name: 'Connector 2',
        tag: 'test tag',
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
        connector: {
          owner: 'User 2',
        },
        integration: {
          mode: 'install',
          permissions: expectedIntegrationPermissions,
        },
        status: TILE_STATUS.IS_PENDING_SETUP,
      },
    ];

    expect(tiles).toEqual(expected);
  });
  test('should return correct tiles info for org users', () => {
    const state = reducer(
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: 'ashare_manage' },
          org: {
            accounts: [
              {
                _id: 'ashare_manage',
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
              },
              {
                _id: 'ashare_monitor',
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
              },
              {
                _id: 'ashare_tile',
                integrationAccessLevel: [
                  {
                    _integrationId: 'integration1',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                  },
                  {
                    _integrationId: 'integration2',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                  },
                  {
                    _integrationId: 'integration3',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                  },
                  {
                    _integrationId: 'integration4',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                  },
                  {
                    _integrationId: 'integration5',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                  },
                  {
                    _integrationId: 'integration6',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                  },
                  {
                    _integrationId: 'integration7',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                  },
                  {
                    _integrationId: 'integration8',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                  },
                  {
                    _integrationId: 'integration9',
                    accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                  },
                ],
              },
            ],
            users: [],
          },
        },
        data: {
          resources: {
            published,
            integrations,
          },
        },
      },
      actions.resource.receivedCollection('tiles', [
        ...standaloneTiles,
        ...tilesCollection,
      ])
    );
    const expected = [
      {
        _integrationId: 'none',
        name: 'Standalone Flows',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
        integration: {
          permissions: {},
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration1',
        name: 'Integration One',
        numError: 0,
        numFlows: 2,
        integration: {
          permissions: {},
        },
        status: TILE_STATUS.SUCCESS,
      },
      {
        _integrationId: 'integration2',
        name: 'Integration Two',
        numError: 4,
        numFlows: 3,
        integration: {
          permissions: {},
        },
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration3',
        name: 'Integration Three',
        numError: 9,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 4,
        integration: {
          permissions: {},
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration4',
        name: 'Integration Four',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
        integration: {
          permissions: {},
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration5',
        _connectorId: 'connector1',
        name: 'Connector 1',
        numFlows: 6,
        connector: {
          owner: 'Company 1',
        },
        integration: {
          mode: 'settings',
          permissions: {},
        },
        status: TILE_STATUS.SUCCESS,
      },
      {
        _integrationId: 'integration6',
        _connectorId: 'connector1',
        tag: 'tag 1',
        name: 'Connector 1',
        numError: 36,
        numFlows: 7,
        connector: {
          owner: 'Company 1',
        },
        integration: {
          mode: 'settings',
          permissions: {},
        },
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration7',
        _connectorId: 'connector1',
        tag: 'tag 2',
        name: 'Connector 1',
        numError: 49,
        numFlows: 8,
        offlineConnections: ['conn1'],
        connector: {
          owner: 'Company 1',
        },
        integration: {
          mode: 'settings',
          permissions: {},
        },
        status: TILE_STATUS.HAS_OFFLINE_CONNECTIONS,
      },
      {
        _integrationId: 'integration8',
        _connectorId: 'connector2',
        name: 'Connector 2',
        numFlows: 9,
        connector: {
          owner: 'User 2',
        },
        integration: {
          mode: 'install',
          permissions: {},
        },
        status: TILE_STATUS.IS_PENDING_SETUP,
      },
      {
        _integrationId: 'integration9',
        _connectorId: 'connector2',
        name: 'Connector 2',
        tag: 'test tag',
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
        connector: {
          owner: 'User 2',
        },
        integration: {
          mode: 'install',
          permissions: {},
        },
        status: TILE_STATUS.IS_PENDING_SETUP,
      },
    ];
    const expectedIntegrationPermissions = {
      manage: {
        accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
        connections: {
          edit: true,
        },
      },
      monitor: {
        accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
        connections: {
          edit: undefined,
        },
      },
    };

    expected.forEach(t => {
      // eslint-disable-next-line no-param-reassign
      t.integration.permissions = expectedIntegrationPermissions.manage;
    });

    const tilesForManageUser = selectors.tiles(state);

    expect(tilesForManageUser).toEqual(expected);

    const stateForMonitor = reducer(
      state,
      actions.user.preferences.update({
        defaultAShareId: 'ashare_monitor',
      })
    );

    expected.forEach(t => {
      // eslint-disable-next-line no-param-reassign
      t.integration.permissions = expectedIntegrationPermissions.monitor;
    });
    const tilesForMonitorUser = selectors.tiles(stateForMonitor);

    expect(tilesForMonitorUser).toEqual(expected);

    let stateForTileAccess = reducer(
      state,
      actions.user.preferences.update({
        defaultAShareId: 'ashare_tile',
      })
    );

    stateForTileAccess = reducer(
      stateForTileAccess,
      actions.resource.receivedCollection('tiles', tilesCollection)
    );

    let integrationPermissions;

    expected.forEach(t => {
      if (
        [
          'integration1',
          'integration3',
          'integration5',
          'integration7',
          'integration9',
        ].includes(t._integrationId)
      ) {
        integrationPermissions = expectedIntegrationPermissions.manage;
      } else {
        integrationPermissions = expectedIntegrationPermissions.monitor;
      }

      // eslint-disable-next-line no-param-reassign
      t.integration.permissions = integrationPermissions;
    });
    const expectedForTileLevelAccessUser = expected.filter(
      t => t._integrationId !== 'none'
    );
    const tilesForTileLevelAccessUser = selectors.tiles(stateForTileAccess);

    expect(tilesForTileLevelAccessUser).toEqual(expectedForTileLevelAccessUser);
  });
});

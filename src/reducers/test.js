/* global describe, test, expect */
import { advanceBy, advanceTo, clear } from 'jest-date-mock';
import each from 'jest-each';
import moment from 'moment';
import reducer, * as selectors from './';
import actions from '../actions';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  TILE_STATUS,
  SUITESCRIPT_CONNECTORS,
} from '../utils/constants';
import { COMM_STATES } from './comms';

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
      expect(selectors.resourceData({ data: {} })).toEqual({});
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: exports[0],
        staged: undefined,
        master: exports[0],
      });
    });

    test('should return correct data when no staged data or resource exists. (new resource)', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(
        selectors.resourceData(state, 'exports', 'new-resource-id')
      ).toEqual({
        merged: {},
        staged: undefined,
        master: undefined,
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
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });
    });

    test('should return correct data when staged data exists but no master.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged('new-id', patch));

      expect(selectors.resourceData(state, 'exports', 'new-id')).toEqual({
        merged: { name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: null,
      });
    });
  });

  describe('resourceStatus ', () => {
    describe('GET resource calls ', () => {
      const method = 'GET';

      test('should correctly indicate the resource is not Ready for a loading resource call', () => {
        const state = reducer(
          undefined,
          actions.api.request('/exports', method, 'some message')
        );

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is not Ready for a failed resource call', () => {
        let state = reducer(
          undefined,
          actions.api.request('/exports', method, 'some message')
        );

        state = reducer(state, actions.api.failure('/exports', method));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is Ready for a success resource call and has data', () => {
        let state = reducer(
          undefined,
          actions.resource.receivedCollection('exports', { data: 'something' })
        );

        state = reducer(
          state,
          actions.api.request('/exports', method, 'some message')
        );
        state = reducer(state, actions.api.complete('/exports', method));

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
        actions.api.request('/exports', 'POST', 'some message', true)
      );
      state = reducer(state, actions.api.complete('/exports', 'POST'));
      expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
    });
    test(`shouldn't re-add the forward slash in the resourceStatus selector to determine comm status for non resource calls`, () => {
      let state = reducer(
        {},
        actions.api.request(
          '/processor/handlebars/',
          'POST',
          'some message',
          true
        )
      );

      state = reducer(
        state,
        actions.api.retry('/processor/handlebars/', 'POST')
      );
      // with resource starting with forward slash
      expect(
        selectors.resourceStatus(state, '/processor/handlebars/', 'POST')
          .retryCount
      ).toBe(1);
      // with resource starting without forward slash
      expect(
        selectors.resourceStatus(state, 'processor/handlebars/', 'POST')
          .retryCount
      ).toBe(1);
    });
  });
});
describe('authentication selectors', () => {
  test('isAuthInitialized selector should be false when the app loads for the very first time and subsequently should be successfully set to true for auth failure or success', () => {
    const initializedState = reducer(undefined, { type: null });

    expect(selectors.isAuthInitialized(initializedState)).toBe(false);

    const authSucceededState = reducer(
      initializedState,
      actions.auth.complete()
    );

    expect(selectors.isAuthInitialized(authSucceededState)).toBe(true);
    const authFailedState = reducer(initializedState, actions.auth.failure());

    expect(selectors.isAuthInitialized(authFailedState)).toBe(true);
  });

  test('isUserLoggedOut selector should be set to true when the user logs out and for any other state it should be set to false ', () => {
    const initializedState = reducer(undefined, { type: null });

    expect(selectors.isUserLoggedOut(initializedState)).toBe(false);
    // the user logout saga ultimately dispatches a clear store action
    const loggedOutState = reducer(initializedState, actions.auth.clearStore());

    expect(selectors.isUserLoggedOut(loggedOutState)).toBe(true);
  });

  describe('shouldShowAppRouting selector', () => {
    //  when the app is initalizing shouldShowAppRouting selector
    // should be set to false but ultimately set to
    // true when authentication cookie test succeeds or fails
    test('should be false during app initialization but set to true after a successful auth test success and after user account being set', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initializedState)).toBe(false);
      // let the app make auth request test
      const authStateLoading = reducer(
        initializedState,
        actions.auth.request()
      );

      // we are loading so lets hold of on rendering
      expect(selectors.shouldShowAppRouting(authStateLoading)).toBe(false);

      const authStateSucceeded = reducer(
        initializedState,
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

    test('should be true after authentication failure test irrespective if account set or not', () => {
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initializedState)).toBe(false);

      const authStateFailed = reducer(initializedState, actions.auth.failure());

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
      const initializedState = reducer(undefined, { type: null });

      expect(selectors.shouldShowAppRouting(initializedState)).toBe(false);

      const authStateSucceeded = reducer(
        initializedState,
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
  test('should wipe out the redux store except for app and auth properties in a user logout action', () => {
    const someInitialState = {
      user: { profile: { email: 'sds' } },
    };
    const state = reducer(someInitialState, actions.auth.clearStore());

    expect(state).toEqual({
      app: { drawerOpened: true, count: 1 },
      auth: {
        commStatus: COMM_STATES.LOADING,
        initialized: false,
        loggedOut: true,
      },
    });
  });
});

describe('Comm selector to verify comms exceeding threshold', () => {
  const path = '/somePath';
  const method = 'GET';

  test('selector taking long should not show the component only if any comms msg is transiting less than the network threshold', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    const state = reducer(undefined, actions.api.request(path, method));

    advanceBy(5);

    expect(selectors.isAllLoadingCommsAboveThreshold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThreshold(state)).toBe(true);
    clear();
  });
  test('verify comm selector for multiple resources', () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)); // reset to date time.

    let state = reducer(undefined, actions.api.request(path, method));

    state = reducer(state, actions.api.request('someotherResource', method));

    advanceBy(50);

    expect(selectors.isAllLoadingCommsAboveThreshold(state)).toBe(false);
    state = reducer(state, actions.api.complete(path, method));
    expect(selectors.isAllLoadingCommsAboveThreshold(state)).toBe(false);

    advanceBy(20000); // advance sufficiently large time

    expect(selectors.isAllLoadingCommsAboveThreshold(state)).toBe(true);
    clear();
  });
});

describe('tiles', () => {
  const published = [
    {
      _id: 'connector1',
      name: 'Connector 1',
      user: { name: 'User 1', company: 'Company 1' },
      applications: ['app1', 'app2'],
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
          applications: ['app1', 'app2'],
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
          applications: ['app1', 'app2'],
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
          applications: ['app1', 'app2'],
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
          applications: [],
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
          applications: [],
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
          applications: ['app1', 'app2'],
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
          applications: ['app1', 'app2'],
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
          applications: ['app1', 'app2'],
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
          applications: [],
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
          applications: [],
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

describe('commStatusByKey', () => {
  test('should return correct status', () => {
    const state = reducer(
      {
        comms: {
          'GET:/test': { something: 'something' },
        },
      },
      'some action'
    );

    expect(selectors.commStatusByKey(state, 'GET:/test')).toEqual({
      something: 'something',
    });
  });
  test('should return undefined if key not found', () => {
    const state = reducer(
      {
        comms: {
          'GET:/test': { something: 'something' },
        },
      },
      'some action'
    );

    expect(selectors.commStatusByKey(state, 'GET:/something')).toEqual(
      undefined
    );
  });
  test('should return undefined if state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.commStatusByKey(state, 'GET:/something')).toEqual(
      undefined
    );
  });
});

describe('publishedConnectors selector', () => {
  const published = [{ _id: 'c1' }, { _id: 'c2' }];

  test('should return suitescript connectors only, when state is undefined', () => {
    const state = reducer(
      {
        data: {
          resources: {},
        },
      },
      'some action'
    );

    expect(selectors.publishedConnectors(state)).toEqual(
      SUITESCRIPT_CONNECTORS
    );
  });
  test('should return both suitescript and io connectors', () => {
    const state = reducer(
      {
        data: {
          resources: {
            published,
          },
        },
      },
      'some action'
    );

    expect(selectors.publishedConnectors(state)).toEqual(
      published.concat(SUITESCRIPT_CONNECTORS)
    );
  });
});

describe('userAccessLevelOnConnection selector', () => {
  // eslint-disable-next-line prettier/prettier
  test(`should return ${USER_ACCESS_LEVELS.ACCOUNT_OWNER} access level for account owner`, () => {
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
      },
      'some action'
    );

    expect(selectors.userAccessLevelOnConnection(state, 'c1')).toEqual(
      USER_ACCESS_LEVELS.ACCOUNT_OWNER
    );
  });
  describe('should return correct access level for org users', () => {
    const accounts = [
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
            accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
          },
          {
            _integrationId: 'i2',
            accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
          },
        ],
      },
    ];
    const testCases = [];

    testCases.push(
      [
        USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        'any',
        '',
        'account level manage user',
        'aShare1',
      ],
      [
        USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
        'any',
        '',
        'account level monitor user',
        'aShare2',
      ],
      [
        INTEGRATION_ACCESS_LEVELS.MONITOR,
        'c1',
        ' (registed on an integration that user has monitor access)',
        'tile level user',
        'aShare3',
      ],
      [
        INTEGRATION_ACCESS_LEVELS.MANAGE,
        'c2',
        ' (registed on an integration that user has manage access)',
        'tile level user',
        'aShare3',
      ],
      [
        undefined,
        'c4',
        ' (not registed on any integration that user has access)',
        'tile level user',
        'aShare3',
      ]
    );
    each(testCases).test(
      'should return %s for %s%s connection for %s',
      (expected, connectionId, description, userType, defaultAShareId) => {
        const state = reducer(
          {
            user: {
              profile: {},
              preferences: { defaultAShareId },
              org: {
                accounts,
              },
            },
            data: {
              resources: {
                integrations: [
                  { _id: 'i1', _registeredConnectionIds: ['c1', 'c2'] },
                  { _id: 'i2', _registeredConnectionIds: ['c2', 'c3'] },
                ],
              },
            },
          },
          'some action'
        );

        expect(
          selectors.userAccessLevelOnConnection(state, connectionId)
        ).toEqual(expected);
      }
    );
  });
});

describe('templates selectors', () => {
  describe('template Install Steps', () => {
    test('should return empty array when state is empty', () => {
      const state = {};

      expect(selectors.templateInstallSteps(state, 't1')).toEqual([]);
      expect(selectors.templateInstallSteps(undefined, 't1')).toEqual([]);
    });
    test('should return install steps with current step value set', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
        },
      ];
      const state = reducer(
        {
          session: {
            templates: {
              t1: { installSteps },
            },
          },
        },
        'some_action'
      );

      expect(selectors.templateInstallSteps(state, 't1')).toEqual([
        { stepName: 'stepName', stepId: 'stepId', isCurrentStep: true },
      ]);
    });
    test('should return install steps with current step value set on correct step', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          stepName: 'stepName2',
          stepId: 'stepId2',
        },
      ];
      const state = reducer(
        {
          session: {
            templates: {
              t1: { installSteps },
            },
          },
        },
        'some_action'
      );

      expect(selectors.templateInstallSteps(state, 't1')).toEqual([
        { stepName: 'stepName', stepId: 'stepId', completed: true },
        { stepName: 'stepName2', stepId: 'stepId2', isCurrentStep: true },
      ]);
    });
  });
});

describe('matchingConnectionList selector', () => {
  const netsuiteConnection = {
    _id: 'netsuiteId',
    type: 'netsuite',
    netsuite: {
      account: 'netsuite_account',
    },
  };
  const netsuiteConnectionConnector = {
    _id: 'netsuiteId',
    _connectorId: 'connector',
    type: 'netsuite',
    netsuite: {
      account: 'netsuite_account',
    },
  };
  const validNetsuiteConnection = {
    _id: 'netsuiteId',
    type: 'netsuite',
    netsuite: {
      account: 'netsuite_account',
      environment: 'production',
    },
  };
  const salesforceConnection = {
    _id: 'salesforce',
    type: 'salesforce',
  };
  const salesforceConnectionSandbox = {
    _id: 'salesforce',
    sandbox: true,
    type: 'salesforce',
  };
  const restConnection = {
    _id: 'restConnection',
    type: 'rest',
    rest: {
      baseURI: 'https://baseuri.com',
    },
  };
  const assistantConnection = {
    _id: 'assistant',
    type: 'rest',
    assistant: 'zendesk',
    rest: {
      baseURI: 'https://baseuri.com',
    },
  };
  const assistantConnectionSandbox = {
    _id: 'assistant',
    type: 'rest',
    sandbox: true,
    assistant: 'zendesk',
    rest: {
      baseURI: 'https://baseuri.com',
    },
  };
  const connections = [
    netsuiteConnection,
    netsuiteConnectionConnector,
    validNetsuiteConnection,
    salesforceConnection,
    salesforceConnectionSandbox,
    restConnection,
    assistantConnection,
    assistantConnectionSandbox,
  ];

  test('should not throw any error when params are bad', () => {
    const state = {};

    expect(selectors.matchingConnectionList(state, {})).toEqual([]);
    expect(selectors.matchingConnectionList(state, undefined)).toEqual([]);
    expect(selectors.matchingConnectionList(undefined, {})).toEqual([]);
    expect(selectors.matchingConnectionList(undefined, undefined)).toEqual([]);
  });
  test('should return correct values in production environment', () => {
    const state = reducer(
      {
        data: {
          resources: {
            connections,
          },
        },
      },
      'some_action'
    );

    expect(
      selectors.matchingConnectionList(state, { type: 'netsuite' })
    ).toEqual([validNetsuiteConnection]);
    expect(
      selectors.matchingConnectionList(state, { type: 'salesforce' })
    ).toEqual([salesforceConnection]);
    expect(selectors.matchingConnectionList(state, { type: 'rest' })).toEqual([
      restConnection,
      assistantConnection,
    ]);
  });
  test('should return correct values in sandbox environment', () => {
    const state = reducer(
      {
        data: {
          resources: {
            connections,
          },
        },
        user: {
          preferences: {
            environment: 'sandbox',
          },
        },
      },
      'some_action'
    );

    expect(
      selectors.matchingConnectionList(state, { type: 'netsuite' })
    ).toEqual([]);
    expect(
      selectors.matchingConnectionList(state, { type: 'salesforce' })
    ).toEqual([salesforceConnectionSandbox]);
    expect(selectors.matchingConnectionList(state, { type: 'rest' })).toEqual([
      assistantConnectionSandbox,
    ]);
  });
});

describe('matchingStackList selector', () => {
  const stack1 = {
    _id: '57bfd7d06260d08f1ea6b831',
    name: 'Hightech connectors',
    type: 'server',
    lastModified: '2017-07-27T07:34:04.291Z',
    createdAt: '2017-03-20T12:25:53.129Z',
    server: {
      systemToken: '******',
      hostURI: 'http://localhost.io:7000',
      ipRanges: [],
    },
  };
  const stack2 = {
    _id: '57bfd7d06260d08f1ea6b831',
    name: 'Hightech connectors',
    _connectorId: 'connector',
    type: 'lambda',
    lastModified: '2017-07-27T07:34:04.291Z',
    createdAt: '2017-03-20T12:25:53.129Z',
    lambda: {
      systemToken: '******',
      hostURI: 'http://localhost.io:7000',
      ipRanges: [],
    },
  };
  const stacks = [stack1, stack2];

  test('should not throw any error when params are bad', () => {
    const state = {};

    expect(selectors.matchingStackList(state, {})).toEqual([]);
    expect(selectors.matchingStackList(state, undefined)).toEqual([]);
    expect(selectors.matchingStackList(undefined, {})).toEqual([]);
    expect(selectors.matchingStackList(undefined, undefined)).toEqual([]);
  });
  test('should return correct values in production environment', () => {
    const state = reducer(
      {
        data: {
          resources: {
            stacks,
          },
        },
      },
      'some_action'
    );

    expect(selectors.matchingStackList(state)).toEqual([stack1]);
  });
  test('should return correct values in sandbox environment', () => {
    const state = reducer(
      {
        data: {
          resources: {
            stacks,
          },
        },
        user: {
          preferences: {
            environment: 'sandbox',
          },
        },
      },
      'some_action'
    );

    expect(selectors.matchingStackList(state)).toEqual([stack1]);
  });
});

describe('marketplaceConnectorList selector', () => {
  const connector1 = {
    _id: 'connector1',
    name: 'Sample Connector',
    contactEmail: 'sravan@sravan.com',
    published: false,
    _stackId: '57be8a07be81b76e185bbb8d',
    applications: ['amazonmws', 'netsuite'],
  };
  const connector2 = {
    _id: 'connector2',
    name: 'Sample Connector2',
    contactEmail: 'sravan@sravan.com',
    published: true,
    _stackId: '57be8a07be81b76e185bbb8d',
    applications: ['amazonmws', 'netsuite'],
  };
  const connectors = [connector1, connector2];

  test('should not throw any error when params are bad', () => {
    const state = {};

    expect(selectors.marketplaceConnectors(state, '')).toEqual([]);
    expect(selectors.marketplaceConnectors(state, undefined)).toEqual([]);
    expect(selectors.marketplaceConnectors(undefined, '')).toEqual([]);
    expect(selectors.marketplaceConnectors(undefined, undefined)).toEqual([]);
  });
  test('should return correct values with respect to environment', () => {
    const state = reducer(
      {
        data: {
          marketplace: {
            connectors,
            templates: [],
          },
        },
      },
      'some_action'
    );

    expect(selectors.marketplaceConnectors(state, 'netsuite')).toEqual([
      {
        _id: 'connector1',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector',
        published: false,
      },
      {
        _id: 'connector2',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector2',
        published: true,
      },
    ]);
    expect(selectors.marketplaceConnectors(state, 'amazonmws', false)).toEqual([
      {
        _id: 'connector1',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector',
        published: false,
      },
      {
        _id: 'connector2',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector2',
        published: true,
      },
    ]);
  });
  test('should return correct values with license values', () => {
    const state = reducer(
      {
        data: {
          marketplace: {
            connectors,
            templates: [],
          },
        },
        user: {
          org: {
            accounts: [
              {
                _id: 'accountId',
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [
                    {
                      _id: 'licenseId',
                      createdAt: 'date',
                      _connectorId: 'connector1',
                      expires: moment()
                        .add(1, 'y')
                        .toISOString(),
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      'some_action'
    );

    expect(selectors.marketplaceConnectors(state, 'netsuite')).toEqual([
      {
        _id: 'connector1',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector',
        published: false,
      },
      {
        _id: 'connector2',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector2',
        published: true,
      },
    ]);
    expect(selectors.marketplaceConnectors(state, 'amazonmws', false)).toEqual([
      {
        _id: 'connector1',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector',
        published: false,
      },
      {
        _id: 'connector2',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector2',
        published: true,
      },
    ]);
    expect(selectors.marketplaceConnectors(state, 'amazonmws', true)).toEqual([
      {
        _id: 'connector1',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector',
        published: false,
      },
      {
        _id: 'connector2',
        _stackId: '57be8a07be81b76e185bbb8d',
        applications: ['amazonmws', 'netsuite'],
        canInstall: false,
        contactEmail: 'sravan@sravan.com',
        installed: false,
        name: 'Sample Connector2',
        published: true,
      },
    ]);
  });
});

describe('integrationAppConnectionList reducer', () => {
  const integrations = [
    {
      _id: 'integrationId',
      name: 'Integration Name',
    },
    {
      _id: 'integrationId2',
      name: 'Integration Name',
      settings: {
        supportsMultiStore: true,
        sections: [
          {
            title: 'store1',
            id: 'store1',
            sections: [
              {
                title: 'Section Title',
                flows: [
                  {
                    _id: 'flow1',
                  },
                  {
                    _id: 'flow2',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ];
  const exports = [
    {
      _id: 'export1',
      name: 'export1',
      _connectionId: 'connection3',
    },
    {
      _id: 'export2',
      name: 'export2',
      _connectionId: 'connection4',
    },
  ];
  const imports = [
    {
      _id: 'import1',
      name: 'import1',
      _connectionId: 'connection3',
    },
    {
      _id: 'import1',
      name: 'import1',
      _connectionId: 'connection4',
    },
  ];
  const flows = [
    {
      _id: 'flow1',
      name: 'flow1',
      pageGenerators: [{ _exportId: 'export1' }],
      pageProcessors: [
        { _importId: 'import1', type: 'import' },
        { _importId: 'import2', type: 'import' },
      ],
    },
    {
      _id: 'flow2',
      name: 'flow2',
      pageGenerators: [{ _exportId: 'export2' }],
      pageProcessors: [{ _importId: 'import1', type: 'import' }],
    },
  ];
  const connections = [
    {
      _id: 'connection1',
      type: 'rest',
      _integrationId: 'integrationId',
      rest: {},
    },
    {
      _id: 'connection3',
      _integrationId: 'integrationId2',
      type: 'rest',
      rest: {},
    },
    {
      _id: 'connection4',
      _integrationId: 'integrationId2',
      type: 'rest',
      rest: {},
    },
    {
      _id: 'connection2',
      _integrationId: 'integrationId',
      type: 'netsuite',
      netsuite: {},
    },
  ];

  test('should not throw error for bad params', () => {
    const state = reducer({}, 'some_action');

    expect(
      selectors.integrationAppConnectionList(state, 'integrationId')
    ).toEqual([]);
    expect(
      selectors.integrationAppConnectionList(undefined, 'integrationId')
    ).toEqual([]);
    expect(selectors.integrationAppConnectionList(state, undefined)).toEqual(
      []
    );
  });
  test('should return correct connectionIds', () => {
    const state = reducer(
      {
        data: {
          resources: {
            integrations,
            connections,
            exports,
            imports,
            flows,
          },
        },
      },
      'some_action'
    );
    const data = selectors.integrationAppConnectionList(state, 'integrationId');

    // We dont need permissions to be tested here as we would have explicit tests for those.
    data.forEach(c => {
      // eslint-disable-next-line no-param-reassign
      delete c.permissions;

      return c;
    });
    expect(data).toEqual([
      {
        _id: 'connection1',
        _integrationId: 'integrationId',
        rest: {},
        type: 'rest',
      },
      {
        _id: 'connection2',
        _integrationId: 'integrationId',
        netsuite: {},
        type: 'netsuite',
      },
    ]);
  });
  test('should return correct connectionIds', () => {
    const state = reducer(
      {
        data: {
          resources: {
            integrations,
            connections,
            exports,
            imports,
            flows,
          },
        },
      },
      'some_action'
    );
    const data = selectors.integrationAppConnectionList(
      state,
      'integrationId2',
      'store1'
    );

    // We dont need permissions to be tested here as we would have explicit tests for those.
    data.forEach(c => {
      // eslint-disable-next-line no-param-reassign
      delete c.permissions;

      return c;
    });
    expect(data).toEqual([
      {
        _id: 'connection3',
        _integrationId: 'integrationId2',
        type: 'rest',
        rest: {},
      },
      {
        _id: 'connection4',
        _integrationId: 'integrationId2',
        type: 'rest',
        rest: {},
      },
    ]);
  });
});

describe('integrationAppSettings reducer', () => {
  const integrations = [
    {
      _id: 'integrationId',
      name: 'integration Name',
      _connectorId: 'connectorId',
      settings: {
        sections: [
          {
            id: 'store1',
            sections: [
              {
                id: 'sectionTitle',
                flows: [
                  {
                    _id: 'flowId',
                  },
                ],
              },
            ],
          },
        ],
        supportsMultiStore: true,
      },
    },
    {
      _id: 'integrationId2',
      name: 'integration2 Name',
      _connectorId: 'connectorId1',
      settings: {
        sections: [
          {
            id: 'sectionTitle',
            flows: [
              {
                _id: 'flowId',
              },
            ],
          },
        ],
      },
    },
  ];

  test('should not throw error for bad params', () => {
    expect(selectors.integrationAppSettings({}, 'integrationId')).toEqual({
      settings: {},
    });
    expect(selectors.integrationAppSettings(undefined, undefined)).toEqual({
      settings: {},
    });
    expect(
      selectors.integrationAppSettings(undefined, undefined, undefined)
    ).toEqual({ settings: {} });
    expect(selectors.integrationAppSettings()).toEqual({ settings: {} });
  });

  test('should return correct integration App settings for multistore integrationApp', () => {
    const state = reducer(
      {
        data: {
          resources: {
            integrations,
          },
        },
      },
      'some_action'
    );

    expect(
      selectors.integrationAppSettings(state, 'integrationId', 'store1')
    ).toEqual({
      _id: 'integrationId',
      _connectorId: 'connectorId',
      name: 'integration Name',
      settings: {
        sections: [
          {
            id: 'store1',
            sections: [{ flows: [{ _id: 'flowId' }], id: 'sectionTitle' }],
          },
        ],
        supportsMultiStore: true,
      },
      stores: [
        { hidden: false, label: undefined, mode: undefined, value: 'store1' },
      ],
    });

    expect(selectors.integrationAppSettings(state, 'integrationId')).toEqual({
      _connectorId: 'connectorId',
      _id: 'integrationId',
      name: 'integration Name',
      settings: {
        sections: [
          {
            id: 'store1',
            sections: [{ flows: [{ _id: 'flowId' }], id: 'sectionTitle' }],
          },
        ],
        supportsMultiStore: true,
      },
      stores: [
        { hidden: false, label: undefined, mode: undefined, value: 'store1' },
      ],
    });
  });
  test('should return correct integration App settings for single store integrationApp', () => {
    const state = reducer(
      {
        data: {
          resources: {
            integrations,
          },
        },
      },
      'some_action'
    );

    expect(selectors.integrationAppSettings(state, 'integrationId2')).toEqual({
      _id: 'integrationId2',
      _connectorId: 'connectorId1',
      name: 'integration2 Name',
      settings: {
        sections: [{ flows: [{ _id: 'flowId' }], id: 'sectionTitle' }],
      },
    });
  });
});

describe('integrationApp Settings reducers', () => {
  const integrations = [
    {
      _id: 'integrationId',
      name: 'Cash Application Manager for NetSuite',
      _connectorId: '57d6475369ae57ad50bf835b',
      mode: 'settings',
      settings: {
        general: [
          {
            id: 'fb5fb65e',
            description:
              'This section contains setting options which impact the entire Connector.',
            fields: [
              {
                label: 'Enable Manual Upload Mode',
                type: 'checkbox',
                name: 'enableManualUploadMode_fb5fb65e',
                tooltip: 'Select the checkbox for manual upload of file.',
              },
            ],
          },
          {
            id: 'dd67a407',
            description:
              'This section contains setting options which impact the entire Connector.',
            fields: [
              {
                label: 'Enable Manual Upload Mode',
                type: 'checkbox',
                name: 'enableManualUploadMode_dd67a407',
                tooltip: 'Select the checkbox for manual upload of file.',
              },
            ],
          },
          {
            id: '9606430a',
            description:
              'This section contains setting options which impact the entire Connector.',
            fields: [
              {
                label: 'Enable Manual Upload Mode',
                type: 'checkbox',
                name: 'enableManualUploadMode_9606430a',
                tooltip: 'Select the checkbox for manual upload of file.',
              },
            ],
          },
        ],
        connectorEdition: 'premium',
        hideUninstall: true,
        sections: [
          {
            title: 'BILLTECH',
            id: 'fb5fb65e',
            sections: [
              {
                title: 'CSV',
                iconURL: '/images/icons/settings/BAI2.png',
                flows: [
                  {
                    _id: '5d9f70b98a71fc911a4068bd',
                    showMapping: true,
                    showSchedule: true,
                    sections: [
                      {
                        title: 'File Import',
                        fields: [
                          {
                            label: 'Directory Path:',
                            type: 'input',
                            name: 'directoryPath_5d9f70b98a71fc911a4068bd',
                            required: true,
                            placeholder:
                              'Enter FTP folder path, such as Directory/File',
                            tooltip:
                              'Please provide the path of the Directory in the FTP server where the files are stored.',
                          },
                          {
                            label: 'File Name Starts With:',
                            type: 'input',
                            name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                            placeholder: 'Optional',
                            tooltip:
                              'Please provide the first few characters of the file name which the Connector should read.',
                          },
                          {
                            label: 'File Name Ends With:',
                            type: 'input',
                            name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                            placeholder: 'Optional',
                            tooltip:
                              'Please provide the last few characters of the file name which the Connector should read.',
                          },
                          {
                            label: 'Sample File:',
                            type: 'file',
                            name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                            value: '',
                            tooltip:
                              'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                          },
                          {
                            label: 'Leave File On Server',
                            type: 'checkbox',
                            name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                            value: false,
                            tooltip:
                              'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                          },
                          {
                            label: 'Use Credit Memos',
                            type: 'checkbox',
                            name:
                              'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                            value: false,
                            tooltip:
                              'Choose this setting if the Connector should sync credit memos.',
                          },
                          {
                            label: 'Ignore following Customers:',
                            type: 'textarea',
                            name:
                              'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                            value: '',
                            placeholder: 'eg. ACME Inc., S Industries',
                            tooltip:
                              'Please enter names of customers (separated by ",") for which payments should be ignored.',
                          },
                          {
                            label: 'NetSuite Invoice Prefix:',
                            type: 'textarea',
                            name:
                              'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                            value: '',
                            placeholder: 'eg. INV, IV',
                            tooltip:
                              'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                          },
                          {
                            label: 'NetSuite Invoice Identifier',
                            type: 'select',
                            name:
                              'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                            options: [['tranid_Invoice #', 'Invoice #']],
                            value: 'tranid_Invoice #',
                            supportsRefresh: true,
                            tooltip:
                              'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                          },
                          {
                            label: 'Column Delimiter:',
                            type: 'input',
                            name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                            placeholder: 'Optional',
                            tooltip: 'Please provide the column delimiter.',
                          },
                          {
                            label: 'Archive file',
                            type: 'checkbox',
                            name: 'archive_file_5d9f70b98a71fc911a4068bd',
                            value: false,
                            tooltip:
                              'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
                            dependencies: {
                              disabled: {
                                fields: [
                                  {
                                    name:
                                      'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                                    hidden: true,
                                    required: false,
                                  },
                                ],
                              },
                              enabled: {
                                fields: [
                                  {
                                    name:
                                      'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                                    hidden: false,
                                    required: true,
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      {
                        title: 'File Parsing',
                        fields: [
                          {
                            label: 'Batch Record',
                            title: 'Batch Record',
                            type: 'csvColumnMapper',
                            maxNumberOfColumns: 50,
                            name: '_batch_record_5d9f70b98a71fc911a4068bd',
                            value: [],
                            tooltip:
                              'Settings to change the column position of fields in csv file format.',
                          },
                          {
                            label: 'Transaction Record',
                            title: 'Transaction Record',
                            type: 'csvColumnMapper',
                            maxNumberOfColumns: 50,
                            name:
                              '_transaction_record_5d9f70b98a71fc911a4068bd',
                            value: [
                              {
                                fieldName: 'Transaction Id',
                                column: '1',
                              },
                            ],
                            tooltip:
                              'Settings to change the column position of fields in csv file format.',
                          },
                          {
                            label: 'Invoice Record',
                            title: 'Invoice Record',
                            type: 'csvColumnMapper',
                            maxNumberOfColumns: 50,
                            name: '_invoice_record_5d9f70b98a71fc911a4068bd',
                            value: [
                              {
                                fieldName: 'Invoice number',
                                column: '19',
                              },
                              {
                                fieldName: 'Invoice Date',
                                column: '4',
                              },
                              {
                                fieldName: 'Invoice amount',
                                column: '8',
                              },
                            ],
                            tooltip:
                              'Settings to change the column position of fields in csv file format.',
                          },
                        ],
                      },
                      {
                        title: 'Advanced Settings',
                        fields: [
                          {
                            label: 'Transaction Filter: Choose an action',
                            type: 'radio',
                            name:
                              'transactionFilterOptions_5d9f70b98a71fc911a4068bd',
                            properties: {
                              sectionName: 'Filter Settings',
                            },
                            options: [
                              ['skip', 'Skip'],
                              ['allow', 'Allow'],
                              ['default', 'Default'],
                            ],
                            tooltip:
                              'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                          },
                          {
                            label: 'Enter Transaction Codes',
                            type: 'input',
                            name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                            placeholder: 'eg. 100,102,104,201-299,305',
                            tooltip:
                              "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
                            properties: {
                              sectionName: 'Filter Settings',
                            },
                          },
                          {
                            label: 'Default Currency',
                            type: 'select',
                            name:
                              'select_bank_currency_5d9f70b98a71fc911a4068bd',
                            options: [],
                            supportsRefresh: true,
                            tooltip:
                              'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                            properties: {
                              sectionName: 'Payment Settings',
                            },
                          },
                          {
                            label: 'Customer Has Priority',
                            type: 'checkbox',
                            name:
                              'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',
                            tooltip:
                              'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            label: 'Identify invoice with Amount',
                            name:
                              'checkbox_match_invoice_with_amount_5d9f70b98a71fc911a4068bd',
                            type: 'checkbox',
                            value: false,
                            tooltip:
                              'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            label: 'Skip Zero Amount Transactions',
                            type: 'checkbox',
                            name:
                              'checkbox_skip_zero_amount_transactions_5d9f70b98a71fc911a4068bd',
                            value: true,
                            tooltip:
                              'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
                            properties: {
                              sectionName: 'Payment Settings',
                            },
                          },
                          {
                            label:
                              "Don't create payment in locked posting period",
                            type: 'checkbox',
                            name:
                              'checkbox_validate_posting_period_5d9f70b98a71fc911a4068bd',
                            value: true,
                            tooltip:
                              'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
                            properties: {
                              sectionName: 'Payment Settings',
                            },
                          },
                          {
                            label: 'Advanced Search for Customers',
                            type: 'checkbox',
                            name:
                              'checkbox_use_fuzzy_search_5d9f70b98a71fc911a4068bd',
                            value: false,
                            tooltip:
                              'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
                            dependencies: {
                              disabled: {
                                fields: [
                                  {
                                    name:
                                      'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                                    hidden: true,
                                    required: false,
                                  },
                                ],
                              },
                              enabled: {
                                fields: [
                                  {
                                    name:
                                      'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                                    hidden: false,
                                    required: true,
                                  },
                                ],
                              },
                            },
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            label: 'Threshold',
                            type: 'input',
                            name:
                              'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                            value: '0.1',
                            tooltip:
                              'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            type: 'subsidiaryMapWidget',
                            name:
                              'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',
                            tooltip:
                              'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
                            title: 'Multi-subsidiary Settings',
                            optionsMap: [
                              {
                                id: 'subsidiary',
                                name: 'Subsidiary',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'paymentAccount',
                                name: 'Payment Account',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'debitAccount',
                                name: 'Write off Account',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'depositAccount',
                                name: 'Customer Deposit Account',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'dummyCustomer',
                                name: 'Dummy Customer',
                                type: 'input',
                              },
                            ],
                            value: [],
                          },
                        ],
                      },
                    ],
                    matchingRules: {
                      transactionStatusValues: [],
                      creditMemoStatusValues: [],
                      applyValues: [],
                      expressionSearchFilters: [],
                      expressionSearchOperators: [],
                      expressionSearchValues: [],
                      value: [],
                    },
                  },
                ],
              },
            ],
          },
          {
            title: 'HSBC',
            id: 'dd67a407',
            sections: [
              {
                title: 'CSV',
                iconURL: '/images/icons/settings/BAI2.png',
                flows: [
                  {
                    _id: '5d9f71628a71fc911a4068d9',
                    showMapping: true,
                    showSchedule: true,
                    sections: [
                      {
                        title: 'File Import',
                        fields: [
                          {
                            label: 'Directory Path:',
                            type: 'input',
                            name: 'directoryPath_5d9f71628a71fc911a4068d9',
                            required: true,
                            placeholder:
                              'Enter FTP folder path, such as Directory/File',
                            tooltip:
                              'Please provide the path of the Directory in the FTP server where the files are stored.',
                          },
                          {
                            label: 'File Name Starts With:',
                            type: 'input',
                            name: 'fileNameStartsWith_5d9f71628a71fc911a4068d9',
                            placeholder: 'Optional',
                            tooltip:
                              'Please provide the first few characters of the file name which the Connector should read.',
                          },
                          {
                            label: 'File Name Ends With:',
                            type: 'input',
                            name: 'fileNameEndsWith_5d9f71628a71fc911a4068d9',
                            placeholder: 'Optional',
                            tooltip:
                              'Please provide the last few characters of the file name which the Connector should read.',
                          },
                          {
                            label: 'Sample File:',
                            type: 'file',
                            name: 'ftp_sample_file_5d9f71628a71fc911a4068d9',
                            value: '',
                            tooltip:
                              'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                          },
                          {
                            label: 'Leave File On Server',
                            type: 'checkbox',
                            name: 'skipDelete_5d9f71628a71fc911a4068d9',
                            value: false,
                            tooltip:
                              'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                          },
                          {
                            label: 'Use Credit Memos',
                            type: 'checkbox',
                            name:
                              'checkbox_credit_memo_5d9f71628a71fc911a4068d9',
                            value: false,
                            tooltip:
                              'Choose this setting if the Connector should sync credit memos.',
                          },
                          {
                            label: 'Ignore following Customers:',
                            type: 'textarea',
                            name:
                              'textarea_customer_filter_5d9f71628a71fc911a4068d9',
                            value: '',
                            placeholder: 'eg. ACME Inc., S Industries',
                            tooltip:
                              'Please enter names of customers (separated by ",") for which payments should be ignored.',
                          },
                          {
                            label: 'NetSuite Invoice Prefix:',
                            type: 'textarea',
                            name:
                              'textarea_ns_invoice_prefix_5d9f71628a71fc911a4068d9',
                            value: '',
                            placeholder: 'eg. INV, IV',
                            tooltip:
                              'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                          },
                          {
                            label: 'NetSuite Invoice Identifier',
                            type: 'select',
                            name:
                              'select_ns_invoice_identifier_5d9f71628a71fc911a4068d9',
                            options: [['tranid_Invoice #', 'Invoice #']],
                            value: 'tranid_Invoice #',
                            supportsRefresh: true,
                            tooltip:
                              'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                          },
                          {
                            label: 'Column Delimiter:',
                            type: 'input',
                            name: 'columnDelimiter_5d9f71628a71fc911a4068d9',
                            placeholder: 'Optional',
                            tooltip: 'Please provide the column delimiter.',
                          },
                          {
                            label: 'Archive file',
                            type: 'checkbox',
                            name: 'archive_file_5d9f71628a71fc911a4068d9',
                            value: false,
                            tooltip:
                              'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
                            dependencies: {
                              disabled: {
                                fields: [
                                  {
                                    name:
                                      'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                                    hidden: true,
                                    required: false,
                                  },
                                ],
                              },
                              enabled: {
                                fields: [
                                  {
                                    name:
                                      'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                                    hidden: false,
                                    required: true,
                                  },
                                ],
                              },
                            },
                          },
                          {
                            label: 'NetSuite Archive Folder: ',
                            type: 'input',
                            name:
                              'netsuite_archive_dir_5d9f71628a71fc911a4068d9',
                            placeholder: 'Optional',
                            tooltip:
                              'Specify the netsuite file cabinet location where the outgoing file will be archived once it has been transferred.',
                          },
                          {
                            label: 'File Has Header Row',
                            type: 'checkbox',
                            name: 'hasHeaderRow_5d9f71628a71fc911a4068d9',
                            value: false,
                            tooltip:
                              'Please indicate if the csv file has column headers',
                          },
                        ],
                      },
                      {
                        title: 'File Parsing',
                        fields: [
                          {
                            label: 'Batch Record',
                            title: 'Batch Record',
                            type: 'csvColumnMapper',
                            maxNumberOfColumns: 50,
                            name: '_batch_record_5d9f71628a71fc911a4068d9',
                            value: [
                              {
                                fieldName: 'Batch Number',
                                column: '1',
                                columnName: 'BATCH NUMBER',
                              },
                              {
                                fieldName: 'Batch Date',
                                column: '2',
                                columnName: 'DEPOSIT DATE',
                              },
                            ],
                            tooltip:
                              'Settings to change the column position of fields in csv file format.',
                          },
                          {
                            label: 'Transaction Record',
                            title: 'Transaction Record',
                            type: 'csvColumnMapper',
                            maxNumberOfColumns: 50,
                            name:
                              '_transaction_record_5d9f71628a71fc911a4068d9',
                            value: [
                              {
                                fieldName: 'Transaction Id',
                                column: '3',
                                columnName: 'TRANSIT ROUTING #',
                              },
                              {
                                fieldName: 'Check Number',
                                column: '4',
                                columnName: 'CHECK NUMBER',
                              },
                              {
                                fieldName: 'Payment Amount',
                                column: '5',
                                columnName: 'CHECK AMOUNT',
                              },
                              {
                                fieldName: 'Customer Name',
                                column: '6',
                                columnName: 'REMITTER NAME',
                              },
                              {
                                fieldName: 'Check Date',
                                column: '7',
                                columnName: 'CHECK DATE',
                              },
                            ],
                            tooltip:
                              'Settings to change the column position of fields in csv file format.',
                          },
                          {
                            label: 'Invoice Record',
                            title: 'Invoice Record',
                            type: 'csvColumnMapper',
                            maxNumberOfColumns: 50,
                            name: '_invoice_record_5d9f71628a71fc911a4068d9',
                            value: [
                              {
                                fieldName: 'Invoice number',
                                column: '8',
                                columnName: 'INVOICE NUMBER',
                              },
                            ],
                            tooltip:
                              'Settings to change the column position of fields in csv file format.',
                          },
                        ],
                      },
                      {
                        title: 'Advanced Settings',
                        fields: [
                          {
                            label: 'Transaction Filter: Choose an action',
                            type: 'radio',
                            name:
                              'transactionFilterOptions_5d9f71628a71fc911a4068d9',
                            properties: {
                              sectionName: 'Filter Settings',
                            },
                            options: [
                              ['skip', 'Skip'],
                              ['allow', 'Allow'],
                              ['default', 'Default'],
                            ],
                            tooltip:
                              'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                          },
                          {
                            label: 'Enter Transaction Codes',
                            type: 'input',
                            name: 'transactionCodes_5d9f71628a71fc911a4068d9',
                            placeholder: 'eg. 100,102,104,201-299,305',
                            tooltip:
                              "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
                            properties: {
                              sectionName: 'Filter Settings',
                            },
                          },
                          {
                            label: 'Default Currency',
                            type: 'select',
                            name:
                              'select_bank_currency_5d9f71628a71fc911a4068d9',
                            options: [],
                            supportsRefresh: true,
                            tooltip:
                              'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                            properties: {
                              sectionName: 'Payment Settings',
                            },
                          },
                          {
                            label: 'Customer Has Priority',
                            type: 'checkbox',
                            name:
                              'checkbox_customer_priority_5d9f71628a71fc911a4068d9',
                            tooltip:
                              'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            label: 'Identify invoice with Amount',
                            name:
                              'checkbox_match_invoice_with_amount_5d9f71628a71fc911a4068d9',
                            type: 'checkbox',
                            value: false,
                            tooltip:
                              'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            label: 'Skip Zero Amount Transactions',
                            type: 'checkbox',
                            name:
                              'checkbox_skip_zero_amount_transactions_5d9f71628a71fc911a4068d9',
                            value: true,
                            tooltip:
                              'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
                            properties: {
                              sectionName: 'Payment Settings',
                            },
                          },
                          {
                            label:
                              "Don't create payment in locked posting period",
                            type: 'checkbox',
                            name:
                              'checkbox_validate_posting_period_5d9f71628a71fc911a4068d9',
                            value: true,
                            tooltip:
                              'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
                            properties: {
                              sectionName: 'Payment Settings',
                            },
                          },
                          {
                            label: 'Advanced Search for Customers',
                            type: 'checkbox',
                            name:
                              'checkbox_use_fuzzy_search_5d9f71628a71fc911a4068d9',
                            value: false,
                            tooltip:
                              'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
                            dependencies: {
                              disabled: {
                                fields: [
                                  {
                                    name:
                                      'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                                    hidden: true,
                                    required: false,
                                  },
                                ],
                              },
                              enabled: {
                                fields: [
                                  {
                                    name:
                                      'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                                    hidden: false,
                                    required: true,
                                  },
                                ],
                              },
                            },
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            label: 'Threshold',
                            type: 'input',
                            name:
                              'fuzzy_config_threshold_value_5d9f71628a71fc911a4068d9',
                            value: '0.1',
                            tooltip:
                              'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                            properties: {
                              sectionName: 'Matching Settings',
                            },
                          },
                          {
                            type: 'subsidiaryMapWidget',
                            name:
                              'multisubsidiary_settings_5d9f71628a71fc911a4068d9',
                            tooltip:
                              'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
                            title: 'Multi-subsidiary Settings',
                            optionsMap: [
                              {
                                id: 'subsidiary',
                                name: 'Subsidiary',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'paymentAccount',
                                name: 'Payment Account',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'debitAccount',
                                name: 'Write off Account',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'depositAccount',
                                name: 'Customer Deposit Account',
                                type: 'select',
                                options: [],
                              },
                              {
                                id: 'dummyCustomer',
                                name: 'Dummy Customer',
                                type: 'input',
                              },
                            ],
                            value: [],
                          },
                        ],
                      },
                    ],
                    matchingRules: {
                      transactionStatusValues: [],
                      creditMemoStatusValues: [],
                      applyValues: [],
                      expressionSearchFilters: [],
                      expressionSearchOperators: [],
                      expressionSearchValues: [],
                      value: [],
                    },
                  },
                ],
              },
            ],
          },
        ],
        supportsMultiStore: true,
        supportsMatchRuleEngine: true,
        storeLabel: 'Bank',
      },
    },
    {
      _id: 'integrationId2',
      lastModified: '2019-10-21T06:53:12.363Z',
      name: 'Zendesk - NetSuite Connector',
      _connectorId: '57a84990c6c1b3551ea5d59c',
      mode: 'settings',
      settings: {
        general: {
          description:
            'This section contains setting options which impact the entire Connector.',
          fields: [
            {
              label: 'Enable Test Mode',
              type: 'checkbox',
              name: 'enableTestMode',
              tooltip:
                'If you are setting up the Connector and only want few test records to sync, enable this setting. Only records which have a field pre-fixed with the Test Mode Text will be selected for syncing.',
              value: false,
            },
            {
              label: 'Test Mode Text',
              name: 'testModeText',
              tooltip:
                'This text should be at least 5 characters long. Records with a field prefixed with this text will be selected for syncing.',
              value: '',
            },
          ],
        },
        sections: [
          {
            title: 'Organization Sync',
            description:
              'This section contains settings to sync NetSuite Customers and Zendesk Organizations between the two systems.',
            columns: 1,
            flows: [
              {
                _id: '5d9b20328a71fc911a4018a4',
                showMapping: true,
                showSchedule: false,
                settings: [
                  {
                    label: 'Execution Context',
                    type: 'multiselect',
                    name: 'executionContext',
                    value: [
                      'userevent',
                      'webservices',
                      'csvimport',
                      'userinterface',
                    ],
                    options: [
                      ['userevent', 'User Event'],
                      ['webservices', 'Web Services'],
                      ['csvimport', 'CSV Import'],
                      ['scheduled', 'Scheduled'],
                      ['workflow', 'Work Flow'],
                      ['userinterface', 'User Interface'],
                    ],
                  },
                  {
                    label: 'Execution Type',
                    type: 'multiselect',
                    name: 'executionType',
                    value: ['edit', 'create', 'xedit'],
                    options: [
                      ['edit', 'Edit'],
                      ['create', 'Create'],
                      ['xedit', 'xEdit'],
                    ],
                  },
                  {
                    label: 'Qualifier',
                    type: 'expression',
                    expressionType: 'export',
                    name: 'qualifier',
                    value:
                      '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",true]]',
                  },
                ],
              },
              {
                _id: '5d9b20328a71fc911a4018ad',
                showMapping: true,
                showSchedule: false,
                settings: [
                  {
                    label: 'Execution Context',
                    type: 'multiselect',
                    name: 'executionContext',
                    value: [
                      'userevent',
                      'webservices',
                      'csvimport',
                      'userinterface',
                    ],
                    options: [
                      ['userevent', 'User Event'],
                      ['webservices', 'Web Services'],
                      ['csvimport', 'CSV Import'],
                      ['scheduled', 'Scheduled'],
                      ['workflow', 'Work Flow'],
                      ['userinterface', 'User Interface'],
                    ],
                  },
                  {
                    label: 'Execution Type',
                    type: 'multiselect',
                    name: 'executionType',
                    value: ['edit', 'create', 'xedit'],
                    options: [
                      ['edit', 'Edit'],
                      ['create', 'Create'],
                      ['xedit', 'xEdit'],
                    ],
                  },
                  {
                    label: 'Qualifier',
                    type: 'expression',
                    expressionType: 'export',
                    name: 'qualifier',
                    value:
                      '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",false]]',
                  },
                ],
              },
              {
                _id: '5d9b20328a71fc911a4018a7',
                showMapping: true,
                showSchedule: true,
              },
              {
                _id: '5d9b20328a71fc911a4018ac',
                showMapping: true,
                showSchedule: true,
              },
            ],
            fields: [
              {
                label: 'Sync all Zendesk Organizations as NetSuite Customers',
                type: 'checkbox',
                name: 'sync_zendesk_organizations_as_netsuite_customsers',
                tooltip:
                  'If this setting is selected all Zendesk Organizations will be synced as NetSuite Customers.',
                value: true,
              },
            ],
          },
          {
            title: 'Tickets Sync',
            description:
              'This section contains settings to sync NetSuite Cases and Zendesk Tickets between the two systems.',
            editions: ['premium'],
            columns: 1,
            flows: [
              {
                _id: '5d9b20328a71fc911a4018a9',
                showMapping: true,
                showSchedule: false,
                settings: [
                  {
                    label: 'Execution Context',
                    type: 'multiselect',
                    name: 'executionContext',
                    value: [
                      'userevent',
                      'webservices',
                      'csvimport',
                      'userinterface',
                    ],
                    options: [
                      ['userevent', 'User Event'],
                      ['webservices', 'Web Services'],
                      ['csvimport', 'CSV Import'],
                      ['scheduled', 'Scheduled'],
                      ['workflow', 'Work Flow'],
                      ['userinterface', 'User Interface'],
                    ],
                  },
                  {
                    label: 'Execution Type',
                    type: 'multiselect',
                    name: 'executionType',
                    value: ['edit', 'create'],
                    options: [['edit', 'Edit'], ['create', 'Create']],
                  },
                  {
                    label: 'Qualifier',
                    type: 'expression',
                    expressionType: 'export',
                    name: 'qualifier',
                    value: '["custevent_celigo_znc_zendesk_id","empty",true]',
                  },
                ],
              },
              {
                _id: '5d9b20328a71fc911a4018a8',
                showMapping: true,
                showSchedule: false,
                settings: [
                  {
                    label: 'Execution Context',
                    type: 'multiselect',
                    name: 'executionContext',
                    value: [
                      'userevent',
                      'webservices',
                      'csvimport',
                      'userinterface',
                    ],
                    options: [
                      ['userevent', 'User Event'],
                      ['webservices', 'Web Services'],
                      ['csvimport', 'CSV Import'],
                      ['scheduled', 'Scheduled'],
                      ['workflow', 'Work Flow'],
                      ['userinterface', 'User Interface'],
                    ],
                  },
                  {
                    label: 'Execution Type',
                    type: 'multiselect',
                    name: 'executionType',
                    value: ['edit', 'xedit'],
                    options: [['edit', 'Edit'], ['xedit', 'xEdit']],
                  },
                  {
                    label: 'Qualifier',
                    type: 'expression',
                    expressionType: 'export',
                    name: 'qualifier',
                    value: '["custevent_celigo_znc_zendesk_id","empty",false]',
                  },
                ],
              },
              {
                _id: '5d9b20328a71fc911a4018b2',
                showMapping: true,
                showSchedule: true,
              },
              {
                _id: '5d9b20328a71fc911a4018b3',
                showMapping: true,
                showSchedule: true,
              },
              {
                _id: '5d9b20328a71fc911a4018b0',
                showMapping: true,
                showSchedule: true,
              },
              {
                _id: '5d9b20328a71fc911a4018ba',
                showMapping: true,
                showSchedule: true,
              },
            ],
            fields: [
              {
                label:
                  'Create Zendesk Organization and User (if non-existent) while syncing NetSuite Support Case',
                type: 'checkbox',
                name: 'create_users_and_organizations_in_zendesk',
                tooltip:
                  'The Connector will first create the Zendesk Organization and User and then sync the NetSuite Support Case as Zendesk Ticket under the Zendesk User.',
                value: false,
              },
              {
                label:
                  'Create NetSuite Customer and Contact (if non-existent) while syncing Zendesk Ticket',
                type: 'checkbox',
                name: 'create_contacts_and_customers_in_netsuite',
                tooltip:
                  'The Connector will first create the NetSuite Customer and Contact and then sync the Zendesk Ticket as NetSuite Support Case NetSuite Customer.',
                value: false,
              },
              {
                label:
                  'Sync Zendesk Ticket Public Replies to NetSuite Case as Message',
                type: 'checkbox',
                name: 'sync_ticket_comments_to_netsuite',
                tooltip:
                  'Zendesk Ticket Public replies will be synced as Public Case Messages in NetSuite.',
                value: false,
              },

              {
                label:
                  'Sync attachments in NetSuite Support Cases to Zendesk Tickets',
                type: 'checkbox',
                name: 'sync_attachments_from_netsuite_to_zendesk',
                tooltip:
                  'If this setting is selected, NetSuite Case Attachments will be synced to Zendesk.',
                value: false,
              },
            ],
          },
        ],
        connectorEdition: 'premium',
      },
    },
  ];
  const flows = [
    {
      _id: '5d9b20328a71fc911a4018a4',
      name: '5d9b20328a71fc911a4018a4',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018ad',
      name: '5d9b20328a71fc911a4018ad',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018a7',
      name: '5d9b20328a71fc911a4018a7',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018ac',
      name: '5d9b20328a71fc911a4018ac',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018a9',
      name: '5d9b20328a71fc911a4018a9',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018a8',
      name: '5d9b20328a71fc911a4018a8',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018b2',
      name: '5d9b20328a71fc911a4018b2',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018b3',
      name: '5d9b20328a71fc911a4018b3',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018b0',
      name: '5d9b20328a71fc911a4018b0',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9b20328a71fc911a4018ba',
      name: '5d9b20328a71fc911a4018ba',
      _integrationId: 'integrationId2',
    },
    {
      _id: '5d9f70b98a71fc911a4068bd',
      name: '5d9f70b98a71fc911a4068bd',
      _integrationId: 'integrationId',
    },
    {
      _id: '5d9f71628a71fc911a4068d9',
      name: '5d9f71628a71fc911a4068d9',
      _integrationId: 'integrationId',
    },
  ];

  describe('integrationAppFlowSections reducer', () => {
    test('should not throw error for bad params', () => {
      expect(selectors.integrationAppFlowSections({}, undefined)).toEqual([]);
      expect(selectors.integrationAppFlowSections()).toEqual([]);
      expect(
        selectors.integrationAppFlowSections(
          undefined,
          'integrationId',
          'fb5fb65e'
        )
      ).toEqual([]);
    });

    test('should return correct flow sections for multistore integrationApp', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSections(state, 'integrationId', 'fb5fb65e')
      ).toEqual([
        {
          flows: [
            {
              _id: '5d9f70b98a71fc911a4068bd',
              matchingRules: {
                applyValues: [],
                creditMemoStatusValues: [],
                expressionSearchFilters: [],
                expressionSearchOperators: [],
                expressionSearchValues: [],
                transactionStatusValues: [],
                value: [],
              },
              sections: [
                {
                  title: 'File Import',
                  fields: [
                    {
                      label: 'Directory Path:',
                      type: 'input',
                      name: 'directoryPath_5d9f70b98a71fc911a4068bd',
                      required: true,
                      placeholder:
                        'Enter FTP folder path, such as Directory/File',
                      tooltip:
                        'Please provide the path of the Directory in the FTP server where the files are stored.',
                    },
                    {
                      label: 'File Name Starts With:',
                      type: 'input',
                      name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',
                      tooltip:
                        'Please provide the first few characters of the file name which the Connector should read.',
                    },
                    {
                      label: 'File Name Ends With:',
                      type: 'input',
                      name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',
                      tooltip:
                        'Please provide the last few characters of the file name which the Connector should read.',
                    },
                    {
                      label: 'Sample File:',
                      type: 'file',
                      name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                      value: '',
                      tooltip:
                        'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                    },
                    {
                      label: 'Leave File On Server',
                      type: 'checkbox',
                      name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                    },
                    {
                      label: 'Use Credit Memos',
                      type: 'checkbox',
                      name: 'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'Choose this setting if the Connector should sync credit memos.',
                    },
                    {
                      label: 'Ignore following Customers:',
                      type: 'textarea',
                      name: 'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                      value: '',
                      placeholder: 'eg. ACME Inc., S Industries',
                      tooltip:
                        'Please enter names of customers (separated by ",") for which payments should be ignored.',
                    },
                    {
                      label: 'NetSuite Invoice Prefix:',
                      type: 'textarea',
                      name:
                        'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                      value: '',
                      placeholder: 'eg. INV, IV',
                      tooltip:
                        'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                    },
                    {
                      label: 'NetSuite Invoice Identifier',
                      type: 'select',
                      name:
                        'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                      options: [['tranid_Invoice #', 'Invoice #']],
                      value: 'tranid_Invoice #',
                      supportsRefresh: true,
                      tooltip:
                        'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                    },
                    {
                      label: 'Column Delimiter:',
                      type: 'input',
                      name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                      placeholder: 'Optional',
                      tooltip: 'Please provide the column delimiter.',
                    },
                    {
                      label: 'Archive file',
                      type: 'checkbox',
                      name: 'archive_file_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              name:
                                'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                              hidden: true,
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              name:
                                'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                              hidden: false,
                              required: true,
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
                {
                  title: 'File Parsing',
                  fields: [
                    {
                      label: 'Batch Record',
                      title: 'Batch Record',
                      type: 'csvColumnMapper',
                      maxNumberOfColumns: 50,
                      name: '_batch_record_5d9f70b98a71fc911a4068bd',
                      value: [],
                      tooltip:
                        'Settings to change the column position of fields in csv file format.',
                    },
                    {
                      label: 'Transaction Record',
                      title: 'Transaction Record',
                      type: 'csvColumnMapper',
                      maxNumberOfColumns: 50,
                      name: '_transaction_record_5d9f70b98a71fc911a4068bd',
                      value: [
                        {
                          fieldName: 'Transaction Id',
                          column: '1',
                        },
                      ],
                      tooltip:
                        'Settings to change the column position of fields in csv file format.',
                    },
                    {
                      label: 'Invoice Record',
                      title: 'Invoice Record',
                      type: 'csvColumnMapper',
                      maxNumberOfColumns: 50,
                      name: '_invoice_record_5d9f70b98a71fc911a4068bd',
                      value: [
                        {
                          fieldName: 'Invoice number',
                          column: '19',
                        },
                        {
                          fieldName: 'Invoice Date',
                          column: '4',
                        },
                        {
                          fieldName: 'Invoice amount',
                          column: '8',
                        },
                      ],
                      tooltip:
                        'Settings to change the column position of fields in csv file format.',
                    },
                  ],
                },
                {
                  title: 'Advanced Settings',
                  fields: [
                    {
                      label: 'Transaction Filter: Choose an action',
                      type: 'radio',
                      name: 'transactionFilterOptions_5d9f70b98a71fc911a4068bd',
                      properties: {
                        sectionName: 'Filter Settings',
                      },
                      options: [
                        ['skip', 'Skip'],
                        ['allow', 'Allow'],
                        ['default', 'Default'],
                      ],
                      tooltip:
                        'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                    },
                    {
                      label: 'Enter Transaction Codes',
                      type: 'input',
                      name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                      placeholder: 'eg. 100,102,104,201-299,305',
                      tooltip:
                        "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
                      properties: {
                        sectionName: 'Filter Settings',
                      },
                    },
                    {
                      label: 'Default Currency',
                      type: 'select',
                      name: 'select_bank_currency_5d9f70b98a71fc911a4068bd',
                      options: [],
                      supportsRefresh: true,
                      tooltip:
                        'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: 'Customer Has Priority',
                      type: 'checkbox',
                      name:
                        'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',
                      tooltip:
                        'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      label: 'Identify invoice with Amount',
                      name:
                        'checkbox_match_invoice_with_amount_5d9f70b98a71fc911a4068bd',
                      type: 'checkbox',
                      value: false,
                      tooltip:
                        'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      label: 'Skip Zero Amount Transactions',
                      type: 'checkbox',
                      name:
                        'checkbox_skip_zero_amount_transactions_5d9f70b98a71fc911a4068bd',
                      value: true,
                      tooltip:
                        'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: "Don't create payment in locked posting period",
                      type: 'checkbox',
                      name:
                        'checkbox_validate_posting_period_5d9f70b98a71fc911a4068bd',
                      value: true,
                      tooltip:
                        'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
                      properties: {
                        sectionName: 'Payment Settings',
                      },
                    },
                    {
                      label: 'Advanced Search for Customers',
                      type: 'checkbox',
                      name:
                        'checkbox_use_fuzzy_search_5d9f70b98a71fc911a4068bd',
                      value: false,
                      tooltip:
                        'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
                      dependencies: {
                        disabled: {
                          fields: [
                            {
                              name:
                                'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                              hidden: true,
                              required: false,
                            },
                          ],
                        },
                        enabled: {
                          fields: [
                            {
                              name:
                                'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                              hidden: false,
                              required: true,
                            },
                          ],
                        },
                      },
                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      label: 'Threshold',
                      type: 'input',
                      name:
                        'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                      value: '0.1',
                      tooltip:
                        'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                      properties: {
                        sectionName: 'Matching Settings',
                      },
                    },
                    {
                      type: 'subsidiaryMapWidget',
                      name: 'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',
                      tooltip:
                        'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
                      title: 'Multi-subsidiary Settings',
                      optionsMap: [
                        {
                          id: 'subsidiary',
                          name: 'Subsidiary',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'paymentAccount',
                          name: 'Payment Account',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'debitAccount',
                          name: 'Write off Account',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'depositAccount',
                          name: 'Customer Deposit Account',
                          type: 'select',
                          options: [],
                        },
                        {
                          id: 'dummyCustomer',
                          name: 'Dummy Customer',
                          type: 'input',
                        },
                      ],
                      value: [],
                    },
                  ],
                },
              ],
              showMapping: true,
              showSchedule: true,
            },
          ],
          iconURL: '/images/icons/settings/BAI2.png',
          title: 'CSV',
          titleId: 'CSV',
        },
      ]);
    });

    test('should return correct flow sections for single store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSections(state, 'integrationId2')
      ).toEqual([
        {
          columns: 1,
          description:
            'This section contains settings to sync NetSuite Customers and Zendesk Organizations between the two systems.',
          fields: [
            {
              label: 'Sync all Zendesk Organizations as NetSuite Customers',
              name: 'sync_zendesk_organizations_as_netsuite_customsers',
              tooltip:
                'If this setting is selected all Zendesk Organizations will be synced as NetSuite Customers.',
              type: 'checkbox',
              value: true,
            },
          ],
          flows: [
            {
              _id: '5d9b20328a71fc911a4018a4',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [
                    ['edit', 'Edit'],
                    ['create', 'Create'],
                    ['xedit', 'xEdit'],
                  ],
                  type: 'multiselect',
                  value: ['edit', 'create', 'xedit'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value:
                    '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",true]]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018ad',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [
                    ['edit', 'Edit'],
                    ['create', 'Create'],
                    ['xedit', 'xEdit'],
                  ],
                  type: 'multiselect',
                  value: ['edit', 'create', 'xedit'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value:
                    '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",false]]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018a7',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018ac',
              showMapping: true,
              showSchedule: true,
            },
          ],
          title: 'Organization Sync',
          titleId: 'OrganizationSync',
        },
        {
          columns: 1,
          description:
            'This section contains settings to sync NetSuite Cases and Zendesk Tickets between the two systems.',
          editions: ['premium'],
          fields: [
            {
              label:
                'Create Zendesk Organization and User (if non-existent) while syncing NetSuite Support Case',
              name: 'create_users_and_organizations_in_zendesk',
              tooltip:
                'The Connector will first create the Zendesk Organization and User and then sync the NetSuite Support Case as Zendesk Ticket under the Zendesk User.',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Create NetSuite Customer and Contact (if non-existent) while syncing Zendesk Ticket',
              name: 'create_contacts_and_customers_in_netsuite',
              tooltip:
                'The Connector will first create the NetSuite Customer and Contact and then sync the Zendesk Ticket as NetSuite Support Case NetSuite Customer.',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Sync Zendesk Ticket Public Replies to NetSuite Case as Message',
              name: 'sync_ticket_comments_to_netsuite',
              tooltip:
                'Zendesk Ticket Public replies will be synced as Public Case Messages in NetSuite.',
              type: 'checkbox',
              value: false,
            },
            {
              label:
                'Sync attachments in NetSuite Support Cases to Zendesk Tickets',
              name: 'sync_attachments_from_netsuite_to_zendesk',
              tooltip:
                'If this setting is selected, NetSuite Case Attachments will be synced to Zendesk.',
              type: 'checkbox',
              value: false,
            },
          ],
          flows: [
            {
              _id: '5d9b20328a71fc911a4018a9',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [['edit', 'Edit'], ['create', 'Create']],
                  type: 'multiselect',
                  value: ['edit', 'create'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value: '["custevent_celigo_znc_zendesk_id","empty",true]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018a8',
              settings: [
                {
                  label: 'Execution Context',
                  name: 'executionContext',
                  options: [
                    ['userevent', 'User Event'],
                    ['webservices', 'Web Services'],
                    ['csvimport', 'CSV Import'],
                    ['scheduled', 'Scheduled'],
                    ['workflow', 'Work Flow'],
                    ['userinterface', 'User Interface'],
                  ],
                  type: 'multiselect',
                  value: [
                    'userevent',
                    'webservices',
                    'csvimport',
                    'userinterface',
                  ],
                },
                {
                  label: 'Execution Type',
                  name: 'executionType',
                  options: [['edit', 'Edit'], ['xedit', 'xEdit']],
                  type: 'multiselect',
                  value: ['edit', 'xedit'],
                },
                {
                  expressionType: 'export',
                  label: 'Qualifier',
                  name: 'qualifier',
                  type: 'expression',
                  value: '["custevent_celigo_znc_zendesk_id","empty",false]',
                },
              ],
              showMapping: true,
              showSchedule: false,
            },
            {
              _id: '5d9b20328a71fc911a4018b2',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018b3',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018b0',
              showMapping: true,
              showSchedule: true,
            },
            {
              _id: '5d9b20328a71fc911a4018ba',
              showMapping: true,
              showSchedule: true,
            },
          ],
          title: 'Tickets Sync',
          titleId: 'TicketsSync',
        },
      ]);
    });
  });

  describe('integrationAppGeneralSettings reducer', () => {
    test('should not throw error for bad params', () => {
      expect(selectors.integrationAppGeneralSettings({}, undefined)).toEqual({
        fields: undefined,
        sections: undefined,
      });
      expect(selectors.integrationAppGeneralSettings()).toEqual({});
      expect(
        selectors.integrationAppGeneralSettings(
          undefined,
          'integrationId',
          'fb5fb65e'
        )
      ).toEqual({});
    });

    test('should return correct general section for multistore integrationApp', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppGeneralSettings(
          state,
          'integrationId',
          'fb5fb65e'
        )
      ).toEqual({
        fields: [
          {
            label: 'Enable Manual Upload Mode',
            name: 'enableManualUploadMode_fb5fb65e',
            tooltip: 'Select the checkbox for manual upload of file.',
            type: 'checkbox',
          },
        ],
        sections: undefined,
      });
    });

    test('should return correct flow sections for single store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppGeneralSettings(state, 'integrationId2')
      ).toEqual({
        fields: [
          {
            label: 'Enable Test Mode',
            name: 'enableTestMode',
            tooltip:
              'If you are setting up the Connector and only want few test records to sync, enable this setting. Only records which have a field pre-fixed with the Test Mode Text will be selected for syncing.',
            type: 'checkbox',
            value: false,
          },
          {
            label: 'Test Mode Text',
            name: 'testModeText',
            tooltip:
              'This text should be at least 5 characters long. Records with a field prefixed with this text will be selected for syncing.',
            value: '',
          },
        ],
        sections: undefined,
      });
    });
  });

  describe('integrationAppFlowSettings reducer', () => {
    test('should not throw error for bad params', () => {
      expect(selectors.integrationAppFlowSettings()).toEqual({});
      expect(selectors.integrationAppFlowSettings({})).toEqual({
        fields: undefined,
        flowSettings: undefined,
        flows: [],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: false,
        showMatchRuleEngine: undefined,
      });
    });

    test('should return correct section information for multistore connector', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSettings(
          state,
          'integrationId',
          'CSV',
          'fb5fb65e'
        )
      ).toEqual({
        fields: undefined,
        flowSettings: [
          {
            _id: '5d9f70b98a71fc911a4068bd',
            matchingRules: {
              applyValues: [],
              creditMemoStatusValues: [],
              expressionSearchFilters: [],
              expressionSearchOperators: [],
              expressionSearchValues: [],
              transactionStatusValues: [],
              value: [],
            },
            sections: [
              {
                title: 'File Import',
                fields: [
                  {
                    label: 'Directory Path:',
                    type: 'input',
                    name: 'directoryPath_5d9f70b98a71fc911a4068bd',
                    required: true,
                    placeholder:
                      'Enter FTP folder path, such as Directory/File',
                    tooltip:
                      'Please provide the path of the Directory in the FTP server where the files are stored.',
                  },
                  {
                    label: 'File Name Starts With:',
                    type: 'input',
                    name: 'fileNameStartsWith_5d9f70b98a71fc911a4068bd',
                    placeholder: 'Optional',
                    tooltip:
                      'Please provide the first few characters of the file name which the Connector should read.',
                  },
                  {
                    label: 'File Name Ends With:',
                    type: 'input',
                    name: 'fileNameEndsWith_5d9f70b98a71fc911a4068bd',
                    placeholder: 'Optional',
                    tooltip:
                      'Please provide the last few characters of the file name which the Connector should read.',
                  },
                  {
                    label: 'Sample File:',
                    type: 'file',
                    name: 'ftp_sample_file_5d9f70b98a71fc911a4068bd',
                    value: '',
                    tooltip:
                      'Please upload a sample csv file containing records to help us build the mapping definition of the csv file.',
                  },
                  {
                    label: 'Leave File On Server',
                    type: 'checkbox',
                    name: 'skipDelete_5d9f70b98a71fc911a4068bd',
                    value: false,
                    tooltip:
                      'Choose this setting if the Connector should leave the files on the FTP server after reading. Else the file will be deleted from the FTP server after reading.',
                  },
                  {
                    label: 'Use Credit Memos',
                    type: 'checkbox',
                    name: 'checkbox_credit_memo_5d9f70b98a71fc911a4068bd',
                    value: false,
                    tooltip:
                      'Choose this setting if the Connector should sync credit memos.',
                  },
                  {
                    label: 'Ignore following Customers:',
                    type: 'textarea',
                    name: 'textarea_customer_filter_5d9f70b98a71fc911a4068bd',
                    value: '',
                    placeholder: 'eg. ACME Inc., S Industries',
                    tooltip:
                      'Please enter names of customers (separated by ",") for which payments should be ignored.',
                  },
                  {
                    label: 'NetSuite Invoice Prefix:',
                    type: 'textarea',
                    name: 'textarea_ns_invoice_prefix_5d9f70b98a71fc911a4068bd',
                    value: '',
                    placeholder: 'eg. INV, IV',
                    tooltip:
                      'Please enter list of prefixes (separated by ",") in order of priority used in NetSuite Account.',
                  },
                  {
                    label: 'NetSuite Invoice Identifier',
                    type: 'select',
                    name:
                      'select_ns_invoice_identifier_5d9f70b98a71fc911a4068bd',
                    options: [['tranid_Invoice #', 'Invoice #']],
                    value: 'tranid_Invoice #',
                    supportsRefresh: true,
                    tooltip:
                      'Please select the field from the list for which the connector should look for the Invoice number to match the Invoice Id from bank file.',
                  },
                  {
                    label: 'Column Delimiter:',
                    type: 'input',
                    name: 'columnDelimiter_5d9f70b98a71fc911a4068bd',
                    placeholder: 'Optional',
                    tooltip: 'Please provide the column delimiter.',
                  },
                  {
                    label: 'Archive file',
                    type: 'checkbox',
                    name: 'archive_file_5d9f70b98a71fc911a4068bd',
                    value: false,
                    tooltip:
                      'Choose this setting if the Connector should archive the files in NetSuite file cabinet.',
                    dependencies: {
                      disabled: {
                        fields: [
                          {
                            name:
                              'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                            hidden: true,
                            required: false,
                          },
                        ],
                      },
                      enabled: {
                        fields: [
                          {
                            name:
                              'netsuite_archive_dir_5d9f70b98a71fc911a4068bd',
                            hidden: false,
                            required: true,
                          },
                        ],
                      },
                    },
                  },
                ],
              },
              {
                title: 'File Parsing',
                fields: [
                  {
                    label: 'Batch Record',
                    title: 'Batch Record',
                    type: 'csvColumnMapper',
                    maxNumberOfColumns: 50,
                    name: '_batch_record_5d9f70b98a71fc911a4068bd',
                    value: [],
                    tooltip:
                      'Settings to change the column position of fields in csv file format.',
                  },
                  {
                    label: 'Transaction Record',
                    title: 'Transaction Record',
                    type: 'csvColumnMapper',
                    maxNumberOfColumns: 50,
                    name: '_transaction_record_5d9f70b98a71fc911a4068bd',
                    value: [
                      {
                        fieldName: 'Transaction Id',
                        column: '1',
                      },
                    ],
                    tooltip:
                      'Settings to change the column position of fields in csv file format.',
                  },
                  {
                    label: 'Invoice Record',
                    title: 'Invoice Record',
                    type: 'csvColumnMapper',
                    maxNumberOfColumns: 50,
                    name: '_invoice_record_5d9f70b98a71fc911a4068bd',
                    value: [
                      {
                        fieldName: 'Invoice number',
                        column: '19',
                      },
                      {
                        fieldName: 'Invoice Date',
                        column: '4',
                      },
                      {
                        fieldName: 'Invoice amount',
                        column: '8',
                      },
                    ],
                    tooltip:
                      'Settings to change the column position of fields in csv file format.',
                  },
                ],
              },
              {
                title: 'Advanced Settings',
                fields: [
                  {
                    label: 'Transaction Filter: Choose an action',
                    type: 'radio',
                    name: 'transactionFilterOptions_5d9f70b98a71fc911a4068bd',
                    properties: {
                      sectionName: 'Filter Settings',
                    },
                    options: [
                      ['skip', 'Skip'],
                      ['allow', 'Allow'],
                      ['default', 'Default'],
                    ],
                    tooltip:
                      'This setting allows you to specify how certain transaction codes will be processed by the connector. A transaction code could be sent by the bank in the remittance file indicating the type of transaction for eg: Debit or Credit. Based on your needs you can choose to skip or process only those transaction codes. You can only choose one action for the transaction codes as described below.\n\nSkip: Choose this option to skip the transaction codes which have been specified in the text box.\n\nAllow: Choose this to only allow the processing of transaction codes specified in the text box. All other incoming transaction codes will be ignored.\n\nDefault: Choose this to process all the incoming transaction codes. This is the default selection.',
                  },
                  {
                    label: 'Enter Transaction Codes',
                    type: 'input',
                    name: 'transactionCodes_5d9f70b98a71fc911a4068bd',
                    placeholder: 'eg. 100,102,104,201-299,305',
                    tooltip:
                      "Enter individual transaction code(s) or range(s) separated by a comma. Based on your choice, corresponding transactions will either be skipped or included for processing from the bank file. Use '-' to indicate a code range. For example: 100,102,104,201-299,305",
                    properties: {
                      sectionName: 'Filter Settings',
                    },
                  },
                  {
                    label: 'Default Currency',
                    type: 'select',
                    name: 'select_bank_currency_5d9f70b98a71fc911a4068bd',
                    options: [],
                    supportsRefresh: true,
                    tooltip:
                      'Please enter the currency that should be used for the creation of payment. This is an optional field and should only be specified when the bank will send all the transactions in a pre-defined currency. In the case when the transactions in the bank file will carry currency details, this field need not be populated and the transaction currency from the bank file will be used to create payments. In case the currency is not specified and the bank file doesn’t contain currency details for the transactions, then the payment will be created for the customer’s primary currency.',
                    properties: {
                      sectionName: 'Payment Settings',
                    },
                  },
                  {
                    label: 'Customer Has Priority',
                    type: 'checkbox',
                    name: 'checkbox_customer_priority_5d9f70b98a71fc911a4068bd',
                    tooltip:
                      'This setting will assume transaction customer to be of higher priority and if the transaction customer is found and ascertained, the invoices will be searched for this customer as we now know the correct customer before the invoice search happens.',
                    properties: {
                      sectionName: 'Matching Settings',
                    },
                  },
                  {
                    label: 'Identify invoice with Amount',
                    name:
                      'checkbox_match_invoice_with_amount_5d9f70b98a71fc911a4068bd',
                    type: 'checkbox',
                    value: false,
                    tooltip:
                      'If there is no match using invoice number, then this enables to find the match using invoice/transaction amount for that customer.',
                    properties: {
                      sectionName: 'Matching Settings',
                    },
                  },
                  {
                    label: 'Skip Zero Amount Transactions',
                    type: 'checkbox',
                    name:
                      'checkbox_skip_zero_amount_transactions_5d9f70b98a71fc911a4068bd',
                    value: true,
                    tooltip:
                      'This setting if checked will filter out any zero amount transactions.\nUnselect this checkbox to create zero amount transactions.',
                    properties: {
                      sectionName: 'Payment Settings',
                    },
                  },
                  {
                    label: "Don't create payment in locked posting period",
                    type: 'checkbox',
                    name:
                      'checkbox_validate_posting_period_5d9f70b98a71fc911a4068bd',
                    value: true,
                    tooltip:
                      'Unselect this check box to create customer payment for Administrator role when posting period is locked.',
                    properties: {
                      sectionName: 'Payment Settings',
                    },
                  },
                  {
                    label: 'Advanced Search for Customers',
                    type: 'checkbox',
                    name: 'checkbox_use_fuzzy_search_5d9f70b98a71fc911a4068bd',
                    value: false,
                    tooltip:
                      'CAM employs an optional advanced search algorithm which can improve the match rate by employing fuzzy search on the the file record with the records in NetSuite in case the exact matches are not found. The results returned are approximate matches and certain users may prefer to review the matches thus found.',
                    dependencies: {
                      disabled: {
                        fields: [
                          {
                            name:
                              'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                            hidden: true,
                            required: false,
                          },
                        ],
                      },
                      enabled: {
                        fields: [
                          {
                            name:
                              'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                            hidden: false,
                            required: true,
                          },
                        ],
                      },
                    },
                    properties: {
                      sectionName: 'Matching Settings',
                    },
                  },
                  {
                    label: 'Threshold',
                    type: 'input',
                    name:
                      'fuzzy_config_threshold_value_5d9f70b98a71fc911a4068bd',
                    value: '0.1',
                    tooltip:
                      'This value determines the degree of search results. With 0.1 being highest and 1 being lowest',
                    properties: {
                      sectionName: 'Matching Settings',
                    },
                  },
                  {
                    type: 'subsidiaryMapWidget',
                    name: 'multisubsidiary_settings_5d9f70b98a71fc911a4068bd',
                    tooltip:
                      'Please specify the GL accounts for each of your subsidiaries here. This mapping allows the product to identify the GL account that will be used for a particular subsidiary to create payments, write-offs or customer deposits. The Subsidiary name and Payment account are mandatory fields and must be supplied. You can choose to provide a dummy customer in the corresponding subsidiary to allow the creation of incoming payment in case the customer is not identified during processing, and later once you have identified the customer you can change the value to the correct customer. Please make sure that all your subsidiaries have an entry in this section.',
                    title: 'Multi-subsidiary Settings',
                    optionsMap: [
                      {
                        id: 'subsidiary',
                        name: 'Subsidiary',
                        type: 'select',
                        options: [],
                      },
                      {
                        id: 'paymentAccount',
                        name: 'Payment Account',
                        type: 'select',
                        options: [],
                      },
                      {
                        id: 'debitAccount',
                        name: 'Write off Account',
                        type: 'select',
                        options: [],
                      },
                      {
                        id: 'depositAccount',
                        name: 'Customer Deposit Account',
                        type: 'select',
                        options: [],
                      },
                      {
                        id: 'dummyCustomer',
                        name: 'Dummy Customer',
                        type: 'input',
                      },
                    ],
                    value: [],
                  },
                ],
              },
            ],
            showMapping: true,
            showSchedule: true,
          },
        ],
        flows: [],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: true,
        showMatchRuleEngine: undefined,
      });
    });

    test('should return correct section information for single store integrationApp', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSettings(state, 'integrationId2', 'CSV')
      ).toEqual({
        fields: undefined,
        flowSettings: undefined,
        flows: [],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: false,
        showMatchRuleEngine: undefined,
      });
      expect(
        selectors.integrationAppFlowSettings(
          state,
          'integrationId2',
          'OrganizationSync'
        )
      ).toEqual({
        fields: [
          {
            label: 'Sync all Zendesk Organizations as NetSuite Customers',
            name: 'sync_zendesk_organizations_as_netsuite_customsers',
            tooltip:
              'If this setting is selected all Zendesk Organizations will be synced as NetSuite Customers.',
            type: 'checkbox',
            value: true,
          },
        ],
        flowSettings: [
          {
            _id: '5d9b20328a71fc911a4018a4',
            settings: [
              {
                label: 'Execution Context',
                name: 'executionContext',
                options: [
                  ['userevent', 'User Event'],
                  ['webservices', 'Web Services'],
                  ['csvimport', 'CSV Import'],
                  ['scheduled', 'Scheduled'],
                  ['workflow', 'Work Flow'],
                  ['userinterface', 'User Interface'],
                ],
                type: 'multiselect',
                value: [
                  'userevent',
                  'webservices',
                  'csvimport',
                  'userinterface',
                ],
              },
              {
                label: 'Execution Type',
                name: 'executionType',
                options: [
                  ['edit', 'Edit'],
                  ['create', 'Create'],
                  ['xedit', 'xEdit'],
                ],
                type: 'multiselect',
                value: ['edit', 'create', 'xedit'],
              },
              {
                expressionType: 'export',
                label: 'Qualifier',
                name: 'qualifier',
                type: 'expression',
                value:
                  '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",true]]',
              },
            ],
            showMapping: true,
            showSchedule: false,
          },
          {
            _id: '5d9b20328a71fc911a4018ad',
            settings: [
              {
                label: 'Execution Context',
                name: 'executionContext',
                options: [
                  ['userevent', 'User Event'],
                  ['webservices', 'Web Services'],
                  ['csvimport', 'CSV Import'],
                  ['scheduled', 'Scheduled'],
                  ['workflow', 'Work Flow'],
                  ['userinterface', 'User Interface'],
                ],
                type: 'multiselect',
                value: [
                  'userevent',
                  'webservices',
                  'csvimport',
                  'userinterface',
                ],
              },
              {
                label: 'Execution Type',
                name: 'executionType',
                options: [
                  ['edit', 'Edit'],
                  ['create', 'Create'],
                  ['xedit', 'xEdit'],
                ],
                type: 'multiselect',
                value: ['edit', 'create', 'xedit'],
              },
              {
                expressionType: 'export',
                label: 'Qualifier',
                name: 'qualifier',
                type: 'expression',
                value:
                  '[["isperson","=","F"],"and",["custentity_celigo_znc_zendesk_id","empty",false]]',
              },
            ],
            showMapping: true,
            showSchedule: false,
          },
          {
            _id: '5d9b20328a71fc911a4018a7',
            showMapping: true,
            showSchedule: true,
          },
          {
            _id: '5d9b20328a71fc911a4018ac',
            showMapping: true,
            showSchedule: true,
          },
        ],
        flows: [],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: true,
        showMatchRuleEngine: undefined,
      });
    });

    test('should return all flows when section is not passed to a single store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              flows,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSettings(state, 'integrationId2')
      ).toEqual({
        fields: undefined,
        flowSettings: undefined,
        flows: [
          {
            _id: '5d9b20328a71fc911a4018a4',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018a4',
          },
          {
            _id: '5d9b20328a71fc911a4018ad',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018ad',
          },
          {
            _id: '5d9b20328a71fc911a4018a7',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018a7',
          },
          {
            _id: '5d9b20328a71fc911a4018ac',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018ac',
          },
          {
            _id: '5d9b20328a71fc911a4018a9',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018a9',
          },
          {
            _id: '5d9b20328a71fc911a4018a8',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018a8',
          },
          {
            _id: '5d9b20328a71fc911a4018b2',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018b2',
          },
          {
            _id: '5d9b20328a71fc911a4018b3',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018b3',
          },
          {
            _id: '5d9b20328a71fc911a4018b0',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018b0',
          },
          {
            _id: '5d9b20328a71fc911a4018ba',
            _integrationId: 'integrationId2',
            name: '5d9b20328a71fc911a4018ba',
          },
        ],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: false,
        showMatchRuleEngine: undefined,
      });
    });

    test('should return all flows when section and storeId is not passed to a multi store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              flows,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSettings(state, 'integrationId')
      ).toEqual({
        fields: undefined,
        flowSettings: undefined,
        flows: [
          {
            _id: '5d9f70b98a71fc911a4068bd',
            _integrationId: 'integrationId',
            name: '5d9f70b98a71fc911a4068bd',
          },
          {
            _id: '5d9f71628a71fc911a4068d9',
            _integrationId: 'integrationId',
            name: '5d9f71628a71fc911a4068d9',
          },
        ],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: false,
        showMatchRuleEngine: undefined,
      });
    });

    test('should return all flows of the store when storeId is passed to a multi store integration App', () => {
      const state = reducer(
        {
          data: {
            resources: {
              integrations,
              flows,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.integrationAppFlowSettings(
          state,
          'integrationId',
          null,
          'fb5fb65e'
        )
      ).toEqual({
        fields: undefined,
        flowSettings: undefined,
        flows: [
          {
            _id: '5d9f70b98a71fc911a4068bd',
            _integrationId: 'integrationId',
            name: '5d9f70b98a71fc911a4068bd',
          },
        ],
        hasDescription: false,
        hasNSInternalIdLookup: false,
        sections: undefined,
        showFlowSettings: false,
        showMatchRuleEngine: undefined,
      });
    });
  });
});

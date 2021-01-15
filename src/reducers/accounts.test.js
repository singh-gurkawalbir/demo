/* global describe, expect, test */
import each from 'jest-each';
import { deepClone } from 'fast-json-patch';
import reducer, { selectors } from '.';
import actions from '../actions';
import { ACCOUNT_IDS, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../utils/constants';
import { stringCompare } from '../utils/sort';

describe('Accounts region selector testcases', () => {
  describe('isAccountOwnerOrAdmin selector', () => {
    test('should return true for account owner', () => {
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

      expect(selectors.isAccountOwnerOrAdmin(state)).toEqual(true);
    });
    test('should return true for account administrator', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: '123' },
            org: {
              accounts: [
                {
                  _id: '123',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
                },
              ],
              users: [],
            },
          },
        },
        'some action'
      );

      expect(selectors.isAccountOwnerOrAdmin(state)).toEqual(true);
    });
    describe('should return correct flag for org users', () => {
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
        {
          _id: 'aShare4',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
        },
      ];
      const testCases = [];

      testCases.push(
        [
          false,
          'aShare1',
        ],
        [
          true,
          'aShare4',
        ],
        [
          false,
          'aShare2',
        ],
        [
          false,
          'aShare3',
        ]
      );
      each(testCases).test(
        'should return %s for %s',
        (expected, defaultAShareId) => {
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
            selectors.isAccountOwnerOrAdmin(state)
          ).toEqual(expected);
        }
      );
    });
  });

  describe('selectors.allRegisteredConnectionIdsFromManagedIntegrations test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations()).toEqual([]);
      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations({})).toEqual([]);
      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(null)).toEqual([]);
      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(123)).toEqual([]);
      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(new Date())).toEqual([]);
      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations('string')).toEqual([]);
    });

    test('should return correct data for account owner', () => {
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
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(state)).toEqual(['connection1', 'connection2']);
    });

    test('should return correct data for account admin', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: 'ashare1' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
                },
                {
                  _id: 'ashare2',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(state)).toEqual(['connection1', 'connection2']);
    });

    test('should return correct data for account manage user', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: 'ashare2' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
                },
                {
                  _id: 'ashare2',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(state)).toEqual(['connection1', 'connection2']);
    });

    test('should return correct data for account monitor user', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: 'ashare2' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                },
                {
                  _id: 'ashare2',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(state)).toEqual([]);
    });

    test('should return correct data for tile level manage user', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: 'ashare2' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                },
                {
                  _id: 'ashare2',
                  integrationAccessLevel: [{
                    _integrationId: 'integrationId1',
                    accessLevel: 'manage',
                  }, {
                    _integrationId: 'integrationId2',
                    accessLevel: 'monitor',
                  }],
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              integrations: [{
                _id: 'integrationId1',
                _registeredConnectionIds: ['connection1'],
              }, {
                _id: 'integrationId2',
                _registeredConnectionIds: ['connection2'],
              }],
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(state)).toEqual(['connection1']);
    });

    test('should return correct data for account monitor user with tile level manage access', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: 'ashare2' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                },
                {
                  _id: 'ashare2',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                  accepted: true,
                  integrationAccessLevel: [{
                    _integrationId: 'integrationId1',
                    accessLevel: 'manage',
                  }],
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              integrations: [{
                _id: 'integrationId1',
                _registeredConnectionIds: ['connection1'],
              }, {
                _id: 'integrationId2',
                _registeredConnectionIds: ['connection2'],
              }],
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.allRegisteredConnectionIdsFromManagedIntegrations(state)).toEqual(['connection1']);
    });
  });

  describe('isProfileDataReady', () => {
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

  describe('selectors.availableUsersList test cases', () => {
    const orgOwnerState = {
      user: {
        preferences: {
          defaultAShareId: 'own',
        },
        profile: {
          _id: '5cadc8b42b10347a2708bf29',
          name: 'Raghuvamsi Owner',
          email: 'raghuvamsi.chandrabhatla@celigo.com',
        },
        org: {
          users: [
            {
              _id: '5f7011605b2e3244837309f9',
              accepted: true,
              accessLevel: 'manage',
              integrationAccessLevel: [
                {
                  _integrationId: '5e44efa28015c9464272256f',
                  accessLevel: 'manage',
                },
              ],
              sharedWithUser: {
                _id: '5f6882679daecd32740e2c38',
                email: 'raghuvamsi.chandrabhatla+3@celigo.com',
                name: 'Raghuvamsi4 Chandrabhatla',
              },
            },
          ],
          accounts: [
            {
              _id: 'own',
              accessLevel: 'owner',
            },
          ],
        },
        debug: false,
      },
    };

    const orgUserState = {
      user: {
        preferences: {
          defaultAShareId: '5f770d4b96ae3b4bf0fdd8f1',
        },
        profile: {
          _id: '5cadc8b42b10347a2708bf29',
          name: 'Raghuvamsi User',
          email: 'raghuvamsi.chandrabhatla@celigo.com',
        },
        org: {
          users: [
            {
              _id: '5f7011605b2e3244837309f9',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [
                {
                  _integrationId: '5e44efa28015c9464272256f',
                  accessLevel: 'monitor',
                },
              ],
              sharedWithUser: {
                _id: '5f6882679daecd32740e2c38',
                email: 'raghuvamsi.chandrabhatla+3@celigo.com',
                name: 'Raghuvamsi4 Chandrabhatla',
              },
            },
            {
              _id: '5f72fae75b2e32448373575e',
              accepted: true,
              integrationAccessLevel: [
                {
                  _integrationId: '5e44ee816fb284424f693b43',
                  accessLevel: 'monitor',
                },
              ],
              sharedWithUser: {
                _id: '5f686ef49daecd32740e2710',
                email: 'raghuvamsi.chandrabhatla+2@celigo.com',
                name: 'Raghuvamsi',
              },
            },
            {
              _id: '5f770d4b96ae3b4bf0fdd8f1',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [],
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ee',
                email: 'raghuvamsi.chandrabhatla+6@celigo.com',
                name: 'Raghuvamsi C',
              },
            },
          ],
          accounts: [
            {
              _id: '5f770d4b96ae3b4bf0fdd8f1',
              accessLevel: 'owner',
              ownerUser: {
                licenses: [],
              },
            },
            {
              _id: '5f7c190bfadf861c6f462786',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [],
              ownerUser: {
                _id: '57024f1a94187b597e4c3578',
                email: 'ht.installation.qa@celigo.com',
                name: 'Staging IO account',
                company: 'HightechQA- EM2.0',
                useErrMgtTwoDotZero: true,
              },
            },
          ],
        },
        debug: false,
      },
      data: {
        integrationAShares: {
          '5e44ee816fb284424f693b43': [
            {
              _id: '5f7011605b2e3244837309f9',
              accepted: true,
              accessLevel: 'monitor',
              sharedWithUser: {
                _id: '5f6882679daecd32740e2c38',
                email: 'raghuvamsi.chandrabhatla+3@celigo.com',
                name: 'Raghuvamsi4 Chandrabhatla',
              },
            },
            {
              _id: '5f72fae75b2e32448373575e',
              accepted: true,
              sharedWithUser: {
                _id: '5f686ef49daecd32740e2710',
                email: 'raghuvamsi.chandrabhatla+2@celigo.com',
                name: 'Raghuvamsi',
              },
              accessLevel: 'monitor',
            },
            {
              _id: '5f770d4b96ae3b4bf0fdd8f1',
              accepted: true,
              accessLevel: 'monitor',
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ee',
                email: 'raghuvamsi.chandrabhatla+6@celigo.com',
                name: 'Raghuvamsi C',
              },
            },
          ],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.availableUsersList()).toEqual([]);
    });
    test('should return empty list if the user is not admin/owner and no shared users list and no integration Id is passed to retrieve integration users', () => {
      const sampleState = deepClone(orgUserState);

      sampleState.user.org.users = [];
      expect(selectors.availableUsersList(sampleState)).toEqual([]);
    });
    test('should return integrationUsers list if exist for orgUser when integrationId is passed ', () => {
      const integrationId = '5e44ee816fb284424f693b43';
      const integrationUserList = orgUserState.data.integrationAShares[integrationId];
      const userList = [
        {
          _id: 'own',
          accepted: true,
          accessLevel: 'owner',
          sharedWithUser: {
            email: 'raghuvamsi.chandrabhatla@celigo.com',
            name: 'Raghuvamsi User',
          },
        },
        ...integrationUserList,
      ];

      expect(selectors.availableUsersList(orgUserState, integrationId)).toEqual(userList.sort(stringCompare('sharedWithUser.name')));
    });
    test('should return integrationUsers list for orgOwner when integrationId is passed', () => {
      const integrationId = '5e44ee816fb284424f693b43';
      const userList = [
        {
          _id: 'own',
          accepted: true,
          accessLevel: 'owner',
          sharedWithUser: {name: 'Raghuvamsi Owner', email: 'raghuvamsi.chandrabhatla@celigo.com'},
        },
        {
          _id: '5f7011605b2e3244837309f9',
          accepted: true,
          accessLevel: 'manage',
          sharedWithUser: {_id: '5f6882679daecd32740e2c38', email: 'raghuvamsi.chandrabhatla+3@celigo.com', name: 'Raghuvamsi4 Chandrabhatla'},
        },
      ];

      expect(selectors.availableUsersList(orgOwnerState, integrationId)).toEqual(userList.sort(stringCompare('sharedWithUser.name')));
    });
    test('should return all the users list for the account incase of logged in user is orgOwner and no integrationId is passed', () => {
      const userList = [
        {
          _id: 'own',
          accepted: true,
          accessLevel: 'owner',
          sharedWithUser: {name: 'Raghuvamsi Owner', email: 'raghuvamsi.chandrabhatla@celigo.com'},
        },
        ...orgOwnerState.user.org.users,
      ];

      expect(selectors.availableUsersList(orgOwnerState)).toEqual(userList.sort(stringCompare('sharedWithUser.name')));
    });
  });

  describe('selectors.platformLicense test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.platformLicense(undefined, {})).toEqual(null);
    });
  });

  describe('selectors.platformLicenseWithMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.platformLicenseWithMetadata(undefined, {})).toEqual({
        expirationDate: undefined,
        hasExpired: false,
        hasSubscription: true,
        inTrial: false,
        isExpiringSoon: false,
        isFreemium: false,
        isNone: false,
        status: 'active',
        subscriptionActions: {
          __trialExtensionRequested: undefined,
          actions: [
            'request-upgrade',
          ],
        },
        subscriptionName: undefined,
        supportTier: '',
        tierName: undefined,
        totalFlowsAvailable: 0,
        totalSandboxFlowsAvailable: 0,
        usageTierHours: 1,
        usageTierName: 'Free',
      });
    });
  });

  describe('selectors.isLicenseValidToEnableFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isLicenseValidToEnableFlow(undefined, {})).toEqual({enable: true});
    });
  });

  describe('selectors.hasAccounts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasAccounts(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.hasAcceptedUsers test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasAcceptedUsers()).toEqual(false);
    });
  });

  describe('selectors.hasAcceptedAccounts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasAcceptedAccounts()).toEqual(false);
    });
  });

  describe('selectors.isValidSharedAccountId test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isValidSharedAccountId()).toEqual(false);
    });
  });

  describe('selectors.getOneValidSharedAccountId test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getOneValidSharedAccountId()).toEqual();
    });
  });

  describe('selectors.userPermissionsOnConnection test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userPermissionsOnConnection()).toEqual({});
    });
  });
  describe('selectors.resourcePermissions test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourcePermissions()).toEqual({
        accesstokens: {

        },
        agents: {

        },
        apis: {

        },
        audits: {

        },
        connections: {

        },
        connectors: {

        },
        exports: {

        },
        imports: {

        },
        integrations: {

        },
        recyclebin: {

        },
        scripts: {

        },
        stacks: {

        },
        subscriptions: {

        },
        templates: {

        },
        transfers: {

        },
        users: {

        },

      });
    });
  });

  describe('selectors.isFormAMonitorLevelAccess test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFormAMonitorLevelAccess()).toEqual(false);
    });
  });

  describe('selectors.formAccessLevel test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.formAccessLevel()).toEqual({disableAllFields: false});
    });
  });

  describe('selectors.canEditSettingsForm test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.canEditSettingsForm()).toEqual();
    });
  });

  describe('selectors.availableConnectionsToRegister test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.availableConnectionsToRegister()).toEqual([]);
    });
  });
});


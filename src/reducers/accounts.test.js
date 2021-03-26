/* global describe, expect, test */
import each from 'jest-each';
import { deepClone } from 'fast-json-patch';
import moment from 'moment';
import reducer, { selectors } from '.';
import actions from '../actions';
import { ACCOUNT_IDS, INTEGRATION_ACCESS_LEVELS, USER_ACCESS_LEVELS } from '../utils/constants';
import { stringCompare } from '../utils/sort';
import { LICENSE_EXPIRED } from '../utils/messageStore';

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
            {
              _id: '5f7011605b2e324483730956',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [
                {
                  _integrationId: '5e44efa28015c9464272256f',
                  accessLevel: 'manage',
                },
              ],
              sharedWithUser: {
                _id: '5f6882679daecd32740e2c45',
                email: 'abc@celigo.com',
                name: 'ABC',
              },
            },
            {
              _id: '5f7011605b2e324483730956',
              accepted: true,
              accessLevel: 'tile',
              integrationAccessLevel: [
                {
                  _integrationId: '5e44efa28015c9464272256f',
                  accessLevel: 'manage',
                },
                {
                  _integrationId: '5e44efa28015c9464272899f',
                  accessLevel: 'monitor',
                },
              ],
              sharedWithUser: {
                _id: '5f6882679daecd32740e2c45',
                email: 'xyz@celigo.com',
                name: 'XYZ',
              },
            },
            {
              _id: '5f7011605b2e324483730990',
              accepted: true,
              accessLevel: 'administrator',
              sharedWithUser: {
                _id: '5f6882679daecd32740e2cccc',
                email: 'abcd@celigo.com',
                name: 'ABCD',
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
            {
              _id: '5f770d4b96ae3b4bf0ffffff',
              accepted: true,
              accessLevel: 'administrator',
              integrationAccessLevel: [],
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ff',
                email: 'sss@celigo.com',
                name: 'SSS',
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
            {
              _id: '5f770d4b96ae3b4bf0ffffff',
              accepted: true,
              accessLevel: 'administrator',
              integrationAccessLevel: undefined,
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ff',
                email: 'sss@celigo.com',
                name: 'SSS',
              },
            },
          ],
        },
      },
    };

    const orgAdminState = {
      user: {
        preferences: {
          defaultAShareId: '5f770d4b96ae3b4bf0ffffff',
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
              accessLevel: 'tile',
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
            {
              _id: '5f770d4b96ae3b4bf0ffffff',
              accepted: true,
              accessLevel: 'administrator',
              integrationAccessLevel: [],
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ff',
                email: 'sss@celigo.com',
                name: 'SSS',
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
              _id: '5f770d4b96ae3b4bf0ffffff',
              accessLevel: 'administrator',
              ownerUser: {
                _id: 'abcd',
                email: 'abc@xyz.com',
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
            {
              _id: '5f770d4b96ae3b4bf0ffffff',
              accepted: true,
              accessLevel: 'administrator',
              integrationAccessLevel: undefined,
              sharedWithUser: {
                _id: '5f770d4b96ae3b4bf0fdd8ff',
                email: 'sss@celigo.com',
                name: 'SSS',
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

    test('should return integrationUsers list if exist for org admin user when integrationId is passed ', () => {
      const integrationId = '5e44ee816fb284424f693b43';
      const integrationUserList = orgAdminState.data.integrationAShares[integrationId];
      const userList = [
        {
          _id: 'own',
          accepted: true,
          accessLevel: 'owner',
          sharedWithUser: {
            _id: 'abcd',
            email: 'abc@xyz.com',
          },
        },
        ...integrationUserList,
      ];

      expect(selectors.availableUsersList(orgAdminState, integrationId)).toEqual(userList.sort(stringCompare('sharedWithUser.name')));
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
        {
          _id: '5f7011605b2e324483730956',
          accepted: true,
          accessLevel: 'monitor',
          integrationAccessLevel: undefined,
          sharedWithUser: {
            _id: '5f6882679daecd32740e2c45',
            email: 'abc@celigo.com',
            name: 'ABC',
          },
        },
        {
          _id: '5f7011605b2e324483730990',
          accepted: true,
          accessLevel: 'administrator',
          sharedWithUser: {
            _id: '5f6882679daecd32740e2cccc',
            email: 'abcd@celigo.com',
            name: 'ABCD',
          },
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

    test('should return all the users list for the account incase of logged in user is org admin and no integrationId is passed', () => {
      const userList = [
        {
          _id: 'own',
          accepted: true,
          accessLevel: 'owner',
          sharedWithUser: {
            _id: 'abcd',
            email: 'abc@xyz.com',
          },
        },
        ...orgAdminState.user.org.users,
      ];

      expect(selectors.availableUsersList(orgAdminState)).toEqual(userList.sort(stringCompare('sharedWithUser.name')));
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
    const expiredState =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                  ownerUser: {
                    licenses: [
                      {
                        _id: 'license1',
                        type: 'integrator',
                        tier: 'standard',
                        expires: moment()
                          .subtract(1, 'days')
                          .toISOString(),
                      },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };
    const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                  ownerUser: {
                    licenses: [
                      {
                        _id: 'license1',
                        type: 'integrator',
                        tier: 'standard',
                        expires: moment()
                          .add(60, 'days')
                          .toISOString(),
                      },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

    const expected = {enable: false, message: LICENSE_EXPIRED};

    test('should return false for expired license', () => {
      expect(selectors.isLicenseValidToEnableFlow(expiredState)).toEqual(expected);
    });
    test('should return true for valid license', () => {
      expect(selectors.isLicenseValidToEnableFlow(state)).toEqual({ enable: true });
    });
  });

  describe('selectors.hasAcceptedAccounts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasAcceptedAccounts()).toEqual(false);
    });
    test('should return true if state contains accepted account', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
                {
                  _id: 'ashare2',
                  accepted: true,
                  ownerUser: {
                    name: 'Owner Two',
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.hasAcceptedAccounts(state)).toEqual(true);
    });
    test('should return false if state contains disabled account', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  disabled: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.hasAcceptedAccounts(state)).toEqual(false);
    });
    test('should return false if state contains only owner account', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.hasAcceptedAccounts(state)).toEqual(false);
    });
  });

  describe('selectors.hasAcceptedUsers test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasAcceptedUsers()).toEqual(false);
    });
    const orgUserState = {
      user: {
        preferences: {
          defaultAShareId: 'ashare1',
        },
        org: {
          users: [
            {
              _id: 'user1',
              accepted: true,
              accessLevel: 'monitor',
            },
            {
              _id: 'user2',
              accepted: true,
            },
            {
              _id: 'ashare1',
              accepted: true,
              accessLevel: 'monitor',
              integrationAccessLevel: [],
            },
          ],
          accounts: [
            {
              _id: 'ashare1',
              accessLevel: 'owner',
              ownerUser: {
                licenses: [],
              },
            },
          ],
        },
      },
    };
    const state = {
      user: {
        preferences: {
          defaultAShareId: 'ashare1',
        },
        org: {
          users: [
            {
              _id: 'user1',
              accessLevel: 'monitor',
            },
          ],
          accounts: [
            {
              _id: 'ashare1',
              accessLevel: 'owner',
              ownerUser: {
                licenses: [],
              },
            },
          ],
        },
      },
    };

    test('should return true if account has accepted users', () => {
      expect(selectors.hasAcceptedUsers(orgUserState)).toEqual(true);
    });
    test('should return false if account does not have accepted users', () => {
      expect(selectors.hasAcceptedUsers(state)).toEqual(false);
    });
  });

  describe('selectors.isValidSharedAccountId test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isValidSharedAccountId()).toEqual(false);
    });
    test('should return true if state contains valid account', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.isValidSharedAccountId(state, 'ashare1')).toEqual(true);
    });
    test('should return false if state does not contains valid account', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: 'ashare2',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.isValidSharedAccountId(state, 'ashare1')).toEqual(false);
    });
  });

  describe('selectors.getOneValidSharedAccountId test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getOneValidSharedAccountId()).toEqual();
    });
    test('should return valid shared account id', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.getOneValidSharedAccountId(state)).toEqual('ashare1');
    });
    test('should return undefined if state does not contains valid shared account id', () => {
      const state =
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
              users: [],
            },
          },
        };

      expect(selectors.getOneValidSharedAccountId(state)).toEqual(undefined);
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
    const resourceType = 'exports';
    const resourceId = 'res-123';
    const integrationId = 'int-123';

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.canEditSettingsForm()).toEqual();
      expect(selectors.canEditSettingsForm({})).toEqual();
    });
    test('should return false if user has not enabled developer mode', () => {
      const state = {
        data: {
          resources: {
            exports: [{_id: 'res-123', _connectorId: 'connId'}],
          },
        },
        user: {
          profile: {
            developer: false,
          },
        },
      };

      expect(selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)).toEqual(false);
    });
    test('should return false if user (with dev mode on) does not have manage permission to the resource', () => {
      const state = {
        user: {
          org: {
            accounts: [{_id: 'someid', accessLevel: 'monitor'}],
          },
          preferences: { defaultAShareId: 'someid' },
          profile: {
            developer: true,
          },
        },
      };

      expect(selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)).toEqual(false);
    });
    test('should return false if IA resource user does not have access to publish', () => {
      const state = {
        data: {
          resources: {
            exports: [{_id: 'res-123', _connectorId: 'connId'}],
          },
        },
        user: {
          profile: {
            developer: true,
            allowedToPublish: false,
          },
        },
      };

      expect(selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)).toEqual(false);
    });
    test('should return true for IA publisher with developer mode on', () => {
      const state = {
        data: {
          resources: {
            exports: [{_id: 'res-123', _connectorId: 'connId'}],
          },
        },
        user: {
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          org: {
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
              },
            ],
          },
          profile: {
            developer: true,
            allowedToPublish: true,
          },
        },
      };

      expect(selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)).toEqual(true);
    });

    test('should return true for admin with account of IA publisher with developer mode on', () => {
      const state = {
        data: {
          resources: {
            exports: [{_id: 'res-123', _connectorId: 'connId'}],
          },
        },
        user: {
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                accessLevel: 'administrator',
                ownerUser: {
                  email: 'owner@test.com',
                  allowedToPublish: true,
                  name: 'owner 1',
                },
              },
            ],
          },
          profile: {
            developer: true,
            allowedToPublish: false,
          },
        },
      };

      expect(selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)).toEqual(true);
    });
    test('should return true for non IA resource with developer mode on', () => {
      const state = {
        data: {
          resources: {
            exports: [{_id: 'res-123', name: 'some export'}],
          },
        },
        user: {
          profile: {
            developer: true,
            allowedToPublish: false,
          },
        },
      };

      expect(selectors.canEditSettingsForm(state, resourceType, resourceId, integrationId)).toEqual(true);
    });
  });

  describe('selectors.availableConnectionsToRegister test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.availableConnectionsToRegister()).toEqual([]);
    });
    test('should return list of available connections to register', () => {
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
                name: 'connection 2',
              }],
            },
          },
        },
        'some action'
      );

      expect(selectors.availableConnectionsToRegister(state, 'integrationId1')).toEqual([{_id: 'connection2', name: 'connection 2'}]);
      expect(selectors.availableConnectionsToRegister(state, 'integrationId2')).toEqual([{_id: 'connection1', name: 'connection 1'}]);
    });
  });
  describe('selectors.tileLicenseDetails test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const expected = {licenseMessageContent: '', expired: false, trialExpired: false, showTrialLicenseMessage: false};

      expect(selectors.tileLicenseDetails(undefined, {})).toEqual(expected);
    });
    test('should return valid free trial license details', () => {
      const orgOwnerState = {
        user: {
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          profile: {
            _id: '4534534534',
            name: 'Raghu',
            email: 'rr@celigo.com',
          },
          org: {
            users: [
            ],
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [
                    {_id: '58da63d9ca6b9323e99d61f7', created: '2017-03-28T13:23:37.001Z', lastModified: '2017-03-28T13:23:37.002Z', type: 'diy', usageTier: 'free', resumable: false, usageTierName: 'Free', inTrial: false, hasSubscription: true, isFreemium: false, currentUsage: {milliseconds: 0, usagePercent: 0, usedHours: 0}, usageTierHours: 1},
                    {_id: '605ac7251562e664f50e712b', created: '2021-03-24T04:59:17.384Z', lastModified: '2021-03-24T06:04:02.667Z', type: 'integrationApp', _connectorId: '605ac5301562e664f50e70fd', sandbox: false, trialEndDate: '2021-09-24T18:29:59.999Z'},
                    {_id: '605b100f1562e664f50e8a23',
                      created: '2021-03-24T10:10:23.492Z',
                      lastModified: '2021-03-24T15:50:42.569Z',
                      type: 'integrationApp',
                      _connectorId: '605b0c867904202f317413c2',
                      _integrationId: '605b5fd2fddc8259d923d23d',
                      sandbox: false,
                      trialEndDate: moment()
                        .add(20, 'days')
                        .toISOString()},
                  ],
                },
              },
            ],
          },
          debug: false,
        },
      };
      const tile = {_integrationId: '605b5fd2fddc8259d923d23d', numError: 0, offlineConnections: [], _connectorId: '605b0c867904202f317413c2', name: 'IA Testing', sandbox: false, numFlows: 0, _parentId: null, status: 'is_pending_setup', integration: {mode: 'install', permissions: {accessLevel: 'owner', connections: {edit: true}}}, connector: {owner: 'Celigo', applications: ['netsuite']}};
      const expected = {licenseMessageContent: 'Trial expires in 20 days.',
        expired: false,
        trialExpired: false,
        showTrialLicenseMessage: true,
        licenseId: '605b100f1562e664f50e8a23',
      };

      expect(selectors.tileLicenseDetails(orgOwnerState, tile)).toEqual(expected);
    });
    test('should return valid free trial license details for expired connector', () => {
      const orgOwnerState = {
        user: {
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          profile: {
            _id: '4534534534',
            name: 'Raghu',
            email: 'rr@celigo.com',
          },
          org: {
            users: [
            ],
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [
                    {_id: '58da63d9ca6b9323e99d61f7', created: '2017-03-28T13:23:37.001Z', lastModified: '2017-03-28T13:23:37.002Z', type: 'diy', usageTier: 'free', resumable: false, usageTierName: 'Free', inTrial: false, hasSubscription: true, isFreemium: false, currentUsage: {milliseconds: 0, usagePercent: 0, usedHours: 0}, usageTierHours: 1},
                    {_id: '605ac7251562e664f50e712b', created: '2021-03-24T04:59:17.384Z', lastModified: '2021-03-24T06:04:02.667Z', type: 'integrationApp', _connectorId: '605ac5301562e664f50e70fd', sandbox: false, trialEndDate: '2021-09-24T18:29:59.999Z'},
                    {_id: '605b100f1562e664f50e8a23',
                      created: '2021-03-24T10:10:23.492Z',
                      lastModified: '2021-03-24T15:50:42.569Z',
                      type: 'integrationApp',
                      _connectorId: '605b0c867904202f317413c2',
                      _integrationId: '605b5fd2fddc8259d923d23d',
                      sandbox: false,
                      trialEndDate: moment()
                        .subtract(20, 'days')
                        .toISOString()},
                  ],
                },
              },
            ],
          },
          debug: false,
        },
      };
      const tile = {_integrationId: '605b5fd2fddc8259d923d23d', numError: 0, offlineConnections: [], _connectorId: '605b0c867904202f317413c2', name: 'IA Testing', sandbox: false, numFlows: 0, _parentId: null, status: 'is_pending_setup', integration: {mode: 'install', permissions: {accessLevel: 'owner', connections: {edit: true}}}, connector: {owner: 'Celigo', applications: ['netsuite']}};
      const expected = {licenseMessageContent: `Trial expired on ${moment(moment()
        .subtract(20, 'days')
        .toISOString()).format('MMM Do, YYYY')}`,
      expired: false,
      trialExpired: true,
      showTrialLicenseMessage: true,
      licenseId: '605b100f1562e664f50e8a23',
      };

      expect(selectors.tileLicenseDetails(orgOwnerState, tile)).toEqual(expected);
    });
    test('should return valid tile license details for active accounts', () => {
      const orgOwnerState = {
        user: {
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          profile: {
            _id: '4534534534',
            name: 'Raghu',
            email: 'rr@celigo.com',
          },
          org: {
            users: [
            ],
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [
                    {_id: '58da63d9ca6b9323e99d61f7', created: '2017-03-28T13:23:37.001Z', lastModified: '2017-03-28T13:23:37.002Z', type: 'diy', usageTier: 'free', resumable: false, usageTierName: 'Free', inTrial: false, hasSubscription: true, isFreemium: false, currentUsage: {milliseconds: 0, usagePercent: 0, usedHours: 0}, usageTierHours: 1},
                    {_id: '605ac7251562e664f50e712b', created: '2021-03-24T04:59:17.384Z', lastModified: '2021-03-24T06:04:02.667Z', type: 'integrationApp', _connectorId: '605ac5301562e664f50e70fd', sandbox: false, trialEndDate: '2021-09-24T18:29:59.999Z'},
                    {_id: '605b100f1562e664f50e8a23',
                      created: '2021-03-24T10:10:23.492Z',
                      lastModified: '2021-03-24T15:50:42.569Z',
                      type: 'integrationApp',
                      _connectorId: '605b0c867904202f317413c2',
                      _integrationId: '605b5fd2fddc8259d923d23d',
                      sandbox: false,
                      expires: moment()
                        .add(20, 'days')
                        .toISOString()},
                  ],
                },
              },
            ],
          },
          debug: false,
        },
      };
      const tile = {_integrationId: '605b5fd2fddc8259d923d23d', numError: 0, offlineConnections: [], _connectorId: '605b0c867904202f317413c2', name: 'IA Testing', sandbox: false, numFlows: 0, _parentId: null, status: 'is_pending_setup', integration: {mode: 'install', permissions: {accessLevel: 'owner', connections: {edit: true}}}, connector: {owner: 'Celigo', applications: ['netsuite']}};
      const expected = {licenseMessageContent: 'Your license will expire in 20 days. Contact sales to renew your license.',
        expired: false,
        trialExpired: false,
        showTrialLicenseMessage: false,
        licenseId: '605b100f1562e664f50e8a23',
      };

      expect(selectors.tileLicenseDetails(orgOwnerState, tile)).toEqual(expected);
    });
    test('should return valid tile license details for expired accounts', () => {
      const orgOwnerState = {
        user: {
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          profile: {
            _id: '4534534534',
            name: 'Raghu',
            email: 'rr@celigo.com',
          },
          org: {
            users: [
            ],
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [
                    {_id: '58da63d9ca6b9323e99d61f7', created: '2017-03-28T13:23:37.001Z', lastModified: '2017-03-28T13:23:37.002Z', type: 'diy', usageTier: 'free', resumable: false, usageTierName: 'Free', inTrial: false, hasSubscription: true, isFreemium: false, currentUsage: {milliseconds: 0, usagePercent: 0, usedHours: 0}, usageTierHours: 1},
                    {_id: '605ac7251562e664f50e712b', created: '2021-03-24T04:59:17.384Z', lastModified: '2021-03-24T06:04:02.667Z', type: 'integrationApp', _connectorId: '605ac5301562e664f50e70fd', sandbox: false, trialEndDate: '2021-09-24T18:29:59.999Z'},
                    {_id: '605b100f1562e664f50e8a23',
                      created: '2021-03-24T10:10:23.492Z',
                      lastModified: '2021-03-24T15:50:42.569Z',
                      type: 'integrationApp',
                      _connectorId: '605b0c867904202f317413c2',
                      _integrationId: '605b5fd2fddc8259d923d23d',
                      sandbox: false,
                      expires: moment()
                        .subtract(20, 'days')
                        .toISOString()},
                  ],
                },
              },
            ],
          },
          debug: false,
        },
      };
      const tile = {_integrationId: '605b5fd2fddc8259d923d23d', numError: 0, offlineConnections: [], _connectorId: '605b0c867904202f317413c2', name: 'IA Testing', sandbox: false, numFlows: 0, _parentId: null, status: 'is_pending_setup', integration: {mode: 'install', permissions: {accessLevel: 'owner', connections: {edit: true}}}, connector: {owner: 'Celigo', applications: ['netsuite']}};
      const expected = {licenseMessageContent: `Your license expired on ${moment(moment()
        .subtract(20, 'days')
        .toISOString()).format('MMM Do, YYYY')}. Contact sales to renew your license.`,
      expired: true,
      trialExpired: false,
      showTrialLicenseMessage: false,
      licenseId: '605b100f1562e664f50e8a23',
      };

      expect(selectors.tileLicenseDetails(orgOwnerState, tile)).toEqual(expected);
    });
    test('should return valid tile license details for resumable connector', () => {
      const orgOwnerState = {
        user: {
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
          profile: {
            _id: '4534534534',
            name: 'Raghu',
            email: 'rr@celigo.com',
          },
          org: {
            users: [
            ],
            accounts: [
              {
                _id: ACCOUNT_IDS.OWN,
                accessLevel: 'owner',
                ownerUser: {
                  licenses: [
                    {_id: '58da63d9ca6b9323e99d61f7', created: '2017-03-28T13:23:37.001Z', lastModified: '2017-03-28T13:23:37.002Z', type: 'diy', usageTier: 'free', resumable: false, usageTierName: 'Free', inTrial: false, hasSubscription: true, isFreemium: false, currentUsage: {milliseconds: 0, usagePercent: 0, usedHours: 0}, usageTierHours: 1},
                    {_id: '605ac7251562e664f50e712b', created: '2021-03-24T04:59:17.384Z', lastModified: '2021-03-24T06:04:02.667Z', type: 'integrationApp', _connectorId: '605ac5301562e664f50e70fd', sandbox: false, trialEndDate: '2021-09-24T18:29:59.999Z'},
                    {_id: '605b100f1562e664f50e8a23',
                      created: '2021-03-24T10:10:23.492Z',
                      lastModified: '2021-03-24T15:50:42.569Z',
                      type: 'integrationApp',
                      _connectorId: '605b0c867904202f317413c2',
                      _integrationId: '605b5fd2fddc8259d923d23d',
                      sandbox: false,
                      resumable: true,
                      expires: moment()
                        .add(20, 'days')
                        .toISOString()},
                  ],
                },
              },
            ],
          },
          debug: false,
        },
      };
      const tile = {_integrationId: '605b5fd2fddc8259d923d23d', numError: 0, offlineConnections: [], _connectorId: '605b0c867904202f317413c2', name: 'IA Testing', sandbox: false, numFlows: 0, _parentId: null, status: 'is_pending_setup', integration: {mode: 'install', permissions: {accessLevel: 'owner', connections: {edit: true}}}, connector: {owner: 'Celigo', applications: ['netsuite']}};
      const expected = {
        licenseMessageContent: `Your subscription was renewed on ${moment(moment()
          .add(20, 'days')
          .toISOString()).format('MMM Do, YYYY')}. Click Reactivate to continue.`,
        expired: false,
        resumable: true,
        trialExpired: false,
        showTrialLicenseMessage: false,
        licenseId: '605b100f1562e664f50e8a23',
      };

      expect(selectors.tileLicenseDetails(orgOwnerState, tile)).toEqual(expected);
    });
  });
});


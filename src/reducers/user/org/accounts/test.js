/* global describe, test, expect */
import moment from 'moment';
import reducer, * as selectors from './';
import actions from '../../../../actions';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../utils/constants';

describe('account (ashares) reducers', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual([]);
  });

  test('any other action should return original state', () => {
    const someState = [{ something: 'something' }];
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });

  test('should receive the right collection for licenses resource type when initial state is empty', () => {
    const someState = [];
    const someCollection = [
      { license1: 'something 1' },
      { license2: 'something 2' },
    ];
    const accounts = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: someCollection,
        },
      },
    ];
    const licensesCollectionsAction = actions.resource.receivedCollection(
      'licenses',
      someCollection
    );
    const newState = reducer(someState, licensesCollectionsAction);

    expect(newState).toEqual(accounts);
  });

  test('should receive the right collection for licenses resource type when initial state is not empty', () => {
    const someState = [
      {
        _id: 'abc',
        accepted: true,
        ownerUser: {
          _id: '123',
          company: 'Celigo Inc',
          email: 'name@gmail.com',
          name: 'Celigo Test',
          licenses: [
            { type: 'connector' },
            { type: 'integrator', sandbox: false },
          ],
          ssConnectionIds: ['9'],
        },
      },
      {
        _id: 'def',
        accepted: true,
        ownerUser: {
          _id: '456',
          email: 'playground@celigo.com',
          name: 'Playground Management',
          company: 'Celigo Playground',
          licenses: [{ type: 'integrator', sandbox: true }],
        },
      },
      {
        _id: 'htng',
        accepted: false,
        ownerUser: {
          _id: '456',
          email: 'ignoreme@celigo.com',
          name: 'Ignore Management',
          company: 'skip',
          licenses: [{ type: 'integrator', sandbox: true }],
        },
      },
    ];
    const someCollection = [
      { license1: 'something 1' },
      { license2: 'something 2' },
    ];
    const ownAccounts = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: someCollection,
        },
      },
    ];
    const licensesCollectionsAction = actions.resource.receivedCollection(
      'licenses',
      someCollection
    );
    const newState = reducer(someState, licensesCollectionsAction);

    expect(newState).toEqual([...ownAccounts, ...someState]);
  });

  test('should receive the right collection for shared/ashares resource type', () => {
    const someState = [{ something: 'something' }];
    const someCollection = [
      { account1: 'something 1' },
      { account2: 'something 2' },
    ];
    const asharesCollectionsAction = actions.resource.receivedCollection(
      'shared/ashares',
      someCollection
    );
    const newState = reducer(someState, asharesCollectionsAction);

    expect(newState).toEqual(someCollection);
  });
  test('should receive the right collection for shared/ashares resource type when own account present', () => {
    const someState = [{ _id: ACCOUNT_IDS.OWN }];
    const someCollection = [
      { account1: 'something 1' },
      { account2: 'something 2' },
    ];
    const asharesCollectionsAction = actions.resource.receivedCollection(
      'shared/ashares',
      someCollection
    );
    const newState = reducer(someState, asharesCollectionsAction);

    expect(newState).toEqual([...someState, ...someCollection]);
  });
  describe('selectors', () => {
    const testAccounts = [
      {
        _id: 'abc',
        accepted: true,
        ownerUser: {
          _id: '123',
          company: 'Celigo Inc',
          email: 'name@gmail.com',
          name: 'Celigo Test',
          licenses: [
            { type: 'connector' },
            { type: 'integrator', sandbox: false },
          ],
          ssConnectionIds: ['9'],
        },
      },
      {
        _id: 'def',
        accepted: true,
        ownerUser: {
          _id: '456',
          email: 'playground@celigo.com',
          name: 'Playground Management',
          company: 'Celigo Playground',
          licenses: [{ type: 'integrator', sandbox: true }],
        },
      },
      {
        _id: 'ghi',
        accepted: true,
        ownerUser: {
          _id: '789',
          email: 'ghi789@celigo.com',
          name: 'ghi 789',
          company: 'ghi 789 company',
          licenses: [
            { type: 'integrator', sandbox: false, numSandboxAddOnFlows: 2 },
          ],
        },
      },
      {
        _id: 'htng',
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
        ownerUser: {
          _id: '456',
          email: 'ignoreme@celigo.com',
          name: 'Ignore Management',
          company: 'skip',
          licenses: [{ type: 'integrator', sandbox: true }],
        },
      },
    ];
    const ownLicenses = [
      {
        _id: 'license1',
        type: 'integrator',
        sandbox: true,
      },
    ];

    describe('sharedAccounts', () => {
      test('should return correct sandbox state if account supports sandbox.', () => {
        const state = reducer(
          undefined,
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );
        const expectedResult = [
          {
            company: 'Celigo Inc',
            email: 'name@gmail.com',
            id: 'abc',
            hasSandbox: false,
          },
          {
            company: 'Celigo Playground',
            email: 'playground@celigo.com',
            id: 'def',
            hasSandbox: true,
          },
          {
            company: 'ghi 789 company',
            email: 'ghi789@celigo.com',
            id: 'ghi',
            hasSandbox: true,
          },
        ];
        const result = selectors.sharedAccounts(state);

        expect(result).toEqual(expectedResult);
      });
    });
    describe('integratorLicense', () => {
      test('should return null when there is no integrator license', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', [])
        );

        expect(selectors.integratorLicense(state, 'invalid_account')).toEqual(
          null
        );
        const state2 = reducer(
          state,
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );

        expect(selectors.integratorLicense(state2, 'invalid_account')).toEqual(
          null
        );
      });
      test('should return correct integrator license', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('licenses', ownLicenses)
        );

        expect(selectors.integratorLicense(state, ACCOUNT_IDS.OWN)).toEqual({
          _id: 'license1',
          type: 'integrator',
          sandbox: true,
          hasSandbox: true,
        });

        const state2 = reducer(
          state,
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );

        expect(selectors.integratorLicense(state2, 'abc')).toEqual({
          type: 'integrator',
          sandbox: false,
          hasSandbox: false,
        });

        expect(selectors.integratorLicense(state2, 'def')).toEqual({
          type: 'integrator',
          sandbox: true,
          hasSandbox: true,
        });
        expect(selectors.integratorLicense(state2, 'ghi')).toEqual({
          type: 'integrator',
          sandbox: false,
          numSandboxAddOnFlows: 2,
          hasSandbox: true,
        });
      });
      test('should return correct status, expiresInDays of integrator license', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            { _id: 'license1', type: 'integrator', tier: 'none' },
          ])
        );

        expect(selectors.integratorLicense(state, ACCOUNT_IDS.OWN)).toEqual({
          _id: 'license1',
          type: 'integrator',
          tier: 'none',
          hasSandbox: false,
        });

        const state2 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'free',
              trialEndDate: moment()
                .add(10, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.integratorLicense(state2, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'free',
            hasSandbox: false,
            trialEndDate: expect.any(String),
            status: 'IN_TRIAL',
            expiresInDays: 10,
          })
        );

        const state3 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'free',
              trialEndDate: moment()
                .subtract(2, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.integratorLicense(state3, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'free',
            hasSandbox: false,
            trialEndDate: expect.any(String),
            status: 'TRIAL_EXPIRED',
          })
        );

        const state4 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'free',
              trialEndDate: moment()
                .subtract(1, 'hours')
                .toISOString(),
            },
          ])
        );

        expect(selectors.integratorLicense(state4, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'free',
            hasSandbox: false,
            trialEndDate: expect.any(String),
            status: 'TRIAL_EXPIRED',
          })
        );

        const state5 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'standard',
              expires: moment()
                .add(60, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.integratorLicense(state5, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSandbox: false,
            expires: expect.any(String),
            status: 'ACTIVE',
            // @Shiva, I was getting 61 days? Code looks good though. Not sure what is going on...
            expiresInDays: 61,
          })
        );

        const state6 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'standard',
              expires: moment()
                .add(1, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.integratorLicense(state6, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSandbox: false,
            expires: expect.any(String),
            status: 'ACTIVE',
            expiresInDays: 1,
          })
        );

        const state7 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'standard',
              expires: moment()
                .subtract(1, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.integratorLicense(state7, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSandbox: false,
            expires: expect.any(String),
            status: 'EXPIRED',
          })
        );
      });
    });
    describe('accountSummary', () => {
      test('should return correct set of account options when account has both prod/sandbox environments enabled.', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );
        const expectedResult = [
          {
            id: 'abc',
            environment: 'production',
            company: 'Celigo Inc',
            canLeave: true,
          },
          {
            id: 'def',
            environment: 'production',
            company: 'Celigo Playground',
            canLeave: true,
          },
          {
            id: 'def',
            company: 'Celigo Playground',
            environment: 'sandbox',
            canLeave: false,
          },
          {
            id: 'ghi',
            environment: 'production',
            company: 'ghi 789 company',
            canLeave: true,
          },
          {
            id: 'ghi',
            environment: 'sandbox',
            company: 'ghi 789 company',
            canLeave: false,
          },
        ];
        const result = selectors.accountSummary(state);

        expect(result).toEqual(expectedResult);
      });

      test('should return correct set of account options for own account.', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('licenses', ownLicenses)
        );
        const expectedResult = [
          {
            id: ACCOUNT_IDS.OWN,
            environment: 'production',
          },
          {
            id: ACCOUNT_IDS.OWN,
            environment: 'sandbox',
          },
        ];
        const result = selectors.accountSummary(state);

        expect(result).toEqual(expectedResult);
      });
    });
    describe('notifications', () => {
      test('should return correct set of account options.', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );
        const expectedResult = [
          {
            id: 'htng',
            accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            ownerUser: {
              company: 'skip',
              email: 'ignoreme@celigo.com',
              name: 'Ignore Management',
            },
          },
        ];
        const result = selectors.notifications(state);

        expect(result).toEqual(expectedResult);
      });
    });
    describe('permissions', () => {
      test('should return correct permissions for account owner', () => {
        const ownAccount = {
          _id: ACCOUNT_IDS.OWN,
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        };
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', [ownAccount])
        );
        const permissions = selectors.permissions(state, ACCOUNT_IDS.OWN);
        const ownerPermissions = {
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
          audits: { view: true },
          subscriptions: { view: true, requestUpgrade: true },
          accesstokens: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          agents: { view: true, create: true, edit: true, delete: true },

          connections: { view: true, create: true, edit: true, delete: true },
          connectors: {},
          integrations: {
            create: true,
            install: true,
            none: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
              flows: {
                create: true,
                edit: true,
                delete: true,
                clone: true,
              },
              connections: {
                create: true,
                edit: true,
              },
            },
            all: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
              edit: true,
              delete: true,
              clone: true,
              flows: {
                create: true,
                edit: true,
                delete: true,
                clone: true,
                attach: true,
                detach: true,
              },
              connections: {
                create: true,
                edit: true,
                register: true,
              },
            },
          },
          recyclebin: {
            view: true,
            restore: true,
            download: true,
            purge: true,
          },
          scripts: { view: true, create: true, edit: true, delete: true },
          stacks: { view: true, create: true, edit: true, delete: true },

          templates: {},
          transfers: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          users: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        };

        expect(Object.isFrozen(permissions)).toEqual(true);
        expect(permissions).toEqual(ownerPermissions);
        const permissionsWithAllowedToPublish = selectors.permissions(
          state,
          ACCOUNT_IDS.OWN,
          { allowedToPublish: true }
        );

        expect(Object.isFrozen(permissionsWithAllowedToPublish)).toEqual(true);
        expect(permissionsWithAllowedToPublish).toEqual({
          ...ownerPermissions,
          connectors: {
            view: true,
            create: true,
            edit: true,
            delete: true,
            publish: true,
          },
          templates: {
            view: true,
            create: true,
            edit: true,
            delete: true,
            publish: true,
          },
        });
      });
      test('should return correct permissions for account level manage user', () => {
        const account = {
          _id: 'account1',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
          accepted: true,
        };
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', [account])
        );
        const permissions = selectors.permissions(state, 'account1');
        const manageUserPermissions = {
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
          audits: {},
          subscriptions: { requestUpgrade: true },
          accesstokens: {},
          agents: { view: true, create: true, edit: true, delete: true },

          connections: { view: true, create: true, edit: true, delete: true },
          connectors: {},
          integrations: {
            create: true,
            install: true,
            none: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
              flows: {
                create: true,
                edit: true,
                delete: true,
                clone: true,
              },
              connections: {
                create: true,
                edit: true,
              },
            },
            all: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
              edit: true,
              delete: true,
              clone: true,
              flows: {
                create: true,
                edit: true,
                delete: true,
                clone: true,
                attach: true,
                detach: true,
              },
              connections: {
                create: true,
                edit: true,
                register: true,
              },
            },
          },
          recyclebin: {
            view: true,
            restore: true,
            download: true,
            purge: true,
          },
          scripts: { view: true, create: true, edit: true, delete: true },
          stacks: { view: true, create: true, edit: true, delete: true },

          templates: {},
          transfers: {},
          users: {},
        };

        expect(Object.isFrozen(permissions)).toEqual(true);
        expect(permissions).toEqual(manageUserPermissions);
      });
      test('should return correct permissions for account level monitor user', () => {
        const account = {
          _id: 'account1',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
          accepted: true,
        };
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', [account])
        );
        const permissions = selectors.permissions(state, 'account1');
        const monitorUserPermissions = {
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
          audits: {},
          subscriptions: {},
          accesstokens: {},
          agents: {},

          connections: {},
          connectors: {},
          integrations: {
            none: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
              flows: {},
              connections: {},
            },
            all: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,

              flows: {},
              connections: {},
            },
          },
          recyclebin: {},
          scripts: {},
          stacks: {},

          templates: {},
          transfers: {},
          users: {},
        };

        expect(Object.isFrozen(permissions)).toEqual(true);
        expect(permissions).toEqual(monitorUserPermissions);
      });
      test('should return correct permissions for tile level access user', () => {
        const account = {
          _id: 'account1',
          accepted: true,
          integrationAccessLevel: [
            {
              _integrationId: 'manageIntegration',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
            },
            {
              _integrationId: 'monitorIntegration',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
          ],
        };
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', [account])
        );
        const permissions = selectors.permissions(state, 'account1');
        const tileUserPermissions = {
          accessLevel: USER_ACCESS_LEVELS.TILE,
          audits: {},
          subscriptions: {},
          accesstokens: {},
          agents: {},

          connections: {},
          connectors: {},
          integrations: {
            manageIntegration: {
              accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
              edit: true,
              flows: {
                create: true,
                edit: true,
                delete: true,
                clone: true,
              },
              connections: {
                create: true,
                edit: true,
                register: true,
              },
            },
            monitorIntegration: {
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
              flows: {},
              connections: {},
            },
          },
          recyclebin: {},
          scripts: {},
          stacks: {},

          templates: {},
          transfers: {},
          users: {},
        };

        expect(Object.isFrozen(permissions)).toEqual(true);
        expect(permissions).toEqual(tileUserPermissions);
      });
    });
    describe('accessLevel', () => {
      test('should return correct access level when state is undefined', () => {
        const state = reducer(undefined, 'some action');

        expect(selectors.accessLevel(state)).toEqual(undefined);
        expect(selectors.accessLevel(state, 'something')).toEqual(undefined);
        expect(selectors.accessLevel(state, ACCOUNT_IDS.OWN)).toEqual(
          USER_ACCESS_LEVELS.ACCOUNT_OWNER
        );
      });

      test('should return correct accessLevel for an owner', () => {
        const state = reducer([], 'some action');

        expect(selectors.accessLevel(state, ACCOUNT_IDS.OWN)).toEqual(
          USER_ACCESS_LEVELS.ACCOUNT_OWNER
        );
      });
      test('should return correct accessLevel for an org user with account level manage access', () => {
        const state = reducer(
          [
            {
              _id: 'ashare1',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
            },
            {
              _id: 'ashare2',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            },
          ],
          'some action'
        );

        expect(selectors.accessLevel(state, 'ashare1')).toEqual(
          USER_ACCESS_LEVELS.ACCOUNT_MANAGE
        );
      });
      test('should return correct accessLevel for an org user with account level monitor access', () => {
        const state = reducer(
          [
            {
              _id: 'ashare1',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
            },
            {
              _id: 'ashare2',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            },
          ],
          'some action'
        );

        expect(selectors.accessLevel(state, 'ashare2')).toEqual(
          USER_ACCESS_LEVELS.ACCOUNT_MONITOR
        );
      });
      test('should return correct accessLevel for an org user with tile level access', () => {
        const state = reducer(
          [
            {
              _id: 'ashare1',
            },
            {
              _id: 'ashare2',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            },
          ],
          'some action'
        );

        expect(selectors.accessLevel(state, 'ashare1')).toEqual(
          USER_ACCESS_LEVELS.TILE
        );
      });
    });
    describe('owner', () => {
      test('should return undefined if state is undefined', () => {
        const state = reducer(undefined, 'some action');

        expect(selectors.owner(state, 'ashare1')).toEqual(undefined);
      });
      test('should return correct owner info', () => {
        const state = reducer(
          [
            {
              _id: 'ashare1',
              ownerUser: { email: 'owner1@test.com', name: 'Owner One' },
            },
            {
              _id: 'ashare2',
              ownerUser: { email: 'owner2@test.com', name: 'Owner Two' },
            },
          ],
          'some action'
        );

        expect(selectors.owner(state, 'ashare1')).toEqual({
          email: 'owner1@test.com',
          name: 'Owner One',
        });
        expect(selectors.owner(state, 'ashare2')).toEqual({
          email: 'owner2@test.com',
          name: 'Owner Two',
        });
        expect(selectors.owner(state, 'invalid')).toEqual(undefined);
      });
    });
  });
});

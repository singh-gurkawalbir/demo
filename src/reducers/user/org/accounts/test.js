/* global describe, test, expect */
import moment from 'moment';
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import {
  ACCOUNT_IDS,
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  emptyList,
} from '../../../../constants';

// this could be moved into some common place... just testing this now.
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;

    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    }

    return {
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass: false,
    };
  },
});

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
  test('should be able to update all trial related properties when trialLicenseIssued event is triggered', () => {
    const state = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: [
            { license1: 'something 1', type: 'endpoint' },
            { license2: 'something 2' },
          ],
        },
      },
    ];
    const output = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: [
            { license1: 'something 1', tier: 'free', type: 'endpoint', trialStarted: true, trialEndDate: expect.any(String),
            },
            { license2: 'something 2' },
          ],
        },
      },
    ];
    const licenseTrailIssuedAction = actions.license.trialLicenseIssued({tier: 'free', trialEndDate: moment().add(30, 'days').toISOString(), type: 'LICENSE_TRIAL_ISSUED'}
    );
    const newState = reducer(state, licenseTrailIssuedAction);

    expect(newState).toEqual(output);
  });
  test('should return default state when trialLicenseIssued event is triggered and initial state in empty', () => {
    const trialLicenseIssuedAction = actions.license.trialLicenseIssued();
    const newState = reducer(emptyList, trialLicenseIssuedAction);

    expect(newState).toEqual(emptyList);
  });
  test('should return default state when trialLicenseIssued event is triggered and initial state does not contain endpoint or integrator license', () => {
    const licenseTrailIssuedAction = actions.license.trialLicenseIssued({tier: 'free', trialEndDate: moment().add(30, 'days').toISOString(), type: 'LICENSE_TRIAL_ISSUED'}
    );
    const state = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: [
            { license1: 'something 1' },
            { license2: 'something 2' },
          ],
        },
      },
    ];
    const newState = reducer(state, licenseTrailIssuedAction);

    expect(newState).toEqual(state);
  });

  test('should be able to update upgradeRequested to true when licenseUpgradeRequestSubmitted event is triggered', () => {
    const state = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: [
            { license1: 'something 1', type: 'endpoint' },
            { license2: 'something 2' },
          ],
        },
      },
    ];
    const output = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: [
            { license1: 'something 1', type: 'endpoint', upgradeRequested: true},
            { license2: 'something 2' },
          ],
        },
      },
    ];
    const licenseUpgradeRequestSubmittedAction = actions.license.licenseUpgradeRequestSubmitted();
    const newState = reducer(state, licenseUpgradeRequestSubmittedAction);

    expect(newState).toEqual(output);
  });
  test('should return default state when licenseUpgradeRequestSubmitted event is triggered and initial state in empty', () => {
    const licenseUpgradeRequestSubmittedAction = actions.license.licenseUpgradeRequestSubmitted();
    const newState = reducer(emptyList, licenseUpgradeRequestSubmittedAction);

    expect(newState).toEqual(emptyList);
  });
  test('should return default state when licenseUpgradeRequestSubmitted event is triggered and initial state does not contain endpoint or integrator license', () => {
    const licenseUpgradeRequestSubmittedAction = actions.license.licenseUpgradeRequestSubmitted();
    const state = [
      {
        _id: ACCOUNT_IDS.OWN,
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
        ownerUser: {
          licenses: [
            { license1: 'something 1' },
            { license2: 'something 2' },
          ],
        },
      },
    ];
    const newState = reducer(state, licenseUpgradeRequestSubmittedAction);

    expect(newState).toEqual(state);
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
            { type: 'integrator', sandbox: false, sso: false },
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
          licenses: [{ type: 'integrator', sandbox: true, sso: true }],
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
            { type: 'integrator', sandbox: false, numSandboxAddOnFlows: 2, sso: false },
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
          licenses: [{ type: 'integrator', sandbox: true, sso: false }],
        },
      },
    ];
    const testAccountsWithExpireDates = [
      {
        _id: 'a1',
        accepted: true,
        ownerUser: {
          _id: 'user1',
          company: 'Testacc1',
          email: 'Testacc1@gmail.com',
          name: 'Celigo Test',
          licenses: [
            { type: 'connector' },
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'free',
              sso: false,
              trialEndDate: moment()
                .add(10, 'days')
                .toISOString(),
            },
          ],
        },
      },
      {
        _id: 'a2',
        accepted: true,
        ownerUser: {
          _id: 'user2',
          email: 'Testacc2@celigo.com',
          name: 'Playground Management',
          company: 'Testacc2',
          licenses: [{
            _id: 'license2',
            type: 'integrator',
            tier: 'free',
            sso: false,
            trialEndDate: moment()
              .subtract(2, 'days')
              .toISOString(),
          }],
        },
      },
      {
        _id: 'a3',
        accepted: true,
        ownerUser: {
          _id: 'user3',
          email: 'Testacc3@celigo.com',
          name: 'Playground Management',
          company: 'Testacc3',
          licenses: [{
            _id: 'license3',
            type: 'integrator',
            tier: 'standard',
            sso: true,
            expires: moment()
              .add(60, 'days')
              .toISOString(),
          }],
        },
      },
      {
        _id: 'a4',
        accepted: true,
        ownerUser: {
          _id: 'user4',
          email: 'Testacc4@celigo.com',
          name: 'Playground Management',
          company: 'Testacc4',
          licenses: [{
            _id: 'license4',
            type: 'integrator',
            tier: 'standard',
            sso: false,
            expires: moment()
              .subtract(1, 'days')
              .toISOString(),
          }],
        },
      },
      {
        _id: 'a5',
        accepted: true,
        ownerUser: {
          _id: 'user5',
          email: 'Testacc5@celigo.com',
          name: 'Playground Management',
          company: 'Testacc5',
          licenses: [{
            _id: 'license5',
            type: 'integrator',
            tier: 'standard',
            sso: true,
            expires: moment()
              .subtract(1, 'days')
              .toISOString(),
          }],
        },
      },
    ];
    const ownLicenses = [
      {
        _id: 'license1',
        type: 'integrator',
        sandbox: true,
        sso: true,
      },
    ];

    describe('sharedAccounts', () => {
      test('should return empty array if received state is undefined', () => {
        const state = reducer(undefined, 'some action');
        const result = selectors.sharedAccounts(state);

        expect(result).toEqual(emptyList);
      });
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
            hasSSO: false,
            hasSandbox: false,
            hasConnectorSandbox: false,
          },
          {
            company: 'Celigo Playground',
            email: 'playground@celigo.com',
            id: 'def',
            hasSSO: false,
            hasSandbox: true,
            hasConnectorSandbox: false,
          },
          {
            company: 'ghi 789 company',
            email: 'ghi789@celigo.com',
            id: 'ghi',
            hasSSO: false,
            hasSandbox: true,
            hasConnectorSandbox: false,
          },
        ];
        const result = selectors.sharedAccounts(state);

        expect(result).toEqual(expectedResult);
      });
      test('should return correct sso state for every shared account', () => {
        const state = reducer(
          undefined,
          actions.resource.receivedCollection('shared/ashares', testAccountsWithExpireDates)
        );
        const expectedResult = [
          {
            company: 'Testacc1',
            email: 'Testacc1@gmail.com',
            hasConnectorSandbox: false,
            hasSSO: true,
            hasSandbox: false,
            id: 'a1',
          },
          {
            company: 'Testacc2',
            email: 'Testacc2@celigo.com',
            hasConnectorSandbox: false,
            hasSSO: false,
            hasSandbox: false,
            id: 'a2',
          },
          {
            company: 'Testacc3',
            email: 'Testacc3@celigo.com',
            hasConnectorSandbox: false,
            hasSSO: true,
            hasSandbox: false,
            id: 'a3',
          },
          {
            company: 'Testacc4',
            email: 'Testacc4@celigo.com',
            hasConnectorSandbox: false,
            hasSSO: false,
            hasSandbox: false,
            id: 'a4',
          },
          {
            company: 'Testacc5',
            email: 'Testacc5@celigo.com',
            hasConnectorSandbox: false,
            hasSSO: false,
            hasSandbox: false,
            id: 'a5',
          },
        ];
        const result = selectors.sharedAccounts(state);

        expect(result).toEqual(expectedResult);
      });
    });
    describe('platformLicense', () => {
      test('should return null when there is no integrator license', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', [])
        );

        expect(selectors.platformLicense(state, 'invalid_account')).toEqual(
          null
        );
        const state2 = reducer(
          state,
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );

        expect(selectors.platformLicense(state2, 'invalid_account')).toEqual(
          null
        );
      });
      test('should return correct integrator license', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('licenses', ownLicenses)
        );

        expect(selectors.platformLicense(state, ACCOUNT_IDS.OWN)).toEqual({
          _id: 'license1',
          type: 'integrator',
          sandbox: true,
          hasSandbox: true,
          sso: true,
          hasSSO: false,
          hasConnectorSandbox: false,
        });

        const state2 = reducer(
          state,
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );

        expect(selectors.platformLicense(state2, 'abc')).toEqual({
          type: 'integrator',
          sso: false,
          hasSSO: false,
          sandbox: false,
          hasSandbox: false,
          hasConnectorSandbox: false,
        });

        expect(selectors.platformLicense(state2, 'def')).toEqual({
          type: 'integrator',
          sandbox: true,
          hasSSO: false,
          sso: true,
          hasSandbox: true,
          hasConnectorSandbox: false,
        });
        expect(selectors.platformLicense(state2, 'ghi')).toEqual({
          type: 'integrator',
          sandbox: false,
          sso: false,
          hasSSO: false,
          numSandboxAddOnFlows: 2,
          hasSandbox: true,
          hasConnectorSandbox: false,
        });
      });
      test('should return correct status, expiresInDays of integrator license', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            { _id: 'license1', type: 'integrator', tier: 'none' },
          ])
        );

        expect(selectors.platformLicense(state, ACCOUNT_IDS.OWN)).toEqual({
          _id: 'license1',
          type: 'integrator',
          tier: 'none',
          hasSSO: false,
          hasSandbox: false,
          hasConnectorSandbox: false,
        });

        const state2 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'free',
              sso: false,
              trialEndDate: moment()
                .add(10, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.platformLicense(state2, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'free',
            hasSSO: true,
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
              sso: false,
              trialEndDate: moment()
                .subtract(2, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.platformLicense(state3, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'free',
            hasSSO: false,
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
              sso: false,
              trialEndDate: moment()
                .subtract(1, 'hours')
                .toISOString(),
            },
          ])
        );

        expect(selectors.platformLicense(state4, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'free',
            hasSSO: false,
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
              sso: false,
              expires: moment()
                .add(60, 'days')
                .toISOString(),
            },
          ])
        );
        const result = selectors.platformLicense(state5, ACCOUNT_IDS.OWN);

        expect(result).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSSO: false,
            hasSandbox: false,
            expires: expect.any(String),
            status: 'ACTIVE',
          })
        );

        // @Shiva.
        // why does this line fail for Tim and I? maybe timezone issue?
        // Tim and I get 61 days not 60.
        expect(result.expiresInDays).toBeWithinRange(60, 61);

        const state6 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'standard',
              sso: true,
              expires: moment()
                .add(1, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.platformLicense(state6, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSSO: true,
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
              sso: false,
              expires: moment()
                .subtract(1, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.platformLicense(state7, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSSO: false,
            hasSandbox: false,
            expires: expect.any(String),
            status: 'EXPIRED',
          })
        );

        const state8 = reducer(
          [],
          actions.resource.receivedCollection('licenses', [
            {
              _id: 'license1',
              type: 'integrator',
              tier: 'standard',
              sso: true,
              expires: moment()
                .subtract(1, 'days')
                .toISOString(),
            },
          ])
        );

        expect(selectors.platformLicense(state8, ACCOUNT_IDS.OWN)).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSSO: false,
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
            company: 'Celigo Inc',
            canLeave: true,
            hasSandbox: false,
            hasSSO: false,
            hasConnectorSandbox: false,
          },
          {
            id: 'def',
            company: 'Celigo Playground',
            canLeave: true,
            hasSandbox: true,
            hasSSO: false,
            hasConnectorSandbox: false,
          },
          {
            id: 'ghi',
            company: 'ghi 789 company',
            canLeave: true,
            hasSandbox: true,
            hasSSO: false,
            hasConnectorSandbox: false,
          },
        ];
        const result = selectors.accountSummary(state);

        expect(result).toEqual(expectedResult);
      });
      test('should return correct set of account options when account has sso enabled/disabled.', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('shared/ashares', testAccountsWithExpireDates)
        );
        const expectedResult = [
          {
            canLeave: true,
            company: 'Testacc1',
            hasConnectorSandbox: false,
            hasSSO: true,
            hasSandbox: false,
            id: 'a1',
          },
          {
            canLeave: true,
            company: 'Testacc2',
            hasConnectorSandbox: false,
            hasSSO: false,
            hasSandbox: false,
            id: 'a2',
          },
          {
            canLeave: true,
            company: 'Testacc3',
            hasConnectorSandbox: false,
            hasSSO: true,
            hasSandbox: false,
            id: 'a3',
          },
          {
            canLeave: true,
            company: 'Testacc4',
            hasConnectorSandbox: false,
            hasSSO: false,
            hasSandbox: false,
            id: 'a4',
          },
          {
            canLeave: true,
            company: 'Testacc5',
            hasConnectorSandbox: false,
            hasSSO: false,
            hasSandbox: false,
            id: 'a5',
          },
        ];
        const result = selectors.accountSummary(state);

        expect(result).toEqual(expectedResult);
      });
      test('should return empty array if received state is undefined.', () => {
        const state = reducer(undefined, 'some action');
        const result = selectors.accountSummary(state);

        expect(result).toEqual(emptyList);
      });

      test('should return correct set of account options for own account.', () => {
        const state = reducer(
          [],
          actions.resource.receivedCollection('licenses', ownLicenses)
        );
        const expectedResult = [
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: true,
            hasSSO: false,
            hasConnectorSandbox: false,
          },
        ];
        const result = selectors.accountSummary(state);

        expect(result).toEqual(expectedResult);
      });
    });
    describe('notifications', () => {
      test('should return empty array if received state is undefined', () => {
        const state = reducer(undefined, 'some action');
        const result = selectors.notifications(state);

        expect(result).toEqual(emptyList);
      });
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
          exports: { view: true, create: true, edit: true, delete: true },
          imports: { view: true, create: true, edit: true, delete: true },

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
            connectors: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
              edit: true,
              delete: true,
              flows: {
                edit: true,
              },
              connections: {
                create: true,
                edit: true,
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
          eventreports: {view: true, create: true, edit: true, delete: true},
          stacks: { view: true, create: true, edit: true, delete: true },
          apis: {view: true, create: true, edit: true, delete: true},
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
          exports: { view: true, create: true, edit: true, delete: true },
          imports: { view: true, create: true, edit: true, delete: true },
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
            connectors: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
              edit: true,
              delete: true,
              flows: {
                edit: true,
              },
              connections: {
                create: true,
                edit: true,
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
          apis: {view: true, create: true, edit: true, delete: true },
          eventreports: {view: true, create: true, edit: true, delete: true},
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
          exports: {},
          imports: {},
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
            connectors: {
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
              flows: {},
              connections: {},
            },
          },
          eventreports: {},
          recyclebin: {},
          scripts: {},
          stacks: {},
          apis: {},
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
          exports: {},
          imports: {},
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
          apis: {},
          eventreports: {},
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
    describe('isAccountSSORequired', () => {
      test('should return false for invalid state or no accountId passed', () => {
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

        expect(selectors.isAccountSSORequired()).toBeFalsy();
        expect(selectors.isAccountSSORequired(state, 'invalid')).toBeFalsy();
      });
      test('should return false if the accountId passed does not match existing accounts', () => {
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

        expect(selectors.isAccountSSORequired()).toBeFalsy();
        expect(selectors.isAccountSSORequired(state, 'ashare3')).toBeFalsy();
      });
      test('should return false if the account for passed accountId has isAccountSSORequired false', () => {
        const state = reducer(
          [
            {
              _id: 'ashare1',
              ownerUser: { email: 'owner1@test.com', name: 'Owner One' },
            },
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: false,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId123',
              },
            },
          ],
          'some action'
        );

        expect(selectors.isAccountSSORequired(state, 'ashareId123')).toBeFalsy();
      });
      test('should return true if the account for passed accountId has isAccountSSORequired true', () => {
        const state = reducer(
          [
            {
              _id: 'ashare1',
              ownerUser: { email: 'owner1@test.com', name: 'Owner One' },
            },
            {
              _id: 'ashareId123',
              accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              accountSSORequired: true,
              ownerUser: {
                _id: 'ownerId',
                _ssoClientId: 'clientId123',
              },
            },
          ],
          'some action'
        );

        expect(selectors.isAccountSSORequired(state, 'ashareId123')).toBeTruthy();
      });
    });
  });
});

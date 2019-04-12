/* global describe, test, expect */
import moment from 'moment';
import reducer, * as selectors from './';
import actions from '../../../../actions';

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
        _id: 'own',
        accessLevel: 'owner',
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
        _id: 'own',
        accessLevel: 'owner',
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
    const someState = [{ _id: 'own' }];
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
        accessLevel: 'monitor',
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

        expect(selectors.integratorLicense(state, 'own')).toEqual({
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

        expect(selectors.integratorLicense(state, 'own')).toEqual({
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

        expect(selectors.integratorLicense(state2, 'own')).toEqual(
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

        expect(selectors.integratorLicense(state3, 'own')).toEqual(
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

        expect(selectors.integratorLicense(state4, 'own')).toEqual(
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

        expect(selectors.integratorLicense(state5, 'own')).toEqual(
          expect.objectContaining({
            _id: 'license1',
            type: 'integrator',
            tier: 'standard',
            hasSandbox: false,
            expires: expect.any(String),
            status: 'ACTIVE',
            expiresInDays: 60,
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

        expect(selectors.integratorLicense(state6, 'own')).toEqual(
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

        expect(selectors.integratorLicense(state7, 'own')).toEqual(
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
            label: 'Celigo Inc',
            company: 'Celigo Inc',
            canLeave: true,
          },
          {
            id: 'def',
            environment: 'production',
            label: 'Celigo Playground - Production',
            company: 'Celigo Playground',
            canLeave: true,
          },
          {
            id: 'def',
            label: 'Celigo Playground - Sandbox',
            environment: 'sandbox',
            canLeave: false,
          },
          {
            id: 'ghi',
            environment: 'production',
            label: 'ghi 789 company - Production',
            company: 'ghi 789 company',
            canLeave: true,
          },
          {
            id: 'ghi',
            environment: 'sandbox',
            label: 'ghi 789 company - Sandbox',
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
            id: 'own',
            environment: 'production',
            label: 'Production',
          },
          {
            id: 'own',
            environment: 'sandbox',
            label: 'Sandbox',
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
            accessLevel: 'monitor',
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
  });
});

/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../../actions';

describe('account (ashares) reducers', () => {
  test('any other action return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual([]);
  });

  test('any other action return original state', () => {
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
            sandbox: false,
          },
          {
            company: 'Celigo Playground',
            email: 'playground@celigo.com',
            id: 'def',
            sandbox: true,
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
        });

        const state2 = reducer(
          state,
          actions.resource.receivedCollection('shared/ashares', testAccounts)
        );

        expect(selectors.integratorLicense(state2, 'abc')).toEqual({
          type: 'integrator',
          sandbox: false,
        });

        expect(selectors.integratorLicense(state2, 'def')).toEqual({
          type: 'integrator',
          sandbox: true,
        });
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
          },
          {
            id: 'def',
            environment: 'production',
            label: 'Celigo Playground - Production',
          },
          {
            id: 'def',
            label: 'Celigo Playground - Sandbox',
            environment: 'sandbox',
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

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

  test('should receive the right collection for ashares resource type', () => {
    const someState = [{ something: 'something' }];
    const someCollection = [
      { account1: 'something 1' },
      { account2: 'something 2' },
    ];
    const asharesCollectionsAction = actions.resource.receivedCollection(
      'ashares',
      someCollection
    );
    const newState = reducer(someState, asharesCollectionsAction);

    expect(newState).toEqual(someCollection);
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

    describe('sharedAccounts', () => {
      test('should return correct sandbox state if account supports sandbox.', () => {
        const state = reducer(
          null,
          actions.resource.receivedCollection('ashares', testAccounts)
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
    describe('accountSummary', () => {
      test('should return correct set of account options when account has both prod/sandbox environments enabled.', () => {
        const state = reducer(
          null,
          actions.resource.receivedCollection('ashares', testAccounts)
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
    });
  });
});

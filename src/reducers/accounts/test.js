/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../actions';

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

  describe('selectors', () => {
    describe('sharedAccounts', () => {
      test('should return correct sandbox state if account supports sandbox.', () => {
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
        const state = reducer(
          null,
          actions.ashares.receivedCollection(testAccounts)
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
  });
});

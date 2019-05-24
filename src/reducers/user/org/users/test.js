/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../../actions';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../utils/constants';

describe('users (ashares) reducers', () => {
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

  test('should update the state properly when a new ashare/user created', () => {
    const someState = [{ something: 'something' }];
    const newUser = { something: 'something new' };
    const newUserCreatedAction = actions.user.org.users.created(newUser);
    const newState = reducer(someState, newUserCreatedAction);

    expect(newState).toEqual([...someState, newUser]);
  });
  test('should update the state properly when an ashare/user updated', () => {
    const someState = [
      { _id: 'ashare1', something: 'something1' },
      {
        _id: 'ashare2',
        something: 'something2',
        somethingelse: 'somethingelse',
      },
    ];
    const updatedUserInfo = { test: 'abc', somethingelse: 'something new' };
    const UserUpdatedAction = actions.user.org.users.updated({
      ...updatedUserInfo,
      _id: 'ashare2',
    });
    const newState = reducer(someState, UserUpdatedAction);
    const expected = [
      { _id: 'ashare1', something: 'something1' },
      {
        _id: 'ashare2',
        something: 'something2',
        somethingelse: 'something new',
        test: 'abc',
      },
    ];

    expect(newState).toEqual(expected);
  });
  test('should update the state properly when an user deleted', () => {
    const someState = [
      { _id: 'ashare1', something: 'something1' },
      {
        _id: 'ashare2',
      },
    ];
    const UserDeletedAction = actions.user.org.users.deleted('ashare2');
    const newState = reducer(someState, UserDeletedAction);
    const expected = [{ _id: 'ashare1', something: 'something1' }];

    expect(newState).toEqual(expected);
  });
  test('should update the state properly when an user disabled/enabled', () => {
    const someState = [
      { _id: 'ashare1', something: 'something1', disabled: false },
      {
        _id: 'ashare2',
        disabled: true,
      },
    ];
    const User1DisabledAction = actions.user.org.users.disabled('ashare1');
    let newState = reducer(someState, User1DisabledAction);

    expect(newState).toEqual([
      { _id: 'ashare1', something: 'something1', disabled: true },
      {
        _id: 'ashare2',
        disabled: true,
      },
    ]);
    /**
     * This will enable the ashare2 as it's already disabled.
     * API provides /disable route only and it toggles the disabled state.
     */
    const User2DisabledAction = actions.user.org.users.disabled('ashare2');

    newState = reducer(someState, User2DisabledAction);

    expect(newState).toEqual([
      { _id: 'ashare1', something: 'something1', disabled: false },
      {
        _id: 'ashare2',
        disabled: false,
      },
    ]);
  });
  test('list should return [] when the state undefined', () => {
    const newState = reducer(undefined, 'someaction');

    expect(selectors.list(newState)).toEqual([]);
  });
  test('list should return correct user details', () => {
    const newState = reducer(
      [
        { _id: 'one', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE },
        { _id: 'two', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR },
        {
          _id: 'three',
          integrationAccessLevel: [
            {
              _integrationId: 'i1',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
          ],
        },
      ],
      'someaction'
    );

    expect(selectors.list(newState)).toEqual([
      { _id: 'one', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE },
      { _id: 'two', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR },
      {
        _id: 'three',
        accessLevel: USER_ACCESS_LEVELS.TILE,
        integrationAccessLevel: [
          {
            _integrationId: 'i1',
            accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
          },
        ],
      },
    ]);
  });
  describe('integrationUsers selector', () => {
    test('should return [] when the state undefined', () => {
      const newState = reducer(undefined, 'someaction');

      expect(selectors.integrationUsers(newState)).toEqual([]);
    });
    test('should return correct user details', () => {
      const newState = reducer(
        [
          { _id: 'one', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE },
          { _id: 'two', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR },
          {
            _id: 'three',
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
        ],
        'someaction'
      );

      expect(selectors.integrationUsers(newState, 'i1')).toEqual([
        { _id: 'one', accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE },
        { _id: 'two', accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR },
        {
          _id: 'three',
          accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
        },
      ]);

      expect(selectors.integrationUsers(newState, 'i2')).toEqual([
        { _id: 'one', accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE },
        { _id: 'two', accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR },
        {
          _id: 'three',
          accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
        },
      ]);

      expect(selectors.integrationUsers(newState, 'something')).toEqual([
        { _id: 'one', accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE },
        { _id: 'two', accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR },
      ]);
    });
  });
});

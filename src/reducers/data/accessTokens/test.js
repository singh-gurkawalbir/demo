/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';
import { PASSWORD_MASK } from '../../../utils/constants';

describe('access tokens reducer', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual([]);
  });
  test('any other action, when state exists, should return original state', () => {
    const someState = [{ something: 'something' }];
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  describe('should update the state properly when access tokens collection received', () => {
    const accessTokens = [{ _id: 'id1' }, { _id: 'id2' }];
    const accessTokensReceivedAction = actions.resource.receivedCollection(
      'accesstokens',
      accessTokens
    );

    test('should update the state properly when the current state is undefined', () => {
      const newState = reducer(undefined, accessTokensReceivedAction);

      expect(newState).toEqual(accessTokens);
    });
    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        [{ _id: 'something' }, { _id: 'something else' }],
        accessTokensReceivedAction
      );

      expect(newState).toEqual(accessTokens);
    });
  });
  test("should update the state properly when an access token's token received", () => {
    const accessTokens = [
      { _id: 'id1', token: PASSWORD_MASK },
      { _id: 'id2', token: PASSWORD_MASK },
    ];
    const state = reducer(accessTokens, 'some action');
    const accessTokensTokenDisplayAction = actions.accessToken.tokenReceived({
      _id: 'id1',
      token: 'something',
    });
    const newState = reducer(state, accessTokensTokenDisplayAction);
    const expected = accessTokens.map(at => {
      if (at._id === 'id1') {
        return { ...at, token: 'something' };
      }

      return at;
    });

    expect(newState).toEqual(expected);
  });
  test("should update the state properly when an access token's token is masked", () => {
    const accessTokens = [
      { _id: 'id1', token: PASSWORD_MASK },
      { _id: 'id2', token: 'something' },
    ];
    const state = reducer(accessTokens, 'some action');
    const accessTokensTokenDisplayAction = actions.accessToken.maskToken({
      _id: 'id2',
    });
    const newState = reducer(state, accessTokensTokenDisplayAction);
    const expected = accessTokens.map(at => {
      if (at._id === 'id2') {
        return { ...at, token: PASSWORD_MASK };
      }

      return at;
    });

    expect(newState).toEqual(expected);
  });
  test('should update the state properly when an access token is created', () => {
    const accessTokens = [{ _id: 'id1' }, { _id: 'id2' }];
    const state = reducer(accessTokens, 'some action');
    const newToken = {
      _id: 'id3',
    };
    const accessTokenCreatedAction = actions.accessToken.created(newToken);
    const newState = reducer(state, accessTokenCreatedAction);
    const expected = accessTokens.concat([newToken]);

    expect(newState).toEqual(expected);
  });
  test('should update the state properly when an access token is updated', () => {
    const accessTokens = [{ _id: 'id1' }, { _id: 'id2' }];
    const state = reducer(accessTokens, 'some action');
    const updatedToken = {
      _id: 'id2',
      scope: 'custom',
    };
    const accessTokenUpdatedAction = actions.accessToken.updated(updatedToken);
    const newState = reducer(state, accessTokenUpdatedAction);
    const expected = accessTokens.map(at => {
      if (at._id === updatedToken._id) {
        return updatedToken;
      }

      return at;
    });

    expect(newState).toEqual(expected);
  });
  test('should update the state properly when an access token is deleted', () => {
    const accessTokens = [{ _id: 'id1' }, { _id: 'id2' }, { _id: 'id3' }];
    const state = reducer(accessTokens, 'some action');
    const deletedTokenId = 'id2';
    const accessTokenDeletedAction = actions.accessToken.deleted(
      deletedTokenId
    );
    const newState = reducer(state, accessTokenDeletedAction);
    const expected = accessTokens.filter(at => at._id !== deletedTokenId);

    expect(newState).toEqual(expected);
  });
});

describe('accessTokenList selector', () => {
  const accessTokens = [
    {
      _id: 'id1',
      name: 'token1',
      description: 'description1',
      token: PASSWORD_MASK,
      revoked: false,
      fullAccess: true,
      autoPurgeAt: 'autoPurgeAt1',
    },
    {
      _id: 'id2',
      name: 'token2',
      description: 'description2',
      token: 'something2',
      fullAccess: true,
    },
    {
      _id: 'id3',
      name: 'token3',
      token: PASSWORD_MASK,
      revoked: true,
      _connectionIds: ['c1'],
      _exportIds: ['e1', 'e2'],
    },
    {
      _id: 'id4',
      name: 'token4',
      token: 'something4',
      _connectionIds: ['c1'],
      _exportIds: ['e1', 'e2'],
      _importIds: ['i1', 'i2'],
      autoPurgeAt: 'autoPurgeAt4',
    },
    {
      _id: 'id5',
      name: 'token5',
      description: 'description5',
      token: PASSWORD_MASK,
      _connectionIds: ['c2', 'c3'],
      _exportIds: ['e1'],
      _importIds: ['i2', 'i3'],
      _integrationId: 'i1',
      _connectorId: 'c1',
      autoPurgeAt: 'autoPurgeAt5',
    },
    {
      _id: 'id6',
      name: 'token6',
      token: PASSWORD_MASK,
      fullAccess: true,
      revoked: true,
      _integrationId: 'i1',
      _connectorId: 'c1',
      autoPurgeAt: 'autoPurgeAt6',
    },
    {
      _id: 'id7',
      name: 'token7',
      description: 'description7',
      token: 'something7',
      _exportIds: ['e1'],
      _importIds: ['i3', 'i4'],
      _integrationId: 'i1',
      _connectorId: 'c1',
    },
  ];
  const expected = [
    {
      _id: 'id1',
      name: 'token1',
      description: 'description1',
      revoked: false,
      fullAccess: true,
      autoPurgeAt: 'autoPurgeAt1',

      token: '',
      isEmbeddedToken: false,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
      },
      permissionReasons: {
        delete: 'To delete this api token you need to revoke it first.',
      },
    },
    {
      _id: 'id2',
      name: 'token2',
      description: 'description2',
      revoked: false,
      fullAccess: true,

      token: 'something2',
      isEmbeddedToken: false,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
      },
      permissionReasons: {
        delete: 'To delete this api token you need to revoke it first.',
      },
    },
    {
      _id: 'id3',
      name: 'token3',
      revoked: true,
      fullAccess: false,
      _connectionIds: ['c1'],
      _exportIds: ['e1', 'e2'],

      token: '',
      isEmbeddedToken: false,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: false,
        activate: true,
        edit: true,
        delete: true,
      },
      permissionReasons: {},
    },
    {
      _id: 'id4',
      name: 'token4',
      revoked: false,
      fullAccess: false,
      _connectionIds: ['c1'],
      _exportIds: ['e1', 'e2'],
      _importIds: ['i1', 'i2'],
      autoPurgeAt: 'autoPurgeAt4',

      token: 'something4',
      isEmbeddedToken: false,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
      },
      permissionReasons: {
        delete: 'To delete this api token you need to revoke it first.',
      },
    },
    {
      _id: 'id5',
      name: 'token5',
      revoked: false,
      fullAccess: false,
      description: 'description5',
      _connectionIds: ['c2', 'c3'],
      _exportIds: ['e1'],
      _importIds: ['i2', 'i3'],
      _integrationId: 'i1',
      _connectorId: 'c1',
      autoPurgeAt: 'autoPurgeAt5',

      token: '',
      isEmbeddedToken: false,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: true,
        activate: false,
        edit: true,
        delete: false,
      },
      permissionReasons: {
        delete: 'To delete this api token you need to revoke it first.',
      },
    },
    {
      _id: 'id6',
      name: 'token6',
      fullAccess: true,
      revoked: true,
      _integrationId: 'i1',
      _connectorId: 'c1',
      autoPurgeAt: 'autoPurgeAt6',

      token: '',
      isEmbeddedToken: false,
      permissions: {
        displayToken: true,
        generateToken: true,
        revoke: false,
        activate: true,
        edit: true,
        delete: true,
      },
      permissionReasons: {},
    },
    {
      _id: 'id7',
      name: 'token7',
      revoked: false,
      fullAccess: false,
      description: 'description7',
      _exportIds: ['e1'],
      _importIds: ['i3', 'i4'],
      _integrationId: 'i1',
      _connectorId: 'c1',

      token: 'something7',
      isEmbeddedToken: true,
      permissions: {
        displayToken: false,
        generateToken: false,
        revoke: true,
        activate: false,
        edit: false,
        delete: false,
      },
      permissionReasons: {
        displayToken: 'Embedded Token',
        generateToken:
          'This api token is owned by a SmartConnector and cannot be regenerated.',
        edit:
          'This api token is owned by a SmartConnector and cannot be edited or deleted here.',
        delete:
          'This api token is owned by a SmartConnector and cannot be edited or deleted here.',
      },
    },
  ];

  test('should return [] when the state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.accessTokenList(state)).toEqual([]);
    expect(selectors.accessTokenList(state, 'something')).toEqual([]);
  });

  test('should return correct results for an connector integration access tokens', () => {
    const state = reducer(accessTokens, 'some action');
    const integrationId = 'i1';
    const expectedResults = expected.filter(
      at => at._integrationId === integrationId
    );

    expect(selectors.accessTokenList(state, integrationId)).toEqual(
      expectedResults
    );
  });

  test('should return correct results for non integration access tokens', () => {
    const state = reducer(accessTokens, 'some action');
    const expectedResults = expected.filter(at => !at._integrationId);

    expect(selectors.accessTokenList(state)).toEqual(expectedResults);
  });
});

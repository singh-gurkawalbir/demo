/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('tests for notifications reducer', () => {
  test('should add unaccepted account/stack shares to the state when called received action', () => {
    const sharesCollection = [
      {
        _id: '1',
        accepted: false,
        accessLevel: 'monitor',
        ownerUser: {
          email: 'testuser@abc.com',
          name: 'user xy',
        },
      },
      {
        _id: '2',
        rejected: false,
        accessLevel: 'manage',
        ownerUser: {
          email: 'user1@abc.com',
          name: 'user yz',
          company: 'Celigo',
        },
      },
      {
        _id: '3',
        dismissed: false,
        accessLevel: 'manage',
        integrationAccessLevel: [

        ],
        ownerUser: {
          email: 'user2@xyz.com',
          name: 'user st',
        },
      },
      {
        _id: '4',
        accepted: false,
        ownerUser: {
          email: 'user4@mail.com',
          name: 'User cd',
        },
      },
    ];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('shared/ashares', sharesCollection)
    );

    expect(state).toEqual({
      accounts: sharesCollection,
      stacks: [],
    });

    const ssharesState = reducer(
      undefined,
      actions.resource.receivedCollection('shared/sshares', sharesCollection)
    );

    expect(ssharesState).toEqual({
      accounts: [],
      stacks: sharesCollection,
    });
  });

  test('should ignore accepted/dismissed ashares to the state when called received action', () => {
    const sharesCollection = [
      {
        _id: '1',
        accepted: true,
        accessLevel: 'monitor',
        ownerUser: {
          email: 'testuser@abc.com',
          name: 'user xy',
        },
      },
      {
        _id: '2',
        rejected: true,
        accessLevel: 'manage',
        ownerUser: {
          email: 'user1@abc.com',
          name: 'user yz',
        },
      },
      {
        _id: '3',
        dismissed: true,
        accessLevel: 'manage',
        integrationAccessLevel: [

        ],
        ownerUser: {
          email: 'user2@xyz.com',
          name: 'user st',
        },
      },
      {
        _id: '4',
        accepted: false,
      },
    ];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('shared/ashares', sharesCollection)
    );

    expect(state).toEqual({
      accounts: [],
      stacks: [],
    });

    const ssharesState = reducer(
      undefined,
      actions.resource.receivedCollection('shared/sshares', sharesCollection)
    );

    expect(ssharesState).toEqual({
      accounts: [],
      stacks: [],
    });
  });

  test('should add unaccepted transfers to the state on received action', () => {
    const transfers = [
      {
        _id: '1',
        accepted: false,
        toTransfer: {
          integrations: [
            {
              _id: 'id1',
              name: 'test transfer integration - Comp',
            },
          ],
        },
        ownerUser: {
          email: 'testuser@abc.com',
          name: 'user xy',
        },
      },
      {
        _id: '2',
        accepted: false,
        toTransfer: {
          integrations: [
            {
              _id: 'iid2',
              name: 'test latest status changes for transfer',
            },
          ],
        },
        ownerUser: {
          _id: 'oid',
          email: 'testuser@abc.com',
          name: 'user xy',
        },
      },
    ];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('transfers', transfers)
    );

    expect(state).toEqual({
      accounts: [],
      stacks: [],
      transfers,
    });

    const invitedTransfersState = reducer(
      undefined,
      actions.resource.receivedCollection('transfers/invited', transfers)
    );

    expect(invitedTransfersState).toEqual({
      accounts: [],
      stacks: [],
      transfers,
    });
  });

  test('should ignore accepted/dismissed transfers to the state on received action', () => {
    const transfers = [
      {
        _id: '1',
        accepted: true,
        toTransfer: {
          integrations: [
            {
              _id: 'id1',
              name: 'test transfer integration - Comp',
            },
          ],
        },
        ownerUser: {
          email: 'testuser@abc.com',
          name: 'user xy',
        },
      },
      {
        _id: '2',
        dismissed: true,
        toTransfer: {
          integrations: [
            {
              _id: 'iid2',
              name: 'test latest status changes for transfer',
            },
          ],
        },
        ownerUser: {
          _id: 'oid',
          email: 'testuser@abc.com',
          name: 'user xy',
        },
      },
      {
        _id: '3',
        toTransfer: {
          integrations: [
            {
              _id: 'iid2',
              name: 'test latest status changes for transfer',
            },
          ],
        },
      },
    ];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('transfers', transfers)
    );

    expect(state).toEqual({
      accounts: [],
      stacks: [],
      transfers: [],
    });

    const invitedTransfersState = reducer(
      undefined,
      actions.resource.receivedCollection('transfers/invited', transfers)
    );

    expect(invitedTransfersState).toEqual({
      accounts: [],
      stacks: [],
      transfers: [],
    });
  });
});

describe('tests for selector testcases', () => {
  test('should return emptySet for undefined state', () => {
    expect(selectors.userNotifications(undefined)).toEqual([]);
  });

  test('should return userNotifications for all resources', () => {
    const accountShareCollection = [{
      _id: '1',
      accepted: false,
      accessLevel: 'monitor',
      ownerUser: {
        email: 'testuser@abc.com',
        name: 'user xy',
      },
    }];

    const stackShareCollection = [{
      _id: '1',
      accepted: false,
      accessLevel: 'monitor',
      ownerUser: {
        email: 'testuser@abc.com',
        name: 'user xy',
      },
      stack: {
        name: 'High Tech',
      },
    }];

    const transferCollection = [{
      _id: '1',
      accepted: false,
      toTransfer: {
        integrations: [
          {
            _id: 'id1',
            name: 'test transfer integration - Comp',
          },
        ],
      },
      ownerUser: {
        email: 'testuser@abc.com',
        name: 'user xy',
      },
    },
    {
      _id: '2',
      dismissed: false,
      toTransfer: {
        integrations: [
          {
            _id: 'iid2',
            name: 'test latest status changes for transfer',
          },
        ],
      },
      ownerUser: {
        _id: 'oid',
        email: 'testuser@abc.com',
        name: 'user xy',
      },
    },
    {
      _id: '3',
      dismissed: false,
      account: true,
      ownerUser: {
        email: 'sant.test@celigo.com',
        name: 'Comp',
      },
    },
    ];

    let notificationState = reducer(
      undefined,
      actions.resource.receivedCollection('shared/ashares', accountShareCollection)
    );

    notificationState = reducer(
      notificationState,
      actions.resource.receivedCollection('shared/sshares', stackShareCollection)
    );

    notificationState = reducer(
      notificationState,
      actions.resource.receivedCollection('transfers', transferCollection)
    );

    expect(selectors.userNotifications(notificationState)).toEqual([
      {
        id: '1',
        type: 'account',
        nameOrCompany: 'user xy',
        email: 'testuser@abc.com',
        message: 'is inviting you to join their account.',
      },
      {
        id: '1',
        type: 'transfer',
        nameOrCompany: 'user xy',
        email: 'testuser@abc.com',
        message: 'wants to transfer integration(s) test transfer integration - Comp to you.',
      },
      {
        id: '2',
        type: 'transfer',
        nameOrCompany: 'user xy',
        email: 'testuser@abc.com',
        message: 'wants to transfer integration(s) test latest status changes for transfer to you.',
      },
      {
        id: '3',
        type: 'transfer',
        nameOrCompany: 'Comp',
        email: 'sant.test@celigo.com',
        message: 'has invited you to become the owner of their account.',
        account: true,
      },
      {
        id: '1',
        type: 'stack',
        nameOrCompany: 'user xy',
        email: 'testuser@abc.com',
        stackName: 'High Tech',
        message: 'testuser@abc.com has shared the "High Tech" stack with you.',
      },
    ]);
  });
});

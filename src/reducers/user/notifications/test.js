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
          email: 'dileepkrishnasai.madamanchi@celigo.com',
          name: 'Dileep Krishna Sai',
        },
      },
      {
        _id: '2',
        rejected: false,
        accessLevel: 'manage',
        ownerUser: {
          email: 'ssssantoshkumar@celigo.com',
          name: 'santosh kumar',
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
          email: 'thotakura.muneswara@celigo.com',
          name: 'THOTAKURA MUNESWARA',
        },
      },
      {
        _id: '4',
        accepted: false,
        ownerUser: {
          email: 'keerthi.sri469@gmail.com',
          name: 'Sukeerthi Sriram',
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
          email: 'dileepkrishnasai.madamanchi@celigo.com',
          name: 'Dileep Krishna Sai',
        },
      },
      {
        _id: '2',
        rejected: true,
        accessLevel: 'manage',
        ownerUser: {
          email: 'ssssantoshkumar@celigo.com',
          name: 'santosh kumar',
        },
      },
      {
        _id: '3',
        dismissed: true,
        accessLevel: 'manage',
        integrationAccessLevel: [

        ],
        ownerUser: {
          email: 'thotakura.muneswara@celigo.com',
          name: 'THOTAKURA MUNESWARA',
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
        _id: '5f2aa287e238492e2a5a2189',
        accepted: false,
        toTransfer: {
          integrations: [
            {
              _id: '5f2aa24c3ce94135c8a230e8',
              name: 'test transfer integration - santosh',
            },
          ],
        },
        ownerUser: {
          email: 'dileepkrishnasai.madamanchi@celigo.com',
          name: 'Dileep Krishna Sai',
        },
      },
      {
        _id: '5f228e3b9b2e7468fbf7db2c',
        accepted: false,
        toTransfer: {
          integrations: [
            {
              _id: '5f1b38201df46c2a7ec36011',
              name: 'test latest status changes for transfer',
            },
          ],
        },
        ownerUser: {
          _id: '5c417c492a5dd30cd676a990',
          email: 'dileepkrishnasai.madamanchi@celigo.com',
          name: 'Dileep Krishna Sai',
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
        _id: '5f2aa287e238492e2a5a2189',
        accepted: true,
        toTransfer: {
          integrations: [
            {
              _id: '5f2aa24c3ce94135c8a230e8',
              name: 'test transfer integration - santosh',
            },
          ],
        },
        ownerUser: {
          email: 'dileepkrishnasai.madamanchi@celigo.com',
          name: 'Dileep Krishna Sai',
        },
      },
      {
        _id: '5f228e3b9b2e7468fbf7db2c',
        dismissed: true,
        toTransfer: {
          integrations: [
            {
              _id: '5f1b38201df46c2a7ec36011',
              name: 'test latest status changes for transfer',
            },
          ],
        },
        ownerUser: {
          _id: '5c417c492a5dd30cd676a990',
          email: 'dileepkrishnasai.madamanchi@celigo.com',
          name: 'Dileep Krishna Sai',
        },
      },
      {
        _id: '3',
        toTransfer: {
          integrations: [
            {
              _id: '5f1b38201df46c2a7ec36011',
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
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        name: 'Dileep Krishna Sai',
      },
    }];

    const stackShareCollection = [{
      _id: '1',
      accepted: false,
      accessLevel: 'monitor',
      ownerUser: {
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        name: 'Dileep Krishna Sai',
      },
      stack: {
        name: 'High Tech',
      },
    }];

    const transferCollection = [{
      _id: '5f2aa287e238492e2a5a2189',
      accepted: false,
      toTransfer: {
        integrations: [
          {
            _id: '5f2aa24c3ce94135c8a230e8',
            name: 'test transfer integration - santosh',
          },
        ],
      },
      ownerUser: {
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        name: 'Dileep Krishna Sai',
      },
    },
    {
      _id: '5f228e3b9b2e7468fbf7db2c',
      dismissed: false,
      toTransfer: {
        integrations: [
          {
            _id: '5f1b38201df46c2a7ec36011',
            name: 'test latest status changes for transfer',
          },
        ],
      },
      ownerUser: {
        _id: '5c417c492a5dd30cd676a990',
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        name: 'Dileep Krishna Sai',
      },
    },
    {
      _id: '3',
      dismissed: false,
      account: true,
      ownerUser: {
        email: 'sant.test@celigo.com',
        name: 'Santosh',
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
        nameOrCompany: 'Dileep Krishna Sai',
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        message: 'is inviting you to join their account.',
      },
      {
        id: '5f2aa287e238492e2a5a2189',
        type: 'transfer',
        nameOrCompany: 'Dileep Krishna Sai',
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        message: 'wants to transfer integration(s) test transfer integration - santosh to you.',
      },
      {
        id: '5f228e3b9b2e7468fbf7db2c',
        type: 'transfer',
        nameOrCompany: 'Dileep Krishna Sai',
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        message: 'wants to transfer integration(s) test latest status changes for transfer to you.',
      },
      {
        id: '3',
        type: 'transfer',
        nameOrCompany: 'Santosh',
        email: 'sant.test@celigo.com',
        message: 'has invited you to become the owner of their account.',
        account: true,
      },
      {
        id: '1',
        type: 'stack',
        nameOrCompany: 'Dileep Krishna Sai',
        email: 'dileepkrishnasai.madamanchi@celigo.com',
        stackName: 'High Tech',
        message: 'dileepkrishnasai.madamanchi@celigo.com has shared the "High Tech" stack with you.',
      },
    ]);
  });
});

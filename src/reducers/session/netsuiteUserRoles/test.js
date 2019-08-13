/* global describe, test, expect */

import reducer, { netsuiteUserRoles } from '.';
import actions from '../../../actions';

describe('netsuiteUser roles reducer ', () => {
  const connectionId = '123';

  test('should create a new connection on request if there isn`t an existing one', () => {
    const existingState = {
      [connectionId]: { somePrevStateProp: 'something' },
    };
    // existing connection id
    let state = reducer(
      existingState,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    expect(state).toEqual(existingState);
    // new  connection id
    state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    expect(state).toEqual({ [connectionId]: {} });
  });

  test('should persist userRoles in state on received action', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(connectionId, {
        something: {},
      })
    );

    expect(state).toEqual({
      [connectionId]: { userRoles: { something: {} }, status: 'success' },
    });
  });
  test('should update the status to failed when the request for netsuiteUserRoles has failed', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    state = reducer(
      state,
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        'Failed to retrieve'
      )
    );

    expect(state).toEqual({
      [connectionId]: { status: 'failed', message: 'Failed to retrieve' },
    });
  });
  test('should clear the the message and the status on a failed request for netsuiteUserRoles', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    state = reducer(
      state,
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        'Failed to retrieve'
      )
    );

    expect(state).toEqual({
      [connectionId]: { status: 'failed', message: 'Failed to retrieve' },
    });

    state = reducer(
      state,
      actions.resource.connections.netsuite.clearUserRoles(connectionId)
    );

    expect(state).toEqual({
      [connectionId]: {},
    });
  });

  test('should not clear the previous successful retrieval of netsuiteUserRoles in the event of a failure', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(connectionId, {
        something: {},
      })
    );

    state = reducer(
      state,
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        'Failed to retrieve'
      )
    );

    expect(state[connectionId]).toEqual({
      message: 'Failed to retrieve',
      status: 'failed',
      userRoles: { something: {} },
    });
  });

  test('should not update a different connection state', () => {
    const anotherConnectionId = '3434';
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(connectionId, {
        something: {},
      })
    );

    state = reducer(
      state,
      actions.resource.connections.netsuite.receivedUserRoles(
        anotherConnectionId,
        {
          somethingElse: {},
        }
      )
    );
    expect(state).toEqual({
      [connectionId]: { status: 'success', userRoles: { something: {} } },
      [anotherConnectionId]: {
        status: 'success',
        userRoles: { somethingElse: {} },
      },
    });
  });

  test('should not mutate the state for a non relevant action type', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(connectionId, {
        something: {},
      })
    );

    state = reducer(state, { type: 'some type' });
    // state is the same
    expect(state).toEqual({
      [connectionId]: {
        status: 'success',
        userRoles: {
          something: {},
        },
      },
    });
  });
});

describe('netsuiteUserRoles selector ', () => {
  const connectionId = '123';
  const sampleResp = {
    production: {
      accounts: [
        {
          account: {
            internalId: '123333',
            name: 'Integrator Scrum',
            type: 'PRODUCTION',
          },
          role: {
            internalId: 21212,
            name: 'Administrator',
          },
        },
        {
          account: {
            internalId: '12222',
            name: 'Sandbox',
            type: 'PRODUCTION',
          },
          role: {
            internalId: 122,
            name: 'Celigo Integration Admin',
          },
        },
      ],
    },
    sandbox: {
      accounts: [
        {
          account: {
            internalId: '123333',
            name: 'Integrator Scrum',
            type: 'PRODUCTION',
          },
          role: {
            internalId: 21212,
            name: 'Administrator',
          },
        },
      ],
    },
  };
  const sampleRespOfMultipleRolesForTheSameAcc = {
    production: {
      accounts: [
        {
          account: {
            internalId: '123333',
            name: 'Integrator Scrum',
            type: 'PRODUCTION',
          },
          role: {
            internalId: 21212,
            name: 'Administrator',
          },
        },
        {
          account: {
            internalId: '123333',
            name: 'Integrator Scrum',
            type: 'PRODUCTION',
          },
          role: {
            internalId: 122,
            name: 'Celigo Integration Admin',
          },
        },
      ],
    },
  };

  test('should return all environments when environment is provided as the netsuite resource request type', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'environment';
    const env = null;
    const acc = null;
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual([
      { label: 'production', value: 'production' },
      { label: 'sandbox', value: 'sandbox' },
    ]);
  });

  test('should return all accounts matching an environment when the environment is selected', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'account';
    const env = 'production';
    const acc = null;
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual([
      {
        value: '123333',
        label: 'Integrator Scrum',
      },
      { value: '12222', label: 'Sandbox' },
    ]);
  });

  test('should return all roles for a matching selected environment and account', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'role';
    const env = 'production';
    const acc = '12222';
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual([
      {
        value: 122,
        label: 'Celigo Integration Admin',
      },
    ]);
  });

  test('should return a null optionsArr when invalid netsuite resource type is provided', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'someInvalidResourceType';
    const env = null;
    const acc = null;
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual(null);
  });

  test('should return all unique accounts when a netsuiteUserRoles response has multiple roles of the same account', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleRespOfMultipleRolesForTheSameAcc
      )
    );
    const netsuiteResourceType = 'account';
    const env = 'production';
    const acc = null;
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual([
      { label: 'Integrator Scrum', value: '123333' },
    ]);
  });

  test('should return undefined for netsuiteResourceType of account when there isn`t any matching accounts for the selected environment', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'account';
    const env = 'someNonMatchingEnvironement';
    const acc = null;
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual(undefined);
  });

  test('should return an empty array for netsuiteResourceType of role when there isn`t any matching roles for the selected account', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'role';
    const env = 'production';
    const acc = 'someNonMatchingAccount';
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual([]);
  });
  test('should return undefined for netsuiteResourceType of role when there isn`t any matching roles for the selected environment and account', () => {
    const state = reducer(
      undefined,
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        sampleResp
      )
    );
    const netsuiteResourceType = 'role';
    const env = 'someNonMatchingEnvironement';
    const acc = 'someNonMatchingAccount';
    const { optionsArr } = netsuiteUserRoles(
      state,
      connectionId,
      netsuiteResourceType,
      env,
      acc
    );

    expect(optionsArr).toEqual(undefined);
  });
});

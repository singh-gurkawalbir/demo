/* global describe, test, expect */

import reducer, { netsuiteUserRoles } from '.';
import actions from '../../../actions';

describe('netsuiteUser roles reducer', () => {
  const connectionId = '123';

  test('on request should create a new connection if there isn`t an existing one and retain an existing state if there is one', () => {
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

  test('on received netsuite user roles should copy persist in state', () => {
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
  test('on failure netsuite user roles should copy persist in state', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        'Failed to retrieve'
      )
    );

    expect(state).toEqual({
      [connectionId]: { status: 'failed', message: 'Failed to retrieve' },
    });
  });
  test('on clear netsuite user roles should clear the message and status', () => {
    let state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRoles(connectionId)
    );

    state = reducer(
      undefined,
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        'Failed to retrieve'
      )
    );

    expect(state).toEqual({
      [connectionId]: { status: 'failed', message: 'Failed to retrieve' },
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

    expect(optionsArr).toEqual(
      ['production', 'sandbox'].map(env => ({ label: env, value: env }))
    );
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
});

/* global describe, test, expect */

import reducer from './';
import actions from '../../../actions';

describe('Connector metadata', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });

  test('should return empty state', () => {
    const fieldId = 'rest.headers';
    const id = 'id';
    const _integrationId = 1;
    const requestReducer = reducer(
      undefined,
      actions.connectors.refreshMetadata(fieldId, id, _integrationId)
    );

    //
    expect(requestReducer).toEqual({ '1': { id: { isLoading: true } } });
  });

  test('should show data for refreshed metadata', () => {
    const data = {
      id: 'account2',
      name: 'Account2',
    };
    const requestState = reducer(
      undefined,
      actions.metadata.request('id', 'rest.headers', '1')
    );
    const receivedState = reducer(
      requestState,
      actions.connectors.receivedMetadata(data, 'rest.headers', 'id', '1')
    );

    expect(receivedState).toEqual({
      '1': {
        id: {
          data,
          isLoading: false,
        },
      },
    });
  });

  test('should set isLoading to false when error occurs for refreshed metadata', () => {
    const type = 'rest.headers';
    const _integrationId = '123123';
    const requestState = reducer(
      undefined,
      actions.metadata.request('id', 'rest.headers', '1')
    );
    const receivedState = reducer(
      requestState,
      actions.connectors.failedMetadata(type, _integrationId)
    );

    expect(receivedState).toEqual({
      '123123': { 'rest.headers': { isLoading: false } },
    });
  });

  test('should set isLoading to false when error occurs for refreshed metadata', () => {
    const type = 'rest.headers';
    const _integrationId = '123123';
    const requestState = reducer(
      undefined,
      actions.metadata.request('id', 'rest.headers', '1')
    );
    const receivedState = reducer(
      requestState,
      actions.connectors.clearMetadata(type, _integrationId)
    );

    expect(receivedState).toEqual({
      '123123': { 'rest.headers': {} },
    });
  });
});

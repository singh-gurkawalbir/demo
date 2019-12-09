/* global describe, test, expect */

import reducer from './';
import actions from '../../../actions';

describe('Connector metadata', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });

  test('should return isLoading flag set to true when metdata request is sent', () => {
    const fieldId = 'rest.headers';
    const id = 'id';
    const _integrationId = 1;
    const requestReducer = reducer(
      undefined,
      actions.connectors.refreshMetadata(fieldId, id, _integrationId)
    );

    expect(requestReducer).toEqual({
      '1': { id: { fieldType: 'rest.headers', isLoading: true } },
    });
  });

  test('should store data received from  metadata request in the app redux store in expected format', () => {
    const exampleResponse = {
      id: 'account',
      name: 'Account',
    };
    const _integrationId = '123123';
    const requestState = reducer(
      undefined,
      actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
    );
    const receivedState = reducer(
      requestState,
      actions.connectors.receivedMetadata(
        exampleResponse,
        'id',
        'rest.headers',
        _integrationId
      )
    );

    expect(receivedState).toEqual({
      '123123': {
        'rest.headers': {
          data: { id: 'account', name: 'Account' },
          fieldType: 'id',
          isLoading: false,
        },
      },
    });
  });

  test('should not clear the existing metadata when new metadata is added', () => {
    const data = { dummy: 'data' };
    const state = {};
    const _integrationId = '123123';
    const requestState = reducer(
      state,
      actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
    );
    const receivedState1 = reducer(
      requestState,
      actions.connectors.receivedMetadata(
        data,
        'id',
        'rest.headers',
        _integrationId
      )
    );

    expect(receivedState1).toEqual({
      '123123': {
        'rest.headers': {
          data: { dummy: 'data' },
          fieldType: 'id',
          isLoading: false,
        },
      },
    });
    const requestState2 = reducer(
      requestState,
      actions.connectors.refreshMetadata(
        'id',
        'rest.secondField',
        _integrationId
      )
    );
    const receivedState2 = reducer(
      requestState2,
      actions.connectors.receivedMetadata(
        data,
        'id',
        'rest.secondField',
        _integrationId
      )
    );

    expect(receivedState2).toEqual({
      '123123': {
        'rest.headers': {
          data: { dummy: 'data' },
          fieldType: 'id',
          isLoading: false,
        },
        'rest.secondField': {
          data: { dummy: 'data' },
          fieldType: 'id',
          isLoading: false,
        },
      },
    });
  });

  test('should set isLoading to false when error occurs for metadata request', () => {
    const type = 'rest.headers';
    const _integrationId = '123123';
    const requestState = reducer(
      undefined,
      actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
    );
    const receivedState = reducer(
      requestState,
      actions.connectors.failedMetadata(type, _integrationId)
    );

    expect(receivedState).toEqual({
      '123123': { 'rest.headers': { isLoading: false } },
    });
  });

  describe('Connector metadata request clear functionality', () => {
    test('should clear the metadata when clearMetadata is called', () => {
      const type = 'rest.headers';
      const _integrationId = '123123';
      const requestState = reducer(
        undefined,
        actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
      );
      const receivedState = reducer(
        requestState,
        actions.connectors.clearMetadata(type, _integrationId)
      );

      expect(receivedState).toEqual({
        '123123': { 'rest.headers': {} },
      });
    });
    test('should not clear other field metadata when clearMetadata is called for one field', () => {
      const data = { dummy: 'data' };
      const state = {};
      const _integrationId = '123123';
      const requestState = reducer(
        state,
        actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
      );
      const receivedState1 = reducer(
        requestState,
        actions.connectors.receivedMetadata(
          data,
          'id',
          'rest.headers',
          _integrationId
        )
      );

      expect(receivedState1).toEqual({
        '123123': {
          'rest.headers': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
          },
        },
      });
      const requestState2 = reducer(
        requestState,
        actions.connectors.refreshMetadata(
          'id',
          'rest.secondField',
          _integrationId
        )
      );
      const receivedState2 = reducer(
        requestState2,
        actions.connectors.receivedMetadata(
          data,
          'id',
          'rest.secondField',
          _integrationId
        )
      );

      expect(receivedState2).toEqual({
        '123123': {
          'rest.headers': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
          },
          'rest.secondField': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
          },
        },
      });
      const receivedState = reducer(
        requestState,
        actions.connectors.clearMetadata('rest.headers', _integrationId)
      );

      expect(receivedState).toEqual({
        '123123': {
          'rest.headers': {},
          'rest.secondField': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
          },
        },
      });
    });
  });
});

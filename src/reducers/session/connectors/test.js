/* global describe, test, expect */

import reducer, {selectors} from '.';
import actions from '../../../actions';

describe('Connector metadata', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });

  test('should return isLoading flag set to true when metadata request is sent', () => {
    const fieldId = 'rest.headers';
    const id = 'id';
    const _integrationId = 1;
    const requestReducer = reducer(
      undefined,
      actions.connectors.refreshMetadata(fieldId, id, _integrationId)
    );

    expect(requestReducer).toEqual({
      1: { id: { fieldType: 'rest.headers', isLoading: true } },
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
      123123: {
        'rest.headers': {
          data: { id: 'account', name: 'Account' },
          fieldType: 'id',
          isLoading: false,
          shouldReset: true,
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
      123123: {
        'rest.headers': {
          data: { dummy: 'data' },
          fieldType: 'id',
          isLoading: false,
          shouldReset: true,
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
      123123: {
        'rest.headers': {
          data: { dummy: 'data' },
          fieldType: 'id',
          isLoading: false,
          shouldReset: true,
        },
        'rest.secondField': {
          data: { dummy: 'data' },
          fieldType: 'id',
          isLoading: false,
          shouldReset: true,
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
      123123: { 'rest.headers': { isLoading: false } },
    });
  });

  describe('Connector clearMetadata functionality', () => {
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
        123123: { 'rest.headers': {} },
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
        123123: {
          'rest.headers': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
            shouldReset: true,
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
        123123: {
          'rest.headers': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
            shouldReset: true,
          },
          'rest.secondField': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
            shouldReset: true,
          },
        },
      });
      const receivedState = reducer(
        requestState,
        actions.connectors.clearMetadata('rest.headers', _integrationId)
      );

      expect(receivedState).toEqual({
        123123: {
          'rest.headers': {},
          'rest.secondField': {
            data: { dummy: 'data' },
            fieldType: 'id',
            isLoading: false,
            shouldReset: true,
          },
        },
      });
    });
  });

  describe('Connector clearStatus functionality', () => {
    test('should clear the metadata when clearStatus is called', () => {
      const type = 'rest.headers';
      const _integrationId = '123123';
      const requestState = reducer(
        undefined,
        actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
      );
      const receivedState = reducer(
        requestState,
        actions.connectors.clearStatus(type, _integrationId)
      );

      expect(receivedState).toEqual({
        123123: { 'rest.headers': {fieldType: 'id', isLoading: false} },
      });
    });
    test('should not clear other field metadata when clearStatus is called for one field', () => {
      const data = { dummy: 'data' };
      let state = {};
      const _integrationId = '123123';
      const requestState = reducer(
        state,
        actions.connectors.refreshMetadata('id', 'rest.headers', _integrationId)
      );

      state = reducer(
        requestState,
        actions.connectors.receivedMetadata(
          data,
          'id',
          'rest.headers',
          _integrationId
        )
      );

      state = reducer(
        requestState,
        actions.connectors.refreshMetadata(
          'id',
          'rest.secondField',
          _integrationId
        )
      );
      state = reducer(
        state,
        actions.connectors.receivedMetadata(
          data,
          'id',
          'rest.secondField',
          _integrationId
        )
      );

      state = reducer(
        state,
        actions.connectors.clearStatus('rest.headers', _integrationId)
      );

      expect(state).toEqual({
        123123: {
          'rest.headers': {
            data: {
              dummy: 'data',
            },
            fieldType: 'id',
            isLoading: false,
            shouldReset: true,
          },
          'rest.secondField': {
            data: {
              dummy: 'data',
            },
            fieldType: 'id',
            isLoading: false,
            shouldReset: true,
          },
        },
      });
    });
  });

  describe('Connector publish functionality', () => {
    test('should not throw exception for bad params', () => {
      expect(() => { reducer(null, actions.connectors.publish.request()); }).not.toThrow();
      expect(() => { reducer(null, actions.connectors.publish.request(null)); }).not.toThrow();
      expect(() => { reducer(null, actions.connectors.publish.request(null, null)); }).not.toThrow();
      expect(() => { reducer({}, actions.connectors.publish.request(13, 1441, new Date())); }).not.toThrow();
      expect(() => { reducer({}, actions.connectors.publish.request()); }).not.toThrow();
    });

    test('should set publish status when publish request is sent', () => {
      const state = reducer({integrationId1: {some: 1}}, actions.connectors.publish.request('integrationId', true));

      expect(state).toEqual({
        integrationId1: {
          some: 1,
        },
        integrationId: {
          publishStatus: 'loading',
        },
      });
    });
    test('should set publish status to success when publish request is successful', () => {
      const state = reducer({integrationId1: {some: 1}}, actions.connectors.publish.success('integrationId'));

      expect(state).toEqual({
        integrationId1: {
          some: 1,
        },
        integrationId: {
          publishStatus: 'success',
        },
      });
    });

    test('should set publish status to errored when publish request fails', () => {
      const state = reducer({integrationId1: {some: 1}}, actions.connectors.publish.error('integrationId'));

      expect(state).toEqual({
        integrationId1: {
          some: 1,
        },
        integrationId: {
          publishStatus: 'error',
        },
      });
    });
  });
});

describe('Selectors test cases', () => {
  describe('selectors.connectorMetadata test cases', () => {
    test('should not throw exception for bad params', () => {
      expect(() => { selectors.connectorMetadata(); }).not.toThrow();
      expect(() => { selectors.connectorMetadata(null); }).not.toThrow();
      expect(() => { selectors.connectorMetadata(123); }).not.toThrow();
      expect(() => { selectors.connectorMetadata(null, null); }).not.toThrow();
      expect(() => { selectors.connectorMetadata(null, null, null); }).not.toThrow();
    });
    test('should return correct value when params are valid', () => {
      expect(selectors.connectorMetadata(null)).toEqual({ isLoading: false });
      expect(selectors.connectorMetadata({})).toEqual({ isLoading: false });
      expect(selectors.connectorMetadata({ integration: {} }, null, null, 'invalid')).toEqual({ isLoading: false });
      expect(selectors.connectorMetadata({
        integrationId: {
          'rest.headers': {
            value: 'someValue',
            isLoading: false,
            data: {
              field1: 'value1',
            },
          },
        },
      }, 'rest.headers', '', 'integrationId')).toEqual({
        isLoading: false,
        value: 'someValue',
        data: {
          field1: 'value1',
        },
      });
    });
  });
  describe('selectors.connectorFieldOptions test cases', () => {
    test('should not throw exception for bad params', () => {
      expect(() => { selectors.connectorFieldOptions(); }).not.toThrow();
      expect(() => { selectors.connectorFieldOptions(null); }).not.toThrow();
      expect(() => { selectors.connectorFieldOptions(123); }).not.toThrow();
      expect(() => { selectors.connectorFieldOptions({}); }).not.toThrow();
      expect(() => { selectors.connectorFieldOptions(null, null); }).not.toThrow();
    });
    test('should return correct value when params are valid', () => {
      expect(selectors.connectorFieldOptions(null)).toEqual({ isLoading: false });
      expect(selectors.connectorFieldOptions({})).toEqual({ isLoading: false });
      expect(selectors.connectorFieldOptions({ integration: {} }, null, null, 'invalid')).toEqual({ isLoading: false });
      expect(selectors.connectorFieldOptions({
        integrationId: {
          'rest.headers': {
            value: 'someValue',
            isLoading: false,
            data: {
              value: 'overrideValue',
              options: [['123', '123Label'], ['1234', '1234Label']],
            },
          },
        },
      }, 'rest.headers', '', 'integrationId')).toEqual({
        isLoading: false,
        options: [{
          label: '123Label',
          value: '123',
        }, {
          label: '1234Label',
          value: '1234',
        }],
        value: 'overrideValue',
      });
    });
    test('should return correct options using defaultOptions when options are not present in data', () => {
      expect(selectors.connectorFieldOptions({
        integrationId: {
          'rest.headers': {
            value: 'someValue',
            isLoading: false,
            data: {
              value: 'overrideValue',
            },
          },
        },
      }, 'rest.headers', '', 'integrationId', [{items: [{label: 'label', value: 'value'}]}])).toEqual({
        isLoading: false,
        options: [{
          label: 'label',
          value: 'value',
        }],
        value: 'overrideValue',
      });
    });
  });
  describe('selectors.connectorPublishStatus test cases', () => {
    test('should not throw exception for bad params', () => {
      expect(() => { selectors.connectorPublishStatus(); }).not.toThrow();
      expect(() => { selectors.connectorPublishStatus(null); }).not.toThrow();
      expect(() => { selectors.connectorPublishStatus(123); }).not.toThrow();
      expect(() => { selectors.connectorPublishStatus({}); }).not.toThrow();
    });

    test('should return correct status for valid integrationId', () => {
      expect(selectors.connectorPublishStatus({integrationId: {publishStatus: 'success'}}, 'integrationId')).toEqual('success');
      expect(selectors.connectorPublishStatus({integrationId: {publishStatus: 'error'}}, 'integrationId')).toEqual('error');
      expect(selectors.connectorPublishStatus({integrationId: {publishStatus: 'loading'}}, 'integrationId')).toEqual('loading');
      expect(selectors.connectorPublishStatus({integrationId1: {publishStatus: 'loading'}}, 'integration')).toEqual('failed');
    });
  });
});

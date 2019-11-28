/* global describe, test, expect */
import moment from 'moment';
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('marketplace reducers', () => {
  describe('connectors received action', () => {
    const testConnectors = [{ _id: '123' }, { _id: '456' }];
    const updatedTestConnectors = [{ _id: '789' }, { _id: '432' }];

    test('should store connectors succesfully on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      );

      expect(state.connectors).toEqual(testConnectors);
    });
    test('should replace existing connectors on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      );

      expect(state.connectors).toEqual(testConnectors);
      const newState = reducer(
        state,
        actions.marketplace.receivedConnectors({
          connectors: updatedTestConnectors,
        })
      );

      expect(newState.connectors).toEqual(updatedTestConnectors);
    });
  });
  describe('templates received action', () => {
    const testTemplates = [{ _id: '123' }, { _id: '456' }];
    const updatedTestTemplates = [{ _id: '789' }, { _id: '432' }];

    test('should store templates succesfully on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedTemplates({ templates: testTemplates })
      );

      expect(state.templates).toEqual(testTemplates);
    });
    test('should replace existing templates on state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedTemplates({ templates: testTemplates })
      );

      expect(state.templates).toEqual(testTemplates);
      const newState = reducer(
        state,
        actions.marketplace.receivedTemplates({
          templates: updatedTestTemplates,
        })
      );

      expect(newState.templates).toEqual(updatedTestTemplates);
    });
  });
});

describe('marketplace selectors', () => {
  describe('connectors', () => {
    const testConnectors = [
      { _id: '123', applications: ['some application'] },
      { _id: '456', applications: ['some application'] },
    ];
    const licenses = [
      {
        expires: moment()
          .subtract(1, 'days')
          .toISOString(),
        type: 'connector',
        _connectorId: '456',
      },
      {
        expires: moment()
          .add(1, 'days')
          .toISOString(),
        type: 'connector',
        _connectorId: '123',
      },
    ];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.connectors(undefined)).toEqual([]);
      expect(selectors.connectors({})).toEqual([]);
    });
    test('should return connectors on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      );

      expect(
        selectors.connectors(state, 'some application', false, licenses)
      ).toEqual([
        { _id: '123', applications: ['some application'], canInstall: true },
        { _id: '456', applications: ['some application'], canInstall: false },
      ]);
    });
  });
  describe('templates', () => {
    const testTemplates = [
      { _id: '123' },
      { _id: '456', applications: ['some application'] },
    ];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.templates(undefined)).toEqual([]);
      expect(selectors.templates({})).toEqual([]);
    });
    test('should return templates on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketplace.receivedTemplates({ templates: testTemplates })
      );

      expect(selectors.templates(state, 'some application')).toEqual([
        state.templates[1],
      ]);
    });
  });
});

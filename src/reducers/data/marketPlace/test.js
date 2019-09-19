/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('marketplace reducers', () => {
  describe('connectors received action', () => {
    const testConnectors = [{ _id: '123' }, { _id: '456' }];
    const updatedTestConnectors = [{ _id: '789' }, { _id: '432' }];

    test('should store connectors succesfully on state', () => {
      const state = reducer(
        undefined,
        actions.marketPlace.receivedConnectors({ connectors: testConnectors })
      );

      expect(state.connectors).toEqual(testConnectors);
    });
    test('should replace existing connectors on state', () => {
      const state = reducer(
        undefined,
        actions.marketPlace.receivedConnectors({ connectors: testConnectors })
      );

      expect(state.connectors).toEqual(testConnectors);
      const newState = reducer(
        state,
        actions.marketPlace.receivedConnectors({
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
        actions.marketPlace.receivedTemplates({ templates: testTemplates })
      );

      expect(state.templates).toEqual(testTemplates);
    });
    test('should replace existing templates on state', () => {
      const state = reducer(
        undefined,
        actions.marketPlace.receivedTemplates({ templates: testTemplates })
      );

      expect(state.templates).toEqual(testTemplates);
      const newState = reducer(
        state,
        actions.marketPlace.receivedTemplates({
          templates: updatedTestTemplates,
        })
      );

      expect(newState.templates).toEqual(updatedTestTemplates);
    });
  });
});

describe('marketplace selectors', () => {
  describe('connectors', () => {
    const testConnectors = [{ _id: '123' }, { _id: '456' }];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.connectors(undefined)).toEqual([]);
      expect(selectors.connectors({})).toEqual([]);
    });
    test('should return connectors on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketPlace.receivedConnectors({ connectors: testConnectors })
      );

      expect(selectors.connectors(state)).toEqual(state.connectors);
    });
  });
  describe('templates', () => {
    const testTemplates = [{ _id: '123' }, { _id: '456' }];

    test('should return empty array on empty/undefined state', () => {
      expect(selectors.templates(undefined)).toEqual([]);
      expect(selectors.templates({})).toEqual([]);
    });
    test('should return templates on valid state', () => {
      const state = reducer(
        undefined,
        actions.marketPlace.receivedTemplates({ templates: testTemplates })
      );

      expect(selectors.templates(state)).toEqual(state.templates);
    });
  });
});

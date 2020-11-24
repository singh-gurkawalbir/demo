/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('sampleData reducers', () => {
  describe('random action', () => {
    test('should return previous state if action is not handled.', () => {
      const unknownAction = { type: 'unknown' };
      const originalState = {i2: {status: 'received', data: []}};
      const newState = reducer(originalState, unknownAction);

      expect(newState).toEqual(originalState);
    });
  });

  describe('iaMetadataRequest action', () => {
    test('should set requested property on import in the state', () => {
      const _importId = 'i1';
      const originalState = {};
      const expectedState = {
        i1: {status: 'requested'},
      };
      const state = reducer(
        originalState,
        actions.importSampleData.iaMetadataRequest({ _importId })
      );

      expect(state).toEqual(expectedState);
    });
  });

  describe('iaMetadataReceived action', () => {
    test('should set received property and data on import in the state', () => {
      const _importId = 'i1';
      const originalState = {};
      const metadata = [{id: 'id', name: 'name'}];
      const expectedState = {
        i1: {status: 'received', data: metadata},
      };
      const state = reducer(
        originalState,
        actions.importSampleData.iaMetadataReceived({ _importId, metadata })
      );

      expect(state).toEqual(expectedState);
    });
    test('should update received property on a given import and not corrupt others in the state', () => {
      const _importId = 'i1';
      const originalState = {i2: {status: 'received', data: []}};
      const metadata = [{id: 'id', name: 'name'}];
      const expectedState = {
        i1: {status: 'received', data: metadata},
        i2: {status: 'received', data: []},
      };
      const state = reducer(
        originalState,
        actions.importSampleData.iaMetadataReceived({ _importId, metadata })
      );

      expect(state).toEqual(expectedState);
    });
  });

  describe('integrationAppImportMetadata selectors', () => {
    test('should return empty object when state is undefined', () => {
      expect(selectors.integrationAppImportMetadata(undefined)).toEqual({});
    });
    test('should return integrationAppImportMetadata for valid state', () => {
      const _importId = 'i1';
      const originalState = {i2: {status: 'received', data: []}};
      const metadata = [{id: 'id', name: 'name'}];
      const expectedState = {
        i1: {status: 'received', data: metadata},
        i2: {status: 'received', data: []},
      };
      const state = reducer(
        originalState,
        actions.importSampleData.iaMetadataReceived({ _importId, metadata })
      );

      expect(selectors.integrationAppImportMetadata(state, _importId)).toEqual(expectedState[_importId]);
    });
  });
});

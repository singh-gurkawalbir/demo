/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('errorManagement metadata reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(undefined, { type: undefined })).toEqual({});
    expect(reducer(undefined, { type: null })).toEqual({});
  });
  describe('errorManagement metadata reducer', () => {
    describe('actionTypes.ERROR_MANAGER.FILTER_METADATA.REQUEST action', () => {
      test('should update status to requested', () => {
        const state = reducer({}, actions.errorManager.filterMetadata.request());

        expect(state).toEqual({status: 'requested'});
      });
    });
    describe('actionTypes.ERROR_MANAGER.FILTER_METADATA.RECEIVED action', () => {
      test('should update status to received and update data as empty object if not passed', () => {
        const requestState = reducer({}, actions.errorManager.filterMetadata.request());
        const finalState = reducer(requestState, actions.errorManager.filterMetadata.received());

        expect(finalState).toEqual({status: 'received', data: {}});
      });
      test('should update status to received and update data as with formatted object with filter types as keys and enums as values', () => {
        const mockMetadata = [{
          name: 'source',
          enums: ['internal', 'application', 'connection'],
        },
        {
          name: 'classification',
          enums: ['connection', 'duplicate', 'governance'],
        }];
        const formattedMetadata = {
          source: ['internal', 'application', 'connection'],
          classification: ['connection', 'duplicate', 'governance'],
        };
        const requestState = reducer({}, actions.errorManager.filterMetadata.request());
        const finalState = reducer(requestState, actions.errorManager.filterMetadata.received(mockMetadata));

        expect(finalState).toEqual({status: 'received', data: formattedMetadata});
      });
    });
  });
  describe('selectors', () => {
    describe('isErrorFilterMetadataRequested selector', () => {
      test('should return false if the state is empty', () => {
        expect(selectors.isErrorFilterMetadataRequested()).toBeFalsy();
        expect(selectors.isErrorFilterMetadataRequested(null)).toBeFalsy();
      });
      test('should return false if the state does not contain any status', () => {
        expect(selectors.isErrorFilterMetadataRequested({})).toBeFalsy();
      });
      test('should return true if the state contain any status (requested/received)', () => {
        expect(selectors.isErrorFilterMetadataRequested({ status: 'requested'})).toBeTruthy();
        expect(selectors.isErrorFilterMetadataRequested({ status: 'received', data: { source: [], classification: [] }})).toBeTruthy();
      });
    });
    describe('getSourceMetadata selector', () => {
      const metadata = {
        source: ['internal', 'application', 'connection'],
      };

      test('should return undefined if the state is invalid or does not contain source', () => {
        expect(selectors.getSourceMetadata()).toBeUndefined();
        expect(selectors.getSourceMetadata({})).toBeUndefined();
        expect(selectors.getSourceMetadata({ status: 'requested' })).toBeUndefined();
        expect(selectors.getSourceMetadata({ status: 'received', data: {} })).toBeUndefined();
      });
      test('should return source list from the state', () => {
        expect(selectors.getSourceMetadata({ status: 'received', data: metadata })).toBe(metadata.source);
      });
    });
    describe('getClassificationMetadata selector', () => {
      const metadata = {
        classification: ['connection', 'duplicate', 'governance'],
      };

      test('should return undefined if the state is invalid or does not contain classification', () => {
        expect(selectors.getClassificationMetadata()).toBeUndefined();
        expect(selectors.getClassificationMetadata({})).toBeUndefined();
        expect(selectors.getClassificationMetadata({ status: 'requested' })).toBeUndefined();
        expect(selectors.getClassificationMetadata({ status: 'received', data: {} })).toBeUndefined();
      });
      test('should return classification list from the state', () => {
        expect(selectors.getClassificationMetadata({ status: 'received', data: metadata })).toBe(metadata.classification);
      });
    });
  });
});

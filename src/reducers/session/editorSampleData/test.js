/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

const resourceId = '123';
const flowId = 'flow-123';
const fieldType = 'file.xml';
const sampleData = { data: {dummy: 'sample'}};

describe('editorSampleData reducer', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('EDITOR_SAMPLE_DATA.REQUEST action', () => {
    test('should replace the state with status = requested', () => {
      const expectedState = { [resourceId]: {[flowId]: {[fieldType]: { status: 'requested' }}} };
      const newState = reducer(
        undefined,
        actions.editorSampleData.request({ flowId, resourceId, fieldType })
      );

      expect(newState).toEqual(expectedState);
    });

    test('should not alter other sibling state entries', () => {
      const initialState = {
        [resourceId]: {[flowId]: {}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const expectedState = {
        [resourceId]: {[flowId]: {[fieldType]: { status: 'requested' }}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const newState = reducer(
        initialState,
        actions.editorSampleData.request({ flowId, resourceId, fieldType })
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('EDITOR_SAMPLE_DATA.RECEIVED action', () => {
    test('should return previous state if resource state doesnt exist', () => {
      const initialState = {
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };

      const newState = reducer(
        initialState,
        actions.editorSampleData.received({
          flowId,
          resourceId,
          fieldType,
          sampleData,
          templateVersion: 1,
        })
      );

      expect(newState).toEqual(initialState);
    });

    test('should update state with sample data and set status as received', () => {
      const expectedState = { [resourceId]: {[flowId]: {[fieldType]: { data: sampleData, templateVersion: 1, status: 'received' }}} };

      const initialState = reducer(
        undefined,
        actions.editorSampleData.request({ flowId, resourceId, fieldType })
      );
      const newState = reducer(
        initialState,
        actions.editorSampleData.received({
          flowId,
          resourceId,
          fieldType,
          sampleData,
          templateVersion: 1,
        })
      );

      expect(newState).toEqual(expectedState);
    });

    test('should not alter other sibling state entries', () => {
      const initialState = {
        [resourceId]: {[flowId]: {[fieldType]: { status: 'requested' }}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const expectedState = {
        [resourceId]: {[flowId]: {[fieldType]: { data: sampleData, templateVersion: 1, status: 'received' }}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const newState = reducer(
        initialState,
        actions.editorSampleData.received({
          flowId,
          resourceId,
          fieldType,
          sampleData,
          templateVersion: 1,
        })
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('EDITOR_SAMPLE_DATA.FAILED action', () => {
    test('should replace the state with status = failed', () => {
      const initialState = { [resourceId]: {[flowId]: {[fieldType]: { status: 'requested' }}} };
      const expectedState = { [resourceId]: {[flowId]: {[fieldType]: { status: 'failed' }}} };
      const newState = reducer(
        initialState,
        actions.editorSampleData.failed({ flowId, resourceId, fieldType })
      );

      expect(newState).toEqual(expectedState);
    });

    test('should not alter other sibling state entries', () => {
      const initialState = {
        [resourceId]: {[flowId]: {}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const expectedState = {
        [resourceId]: {[flowId]: {[fieldType]: { status: 'failed' }}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const newState = reducer(
        initialState,
        actions.editorSampleData.failed({ flowId, resourceId, fieldType })
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('EDITOR_SAMPLE_DATA.CLEAR action', () => {
    test('should delete complete resource state if no flow id is passed', () => {
      const initialState = {
        [resourceId]: {
          [flowId]: {[fieldType]: { status: 'failed' }},
          'flow-2': {field1: {status: 'received'}},
        },
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const expectedState = {
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };

      const newState = reducer(
        initialState,
        actions.editorSampleData.clear({ resourceId })
      );

      expect(newState).toEqual(expectedState);
    });

    test('should delete all flow ids state if flow id is passed', () => {
      const initialState = {
        [resourceId]: {
          [flowId]: {[fieldType]: { status: 'failed' }},
          'flow-2': {field1: {status: 'received'}},
        },
        456: {
          [flowId]: {[fieldType]: { status: 'failed' }},
          'flow-2': {field1: {status: 'received'}},
        },
        789: { status: 'received', scriptId: '888' },
      };
      const expectedState = {
        [resourceId]: {
          'flow-2': {field1: {status: 'received'}},
        },
        456: { 'flow-2': {field1: {status: 'received'}} },
        789: { status: 'received', scriptId: '888' },
      };

      const newState = reducer(
        initialState,
        actions.editorSampleData.clear({ flowId })
      );

      expect(newState).toEqual(expectedState);
    });

    test('should not alter other sibling state entries', () => {
      const initialState = {
        [resourceId]: {[flowId]: {}},
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const expectedState = {
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const newState = reducer(
        initialState,
        actions.editorSampleData.clear({ resourceId })
      );

      expect(newState).toEqual(expectedState);
    });
  });
});

describe('editorSampleData selectors', () => {
  describe('editorSampleData', () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.editorSampleData(undefined, { flowId, resourceId, fieldType })).toEqual(
        {}
      );
      expect(selectors.editorSampleData({}, { flowId, resourceId, fieldType })).toEqual({});
    });

    test('should return correct state when a match is found.', () => {
      const expectedState = { data: sampleData, templateVersion: 1, status: 'received' };
      const initialState = reducer(
        undefined,
        actions.editorSampleData.request({ flowId, resourceId, fieldType })
      );
      const newState = reducer(
        initialState,
        actions.editorSampleData.received({
          flowId,
          resourceId,
          fieldType,
          sampleData,
          templateVersion: 1,
        })
      );

      expect(selectors.editorSampleData(newState, { flowId, resourceId, fieldType })).toEqual(expectedState);
    });
  });
});

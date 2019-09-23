/* global describe, test, expect */

import { reducer } from './';

/*
 * Actions to test :
 * UPDATE_FIELD, REMOVE, UPDATE_SETTING
 */
describe('Mappings', () => {
  const setChangeIdentifier = () => {};

  test('Invalid action should not impact current state', () => {
    const state = reducer([], { type: 'RANDOM_ACTION' });

    expect(state).toMatchObject([]);
  });

  describe('REST Import Mapping', () => {
    test('Update field action should properly set generate value', () => {
      const mappingReducer = reducer([], {
        type: 'UPDATE_FIELD',
        index: 0,
        field: 'generate',
        value: 'abcd',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([{ generate: 'abcd' }]);
    });

    test('Update field action should properly update generate value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 0,
        field: 'generate',
        value: 'newGenerate',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'newGenerate' },
        { extract: 'm2', generate: 'abc2' },
      ]);
    });

    test('Update field action should properly update extract value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'extract',
        value: 'dummy',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'dummy', generate: 'abc2' },
      ]);
    });

    test('Hardcoding extract field following a pattern("text") should properly update extract value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'extract',
        value: '"myName"',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'myName', hardCodedValueTmp: '"myName"' },
      ]);
    });
    test('Hardcoding extract field following a pattern("text), i.e., text with missing closing quote, should properly update extract value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'extract',
        value: '"aa',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'aa', hardCodedValueTmp: '"aa"' },
      ]);
    });

    test('Updating extract field with empty string should not update extract value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'extract',
        value: '',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ]);
    });

    test('Updating generate field with empty string should properly update generate value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'generate',
        value: '',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: '' },
      ]);
    });

    test('Update field action should properly update hardcoded value', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'extract',
        value: '"qwerty',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        {
          hardCodedValue: 'qwerty',
          hardCodedValueTmp: '"qwerty"',
          generate: 'abc2',
        },
      ]);
    });
    // Case when user tries to change hardcoded value to extract value
    test('Update field action for changing generate value to hardcoded value should work as expected', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_FIELD',
        index: 1,
        field: 'extract',
        value: 'dummy',
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'dummy', generate: 'abc2' },
      ]);
    });

    test('Remove action should properly remove mapping from list', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'REMOVE',
        index: 1,
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
      ]);
    });

    test('Updating settings to mapping', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_SETTING',
        index: 1,
        value: {
          dataType: 'string',
          discardIfEmpty: true,
          hardCodedValue: 'text',
          generate: 'abc2',
        },
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        {
          hardCodedValueTmp: '"text"',
          generate: 'abc2',
          dataType: 'string',
          discardIfEmpty: true,
          hardCodedValue: 'text',
        },
      ]);
    });

    test('Update setting action should properly update mapping', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_SETTING',
        index: 1,
        value: {
          dataType: 'string',
          discardIfEmpty: true,
          hardCodedValue: 'text',
          generate: 'abc2',
        },
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        {
          hardCodedValueTmp: '"text"',
          generate: 'abc2',
          dataType: 'string',
          discardIfEmpty: true,
          hardCodedValue: 'text',
        },
      ]);
    });

    test('Update setting action with invalid index should not update mapping', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_SETTING',
        index: 2,
        value: {
          dataType: 'string',
          discardIfEmpty: true,
          hardCodedValue: 'text',
          generate: 'abc2',
        },
        setChangeIdentifier,
        lastRowData: {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ]);
    });

    test('Update setting action should properly update lookup in mapping', () => {
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'UPDATE_SETTING',
        index: 1,
        value: {
          generate: 'qq2',
          discardIfEmpty: true,
          immutable: true,
          lookupName: 'b5173e06-7791-4a5a-bb83-897856dd36d6',
        },
        setChangeIdentifier,
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        {
          generate: 'qq2',
          discardIfEmpty: true,
          immutable: true,
          lookupName: 'b5173e06-7791-4a5a-bb83-897856dd36d6',
        },
      ]);
    });
  });
});

// TODO (Aditya) more test cases to be added

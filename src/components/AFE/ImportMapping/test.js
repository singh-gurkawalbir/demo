/* global describe, test, expect */

import { reducer } from './';

/*
 * Actions to test :
 * UPDATE_FIELD, REMOVE, UPDATE_SETTING
 */
describe('Mappings', () => {
  test('Check for invalid action impact on Mapping reducer', () => {
    const state = reducer([], { type: 'RANDOM_ACTION' });

    expect(state).toMatchObject([]);
  });

  describe('REST Import Mapping', () => {
    test('Check for generate Field change in empty array', () => {
      const setChangeIdentifier = () => {};
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

    test('Check for generate Field change at given position', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'newGenerate' },
        { extract: 'm2', generate: 'abc2' },
      ]);
    });

    test('Check for extract Field change', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'dummy', generate: 'abc2' },
      ]);
    });

    test('Check for extract Field change for hardcoding with starting and end quotes(")', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'myName', hardCodedValueTmp: '"myName"' },
      ]);
    });
    test('Check for extract Field change for hardcoding without entering closing quotes(")', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'aa', hardCodedValueTmp: '"aa"' },
      ]);
    });

    test('Case where user tries to set empty extract value to already set field  ', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: 'abc2' },
      ]);
    });

    test('Case when user tries to set empty generate value to already set field  ', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'm2', generate: '' },
      ]);
    });

    test('Case when user tries to change hardcoded value', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
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
    test('Case when user tries to change hardcoded value to extract value', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { extract: 'dummy', generate: 'abc2' },
      ]);
    });

    test('Removing mapping from list', () => {
      const setChangeIdentifier = () => {};
      const mapping = [
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ];
      const mappingReducer = reducer(mapping, {
        type: 'REMOVE',
        index: 1,
        setChangeIdentifier,
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
      ]);
    });

    test('Updating settings to mapping', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
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

    test('Updating settings to mapping', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
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

    test('Updating settings to mapping with invalid index', () => {
      const setChangeIdentifier = () => {};
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
        lastRowData: (mapping || []).length ? mapping[mapping.length - 1] : {},
      });

      expect(mappingReducer).toMatchObject([
        { extract: 'm1', generate: 'abc1' },
        { hardCodedValue: 'm2', hardCodedValueTmp: '"m2"', generate: 'abc2' },
      ]);
    });

    test('Updating settings to mapping with additional keys', () => {
      const setChangeIdentifier = () => {};
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

// TODO (Aditya) test cases to be added

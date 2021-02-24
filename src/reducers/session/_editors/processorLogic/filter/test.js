/* global describe, test, expect, beforeEach */

import processorLogic from './index';

const {
  requestBody,
  validate,
  processResult,
} = processorLogic;

describe('filter processor logic', () => {
  let editor;

  beforeEach(() => {
    editor = {
      id: 'eFilter',
      stage: 'exportFilter',
      resourceId: '99999',
      resourceType: 'exports',
      data: '{"record": {"id": 123}}',
      rule: ['equals', ['string', ['extract', 'id']], '456'],
    };
  });

  describe('requestBody util', () => {
    test('should correctly return the body if editor data is of string type', () => {
      const expectedBody = {
        rules: { version: '1', rules: ['equals', ['string', ['extract', 'id']], '456'] },
        data: [{id: 123}],
        options: { contextData: {} },
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
    test('should correctly return the request body if editor data is of record object type', () => {
      editor.data = {
        record: {
          name: 'Bob',
        },
      };
      const expectedBody = {
        rules: { version: '1', rules: ['equals', ['string', ['extract', 'id']], '456'] },
        data: [{name: 'Bob'}],
        options: { contextData: {} },
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
    test('should correctly return the request body if editor data contains rows', () => {
      editor.data = {
        rows: [{
          id: 123,
          name: 'Bob',
        },
        {
          id: 123,
          name: 'Bob',
        }],
      };
      const expectedBody = {
        rules: { version: '1', rules: ['equals', ['string', ['extract', 'id']], '456'] },
        data: [{id: 123, name: 'Bob'}],
        options: { contextData: {} },
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should correctly return dataError when data is invalid', () => {
      editor.data = 'invalid data';
      const expectedOutput = {
        dataError: 'Unexpected token i in JSON at position 0',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should correctly return ruleError when rule is invalid', () => {
      editor.isInvalid = true;
      const expectedOutput = {
        dataError: null,
        ruleError: 'Invalid rule',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
  });
  describe('processResult util', () => {
    test('should return true output message when the result contains some data', () => {
      const result = {
        data: [{
          record: {
            id: 123,
          },
        }],
      };

      expect(processResult(editor, result)).toEqual({data: 'TRUE: record will be processed'});
    });
    test('should return false output message when the result does not contain data', () => {
      const result = {
        data: [],
      };

      expect(processResult(editor, result)).toEqual({data: 'FALSE: record will be ignored/discarded'});
    });
  });
});

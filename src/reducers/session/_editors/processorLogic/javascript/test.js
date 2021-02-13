/* global describe, test, expect, beforeEach */

import processorLogic from './index';

const {
  requestBody,
  validate,
  dirty,
} = processorLogic;

describe('javascript processor logic', () => {
  let editor;

  beforeEach(() => {
    editor = {
      id: 'js-99999',
      stage: 'script',
      resourceId: '99999',
      resourceType: 'exports',
      data: '{"id": 123}',
      rule: {
        entryFunction: 'someFunc',
        fetchScriptContent: true,
        code: 'some code',
        _init_code: 'some code',
      },
      originalRule: {
        entryFunction: 'someFunc',
        fetchScriptContent: true,
      },
    };
  });

  describe('requestBody util', () => {
    test('should correctly return the body if editor data is of string type', () => {
      const expectedBody = {
        rules: {
          function: 'someFunc',
          code: 'some code',
        },
        data: {id: 123},
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
    test('should correctly return the request body if editor data if of object type', () => {
      editor.data = {
        name: 'Bob',
      };
      const expectedBody = {
        rules: {
          function: 'someFunc',
          code: 'some code',
        },
        data: {name: 'Bob'},
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should correctly return dataError when data is invalid', () => {
      delete editor.data;
      const expectedOutput = {
        dataError: 'Must provide some sample data.',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should return true if original code is different from new code', () => {
      editor.rule.code = 'new code';
      expect(dirty(editor)).toEqual(true);
    });
    test('should return true if original rule is different from new rule', () => {
      editor.rule.entryFunction = 'new function';
      expect(dirty(editor)).toEqual(true);
    });
    test('should return false if no changes to rule has been made', () => {
      expect(dirty(editor)).toEqual(false);
    });
  });
});

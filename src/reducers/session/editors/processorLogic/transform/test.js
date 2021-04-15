/* global describe, test, expect, beforeEach */

import processorLogic from './index';

const {
  requestBody,
  validate,
  dirty,
  preSaveValidate,
} = processorLogic;

describe('transform processor logic', () => {
  let editor;

  beforeEach(() => {
    editor = {
      id: 'tx-99999',
      stage: 'transform',
      resourceId: '99999',
      resourceType: 'exports',
      data: '{"id": 123}',
      rule: [{
        extract: 'id',
        generate: 'new-id',
      },
      {
        extract: 'name',
        generate: 'new-name',
      }],
      originalRule: [{
        extract: 'id',
        generate: 'new-id',
      },
      {
        extract: 'name',
        generate: 'new-name',
      }],
    };
  });

  describe('requestBody util', () => {
    test('should correctly return the body if editor data is of string type', () => {
      const expectedBody = {
        rules: { version: '1',
          rules: [[{
            extract: 'id',
            generate: 'new-id',
          },
          {
            extract: 'name',
            generate: 'new-name',
          }]],
        },
        data: [{id: 123}],
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
    test('should correctly return the request body if editor data if of object type', () => {
      editor.data = {
        name: 'Bob',
      };
      const expectedBody = {
        rules: { version: '1',
          rules: [[{
            extract: 'id',
            generate: 'new-id',
          },
          {
            extract: 'name',
            generate: 'new-name',
          }]] },
        data: [{name: 'Bob'}],
      };

      expect(requestBody(editor)).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should correctly return dataError when data is invalid', () => {
      editor.data = 'invalid data';
      const expectedOutput = {
        dataError: 'Unexpected token i in JSON at position 0',
        ruleError: false,
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
    test('should correctly return ruleError when rule is invalid', () => {
      delete editor.rule[0].generate;
      const expectedOutput = {
        dataError: null,
        ruleError: 'generate field missing at position 0',
      };

      expect(validate(editor)).toEqual(expectedOutput);
    });
  });
  describe('dirty util', () => {
    test('should return true if original rule is different from new rule', () => {
      editor.rule[0].generate = 'changed-id';
      expect(dirty(editor)).toEqual(true);
    });
    test('should return false if no changes to rule has been made', () => {
      expect(dirty(editor)).toEqual(false);
    });
  });
  describe('preSaveValidate util', () => {
    test('should return save error as true if duplicate generate keys are present', () => {
      editor.rule[0].generate = 'new-name';
      expect(preSaveValidate(editor)).toEqual({saveError: true, message: 'You have duplicate mappings for the field(s): new-name'});
    });
    test('should return save error as false if no duplicate generate keys are present', () => {
      expect(preSaveValidate(editor)).toEqual({saveError: false});
    });
  });
});

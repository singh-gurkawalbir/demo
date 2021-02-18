/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  requestBody,
  validate,
  processResult,
} = processorLogic;

describe('xmlParser processor logic', () => {
  describe('init util', () => {
    test('should return passed rule if it already exists in options', () => {
      const options = {
        fieldId: 'file.xml',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: {
          stripNewLineChars: true,
          trimSpaces: true,
        },
      };

      expect(init({options})).toEqual(options);
    });
    test('should generate and return the rule along with passed options if not present in options', () => {
      const fieldState = {
        disabled: false,
        value: [{
          rules: {
            stripNewLineChars: true,
            trimSpaces: true,
            V0_json: true,
            listNodes: ['a', 'b'],
          },

        }],
      };
      const options = {
        fieldId: 'file.xml',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'exports',
      };
      const expectedOptions = {
        fieldId: 'file.xml',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'exports',
        rule: {
          stripNewLineChars: true,
          trimSpaces: true,
          V0_json: true,
          listNodes: ['a', 'b'],
        },
      };

      expect(init({options, fieldState})).toEqual(expectedOptions);
    });
  });

  describe('requestBody util', () => {
    test('should return the correct data and rule object with options when V0_json is false', () => {
      const rule = {
        V0_json: false,
        stripNewLineChars: true,
        listNodes: ['a', 'b'],
      };
      const data = '<xml>some body</xml>';

      const expectedBody = {
        rules: {
          doc: {
            parsers: [
              {
                type: 'xml',
                version: 1,
                rules: {
                  V0_json: false,
                  stripNewLineChars: true,
                  listNodes: ['a', 'b'],
                },
              },
            ],
          },
        },
        data: '<xml>some body</xml>',
        options: { isSimplePath: true },
      };

      expect(requestBody({rule, data})).toEqual(expectedBody);
    });
    test('should return the correct data and rule object with options when V0_json is undefined', () => {
      const rule = {
        stripNewLineChars: true,
        listNodes: ['a', 'b'],
      };
      const data = '<xml>some body</xml>';

      const expectedBody = {
        rules: {
          doc: {
            parsers: [
              {
                type: 'xml',
                version: 1,
                rules: {
                  V0_json: true,

                },
              },
            ],
          },
        },
        data: '<xml>some body</xml>',
        options: { isSimplePath: true },
      };

      expect(requestBody({rule, data})).toEqual(expectedBody);
    });
  });

  describe('validate util', () => {
    test('should return data error if data is invalid', () => {
      const editor = {
        editorType: 'xmlParser',
        formKey: 'new-123',
        stage: 'flowInput',
      };

      expect(validate(editor)).toEqual({dataError: 'Must provide some sample data.'});
    });
  });
  describe('processResult util', () => {
    test('should return passed result without modifying if isSuiteScriptData is true', () => {
      const result = {
        data: [{id: 123}],
      };

      expect(processResult({isSuiteScriptData: true}, result)).toBe(result);
    });
    test('should update and return the correctly wrapped result', () => {
      const result = {
        data: [{id: 123}],
      };
      const expectedResult = {
        data: [{
          page_of_records: [
            {record: {id: 123}},
          ],
        }],
      };

      expect(processResult({}, result)).toEqual(expectedResult);
    });
  });
});

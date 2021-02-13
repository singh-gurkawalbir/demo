/* global describe, test, expect */

import processorLogic from './index';

const {
  validate,
  requestBody,
  init,
} = processorLogic;

describe('csvGenerator processor logic', () => {
  describe('init util', () => {
    test('should return passed rule if it already exists in options', () => {
      const options = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        rule: {
          columnDelimiter: '\n',
          trimSpaces: true,
        },
      };

      expect(init({options})).toEqual(options);
    });
    test('should generate and return the rule along with passed options if not present in options', () => {
      const fieldState = {
        disabled: false,
        value: {
          columnDelimiter: '\n',
          includeHeader: true,
        },
      };
      const options = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const expectedOptions = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: {
          columnDelimiter: '\n',
          includeHeader: true,
          resourceId: 'res-123',
          resourceType: 'imports',
        },
      };

      expect(init({options, fieldState})).toEqual(expectedOptions);
    });
    test('should generate and return the rule along with passed options with customHeaderRows if resource is of HTTPImport type', () => {
      const fieldState = {
        disabled: false,
        value: {
          columnDelimiter: '\n',
          includeHeader: true,
          customHeaderRows: ['a', 'b'],
        },
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'HTTPImport',
      };
      const options = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const expectedOptions = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: {
          columnDelimiter: '\n',
          includeHeader: true,
          resourceId: 'res-123',
          resourceType: 'imports',
          customHeaderRows: 'a\nb',
        },
      };

      expect(init({resource, options, fieldState})).toEqual(expectedOptions);
    });
  });
  describe('requestBody util', () => {
    test('should return the correct data and rule object', () => {
      const rule = {
        columnDelimiter: '\t',
        includeHeader: true,
        replaceNewlineWithSpace: false,
        rowDelimiter: '↵',
        wrapWithQuotes: false,
      };
      const data = '{"batch_of_records": {}}';

      const expectedBody = {
        rules: {
          columnDelimiter: '\t',
          includeHeader: true,
          replaceNewlineWithSpace: false,
          rowDelimiter: '↵',
          wrapWithQuotes: false,
        },
        data: [{batch_of_records: {}}],
      };

      expect(requestBody({rule, data})).toEqual(expectedBody);
    });
  });
  describe('validate util', () => {
    test('should return data error if data is invalid', () => {
      const editor = {
        editorType: 'csvGenerator',
        formKey: 'new-123',
        stage: 'flowInput',
      };

      expect(validate(editor)).toEqual({dataError: 'Must provide some sample data.'});
    });
  });
});

/* global describe, test, expect */

import processorLogic from './index';

const {
  validate,
  requestBody,
  init,
  processResult,
} = processorLogic;

describe('csvParser processor logic', () => {
  describe('requestBody util', () => {
    test('should return the correct data and rule object with options', () => {
      const rule = {
        columnDelimiter: '|',
        hasHeaderRow: true,
        rowsToSkip: 1,
      };
      const data = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0";

      const expectedBody = {
        rules: {
          columnDelimiter: '|',
          hasHeaderRow: true,
          rowsToSkip: 1,
        },
        data: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
        options: { includeEmptyValues: true },
      };

      expect(requestBody({rule, data})).toEqual(expectedBody);
    });
  });
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
          keyColumns: ['name'],
        },
      };
      const options = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'exports',
      };
      const expectedOptions = {
        fieldId: 'file.csv',
        formKey: 'new-123',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'exports',
        rule: {
          groupByFields: [],
          columnDelimiter: '\n',
          includeHeader: true,
          multipleRowsPerRecord: true,
          sortByFields: [],
          trimSpaces: true,
          keyColumns: ['name'],
        },
      };

      expect(init({options, fieldState})).toEqual(expectedOptions);
    });
  });
  describe('validate util', () => {
    test('should return data error if data is invalid', () => {
      const editor = {
        editorType: 'csvParser',
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
        columnsData: [{id: 123}],
        data: {
          page_of_records: [
            {record: {id: 123}},
          ],
        },
      };

      expect(processResult({}, result)).toEqual(expectedResult);
    });
  });
});

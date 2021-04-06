/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  buildData,
} = processorLogic;

describe('salesforceLookupFilter processor logic', () => {
  describe('init util', () => {
    test('should correctly return the rule along with options', () => {
      const options = {
        stage: 'importMappingExtract',
        resourceId: '99999',
        resourceType: 'imports',
      };
      const fieldState = {
        value: '(BillingCity = dummy)',
      };
      const expectedOutput = {
        stage: 'importMappingExtract',
        resourceId: '99999',
        resourceType: 'imports',
        rule: '(BillingCity = dummy)',
      };

      expect(init({options, fieldState})).toEqual(expectedOutput);
    });
  });
  describe('buildData util', () => {
    test('should return passed sample data if empty', () => {
      expect(buildData()).toEqual([]);
      expect(buildData(undefined, [])).toEqual([]);
    });
    test('should correctly generate the data paths if sample data is of array type', () => {
      const sampleData = [{
        id: '125',
        recordType: 'customer',
      }];

      const expectedOutput = [
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
        {name: '*.id', id: '*.id'},
        {name: '*.recordType', id: '*.recordType'},
      ];

      expect(buildData(undefined, JSON.stringify(sampleData))).toEqual(expectedOutput);
    });
    test('should correctly generate the data paths if sample data is of object type', () => {
      const sampleData = {
        id: '125',
        recordType: 'customer',
      };

      const expectedOutput = [
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
        {name: '*.id', id: '*.id'},
        {name: '*.recordType', id: '*.recordType'},
      ];

      expect(buildData(undefined, JSON.stringify(sampleData))).toEqual(expectedOutput);
    });
  });
});

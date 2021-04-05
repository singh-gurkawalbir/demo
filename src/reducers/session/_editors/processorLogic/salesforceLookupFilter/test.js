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
    test('should not modify rule if already present in options', () => {
      const options = {
        stage: 'importMappingExtract',
        resourceId: '99999',
        resourceType: 'imports',
        rule: ['some rule'],
      };
      const fieldState = {
        value: '(BillingCity = dummy)',
      };
      const expectedOutput = {
        stage: 'importMappingExtract',
        resourceId: '99999',
        resourceType: 'imports',
        rule: ['some rule'],
      };

      expect(init({options, fieldState})).toEqual(expectedOutput);
    });
  });
  describe('buildData util', () => {
    test('should return passed sample data if empty', () => {
      expect(buildData()).toBeUndefined();
      expect(buildData(undefined, [])).toEqual([]);
    });
    test('should correctly generate the data paths if sample data is of array type and ssLinkedConnectionId is undefined', () => {
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
    test('should correctly generate the data paths if sample data is of object type and ssLinkedConnectionId is undefined', () => {
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
    test('should correctly extract the sample data if ssLinkedConnectionId is present and isGroupedSampleData is true', () => {
      const sampleData = [{name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'}];

      const expectedOutput = [
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
        {name: '*.id', id: '*.id'},
        {name: '*.recordType', id: '*.recordType'},
      ];

      expect(buildData({ssLinkedConnectionId: 123, isGroupedSampleData: true}, JSON.stringify(sampleData))).toEqual(expectedOutput);
    });
  });
});

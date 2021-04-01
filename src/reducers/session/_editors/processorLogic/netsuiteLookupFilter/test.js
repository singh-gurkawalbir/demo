/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  buildData,
} = processorLogic;

describe('netsuiteLookupFilter processor logic', () => {
  describe('init util', () => {
    test('should correctly return the rule along with options', () => {
      const options = {
        stage: 'importMappingExtract',
        resourceId: '99999',
        resourceType: 'imports',
      };
      const fieldState = {
        value: '["salesrep","is","dummy"]',
      };
      const expectedOutput = {
        stage: 'importMappingExtract',
        resourceId: '99999',
        resourceType: 'imports',
        rule: ['salesrep', 'is', 'dummy'],
      };

      expect(init({options, fieldState})).toEqual(expectedOutput);
    });
  });
  describe('buildData util', () => {
    test('should return passed sample data if empty', () => {
      expect(buildData({})).toBeUndefined();
      expect(buildData({}, [])).toEqual([]);
    });
    test('should correctly generate the data paths if sample data is of array type', () => {
      const sampleData = [{
        id: '125',
        recordType: 'customer',
      }];

      const expectedOutput = [
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
      ];

      expect(buildData({}, JSON.stringify(sampleData))).toEqual(expectedOutput);
    });
    test('should correctly generate the data paths if sample data is of object type', () => {
      const sampleData = {
        id: '125',
        recordType: 'customer',
      };

      const expectedOutput = [
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
      ];

      expect(buildData({}, JSON.stringify(sampleData))).toEqual(expectedOutput);
    });
    test('should return the json sample data if editor contains ssLinkedConnectionId', () => {
      const sampleData = JSON.stringify([
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
      ]);

      const expectedOutput = [
        {name: 'id', id: 'id'},
        {name: 'recordType', id: 'recordType'},
      ];

      expect(buildData({ssLinkedConnectionId: '123'}, sampleData)).toEqual(expectedOutput);
    });
  });
});

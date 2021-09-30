/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
} = processorLogic;

describe('netsuiteQualificationCriteria processor logic', () => {
  describe('init util', () => {
    test('should correctly return the rule along with options', () => {
      const options = {
        resourceId: '99999',
        resourceType: 'exports',
        data: 'dummy data',
      };
      const fieldState = {
        value: '["salesrep","is","dummy"]',
      };
      const expectedOutput = {
        resourceId: '99999',
        resourceType: 'exports',
        data: 'dummy data',
        rule: ['salesrep', 'is', 'dummy'],
      };

      expect(init({options, fieldState})).toEqual(expectedOutput);
    });
    test('should return rule as fieldState value if the value is not a valid json', () => {
      const options = {
        resourceId: '99999',
        resourceType: 'exports',
        data: 'dummy data',
      };
      const fieldState = {
        value: '[salesrep,"is","dummy"]',
      };
      const expectedOutput = {
        resourceId: '99999',
        resourceType: 'exports',
        data: 'dummy data',
        rule: '[salesrep,"is","dummy"]',
      };

      expect(init({options, fieldState})).toEqual(expectedOutput);
    });
  });
});

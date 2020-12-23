/* global describe, expect, test */
import { selectors } from '.';

describe('Metadata region selector testcases', () => {
  describe('selectors.metadataOptionsAndResources test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.metadataOptionsAndResources({}, {})).toEqual({
        data: undefined,
        errorMessage: undefined,
        status: undefined,
        validationError: undefined,
      });
    });
  });

  describe('selectors.getMetadataOptions test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getMetadataOptions({}, {})).toEqual({
        data: undefined,
        errorMessage: undefined,
        status: undefined,
        validationError: undefined,
      });
    });
  });

  describe('selectors.getSalesforceMasterRecordTypeInfo test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getSalesforceMasterRecordTypeInfo(undefined, {})).toEqual({data: undefined, status: undefined});
    });
  });
});


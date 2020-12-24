/* global describe, expect, test */
import { selectors } from '.';

describe('Sample data region selector testcases', () => {
  describe('selectors.canSelectRecordsInPreviewPanel test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.canSelectRecordsInPreviewPanel()).toBe(true);
    });
  });

  describe('selectors.fileDefinitionSampleData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.fileDefinitionSampleData({}, {})).toEqual({});
    });
  });

  describe('selectors.fileSampleData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.fileSampleData(undefined, {})).toBe();
    });
  });

  describe('selectors.getImportSampleData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getImportSampleData()).toEqual({});
    });
  });

  describe('selectors.sampleDataWrapper test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.sampleDataWrapper(undefined, {})).toEqual({status: undefined});
    });
  });

  describe('selectors.isExportPreviewDisabled test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isExportPreviewDisabled()).toEqual(null);
    });
  });

  describe('selectors.getAvailableResourcePreviewStages test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getAvailableResourcePreviewStages()).toEqual([]);
    });
  });

  describe('selectors.isRequestUrlAvailableForPreviewPanel test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isRequestUrlAvailableForPreviewPanel({})).toEqual(false);
    });
  });
});

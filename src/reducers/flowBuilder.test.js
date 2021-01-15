/* global describe, expect, test */
import { selectors } from '.';

describe('Flow builder region selector testcases', () => {
  describe('selectors.getResourceEditUrl test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getResourceEditUrl()).toEqual('/undefined/edit/undefined/undefined');
    });
  });

  describe('selectors.mkFlowConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowConnectionList();

      expect(selector(false)).toEqual([]);
    });
  });

  describe('selectors.mkIsAnyFlowConnectionOffline test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIsAnyFlowConnectionOffline();

      expect(selector(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.flowReferencesForResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowReferencesForResource()).toEqual([]);
    });
  });

  describe('selectors.isPageGenerator test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isPageGenerator(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.getUsedActionsForResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getUsedActionsForResource()).toEqual({});
    });
  });

  describe('selectors.transferListWithMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.transferListWithMetadata(undefined, {})).toEqual([]);
    });
  });

  describe('selectors.isRestCsvMediaTypeExport test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isRestCsvMediaTypeExport()).toEqual(false);
    });
  });

  describe('selectors.isDataLoaderExport test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataLoaderExport()).toEqual(false);
    });
  });

  describe('selectors.isFreeFlowResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFreeFlowResource()).toEqual(false);
    });
  });

  describe('selectors.isFlowViewMode test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFlowViewMode()).toEqual(false);
    });
  });

  describe('selectors.isDataLoaderFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataLoaderFlow()).toEqual(0);
    });
  });

  describe('selectors.shouldShowAddPageProcessor test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.shouldShowAddPageProcessor()).toEqual(true);
    });
  });

  describe('selectors.isLookUpExport test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isLookUpExport({}, {})).toEqual(false);
    });
  });

  describe('selectors.getCustomResourceLabel test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getCustomResourceLabel({}, {})).toEqual('');
    });
  });
});


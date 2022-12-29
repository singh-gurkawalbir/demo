
import { selectors } from '.';

describe('Flow builder region selector testcases', () => {
  describe('selectors.getResourceEditUrl test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getResourceEditUrl()).toBe('/edit/undefined/undefined');
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

      expect(selector(undefined, {})).toBe(false);
    });
  });

  describe('selectors.flowReferencesForResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowReferencesForResource()).toEqual([]);
    });
  });

  describe('selectors.isPageGenerator test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isPageGenerator(undefined, {})).toBe(false);
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
      expect(selectors.isRestCsvMediaTypeExport()).toBe(false);
    });
  });

  describe('selectors.isDataLoaderExport test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataLoaderExport()).toBe(false);
    });
  });

  describe('selectors.isFreeFlowResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFreeFlowResource()).toBe(false);
    });
  });

  describe('selectors.isFlowViewMode test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFlowViewMode()).toBe(false);
    });
  });

  describe('selectors.isDataLoaderFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataLoaderFlow()).toBe(0);
    });
  });

  describe('selectors.shouldShowAddPageProcessor test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.shouldShowAddPageProcessor()).toBe(true);
    });
  });

  describe('selectors.isLookUpExport test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isLookUpExport({}, {})).toBe(false);
    });
  });

  describe('selectors.getCustomResourceLabel test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getCustomResourceLabel({}, {})).toBe('');
    });
  });
});


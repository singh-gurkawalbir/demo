/* global describe, expect, test */
import { selectors } from '.';

describe('Mappings region selector testcases', () => {
  describe('selectors.flowImports test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowImports()).toEqual([]);
    });
  });

  describe('selectors.flowMappingsImportsList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.flowMappingsImportsList();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.getAllPageProcessorImports test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getAllPageProcessorImports()).toEqual([]);
    });
  });

  describe('selectors.httpAssistantSupportsMappingPreview test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.mappingPreviewType test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingPreviewType()).toEqual();
    });
  });

  describe('selectors.isPreviewPanelAvailableForResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isPreviewPanelAvailableForResource(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.applicationType test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.applicationType()).toEqual('');
    });
  });

  describe('selectors.mappingGenerates test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingGenerates()).toEqual([]);
    });
  });

  describe('selectors.mappingExtracts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingExtracts()).toEqual([]);
    });
  });

  describe('selectors.mappingHttpAssistantPreviewData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingHttpAssistantPreviewData()).toEqual();
    });
  });

  describe('selectors.responseMappingExtracts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.responseMappingExtracts()).toEqual([]);
    });
  });
});


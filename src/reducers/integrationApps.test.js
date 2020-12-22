/* global describe, expect, test */
import { selectors } from '.';

describe('integrationApps selector testcases', () => {
  describe('selectors.getFlowsAssociatedExportFromIAMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getFlowsAssociatedExportFromIAMetadata({}, {})).toBe(null);
    });
  });

  describe('selectors.integrationConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationConnectionList()).toEqual([]);
    });
  });

  describe('selectors.integrationAppV2FlowList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppV2FlowList(undefined, {})).toBe(null);
    });
  });

  describe('selectors.integrationAppV2ConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppV2ConnectionList()).toBe(null);
    });
  });

  describe('selectors.mkIntegrationAppResourceList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppResourceList();

      expect(selector(undefined, {})).toEqual({connections: [], flows: []});
    });
  });

  describe('selectors.mkIntegrationAppStore test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppStore();

      expect(selector()).toEqual({});
    });
  });

  describe('selectors.integrationAppConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppConnectionList()).toEqual([]);
    });
  });

  describe('selectors.pendingCategoryMappings test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.pendingCategoryMappings({})).toEqual();
    });
  });

  describe('selectors.categoryMappingMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.categoryMappingMetadata(undefined, {})).toEqual({});
    });
  });

  describe('selectors.mappedCategories test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappedCategories()).toEqual([]);
    });
  });

  describe('selectors.categoryMappingGenerateFields test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.categoryMappingGenerateFields({})).toEqual(null);
    });
  });

  describe('selectors.mappingsForVariation test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingsForVariation({})).toEqual({});
    });
  });

  describe('selectors.mappingsForCategory test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingsForCategory({})).toEqual();
    });
  });

  describe('selectors.integrationAppName test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.integrationAppName();

      expect(selector()).toEqual(null);
    });
  });

  describe('selectors.integrationChildren test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationChildren()).toEqual([{label: undefined, value: undefined}]);
    });
  });

  describe('selectors.integrationAppLicense test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppLicense()).toEqual({});
    });
  });

  describe('selectors.makeIntegrationSectionFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeIntegrationSectionFlows();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.integrationAppFlowSections test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppFlowSections()).toEqual([]);
    });
  });

  describe('selectors.integrationAppGeneralSettings test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppGeneralSettings()).toEqual({});
    });
  });

  describe('selectors.hasGeneralSettings test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasGeneralSettings()).toEqual(false);
    });
  });

  describe('selectors.mkIntegrationAppSectionMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkIntegrationAppSectionMetadata();

      expect(selector()).toEqual({});
    });
  });

  describe('selectors.integrationAppSectionFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppSectionFlows()).toEqual([]);
    });
  });

  describe('selectors.integrationAppFlowIds test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppFlowIds()).toEqual([]);
    });
  });

  describe('selectors.isIntegrationAppVersion2 test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIntegrationAppVersion2()).toEqual(false);
    });
  });

  describe('selectors.integrationAppChildIdOfFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationAppChildIdOfFlow()).toEqual(null);
    });
  });
});


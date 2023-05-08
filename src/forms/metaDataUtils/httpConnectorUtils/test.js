import {
  initializeHttpConnectorForm,
  initializeHttpForm,
  getAttachedCustomSettingsMetadata,
  getUpdatedFieldMetaWithCustomSettings,
  getUpdatedFormLayoutWithCustomSettings,
} from '.';

describe('http connector util test cases', () => {
  describe('initializeHttpConnectorForm util', () => {
    test('should return passed metadata if the resource has no settings form', () => {
      const fieldMeta = {};

      expect(initializeHttpConnectorForm(fieldMeta, {})).toBe(fieldMeta);
    });
    test.todo('should return updated metadata with cs fields positioned based on displayAfter for an existing resource');
    test.todo('should return metadata with cs fields as well as a cs container for remaining cs fields for a new resource');
  });
  describe('initializeHttpForm util', () => {
    test('should do nothing for an existing resource and return passed metadata', () => {
      const fieldMeta = {};
      const resource = {
        _id: '123456654',
        name: 'shopify export',
      };

      expect(initializeHttpForm(fieldMeta, resource)).toBe(fieldMeta);
    });
    test.todo('should add cs container incase of a new resource with cs fields');
    test.todo('should not add cs container incase of a new resource when there are no custom settings for the resource');
  });
  describe('getAttachedCustomSettingsMetadata util', () => {
    test.todo('should return the passed metadata when there are no cs metadata fields');
    test.todo('should add cs container with cs fields constructed incase the cs metadata existing for the resource');
  });
  describe('getUpdatedFieldMetaWithCustomSettings util', () => {
    test.todo('should return the passed metadata when there are no cs metadata fields');
    test.todo('should add cs container with cs fields constructed incase the cs metadata existing for the resource');
  });
  describe('getUpdatedFormLayoutWithCustomSettings util', () => {
    test.todo('should do nothing incase of invalid props');
    test.todo('should return updated layout with the cs field added beside the formFieldId');
  });
});

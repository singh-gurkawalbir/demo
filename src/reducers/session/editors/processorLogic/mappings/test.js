/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  validate,
  processResult,
} = processorLogic;

describe('mappings processor logic', () => {
  describe('init util', () => {
    const options = {
      stage: 'importMappingExtract',
      resourceId: 'res-123',
      resourceType: 'imports',
    };
    const resource = {
      _id: 'res-123',
      name: 'Import into ftp',
    };
    const expectedOutput = {
      stage: 'importMappingExtract',
      resourceId: 'res-123',
      resourceType: 'imports',
      editorTitle: 'Edit Mapping: Import into ftp',
    };

    test('should correctly return options along with editor title', () => {
      expect(init({options, resource})).toEqual(expectedOutput);
      expect(init({options})).toEqual({
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit Mapping',
      });
      expect(init({options, mappingPreviewType: 'http'})).toEqual({
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit Mapping',
        mappingPreviewType: false,
      });
    });
    test('should return only supported mappingPreviewType', () => {
      expect(init({options, mappingPreviewType: 'http'})).toEqual({
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit Mapping',
        mappingPreviewType: false,
      });
      expect(init({options, mappingPreviewType: 'netsuite'})).toEqual({
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit Mapping',
        mappingPreviewType: 'netsuite',
      });
      expect(init({options, mappingPreviewType: 'salesforce'})).toEqual({
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit Mapping',
        mappingPreviewType: 'salesforce',
      });
    });
  });
  describe('processResult util', () => {
    test('should return the mapped data object from response', () => {
      const editor = {
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const result = {
        data: [
          {mappedObject: {id: 123}},
        ],
      };
      const expectedOutput = {
        data: {id: 123},
      };

      expect(processResult(editor, result)).toEqual(expectedOutput);
    });

    test('should throw error if errors is returned in response', () => {
      const editor = {
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const result = {
        data: [
          {errors: [{message: 'Invalid mappings'}]},
        ],
      };

      expect(() => {
        processResult(editor, result);
      }).toThrowError('Message: Invalid mappings');
    });
  });
  describe('validate util', () => {
    test('should correctly return violations if preset', () => {
      const editor = {
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        violations: {ruleError: 'some error'},
      };

      expect(validate(editor)).toEqual({ruleError: 'some error'});
      delete editor.violations;
      expect(validate(editor)).toEqual({});
    });
  });
});

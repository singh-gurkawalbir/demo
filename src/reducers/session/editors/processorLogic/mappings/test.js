/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  processResult,
} = processorLogic;

describe('mappings processor logic', () => {
  describe('init util', () => {
    test('should correctly return options along with editor title', () => {
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

      expect(init({options, resource})).toEqual(expectedOutput);
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
});

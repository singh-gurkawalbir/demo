
import processorLogic from './index';

const {
  init,
  validate,
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
        editorTitle: 'Edit mapping: Import into ftp',
      };

      expect(init({options, resource})).toEqual(expectedOutput);
      expect(init({options})).toEqual({
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit Mapping',
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
    test('should return the correct object from response if mapping preview type is salesforce', () => {
      const editor = {
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        mappingPreviewType: 'salesforce',
      };
      const result = {
        data: [
          {mappedObject: {id: 123}},
        ],
      };
      const expectedOutput = {
        data: [
          {mappedObject: {id: 123}},
        ],
      };

      expect(processResult(editor, result)).toEqual(expectedOutput);
    });
    test('should return the correct object from response if mapping preview type is netsuite', () => {
      const editor = {
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        mappingPreviewType: 'netsuite',
      };
      const result = {
        data: {
          data: {
            returnedObjects: {
              jsObjects: {
                data: [
                  {
                    celigoIsElement: true,
                    data: {
                      nlobjFieldIds: {
                        companyname: '123',
                        phone: '234',
                        fax: '123',
                        custentity51: '123',
                      },
                      nlobjSublistIds: {},
                    },
                  },
                ],
              },
              mappingErrors: [],
            },
          },
        },
      };
      const expectedOutput = {
        data: {
          nlobjFieldIds: {
            companyname: '123',
            phone: '234',
            fax: '123',
            custentity51: '123',
          },
          nlobjSublistIds: {},
        },
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

    test('should throw error if errors is returned in response if mapping preview type is salesforce or netsuite', () => {
      const editor = {
        stage: 'importMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        mappingPreviewType: 'salesforce',
      };
      const result = {errors: {message: 'Invalid mappings'}};

      expect(() => {
        processResult(editor, result);
      }).toThrowError('Message: Invalid mappings');
      expect(() => {
        processResult({...editor, mappingPreviewType: 'netsuite'}, result);
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

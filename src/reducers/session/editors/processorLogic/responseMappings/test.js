
import processorLogic from './index';

const {
  init,
  processResult,
} = processorLogic;

describe('responseMappings processor logic', () => {
  describe('init util', () => {
    test('should correctly return options along with editor title for imports', () => {
      const options = {
        stage: 'responseMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const expectedOutput = {
        stage: 'responseMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        editorTitle: 'Edit response mapping',
      };

      expect(init({options})).toEqual(expectedOutput);
    });
    test('should correctly return options along with editor title for exports', () => {
      const options = {
        stage: 'responseMappingExtract',
        resourceId: 'res-123',
        resourceType: 'exports',
      };
      const expectedOutput = {
        stage: 'responseMappingExtract',
        resourceId: 'res-123',
        resourceType: 'exports',
        editorTitle: 'Edit results mapping',
      };

      expect(init({options})).toEqual(expectedOutput);
    });
  });

  describe('processResult util', () => {
    test('should return the post mapped data object from response if there is no flow input data', () => {
      const editor = {
        stage: 'responseMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const result = {
        data: [
          {mappedObject: {id: 123}},
        ],
      };
      const expectedOutput = {
        data: {record: {id: 123}},
      };

      expect(processResult(editor, result)).toEqual(expectedOutput);
    });
    test('should return the post mapped data object from response if there is flow input data available', () => {
      const editor = {
        stage: 'responseMappingExtract',
        resourceId: 'res-123',
        resourceType: 'imports',
        flowInputData: [{email: 'test@abc.com'}],
      };
      const result = {
        data: [
          {mappedObject: {id: 123}},
        ],
      };
      const expectedOutput = {
        data: {
          rows: [
            {
              email: 'test@abc.com',
              id: 123,
            },
          ],
        },
      };

      expect(processResult(editor, result)).toEqual(expectedOutput);
    });
    test('should throw error if errors is returned in response', () => {
      const editor = {
        stage: 'responseMappingExtract',
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

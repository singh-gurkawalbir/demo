/* global describe, test, expect */

import processorLogic, { _hasDefaultMetaData } from './index';

const {
  init,
  buildData,
  requestBody,
  validate,
} = processorLogic;

describe('sql processor logic', () => {
  describe('_hasDefaultMetaData util', () => {
    test('should return false for predefined list of fields', () => {
      expect(_hasDefaultMetaData({fieldId: 'mongodb.filter', resourceType: 'exports'})).toEqual(false);
    });
    test('should return false for rdbms export query fields', () => {
      expect(_hasDefaultMetaData({fieldId: 'rdbms.query', resourceType: 'exports'})).toEqual(false);
    });
    test('should return true for all other cases', () => {
      expect(_hasDefaultMetaData({fieldId: 'rdbms.query', resourceType: 'imports'})).toEqual(true);
    });
  });
  describe('init util', () => {
    test('should return modelMetadata if adaptor type is RDBMSImport', () => {
      const resource = {
        _id: 'res-123',
        name: 'sql import',
        adaptorType: 'RDBMSImport',
      };
      const formValues = {
        '/modelMetadata': 'some data',
      };
      const options = {
        fieldId: 'rdbms.query',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
      };

      expect(init({resource, formValues, options})).toHaveProperty('modelMetadata', 'some data');
    });
    test('should return correct options if adaptor type is not RDBMSImport', () => {
      const resource = {
        _id: 'res-123',
        name: 'sql import',
        adaptorType: 'MongoDBImport',
      };
      const formValues = {
        '/modelMetadata': 'some data',
      };
      const options = {
        fieldId: 'mongodb.query',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const expectedOutput = {
        fieldId: 'mongodb.query',
        stage: 'flowInput',
        resourceId: 'res-123',
        resourceType: 'imports',
        supportsDefaultData: true,
        editorSupportsV1V2data: false,
        resultMode: 'text',
      };

      expect(init({resource, formValues, options})).toEqual(expectedOutput);
    });
  });
  describe('buildData util', () => {
    test('should return original sample data if supportsDefaultData is falsy', () => {
      const sampleData = '{data: {id: 123}}';

      expect(buildData({supportsDefaultData: false}, sampleData)).toEqual({data: '{data: {id: 123}}'});
    });
    test('should return default data equal to modelMetadata if present', () => {
      const sampleData = '{data: {id: 123}}';
      const modelMetadata = {
        id: {
          default: null,
        },
      };
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({data: modelMetadata}, null, 2),
      };

      expect(buildData({supportsDefaultData: true, modelMetadata}, sampleData)).toEqual(expectedOutput);
    });
    test('should return correct data if sample data contains data object', () => {
      const sampleData = '{"data": {"id": 123}}';
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({data: {
          id: {
            default: '',
          },
        }}, null, 2),
      };

      expect(buildData({supportsDefaultData: true}, sampleData)).toEqual(expectedOutput);
    });
    test('should return correct data if sample data contains rows array', () => {
      const sampleData = '{"rows": [{"id": 123}]}';
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({row: {
          id: {
            default: '',
          },
        }}, null, 2),
      };

      expect(buildData({supportsDefaultData: true}, sampleData)).toEqual(expectedOutput);
    });
    test('should return correct data if sample data contains record object', () => {
      const sampleData = '{"record": {"id": 123}}';
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({record: {
          id: {
            default: '',
          },
        }}, null, 2),
      };

      expect(buildData({supportsDefaultData: true}, sampleData)).toEqual(expectedOutput);
    });
  });
  describe('requestBody util', () => {
    test('should return correct body if defaultData also exists', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}',
        defaultData: JSON.stringify({data: {
          id: {
            default: '',
          },
        }}, null, 2),
        rule: 'some rule',
      };
      const expectedOutput = {
        rules: { strict: false, template: 'some rule' },
        data: {
          data: {
            id: 123,
          },
        },
      };

      expect(requestBody(editor)).toEqual(expectedOutput);
    });
  });
  describe('validate util', () => {
    test('should return dataError if editor data is invalid', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}}',
        defaultData: JSON.stringify({data: {
          id: {
            default: '',
          },
        }}, null, 2),
        rule: 'some rule',
      };

      expect(validate(editor)).toEqual({dataError: 'Sample Data: Unexpected token } in JSON at position 21'});
    });
    test('should return dataError if editor defaultData is invalid', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}',
        defaultData: '{"data": {"id": 123}}}',
        rule: 'some rule',
      };

      expect(validate(editor)).toEqual({dataError: 'Default Data: Unexpected token } in JSON at position 21'});
    });
  });
});

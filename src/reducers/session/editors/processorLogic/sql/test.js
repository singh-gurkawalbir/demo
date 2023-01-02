
import processorLogic, { _hasDefaultMetaData } from './index';

const {
  init,
  buildData,
  requestBody,
  dirty,
  validate,
} = processorLogic;

describe('sql processor logic', () => {
  describe('_hasDefaultMetaData util', () => {
    test('should return false for predefined list of fields', () => {
      expect(_hasDefaultMetaData({fieldId: 'mongodb.filter', resourceType: 'exports'})).toBe(false);
    });
    test('should return false for rdbms export query fields', () => {
      expect(_hasDefaultMetaData({fieldId: 'rdbms.query', resourceType: 'exports'})).toBe(false);
    });
    test('should return true for all other cases', () => {
      expect(_hasDefaultMetaData({fieldId: 'rdbms.query', resourceType: 'imports'})).toBe(true);
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
        defaultData: JSON.stringify(modelMetadata, null, 2),
      };

      expect(buildData({supportsDefaultData: true, modelMetadata}, sampleData)).toEqual(expectedOutput);
    });
    test('should return original sample data if its not a new resource and modelMetadata is undefined', () => {
      const sampleData = '{data: {id: 123}}';

      expect(buildData({supportsDefaultData: true, resourceId: '1234'}, sampleData)).toEqual({data: '{data: {id: 123}}'});
    });

    test('should return correct data if sample data contains data object', () => {
      const sampleData = '{"data": {"id": 123}}';
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
        }, null, 2),
      };

      expect(buildData({supportsDefaultData: true, resourceId: 'new-1234'}, sampleData)).toEqual(expectedOutput);
    });
    test('should return correct data if sample data contains rows array', () => {
      const sampleData = '{"rows": [{"id": 123}]}';
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
        }, null, 2),
      };

      expect(buildData({supportsDefaultData: true, resourceId: 'new-1234'}, sampleData)).toEqual(expectedOutput);
    });
    test('should return correct data if sample data contains record object', () => {
      const sampleData = '{"record": {"id": 123}}';
      const expectedOutput = {
        data: sampleData,
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
        }, null, 2),
      };

      expect(buildData({supportsDefaultData: true, resourceId: 'new-1234'}, sampleData)).toEqual(expectedOutput);
    });
  });
  describe('requestBody util', () => {
    test('should return correct body and not merge default data', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}',
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
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
  describe('dirty util', () => {
    test('should return false if default data is undefined', () => {
      expect(dirty({})).toBe(false);
    });
    test('should return true if original default data differs from patched default data', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}',
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
        originalDefaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name123',
          },
        }, null, 2),
        rule: 'some rule',
      };

      expect(dirty(editor)).toBe(true);
    });
    test('should return true if original rule differs from patched rule', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}',
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
        originalDefaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
        rule: 'some rule',
        originalRule: 'new rule',
      };

      expect(dirty(editor)).toBe(true);
    });
    test('should return false if default data and rule has not changed', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}',
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
        originalDefaultData: JSON.stringify({
          id: {
            default: '',
          },
          name: {
            default: 'default name',
          },
        }, null, 2),
        rule: 'some rule',
        originalRule: 'some rule',
      };

      expect(dirty(editor)).toBe(false);
    });
  });
  describe('validate util', () => {
    test('should return dataError if editor data is invalid', () => {
      const editor = {
        fieldId: 'rdbms.query',
        resourceType: 'imports',
        stage: 'flowInput',
        data: '{"data": {"id": 123}}}',
        defaultData: JSON.stringify({
          id: {
            default: '',
          },
        }, null, 2),
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
        defaultData: '{"id": 123}}',
        rule: 'some rule',
      };

      expect(validate(editor)).toEqual({dataError: 'Default Data: Unexpected token } in JSON at position 11'});
    });
  });
});

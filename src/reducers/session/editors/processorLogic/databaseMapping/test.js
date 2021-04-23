/* global describe, test, expect */

import processorLogic, { getEditorTitle } from './index';

const {
  init,
  patchSet,
} = processorLogic;

describe('readme processor logic', () => {
  describe('getEditorTitle util', () => {
    test('should return empty string for invalid or unsupported adaptor type', () => {
      expect(getEditorTitle()).toEqual('');
      expect(getEditorTitle(null)).toEqual('');
      expect(getEditorTitle('FTPImport')).toEqual('');
    });
    test('should return correct title for the passed adaptor type', () => {
      expect(getEditorTitle('MongodbImport')).toEqual('MongoDB document builder');
      expect(getEditorTitle('DynamodbImport')).toEqual('DynamoDB query builder');
      expect(getEditorTitle('RDBMSImport')).toEqual('SQL query builder');
    });
  });
  describe('init util', () => {
    test('should correctly return adaptor specific options if type is RDBMSImport', () => {
      const options = {
        arrayIndex: 0,
        editorType: 'databaseMapping',
        fieldId: 'rdbms.query',
        resourceId: '123',
        resourceType: 'imports',
        stage: 'flowInput',
      };
      const resource = {
        adaptorType: 'RDBMSImport',
        modelMetadata: {CUSTOMER_NUMBER: {}},
        rdbms: {
          query: ['update querychange again {{rows.0.CUSTOMER_NUMBER}}'],
          lookups: [],
        },
      };
      const expectedOutput = {
        adaptorType: 'RDBMSImport',
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: 'SQL query builder',
        editorType: 'databaseMapping',
        fieldId: 'rdbms.query',
        lookups: [],
        method: undefined,
        modelMetadata: {CUSTOMER_NUMBER: {}},
        query: ['update querychange again {{rows.0.CUSTOMER_NUMBER}}'],
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        rule: 'update querychange again {{rows.0.CUSTOMER_NUMBER}}',
        stage: 'flowInput',
        supportsDefaultData: true,
        v1Rule: 'update querychange again {{rows.0.CUSTOMER_NUMBER}}',
        v2Rule: 'update querychange again {{rows.0.CUSTOMER_NUMBER}}',
      };

      expect(init({options, resource})).toEqual(expectedOutput);
    });
    test('should correctly return adaptor specific options if type is MongodbImport', () => {
      const options = {
        arrayIndex: 0,
        editorType: 'databaseMapping',
        fieldId: 'mongodb.query',
        resourceId: '123',
        resourceType: 'imports',
        stage: 'flowInput',
      };
      const resource = {
        adaptorType: 'MongodbImport',
        modelMetadata: {CUSTOMER_NUMBER: {}},
        mongodb: {
          method: 'insertMany',
          document: 'some query',
        },
      };
      const expectedOutput = {
        adaptorType: 'MongodbImport',
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: 'MongoDB document builder',
        editorType: 'databaseMapping',
        fieldId: 'mongodb.query',
        method: 'insertMany',
        query: 'some query',
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        rule: 'some query',
        stage: 'flowInput',
        supportsDefaultData: true,
        v1Rule: 'some query',
        v2Rule: 'some query',
      };

      expect(init({options, resource})).toEqual(expectedOutput);
    });
    test('should correctly return adaptor specific options if type is DynamodbImport', () => {
      const options = {
        arrayIndex: 0,
        editorType: 'databaseMapping',
        fieldId: 'dynamo.query',
        resourceId: '123',
        resourceType: 'imports',
        stage: 'flowInput',
      };
      const resource = {
        adaptorType: 'DynamodbImport',
        modelMetadata: {CUSTOMER_NUMBER: {}},
        dynamodb: {
          method: 'putItem',
          itemDocument: 'some query',
        },
      };
      const expectedOutput = {
        adaptorType: 'DynamodbImport',
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: 'DynamoDB query builder',
        editorType: 'databaseMapping',
        fieldId: 'dynamo.query',
        method: 'putItem',
        query: 'some query',
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        rule: 'some query',
        stage: 'flowInput',
        supportsDefaultData: true,
        v1Rule: 'some query',
        v2Rule: 'some query',
      };

      expect(init({options, resource})).toEqual(expectedOutput);
    });
    test('should correctly return rule and options if adaptor type is unsupported', () => {
      const options = {
        arrayIndex: 0,
        editorType: 'databaseMapping',
        fieldId: 'some.query',
        resourceId: '123',
        resourceType: 'imports',
        stage: 'flowInput',
      };

      const expectedOutput = {
        arrayIndex: 0,
        editorSupportsV1V2data: false,
        editorTitle: '',
        editorType: 'databaseMapping',
        fieldId: 'some.query',
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        stage: 'flowInput',
        supportsDefaultData: true,
      };

      expect(init({options, resource: {}})).toEqual(expectedOutput);
    });
  });
  describe('patchSet util', () => {
    test('should return empty foreground patches array if adaptor type is unsupported', () => {
      const editor = {
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: '',
        editorType: 'databaseMapping',
        fieldId: 'rdbms.query',
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        stage: 'flowInput',
      };
      const expectedOutput = {
        foregroundPatches: [{
          patch: [],
          resourceType: 'imports',
          resourceId: '123',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedOutput);
    });
    test('should return the correct patch if adaptor type is MongodbImport', () => {
      const editor = {
        adaptorType: 'MongodbImport',
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: 'MongoDB document builder',
        editorType: 'databaseMapping',
        fieldId: 'mongodb.query',
        method: 'insertMany',
        query: 'some query',
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        rule: 'some query',
        stage: 'flowInput',
        supportsDefaultData: true,
        v1Rule: 'some query',
        v2Rule: 'some query',
      };
      const expectedOutput = {
        foregroundPatches: [{
          patch: [{
            op: 'replace',
            path: '/mongodb/document',
            value: 'some query',
          }],
          resourceType: 'imports',
          resourceId: '123',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedOutput);
    });
    test('should return the correct patch if adaptor type is DynamodbImport and method is putItem', () => {
      const editor = {
        adaptorType: 'DynamodbImport',
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: 'DynamoDB query builder',
        editorType: 'databaseMapping',
        fieldId: 'dynamo.query',
        method: 'putItem',
        query: 'some query',
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        rule: 'some query',
        stage: 'flowInput',
        supportsDefaultData: true,
        v1Rule: 'some query',
        v2Rule: 'some query',
      };
      const expectedOutput = {
        foregroundPatches: [{
          patch: [{
            op: 'replace',
            path: '/dynamodb/itemDocument',
            value: 'some query',
          }],
          resourceType: 'imports',
          resourceId: '123',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedOutput);
    });
    test('should return the correct patch if adaptor type is RDBMSImport', () => {
      const editor = {
        adaptorType: 'RDBMSImport',
        arrayIndex: 0,
        editorSupportsV1V2data: true,
        editorTitle: 'SQL query builder',
        editorType: 'databaseMapping',
        fieldId: 'rdbms.query',
        lookups: [],
        method: undefined,
        defaultData: '{"CUSTOMER_NUMBER": {"default": null}}',
        modelMetadata: {CUSTOMER_NUMBER: {}},
        query: ['update querychange again {{rows.0.CUSTOMER_NUMBER}}', 'update query'],
        resourceId: '123',
        resourceType: 'imports',
        resultMode: 'text',
        rule: 'update querychange {{rows.0.CUSTOMER_NUMBER}}',
        stage: 'flowInput',
        supportsDefaultData: true,
        v1Rule: 'update querychange {{rows.0.CUSTOMER_NUMBER}}',
        v2Rule: 'update querychange again {{rows.0.CUSTOMER_NUMBER}}',
      };
      const expectedOutput = {
        foregroundPatches: [{
          patch: [{
            op: 'replace',
            path: '/rdbms/query',
            value: ['update querychange {{rows.0.CUSTOMER_NUMBER}}', 'update query'],
          },
          {
            op: 'replace',
            path: '/rdbms/lookups',
            value: [],
          },
          {
            op: 'replace',
            path: '/modelMetadata',
            value: {CUSTOMER_NUMBER: {default: null}},
          }],
          resourceType: 'imports',
          resourceId: '123',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedOutput);
    });
  });
});

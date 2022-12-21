/* global describe, test, expect */

import processorLogic, { _constructEditorTitle, _editorSupportsV1V2data } from './index';

const {
  init,
  requestBody,
  validate,
  processResult,
} = processorLogic;

describe('handlebars processor logic', () => {
  describe('_constructEditorTitle util', () => {
    test('should return passed label if its falsy', () => {
      expect(_constructEditorTitle('')).toEqual('');
    });
    test('should return original label if it starts with Build', () => {
      expect(_constructEditorTitle('Build file')).toEqual('Build file');
    });
    test('should prefix Build and return the new label', () => {
      expect(_constructEditorTitle('HTTP request body')).toEqual('Build HTTP request body');
    });
    test('should prefix Build and convert first char to lowercase and return new label', () => {
      expect(_constructEditorTitle('File name')).toEqual('Build file name');
    });
    test('should prefix Build and drop Override from label', () => {
      expect(_constructEditorTitle('Override HTTP request body')).toEqual('Build HTTP request body');
    });
  });
  describe('_editorSupportsV1V2data util', () => {
    test('should not throw error for invalid arguments', () => {
      expect(_editorSupportsV1V2data({})).toEqual(false);
      expect(_editorSupportsV1V2data({resource: null, connection: null})).toEqual(false);
    });
    test('should return false for all lookup fields', () => {
      expect(_editorSupportsV1V2data({fieldId: '_query'})).toEqual(false);
      expect(_editorSupportsV1V2data({fieldId: '_body'})).toEqual(false);
      expect(_editorSupportsV1V2data({fieldId: '_relativeURI'})).toEqual(false);
      expect(_editorSupportsV1V2data({fieldId: 'lookup.body'})).toEqual(false);
    });
    test('should return false for traceKeyTemplate field', () => {
      expect(_editorSupportsV1V2data({fieldId: 'traceKeyTemplate'})).toEqual(false);
    });
    test('should return false for dataURI and idLockTemplate if resource is a standalone import', () => {
      const expResource = {
        adaptorType: 'HTTPExport',
        _id: '123',
      };
      const impResource = {
        adaptorType: 'HTTPImport',
        _id: '123',
      };

      expect(_editorSupportsV1V2data({resource: impResource, isStandaloneResource: true, fieldId: 'idLockTemplate'})).toEqual(false);
      expect(_editorSupportsV1V2data({resource: impResource, isStandaloneResource: true, fieldId: 'dataURITemplate'})).toEqual(false);
      expect(_editorSupportsV1V2data({resource: expResource, isStandaloneResource: true, fieldId: 'idLockTemplate'})).toEqual(true);
      expect(_editorSupportsV1V2data({resource: expResource, isStandaloneResource: true, fieldId: 'dataURITemplate'})).toEqual(true);
    });
    test('should return true for data uri and concurrency fields', () => {
      expect(_editorSupportsV1V2data({fieldId: 'idLockTemplate'})).toEqual(true);
      expect(_editorSupportsV1V2data({fieldId: 'dataURITemplate'})).toEqual(true);
      expect(_editorSupportsV1V2data({fieldId: 'rdbms.once.query'})).toEqual(true);
    });
    test('should return false if resource is a page generator', () => {
      expect(_editorSupportsV1V2data({isPageGenerator: true, fieldId: 'rdbms.query'})).toEqual(false);
    });
    test('should return false if resource is a standalone resource', () => {
      expect(_editorSupportsV1V2data({isStandaloneResource: true, fieldId: 'rdbms.query'})).toEqual(false);
    });
    test('should return true for paging related fields', () => {
      expect(_editorSupportsV1V2data({fieldId: 'http.paging.body'})).toEqual(true);
    });
    test('should return true for root level fields when paging is configured', () => {
      expect(_editorSupportsV1V2data(
        {isPageGenerator: false,
          fieldId: 'rest.body',
          resource: {adaptorType: 'RESTExport', rest: { pagingMethod: 'relativeuri' }},
          connection: {isHTTP: true},
        })).toEqual(true);
      expect(_editorSupportsV1V2data(
        {isPageGenerator: false,
          fieldId: 'http.body',
          resource: {adaptorType: 'HTTPExport', http: { paging: { method: 'relativeuri' } }},
          connection: {isHTTP: true},
        })).toEqual(true);
    });

    test('should return false for native REST adaptor', () => {
      expect(_editorSupportsV1V2data(
        {isPageGenerator: false,
          fieldId: 'rest.body',
          resource: {adaptorType: 'RESTImport'},
          connection: {isHTTP: false},
        })).toEqual(false);
      expect(_editorSupportsV1V2data(
        {isPageGenerator: false,
          fieldId: 'rest.body',
          resource: {adaptorType: 'RESTExport'},
          connection: {isHTTP: false},
        })).toEqual(false);
    });
    test('should return true for all other adaptor fields', () => {
      expect(_editorSupportsV1V2data(
        {isPageGenerator: false,
          fieldId: 'http.body',
          resource: {adaptorType: 'HTTPImport'},
        })).toEqual(true);
      expect(_editorSupportsV1V2data(
        {isPageGenerator: false,
          fieldId: 'ftp.directoryPath',
          resource: {adaptorType: 'FTPExport'},
        })).toEqual(true);
    });
  });
  describe('init util', () => {
    test('should read and return rule from arrayIndex if field type is either uri or body type', () => {
      const options = {
        fieldId: '_body',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'HTTPImport',
      };
      const fieldState = {
        type: 'httprequestbody',
        id: '_body',
        arrayIndex: 0,
        value: ['body1', 'body2'],
      };

      expect(init({options, resource, fieldState})).toHaveProperty('rule', 'body1');
    });
    test('should set v1 and v2 rule if editor supports both data versions', () => {
      const options = {
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'HTTPImport',
      };
      const fieldState = {
        type: 'httprequestbody',
        id: 'http.body',
        arrayIndex: 0,
        value: ['body1', 'body2'],
      };

      expect(init({options, resource, fieldState})).toHaveProperty('v1Rule', 'body1');
      expect(init({options, resource, fieldState})).toHaveProperty('v2Rule', 'body1');
    });
    test('should correctly set result mode based on field type', () => {
      const options = {
        fieldId: 'rdbms.query',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'RDBMSImport',
      };
      const fieldState = {
        type: 'sqlquerybuilder',
        id: 'rdbms.query',
        arrayIndex: 0,
        value: 'query1',
      };

      expect(init({options, resource, fieldState})).toHaveProperty('resultMode', 'text');
    });
    test('should correctly set result mode if field is file.xml.body', () => {
      const options = {
        fieldId: 'file.xml.body',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'FTPImport',
      };
      const fieldState = {
        type: 'httprequestbody',
        id: 'file.xml.body',
        value: '<></>',
      };

      expect(init({options, resource, fieldState})).toHaveProperty('resultMode', 'xml');
    });
    test('should correctly set result mode if field is file.json.body', () => {
      const options = {
        fieldId: 'file.json.body',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'FTPImport',
      };
      const fieldState = {
        type: 'httprequestbody',
        id: 'file.json.body',
        value: '{}',
      };

      expect(init({options, resource, fieldState})).toHaveProperty('resultMode', 'json');
    });
    test('should correctly return the formatted options with rule and other props', () => {
      const options = {
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'imports',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'HTTPImport',
      };
      const fieldState = {
        type: 'httprequestbody',
        id: 'http.body',
        arrayIndex: 0,
        value: '{{body}}',
        label: 'HTTP request body',
        contentType: 'json',
      };
      const expectedOptions = {
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: '{{body}}',
        v1Rule: '{{body}}',
        v2Rule: '{{body}}',
        editorSupportsV1V2data: true,
        resultMode: 'json',
        editorTitle: 'Build HTTP request body',
      };

      expect(init({options, resource, fieldState})).toEqual(expectedOptions);
    });
    test('should correctly read and return rule if field is assistantMetadata.queryParams', () => {
      const options = {
        fieldId: 'assistantMetadata.queryParams',
        resourceId: 'res-123',
        resourceType: 'exports',
        paramIndex: '1',
      };
      const resource = {
        _id: 'res-123',
        adaptorType: 'HTTPExport',
      };
      const fieldState = {
        type: 'hfsearchparams',
        id: 'assistantMetadata.queryParams',
        value: {field1: 'value1',
          field2: 'value2',
        },
      };

      expect(init({options, resource, fieldState}).rule).toEqual('value2');
    });
  });
  describe('requestBody util', () => {
    test('should return correct request body', () => {
      const editor = {
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: '{{body}}',
        v1Rule: '{{body}}',
        v2Rule: '{{body}}',
        editorSupportsV1V2data: true,
        resultMode: 'json',
        editorTitle: 'Build HTTP request body',
        data: '{"id": 123}',
      };
      const expectedOutput = {
        rules: { strict: false, template: '{{body}}' },
        data: {id: 123},
      };

      expect(requestBody(editor)).toEqual(expectedOutput);
    });
  });
  describe('validate util', () => {
    test('should return data error if editor data is invalid json', () => {
      const editor = {
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: '{{body}}',
        v1Rule: '{{body}}',
        v2Rule: '{{body}}',
        editorSupportsV1V2data: true,
        resultMode: 'json',
        editorTitle: 'Build HTTP request body',
        data: '{"id": 123}}',
      };

      expect(validate(editor)).toEqual({dataError: 'Unexpected token } in JSON at position 11'});
    });
    test('should data error as null if editor data valid', () => {
      const editor = {
        fieldId: 'http.body',
        resourceId: 'res-123',
        resourceType: 'imports',
        rule: '{{body}}',
        v1Rule: '{{body}}',
        v2Rule: '{{body}}',
        editorSupportsV1V2data: true,
        resultMode: 'json',
        editorTitle: 'Build HTTP request body',
        data: '{"id": 123}',
      };

      expect(validate(editor)).toEqual({dataError: null});
    });
  });
  describe('processResult util', () => {
    test('should return passed result if it does not contain data', () => {
      expect(processResult({resultMode: 'text'}, {version: 1})).toEqual({version: 1});
    });
    test('should return json warning if result mode is json and result data is not a valid json', () => {
      const result = {
        data: '{"id": 123}}',
      };
      const expectedResult = {
        data: '{"id": 123}}',
        warning: 'Evaluated result is not valid JSON. Unexpected token } in JSON at position 11',
      };

      expect(processResult({resultMode: 'json'}, result)).toEqual(expectedResult);
    });
    test('should return xml warning if result mode is xml and result data is not a valid xml', () => {
      const result = {
        data: '<xml>2122<xml>',
      };
      const expectedResult = {
        data: '<xml>2122<xml>',
        warning: 'Evaluated result is not valid XML. ',
      };

      expect(processResult({resultMode: 'xml'}, result)).toEqual(expectedResult);
    });
    test('should return original result without any warning if the data is valid', () => {
      const result = {
        data: '{"id": 123}',
      };
      const expectedResult = {
        data: '{"id": 123}',
      };

      expect(processResult({resultMode: 'json'}, result)).toEqual(expectedResult);
      expect(processResult({resultMode: 'text'}, result)).toEqual(expectedResult);
    });
  });
});

/* global expect, describe, test */
import {convertGraphQLQueryToHTTPBody, getGraphQLObj, getGraphqlRelativeURI, getGraphQLValues, isGraphqlResource} from '.';

describe('graphql utils: ', () => {
  describe('convertGraphQLQueryToHTTPBody test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(convertGraphQLQueryToHTTPBody({})).toEqual('');
      expect(convertGraphQLQueryToHTTPBody({test: '123'})).toEqual('');
    });
    test('should return correct http body for given parameters', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123'})).toEqual(JSON.stringify({query: '123'})));
    test('should return correct http body for given parameters like query and variables', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', variables: '456'})).toEqual(JSON.stringify({query: '123', variables: '456'})));
    test('should return correct http body for given parameters like query and operationName', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', operationName: '456'})).toEqual(JSON.stringify({query: '123', operationName: '456'})));
    test('should return correct http body for all given parameters', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', operationName: '456', variables: '891'})).toEqual(JSON.stringify({query: '123', operationName: '456', variables: '891'})));
    test('should return empty string if query is absent', () =>
      expect(convertGraphQLQueryToHTTPBody({variables: '123'})).toEqual(''));
  });
  describe('getGraphqlRelativeURI util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getGraphqlRelativeURI({})).toEqual('');
      expect(getGraphqlRelativeURI({test: '123'})).toEqual('');
    });
    test('should return correct relativeURI for given parameters', () =>
      expect(getGraphqlRelativeURI({query: '123'})).toEqual('?query=123'));
    test('should return correct relativeURI for given parameters like query and variables', () =>
      expect(getGraphqlRelativeURI({query: '123', variables: '456'})).toEqual('?query=123&variables=456'));
    test('should return correct relativeURI for given parameters like query and operationName', () =>
      expect(getGraphqlRelativeURI({query: '123', operationName: '456'})).toEqual('?query=123&operationName=456'));
    test('should return correct relativeURI for all given parameters', () =>
      expect(getGraphqlRelativeURI({query: '123', operationName: '456', variables: '891'})).toEqual('?query=123&operationName=456&variables=891'));
    test('should return empty string if query is absent', () =>
      expect(getGraphqlRelativeURI({variables: '123'})).toEqual(''));
  });
  describe('getGraphQLObj util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getGraphQLObj()).toEqual({});
      expect(getGraphQLObj({})).toEqual({});
      expect(getGraphQLObj({test: '123'})).toEqual({test: '123'});
    });
    test('should return correct graphql object if value is a stringified object', () => {
      expect(getGraphQLObj(JSON.stringify({query: '123'}))).toEqual({query: '123'});
      expect(getGraphQLObj(JSON.stringify({query: '123', variables: '456'}))).toEqual({query: '123', variables: '456'});
      expect(getGraphQLObj(JSON.stringify({query: '123', operationName: '456'}))).toEqual({query: '123', operationName: '456'});
      expect(getGraphQLObj(JSON.stringify({query: '123', operationName: '456', variables: '891'}))).toEqual({query: '123', operationName: '456', variables: '891'});
    });
    test('should qs.parse the value if it is not a stringified json object', () => {
      expect(getGraphQLObj('?query=123')).toEqual({query: '123'});
      expect(getGraphQLObj('?query=123&variables=456')).toEqual({query: '123', variables: '456'});
    });
  });
  describe('getGraphQLValues util', () => {
    const resource = {
      http: {
        body: JSON.stringify({query: '123', operationName: '456', variables: '891'}),
        relativeURI: '?query=123&variables=456',
      },
    };

    test('should not throw exception for invalid arguments', () => {
      expect(getGraphQLValues({})).toBeUndefined();
      expect(getGraphQLValues({test: '123'})).toBeUndefined();
      expect(getGraphQLValues('test')).toBeUndefined();
    });
    test('should parse the resource for the given path and get the correct field', () => {
      expect(getGraphQLValues({resource, field: 'query', path: 'http.body'})).toEqual('123');
      expect(getGraphQLValues({resource, field: 'operationName', path: 'http.body'})).toEqual('456');
      expect(getGraphQLValues({resource, field: 'variables', path: 'http.body'})).toEqual('891');
    });
    test('should parse the resource for the given path and get the correct field if the resource path value is not stringified json object', () => {
      expect(getGraphQLValues({resource, field: 'query', path: 'http.relativeURI'})).toEqual('123');
      expect(getGraphQLValues({resource, field: 'operationName', path: 'http.relativeURI'})).toEqual(undefined);
      expect(getGraphQLValues({resource, field: 'variables', path: 'http.relativeURI'})).toEqual('456');
    });
  });
  describe('isGraphqlResource util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(isGraphqlResource()).toBeFalsy();
      expect(isGraphqlResource({})).toBeFalsy();
      expect(isGraphqlResource({test: '123'})).toBeFalsy();
      expect(isGraphqlResource('test')).toBeFalsy();
    });
    test('should return false if useParentForm is true', () => {
      expect(isGraphqlResource({useParentForm: true})).toBeFalsy();
    });
    test('should return true if adaptor sub type is graph_ql', () => {
      expect(isGraphqlResource({type: 'graph_ql'})).toBeTruthy();
      expect(isGraphqlResource({adaptorType: 'GraphQLExport'})).toBeTruthy();
      expect(isGraphqlResource({adaptorType: 'GraphQLImport'})).toBeTruthy();
    });
    test('should return false if adaptor sub type is not graph_ql', () => {
      expect(isGraphqlResource({type: 'http'})).toBeFalsy();
      expect(isGraphqlResource({adaptorType: 'HTTPExport'})).toBeFalsy();
      expect(isGraphqlResource({adaptorType: 'HTTPImport'})).toBeFalsy();
    });
    test('should return true if http.formType is graph_ql', () => {
      expect(isGraphqlResource({http: {formType: 'graph_ql'}})).toBeTruthy();
    });
    test('should return false if http.formType is not graph_ql', () => {
      expect(isGraphqlResource({http: {formType: 'http'}})).toBeFalsy();
    });
  });
});

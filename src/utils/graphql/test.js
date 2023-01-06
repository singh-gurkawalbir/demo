
import {convertGraphqlFieldIdToHTTPFieldId, convertGraphQLQueryToHTTPBody, getGraphQLObj, getGraphqlRelativeURI, getGraphQLValues, GRAPHQL_FIELDS, isGraphqlField, isGraphqlResource} from '.';

describe('graphql utils:', () => {
  describe('convertGraphQLQueryToHTTPBody test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(convertGraphQLQueryToHTTPBody({})).toBe('');
      expect(convertGraphQLQueryToHTTPBody({test: '123'})).toBe('');
    });
    test('should return correct http body for given parameters', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123'})).toEqual(JSON.stringify({query: '123'})));
    test('should return correct http body for given parameters like query and variables', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', variables: '456'})).toEqual(JSON.stringify({query: '123', variables: 456})));
    test('should return correct http body for given parameters like query and variables duplicate', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', variables: '{"tryVar":2}'})).toEqual(JSON.stringify({query: '123', variables: {tryVar: 2}})));
    test('should return correct http body for given parameters like query and operationName', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', operationName: '456'})).toEqual(JSON.stringify({query: '123', operationName: '456'})));
    test('should return correct http body for all given parameters', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', operationName: '456', variables: '891'})).toEqual(JSON.stringify({query: '123', operationName: '456', variables: 891})));
    test('should return correct http body for all given parameters duplicate', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', operationName: '456', variables: '{"tryVar":2}'})).toEqual(JSON.stringify({query: '123', operationName: '456', variables: {tryVar: 2}})));
    test('should return correct http body for all variables if variables is not valid JSON', () =>
      expect(convertGraphQLQueryToHTTPBody({query: '123', operationName: '456', variables: '{"tryVar":2'})).toEqual(JSON.stringify({query: '123', operationName: '456', variables: '{"tryVar":2'})));
    test('should return empty string if query is absent', () =>
      expect(convertGraphQLQueryToHTTPBody({variables: '123'})).toBe(''));
  });
  describe('getGraphqlRelativeURI util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getGraphqlRelativeURI({})).toBe('');
      expect(getGraphqlRelativeURI({test: '123'})).toBe('');
    });
    test('should return correct relativeURI for given parameters', () =>
      expect(getGraphqlRelativeURI({query: '123'})).toBe('?query=123'));
    test('should return correct relativeURI for given parameters like query and variables', () =>
      expect(getGraphqlRelativeURI({query: '123', variables: '456'})).toBe('?query=123&variables=456'));
    test('should return correct relativeURI for given parameters like query and operationName', () =>
      expect(getGraphqlRelativeURI({query: '123', operationName: '456'})).toBe('?query=123&operationName=456'));
    test('should return correct relativeURI for all given parameters', () =>
      expect(getGraphqlRelativeURI({query: '123', operationName: '456', variables: '891'})).toBe('?query=123&operationName=456&variables=891'));
    test('should return empty string if query is absent', () =>
      expect(getGraphqlRelativeURI({variables: '123'})).toBe(''));
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
    const resource1 = {
      http: {
        body: JSON.stringify({query: '123', operationName: '456', variables: '{"tryVar": 2'}),
      },
    };
    const resource2 = {
      http: {
        body: JSON.stringify({query: '123', operationName: '456', variables: {tryVar: 2}}),
        relativeURI: '?query=123&variables=456',
      },
    };

    test('should not throw exception for invalid arguments', () => {
      expect(getGraphQLValues({})).toBeUndefined();
      expect(getGraphQLValues({test: '123'})).toBeUndefined();
      expect(getGraphQLValues('test')).toBeUndefined();
    });
    test('should parse the resource for the given path and get the correct field', () => {
      expect(getGraphQLValues({resource, field: 'query', path: 'http.body'})).toBe('123');
      expect(getGraphQLValues({resource, field: 'operationName', path: 'http.body'})).toBe('456');
      expect(getGraphQLValues({resource, field: 'variables', path: 'http.body'})).toBe('891');
      expect(getGraphQLValues({resource: resource2, field: 'variables', path: 'http.body'})).toEqual(JSON.stringify({tryVar: 2}));
      expect(getGraphQLValues({resource: resource1, field: 'variables', path: 'http.body'})).toBe('{"tryVar": 2');
    });
    test('should parse the resource for the given path and get the correct field if the resource path value is not stringified json object', () => {
      expect(getGraphQLValues({resource, field: 'query', path: 'http.relativeURI'})).toBe('123');
      expect(getGraphQLValues({resource, field: 'operationName', path: 'http.relativeURI'})).toBeUndefined();
      expect(getGraphQLValues({resource, field: 'variables', path: 'http.relativeURI'})).toBe('456');
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
  describe('isGraphqlField util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(isGraphqlResource()).toBeFalsy();
      expect(isGraphqlResource({})).toBeFalsy();
      expect(isGraphqlResource({test: '123'})).toBeFalsy();
      expect(isGraphqlResource('test')).toBeFalsy();
    });

    test('should return true for graphql fields', () => {
      GRAPHQL_FIELDS.forEach(field => {
        expect(isGraphqlField(field)).toBeTruthy();
      });
    });

    test('should return false for non graphql fields', () => {
      [
        'http.body',
        'http.paging.body',
        'dummyfield',
      ].forEach(field => {
        expect(isGraphqlField(field)).toBeFalsy();
      });
    });
  });
  describe('convertGraphqlFieldIdToHTTPFieldId util', () => {
    test('should return empty string if no parameters are passed', () => {
      expect(convertGraphqlFieldIdToHTTPFieldId()).toBeUndefined();
    });
    test('should correctly return field id in case ignoreExisting/ignoreMissing is set on the resource', () => {
      const resource1 = {
        _id: '123',
        adaptorType: 'HTTPImport',
        ignoreExisting: true,
      };
      const resource2 = {
        _id: '123',
        adaptorType: 'HTTPImport',
        ignoreExisting: false,
      };

      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.queryCreate', resource1)).toBe('http.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.operationNameCreate', resource1)).toBe('http.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.variablesCreate', resource1)).toBe('http.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.queryUpdate', resource2)).toBe('http.body.0');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.operationNameUpdate', resource2)).toBe('http.body.0');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.variablesUpdate', resource2)).toBe('http.body.0');
    });

    test('should return correct fieldId for paging fields', () => {
      expect(convertGraphqlFieldIdToHTTPFieldId('paging.graphql.query')).toBe('http.paging.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('paging.graphql.operationName')).toBe('http.paging.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('paging.graphql.variables')).toBe('http.paging.body');
    });

    test('should return correct fieldId for graphql export and import fields', () => {
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.query')).toBe('http.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.operationName')).toBe('http.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.variables')).toBe('http.body');
    });
    test('should return correct fieldId for graphql connection fields', () => {
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.query', {}, 'connections')).toBe('http.ping.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.operationName', {}, 'connections')).toBe('http.ping.body');
      expect(convertGraphqlFieldIdToHTTPFieldId('graphql.variables', {}, 'connections')).toBe('http.ping.body');
    });
  });
});

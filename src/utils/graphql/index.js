import get from 'lodash/get';
import qs from 'qs';
import { getResourceSubType } from '../resource';
import { safeParse } from '../string';

// should return http request body from query, variables and operation name
// Example graphql HTTP request body {
//   "query": "query GreetingQuery ($arg1: String) { hello (name: $arg1) { value } }",
//   "operationName": "GreetingQuery",
//   "variables": { "arg1": "Timothy" }
// }
export function convertGraphQLQueryToHTTPBody({query, variables, operationName}) {
  if (!query) return '';
  const httpBody = { query };

  if (operationName !== '') {
    httpBody.operationName = operationName;
  }
  if (variables !== '') {
    httpBody.variables = variables;
  }

  return JSON.stringify(httpBody);
}

export function getGraphqlRelativeURI({query, variables, operationName}) {
  if (!query) return '';
  let relativeURI = `?query=${query}`;

  if (operationName) {
    relativeURI = `${relativeURI}&operationName=${operationName}`;
  }
  if (variables) {
    relativeURI = `${relativeURI}&variables=${variables}`;
  }

  return relativeURI;
}

export function getGraphQLObj(value) {
  let graphqlObj = safeParse(value);

  if (!graphqlObj) {
    graphqlObj = qs.parse(value, { ignoreQueryPrefix: true });
  }

  return graphqlObj;
}

export function getGraphQLValues({resource, field, path, relativeURIPath}) {
  let value = get(resource, path);

  if (!value) {
    value = get(resource, relativeURIPath);
  }

  const graphqlObj = getGraphQLObj(value);

  return graphqlObj?.[field];
}

export const GRAPHQL_JSON_FIELDS = [
  'graphql.variables',
  'graphql.variablesCreate',
  'graphql.variablesUpdate',
  'paging.graphql.variables',
];

export function isGraphqlResource(resource) {
  if (!resource) return false;
  // when use parent form is true, we should not show graphql fields i.e this util returns false
  if (resource.useParentForm) return false;

  const type = getResourceSubType(resource)?.type;

  return type === 'graph_ql' || resource.http?.formType === 'graph_ql';
}

export function isGraphqlField(fieldId) {
  if (!fieldId) return false;

  return fieldId.includes('graphql');
}

export const GRAPHQL_FIELD_MAP = {
  connections: {
    'graphql.query': 'http.ping.body',
    'graphql.operationName': 'http.ping.body',
    'graphql.variables': 'http.ping.body',
  },
  exports: {
    'graphql.query': 'http.body',
    'graphql.operationName': 'http.body',
    'graphql.variables': 'http.body',
    'paging.graphql.query': 'http.paging.body',
    'paging.graphql.operationName': 'http.paging.body',
    'paging.graphql.variables': 'http.paging.body',
  },
  imports: {
    'graphql.query': 'http.body',
    'graphql.operationName': 'http.body',
    'graphql.variables': 'http.body',
    'graphql.queryCreate': 'http.body',
    'graphql.operationNameCreate': 'http.body',
    'graphql.variablesCreate': 'http.body',
    'graphql.queryUpdate': 'http.body',
    'graphql.operationNameUpdate': 'http.body',
    'graphql.variablesUpdate': 'http.body',
  },
};

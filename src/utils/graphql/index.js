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

export const GRAPHQL_FIELDS = [
  'graphql.query',
  'graphql.operationName',
  'graphql.variables',
  'paging.graphql.query',
  'paging.graphql.operationName',
  'paging.graphql.variables',
  'graphql.queryCreate',
  'graphql.operationNameCreate',
  'graphql.variablesCreate',
  'graphql.queryUpdate',
  'graphql.operationNameUpdate',
  'graphql.variablesUpdate',
];

export const GRAPHQL_HTTP_FIELDS = [
  'http.ping.body',
  'http.body',
  'http.body.0',
  'http.body.1',
  'http.paging.body',
];

export function isGraphqlField(fieldId) {
  if (!fieldId) return false;

  return GRAPHQL_FIELDS.includes(fieldId);
}

export function convertGraphqlFieldIdToHTTPFieldId(fieldId, resource, resourceType) {
  const {ignoreExisting, ignoreMissing} = resource || {};

  switch (fieldId) {
    case 'graphql.query':
      if (resourceType === 'connections') { return 'http.ping.body'; }

      return 'http.body';

    case 'graphql.operationName':
      if (resourceType === 'connections') { return 'http.ping.body'; }

      return 'http.body';

    case 'graphql.variables':
      if (resourceType === 'connections') { return 'http.ping.body'; }

      return 'http.body';

    case 'graphql.queryCreate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.1';

    case 'graphql.operationNameCreate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.1';

    case 'graphql.variablesCreate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.1';

    case 'graphql.queryUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.0';

    case 'graphql.operationNameUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.0';

    case 'graphql.variablesUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.0';

    case 'paging.graphql.query':
      return 'http.paging.body';

    case 'paging.graphql.operationName':
      return 'http.paging.body';

    case 'paging.graphql.variables':
      return 'http.paging.body';

    default:
  }

  return fieldId;
}

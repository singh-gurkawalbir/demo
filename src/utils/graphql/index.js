import _ from 'lodash';
import qs from 'qs';
import { safeParse } from '../string';

export function convertGraphQLQueryToHTTPBody({query, variables, operationName}) {
  // should return http request body from query, variables and operation name
  // Example graphql HTTP request body {
  //   "query": "query GreetingQuery ($arg1: String) { hello (name: $arg1) { value } }",
  //   "operationName": "GreetingQuery",
  //   "variables": { "arg1": "Timothy" }
  // }

  const httpBody = { query };

  if (operationName !== '') {
    httpBody.operationName = operationName;
  }
  if (variables !== '') {
    httpBody.variables = variables;
  }

  return JSON.stringify(httpBody);
}

export function getGraphqlRelativeURI(query, variables, operationName) {
  let relativeURI = `?query=${query}`;

  if (variables) {
    relativeURI = `${relativeURI}&variables=${variables}`;
  }
  if (operationName) {
    relativeURI = `${relativeURI}&operationName=${operationName}`;
  }

  return relativeURI;
}

function getGraphQLObj(value) {
  let grapqhqlObj = safeParse(value);

  if (!grapqhqlObj) {
    // isPaging is not applicable to paging relative URI
    grapqhqlObj = qs.parse(value, { ignoreQueryPrefix: true });
  }

  return grapqhqlObj;
}

export function getGraphQLValues({resource, field, path}) {
  const grapqhqlObj = getGraphQLObj(_.get(resource, path));

  return grapqhqlObj?.[field];
}

export const GRAPHQL_JSON_FIELDS = [
  'graphql.variables',
  'graphql.variablesCreate',
  'graphql.variablesUpdate',
  'paging.graphql.variables',
];

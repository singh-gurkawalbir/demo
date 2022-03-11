import { getGraphQLValues } from '../../../../utils/graphql';

export default {
  fieldMap: {
    'http.method': {
      id: 'http.method',
      type: 'select',
      label: 'HTTP method',
      required: true,
      options: [
        {
          items: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
          ],
        },
      ],
    },
    'graphql.query': {
      id: 'graphql.query',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
      defaultValue: r => getGraphQLValues({resource: r, field: 'query', path: 'http.body'}),
    },
    'graphql.operationName': {
      id: 'graphql.operationName',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
      defaultValue: r => getGraphQLValues({resource: r, field: 'operationName', path: 'http.body'}),
    },
    'graphql.variables': {
      id: 'graphql.variables',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
      defaultValue: r => getGraphQLValues({resource: r, field: 'variables', path: 'http.body'}),
    },
  },
  layout: {
    fields: ['http.method', 'graphql.query', 'graphql.operationName', 'graphql.variables'],
  },
};

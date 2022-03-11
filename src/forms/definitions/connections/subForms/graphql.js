import { getGraphQLValues } from '../../../../utils/graphql';

export default {
  fieldMap: {
    'http.ping.method': {
      id: 'http.ping.method',
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
      defaultValue: r => getGraphQLValues(r, 'query'),
    },
    'graphql.operationName': {
      id: 'graphql.operationName',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
      defaultValue: r => getGraphQLValues(r, 'operationName'),
    },
    'graphql.variables': {
      id: 'graphql.variables',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
      defaultValue: r => getGraphQLValues(r, 'variables'),
    },
  },
  layout: {
    fields: ['http.ping.method', 'graphql.query', 'graphql.operationName', 'graphql.variables'],
  },
};

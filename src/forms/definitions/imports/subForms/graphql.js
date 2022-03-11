import { getGraphQLValues } from '../../../../utils/graphql';

export default {
  fieldMap: {
    'graphql.query': {
      id: 'graphql.query',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
      defaultValue: r => getGraphQLValues({resource: r, field: 'query', path: 'http.body[0]'}),
    },
    'graphql.operationName': {
      id: 'graphql.operationName',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
      defaultValue: r => getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[0]'}),
    },
    'graphql.variables': {
      id: 'graphql.variables',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
      defaultValue: r => getGraphQLValues({resource: r, field: 'variables', path: 'http.body[0]'}),
    },
  },
  layout: {
    fields: ['graphql.query', 'graphql.operationName', 'graphql.variables'],
  },
};

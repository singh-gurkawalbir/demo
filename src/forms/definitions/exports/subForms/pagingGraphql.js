import { getGraphQLValues } from '../../../../utils/graphql';

export default {
  fieldMap: {
    'paging.graphql.query': {
      id: 'paging.graphql.query',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
      defaultValue: r => getGraphQLValues({resource: r, field: 'query', path: 'http.paging.body'}),
      visibleWhen: [{
        field: 'http.paging.method',
        is: ['body'],
      }],
      noApi: true,
      showLookup: false,
    },
    'paging.graphql.operationName': {
      id: 'paging.graphql.operationName',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
      defaultValue: r => getGraphQLValues({resource: r, field: 'operationName', path: 'http.paging.body'}),
      visibleWhen: [{
        field: 'http.paging.method',
        is: ['body'],
      }],
      noApi: true,
      showLookup: false,
    },
    'paging.graphql.variables': {
      id: 'paging.graphql.variables',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
      defaultValue: r => getGraphQLValues({resource: r, field: 'variables', path: 'http.paging.body'}),
      visibleWhen: [{
        field: 'http.paging.method',
        is: ['body'],
      }],
      noApi: true,
      showLookup: false,
    },
  },
  layout: {
    fields: ['paging.graphql.query', 'paging.graphql.operationName', 'paging.graphql.variables'],
  },
};

import { getGraphQLValues } from '../../../../utils/graphql';

export default {
  fieldMap: {
    'graphql.queryCreate': {
      id: 'graphql.queryCreate',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
      defaultValue: r => {
        if (!r || !r.http || !r.http.method) {
          return '';
        }
        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return getGraphQLValues({resource: r, field: 'query', path: 'http.body[1]'}) || '';
          }

          return getGraphQLValues({resource: r, field: 'query', path: 'http.body[0]'}) || '';
        }

        return '';
      },
      noApi: true,
      showLookup: false,
    },
    'graphql.operationNameCreate': {
      id: 'graphql.operationNameCreate',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
      defaultValue: r => {
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[1]'}) || '';
          }

          return getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[0]'}) || '';
        }

        return '';
      },
      noApi: true,
      showLookup: false,
    },
    'graphql.variablesCreate': {
      id: 'graphql.variablesCreate',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
      defaultValue: r => {
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          if (r.http.method.length > 1) {
            return getGraphQLValues({resource: r, field: 'variables', path: 'http.body[1]'}) || '';
          }

          return getGraphQLValues({resource: r, field: 'variables', path: 'http.body[0]'}) || '';
        }

        return '';
      },
      noApi: true,
      showLookup: false,
    },
  },
  layout: {
    fields: ['graphql.queryCreate', 'graphql.operationNameCreate', 'graphql.variablesCreate'],
  },
};

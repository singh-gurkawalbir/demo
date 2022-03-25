import { getGraphQLValues } from '../../../../utils/graphql';

export default {
  fieldMap: {
    'graphql.queryUpdate': {
      id: 'graphql.queryUpdate',
      type: 'uri',
      label: 'Query',
      required: true,
      helpKey: 'connection.graphql.query',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
        {
          field: 'http.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
      defaultValue: r => {
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          return getGraphQLValues({resource: r, field: 'query', path: 'http.body[0]'}) || '';
        }

        return '';
      },
      noApi: true,
      showLookup: false,
    },
    'graphql.operationNameUpdate': {
      id: 'graphql.operationNameUpdate',
      type: 'uri',
      label: 'Operation name',
      helpKey: 'connection.graphql.operationName',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
        {
          field: 'http.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
      defaultValue: r => {
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          return getGraphQLValues({resource: r, field: 'operationName', path: 'http.body[0]'}) || '';
        }

        return '';
      },
      noApi: true,
      showLookup: false,
    },
    'graphql.variablesUpdate': {
      id: 'graphql.variablesUpdate',
      type: 'uri',
      label: 'Variables',
      helpKey: 'connection.graphql.variables',
      visibleWhenAll: [
        {
          field: 'http.compositeType',
          is: ['createandupdate', 'updateandignore'],
        },
        {
          field: 'http.method',
          is: ['COMPOSITE'],
        },
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
      defaultValue: r => {
        if (!r || !r.http || !r.http.method) {
          return '';
        }

        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          return getGraphQLValues({resource: r, field: 'variables', path: 'http.body[0]'}) || '';
        }

        return '';
      },
      noApi: true,
      showLookup: false,
    },
  },
  layout: {
    fields: ['graphql.queryUpdate', 'graphql.operationNameUpdate', 'graphql.variablesUpdate'],
  },
};

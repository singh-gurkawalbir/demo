import { convertGraphQLQueryToHTTPBody, getGraphQLValues } from '../../../utils/graphql';
import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    // graphql specific values
    retValues['/http/formType'] = 'graph_ql';
    retValues['/http/relativeURI'] = '/';
    retValues['/http/mediaType'] = 'json';
    if (!retValues['/http/body']) {
      retValues['/http/body'] = convertGraphQLQueryToHTTPBody({
        query: retValues['/graphql/query'],
        variables: retValues['/graphql/variables'],
        operationName: retValues['/graphql/operationName'],
      });
    }
    // graphql specific values end

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      retValues['/http/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
      delete retValues['/http/once/relativeURI'];
      delete retValues['/http/once/body'];
      delete retValues['/http/once/method'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateFormat'];
      delete retValues['/delta/lagOffset'];
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
    }

    delete retValues['/outputMode'];

    if (retValues['/http/paging/method'] === 'page') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'relativeuri') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'linkheader') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'skip') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
      retValues['/http/paging/body'] = undefined;
    } else if (retValues['/http/paging/method'] === 'body') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/body'] = convertGraphQLQueryToHTTPBody({
        query: retValues['/paging/graphql/query'],
        variables: retValues['/paging/graphql/variables'],
        operationName: retValues['/paging/graphql/operationName'],
      });
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
    } else {
      retValues['/http/paging'] = undefined;
      delete retValues['/http/paging/method'];
      delete retValues['/http/paging/path'];
      delete retValues['/http/paging/relativeURI'];
      delete retValues['/http/paging/resourcePath'];
      delete retValues['/http/paging/token'];
      delete retValues['/http/paging/linkHeaderRelation'];
      delete retValues['/http/paging/skip'];
      delete retValues['/http/paging/pathAfterFirstRequest'];
      delete retValues['/http/paging/page'];
      delete retValues['/http/paging/maxPagePath'];
      delete retValues['/http/paging/maxCountPath'];
      delete retValues['/http/paging/body'];
      delete retValues['/http/paging/lastPageStatusCode'];
      delete retValues['/http/paging/lastPagePath'];
      delete retValues['/http/paging/lastPageValues'];
    }

    retValues['/statusExport'] = undefined;

    // we need 2 separate UI fields for path for url and token paging methods
    // to have diff help texts and labels
    if (retValues['/http/paging/method'] === 'url') {
      retValues['/http/paging/path'] = retValues['/http/paging/urlPath'];
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/path'] = retValues['/http/paging/tokenPath'];
    }
    delete retValues['/http/paging/urlPath'];
    delete retValues['/http/paging/tokenPath'];
    delete retValues['/graphql/query'];
    delete retValues['/graphql/operationName'];
    delete retValues['/graphql/variables'];
    retValues['/adaptorType'] = 'HTTPExport';

    return {
      ...retValues,
    };
  },

  fieldMap: {
    common: { formId: 'common' },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
      label: 'Output mode',
      required: true,
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'blob';

        return 'records';
      },
    },
    'http.response.resourcePath': {
      id: 'http.response.resourcePath',
      isLoggable: true,
      type: 'text',
      label: r => {
        if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'Path to file in HTTP response body'; }

        return 'Path to records in HTTP response body';
      },
      helpKey: r => {
        if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'export.http.response.file.resourcePath'; }

        return 'export.http.response.resourcePath';
      },
      requiredWhen: [
        {
          field: 'http.successMediaType',
          is: ['xml'],
        },
      ],
      defaultValue: r => r?.resourceType === 'lookupFiles' || r?.type === 'blob' ? '' : 'data',
    },
    type: {
      id: 'type',
      type: 'selectwithvalidations',
      label: 'Export type',
      required: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        // if (isNew) return '';
        const output = r && r.type;

        return isNew ? output : output || 'all';
      },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data',
              value: 'delta',
              regex: /.*{{.*lastExportDateTime.*}}/,
              description: 'Add {{lastExportDateTime}} to either the relative URI or HTTP request body to complete the setup.',
              helpKey: 'export.delta',
            },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Test – export only 1 record', value: 'test' },
          ],
        },
      ],
    },
    'delta.dateFormat': {
      fieldId: 'delta.dateFormat',
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'http.once.relativeURI': {
      fieldId: 'http.once.relativeURI',
    },
    'http.once.body': {
      fieldId: 'http.once.body',
    },
    'http.once.method': {
      fieldId: 'http.once.method',
    },
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'textwithconnectioncontext',
      label: 'Boolean field to mark records as exported',
      visibleWhenAll: [
        { field: 'type', is: ['once'] },
      ],
      connectionId: r => r?._connectionId,
    },
    'http.paging.method': {
      id: 'http.paging.method',
      isLoggable: true,
      type: 'selectwithvalidations',
      label: 'Paging method',
      options: [
        {
          items: [
            { label: 'Next page token (cursor)',
              value: 'token',
              regex: /.*{{.*export\.http\.paging\.token.*}}/,
              description: 'Add {{export.http.paging.token}} to either the relative URI or HTTP request body to complete the setup.',
              helpKey: 'export.paging.token',
            },
            { label: 'Custom relative URI', value: 'relativeuri' },
            { label: 'Custom request body', value: 'body' },
          ],
        },
      ],
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'http.paging.skip': { fieldId: 'http.paging.skip' },
    'http.paging.page': { fieldId: 'http.paging.page' },
    'http.paging.token': { fieldId: 'http.paging.token' },
    'http.paging.urlPath': { fieldId: 'http.paging.urlPath' },
    'http.paging.tokenPath': { fieldId: 'http.paging.tokenPath' },
    'http.paging.relativeURI': { fieldId: 'http.paging.relativeURI' },
    'http.paging.linkHeaderRelation': {
      fieldId: 'http.paging.linkHeaderRelation',
    },
    'http.paging.pathAfterFirstRequest': {
      fieldId: 'http.paging.pathAfterFirstRequest',
    },
    'http.paging.resourcePath': { fieldId: 'http.paging.resourcePath', defaultValue: 'data' },
    'http.paging.maxPagePath': { fieldId: 'http.paging.maxPagePath' },
    'http.paging.maxCountPath': { fieldId: 'http.paging.maxCountPath' },
    'http.paging.lastPageStatusCode': {
      fieldId: 'http.paging.lastPageStatusCode',
    },
    'http.paging.lastPagePath': { fieldId: 'http.paging.lastPagePath' },
    'http.paging.lastPageValues': { fieldId: 'http.paging.lastPageValues' },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    configureAsyncHelper: {
      fieldId: 'configureAsyncHelper',
      defaultValue: r => !!(r && r.http && r.http._asyncHelperId),
      visible: r => !(r && r.statusExport),
      visibleWhen: r => {
        if (r && r.statusExport) return [];

        return [
          {
            field: 'outputMode',
            is: ['records'],
          },
        ];
      },
    },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
    },
    formView: { fieldId: 'formView' },
    semiassistantoperationselect: {fieldId: 'semiassistantoperationselect', visibleWhenAll: [{field: 'formView', isNot: ['true']}]},
    graphql: {
      formId: 'graphql',
    },
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
    },
  },

  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'outputMode', 'exportOneToMany', 'formView', 'semiassistantoperationselect'] },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'Where would you like to transfer from?';

          return 'What would you like to export?';
        },
        fields: ['graphql', 'http.response.blobFormat'],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: [
          'type',
          'delta.dateFormat',
          'delta.lagOffset',
          'once.booleanField',
          'http.once.method',
          'http.once.relativeURI',
          'http.once.body',
        ],
      },
      {
        collapsed: true,
        label: 'Does this API use paging?',
        fields: [
          'http.paging.method',
          'paging.graphql.query',
          'paging.graphql.operationName',
          'paging.graphql.variables',
          'http.paging.skip',
          'http.paging.page',
          'http.paging.urlPath',
          'http.paging.tokenPath',
          'http.paging.token',
          'http.paging.relativeURI',
          'http.paging.linkHeaderRelation',
          'http.paging.pathAfterFirstRequest',
          'http.paging.resourcePath',
          'http.paging.maxPagePath',
          'http.paging.maxCountPath',
          'http.paging.lastPageStatusCode',
          'http.paging.lastPagePath',
          'http.paging.lastPageValues',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: ['http.response.resourcePath'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'configureAsyncHelper',
          'http._asyncHelperId',
          'advancedSettings',
        ],
      },
    ],
  },
};

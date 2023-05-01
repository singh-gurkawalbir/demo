import { convertGraphQLQueryToHTTPBody, getGraphqlRelativeURI } from '../../../utils/graphql';
import { isNewId } from '../../../utils/resource';
import http from './http';
import { LAST_EXPORT_DATE_TIME_REGEX_STRING, HTTP_PAGING_TOKEN_REGEX_STRING } from '../../../constants';

export default {
  preSave: formValues => {
    const retValues = {...formValues};

    retValues['/http/formType'] = 'graph_ql';
    retValues['/http/mediaType'] = 'json';

    retValues['/http/body'] = convertGraphQLQueryToHTTPBody({
      query: retValues['/graphql/query'],
      variables: retValues['/graphql/variables'],
      operationName: retValues['/graphql/operationName'],
    });
    retValues['/http/paging/body'] = convertGraphQLQueryToHTTPBody({
      query: retValues['/paging/graphql/query'],
      variables: retValues['/paging/graphql/variables'],
      operationName: retValues['/paging/graphql/operationName'],
    });

    if (retValues['/http/method'] === 'GET') {
      retValues['/http/body'] = undefined;

      retValues['/http/relativeURI'] = getGraphqlRelativeURI({
        query: retValues['/graphql/query'],
        variables: retValues['/graphql/variables'],
        operationName: retValues['/graphql/operationName'],
      });
    }
    delete retValues['/graphql/query'];
    delete retValues['/graphql/operationName'];
    delete retValues['/graphql/variables'];
    delete retValues['/paging/graphql/query'];
    delete retValues['/paging/graphql/operationName'];
    delete retValues['/paging/graphql/variables'];

    return http.preSave(retValues);
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
      defaultValue: r => (r?.http?.response?.resourcePath) || (r?.resourceType === 'lookupFiles' || r?.type === 'blob' ? '' : 'data'),
    },
    type: {
      id: 'type',
      type: 'selectwithvalidations',
      label: 'Export type',
      isLoggable: true,
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
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data',
              value: 'delta',
              regex: LAST_EXPORT_DATE_TIME_REGEX_STRING,
              description: 'Add {{lastExportDateTime}} to either the relative URI or HTTP request body to complete the setup.',
              helpKey: 'export.delta',
            },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Limit – export a set number of records', value: 'test' },
          ],
        },
      ],
    },
    'test.limit': {fieldId: 'test.limit'},
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
      isLoggable: true,
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
              regex: HTTP_PAGING_TOKEN_REGEX_STRING,
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
    'http.paging.resourcePath': { fieldId: 'http.paging.resourcePath' },
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
    graphql: {formId: 'graphql'},
    pagingGraphql: {formId: 'pagingGraphql' },
    mockOutput: {fieldId: 'mockOutput'},
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
          'test.limit',
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
          'pagingGraphql',
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
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
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

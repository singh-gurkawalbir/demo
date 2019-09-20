export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    if (retValues['/http/paging/method'] !== 'page') {
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
    }

    if (retValues['/http/paging/method'] !== 'url') {
      retValues['/http/paging/path'] = undefined;
    }

    if (retValues['/http/paging/method'] !== 'relativeuri') {
      retValues['/http/paging/relativeURI'] = undefined;
    }

    if (retValues['/http/paging/method'] !== 'linkheader') {
      retValues['/http/paging/linkHeaderRelation'] = undefined;
    }

    if (retValues['/http/paging/method'] !== 'skip') {
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
    }

    if (retValues['/http/paging/method'] !== 'token') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'http.method': { fieldId: 'http.method' },
    'http.headers': { fieldId: 'http.headers' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.body': { fieldId: 'http.body' },
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.successValues': { fieldId: 'http.response.successValues' },
    'http.response.errorPath': { fieldId: 'http.response.errorPath' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      required: true,
      defaultValue: r => (r && r.type ? r.type : 'all'),
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
          ],
        },
      ],
    },
    'delta.dateFormat': {
      fieldId: 'delta.dateFormat',
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'http.paging.method': { fieldId: 'http.paging.method' },
    'http.paging.skip': { fieldId: 'http.paging.skip' },
    'http.paging.page': { fieldId: 'http.paging.page' },
    'http.paging.token': { fieldId: 'http.paging.token' },
    'http.paging.path': { fieldId: 'http.paging.path' },
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
    'transform.expression.rules': { fieldId: 'transform.expression.rules' },
    hooks: { formId: 'hooks' },
    advancedSettings: { formId: 'advancedSettings' },
    configureAsyncHelper: { fieldId: 'configureAsyncHelper' },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
      visibleWhen: [{ field: 'configureAsyncHelper', is: [true] }],
    },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      'http.method',
      'http.headers',
      'http.relativeURI',
      'http.body',
      'http.successMediaType',
      'http.errorMediaType',
      'http.response.resourcePath',
      'http.response.successPath',
      'http.response.successValues',
      'http.response.errorPath',
      'type',
      'delta.dateFormat',
      'delta.lagOffset',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Does this API support paging?',
        fields: [
          'http.paging.method',
          'http.paging.skip',
          'http.paging.page',
          'http.paging.token',
          'http.paging.path',
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
        label: 'Would you like to transform the records?',
        fields: ['transform.expression.rules'],
      },
      {
        collapsed: true,
        label: 'Hooks (Optional, Developers Only)',
        fields: ['hooks'],
      },
      {
        collapsed: 'true',
        label: 'Advanced',
        fields: [
          'advancedSettings',
          'configureAsyncHelper',
          'http._asyncHelperId',
        ],
      },
    ],
  },
};

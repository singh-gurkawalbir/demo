export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    if (retValues['/http/paging/method'] === 'page') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
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
    } else if (retValues['/http/paging/method'] === 'skip') {
      retValues['/http/paging/path'] = undefined;
      retValues['/http/paging/relativeURI'] = undefined;
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/pathAfterFirstRequest'] = undefined;
      retValues['/http/paging/resourcePath'] = undefined;
      retValues['/http/paging/token'] = undefined;
      retValues['/http/paging/page'] = undefined;
    } else if (retValues['/http/paging/method'] === 'token') {
      retValues['/http/paging/linkHeaderRelation'] = undefined;
      retValues['/http/paging/skip'] = undefined;
      retValues['/http/paging/page'] = undefined;
      retValues['/http/paging/maxPagePath'] = undefined;
      retValues['/http/paging/maxCountPath'] = undefined;
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      label: 'Output Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r =>
        r && r.http && r.http.response && r.http.response.blobFormat
          ? 'blob'
          : 'records',
    },
    'http.method': { fieldId: 'http.method' },
    'http.headers': { fieldId: 'http.headers' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.body': { fieldId: 'http.body' },
    'http.successMediaType': { fieldId: 'http.successMediaType' },
    'http.errorMediaType': { fieldId: 'http.errorMediaType' },
    'http.response.resourcePath': { fieldId: 'http.response.resourcePath' },
    'http.response.successPath': { fieldId: 'http.response.successPath' },
    'http.response.successValues': {
      fieldId: 'http.response.successValues',
    },
    'http.response.errorPath': { fieldId: 'http.response.errorPath' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      required: true,
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
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
      fieldId: 'once.booleanField',
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
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    configureAsyncHelper: {
      fieldId: 'configureAsyncHelper',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'http._asyncHelperId': {
      fieldId: 'http._asyncHelperId',
    },
  },
  layout: {
    fields: [
      'common',
      'outputMode',
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
      'once.booleanField',
      'http.once.relativeURI',
      'http.once.method',
      'http.once.body',
      'http.response.blobFormat',
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

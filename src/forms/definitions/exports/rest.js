export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    if (retValues['/rest/pagingMethod'] !== 'pageargument') {
      retValues['/rest/pageArgument'] = undefined;
    }

    if (retValues['/rest/pagingMethod'] !== 'nextpageurl') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
    }

    if (retValues['/rest/pagingMethod'] !== 'relativeuri') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
    }

    if (retValues['/rest/pagingMethod'] !== 'linkheader') {
      retValues['/rest/linkHeaderRelation'] = undefined;
    }

    if (retValues['/rest/pagingMethod'] !== 'skipargument') {
      retValues['/rest/skipArgument'] = undefined;
    }

    if (retValues['/rest/pagingMethod'] !== 'token') {
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
    }

    if (retValues['/rest/pagingMethod'] !== 'postbody') {
      retValues['/rest/pagingPostBody'] = undefined;
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
    'rest.method': {
      fieldId: 'rest.method',
      options: [
        {
          items: [
            { label: 'GET', value: 'GET' },
            { label: 'PUT', value: 'PUT' },
            { label: 'POST', value: 'POST' },
          ],
        },
      ],
    },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.postBody': {
      fieldId: 'rest.postBody',
      visibleWhen: [{ field: 'rest.method', is: ['POST', 'PUT'] }],
    },
    'rest.resourcePath': { fieldId: 'rest.resourcePath' },
    'rest.successPath': { fieldId: 'rest.successPath' },
    'rest.successValues': { fieldId: 'rest.successValues' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      defaultValue: r => (r && r.type ? r.type : 'all'),
      required: true,
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
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'rest.once.booleanField': {
      fieldId: 'rest.once.booleanField',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.once.relativeURI': {
      fieldId: 'rest.once.relativeURI',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.once.method': {
      fieldId: 'rest.once.method',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'rest.once.postBody': {
      fieldId: 'rest.once.postBody',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    rawData: { fieldId: 'rawData' },
    'rest.pagingMethod': { fieldId: 'rest.pagingMethod' },
    'rest.nextPagePath': { fieldId: 'rest.nextPagePath' },
    'rest.linkHeaderRelation': { fieldId: 'rest.linkHeaderRelation' },
    'rest.skipArgument': { fieldId: 'rest.skipArgument' },
    'rest.nextPageRelativeURI': { fieldId: 'rest.nextPageRelativeURI' },
    'rest.pageArgument': { fieldId: 'rest.pageArgument' },
    'rest.pagingPostBody': { fieldId: 'rest.pagingPostBody' },
    'rest.maxPagePath': { fieldId: 'rest.maxPagePath' },
    'rest.maxCountPath': { fieldId: 'rest.maxCountPath' },
    'rest.lastPageStatusCode': { fieldId: 'rest.lastPageStatusCode' },
    'rest.lastPagePath': { fieldId: 'rest.lastPagePath' },
    'rest.lastPageValue': { fieldId: 'rest.lastPageValue' },
    transform: { fieldId: 'transform' },
    hooks: { formId: 'hooks' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      'rest.method',
      'rest.headers',
      'rest.relativeURI',
      'rest.postBody',
      'rest.resourcePath',
      'rest.successPath',
      'rest.successValues',
      'type',
      'delta.dateFormat',
      'delta.lagOffset',
      'rest.once.booleanField',
      'rest.once.relativeURI',
      'rest.once.method',
      'rest.once.postBody',
      'rawData',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Does this API support paging?',
        fields: [
          'rest.pagingMethod',
          'rest.nextPagePath',
          'rest.linkHeaderRelation',
          'rest.skipArgument',
          'rest.nextPageRelativeURI',
          'rest.pageArgument',
          'rest.pagingPostBody',
          'rest.maxPagePath',
          'rest.maxCountPath',
          'rest.lastPageStatusCode',
          'rest.lastPagePath',
          'rest.lastPageValue',
        ],
      },
      {
        collapsed: true,
        label: 'Would you like to transform the records?',
        fields: ['transform'],
      },
      {
        collapsed: true,
        label: 'Hooks (Optional, Developers Only)',
        fields: ['hooks'],
      },
      { collapsed: 'true', label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

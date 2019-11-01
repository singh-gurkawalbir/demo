export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    if (retValues['/rest/pagingMethod'] === 'pageargument') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'nextpageurl') {
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'relativeuri') {
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'linkheader') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'skipargument') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'token') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pagingPostBody'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
    } else if (retValues['/rest/pagingMethod'] === 'postbody') {
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/nextPagePath'] = undefined;
      retValues['/rest/linkHeaderRelation'] = undefined;
      retValues['/rest/nextPageRelativeURI'] = undefined;
      retValues['/rest/pageArgument'] = undefined;
      retValues['/rest/skipArgument'] = undefined;
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
        r && r.rest && r.rest.blobFormat ? 'blob' : 'records',
    },
    'rest.method': {
      fieldId: 'rest.method',
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
    'rest.blobFormat': { fieldId: 'rest.blobFormat' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
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
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
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
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
  },
  layout: {
    fields: [
      'common',
      'outputMode',
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
      'once.booleanField',
      'rest.once.relativeURI',
      'rest.once.method',
      'rest.once.postBody',
      'rest.blobFormat',
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
      { collapsed: 'true', label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

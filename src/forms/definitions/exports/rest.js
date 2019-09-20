export default {
  preSubmit: formValues => {
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
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    {
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
    { fieldId: 'rest.headers' },
    { fieldId: 'rest.relativeURI' },
    {
      fieldId: 'rest.postBody',
      visibleWhen: [
        {
          field: 'rest.method',
          is: ['POST', 'PUT'],
        },
      ],
    },
    { fieldId: 'rest.resourcePath' },
    { fieldId: 'rest.successPath' },
    { fieldId: 'rest.successValues' },
    {
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
    {
      fieldId: 'delta.dateFormat',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    {
      fieldId: 'delta.lagOffset',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    {
      fieldId: 'rest.once.booleanField',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    {
      fieldId: 'rest.once.relativeURI',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    {
      fieldId: 'rest.once.method',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    {
      fieldId: 'rest.once.postBody',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Does this API support paging?',
      collapsed: true,
      fields: [
        { fieldId: 'rest.pagingMethod' },
        { fieldId: 'rest.nextPagePath' },
        { fieldId: 'rest.linkHeaderRelation' },
        { fieldId: 'rest.skipArgument' },
        { fieldId: 'rest.nextPageRelativeURI' },
        { fieldId: 'rest.pageArgument' },
        { fieldId: 'rest.pagingPostBody' },
        { fieldId: 'rest.maxPagePath' },
        { fieldId: 'rest.maxCountPath' },
        { fieldId: 'rest.lastPageStatusCode' },
        { fieldId: 'rest.lastPagePath' },
        { fieldId: 'rest.lastPageValue' },
      ],
    },
    {
      header: 'Would you like to transform the records?',
      collapsed: true,
      fields: [{ fieldId: 'transform.expression.rules' }],
    },

    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: true,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced',
      collapsed: 'true',
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};

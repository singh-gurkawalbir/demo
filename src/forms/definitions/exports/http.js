export default {
  preSubmit: formValues => {
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
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    { fieldId: 'http.method' },
    { fieldId: 'http.headers' },
    { fieldId: 'http.relativeURI' },
    { fieldId: 'http.body' },
    { fieldId: 'http.successMediaType' },
    { fieldId: 'http.errorMediaType' },
    { fieldId: 'http.response.resourcePath' },
    { fieldId: 'http.response.successPath' },
    { fieldId: 'http.response.successValues' },
    { fieldId: 'http.response.errorPath' },
    {
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
  ],
  fieldSets: [
    {
      header: 'Does this API support paging?',
      collapsed: true,
      fields: [
        { fieldId: 'http.paging.method' },
        { fieldId: 'http.paging.skip' },
        { fieldId: 'http.paging.page' },
        { fieldId: 'http.paging.token' },
        { fieldId: 'http.paging.path' },
        { fieldId: 'http.paging.relativeURI' },
        { fieldId: 'http.paging.linkHeaderRelation' },
        { fieldId: 'http.paging.pathAfterFirstRequest' },
        { fieldId: 'http.paging.resourcePath' },
        { fieldId: 'http.paging.maxPagePath' },
        { fieldId: 'http.paging.maxCountPath' },
        { fieldId: 'http.paging.lastPageStatusCode' },
        { fieldId: 'http.paging.lastPagePath' },
        { fieldId: 'http.paging.lastPageValues' },
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
      fields: [
        { formId: 'advancedSettings' },
        { fieldId: 'configureAsyncHelper' },
        {
          fieldId: 'http._asyncHelperId',
          visibleWhen: [
            {
              field: 'configureAsyncHelper',
              is: [true],
            },
          ],
        },
      ],
    },
  ],
};

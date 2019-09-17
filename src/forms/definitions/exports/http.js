export default {
  preSubmit: formValues => {
    const newValues = { ...formValues };

    if (newValues['/type'] === 'all') {
      delete newValues['/type'];
    } else if (newValues['/type'] === 'test') {
      newValues['/test/limit'] = 1;
    }

    // TODO: No need of this as success values is shown only when successPath is filled
    // But, getting [] as value because of delimiter prop on text field, though not visible.
    if (!newValues['/http/response/successPath']) {
      delete newValues['/http/response/successValues'];
    }

    return newValues;
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
    {
      fieldId: 'http.response.successValues',
      visibleWhen: [
        {
          field: 'http.response.successPath',
          isNot: [''],
        },
      ],
    },
    { fieldId: 'http.response.errorPath' },
    {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      required: true,
      defaultValue: r => (r && r.type) || 'all',
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
    { fieldId: 'rawData' },
    { fieldId: 'sampleData' },
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

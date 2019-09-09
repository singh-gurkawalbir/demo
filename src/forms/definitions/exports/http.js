export default {
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

export default {
  fields: [
    { formId: 'common' },
    { fieldId: 'exportData' },
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
    { fieldId: 'delta.dateFormat' },
    { fieldId: 'delta.lagOffset' },
  ],
  fieldSets: [
    {
      header: 'Does this API support paging?',
      collapsed: false,
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
      collapsed: false,
      fields: [{ fieldId: 'transform.expression.rules' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced Settings',
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

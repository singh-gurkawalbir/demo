export default {
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
    { fieldId: 'rest.relativeuri' },
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
    { fieldId: 'type' },
    { fieldId: 'delta.dateFormat' },
    { fieldId: 'delta.lagOffset' },
    { fieldId: 'rest.once.booleanField' },
    { fieldId: 'rest.once.relativeURI' },
    { fieldId: 'rest.once.method' },
    { fieldId: 'rest.once.postBody' },
  ],
  fieldSets: [
    {
      header: 'Does this API support paging?',
      collapsed: false,
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
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};

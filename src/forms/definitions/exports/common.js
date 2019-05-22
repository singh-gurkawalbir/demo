export default {
  fields: [
    { fieldId: 'name' },
    { fieldId: 'description' },
    {
      formId: 'ftp',
      visibleWhenAll: [
        {
          field: 'assistant',
          is: ['ftp'],
        },
      ],
    },
    {
      fieldId: 'transform.expression.rules',
      visibleWhen: [
        {
          field: 'assistant',
          is: ['ftp'],
        },
      ],
    },
    { fieldId: 'asynchronous' },
    { fieldId: 'apiIdentifier' },
    { fieldId: 'type' },
    { fieldId: 'pageSize' },
    { fieldId: 'dataURITemplate' },
    { fieldId: 'oneToMany' },
    { fieldId: 'pathToMany' },
    { fieldId: 'sampleData' },
    { fieldId: 'originSampleData' },
    { fieldId: 'assistantMetadata' },
    { fieldId: 'isLookup' },
    { fieldId: 'useTechAdaptorForm' },
    { fieldId: 'adaptorType' },
  ],
  fieldSets: [],
};

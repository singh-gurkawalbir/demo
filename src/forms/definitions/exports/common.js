export default {
  fields: [
    { fieldId: 'name' },
    { fieldId: 'description' },
    { fieldId: 'assistant' },
    { fieldId: '_connectionId' },
    {
      formId: 'ftp',
      visibleWhen: [
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

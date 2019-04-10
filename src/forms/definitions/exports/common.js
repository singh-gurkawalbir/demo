export default {
  fields: [
    { fieldId: 'name' },
    { fieldId: 'description' },
    { fieldId: 'assistant' },
    {
      formId: 'ftp',
      visibleWhen: [
        {
          field: 'assistant',
          is: ['ftp'],
        },
      ],
    },
    { fieldId: '_connectionId' },
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

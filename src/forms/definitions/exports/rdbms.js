export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportRdbmsData',
      type: 'labelTitle',
      label: 'What would you like to export from rdbms ?',
    },
    { fieldId: 'rdbms.query' },
    { fieldId: 'type' },

    {
      fieldId: 'rdbms.once.query',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },

    {
      fieldId: 'exportRdbmsSampleData',
      type: 'labelTitle',
      label: 'Sample Data',
    },
    { fieldId: 'sampleData' },

    { fieldId: 'ftp.exportTransformRecords' },
    { fieldId: 'transform.expression.rules' },
    { fieldId: 'ftp.exportHooks' },
    { formId: 'hooks' },
  ],
  fieldSets: [
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ fieldId: 'pageSize' }, { fieldId: 'dataURITemplate' }],
    },
  ],
};

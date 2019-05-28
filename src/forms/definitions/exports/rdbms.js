export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportRdbmsData',
      type: 'labeltitle',
      label: 'What would you like to export from rdbms ?',
    },
    { fieldId: 'rdbms.query' },
    { fieldId: 'allConnectionsExportType' },
    {
      fieldId: 'rdbms.once.query',
      visibleWhen: [
        {
          field: 'allConnectionsExportType',
          is: ['once'],
        },
      ],
    },

    {
      fieldId: 'exportRdbmsSampleData',
      type: 'labeltitle',
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

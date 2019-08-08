export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportRdbmsData',
      type: 'labeltitle',
      label: 'What would you like to export from rdbms?',
    },
    { fieldId: 'rdbms.query' },

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
            { label: 'Once', value: 'once' },
          ],
        },
      ],
    },
    {
      fieldId: 'rdbms.once.query',
    },
  ],
  fieldSets: [
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
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};

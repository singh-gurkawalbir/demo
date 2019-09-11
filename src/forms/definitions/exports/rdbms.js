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
      required: true,
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
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
  ],
  fieldSets: [
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
      collapsed: true,
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};

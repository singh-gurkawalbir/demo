export default {
  fields: [
    { formId: 'common' },
    { fieldId: 'exportData' },
    { fieldId: 'mongodb.collection' },
    { fieldId: 'mongodb.filter' },
    { fieldId: 'mongodb.projection' },
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
    { fieldId: 'delta.dateField' },
    {
      fieldId: 'once.booleanField',
      type: 'text',
      label: 'Once Boolean Field',
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

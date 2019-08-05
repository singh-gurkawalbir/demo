export default {
  fields: [
    { formId: 'common' },
    { fieldId: 'exportData' },
    { fieldId: 'wrapper.function' },
    { fieldId: 'wrapper.configuration' },
    { fieldId: 'type' },
    { fieldId: 'delta.dateField' },
    { fieldId: 'once.booleanField' },
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

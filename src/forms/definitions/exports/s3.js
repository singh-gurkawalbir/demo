export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    { fieldId: 's3.region' },
    { fieldId: 's3.bucket' },
    { fieldId: 'file.output' },
    { fieldId: 's3.keyStartsWith' },
    { fieldId: 's3.keyEndsWith' },
    { formId: 'file' },
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
      fields: [{ formId: 'fileAdvancedSettings' }],
    },
  ],
};

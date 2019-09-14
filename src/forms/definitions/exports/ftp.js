export default {
  fields: [
    { formId: 'common' },
    {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    { fieldId: 'ftp.directoryPath' },
    { fieldId: 'file.output' },
    { fieldId: 'ftp.fileNameStartsWith' },
    { fieldId: 'ftp.fileNameEndsWith' },
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

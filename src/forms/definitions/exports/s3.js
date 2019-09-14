export default {
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    'file.output': { fieldId: 'file.output' },
    's3.keyStartsWith': { fieldId: 's3.keyStartsWith' },
    's3.keyEndsWith': { fieldId: 's3.keyEndsWith' },
    file: { formId: 'file' },
    'transform.expression.rules': { fieldId: 'transform.expression.rules' },
    hooks: { formId: 'hooks' },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      's3.region',
      's3.bucket',
      'file.output',
      's3.keyStartsWith',
      's3.keyEndsWith',
      'file',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Would you like to transform the records?',
        fields: ['transform.expression.rules'],
      },
      {
        collapsed: true,
        label: 'Hooks (Optional, Developers Only)',
        fields: ['hooks'],
      },
      { collapsed: true, label: 'Advanced', fields: ['fileAdvancedSettings'] },
    ],
  },
};

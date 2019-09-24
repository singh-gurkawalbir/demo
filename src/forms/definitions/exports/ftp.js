export default {
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'ftp.directoryPath': { fieldId: 'ftp.directoryPath' },
    'file.output': {
      fieldId: 'file.output',
      defaultValue: r => (r && r.file && r.file.output) || 'records',
    },
    'ftp.fileNameStartsWith': { fieldId: 'ftp.fileNameStartsWith' },
    'ftp.fileNameEndsWith': { fieldId: 'ftp.fileNameEndsWith' },
    file: { formId: 'file' },
    transform: { fieldId: 'transform' },
    hooks: { formId: 'hooks' },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      'ftp.directoryPath',
      'file.output',
      'ftp.fileNameStartsWith',
      'ftp.fileNameEndsWith',
      'file',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Would you like to transform the records?',
        fields: ['transform'],
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

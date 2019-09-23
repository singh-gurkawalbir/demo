export default {
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'file.fileDefinition.resourcePath': {
      fieldId: 'file.fileDefinition.resourcePath',
    },
    'transform.expression.rules': { fieldId: 'transform.expression.rules' },
    hooks: { formId: 'hooks' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: ['common', 'exportData', 'file.fileDefinition.resourcePath'],
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
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

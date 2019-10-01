export default {
  init: fieldMeta => {
    const fileDefinitionRulesField =
      fieldMeta.fieldMap['file.filedefinition.rules'];

    if (!fileDefinitionRulesField.userDefinitionId) {
      // In Export creation mode, delete generic visibleWhenAll rules
      // Add custom visible when rules
      delete fileDefinitionRulesField.visibleWhenAll;
      fileDefinitionRulesField.visibleWhen = [
        {
          field: 'edix12.format',
          isNot: [''],
        },
        {
          field: 'fixed.format',
          isNot: [''],
        },
        {
          field: 'edifact.format',
          isNot: [''],
        },
      ];
    }

    return fieldMeta;
  },
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
    rawData: { fieldId: 'rawData' },
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
      'rawData',
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
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'save',
      visibleWhen: [
        {
          field: 'file.type',
          isNot: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
    {
      // Button that saves file defs and then submit resource
      id: 'savedefinition',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
  ],
};

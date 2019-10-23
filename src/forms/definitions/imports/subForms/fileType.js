export default {
  fieldMap: {
    'file.type': { fieldId: 'file.type' },
    'edifact.format': { fieldId: 'edifact.format' },
    'fixed.format': { fieldId: 'fixed.format' },
    'edix12.format': { fieldId: 'edix12.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
      ],
    },
  },
  layout: {
    fields: [
      'file.type',
      'edifact.format',
      'fixed.format',
      'edix12.format',
      'file.filedefinition.rules',
    ],
  },
};

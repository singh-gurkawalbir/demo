export default {
  preSave: formValues => {
    console.log(`formValues`, formValues);
  },
  fieldMap: {
    exportData: { fieldId: 'exportData' },
    'export.salesforce.soql': {
      fieldId: 'export.salesforce.soql',
    },
    advanced: { fieldId: 'advanced' },
    'export.salesforce.soqlErrorMessageField.id': {
      fieldId: 'export.salesforce.soqlErrorMessageField.id',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'exportData',
          'export.salesforce.soql',
          'advanced',
          'export.salesforce.soqlErrorMessageField.id',
        ],
        type: 'collapse',
      },
    ],
  },
};

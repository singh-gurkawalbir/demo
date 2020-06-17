export default {
  preSave: formValues => {
    const newValues = formValues;

    newValues['/export/salesforce/sObjectType'] =
      newValues['/export/salesforce/soql'].entityName;
    delete newValues['/export/salesforce/soql'].entityName;

    if (newValues['/export/salesforce/exportType'] !== 'once') {
      newValues['/export/salesforce/booleanField'] = undefined;
    }

    newValues['/export/salesforce/errorMessageField/id'] =
      newValues['/export/salesforce/soqlErrorMessageField/id'];
    delete newValues['/export/salesforce/soqlErrorMessageField/id'];

    if (newValues['/export/salesforce/exportType'] === 'delta') {
      newValues['/export/salesforce/errorMessageField/id'] = undefined;
    }

    return newValues;
  },
  fieldMap: {
    exportData: { fieldId: 'exportData' },
    'export.salesforce.soql': {
      fieldId: 'export.salesforce.soql',
    },
    'export.salesforce.exportType': { fieldId: 'export.salesforce.exportType' },
    'export.salesforce.booleanField': {
      fieldId: 'export.salesforce.booleanField',
    },
    advanced: {
      fieldId: 'advanced',
      visibleWhenAll: [
        { field: 'export.salesforce.soql', isNot: [''] },
        { field: 'export.salesforce.exportType', isNot: ['delta'] },
      ],
    },
    'export.salesforce.soqlErrorMessageField.id': {
      fieldId: 'export.salesforce.soqlErrorMessageField.id',
      refreshOptionsOnChangesTo: ['export.salesforce.soql'],
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'exportData',
          'export.salesforce.soql',
          'export.salesforce.exportType',
          'export.salesforce.booleanField',
          'advanced',
          'export.salesforce.soqlErrorMessageField.id',
        ],
        type: 'collapse',
      },
    ],
  },
};

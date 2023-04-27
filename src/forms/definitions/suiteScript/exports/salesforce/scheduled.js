export default {
  preSave: formValues => {
    const newValues = formValues;

    newValues['/export/salesforce/sObjectType'] =
      newValues['/export/salesforce/soql'].entityName;
    delete newValues['/export/salesforce/soql'].entityName;

    newValues['/export/salesforce/errorMessageField/id'] =
      newValues['/export/salesforce/soqlErrorMessageField/id'];
    delete newValues['/export/salesforce/soqlErrorMessageField/id'];

    if (newValues['/export/salesforce/exportType'] === 'delta') {
      newValues['/export/salesforce/errorMessageField/id'] = undefined;
    }

    if (newValues['/export/salesforce/exportType'] === 'once') {
      newValues['/export/salesforce/exportType'] = 'exportTypeOnce';
    }

    return newValues;
  },
  fieldMap: {
    'export.salesforce.soql': {
      fieldId: 'export.salesforce.soql',
    },
    'export.salesforce.exportType': {
      fieldId: 'export.salesforce.exportType',
    },
    'export.salesforce.booleanField': {
      fieldId: 'export.salesforce.booleanField',
      removeWhen: [{ field: 'export.salesforce.exportType', isNot: ['once'] }],
    },
    'export.salesforce.soqlErrorMessageField.id': {
      fieldId: 'export.salesforce.soqlErrorMessageField.id',
      refreshOptionsOnChangesTo: ['export.salesforce.soql'],
      visibleWhenAll: [
        { field: 'export.salesforce.soql', isNot: [''] },
        { field: 'export.salesforce.exportType', isNot: ['delta'] },
      ],
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'What would you like to export?',
            fields: [
              'export.salesforce.soql',
            ],
          },
          {
            label: 'Configure export type',
            fields: [
              'export.salesforce.exportType',
              'export.salesforce.booleanField',
            ],
          },
          {
            label: 'Advanced',
            fields: [
              'export.salesforce.soqlErrorMessageField.id',
            ],
          },
        ],
      },
    ],
  },
};

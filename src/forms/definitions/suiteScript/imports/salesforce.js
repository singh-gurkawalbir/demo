export default {
  preSave: formValues => {
    const newValues = formValues;
    if (newValues['/import/salesforce/operation'] === 'insert') {
      delete newValues['/import/salesforce/upsert/jsField'];
      delete newValues['/import/salesforce/upsert/externalField'];
      delete newValues['/import/salesforce/update/jsField'];
      delete newValues['/import/salesforce/update/externalField'];
    } else if (newValues['/import/salesforce/operation'] === 'update') {
      delete newValues['/import/salesforce/upsert/jsField'];
      delete newValues['/import/salesforce/upsert/externalField'];
    } else if (newValues['/import/salesforce/operation'] === 'upsert') {
      delete newValues['/import/salesforce/update/jsField'];
      delete newValues['/import/salesforce/update/externalField'];
    }

    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    const salesforceIdField = fields.find(
      field => field.fieldId === 'import.salesforce.salesforceIdField'
    );


    if (fieldId === 'import.salesforce.salesforceIdField') {
      return {
        commMetaPath:
        salesforceIdField &&
          `netsuite/metadata/suitescript/connections/${salesforceIdField.connectionId}/recordTypes/${salesforceIdField.recordType}`,

      };
    }

    return null;
  },
  fieldMap: {
    importData: { fieldId: 'importData' },
    'import.salesforce.sObjectType': {
      fieldId: 'import.salesforce.sObjectType',
    },
    'import.salesforce.operation': {
      fieldId: 'import.salesforce.operation',
    },
    'import.salesforce.update.jsField': {
      fieldId: 'import.salesforce.update.jsField',
    },
    'import.salesforce.update.externalField': {
      fieldId: 'import.salesforce.update.externalField',
    },
    'import.salesforce.upsert.jsField': {
      fieldId: 'import.salesforce.upsert.jsField',
    },
    'import.salesforce.upsert.externalField': {
      fieldId: 'import.salesforce.upsert.externalField',
    },
    'import.salesforce.salesforceIdField': {
      fieldId: 'import.salesforce.salesforceIdField',
    }
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'How would you like the records imported?',
            fields: [
              'import.salesforce.sObjectType',
              'import.salesforce.operation',
              'import.salesforce.update.jsField',
              'import.salesforce.update.externalField',
              'import.salesforce.upsert.jsField',
              'import.salesforce.upsert.externalField',
            ],
            type: 'collapse',
          },
          {
            collapsed: true,
            label: 'Advanced',
            fields: [
              'import.salesforce.salesforceIdField'
            ],
          },
        ],
      },
    ],
  },
};

export default {
  fieldMap: {
    importData: { fieldId: 'importData' },
    'import.salesforce.sObjectType': {
      fieldId: 'import.salesforce.sObjectType',
    },
    'import.salesforce.operation': {
      fieldId: 'import.salesforce.operation',
    },
    'import.salesforce.upsert.externalField': {
      fieldId: 'import.salesforce.upsert.externalField',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'importData',
          'import.salesforce.sObjectType',
          'import.salesforce.operation',
          'import.salesforce.upsert.externalField',
        ],
        type: 'collapse',
      },
    ],
  },
};

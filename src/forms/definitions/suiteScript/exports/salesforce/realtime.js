export default {
  optionsHandler: (fieldId, fields) => {
    const sObjectTypeField = fields.find(
      field => field.fieldId === 'export.salesforce.sObjectType'
    );

    if (
      [
        'export.salesforce.errorMessageField.id',
        'export.salesforce.netsuiteIdField',
      ].includes(fieldId)
    ) {
      return {
        commMetaPath:
          sObjectTypeField &&
          `suitescript/connections/${sObjectTypeField.ssLinkedConnectionId}/connections/${sObjectTypeField.connectionId}/sObjectTypes/${sObjectTypeField.value}?ignoreCache=true`,
        resetValue:
          sObjectTypeField &&
          sObjectTypeField.value !== sObjectTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    exportData: { fieldId: 'exportData' },
    'export.salesforce.sObjectType': {
      fieldId: 'export.salesforce.sObjectType',
    },
    advanced: { fieldId: 'advanced' },
    'export.salesforce.errorMessageField.id': {
      fieldId: 'export.salesforce.errorMessageField.id',
    },
    'export.salesforce.netsuiteIdField': {
      fieldId: 'export.salesforce.netsuiteIdField',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'exportData',
          'export.salesforce.sObjectType',
          'advanced',
          'export.salesforce.errorMessageField.id',
          'export.salesforce.netsuiteIdField',
        ],
        type: 'collapse',
      },
    ],
  },
};

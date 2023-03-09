export default {
  preSave: formValues => {
    const newValues = formValues;

    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    const recordTypeField = fields.find(
      field => field.fieldId === 'export.netsuite.realtime.recordType'
    );

    if (fieldId === 'export.netsuite.realtime.checkboxField') {
      return {
        commMetaPath:
          recordTypeField &&
          `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    'export.netsuite.realtime.recordType': {
      fieldId: 'export.netsuite.realtime.recordType',
    },
    'export.netsuite.realtime.executionContext': {
      fieldId: 'export.netsuite.realtime.executionContext',
    },
    'export.netsuite.realtime.executionType': {
      fieldId: 'export.netsuite.realtime.executionType',
    },
    'export.netsuite.realtime.exportType': {
      fieldId: 'export.netsuite.realtime.exportType',
    },
    'export.netsuite.realtime.checkboxField': {
      fieldId: 'export.netsuite.realtime.checkboxField',
      removeWhen: [{ field: 'export.netsuite.realtime.exportType', is: ['always'] }],

    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'Configure real-time export',
            fields: [
              'export.netsuite.realtime.recordType',
              'export.netsuite.realtime.executionContext',
              'export.netsuite.realtime.executionType',
              'export.netsuite.realtime.exportType',
              'export.netsuite.realtime.checkboxField',
            ],
          }],
      },
    ],
  },
};

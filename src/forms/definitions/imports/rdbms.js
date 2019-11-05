export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'rdbms.query') {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );

      return {
        // we are saving http body in an array. Put correspond to 0th Index,
        // Post correspond to 1st index.
        // We will have 'Launch Query Builder for Insert' and
        // 'Launch Query Buildery for Update' in case user selects Insert or Update Type as 'Insert new Data and Update existing data'
        saveIndex: 0,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'SQL Query Builder'
          fieldId: lookupField.fieldId,
          data: lookupField && lookupField.value,
        },
      };
    }

    return null;
  },

  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'rdbms.lookups': { fieldId: 'rdbms.lookups', visible: false },
    'rdbms.query': {
      fieldId: 'rdbms.query',
    },
    'rdbms.queryType': { fieldId: 'rdbms.queryType' },
    ignoreExisting: {
      fieldId: 'ignoreExisting',
      label: 'Ignore Existing Records',
      visibleWhen: [{ field: 'rdbms.queryType', is: ['INSERT'] }],
    },
    ignoreMissing: {
      fieldId: 'ignoreMissing',
      label: 'Ignore Missing Records',
      visibleWhen: [{ field: 'rdbms.queryType', is: ['UPDATE'] }],
    },
    'rdbms.existingDataId': { fieldId: 'rdbms.existingDataId' },
    dataMappings: { formId: 'dataMappings' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'rdbms.queryType',
      'ignoreExisting',
      'ignoreMissing',
      'rdbms.existingDataId',
      'rdbms.lookups',
      'rdbms.query',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [],
  },
};

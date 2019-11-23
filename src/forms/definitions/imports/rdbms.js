export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'rdbms.query') {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );
      const queryTypeField = fields.find(
        field => field.fieldId === 'rdbms.queryType'
      );

      return {
        queryType: queryTypeField && queryTypeField.value,
        lookups: {
          // passing lookupId fieldId and data since we will be modifying lookups
          //  from 'Manage lookups' option inside 'SQL Query Builder'
          fieldId: lookupField.fieldId,
          data: lookupField && lookupField.value,
        },
      };
    }

    if (fieldId === 'rdbms.existingDataId') {
      const lookupField = fields.find(
        field => field.fieldId === 'rdbms.lookups'
      );
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
        lookups: {
          fieldId: 'rdbms.lookups',
          data:
            (lookupField &&
              Array.isArray(lookupField.value) &&
              lookupField.value) ||
            [],
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
    'rdbms.queryUpdate': {
      fieldId: 'rdbms.queryUpdate',
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
    'rdbms.existingDataId': {
      fieldId: 'rdbms.existingDataId',
      type: 'relativeuriwithlookup',
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['rdbms.lookups', 'name'],
    },
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
      'rdbms.queryUpdate',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [],
  },
};

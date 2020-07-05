export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'import.netsuite.internalIdLookup.expression') {
      const recordTypeField = fields.find(
        field => field.id === 'import.netsuite.recordType'
      );

      return {
        disableFetch: !(recordTypeField && recordTypeField.value),
        commMetaPath: recordTypeField
          ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`
          : '',
        resetValue: [],
      };
    }

    if (fieldId === 'import.netsuite.subrecords') {
      const recordTypeField = fields.find(
        field => field.id === 'import.netsuite.recordType'
      );

      return {
        recordType: recordTypeField && recordTypeField.value,
      };
    }

    return null;
  },
  fieldMap: {
    'import.netsuite.recordType': {
      fieldId: 'import.netsuite.recordType',
    },
    'import.netsuite.operation': { fieldId: 'import.netsuite.operation' },
    'import.netsuite.ignoreExisting': {fieldId: 'import.netsuite.ignoreExisting'},
    'import.netsuite.ignoreMissing': {fieldId: 'import.netsuite.ignoreMissing'},
    'import.netsuite.internalIdLookup.expression': {
      fieldId: 'import.netsuite.internalIdLookup.expression',
      defaultValue: r => JSON.stringify(r?.import?.netsuite?.internalIdLookup?.expression),
    },
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
              'import.netsuite.recordType',
              'import.netsuite.operation',
              'import.netsuite.ignoreExisting',
              'import.netsuite.ignoreMissing',
              'import.netsuite.internalIdLookup.expression',
            ],
          }
        ],
      },
    ],
  },
};

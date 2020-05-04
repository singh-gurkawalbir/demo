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
    importData: { fieldId: 'importData' },
    'import.netsuite.recordType': {
      fieldId: 'import.netsuite.recordType',
    },
    'import.netsuite.operation': { fieldId: 'import.netsuite.operation' },
    'import.netsuite.internalIdLookup.expression': {
      fieldId: 'import.netsuite.internalIdLookup.expression',
      defaultValue: r =>
        r &&
        r.import &&
        r.import.netsuite &&
        r.import.netsuite.internalIdLookup &&
        r.import.netsuite.internalIdLookup.expression &&
        JSON.stringify(r.import.netsuite.internalIdLookup.expression),
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'importData',
          'import.netsuite.recordType',
          'import.netsuite.operation',
          'import.netsuite.internalIdLookup.expression',
        ],
        type: 'collapse',
      },
    ],
  },
};

import { isJsonString } from '../../../../utils/string';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (isJsonString(newValues['/import/netsuite/internalIdLookup/expression'])) {
      newValues['/import/netsuite/internalIdLookup/expression'] = JSON.parse(newValues['/import/netsuite/internalIdLookup/expression']);
    }

    if (!newValues['/import/netsuite/internalIdLookup/expression'] || newValues['/import/netsuite/internalIdLookup/expression'].length === 0) {
      newValues['/import/netsuite/internalIdLookup'] = {};
      delete newValues['/import/netsuite/internalIdLookup/expression'];
    }

    return { ...newValues };
  },
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

    if (fieldId === 'import.netsuite.subRecordImports') {
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
    'import.netsuite.subRecordImports': {
      fieldId: 'import.netsuite.subRecordImports',
      refreshOptionsOnChangesTo: ['import.netsuite.recordType'],
    },
    'import.netsuite.operation': { fieldId: 'import.netsuite.operation' },
    'import.netsuite.ignoreExisting': {fieldId: 'import.netsuite.ignoreExisting'},
    'import.netsuite.ignoreMissing': {fieldId: 'import.netsuite.ignoreMissing'},
    'import.netsuite.internalIdLookup.expression': {
      fieldId: 'import.netsuite.internalIdLookup.expression',
      defaultValue: r => JSON.stringify(r?.import?.netsuite?.internalIdLookup?.expression),
      removeWhenAll: [
        { field: 'import.netsuite.operation', is: ['add'] },
        { field: 'import.netsuite.ignoreExisting', is: [''] },
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
            label: 'How would you like the records imported?',
            fields: [
              'import.netsuite.recordType',
              'import.netsuite.subRecordImports',
              'import.netsuite.operation',
              'import.netsuite.ignoreExisting',
              'import.netsuite.ignoreMissing',
              'import.netsuite.internalIdLookup.expression',
            ],
          },
        ],
      },
    ],
  },
};

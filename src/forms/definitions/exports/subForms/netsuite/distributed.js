export default {
  optionsHandler: (field, fields) => {
    const recordTypeField = fields.find(
      field => field.fieldId === 'netsuite.distributed.recordType'
    );

    if (field === 'netsuite.distributed.sublists') {
      // returns corresponding relative uri path
      return {
        commMetaPath: recordTypeField
          ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/sublists`
          : '',
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    } else if (field === 'netsuite.distributed.qualifier') {
      return {
        commMetaPath: recordTypeField
          ? `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}?includeSelectOptions=true`
          : '',
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    'netsuite.distributed.recordType': {
      fieldId: 'netsuite.distributed.recordType',
    },
    'netsuite.distributed.executionContext': {
      fieldId: 'netsuite.distributed.executionContext',
    },
    'netsuite.distributed.executionType': {
      fieldId: 'netsuite.distributed.executionType',
    },
    'netsuite.distributed.sublists': {
      fieldId: 'netsuite.distributed.sublists',
      refreshOptionsOnChangesTo: ['netsuite.distributed.recordType'],
    },
    'netsuite.distributed.qualifier': {
      fieldId: 'netsuite.distributed.qualifier',
      refreshOptionsOnChangesTo: ['netsuite.distributed.recordType'],
    },
  },
  layout: {
    fields: [
      'netsuite.distributed.recordType',
      'netsuite.distributed.executionContext',
      'netsuite.distributed.executionType',
      'netsuite.distributed.sublists',
      'netsuite.distributed.qualifier',
    ],
  },
};

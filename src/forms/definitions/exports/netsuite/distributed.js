export default {
  optionsHandler: (field, fields) => {
    if (field === 'netsuite.distributed.sublists') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.distributed.recordType'
      );

      // returns corresponding relative uri path
      return {
        commMetaPath: `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/sublists`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    'netsuite.netsuiteExportlabel': { fieldId: 'netsuite.netsuiteExportlabel' },
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
      visibleWhen: [{ field: 'netsuite.distributed.recordType', isNot: [''] }],
    },
    type: { fieldId: 'type', visible: false, defaultValue: 'distributed' },
  },
  layout: {
    fields: [
      'common',
      'netsuite.netsuiteExportlabel',
      'netsuite.distributed.recordType',
      'netsuite.distributed.executionContext',
      'netsuite.distributed.executionType',
      'netsuite.distributed.sublists',
      'type',
    ],
  },
};

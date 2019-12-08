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
    'netsuite.distributed.qualifier': {
      fieldId: 'netsuite.distributed.qualifier',
      refreshOptionsOnChangesTo: ['netsuite.distributed.recordType'],
      visibleWhen: [{ field: 'netsuite.distributed.recordType', isNot: [''] }],
    },
    type: { fieldId: 'type', visible: false, defaultValue: 'distributed' },
    dataURITemplate: {
      fieldId: 'dataURITemplate',
    },
    'netsuite.distributed.forceReload': {
      fieldId: 'netsuite.distributed.forceReload',
    },
  },
  layout: {
    fields: [
      'common',
      'netsuite.netsuiteExportlabel',
      'netsuite.distributed.recordType',
      'netsuite.distributed.executionContext',
      'netsuite.distributed.executionType',
      'netsuite.distributed.sublists',
      'netsuite.distributed.qualifier',
      'type',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['dataURITemplate', 'netsuite.distributed.forceReload'],
      },
    ],
  },
  preSave: formValues => {
    const newValues = formValues;

    try {
      newValues['/netsuite/distributed/qualifier'] = JSON.parse(
        newValues['/netsuite/distributed/qualifier']
      );
    } catch (ex) {
      newValues['/netsuite/distributed/qualifier'] = undefined;
    }

    return newValues;
  },
};

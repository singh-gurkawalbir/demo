export default {
  preSave: formValues => ({
    ...formValues,
    '/netsuite/searches': [
      {
        savedSearchId: formValues['/netsuite/webservices/searchId'],
        recordType: formValues['/netsuite/webservices/recordType'],
        criteria: [],
      },
    ],
  }),

  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite.webservices.searchId') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );
      let record = recordTypeField && recordTypeField.value;

      if (record && record.toLowerCase().indexOf('customrecord') === 0) {
        record = 'customRecord';
      }

      // returns corresponding relative uri path based on recordType selected
      return {
        resourceToFetch:
          recordTypeField &&
          record &&
          `searchMetadata/${recordTypeField.connectionId}?recordType=${record}`,
      };
    }

    if (fieldId === 'delta.dateField' || fieldId === 'once.booleanField') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );
      let record = recordTypeField && recordTypeField.value;

      if (record && record.toLowerCase().indexOf('customrecord') === 0) {
        record = 'customRecord';
      }

      // returns corresponding relative uri path based on recordType selected
      return {
        resourceToFetch:
          recordTypeField &&
          record &&
          `recordMetadata/${recordTypeField.connectionId}?type=export&recordType=${record}`,
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
    'netsuite.webservices.recordType': {
      fieldId: 'netsuite.webservices.recordType',
    },
    'netsuite.webservices.searchId': {
      fieldId: 'netsuite.webservices.searchId',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhen: [{ field: 'netsuite.webservices.recordType', isNot: [''] }],
    },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      defaultValue: r => (r && r.type ? r.type : 'all'),
      required: true,
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
          ],
        },
      ],
    },
    'test.limit': {
      fieldId: 'test.limit',
      defaultValue: 1,
      visible: false,
      validWhen: [{ field: 'type', is: ['test'] }],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'delta.dateField': {
      id: 'delta.dateField',
      label: 'Date field',
      type: 'refreshableselect',
      filterKey: 'dateField',
      required: true,
      placeholder: 'Please select a date field',
      connectionId: r => r && r._connectionId,
      mode: 'webservices',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.webservices.recordType', isNot: [''] },
        { field: 'type', is: ['delta'] },
      ],
    },
    'once.booleanField': {
      id: 'once.booleanField',
      label: 'Boolean Field',
      type: 'refreshableselect',
      placeholder: 'Please select a Boolean field',
      filterKey: 'booleanField',
      required: true,
      connectionId: r => r && r._connectionId,
      mode: 'webservices',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.webservices.recordType', isNot: [''] },
        { field: 'type', is: ['once'] },
      ],
    },
    'netsuite.skipGrouping': { fieldId: 'netsuite.skipGrouping' },
    rawData: { fieldId: 'rawData' },
    transform: { fieldId: 'transform' },
  },
  layout: {
    fields: [
      'common',
      'netsuite.netsuiteExportlabel',
      'netsuite.webservices.recordType',
      'netsuite.webservices.searchId',
      'type',
      'test.limit',
      'delta.lagOffset',
      'delta.dateField',
      'once.booleanField',
      'netsuite.skipGrouping',
      'rawData',
    ],

    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Would you like to transform the records?',
        fields: ['transform'],
      },
    ],
  },
};

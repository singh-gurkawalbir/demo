export default {
  preSubmit: formValues => ({
    ...formValues,
    '/netsuite/searches': [
      {
        savedSearchId: formValues['/netsuite/webservices/searchId'],
        recordType: formValues['/netsuite/webservices/recordType'],
        criteria: [],
      },
    ],
  }),

  fields: [
    { formId: 'common' },
    {
      fieldId: 'netsuite.netsuiteExportlabel',
    },
    {
      fieldId: 'netsuite.webservices.recordType',
    },
    {
      fieldId: 'netsuite.webservices.searchId',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhen: [
        {
          field: 'netsuite.webservices.recordType',
          isNot: [''],
        },
      ],
    },
    {
      fieldId: 'type',
    },
    {
      fieldId: 'delta.lagOffset',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    {
      fieldId: 'delta.dateField',
      mode: 'webservices',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        {
          field: 'netsuite.webservices.recordType',
          isNot: [''],
        },
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    {
      fieldId: 'once.booleanField',
      mode: 'webservices',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        {
          field: 'netsuite.webservices.recordType',
          isNot: [''],
        },
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    {
      fieldId: 'netsuite.skipGrouping',
    },
    // Search Criteria
    // Raw Data
    { fieldId: 'sampleData' },
    // Sample Data
    { fieldId: 'originSampleData' },
    // Filter  Data
    // Advanced
  ],
  fieldSets: [
    {
      header: 'Would you like to transform the records?',
      collapsed: false,
      fields: [{ fieldId: 'transform.expression.rules' }],
    },
  ],
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
};

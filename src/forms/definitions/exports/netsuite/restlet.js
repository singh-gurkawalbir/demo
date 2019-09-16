export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'netsuite.netsuiteExportlabel',
    },
    {
      fieldId: 'netsuite.restlet.recordType',
    },
    {
      fieldId: 'netsuite.restlet.searchId',
    },
    {
      id: 'type',
      type: 'select',
      label: 'Export Type',
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
      defaultValue: r => (r && r.type) || 'all',
    },
    {
      fieldId: 'delta.dateField',
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        {
          field: 'netsuite.restlet.recordType',
          isNot: [''],
        },
        {
          field: 'type',
          is: ['delta'],
        },
      ],
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
      fieldId: 'once.booleanField',
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        {
          field: 'netsuite.restlet.recordType',
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
    { fieldId: 'rawData' },
    // Sample Data
    { fieldId: 'sampleData' },
    //  Transform  Data
    { fieldId: 'transform' },
    // Filter  Data
    // Advanced
  ],
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'delta.dateField' || fieldId === 'once.booleanField') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.restlet.recordType'
      );

      // returns corresponding relative uri path based on recordType selected
      return {
        resourceToFetch:
          recordTypeField &&
          recordTypeField.value &&
          `recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
};

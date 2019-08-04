export default {
  preSubmit: formValues => {
    const newValues = formValues;

    newValues['/netsuite/searches'] = [
      {
        savedSearchId: formValues['/netsuite/webservices/searchId'],
        recordType: formValues['/netsuite/webservices/recordType'],
        criteria: [],
      },
    ];

    newValues['/netsuite/skipGrouping'] = !formValues['/netsuite/skipGrouping'];

    return newValues;
  },

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
      visibleWhen: [
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
      visibleWhen: [
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
    // Sample Data
    //  Tranform  Data
    // Filter  Data
    // Advanced
  ],
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite.webservices.searchId') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );

      // returns corresponding relative uri path based on recordType selected
      return {
        resourceToFetch:
          recordTypeField &&
          `searchMetadata/${recordTypeField.connectionId}?recordType=${recordTypeField.value}`,
      };
    }

    if (fieldId === 'delta.dateField' || fieldId === 'once.booleanField') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );

      // returns corresponding relative uri path based on recordType selected
      return {
        resourceToFetch:
          recordTypeField &&
          `recordMetadata/${recordTypeField.connectionId}?type=export&recordType=${recordTypeField.value}`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
};

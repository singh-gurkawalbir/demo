export default {
  preSubmit: formValues => ({
    ...formValues,
    '/netsuite/skipGrouping': !formValues['/netsuite/skipGrouping'],
  }),
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
    // {
    //   fieldId: 'netsuite.restlet.searchType',
    // },
    // {
    //   fieldId: 'netsuite.restlet.searchId',
    //   visibleWhen: [
    //     {
    //       field: 'netsuite.restlet.searchType',
    //       is: ['public'],
    //     },
    //   ],
    // },
    // {
    //   fieldId: 'netsuite.restlet.searchInternalId',
    //   visibleWhen: [
    //     {
    //       field: 'netsuite.restlet.searchType',
    //       is: ['private'],
    //     },
    //   ],
    // },
    {
      fieldId: 'type',
    },
    {
      fieldId: 'delta.dateField',
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhen: [
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
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    {
      fieldId: 'netsuite.skipGrouping',
      defaultValue: r => !(r.netsuite && r.netsuite.skipGrouping),
    },
    // Search Criteria
    // Sample Data
    //  Tranform  Data
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
          `recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
};

export default {
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
  fieldMap: {
    common: { formId: 'common' },
    'netsuite.netsuiteExportlabel': { fieldId: 'netsuite.netsuiteExportlabel' },
    'netsuite.restlet.recordType': { fieldId: 'netsuite.restlet.recordType' },
    'netsuite.restlet.searchId': { fieldId: 'netsuite.restlet.searchId' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      required: true,
      defaultValue: r => (r && r.type ? r.type : 'all'),
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
          ],
        },
      ],
    },
    'delta.dateField': {
      fieldId: 'delta.dateField',
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'type', is: ['delta'] },
      ],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'type', is: ['once'] },
      ],
    },
    'netsuite.skipGrouping': { fieldId: 'netsuite.skipGrouping' },
    'transform.expression.rules': { fieldId: 'transform.expression.rules' },
  },
  layout: {
    fields: [
      'common',
      'netsuite.netsuiteExportlabel',
      'netsuite.restlet.recordType',
      'netsuite.restlet.searchId',
      'type',
      'delta.dateField',
      'delta.lagOffset',
      'once.booleanField',
      'netsuite.skipGrouping',
      'transform.expression.rules',
    ],
  },
};

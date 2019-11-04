export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    return {
      ...retValues,
    };
  },
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
    'delta.dateField': {
      id: 'delta.dateField',
      label: 'Date field',
      type: 'refreshableselect',
      mode: 'suitescript',
      filterKey: 'dateField',
      required: true,
      placeholder: 'Please select a date field',
      connectionId: r => r && r._connectionId,
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
      id: 'once.booleanField',
      label: 'Boolean Field',
      type: 'refreshableselect',
      placeholder: 'Please select a Boolean field',
      mode: 'suitescript',
      filterKey: 'booleanField',
      required: true,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'type', is: ['once'] },
      ],
    },
    'netsuite.skipGrouping': { fieldId: 'netsuite.skipGrouping' },
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
    ],
    type: 'collapse',
    containers: [],
  },
};

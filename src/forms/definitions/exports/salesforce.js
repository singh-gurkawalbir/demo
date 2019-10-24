export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    if (retValues['/salesforce/executionType'] === 'scheduled') {
      retValues['/salesforce/type'] = 'soql';
      retValues['/salesforce/api'] = 'rest';
    } else if (retValues['/salesforce/executionType'] === 'realtime') {
      retValues['/type'] = 'distributed';
    }

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    'salesforce.executionType': { fieldId: 'salesforce.executionType' },
    exportData: {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to export from Salesforce?',
      visibleWhen: [
        { field: 'salesforce.executionType', is: ['scheduled', 'realtime'] },
      ],
    },
    'salesforce.soql.query': { fieldId: 'salesforce.soql.query' },
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
      visibleWhen: [{ field: 'salesforce.executionType', is: ['scheduled'] }],
    },
    'delta.dateField': {
      id: 'delta.dateField',
      label: 'Date Field',
      required: true,
      type: 'text',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    'delta.lagOffset': {
      id: 'delta.lagOffset',
      label: 'Offset',
      type: 'text',
      visibleWhen: [
        {
          field: 'type',
          is: ['delta'],
        },
      ],
    },
    'once.booleanField': {
      id: 'once.booleanField',
      label: 'Boolean Field',
      required: true,
      type: 'text',
      visibleWhen: [
        {
          field: 'type',
          is: ['once'],
        },
      ],
    },
    'salesforce.sObjectType': { fieldId: 'salesforce.sObjectType' },
    'salesforce.distributed.requiredTrigger': {
      fieldId: 'salesforce.distributed.requiredTrigger',
    },
    'salesforce.distributed.referencedFields': {
      fieldId: 'salesforce.distributed.referencedFields',
    },
    'salesforce.distributed.relatedLists.referencedFields': {
      fieldId: 'salesforce.distributed.relatedLists.referencedFields',
    },
    'salesforce.distributed.qualifier': {
      fieldId: 'salesforce.distributed.qualifier',
    },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'salesforce.executionType',
      'exportData',
      'salesforce.soql.query',
      'type',
      'delta.dateField',
      'delta.lagOffset',
      'once.booleanField',
      'salesforce.sObjectType',
      'salesforce.distributed.requiredTrigger',
      'salesforce.distributed.referencedFields',
      'salesforce.distributed.relatedLists.referencedFields',
      'salesforce.distributed.qualifier',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

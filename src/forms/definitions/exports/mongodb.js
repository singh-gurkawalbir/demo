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
      '/mongodb/method': 'find',
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'mongodb.collection': { fieldId: 'mongodb.collection' },
    'mongodb.filter': { fieldId: 'mongodb.filter' },
    'mongodb.projection': { fieldId: 'mongodb.projection' },
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
      fieldId: 'delta.dateField',
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
    },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      'mongodb.collection',
      'mongodb.filter',
      'mongodb.projection',
      'type',
      'delta.dateField',
      'once.booleanField',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

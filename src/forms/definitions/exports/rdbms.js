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
  fieldMap: {
    common: { formId: 'common' },
    exportRdbmsData: {
      fieldId: 'exportRdbmsData',
      type: 'labeltitle',
      label: 'What would you like to export from rdbms?',
    },
    'rdbms.query': { fieldId: 'rdbms.query' },
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
    'rdbms.once.query': {
      fieldId: 'rdbms.once.query',
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    rawData: { fieldId: 'rawData' },
    transform: { fieldId: 'transform' },
    hooks: { formId: 'hooks' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'exportRdbmsData',
      'rdbms.query',
      'type',
      'rdbms.once.query',
      'rawData',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Would you like to transform the records?',
        fields: ['transform'],
      },
      {
        collapsed: true,
        label: 'Hooks (Optional, Developers Only)',
        fields: ['hooks'],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
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
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
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
    advancedSettings: { formId: 'advancedSettings' },
    exportOneToMany: { formId: 'exportOneToMany' },
    exportPanel: {
      fieldId: 'exportPanel',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'common',
          'exportOneToMany',
          'exportRdbmsData',
          'rdbms.query',
          'type',
          'rdbms.once.query',
        ],
        type: 'collapse',
        containers: [
          { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
        ],
      },
      {
        fields: ['exportPanel'],
      },
    ],
  },
};

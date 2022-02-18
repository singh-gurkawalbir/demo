import { isNewId } from '../../../../utils/resource';

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
    'rdbms.query': { fieldId: 'rdbms.query' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export type',
      helpKey: 'export.bigquery.type',
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
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Test – export only 1 record', value: 'test' },
          ],
        },
      ],
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'exportOneToMany'] },
      {
        collapsed: true,
        label: 'What would you like to export?',
        fields: ['rdbms.query'],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: ['type'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};

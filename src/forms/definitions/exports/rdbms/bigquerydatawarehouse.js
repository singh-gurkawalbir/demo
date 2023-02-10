import { isNewId } from '../../../../utils/resource';
import { safeParse } from '../../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    } else if (retValues['/type'] === 'test') {
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/rdbms/once'] = undefined;
      delete retValues['/rdbms/once/query'];
    }
    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

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
      isLoggable: true,
      helpKey: 'export.bigquery.type',
      defaultValue: r => {
        if (isNewId(r._id)) return '';

        return r?.type || 'all';
      },
      required: true,
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Limit – export a set number of records', value: 'test' },
          ],
        },
      ],
    },
    'test.limit': {fieldId: 'test.limit'},
    rdbmsGrouping: {formId: 'rdbmsGrouping'},
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: { formId: 'advancedSettings' },
    mockOutput: {fieldId: 'mockOutput'},
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
        fields: ['type', 'test.limit'],
      },
      {
        collapsed: true,
        label: 'Would you like to group records?',
        fields: ['rdbmsGrouping'],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['advancedSettings'],
      },
    ],
  },
};

import { isNewId } from '../../../utils/resource';
import { safeParse } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
    }
    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    'wrapper.function': { fieldId: 'wrapper.function' },
    'wrapper.configuration': { fieldId: 'wrapper.configuration', removeWhen: [{field: 'wrapper.configuration', is: ['']}] },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export type',
      isLoggable: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      required: true,
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Limit – export a set number of records', value: 'test' },
          ],
        },
      ],
      removeWhen: [{field: 'type', is: ['all']}],
    },
    'test.limit': {fieldId: 'test.limit', deleteWhen: [{field: 'type', is: ['all', 'delta', 'once']}]},
    'delta.dateField': {
      fieldId: 'delta.dateField',
      deleteWhen: [{field: 'type', is: ['all', 'test', 'once']}],
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
      deleteWhen: [{field: 'type', is: ['all', 'test', 'delta']}],
    },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: { formId: 'advancedSettings' },
    mockOutput: {fieldId: 'mockOutput'},
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'exportOneToMany'],
      },
      {
        collapsed: true,
        label: 'What would you like to export?',
        fields: ['wrapper.function', 'wrapper.configuration'],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: ['type', 'test.limit', 'delta.dateField', 'once.booleanField'],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};

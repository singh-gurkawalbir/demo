import { isNewId } from '../../../utils/resource';
import { safeParse } from '../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/wrapper/configuration'] === '') {
      retValues['/wrapper/configuration'] = undefined;
    }

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateField'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'test') {
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      delete retValues['/delta/dateField'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateField'];
    }
    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    'wrapper.function': { fieldId: 'wrapper.function' },
    'wrapper.configuration': { fieldId: 'wrapper.configuration' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export type',
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
    },
    'test.limit': {fieldId: 'test.limit'},
    'delta.dateField': {
      fieldId: 'delta.dateField',
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
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

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
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'wrapper.function': { fieldId: 'wrapper.function' },
    'wrapper.configuration': { fieldId: 'wrapper.configuration' },
    type: { fieldId: 'type' },
    'delta.dateField': { fieldId: 'delta.dateField' },
    'once.booleanField': { fieldId: 'once.booleanField' },
    'transform.expression.rules': { fieldId: 'transform.expression.rules' },
    hooks: { formId: 'hooks' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'exportData',
      'wrapper.function',
      'wrapper.configuration',
      'type',
      'delta.dateField',
      'once.booleanField',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Would you like to transform the records?',
        fields: ['transform.expression.rules'],
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

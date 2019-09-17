export default {
  preSubmit: formValues => {
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
  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    { fieldId: 'wrapper.function' },
    { fieldId: 'wrapper.configuration' },
    { fieldId: 'type' },
    { fieldId: 'delta.dateField' },
    { fieldId: 'once.booleanField' },
  ],
  fieldSets: [
    {
      header: 'Would you like to transform the records?',
      collapsed: true,
      fields: [{ fieldId: 'transform.expression.rules' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: true,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};

export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'mysql',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'type',
      defaultValue: r => {
        let rdbmsSubType;

        if (r && r.type === 'rdbms') {
          rdbmsSubType = r.rdbms.type;
        } else {
          rdbmsSubType = r.type;
        }

        return rdbmsSubType;
      },
    },
    {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode:',
      defaultValue: 'cloud',
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onpremise' },
          ],
        },
      ],
    },
    {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    { formId: 'rdbmsFields' },
    { fieldId: 'rdbms.port' },
    { id: 'rdbms.useSSL', type: 'checkbox', label: 'Use SSL' },
    {
      fieldId: 'rdbms.ssl.ca',
      visibleWhen: [
        {
          field: 'rdbms.useSSL',
          is: [true],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'rdbmsAdvanced' }],
    },
  ],
};

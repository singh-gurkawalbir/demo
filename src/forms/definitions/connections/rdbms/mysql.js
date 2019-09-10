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
        let rdbmsConnSubType;

        if (r && r.type === 'rdbms') {
          rdbmsConnSubType = r.rdbms.type;
        } else {
          rdbmsConnSubType = r.type;
        }

        return rdbmsConnSubType;
      },
    },
    {
      id: 'connMode',
      type: 'radiogroup',
      label: 'Mode:',
      defaultValue: 'cloud',
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onPremise' },
          ],
        },
      ],
    },
    {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'connMode', is: ['onPremise'] }],
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

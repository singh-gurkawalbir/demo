export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'postgresql',
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
    { fieldId: 'connMode' },
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
    {
      fieldId: 'rdbms.ssl.key',
      visibleWhen: [
        {
          field: 'rdbms.useSSL',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rdbms.ssl.cert',
      visibleWhen: [
        {
          field: 'rdbms.useSSL',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rdbms.ssl.passphrase',
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

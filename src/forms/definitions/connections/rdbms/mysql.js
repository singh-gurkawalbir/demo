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
    { fieldId: 'connMode' },
    {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'connMode', is: ['onPremise'] }],
    },
    { fieldId: 'rdbms.host' },
    { fieldId: 'rdbms.database' },
    { fieldId: 'rdbms.user' },
    { fieldId: 'rdbms.password' },
    { fieldId: 'rdbms.port' },
    { fieldId: 'rdbms.useSSL' },
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
      fields: [
        { fieldId: '_borrowConcurrencyFromConnectionId' },
        { fieldId: 'rdbms.concurrencyLevel' },
      ],
    },
  ],
};

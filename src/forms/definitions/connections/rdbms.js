export default {
  fields: [
    { fieldId: 'name' },
    { fieldId: 'type', someProp: true },
    { fieldId: 'connMode' },
    {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'connMode', is: ['onPremise'] }],
    },
    { fieldId: 'rdbms.host' },
    { fieldId: 'rdbms.port' },

    {
      fieldId: 'rdbms.useSSL',

      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },

    { fieldId: 'rdbms.database' },
    { fieldId: 'rdbms.instanceName' },
    { fieldId: 'rdbms.user' },
    { fieldId: 'rdbms.password' },
    {
      fieldId: 'rdbms.ssl.ca',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },
    {
      fieldId: 'rdbms.ssl.key',
      visibleWhen: [{ field: 'Type', is: ['mysql'] }],
    },
    {
      fieldId: 'rdbms.ssl.passphrase',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },
    {
      fieldId: 'rdbms.ssl.cert',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
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

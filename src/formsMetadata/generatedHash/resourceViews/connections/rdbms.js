export default {
  fields: [
    { id: 'connection.name' },
    { id: 'connection.type' },
    { id: 'connection.connMode' },
    {
      id: 'connection._agentId',
      visibleWhen: [{ field: 'connection.connMode', is: ['onPremise'] }],
    },
    { id: 'connection.rdbms.host' },
    { id: 'connection.rdbms.port' },

    {
      id: 'connection.rdbms.useSSL',

      visibleWhen: [{ field: 'connection.type', is: ['mysql'] }],
    },

    { id: 'connection.rdbms.database' },
    { id: 'connection.rdbms.instanceName' },
    { id: 'connection.rdbms.user' },
    { id: 'connection.rdbms.password' },
    {
      id: 'connection.rdbms.ssl.ca',
      visibleWhen: [{ field: 'connection.type', is: ['mysql'] }],
    },
    {
      id: 'connection.rdbms.ssl.key',
      visibleWhen: [{ field: 'connection.Type', is: ['mysql'] }],
    },
    {
      id: 'connection.rdbms.ssl.passphrase',
      visibleWhen: [{ field: 'connection.type', is: ['mysql'] }],
    },
    {
      id: 'connection.rdbms.ssl.cert',
      visibleWhen: [{ field: 'connection.type', is: ['mysql'] }],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { id: 'connection._borrowConcurrencyFromConnectionId' },
        { id: 'connection.rdbms.concurrencyLevel' },
      ],
    },
  ],
};

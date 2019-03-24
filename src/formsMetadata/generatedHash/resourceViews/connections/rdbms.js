export default {
  fields: [
    { id: 'connectionName' },
    { id: 'connectionType' },
    { id: 'connectionConnMode' },
    {
      id: 'connection_agentId',
      visibleWhen: [{ field: 'connectionConnMode', is: ['onPremise'] }],
    },
    { id: 'connectionRdbmsHost' },
    { id: 'connectionRdbmsPort' },

    {
      id: 'connectionRdbmsUseSSL',

      visibleWhen: [{ field: 'connectionType', is: ['mysql'] }],
    },

    { id: 'connectionRdbmsDatabase' },
    { id: 'connectionRdbmsInstanceName' },
    { id: 'connectionRdbmsUser' },
    { id: 'connectionRdbmsPassword' },
    {
      id: 'connectionRdbmsSslCa',
      visibleWhen: [{ field: 'connectionType', is: ['mysql'] }],
    },
    {
      id: 'connectionRdbmsSslKey',
      visibleWhen: [{ field: 'connectionType', is: ['mysql'] }],
    },
    {
      id: 'connectionRdbmsSslPassphrase',
      visibleWhen: [{ field: 'connectionType', is: ['mysql'] }],
    },
    {
      id: 'connectionRdbmsSslCert',
      visibleWhen: [{ field: 'connectionType', is: ['mysql'] }],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { id: ' connection_borrowConcurrencyFromConnectionId' },
        { id: 'connectionRdbmsConcurrencyLevel' },
      ],
    },
  ],
};

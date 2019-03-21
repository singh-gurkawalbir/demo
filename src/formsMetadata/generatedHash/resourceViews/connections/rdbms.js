export default {
  fields: [
    { id: 'connectionName' },
    { id: 'connectionType' },
    { id: 'connectionAssistant' },
    { id: 'connectionRdbmsHost' },
    { id: 'connectionRdbmsPort' },
    { id: 'connectionRdbmsDatabase' },
    { id: 'connectionRdbmsInstanceName' },
    { id: 'connectionRdbmsUser' },
    { id: 'connectionRdbmsPassword' },
    { id: 'connectionRdbmsConcurrencyLevel' },
    { id: 'connectionRdbmsSslCa' },
    { id: 'connectionRdbmsSslKey' },
    { id: 'connectionRdbmsSslPassphrase' },
    { id: 'connectionRdbmsSslCert' },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { id: 'connectionRdbmsSslCa' },
        { id: 'connectionRdbmsSslKey' },
        { id: 'connectionRdbmsSslPassphrase' },
        { id: 'connectionRdbmsSslCert' },
      ],
    },
  ],
};

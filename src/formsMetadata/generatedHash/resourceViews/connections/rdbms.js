export default {
  fields: [
    { id: 'connectionType' },
    { id: 'connectionName' },
    { id: 'connectionAssistant' },
    { id: 'connectionRdbmsHost' },
    { id: 'connectionRdbmsPort' },
    { id: 'connectionRdbmsDatabase' },
    { id: 'connectionRdbmsInstanceName' },
    { id: 'connectionRdbmsUser' },
    { id: 'connectionRdbmsPassword' },
    { id: 'connectionRdbmsConcurrencyLevel' },
  ],
  fieldSets: [
    {
      header: 'ssl',
      collapsed: false,
      fields: [
        { id: 'connectionRdbmsSslCa' },
        { id: 'connectionRdbmsSslKey' },
        { id: 'connectionRdbmsSslPassphrase' },
        { id: 'connectionRdbmsSslCert' },
      ],
    },
  ],
};

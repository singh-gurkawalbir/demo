export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'mssql',
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
    { fieldId: 'rdbms.version' },
    { fieldId: 'rdbms.host' },
    { fieldId: 'rdbms.database' },
    { fieldId: 'rdbms.user' },
    { fieldId: 'rdbms.password' },
    { fieldId: 'rdbms.instanceName' },
    { fieldId: 'rdbms.port' },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { fieldId: '' },
        { fieldId: '_borrowConcurrencyFromConnectionId' },
        { fieldId: 'rdbms.concurrencyLevel' },
      ],
    },
  ],
};

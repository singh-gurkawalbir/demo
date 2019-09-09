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
    {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'connMode', is: ['onPremise'] }],
    },
    { fieldId: 'rdbms.version' },
    { formId: 'rdbmsFields' },
    { fieldId: 'rdbms.instanceName' },
    { fieldId: 'rdbms.port' },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        {
          fieldId: '', // To Do configure properties needs to added.
        },
        { formId: 'rdbmsAdvanced' },
      ],
    },
  ],
};

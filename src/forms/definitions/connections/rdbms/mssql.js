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
        let rdbmsSubType;

        if (r && r.type === 'rdbms') {
          rdbmsSubType = r.rdbms.type;
        } else {
          rdbmsSubType = r.type;
        }

        return rdbmsSubType;
      },
    },
    {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode:',
      defaultValue: 'cloud',
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onpremise' },
          ],
        },
      ],
    },
    {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
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
      fields: [{ formId: 'rdbmsAdvanced' }],
    },
  ],
};

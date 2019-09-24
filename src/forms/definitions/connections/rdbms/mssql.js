export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'mssql',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    type: {
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
    mode: {
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
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    'rdbms.version': { fieldId: 'rdbms.version' },
    rdbmsFields: { formId: 'rdbmsFields' },
    'rdbms.instanceName': { fieldId: 'rdbms.instanceName' },
    'rdbms.port': { fieldId: 'rdbms.port' },
    rdbmsAdvanced: { formId: 'rdbmsAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'type',
      'mode',
      '_agentId',
      'rdbms.version',
      'rdbmsFields',
      'rdbms.instanceName',
      'rdbms.port',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: ['rdbmsAdvanced'],
      },
    ],
  },
};

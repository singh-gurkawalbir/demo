export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'rdbms',
      '/rdbms/type': 'mssql',
    };

    delete newValues['/mode'];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    // type: {
    //   fieldId: 'type',
    //   defaultValue: r => {
    //     let rdbmsSubType;

    //     if (r && r.type === 'rdbms') {
    //       rdbmsSubType = r.rdbms.type;
    //     } else {
    //       rdbmsSubType = r.type;
    //     }

    //     return rdbmsSubType;
    //   },
    // },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-premise', value: 'onpremise' },
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
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
          'mode',
          '_agentId',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'rdbms.version',
          'rdbmsFields',
          'rdbms.instanceName',
          'rdbms.port',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rdbmsAdvanced'],
      },
    ],
  },
};

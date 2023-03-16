export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'rdbms',
      '/rdbms/type': 'mysql',
    };

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
      isLoggable: true,
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-premise', value: 'onpremise' },
          ],
        },
      ],
      delete: true,
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
      removeWhen: [{ field: 'mode', is: ['cloud'] }],
    },
    rdbmsFields: { formId: 'rdbmsFields' },
    'rdbms.port': { fieldId: 'rdbms.port' },
    'rdbms.useSSL': {
      id: 'rdbms.useSSL',
      type: 'checkbox',
      label: 'Use SSL',
      defaultValue: r =>
        r &&
        r.rdbms &&
        r.rdbms.ssl &&
        (r.rdbms.ssl.ca || r.rdbms.ssl.key || r.rdbms.ssl.cert),
    },
    'rdbms.ssl.ca': {
      fieldId: 'rdbms.ssl.ca',
      visibleWhen: [{ field: 'rdbms.useSSL', is: [true] }],
    },
    application: {
      fieldId: 'application',
    },
    rdbmsAdvanced: { formId: 'rdbmsAdvanced' },
    'rdbms.disableStrictSSL': {fieldId: 'rdbms.disableStrictSSL'},
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
          'rdbmsFields',
          'rdbms.port',
          'rdbms.useSSL',
          'rdbms.ssl.ca',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rdbms.disableStrictSSL', 'rdbmsAdvanced'],
      },
    ],
  },
};

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'rdbms',
      '/rdbms/type': 'mysql',
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
            { label: 'On-Premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
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
    rdbmsAdvanced: { formId: 'rdbmsAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'rdbmsFields',
      'rdbms.port',
      'rdbms.useSSL',
      'rdbms.ssl.ca',
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

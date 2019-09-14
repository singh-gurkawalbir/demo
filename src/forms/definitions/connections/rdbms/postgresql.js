export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rdbms',
    '/rdbms/type': 'postgresql',
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
    rdbmsFields: { formId: 'rdbmsFields' },
    'rdbms.port': { fieldId: 'rdbms.port' },
    'rdbms.useSSL': { id: 'rdbms.useSSL', type: 'checkbox', label: 'Use SSL' },
    'rdbms.ssl.ca': {
      fieldId: 'rdbms.ssl.ca',
      visibleWhen: [{ field: 'rdbms.useSSL', is: [true] }],
    },
    'rdbms.ssl.key': {
      fieldId: 'rdbms.ssl.key',
      visibleWhen: [{ field: 'rdbms.useSSL', is: [true] }],
    },
    'rdbms.ssl.cert': {
      fieldId: 'rdbms.ssl.cert',
      visibleWhen: [{ field: 'rdbms.useSSL', is: [true] }],
    },
    'rdbms.ssl.passphrase': {
      fieldId: 'rdbms.ssl.passphrase',
      visibleWhen: [{ field: 'rdbms.useSSL', is: [true] }],
    },
    rdbmsAdvanced: { formId: 'rdbmsAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'type',
      'mode',
      '_agentId',
      'rdbmsFields',
      'rdbms.port',
      'rdbms.useSSL',
      'rdbms.ssl.ca',
      'rdbms.ssl.key',
      'rdbms.ssl.cert',
      'rdbms.ssl.passphrase',
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

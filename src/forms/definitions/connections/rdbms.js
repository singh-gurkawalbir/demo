export default {
  fieldMap: {
    name: { fieldId: 'name' },
    type: { fieldId: 'type', someProp: true },
    connMode: { fieldId: 'connMode' },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'connMode', is: ['onPremise'] }],
    },
    'rdbms.host': { fieldId: 'rdbms.host' },
    'rdbms.port': { fieldId: 'rdbms.port' },
    'rdbms.useSSL': {
      fieldId: 'rdbms.useSSL',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },
    'rdbms.database': { fieldId: 'rdbms.database' },
    'rdbms.instanceName': { fieldId: 'rdbms.instanceName' },
    'rdbms.user': { fieldId: 'rdbms.user' },
    'rdbms.password': { fieldId: 'rdbms.password' },
    'rdbms.ssl.ca': {
      fieldId: 'rdbms.ssl.ca',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },
    'rdbms.ssl.key': {
      fieldId: 'rdbms.ssl.key',
      visibleWhen: [{ field: 'Type', is: ['mysql'] }],
    },
    'rdbms.ssl.passphrase': {
      fieldId: 'rdbms.ssl.passphrase',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },
    'rdbms.ssl.cert': {
      fieldId: 'rdbms.ssl.cert',
      visibleWhen: [{ field: 'type', is: ['mysql'] }],
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel' },
  },
  layout: {
    fields: [
      'name',
      'type',
      'connMode',
      '_agentId',
      'rdbms.host',
      'rdbms.port',
      'rdbms.useSSL',
      'rdbms.database',
      'rdbms.instanceName',
      'rdbms.user',
      'rdbms.password',
      'rdbms.ssl.ca',
      'rdbms.ssl.key',
      'rdbms.ssl.passphrase',
      'rdbms.ssl.cert',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: [
          '_borrowConcurrencyFromConnectionId',
          'rdbms.concurrencyLevel',
        ],
      },
    ],
  },
};

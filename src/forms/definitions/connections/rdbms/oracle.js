export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'rdbms',
      '/rdbms/type': 'oracle',
    };

    delete newValues['/mode'];

    return newValues;
  },

  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : ''),
      options: [
        {
          items: [
            { label: 'On-premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    'rdbms.host': { fieldId: 'rdbms.host' },
    'rdbms.user': {
      fieldId: 'rdbms.user',
    },
    'rdbms.password': {
      fieldId: 'rdbms.password',
    },
    'rdbms.instanceName': { fieldId: 'rdbms.instanceName' },
    'rdbms.port': { fieldId: 'rdbms.port' },
    'rdbms.serviceName': {
      id: 'rdbms.serviceName',
      type: 'text',
      label: 'Service Name',
    },
    'rdbms.oracle.serviceType': {
      id: 'rdbms.oracle.serviceType',
      type: 'select',
      label: 'Service Type',
      options: [
        {
          items: [
            {label: 'Dedicated', value: 'dedicated'},
            {label: 'Shared', value: 'shared'},
            {label: 'Pooled', value: 'pooled'},
          ],
        },
      ],
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    application: {
      fieldId: 'application',
    },
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel' },
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
          'rdbms.host',
          'rdbms.user',
          'rdbms.password',
          'rdbms.instanceName',
          'rdbms.port',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'rdbms.serviceName',
          'rdbms.oracle.serviceType',
          '_borrowConcurrencyFromConnectionId',
          'rdbms.concurrencyLevel',
        ],
      },
    ],
  },
};

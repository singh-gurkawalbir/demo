export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/mongodb/host'] = [newValues['/mongodb/host']];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
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
    'mongodb.host': { fieldId: 'mongodb.host' },
    'mongodb.database': { fieldId: 'mongodb.database' },
    'mongodb.username': { fieldId: 'mongodb.username' },
    'mongodb.password': { fieldId: 'mongodb.password' },
    'mongodb.replicaSet': { fieldId: 'mongodb.replicaSet' },
    'mongodb.ssl': { fieldId: 'mongodb.ssl' },
    'mongodb.authSource': { fieldId: 'mongodb.authSource' },
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
          'mongodb.host',
          'mongodb.database',
          'mongodb.username',
          'mongodb.password',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['mongodb.replicaSet', 'mongodb.ssl', 'mongodb.authSource'],
      },
    ],
  },
};

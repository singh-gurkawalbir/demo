export default {
  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      omitWhenValueIs: [undefined, '', 'cloud', 'onpremise'],
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
    'mongodb.host': { fieldId: 'mongodb.host' },
    'mongodb.database': { fieldId: 'mongodb.database' },
    'mongodb.username': { fieldId: 'mongodb.username' },
    'mongodb.password': { fieldId: 'mongodb.password' },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'mongodb.host',
      'mongodb.database',
      'mongodb.username',
      'mongodb.password',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: ['_borrowConcurrencyFromConnectionId'],
      },
    ],
  },
};

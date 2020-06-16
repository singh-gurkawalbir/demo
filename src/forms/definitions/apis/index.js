export default {
  fieldMap: {
    name: {
      id: 'name',
      name: '/name',
      defaultValue: r => r.name,
      type: 'text',
      label: 'Name',
      required: true,
    },
    description: {
      id: 'description',
      name: '/description',
      defaultValue: r => r.description,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
    },
    script: {
      id: 'script',
      name: '/script',
      defaultValue: r => r.script,
      type: 'hook',
      hookType: 'script',
      label: 'Script',
    },
    enableShipworksAuthentication: {
      id: 'enableShipworksAuthentication',
      name: '/enableShipworksAuthentication',
      defaultValue: r => r.enableShipworksAuthentication,
      type: 'checkbox',
      label: 'Enable Shipworks Authentication',
    },
    username: {
      id: 'username',
      name: '/username',
      defaultValue: r => r.username,
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Username',
      requiredWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
    },
    password: {
      id: 'password',
      name: '/password',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      requiredWhen: [
        {
          field: 'enableShipworksAuthentication',
          is: [true],
        },
      ],
    }
  },
  layout: {
    fields: ['name', 'description', 'script'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: [
          'enableShipworksAuthentication',
          'username',
          'password'
        ],
      },
    ],
  },
};

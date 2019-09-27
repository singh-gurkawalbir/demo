export default {
  name: {
    type: 'text',
    label: 'Name',
    defaultValue: r => r.name || '',
    required: true,
    helpText:
      'Name your token so that you can easily reference it from other parts of the application.',
  },
  description: {
    type: 'text',
    label: 'Description',
    defaultValue: r => r.description || '',
    helpText:
      'Describe how your token is being used and be sure to mention exactly where your token is being stored externally.',
  },
  autoPurgeAt: {
    type: 'select',
    label: 'Auto Purge Token',
    // TODO dynamic options for connector tokens
    options: [
      {
        items: [
          {
            label: 'Never',
            value: 'never',
          },
          {
            label: '1 Hour',
            value: '3600000', // TODO need to move to usage of moment. Currently cant use modules here.
          },
          {
            label: '4 Hours',
            value: '14400000',
          },
          {
            label: '1 Day',
            value: '86400000',
          },
          {
            label: '4 Days',
            value: '345600000',
          },
          {
            label: '10 Days',
            value: '864000000',
          },
          {
            label: '30 Days',
            value: '2592000000',
          },
        ],
      },
    ],
    helpText: 'Access Level help text',
  },
  fullAccess: {
    type: 'radiogroup',
    label: 'Scope',
    defaultValue: r => (r.fullAccess ? 'true' : 'false'),
    options: [
      {
        items: [
          {
            label: 'Full Access',
            value: 'true',
          },
          {
            label: 'Custom',
            value: 'false',
          },
        ],
      },
    ],
    helpText:
      'Scope is used to define access permissions for your token. Full Access - Full access tokens have unlimited permissions to your integrator.io account. Please be very careful provisioning full access tokens! Custom - Custom scope tokens can be created with only minimal permissions to specific resources in your integrator.io account, and they can only be used to invoke very specific integrator.io APIs (i.e. only the APIs required to import or export data from external applications).',
  },
  _connectionIds: {
    type: 'selectresource',
    resourceType: 'connections',
    label: 'Connections',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    helpText:
      'Select the Connections that this token should provide access to.',
  },
  _exportIds: {
    type: 'selectresource',
    resourceType: 'exports',
    label: 'Exports',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    helpText: 'Select the Exports that this token should provide access to.',
  },
  _importIds: {
    type: 'selectresource',
    resourceType: 'imports',
    label: 'Imports',
    visibleWhen: [
      {
        field: 'fullAccess',
        is: ['false'],
      },
    ],
    helpText: 'Select the Imports that this token should provide access to.',
  },
};

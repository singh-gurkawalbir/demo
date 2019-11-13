export default {
  name: {
    type: 'text',
    label: 'Name',
    defaultValue: r => r.name || '',
    required: true,
  },
  description: {
    type: 'text',
    label: 'Description',
    defaultValue: r => r.description || '',
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
    ignoreEnvironmentFilter: true,
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
    ignoreEnvironmentFilter: true,
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
    ignoreEnvironmentFilter: true,
  },
};

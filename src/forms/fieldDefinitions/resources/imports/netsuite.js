export default {
  'netsuite.operation': {
    type: 'select',
    label: 'NetSuite operation',
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Addupdate', value: 'addupdate' },
          { label: 'Attach', value: 'attach' },
          { label: 'Detach', value: 'detach' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    ],
  },
  'netsuite.blobOperation': {
    type: 'select',
    label: 'NetSuite operation',
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Addupdate', value: 'addupdate' },
          { label: 'Delete', value: 'delete' },
        ],
      },
    ],
  },
  'netsuite.customFieldMetadata': {
    type: 'text',
    label: 'NetSuite custom Field Metadata',
  },
  'netsuite.recordType': {
    type: 'text',
    label: 'NetSuite record Type',
  },
  'netsuite.recordTypeId': {
    type: 'text',
    label: 'NetSuite record Type Id',
  },
  'netsuite.retryUpdateAsAdd': {
    type: 'checkbox',
    label: 'NetSuite retry Update As Add',
    defaultValue: false,
  },
  'netsuite.batchSize': {
    type: 'text',
    label: 'NetSuite batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.internalIdLookup.extract': {
    type: 'text',
    label: 'NetSuite internal Id Lookup extract',
  },
  'netsuite.internalIdLookup.searchField': {
    type: 'text',
    label: 'NetSuite internal Id Lookup search Field',
  },
  'netsuite.internalIdLookup.expression': {
    type: 'text',
    label: 'NetSuite internal Id Lookup expression',
  },
  'netsuite.lookups[*].name': {
    type: 'text',
    label: 'NetSuite lookups[*] name',
  },
  'netsuite.lookups[*].map': {
    type: 'text',
    label: 'NetSuite lookups[*] map',
  },
  'netsuite.lookups[*].default': {
    type: 'text',
    label: 'NetSuite lookups[*] default',
  },
  'netsuite.lookups[*].recordType': {
    type: 'text',
    label: 'NetSuite lookups[*] record Type',
  },
  'netsuite.lookups[*].searchField': {
    type: 'text',
    label: 'NetSuite lookups[*] search Field',
  },
  'netsuite.lookups[*].expression': {
    type: 'text',
    label: 'NetSuite lookups[*] expression',
  },
  'netsuite.lookups[*].resultField': {
    type: 'text',
    label: 'NetSuite lookups[*] result Field',
  },
  'netsuite.lookups[*].includeInactive': {
    type: 'text',
    label: 'NetSuite lookups[*] include Inactive',
  },
  'netsuite.lookups[*].allowFailures': {
    type: 'text',
    label: 'NetSuite lookups[*] allow Failures',
  },
  'netsuite.preferences.ignoreReadOnlyFields': {
    type: 'checkbox',
    label: 'NetSuite preferences ignore Read Only Fields',
    defaultValue: false,
  },
  'netsuite.preferences.warningAsError': {
    type: 'checkbox',
    label: 'NetSuite preferences warning As Error',
    defaultValue: false,
  },
  'netsuite.preferences.skipCustomMetadataRequests': {
    type: 'checkbox',
    label: 'NetSuite preferences skip Custom Metadata Requests',
    defaultValue: false,
  },
};

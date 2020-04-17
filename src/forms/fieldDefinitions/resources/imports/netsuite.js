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
    label: 'NetSuite custom field metadata',
  },
  'netsuite.recordType': {
    type: 'text',
    label: 'NetSuite record type',
  },
  'netsuite.recordTypeId': {
    type: 'text',
    label: 'NetSuite record type id',
  },
  'netsuite.retryUpdateAsAdd': {
    type: 'checkbox',
    label: 'NetSuite retry update as add',
    defaultValue: false,
  },
  'netsuite.batchSize': {
    type: 'text',
    label: 'NetSuite batch size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.internalIdLookup.extract': {
    type: 'text',
    label: 'NetSuite internal id lookup extract',
  },
  'netsuite.internalIdLookup.searchField': {
    type: 'text',
    label: 'NetSuite internal id lookup search field',
  },
  'netsuite.internalIdLookup.expression': {
    type: 'text',
    label: 'NetSuite internal id lookup expression',
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
    label: 'NetSuite lookups[*] record type',
  },
  'netsuite.lookups[*].searchField': {
    type: 'text',
    label: 'NetSuite lookups[*] search field',
  },
  'netsuite.lookups[*].expression': {
    type: 'text',
    label: 'NetSuite lookups[*] expression',
  },
  'netsuite.lookups[*].resultField': {
    type: 'text',
    label: 'NetSuite lookups[*] result field',
  },
  'netsuite.lookups[*].includeInactive': {
    type: 'text',
    label: 'NetSuite lookups[*] include inactive',
  },
  'netsuite.lookups[*].allowFailures': {
    type: 'text',
    label: 'NetSuite lookups[*] allow failures',
  },
  'netsuite.preferences.ignoreReadOnlyFields': {
    type: 'checkbox',
    label: 'NetSuite preferences ignore read only fields',
    defaultValue: false,
  },
  'netsuite.preferences.warningAsError': {
    type: 'checkbox',
    label: 'NetSuite preferences warning as error',
    defaultValue: false,
  },
  'netsuite.preferences.skipCustomMetadataRequests': {
    type: 'checkbox',
    label: 'NetSuite preferences skip custom metadata requests',
    defaultValue: false,
  },
};

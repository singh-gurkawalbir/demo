export default {
  'netsuite.operation': {
    type: 'select',
    label: 'Netsuite operation',
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
  'netsuite.customFieldMetadata': {
    type: 'text',
    label: 'Netsuite custom Field Metadata',
  },
  'netsuite.recordType': {
    type: 'text',
    label: 'Netsuite record Type',
  },
  'netsuite.recordTypeId': {
    type: 'text',
    label: 'Netsuite record Type Id',
  },
  'netsuite.retryUpdateAsAdd': {
    type: 'checkbox',
    label: 'Netsuite retry Update As Add',
    defaultValue: false,
  },
  'netsuite.batchSize': {
    type: 'text',
    label: 'Netsuite batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.internalIdLookup.extract': {
    type: 'text',
    label: 'Netsuite internal Id Lookup extract',
  },
  'netsuite.internalIdLookup.searchField': {
    type: 'text',
    label: 'Netsuite internal Id Lookup search Field',
  },
  'netsuite.internalIdLookup.expression': {
    type: 'text',
    label: 'Netsuite internal Id Lookup expression',
  },
  'netsuite.lookups[*].name': {
    type: 'text',
    label: 'Netsuite lookups[*] name',
  },
  'netsuite.lookups[*].map': {
    type: 'text',
    label: 'Netsuite lookups[*] map',
  },
  'netsuite.lookups[*].default': {
    type: 'text',
    label: 'Netsuite lookups[*] default',
  },
  'netsuite.lookups[*].recordType': {
    type: 'text',
    label: 'Netsuite lookups[*] record Type',
  },
  'netsuite.lookups[*].searchField': {
    type: 'text',
    label: 'Netsuite lookups[*] search Field',
  },
  'netsuite.lookups[*].expression': {
    type: 'text',
    label: 'Netsuite lookups[*] expression',
  },
  'netsuite.lookups[*].resultField': {
    type: 'text',
    label: 'Netsuite lookups[*] result Field',
  },
  'netsuite.lookups[*].includeInactive': {
    type: 'text',
    label: 'Netsuite lookups[*] include Inactive',
  },
  'netsuite.lookups[*].allowFailures': {
    type: 'text',
    label: 'Netsuite lookups[*] allow Failures',
  },
  'netsuite.preferences.ignoreReadOnlyFields': {
    type: 'checkbox',
    label: 'Netsuite preferences ignore Read Only Fields',
    defaultValue: false,
  },
  'netsuite.preferences.warningAsError': {
    type: 'checkbox',
    label: 'Netsuite preferences warning As Error',
    defaultValue: false,
  },
  'netsuite.preferences.skipCustomMetadataRequests': {
    type: 'checkbox',
    label: 'Netsuite preferences skip Custom Metadata Requests',
    defaultValue: false,
  },
  'netsuite.file.name': {
    type: 'text',
    label: 'Netsuite file name',
  },
  'netsuite.file.fileType': {
    type: 'text',
    label: 'Netsuite file file Type',
  },
  'netsuite.file.folder': {
    type: 'text',
    label: 'Netsuite file folder',
  },
  'netsuite.file.internalId': {
    type: 'text',
    label: 'Netsuite file internal Id',
  },
};

export default {
  'netsuite.restlet.searchType': {
    type: 'radiogroup',
    label: 'Saved Search Type',
    options: [
      {
        items: [
          { label: 'Public', value: 'public' },
          { label: 'Private', value: 'private' },
        ],
      },
    ],
  },
  // this should make a call to get resources
  'netsuite.recordType': {
    label: 'Record Type',
    type: 'refreshoptions',
    resourceType: 'recordTypes',
    mode: 'suitescript',
    placeholder: 'Please select a record type',
    connectionId: r => r._connectionId,
  },

  'netsuite.searches.searchId': {
    label: 'Record Type',
    type: 'refreshoptions',
  },
  'netsuite.searches': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Netsuite searches',
    validWhen: [],
  },
  'netsuite.metadata': {
    type: 'text',
    label: 'Netsuite metadata',
  },
  'netsuite.selectoption': {
    type: 'text',
    label: 'Netsuite selectoption',
  },
  'netsuite.customFieldMetadata': {
    type: 'text',
    label: 'Netsuite custom Field Metadata',
  },
  'netsuite.skipGrouping': {
    type: 'checkbox',
    label: 'Netsuite skip Grouping',
  },
  'netsuite.statsOnly': {
    type: 'checkbox',
    label: 'Netsuite stats Only',
  },
  'netsuite.internalId': {
    type: 'text',
    label: 'Netsuite internal Id',
  },
  'netsuite.restlet.recordType': {
    type: 'text',
    label: 'Netsuite restlet record Type',
  },
  'netsuite.restlet.searchId': {
    type: 'text',
    label: 'Netsuite restlet search Id',
  },
  'netsuite.restlet.criteria.field': {
    type: 'text',
    label: 'Netsuite restlet criteria field',
  },
  'netsuite.restlet.criteria.join': {
    type: 'text',
    label: 'Netsuite restlet criteria join',
  },
  'netsuite.restlet.criteria.operator': {
    type: 'text',
    label: 'Netsuite restlet criteria operator',
  },
  'netsuite.restlet.criteria.searchValue': {
    type: 'text',
    label: 'Netsuite restlet criteria search Value',
  },
  'netsuite.restlet.criteria.searchValue2': {
    type: 'text',
    label: 'Netsuite restlet criteria search Value2',
  },
  'netsuite.restlet.batchSize': {
    type: 'text',
    label: 'Netsuite restlet batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.batchSize': {
    type: 'text',
    label: 'Netsuite restlet hooks batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.preSend.fileInternalId': {
    type: 'text',
    label: 'Netsuite restlet hooks pre Send file Internal Id',
  },
  'netsuite.restlet.hooks.preSend.function': {
    type: 'text',
    label: 'Netsuite restlet hooks pre Send function',
  },
  'netsuite.restlet.hooks.preSend.configuration': {
    type: 'text',
    label: 'Netsuite restlet hooks pre Send configuration',
  },
  'netsuite.distributed.recordType': {
    type: 'text',
    label: 'Netsuite distributed record Type',
  },
  'netsuite.distributed.executionContexts': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Netsuite distributed execution Context',
    validWhen: [],
  },
  'netsuite.distributed.disabled': {
    type: 'checkbox',
    label: 'Netsuite distributed disabled',
  },
  'netsuite.distributed.executionTypes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Netsuite distributed execution Type',
    validWhen: [],
  },
  'netsuite.distributed.qualifier': {
    type: 'text',
    label: 'Netsuite distributed qualifier',
  },
  'netsuite.distributed.hooks.preSend.fileInternalId': {
    type: 'text',
    label: 'Netsuite distributed hooks pre Send file Internal Id',
  },
  'netsuite.distributed.hooks.preSend.function': {
    type: 'text',
    label: 'Netsuite distributed hooks pre Send function',
  },
  'netsuite.distributed.hooks.preSend.configuration': {
    type: 'text',
    label: 'Netsuite distributed hooks pre Send configuration',
  },
  'netsuite.distributed.sublists': {
    type: 'text',
    label: 'Netsuite distributed sublists',
  },
  'netsuite.distributed.forceReload': {
    type: 'checkbox',
    label: 'Netsuite distributed force Reload',
  },
  'netsuite.distributed.ioEnvironment': {
    type: 'text',
    label: 'Netsuite distributed io Environment',
  },
  'netsuite.distributed.lastSyncedDate': {
    type: 'text',
    label: 'Netsuite distributed last Synced Date',
  },
  'netsuite.distributed.settings': {
    type: 'text',
    label: 'Netsuite distributed settings',
  },
  'netsuite.getList[].typeId': {
    type: 'text',
    label: 'Netsuite get List type Id',
  },
  'netsuite.getList.internalId': {
    type: 'text',
    label: 'Netsuite get List internal Id',
  },
  'netsuite.getList.externalId': {
    type: 'text',
    label: 'Netsuite get List external Id',
  },
  'netsuite.searchPreferences.bodyFieldsOnly': {
    type: 'checkbox',
    label: 'Netsuite search Preferences body Fields Only',
  },
  'netsuite.searchPreferences.pageSize': {
    type: 'text',
    label: 'Netsuite search Preferences page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.searchPreferences.returnSearchColumns': {
    type: 'checkbox',
    label: 'Netsuite search Preferences return Search Columns',
  },
};

export default {
  // record types
  'netsuite.distributed.recordType': {
    label: 'Record Type',
    mode: 'suitescript',
    defaultValue: r =>
      r.netsuite.distributed && r.netsuite.distributed.recordType,
    required: true,
    type: 'refreshoptions',
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r._connectionId,
  },
  'netsuite.restlet.recordType': {
    label: 'Record Type',
    mode: 'suitescript',
    defaultValue: r => r.netsuite.restlet && r.netsuite.restlet.recordType,
    required: true,
    type: 'refreshoptions',
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r._connectionId,
  },
  'netsuite.webservices.recordType': {
    label: 'Record Type',
    mode: 'webservices',
    defaultValue: r =>
      r.netsuite.searches &&
      r.netsuite.searches[0] &&
      r.netsuite.searches[0].recordType,
    required: true,
    type: 'refreshoptions',
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r._connectionId,
  },
  // execution context
  'netsuite.distributed.executionContext': {
    type: 'multiselect',
    label: 'Execution Context',
    options: [
      {
        items: [
          { label: 'CSV Import', value: 'csvimport' },
          { label: 'Custom Mass Update', value: 'custommassupdate' },
          { label: 'Offline Client', value: 'offlineclient' },
          { label: 'Map/Reduce', value: 'mapreduce' },
          { label: 'Portlet', value: 'portlet' },
          { label: 'Restlet 2.0', value: 'restlet' },
          { label: 'Scheduled', value: 'scheduled' },
          { label: 'Suitelet / Restlet 1.0', value: 'suitelet' },
          { label: 'User Event', value: 'userevent' },
          { label: 'User Interface', value: 'userinterface' },
          { label: 'Web Services', value: 'webservices' },
          { label: 'Web Store', value: 'webstore' },
          { label: 'Workflow', value: 'workflow' },
        ],
      },
    ],
    defaultValue: r =>
      r.netsuite.distributed && r.netsuite.distributed.executionContext,
    required: true,
    helpText:
      'The invited user will have permissions to manage the integrations selected here.',
  },
  // executiontype
  'netsuite.distributed.executionType': {
    type: 'multiselect',
    label: 'Execution Type',
    options: [
      {
        items: [
          { label: 'Create', value: 'create' },
          { label: 'Edit', value: 'edit' },
          { label: 'Delete', value: 'delete' },
          { label: 'Inline Edit', value: 'xedit' },
          { label: 'Approve', value: 'approve' },
          { label: 'Cancel', value: 'cancel' },
          { label: 'Reject', value: 'reject' },
          { label: 'Pack', value: 'pack' },
          { label: 'Ship', value: 'ship' },
          { label: 'DropShip', value: 'dropship' },
          { label: 'Special Order', value: 'specialorder' },
          { label: 'Order Items', value: 'orderitems' },
          { label: 'Pay Bills', value: 'paybills' },
        ],
      },
    ],
    defaultValue: r =>
      r.netsuite.distributed && r.netsuite.distributed.executionType,
    required: true,
    helpText:
      'The invited user will have permissions to manage the integrations selected here.',
  },
  // sublists
  'netsuite.distributed.sublists': {
    label: 'Sublists to Include',
    type: 'refreshoptions',
    resourceType: '',
    mode: 'suitescript',
    multiselect: true,
    placeholder: 'Please select Sublists',
    defaultValue: r =>
      r.netsuite.distributed && r.netsuite.distributed.sublists,
    connectionId: r => r._connectionId,
  },
  // search type
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
    defaultValue: 'public',
  },
  'netsuite.restlet.searchId': {
    type: 'savedsearch',
    label: 'Saved Searches',
    mode: 'suitescript',
    defaultValue: r => r.netsuite.restlet && r.netsuite.restlet.searchId,
    resourceType: 'savedSearches',
    required: true,
    placeholder: 'Please select a saved search',
    connectionId: r => r._connectionId,
  },
  // search id
  'netsuite.restlet.searchId1': {
    label: 'Saved Searches',
    type: 'refreshoptions',
    mode: 'suitescript',
    defaultValue: r => r.netsuite.restlet && r.netsuite.restlet.searchId,
    resourceType: 'savedSearches',
    required: true,
    placeholder: 'Please select a saved search',
    connectionId: r => r._connectionId,
  },
  'netsuite.webservices.searchId': {
    label: 'Saved Searches',
    type: 'refreshoptions',
    resourceType: 'savedSearches',
    required: true,
    placeholder: 'Please select a saved search',
    mode: 'webservices',
    filterKey: 'savedSearches',
    defaultValue: r =>
      r.netsuite.searches &&
      r.netsuite.searches[0] &&
      r.netsuite.searches[0].savedSearchId,
    connectionId: r => r._connectionId,
  },
  // internal id
  'netsuite.restlet.searchInternalId': {
    type: 'text',
    label: 'Saved Search Internal/Script Id',
    defaultValue: r => r.netsuite.restlet && r.netsuite.restlet.searchId,
    required: true,
    visible: false,
  },
  // type
  type: {
    type: 'select',
    label: 'Export Type',
    options: [
      {
        items: [
          { label: 'All', value: 'all' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
          { label: 'Test', value: 'test' },
        ],
      },
    ],
    defaultValue: r => r.type || 'all',
  },
  // date field
  'delta.dateField': {
    label: 'Date field',
    type: 'refreshoptions',
    mode: 'suitescript',
    filterKey: 'dateField',
    defaultValue: r => r.delta && r.delta.dateField,
    required: true,
    placeholder: 'Please select a date field',
    connectionId: r => r._connectionId,
  },
  // lagoffset
  'delta.lagOffset': {
    type: 'text',
    label: 'Offset',
    defaultValue: r => r.delta && r.delta.lagOffset,
    required: true,
  },
  // boolean field
  'once.booleanField': {
    label: 'Boolean Field',
    type: 'refreshoptions',
    placeholder: 'Please select a Boolean field',
    defaultValue: r => r.once && r.once.booleanField,
    mode: 'suitescript',
    filterKey: 'booleanField',
    required: true,
    connectionId: r => r._connectionId,
  },
  // skip grouping
  'netsuite.skipGrouping': {
    type: 'checkbox',
    label: 'Group Rows',
    defaultValue: r => !(r.netsuite && r.netsuite.skipGrouping),
  },

  'netsuite.netsuiteExportlabel': {
    label: 'Would you like to transform the records?',
    type: 'labeltitle',
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

  'netsuite.statsOnly': {
    type: 'checkbox',
    label: 'Netsuite stats Only',
  },
  'netsuite.internalId': {
    type: 'text',
    label: 'Netsuite internal Id',
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
  // 'netsuite.distributed.recordType': {
  //   type: 'text',
  //   label: 'Netsuite distributed record Type',
  // },
  // 'netsuite.distributed.executionContexts': {
  //   type: 'text',
  //   keyName: 'name',
  //   valueName: 'value',
  //   valueType: 'array',
  //   label: 'Netsuite distributed execution Context',
  //   validWhen: [],
  // },
  'netsuite.distributed.disabled': {
    type: 'checkbox',
    label: 'Netsuite distributed disabled',
  },
  // 'netsuite.distributed.executionTypes': {
  //   type: 'text',
  //   keyName: 'name',
  //   valueName: 'value',
  //   valueType: 'array',
  //   label: 'Netsuite distributed execution Type',
  //   validWhen: [],
  // },
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
  // 'netsuite.distributed.sublists': {
  //   type: 'text',
  //   label: 'Netsuite distributed sublists',
  // },
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

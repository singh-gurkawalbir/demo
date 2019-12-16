export default {
  // record types
  'netsuite.distributed.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    visibleWhen: [{ field: 'netsuite.execution.type', is: ['distributed'] }],
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    placeholder: 'Please select a record type',
    helpKey: 'export.netsuite.recordType',
    connectionId: r => r && r._connectionId,
  },
  'netsuite.restlet.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.api.type', is: ['restlet'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
  },
  'netsuite.webservices.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/webservices/connections/${r._connectionId}/recordTypes?recordTypeOnly=true`,
    filterKey: 'webservices-recordTypes',
    placeholder: 'Please select a record type',
    helpKey: 'export.netsuite.searches.recordType',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.api.type', is: ['search'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.searches &&
      r.netsuite.searches[0] &&
      r.netsuite.searches[0].recordType,
  },
  // execution context
  'netsuite.distributed.executionContext': {
    type: 'multiselect',
    label: 'Execution context',
    visibleWhen: [{ field: 'netsuite.execution.type', is: ['distributed'] }],
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
      (r &&
        r.netsuite &&
        r.netsuite.distributed &&
        r.netsuite.distributed.executionContext) || [
        'userinterface',
        'webstore',
      ],
    required: true,
    helpText:
      'The invited user will have permissions to manage the integrations selected here.',
  },
  // executiontype
  'netsuite.distributed.executionType': {
    type: 'multiselect',
    label: 'Execution type',
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
      (r &&
        r.netsuite &&
        r.netsuite.distributed &&
        r.netsuite.distributed.executionType) || ['create', 'edit', 'xedit'],
    required: true,
    visibleWhen: [{ field: 'netsuite.execution.type', is: ['distributed'] }],
    helpText:
      'The invited user will have permissions to manage the integrations selected here.',
  },
  // sublists
  'netsuite.distributed.sublists': {
    label: 'Sublists to include',
    type: 'refreshableselect',
    filterKey: 'suitescript-sublists',
    multiselect: true,
    placeholder: 'Please select Sublists',
    helpKey: 'export.netsuite.sublists',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.distributed.recordType', isNot: [''] },
      { field: 'netsuite.execution.type', is: ['distributed'] },
    ],
  },
  // search id
  'netsuite.restlet.searchId': {
    type: 'nssavedsearch',
    required: true,
    visibleWhenAll: [
      { field: 'netsuite.api.type', is: ['restlet'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/savedSearches`,
    connectionId: r => r && r._connectionId,
  },
  'netsuite.webservices.searchId': {
    label: 'Saved searches',
    type: 'refreshableselect',
    required: true,
    placeholder: 'Please select a saved search',
    filterKey: 'webservices-savedSearches',
    helpKey: 'export.netsuite.searches.searchId',
    visibleWhenAll: [
      { field: 'netsuite.webservices.recordType', isNot: [''] },
      { field: 'netsuite.api.type', is: ['search'] },
      { field: 'netsuite.execution.type', is: ['scheduled'] },
    ],
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.searches &&
      r.netsuite.searches[0] &&
      r.netsuite.searches[0].savedSearchId,
    connectionId: r => r && r._connectionId,
  },
  // type
  type: {
    type: 'select',
    label: 'Export type',
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
    defaultValue: r => (r && r.type) || 'all',
  },
  // skip grouping
  'netsuite.skipGrouping': {
    type: 'checkbox',
    inverse: true,
    label: 'Group rows',
    defaultValue: r => {
      const skipGrouping =
        r && r.netsuite && r.netsuite && r.netsuite.skipGrouping;

      return skipGrouping === undefined ? true : skipGrouping;
    },
  },
  'netsuite.netsuiteExportlabel': {
    label: 'What would you like to export from NetSuite?',
    type: 'labeltitle',
  },
  'netsuite.searches': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'NetSuite searches',
    validWhen: [],
  },
  'netsuite.metadata': {
    type: 'text',
    label: 'NetSuite metadata',
  },
  'netsuite.export.forceReload': {
    type: 'checkbox',
    label: 'Reload Record Before Export',
  },
  'netsuite.selectoption': {
    type: 'text',
    label: 'NetSuite selectoption',
  },
  'netsuite.customFieldMetadata': {
    type: 'text',
    label: 'NetSuite custom Field Metadata',
  },
  'netsuite.statsOnly': {
    type: 'checkbox',
    label: 'NetSuite stats Only',
  },
  'netsuite.internalId': {
    type: 'text',
    required: true,
    label: 'Internal Id',
  },
  'netsuite.blob.purgeFileAfterExport': {
    type: 'checkbox',
    label: 'Purge File After Export',
  },
  'netsuite.restlet.criteria.field': {
    type: 'text',
    label: 'NetSuite restlet criteria field',
  },
  'netsuite.restlet.criteria.join': {
    type: 'text',
    label: 'NetSuite restlet criteria join',
  },
  'netsuite.restlet.criteria.operator': {
    type: 'text',
    label: 'NetSuite restlet criteria operator',
  },
  'netsuite.restlet.criteria.searchValue': {
    type: 'text',
    label: 'NetSuite restlet criteria search Value',
  },
  'netsuite.restlet.criteria.searchValue2': {
    type: 'text',
    label: 'NetSuite restlet criteria search Value2',
  },
  'netsuite.restlet.batchSize': {
    type: 'text',
    label: 'Batch Size Limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.batchSize': {
    type: 'text',
    label: 'NetSuite restlet hooks batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.preSend.fileInternalId': {
    type: 'text',
    label: 'NetSuite restlet hooks pre Send file Internal Id',
  },
  'netsuite.restlet.hooks.preSend.function': {
    type: 'text',
    label: 'NetSuite restlet hooks pre Send function',
  },
  'netsuite.restlet.hooks.preSend.configuration': {
    type: 'text',
    label: 'NetSuite restlet hooks pre Send configuration',
  },
  'netsuite.distributed.disabled': {
    type: 'checkbox',
    label: 'NetSuite distributed disabled',
  },
  'netsuite.distributed.qualifier': {
    label: 'Field Specific Qualification Criteria',
    type: 'netsuitequalifier',
    placeholder: 'Define Qualification Criteria',
    helpKey: 'export.netsuite.qualifier',
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      { field: 'netsuite.distributed.recordType', isNot: [''] },
      { field: 'netsuite.execution.type', is: ['distributed'] },
    ],
  },
  'netsuite.distributed.hooks.preSend.fileInternalId': {
    type: 'text',
    label: 'NetSuite distributed hooks pre Send file Internal Id',
  },
  'netsuite.distributed.hooks.preSend.function': {
    type: 'text',
    label: 'NetSuite distributed hooks pre Send function',
  },
  'netsuite.distributed.hooks.preSend.configuration': {
    type: 'text',
    label: 'NetSuite distributed hooks pre Send configuration',
  },
  'netsuite.distributed.forceReload': {
    type: 'checkbox',
    label: 'Reload Record Before Export',
  },
  'netsuite.distributed.ioEnvironment': {
    type: 'text',
    label: 'NetSuite distributed io Environment',
  },
  'netsuite.distributed.lastSyncedDate': {
    type: 'text',
    label: 'NetSuite distributed last Synced Date',
  },
  'netsuite.distributed.settings': {
    type: 'text',
    label: 'NetSuite distributed settings',
  },
  'netsuite.getList[].typeId': {
    type: 'text',
    label: 'NetSuite get List type Id',
  },
  'netsuite.getList.internalId': {
    type: 'text',
    label: 'NetSuite get List internal Id',
  },
  'netsuite.getList.externalId': {
    type: 'text',
    label: 'NetSuite get List external Id',
  },
  'netsuite.searchPreferences.bodyFieldsOnly': {
    type: 'checkbox',
    label: 'NetSuite search Preferences body Fields Only',
  },
  'netsuite.searchPreferences.pageSize': {
    type: 'text',
    label: 'NetSuite search Preferences page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.searchPreferences.returnSearchColumns': {
    type: 'checkbox',
    label: 'NetSuite search Preferences return Search Columns',
  },
};
